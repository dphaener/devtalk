angular.module('devtalkApp')
  .controller('ProjectCtrl', function ($scope, $http, $rootScope, $location) {
  		$scope.users=[];
  		$http({
    	method: 'GET',
    	url: 'http://geekwise-angularjs.herokuapp.com/darin/users'
	    }).success(function (data, status, headers, config) {
	    	var i;
	    	for (i = 0; i < data.length; i++) {
	    		$scope.users.push({
          firstName: data[i].firstName,
          lastName: data[i].lastName,
          nickName: data[i].nickName,
          email: data[i].email,
          id: data[i]._id
	       	});
	    	}
	      $scope.selectedUser = $scope.users[0].id;
	      $scope.loading = false;
	    }).error(function (data, status, headers, config) {
	      $scope.loading = false;
	      $scope.errormessage = true;
	      $scope.error_message = status;
	    });
    
  });