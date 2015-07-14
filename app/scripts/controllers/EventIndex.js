kinoulinkApp.controller('EventIndex', ['$scope', 'data', function($scope, dataService)
{
    dataService.api('event/list', {}, function(response)
    {
       $scope.events = response.data;
    });
}]);