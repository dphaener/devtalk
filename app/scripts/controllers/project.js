angular.module('devtalkApp')
  .controller('ProjectCtrl', function ($scope, $http, $rootScope, $location, $modal, $log) {
  		$scope.users = [];
  		$scope.isEmpty = true;
  		$scope.statusItems = [
  			'New',
  			'In progress',
  			'Completed'
  		];
  		$scope.projectUsers = [];

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
	    })
  })
  .directive('projectNew', [function () {
  	return {
  		// priority: 0,
  		// template: '<div></div>',
  		// templateUrl: 'directive.html',
  		// replace: true,
  		// transclude: true,
  		// restrict: 'A',
  		// scope: {},
  		// controller: function($scope, $element, $attrs, $transclude, otherInjectables) {
  
  		// },
  		// compile: function compile(tElement, tAttrs, transclude) {
  		// 	return function postLink(scope, iElement, iAttrs, controller) {
  
  		// 	}
  		// },
  		link: function postLink(scope, iElement, iAttrs) {
  			iElement.dialog({ 
  				autoOpen: false,
  				show: "slide",
  				hide: "slide",
  				width: 700,
  				modal: true
  			});
  		}
  	};
  }])
  .directive('selectUser', [function () {
  	return {
  		link: function postLink(scope, iElement, iAttrs) {
  			iElement.click(function () {
  				scope.$apply(function () {
  					scope.projectUsers.push(scope.selectedUser);
  				})
  			})
  		}
  	};
  }])
  .directive('openDialog', [function () {
  	return {	
  		link: function postLink(scope, iElement, iAttrs) {
  			iElement.click(function () {
  				$("#projectModal").dialog("open");
  			})
  		}
  	};
  }])
  .directive('closeDialog', [function () {
  	return {
  		link: function postLink(scope, iElement, iAttrs) {
 				iElement.click(function () {
 					$("#projectModal").dialog("close");
 				})
  		}
  	};
  }])
