kinoulinkApp.controller("MediaController", ["$scope", "$rootScope", "data", "Upload",
    function ($scope, $rootScope, dataService, Upload)
    {
        $scope.loading = true;
        $rootScope.menu = 'media';

        function refresh()
        {
            dataService.apiGet('media', {}, function(response)
            {
                $scope.loading = false;

                if (response.status == 200)
                {
                    $scope.medias = response.data;
                }
                else
                {
                    dataService.displayError('Media', response);
                }
            });
        }

        $scope.onFileSelect = function(files)
        {
            var fileToUpload = files[0];

            $scope.uploadProgress = 0;

            $scope.upload = Upload.upload({
                url: appConfig.api + 'media/upload',
                method: 'POST',
                cache: false,
                responseType: "json",
                headers : {'Content-Type': 'application/x-www-form-urlencoded', 'X-Auth-Token' : $rootScope.accessToken},
                withCredentials: true,
                file: fileToUpload
            })
            .progress(function(evt)
            {
                $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
            })
            .success(function(data, status, headers, config)
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


        $scope.add = function()
        {
            dataService.api('user/media/upload', { device : $scope.add.code }, function(response)
            {
                refresh();
            });
        };

        refresh();
    }]);