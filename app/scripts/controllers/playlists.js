kinoulinkApp.controller("PlaylistsController", ["$scope", "$rootScope", "Playlist", "router",
    function ($scope, $rootScope, Playlist, router)
    {
        $rootScope.menu = "playlist";
        $rootScope.title = 'Playlist';

        $scope.playlists = [];
        $scope.error = null;

        function refresh()
        {
            $scope.playlists = Playlist.query({sort : 'createdAt DESC'});

            $scope.playlistNew = { 'color' : pastelColors()};
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

        function pastelColors()
        {
            var r = (Math.round(Math.random()* 127) + 127).toString(16);
            var g = (Math.round(Math.random()* 127) + 127).toString(16);
            var b = (Math.round(Math.random()* 127) + 127).toString(16);
            return '#' + r + g + b;
        }
    }]);