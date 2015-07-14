kinoulinkApp.controller("kinoulinkDetailsController", ["$scope", "data", "$routeParams", "$location",
    function($scope, data, $routeParams, $location)
    {
        $scope.state_view   = $routeParams.hasOwnProperty('view') ? $routeParams.view : 1;
        $scope.loading      = true;

        data.api('kinoulink/details/' + $routeParams.uid, {}, function(response)
        {
            $scope.loading = false;

           if (response.status === 200)
           {
               var invitation = response.data.invitation;

               $scope.invitation    = invitation;

               $scope.invitation.date_verbose = formatDateVerbose(invitation.date) + ' (' + formatDateShortFuture(invitation.date) + ') à ' + invitation.time;
           }
        });

        $scope.createThread = function()
        {
            data.api('inbox/thread/create-from-invitation', {'invitation' : $routeParams.uid}, function(response)
            {
                if (response.status === 200)
                {
                    $location.path('/me/inbox/t-' + response.data.id);
                }
            });
        };
    }
]);