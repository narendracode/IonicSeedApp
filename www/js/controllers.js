angular.module('ionicseedapp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $state ,$timeout,$location,AuthService, AUTH_EVENTS) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

    
  $scope.username = AuthService.username();
  console.log("username: "+$scope.username);
 
  $scope.$on(AUTH_EVENTS.notAuthorized, function(event) {
    var alertPopup = $ionicPopup.alert({
      title: 'Unauthorized!',
      template: 'You are not allowed to access this resource.'
    });
  });
 
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
 

    $scope.logout = function(){
        AuthService.logout();  
        $state.go('home', {}, {reload: true});
    };
 
})
.controller('LoginCtrl',function($scope,$state,$ionicPopup,AuthService){
    $scope.data = {};
    $scope.login = function(data){
        AuthService
        .login(data.username,data.password)
        .then(function(authenticated){
             $state.go('app.browse', {}, {reload: true});
             $scope.setCurrentUsername(data.username);
        },function(err){
            var alertPopup = $ionicPopup.alert({
                title: 'Login Failed',
                template: 'Please check your credentials!'
            });
        })
        ;
    };
    $scope.setCurrentUsername = function(name) {
        $scope.username = name;
    };
    
    $scope.logout = function(){
      AuthService.logout();  
    };
})
.controller('BrowseCtrl',function($scope){
    
})
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
    
});
