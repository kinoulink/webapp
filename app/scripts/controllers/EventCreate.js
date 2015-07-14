kinoulinkApp.controller('EventCreate', ['$scope', 'data', function($scope, dataService)
{
    $scope.step     = 1;
    $scope.event    = {};

    $scope.doSave = function()
    {
        $scope.step = 2;

        var event = {
            title : $scope.event.title,
            start_date : moment($scope.event.start_date).format('L'),
            end_date : moment($scope.event.end_date).format('L'),
            start_time : moment($scope.event.start_time).format('H:mm'),
            end_time : moment($scope.event.end_time).format('H:mm'),
            address_street : $scope.event.address_street,
            address_codepost : $scope.event.address_codepost,
            address_city : $scope.event.address_city
        };

        dataService.api('event/create', event, function(response)
        {
            if (response.status === 200)
            {
                $scope.event.urls = response.data.urls;

                $scope.step = 3;
            }
            else
            {
                dataService.notifyDisplayToast('danger', 'Connexion', response.data.message);

                $scope.step = 1;
            }
        });
    };
}]);