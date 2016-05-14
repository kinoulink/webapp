kinoulinkApp.controller("CalendarsController", ["$scope", "$rootScope", "data", "router",
    function ($scope, $rootScope, dataService, router)
    {
        $rootScope.menu = "calendar";
        $scope.calendarNew = null;

        function refresh()
        {
            dataService.apiGet('calendar', {}, function(response)
            {
                $scope.calendars = response.data;
            });
        }

        $scope.create = function()
        {
            dataService.apiPost('calendar/create', $scope.calendarNew, function(response)
            {
                refresh();
            });
        };

        refresh();
    }]);