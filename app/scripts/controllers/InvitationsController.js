kinoulinkApp.controller("InvitationsController", ["$scope", "data", "$route",
	function ($scope, data, $route)
	{
		$scope.state_view           = 1;
		$scope.invitations_received = null;
		$scope.invitations_sent     = null;
		$scope.me                   = data.user;
        $scope.loading              = true;

		data.api('kinoulink/list', {}, function(response)
		{
            $scope.loading = false;

			if (response.status === 200)
			{
				var listNews = [], listAccepted = [], listProgress = [], listDeclined = [], listPast = [];
                var now = (new Date()).getTime() / 1000;
                var users = response.data.users;

				angular.forEach(response.data.invitations, function(invitation)
				{
					invitation.guests = [];

					angular.forEach(invitation.recipients, function(recipient)
					{
						if (recipient !== data.user.id)
						{
							invitation.guests.push(users[recipient]);
						}
					});

					invitation.author = response.data.users[invitation.author];

                    if (invitation.when < now)
                    {
                        listPast.push(invitation);
                    }
					else if (invitation.status == 0 && invitation.author.id === data.user.id)
                    {
                        listProgress.push(invitation);
                    }
                    else if (invitation.status == 2)
                    {
                        listDeclined.push(invitation);
                    }
                    else if (invitation.status == 1)
                    {
                        listAccepted.push(invitation);
                    }
                    else
                    {
                        listNews.push(invitation);
                    }
				});

                $scope.invitations_news     = listNews;
                $scope.invitations_sent     = listProgress;
                $scope.invitations_declined = listDeclined;
                $scope.invitations_accepted = listAccepted;
                $scope.invitations_past     = listPast;
			}
		});

        $scope.decline = function(invitationId)
        {
            angular.elementById('invitation-' + invitationId).addClass('loading');

            data.api('kinoulink/decline', {invitation : invitationId}, function(response)
            {
                $route.reload();
            });
        };

        $scope.accept = function(invitationId)
        {
            angular.elementById('invitation-' + invitationId).addClass('loading');

            data.api('kinoulink/accept', {invitation : invitationId}, function(response)
            {
                $route.reload();
            });
        };

	}]);