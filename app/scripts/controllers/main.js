'use strict';

angular.module('devtalkApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http({
    	method: 'GET',
    	url: 'http://geekwise-angularjs.herokuapp.com/darin/users'
    }).success(function (data, status, headers, config) {
    	$scope.userNames = [];
    	var i;
    	for (i = 0; i < data.length; i++) {
    		$scope.userNames.push(data[i].firstName + ' ' + data[i].lastName);
    	}
    })
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
