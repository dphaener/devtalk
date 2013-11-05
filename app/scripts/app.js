'use strict';

angular.module('devtalkApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.bootstrap'
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
      .when('/project/:userId', {
        templateUrl: 'views/project.html',
        controller: 'ProjectCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

