kinoulinkApp.controller("PlaylistController", ["$scope", "$rootScope", "$timeout", "Playlist", "MediaInPlaylist", "data", "router", "Upload",
    function ($scope, $rootScope, $timeout, Playlist, MediaInPlaylist, dataService, router, Upload)
    {
        $rootScope.menu = "playlist";
        $rootScope.title = 'Playlist';

        var token = router.get('token');

        function refresh()
        {
            $scope.playlist = Playlist.get({ id : token});

            $scope.medias = MediaInPlaylist.query({ playlist : token, sort : 'createdAt DESC'});
        }

        $scope.removeLink = function(link)
        {
            MediaInPlaylist.remove({id : link.id}, function(response)
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

        var changeTimeoutPromise = null;

        $scope.mediaDurationChange = function(item)
        {
            if (changeTimeoutPromise)
            {
                $timeout.cancel(changeTimeoutPromise);
            }

            changeTimeoutPromise = $timeout(function()
            {
                dataService.apiPost('mediainplaylist/duration', {
                    id : item.id,
                    duration : item.duration
                }, function()
                {
                    refresh()
                });
            }, 500);
        };

        refresh();

    }]);