angular.module('ionicseedapp.services', ['ngResource'])
.service('AuthService',function($q,$http,$resource,USER_ROLES){
    var LOCAL_TOKEN_KEY = 'usertoken';
    var username = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;
    var LoginResource = $resource('http://vps308056.ovh.net:3000/auth/login');
    
  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }
 
  function storeUserCredentials(token) {
   // console.log("inside store user credentials token: "+token);
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }
 
  function useCredentials(token) {
    var user = parseToken(token);
    //console.log("User : "+JSON.stringify(user));
    username = user.name;
    var userRole = user.role;
    isAuthenticated = true;
    authToken = token;
 
    if (userRole == 'admin') {
      role = USER_ROLES.admin
    }
    if (userRole == 'user') {
      role = USER_ROLES.public
    }
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['X-Auth-Token'] = token;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    username = '';
    userRole = '';
    isAuthenticated = false;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }
   
  var login = function(name, pw) {
    return $q(function(resolve, reject) {
        
        var loginResource = new LoginResource();
        loginResource.email = 'test@test.com';
	    loginResource.password = 'password';
        loginResource.$save(function(result){
            console.log("result from Login API : "+JSON.stringify(parseToken(result.data.token)));
            
            if((typeof result !== 'undefined') && result.type){
                storeUserCredentials(result.data.token);
                console.log(" resolve is called");
                resolve('Login success.');
            }else{
                console.log("reject is called");
                reject('Login Failed.');
            }

            
        });
        
    /*  if ((name == 'admin' && pw == '1') || (name == 'user' && pw == '1')) {
        storeUserCredentials(name + '.yourServerToken');
        resolve('Login success.');
      } else {
        reject('Login Failed.');
      } 
    */
        
        
        
    });
  };
 
  var logout = function() {
    destroyUserCredentials();
  };
 
  var isAuthorized = function(authorizedRoles) {
      console.log("is authorized is called : "+authorizedRoles)
    if (!angular.isArray(authorizedRoles)) {
      authorizedRoles = [authorizedRoles];
    }
    return (isAuthenticated && authorizedRoles.indexOf(role) !== -1);
  };
  
 loadUserCredentials();

    /* token processing start */
    
    function urlBase64Decode(str) {
      var output = str.replace('-', '+').replace('_', '/');
      switch (output.length % 4) {
          case 0:
              break;
          case 2:
              output += '==';
              break;
          case 3:
              output += '=';
              break;
          default:
              throw 'Illegal base64url string!';
      }
      return window.atob(output);
  }

    function getUserFromToken() {
        var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    }

    function parseToken(token){
        var user = {};
        if(token){
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;  
    }
    /*
        token processing end
    */
    
    return {
    login: login,
    logout: logout,
    isAuthorized: isAuthorized,
    isAuthenticated: function() {return isAuthenticated;},
    username: function() {return username;},
    role: function() {return role;}
  };
    
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
        403: AUTH_EVENTS.notAuthorized
      }[response.status], response);
      return $q.reject(response);
    }
  };
})
 
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});


;