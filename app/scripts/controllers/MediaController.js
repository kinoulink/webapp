kinoulinkApp.controller("MediaController", ["$scope", "$rootScope", "Media", "data", "Upload",
    function ($scope, $rootScope, Media, dataService, Upload)
    {
        $rootScope.menu = 'media';
        $rootScope.title = 'Mes Médias';

        $scope.medias = null;

        function refresh()
        {
            $scope.medias = Media.query({sort : 'createdAt DESC'});
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