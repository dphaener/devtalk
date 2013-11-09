angular.module('devtalkApp')
  .controller('ProjectCtrl', function ($scope, $http, $location, $log, $modal, $routeParams) {
  		$scope.users = [];
  		$scope.isEmpty = true;
  		$scope.projectSelected = false;
      $scope.pLoading = true;
      $scope.uLoading = true;
      $scope.newConversation = false;
      $scope.isNewMessage = false;

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

      // New Project Dialog

	    $scope.open = function () {

		    var modalInstance = $modal.open({
		      templateUrl: 'views/templates/newProjectModal.html',
		      controller: ModalInstanceCtrl,
		      backdrop: 'static',
		      windowClass: 'new-project',
		      resolve: {
		        users: function () {
		        	return $scope.users;
		        }
		      }
		    });

		    modalInstance.result.then(function (newProject) {
		    	$http({
			    	method: 'POST',
			    	url: 'http://geekwise-angularjs.herokuapp.com/darin/projects',
			    	data : Project
				    }).success(function (data, status, headers, config) {
              $scope.pLoading = true;
              $http({
                method: 'GET',
                url: 'http://geekwise-angularjs.herokuapp.com/darin/projects'
                }).success(function (data, status, headers, config) {
                  $scope.projects = data;
                  $scope.isEmpty = false;
                  $scope.pLoading = false;
                  $scope.currentProject = newProject;
                  $scope.projectSelected = true;
                }).error(function (data, status, headers, config) {
                  
                });
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

var ModalInstanceCtrl = function ($scope, $modalInstance, users) {

  $scope.dt = new Date();
  $scope.users = users;
  $scope.items = ['New', 'In Progess', 'Completed'];
  $scope.selectedItem = $scope.items[0];
  $scope.selectedUser = $scope.users[0];
  $scope.projectUsers = [];
  $scope.userAbsent = true;

  $scope.ok = function (projectTitle, projectDescription) {
    newProject = {
      title: projectTitle,
      description: projectDescription,
      status: $scope.selectedItem,
      dueDate: $scope.dt
    }
    $modalInstance.close(newProject);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.addUser = function (selectedUser) {
    var i;

    for (i = 0; i < $scope.projectUsers.length; i++) {
      if ($scope.projectUsers[i]._id === selectedUser._id) { return; }
    };

    $scope.projectUsers.push(selectedUser);

    $("#userWarning").css('display', 'none');

    $scope.userAbsent = false;
  };

  $scope.removeUser = function (user) {
    var i;

    for (i = 0; i < $scope.projectUsers.length; i++) {
      if ($scope.projectUsers[i]._id === user._id) { $scope.projectUsers.splice(i, 1); }
    };

    if ($scope.projectUsers.length === 0) {
      $('#userWarning').css('display', 'inline-block');
      $scope.userAbsent = true;
    };
  }
};
