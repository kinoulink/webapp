kinoulinkApp.controller("MediaController", ["$scope", "data", "$upload",
    function ($scope, dataService, $upload)
    {
        function refresh()
        {
            dataService.api('user/media/', {}, function(response)
            {
                $scope.medias = response.data;
            });
        }

        $scope.onFileSelect = function(files)
        {
            var fileToUpload = files[0];

            $scope.uploadProgress = 0;

            $scope.upload = $upload.upload({
                url: dataService.apiRoot + 'user/media/upload',
                method: 'POST',
                cache: false,
                responseType: "json",
                headers : {'Content-Type': 'application/x-www-form-urlencoded'},
                withCredentials: true,
                file: fileToUpload
            }).progress(function(evt) {
                $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config)
            {
                $scope.uploadProgress = 0;

                refresh();
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