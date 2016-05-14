kinoulinkApp.controller("PlaylistController", ["$scope", "$rootScope", "data", "router",
    function ($scope, $rootScope, dataService, router)
    {
        $rootScope.menu = "playlist";

        var token = router.get('token');

        function refresh()
        {
            dataService.apiGet('playlist/' + token, { }, function(response)
            {
                $scope.playlist = response.data;
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