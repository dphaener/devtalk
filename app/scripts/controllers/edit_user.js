'use strict';

angular.module('devtalkApp')
  .controller('EditUserCtrl', function ($scope, $http, $location, $routeParams) {
    
    $scope.userId = $routeParams.userId;
    $scope.loading = true
    $scope.firstName = '';
    $scope.lastName = '';
    $scope.nickName = '';
    $scope.email = '';

    $http({
      method: 'GET',
      url: 'http://geekwise-angularjs.herokuapp.com/darin/users/' + $scope.userId
    }).success(function (data, status, headers, config) {
      $scope.firstName = data[0].firstName;
      $scope.lastName = data[0].lastName;
      $scope.nickName = data[0].nickName;
      $scope.email = data[0].email;
      $scope.loading = false;
      $scope.errormessage = false;
    }).error(function (data, status, headers, config) {
      $scope.loading = false;
      $scope.errormessage = true;
      $scope.error_message = status;
    });

    $scope.saveUser = function () {
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
          method: 'PUT',
          url: 'http://geekwise-angularjs.herokuapp.com/darin/users/' + $scope.userId,
          data: {
            "firstName": $scope.firstName,
            "lastName": $scope.lastName,
            "nickName": $scope.nickName,
            "email": $scope.email
          }
        }).success(function (data, status, headers, config) {
          $scope.loading = false;
          alert('User data saved!');
          $location.path('/');
        }).error(function (data, status, headers, config) {
          $scope.loading = false;
          $scope.errormessage = true;
          $scope.error_message = status;
        });
      }
    }

    $scope.deleteUser = function () {
      var deleteConfirm = confirm('This cannot be undone. Are you sure?');
      $scope.loading = true;
      if (deleteConfirm) {
        $http({
          method: 'DELETE',
          url: 'http://geekwise-angularjs.herokuapp.com/darin/users/' + $scope.userId,
        }).success(function (data, status, headers, config) {
          $scope.loading = false;
          alert('User deleted!');
          $location.path('/');
        }).error(function (data, status, headers, config) {
          $scope.loading = false;
          $scope.errormessage = true;
          $scope.error_message = status;
        });
      }
    }
    
  });