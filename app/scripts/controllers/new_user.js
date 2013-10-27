'use strict';

angular.module('devtalkApp')
  .controller('NewUserCtrl', function ($scope, $http, $location) {

    $scope.firstName = '';
    $scope.lastName = '';
    $scope.nickName = '';
    $scope.email = '';
    $scope.loading = false;
    $scope.errormessage = false;

    $scope.addUser = function () {
      $scope.loading = true;
      if ($scope.firstName === '') {
        $scope.loading = false;
        alert('First name is required!');
        return;
      } else if ($scope.lastName === '') {
        $scope.loading = false;
        alert('Last name is required!');
      } else if ($scope.email === '') {
        $scope.loading = false;
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
          $scope.loading = false;
          alert('New user succesfully added!');
          $location.path('/');
        }).error(function (data, status, headers, config) {
          $scope.loading = false;
          $scope.errormessage = true;
          $scope.error_message = status;
        })
      } 
    }
  });