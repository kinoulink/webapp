kinoulinkApp.controller("MediaDetailsController", ["$scope", "$rootScope", "data", "router",
    function ($scope, $rootScope, dataService, router)
    {
        $scope.loading = true;
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

        refresh();
    }]);