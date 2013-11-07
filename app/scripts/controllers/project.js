angular.module('devtalkApp')
  .controller('ProjectCtrl', function ($scope, $http, $location, $log, $modal) {
  		$scope.users = [];
  		$scope.isEmpty = true;
  		$scope.projectSelected = false;
  		$scope.statusItems = [
  			'New',
  			'In progress',
  			'Completed'
  		];
  		$scope.projectTitle = '';
  		$scope.projectDescription = '';
  		$scope.projectStatus = '';
  		$scope.projectTeam = [];
  		$scope.dueDate = '';

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
		    });

		  $http({
			    	method: 'GET',
			    	url: 'http://geekwise-angularjs.herokuapp.com/darin/projects'
				    }).success(function (data, status, headers, config) {
				    	$scope.projects = data;
				    	$scope.isEmpty = false;
				    }).error(function (data, status, headers, config) {
				      
				    });

			$scope.openProject = function(project) {
				$scope.projectTitle = project.title;
				$scope.projectDescription = project.description;
				$scope.projectStatus = project.status;
				$scope.projectTeam = project.team;
  			$scope.dueDate = project.dueDate;
        $scope.projectSelected = true;

			}

	    $scope.open = function () {

		    var modalInstance = $modal.open({
		      templateUrl: 'newProjectModal.html',
		      controller: ModalInstanceCtrl,
		      backdrop: 'static',
		      windowClass: 'new-project',
		      resolve: {
		        items: function () {
		          return $scope.statusItems;
		        },
		        users: function () {
		        	return $scope.users;
		        }
		      }
		    });

		    modalInstance.result.then(function (project) {
		    	$http({
			    	method: 'POST',
			    	url: 'http://geekwise-angularjs.herokuapp.com/darin/projects',
			    	data : project
				    }).success(function (data, status, headers, config) {
				    	$http({
                method: 'GET',
                url: 'http://geekwise-angularjs.herokuapp.com/darin/projects'
                }).success(function (data, status, headers, config) {
                  $scope.projects = data;
                  $scope.isEmpty = false;
                  $scope.projectTitle = project.title;
                  $scope.projectDescription = project.description;
                  $scope.projectStatus = project.status;
                  $scope.dueDate = project.dueDate;
                  $scope.projectSelected = true;
                  $scope.projectTeam = [];
                  var i;
                  var j;

                  for (i = 0; i < project.team.length; i++) {
                    for (j = 0; j < $scope.users.length; j++) {
                      if (project.team[i] === $scope.users[j].id) {$scope.projectTeam.push($scope.users[j]);} 
                    };
                  };

                }).error(function (data, status, headers, config) {
                  
                });
				    }).error(function (data, status, headers, config) {

				    });
		    });
		  };
  })


var ModalInstanceCtrl = function ($scope, $modalInstance, items, users) {

  $scope.items = items;
  $scope.users = users;

  $scope.projectUsers = [];
  $scope.projectTitle = '';
  $scope.projectDesc = '';
  $scope.selectedItem = 'New';
  
  $scope.selectedUser = users[0];

  $scope.ok = function (projectTitle, projectDesc) {
  	var i;
  	var userList = [];

  	for (i = 0; i < $scope.projectUsers.length; i++) {
  		userList.push($scope.projectUsers[i].id);
  	}

  	var project = {
  		title: projectTitle,
  		description: projectDesc,
  		status: $scope.selectedItem,
  		dueDate: $scope.dt,
  		team: userList
  	};

    $modalInstance.close(project);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.addUser = function(selectedUser) {
  	var i;
  	var duplicateUser = false;

  	for (i = 0; i < $scope.projectUsers.length; i++) {
  		if (selectedUser.id === $scope.projectUsers[i].id) { duplicateUser = true; }
  	}

  	if (!duplicateUser) { $scope.projectUsers.push(selectedUser); }

  	if ($scope.projectUsers.length > 0) {
  		$('#saveProject').removeAttr('disabled');
  		$('#userWarning').removeClass('shown');
  		$('#userWarning').addClass('hidden');
  	} 

  };

  $scope.removeUser = function(userRemove) {
  	var i = 0;

  	for (i = 0; i < $scope.projectUsers.length; i++) {
  		if (userRemove.id === $scope.projectUsers[i].id) { $scope.projectUsers.splice(i, 1); }
  	}

  	if ($scope.projectUsers.length === 0) {
  		$('#saveProject').attr('disabled', 'disabled');
  		$('#userWarning').addClass('shown');
  		$('#userWarning').removeClass('hidden');
  	} 
  }

  // Datepicker stuff

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.showWeeks = true;
  $scope.toggleWeeks = function () {
    $scope.showWeeks = ! $scope.showWeeks;
  };

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = ( $scope.minDate ) ? null : new Date();
  };
  $scope.toggleMin();

  $scope.openDate = function() {
    $timeout(function() {
      $scope.opened = true;
    });
  };

  $scope.dateOptions = {
    'year-format': "'yy'",
    'starting-day': 1
  };

};

