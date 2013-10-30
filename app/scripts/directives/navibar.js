'use strict';

angular.module('devtalkApp')
	.directive('navBar', function () {
		return {
			templateUrl: 'views/navbar.html',
			replace: true,
			transclude: true,
			restrict: 'A',
			scope: {}
		}
	})