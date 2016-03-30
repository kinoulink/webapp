kinoulinkApp.controller("menu", ["$scope", "$window", "data",
    function ($scope, $window, dataService)
    {
        $scope.logout = function()
        {
            dataService.api('/user/auth/logout', {}, function()
            {
                $window.location.reload();
            });
        };

    }]);