'use strict';

angular.module('devtalkApp')
  .controller('EditUserCtrl', function ($scope, $http, $location, $routeParams) {
    
    $scope.userId = $routeParams.userId;
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
    });

    $scope.saveUser = function () {
      if ($scope.firstName === '') {
        alert('First name is required!');
        return;
      } else if ($scope.lastName === '') {
        alert('Last name is required!');
      } else if ($scope.email === '') {
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
          alert('User data saved!');
          $location.path('/');
        })
      }
    }

    $scope.deleteUser = function () {
      var deleteConfirm = confirm('This cannot be undone. Are you sure?');

      if (deleteConfirm) {
        $http({
          method: 'DELETE',
          url: 'http://geekwise-angularjs.herokuapp.com/darin/users/' + $scope.userId,
        }).success(function (data, status, headers, config) {
          alert('User deleted!');
          $location.path('/');
        })
      }
    }
    
  });