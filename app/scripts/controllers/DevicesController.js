kinoulinkApp.controller("DevicesController", ["$scope", "$rootScope", "data",
    function ($scope, $rootScope,dataService)
    {
        $rootScope.menu = 'devices';

        $scope.deviceNew = {};

        function refresh()
        {
            dataService.apiGet('device', {}, function(response)
            {
                $scope.devices = response.data;
            });
        }


        $scope.add = function()
        {
            dataService.apiPost('device/create', $scope.deviceNew, function(response)
            {
                if (response.status == 200)
                {
                    refresh();
                }
                else
                {
                    dataService.displayError('Nouvelle KTV', response);
                }
            });
        };

        refresh();

    }]);