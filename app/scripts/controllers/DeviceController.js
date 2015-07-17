kinoulinkApp.controller("DeviceController", ["$scope", "data", "router",
    function ($scope, dataService, router)
    {
        var device = router.get('token');

        function refresh()
        {
            dataService.api('user/devices/details', { device : device}, function(response)
            {
                $scope.devices = response.data;
            });
        }

        $scope.addMedia = function()
        {
            dataService.api('user/devices/media/add', { device : device }, function(response)
            {
                refresh();
            });
        };

        $scope.detach = function()
        {
            dataService.api('user/devices/detach', { device : device }, function(response)
            {
                refresh();
            });
        };

        refresh();

    }]);