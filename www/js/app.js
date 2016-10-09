// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('ionicseedapp', [
                                'ionic'
                                ,'ionicseedapp.constants'
                                ,'ionicseedapp.controllers'
                                ,'ionicseedapp.services'
                               ]
              )

.run(function($ionicPlatform, $rootScope,$state,AuthService,AUTH_EVENTS) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
    
   
$rootScope.$on('$stateChangeStart',function(event,next,nextParams,fromState){
   
    if ('data' in next && 'authorizedRoles' in next.data) {
      var authorizedRoles = next.data.authorizedRoles;
        console.log(" state change start detected auth roles : "+authorizedRoles);
      if (!AuthService.isAuthorized(authorizedRoles)) {
        event.preventDefault();
        $state.go($state.current, {}, {reload: true});
        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
      }
    }
    if (!AuthService.isAuthenticated()) {
      if (next.name !== 'home') {
        event.preventDefault();
        $state.go('home');
      }
    }
    
});
    
    
})

.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
  $stateProvider
   .state('home', {
    url: '/',
    templateUrl: 'templates/home.html',
    controller: 'LoginCtrl'
  })

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

.state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'BrowseCtrl'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
//$urlRouterProvider.otherwise('/');
    $urlRouterProvider.otherwise(function($injector,$location){
        console.log("Other wise is calld ...go to home state");
        var $state = $injector.get('$state');
        $state.go('home');
    });
    
});

