angular.module('devtalkApp').directive('userform', function () {
	return {
		templateUrl: 'views/user_form.html',
		replace: true,
		transclude: true,
		restrict: 'A',
		scope: {}
	}
})