kinoulinkApp.controller("MeNotifEmails",
    ["$scope", "data",
        function($scope, dataService)
        {
            $scope.emails = [];

            dataService.api('me/archive/emails', {}, function(response)
            {
                $scope.emails = response.data;
            });
        }]);