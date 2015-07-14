kinoulinkApp.controller('EventDetails', ['$scope', 'data', 'router', function($scope, dataService, router)
{
    var eventID = router.get('uid');

    $scope.loading          = true;
    $scope.users            = [];
    $scope.user_presence    = 1;

    $scope.loadEvent = function()
    {
        dataService.api('/event/details', {event: eventID}, function (response)
        {
            var event = response.data.event, users = {};

            $scope.event = event;

            if (event.hasOwnProperty('status'))
            {
                var meID = dataService.user.id;

                angular.forEach(event.status, function (status)
                {
                    if (status.user === meID) {
                        if (status.status === 2) {
                            $scope.user_presence = 2;
                        }
                        else {
                            $scope.user_presence = 1;
                        }
                    }

                    if (status.status === 2) {
                        users[status.user] = 1;
                    }
                    else {
                        users[status.user] = 0;
                    }
                });
            }

            var buffer = [];

            angular.forEach(users, function (i, user)
            {
                if (i === 1)
                {
                    buffer.push(response.data.users[user]);
                }
            });

            $scope.users = buffer;
            $scope.loading = false;
        });
    }

    $scope.clockIn = function()
    {
        if ($scope.loading)
        {
            return ;
        }

        $scope.loading = true;

        dataService.api('/event/status', {event : eventID,status : 2}, function(response)
        {
            $scope.loading = false;

            if (response.status === 200)
            {
                $scope.user_presence = 2;

                $scope.loadEvent();
            }
            else
            {
                dataService.notifyDisplayToast('danger', 'Event', response.data.message);
            }
        });
    };

    $scope.clockOut = function()
    {
        if ($scope.loading)
        {
            return ;
        }

        $scope.loading = true;

        dataService.api('/event/status', {event : eventID, status : 3}, function(response)
        {
            $scope.loading = false;

            if (response.status === 200)
            {
                $scope.user_presence = 1;

                $scope.loadEvent();
            }
            else
            {
                dataService.notifyDisplayToast('danger', 'Event', response.data.message);
            }
        });
    };

    $scope.startConversation = function(user)
    {
        $scope.loading = true;

        dataService.api('inbox/thread/create', {type:1, recipient: user.id}, function(response)
        {
            $scope.loading = false;

            if (response.status === 200)
            {
                var threadID = response.data;

                router.path('/me/inbox/t-' + threadID);
            }
            else
            {
                dataService.notifyDisplayToast('danger', 'Event', response.data.message);
            }
        });
    };

    $scope.loadEvent();
}]);