kinoulinkApp.controller("PlaylistController", ["$scope", "$rootScope", "Playlist", "MediaInPlaylist", "router", "Upload",
    function ($scope, $rootScope, Playlist, MediaInPlaylist, router, Upload)
    {
        $rootScope.menu = "playlist";
        $rootScope.title = 'Playlist';

        var token = router.get('token');

        function refresh()
        {
            $scope.playlist = Playlist.get({ id : token});

            $scope.medias = MediaInPlaylist.query();
        }

        $scope.removeLink = function(link)
        {
            dataService.api('delete', 'mediainplaylist/' + link.id, {}, function(response)
            {
                refresh();
            });
        };

        $scope.onFileSelect = function(files)
        {
            var fileToUpload = files[0];

            $scope.uploadProgress = 0;

            $scope.upload = Upload.upload({
                    url: appConfig.api + 'media/upload',
                    method: 'POST',
                    cache: false,
                    responseType: "json",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Auth-Token': $rootScope.accessToken
                    },
                    withCredentials: true,
                    file: fileToUpload
                })
                .progress(function (evt)
                {
                    $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
                })
                .success(function (data, status, headers, config)
                {
                    $scope.uploadProgress = 0;

                    if (data.status == 200)
                    {
                        refresh();
                    }
                    else
                    {
                        dataService.displayError('Téléchargement', data);
                    }
                });
        };

        refresh();

    }]);