kinoulinkApp.controller("devices", ["$scope", "$rootScope", "Device",
    function ($scope, $rootScope, Device)
    {
        $rootScope.menu = 'devices';
        $rootScope.title = 'KTV';

        $scope.deviceNew = {};
        $scope.error = '';

        function refresh()
        {
            $scope.devices = Device.query();
        }

        $scope.add = function()
        {
            (new Device($scope.deviceNew)).$save(function(response)
            {
                if (response.status == 200)
                {
                    refresh();
                }
                else
                {
                    $scope.error = response.data;
                }
            });
        };

        refresh();

    }]);