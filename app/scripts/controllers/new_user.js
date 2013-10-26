'use strict';

angular.module('devtalkApp')
  .controller('NewUserCtrl', function ($scope, $http, $location) {
    $scope.firstName = '';
    $scope.lastName = '';
    $scope.nickName = '';
    $scope.email = '';

    $scope.addUser = function () {
      if ($scope.firstName === '') {
        alert('First name is required!');
        return;
      } else if ($scope.lastName === '') {
        alert('Last name is required!');
      } else if ($scope.email === '') {
        alert('Email is required!');
      } else {
        $http({
          method: 'POST',
          url: 'http://geekwise-angularjs.herokuapp.com/darin/users',
          data: {
            "firstName": $scope.firstName,
            "lastName": $scope.lastName,
            "nickName": $scope.nickName,
            "email": $scope.email
          }
        }).success(function (data, status, headers, config) {
          alert('New user succesfully added!');
          $location.path('/');
        })
      }
    } 
  });