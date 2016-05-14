kinoulinkApp.controller("PlaylistsController", ["$scope", "$rootScope", "data", "router",
    function ($scope, $rootScope, dataService, router)
    {
        $rootScope.menu = "playlist";
        $scope.playlists = [];
        $scope.playlistNew = {};

        function refresh()
        {
            dataService.apiGet('playlist', { }, function(response)
            {
                $scope.playlists = response.data;
            });
        }

        $scope.add = function()
        {
            dataService.apiPost('playlist/create', $scope.playlistNew, function(response)
            {
                if (response.status == 200)
                {
                    refresh();
                }
                else
                {
                    dataService.displayError('Nouvelle Playlist', response);
                }
            });
        };

        refresh();

    }]);