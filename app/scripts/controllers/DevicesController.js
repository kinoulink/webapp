kinoulinkApp.controller("DevicesController", ["$scope", "data",
    function ($scope, dataService)
    {
        function refresh()
        {
            dataService.api('user/devices/', {}, function(response)
            {
                $scope.devices = response.data;
            });
        }


        $scope.add = function()
        {
            dataService.api('user/devices/attach', { device : $scope.add.code }, function(response)
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