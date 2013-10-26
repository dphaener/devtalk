'use strict';

angular.module('devtalkApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/new_user', {
        templateUrl: 'views/new_user.html',
        controller: 'NewUserCtrl'
      })
      .when('/edit_user/:userId', {
        templateUrl: 'views/edit_user.html',
        controller: 'EditUserCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
