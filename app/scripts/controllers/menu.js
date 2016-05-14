kinoulinkApp.controller("menu", ["$scope", "$window", "data",
    function ($scope, $window, dataService)
    {
        $scope.logout = function()
        {
            localStorage.removeItem('access_token');

            $window.location.reload();
        };

    }]);