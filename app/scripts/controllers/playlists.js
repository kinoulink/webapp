kinoulinkApp.controller("PlaylistsController", ["$scope", "$rootScope", "Playlist", "router",
    function ($scope, $rootScope, Playlist, router)
    {
        $rootScope.menu = "playlist";
        $rootScope.title = 'Playlist';

        $scope.playlists = [];
        $scope.playlistNew = {};
        $scope.error = null;

        function refresh()
        {
            $scope.playlists = Playlist.query({sort : 'createdAt DESC'});
        }

        $scope.add = function()
        {
            (new Playlist($scope.playlistNew)).$save(function(response)
            {
                if (response.status == 200)
                {
                    $scope.playlistNew = {};
                    $scope.error = null;

                    refresh();
                }
                else
                {
                    $scope.error = response.data;
                }
            });
        };

        refresh();

    }]);