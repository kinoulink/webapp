kinoulinkApp.controller("device", ["$scope", "$rootScope", "Device", "router",
    function ($scope, $rootScope, Device, router)
    {
        $rootScope.menu = "devices";
        $rootScope.title = 'KTV';

        $scope.edition = false;
        $scope.errorEdition = "";

        function refresh()
        {
            $scope.device = Device.get({ id : router.get('token') });
        }

        $scope.sendAction = function(action)
        {
            dataService.api('user/devices/actions/add', { device : device, action : action }, function(response)
            {
                refresh();
            });
        };

        $scope.removeMedia = function(media)
        {
            dataService.api('user/devices/media/remove', { device : device, media : media }, function(response)
            {
                refresh();
            });
        };

        refresh();

    }]);