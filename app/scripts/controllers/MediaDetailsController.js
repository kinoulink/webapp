kinoulinkApp.controller("MediaDetailsController", ["$scope", "$rootScope", "data", "router",
    function ($scope, $rootScope, dataService, router)
    {
        $scope.loading = true;
        $scope.newPlaylist = 0;

        $rootScope.menu = 'media';
        $rootScope.title = 'Mes Médias';

        $scope.media = {'title' : 'Chargement ...'};

        var token = router.get('token');

        function refresh()
        {
            dataService.apiGet('media/' + token, {}, function(response)
            {
                $scope.loading = false;

                if (response.status == 200)
                {
                    $scope.media = response.data;
                }
                else
                {
                    dataService.displayError('Media', response);
                }
            });
        }

        dataService.apiGet('playlist', {}, function(response)
        {
            $scope.playlists = response.data;
        })

        $scope.addToPlaylist = function()
        {
            dataService.apiPost('mediainplaylist', { playlist : $scope.newPlaylist, media : $scope.media.id}, function(response)
            {
                refresh();
            });
        };

        refresh();
    }]);