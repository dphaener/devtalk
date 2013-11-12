angular.module('devtalkApp')
  .controller('ProjectCtrl', function ($scope, $http, $location, $log, $modal, $routeParams) {
  		$scope.isEmpty = true;
  		$scope.projectSelected = false;
      $scope.pLoading = true;
      $scope.uLoading = true;
      $scope.newConversation = false;
      $scope.isNewMessage = false;
      $scope.isEdit = false;

      $scope.users = [];
      $scope.currentProject = [];

      // Initialize User list

  		$http({
	    	method: 'GET',
	    	url: 'http://geekwise-angularjs.herokuapp.com/darin/users'
		    }).success(function (data, status, headers, config) {
		    	var i;
		    	$scope.users = data;
          for (i = 0; i < $scope.users.length; i++) {
            if ($scope.users[i]._id === $routeParams.userId) {
              $scope.currentUser = $scope.users[i];
            };
          };
		      $scope.uLoading = false;
		    }).error(function (data, status, headers, config) {
		      $scope.uLoading = false;
		      $scope.errormessage = true;
		      $scope.error_message = status;
		    });

      // Initialize project list

		  $http({
			    	method: 'GET',
			    	url: 'http://geekwise-angularjs.herokuapp.com/darin/projects'
				    }).success(function (data, status, headers, config) {
				    	$scope.projects = data;
				    	$scope.isEmpty = false;
              $scope.pLoading = false;
				    }).error(function (data, status, headers, config) {
				      
				    });

      // Open selected project

			$scope.openProject = function(project) {
        $scope.currentProject = project;
        $scope.projectSelected = true;
        $scope.newConversation = false;
        $scope.isNewMessage = false;
			};
      
      // Save the new message

      $scope.saveMessage = function(newMessage, conversation) {
        $scope.uLoading = true;
        $http({
            method: 'POST',
            url: 'http://geekwise-angularjs.herokuapp.com/darin/projects/' + $scope.currentProject._id + '/conversations/' + conversation._id + '/messages',
            data : {
              message: newMessage,
              user: $scope.currentUser._id
            }
            }).success(function (data, status, headers, config) {
              $scope.uLoading = false;
              $scope.pLoading = true;
              $scope.newMessage = '';
              $scope.isNewMessage = false;
              $http({
                method: 'GET',
                url: 'http://geekwise-angularjs.herokuapp.com/darin/projects'
                }).success(function (data, status, headers, config) {
                  $scope.pLoading = false;
                  $scope.projects = data;
                  $scope.isEmpty = false;
                  var i;
                  for (i = 0; i < $scope.projects.length; i++) {
                    if ($scope.currentProject._id === $scope.projects[i]._id) {
                      $scope.currentProject = $scope.projects[i];
                      $scope.projectSelected = true;
                    };
                  };
                }).error(function (data, status, headers, config) {
                  
                });
            }).error(function (data, status, headers, config) {

            });
      };

      // Save the new conversation

      $scope.saveConversation = function (conversationSubject) {
        $scope.uLoading = true;
        $http({
            method: 'POST',
            url: 'http://geekwise-angularjs.herokuapp.com/darin/projects/'+$scope.currentProject._id+'/conversations',
            data: {
              subject: conversationSubject
            }
            }).success(function (data, status, headers, config) {
              $scope.newConversation = false;
              $scope.conversationSubject = '';
              $scope.pLoading = true;
              $scope.uLoading = false;
              $http({
                method: 'GET',
                url: 'http://geekwise-angularjs.herokuapp.com/darin/projects'
              }).success(function (data, status, headers, config) {
                $scope.pLoading = false;
                $scope.projects = data;
                $scope.isEmpty = false;
                var i;
                for (i = 0; i < $scope.projects.length; i++) {
                  if ($scope.currentProject._id === $scope.projects[i]._id) {
                    $scope.currentProject = $scope.projects[i];
                    $scope.projectSelected = true;
                  };
                };
              }).error(function (data, status, headers, config) {
                
              });
            }).error(function (data, status, headers, config) {

            });
      };

      $scope.projectEdit = function (project) {
        $scope.isEdit = true;
        $scope.open(project);
      };

      $scope.projectNew = function (project) {
        $scope.isEdit = false;
        $scope.open(project);
      }

      // New Project Dialog

	    $scope.open = function (project) {

        if (typeof project === 'undefined') {
          var project = {
            title: '',
            description: '',
            status: '',
            dueDate: new Date(),
            team: []
          };
        };

		    var modalInstance = $modal.open({
		      templateUrl: 'views/templates/newProjectModal.html',
		      controller: ModalInstanceCtrl,
		      backdrop: 'static',
		      windowClass: 'new-project',
		      resolve: {
		        users: function () {
		        	return $scope.users;
		        },
            project: function () {
              return project;
            },
            isEdit: function () {
              return $scope.isEdit;
            }
		      }
		    });

		    modalInstance.result.then(function (project) {
          console.log(project.description + project.status);
		    	if (project.isEdit === true) {
            $http({
            method: 'PUT',
            url: 'http://geekwise-angularjs.herokuapp.com/darin/projects/'+project._id,
            data: {
              description: project.description,
              status: project.status
            }
            }).success(function (data, status, headers, config) {
              $scope.pLoading = true;
              $http({
                method: 'GET',
                url: 'http://geekwise-angularjs.herokuapp.com/darin/projects'
                }).success(function (data, status, headers, config) {
                  $scope.projects = data;
                  $scope.isEmpty = false;
                  $scope.pLoading = false;
                  $scope.currentProject = project;
                  $scope.projectSelected = true;
                }).error(function (data, status, headers, config) {
                  
                });
            }).error(function (data, status, headers, config) {

            });
          } else {
            delete project.isEdit;  
            $http({
            method: 'POST',
            url: 'http://geekwise-angularjs.herokuapp.com/darin/projects',
            data : {
              title: project.title,
              description: project.description,
              status: project.status,
              dueDate: project.dueDate,
              team: project.team
            }
            }).success(function (data, status, headers, config) {
              $scope.pLoading = true;
              $http({
                method: 'GET',
                url: 'http://geekwise-angularjs.herokuapp.com/darin/projects'
                }).success(function (data, status, headers, config) {
                  $scope.projects = data;
                  $scope.isEmpty = false;
                  $scope.pLoading = false;
                  $scope.currentProject = project;
                  $scope.projectSelected = true;
                }).error(function (data, status, headers, config) {
                  
                });
            }).error(function (data, status, headers, config) {

            });
          };
		    }, function () {
          $scope.pLoading = true;
          $http({
            method: 'GET',
            url: 'http://geekwise-angularjs.herokuapp.com/darin/projects'
            }).success(function (data, status, headers, config) {
              $scope.projects = data;
              $scope.isEmpty = false;
              $scope.pLoading = false;
              $scope.projectSelected = false;
            }).error(function (data, status, headers, config) {
              
            });
        });
		  };
  })
  .filter('fromNow', function() {
    return function(dateString) {
      return moment(dateString).fromNow()
    };
  })

// Controller for New Project Dialog

var ModalInstanceCtrl = function ($scope, $modalInstance, users, project, isEdit) {

  $scope.isEdit = isEdit;
  $scope.project = project;
  $scope.users = users;
  $scope.items = ['New', 'In Progess', 'Completed'];
  $scope.project.status = $scope.items[0];
  $scope.selectedUser = $scope.users[0];
  
  if ($scope.isEdit === true) {
    $scope.userAbsent = false;
  } else {
    $scope.userAbsent = true;
  };

  $scope.ok = function (project, isEdit) {
    project.isEdit = isEdit;
    $modalInstance.close(project);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.addUser = function (selectedUser) {
    var i;

    for (i = 0; i < $scope.project.team.length; i++) {
      if ($scope.project.team[i]._id === selectedUser._id) { return; }
    };

    $scope.project.team.push(selectedUser);

    $scope.userAbsent = false;
  };

  $scope.removeUser = function (user) {
    var i;

    for (i = 0; i < $scope.project.team.length; i++) {
      if ($scope.project.team[i]._id === user._id) { $scope.project.team.splice(i, 1); }
    };

    if ($scope.project.team.length === 0) {
      $scope.userAbsent = true;
    };
  }
};
