angular.module('devtalkApp')
  .controller('ProjectCtrl', function ($scope, $http, $location, $log, $modal, $routeParams) {
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
      $scope.projectId = '';

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
          for (i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i].id === $routeParams.userId) {
              $scope.currentUser = $scope.users[i];
            };
          };
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
        $scope.projectId = project._id;
        console.log(project._id);
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
                  $scope.projectId = $scope.projects[$scope.projects.length - 1]._id;
                  console.log($scope.projectId);
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

      $scope.convOpen = function () {

        var modalInstance = $modal.open({
          templateUrl: 'newConversationModal.html',
          controller: convModalInstanceCtrl,
          backdrop: 'static',
          resolve: {
            // items: function () {
            //   return $scope.statusItems;
            // },
            // users: function () {
            //   return $scope.users;
            // }
          }
        });

        modalInstance.result.then(function (conversationSubject) {
          $http({
            method: 'POST',
            url: 'http://geekwise-angularjs.herokuapp.com/darin/projects/'+$scope.projectId+'/conversations',
            data: {
              subject: conversationSubject
            }
            }).success(function (data, status, headers, config) {
              $http({
                method: 'GET',
                url: 'http://geekwise-angularjs.herokuapp.com/darin/projects'
                }).success(function (data, status, headers, config) {
                  $scope.projects = data;
                  $scope.isEmpty = false;
                  var i;
                  for (i = 0; i < $scope.projects.length; i++) {
                    if ($scope.projectId === $scope.projects[i]._id) {
                      $scope.projectTitle = $scope.projects[i].title;
                      $scope.projectDescription = $scope.projects[i].description;
                      $scope.projectStatus = $scope.projects[i].status;
                      $scope.dueDate = $scope.projects[i].dueDate;
                      $scope.projectSelected = true;
                      $scope.projectTeam = [];
                      var i;
                      var j;

                      for (i = 0; i < $scope.projects[i].team.length; i++) {
                        for (j = 0; j < $scope.users.length; j++) {
                          if ($scope.projects[i].team[i] === $scope.users[j].id) {$scope.projectTeam.push($scope.users[j]);} 
                        };
                      };
                    };
                  };
                }).error(function (data, status, headers, config) {
                  
                });
            }).error(function (data, status, headers, config) {

            });
        });
      };
  })


var convModalInstanceCtrl = function ($scope, $modalInstance) {

  $scope.conversationSubject = '';

  $scope.ok = function (conversationSubject) {
    $modalInstance.close(conversationSubject);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

};

