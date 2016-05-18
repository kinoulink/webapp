kinoulinkApp.controller("PlaylistController", ["$scope", "$rootScope", "data", "router", "Upload",
    function ($scope, $rootScope, dataService, router, Upload)
    {
        $rootScope.menu = "playlist";
        $rootScope.title = 'Playlist';

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

        $scope.removeMedia = function(media)
        {
            dataService.api('user/devices/media/remove', { device : device, media : media }, function(response)
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