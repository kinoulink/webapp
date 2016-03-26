kinoulinkApp.controller("DeviceMediaAddController", ["$scope", "data", "router",
    function ($scope, dataService, router)
    {
        var device = router.get('token');

        $scope.device = device;

        function refresh()
        {
            dataService.api('user/media/', { device : device}, function(response)
            {
                $scope.medias = response.data;
            });
        }

        $scope.addMedia = function(media)
        {
            dataService.api('user/devices/media/add', { device : device, media : media._id}, function(response)
            {
                router.path('/devices/' + $scope.device);
            });
        };

        refresh();

    }]);