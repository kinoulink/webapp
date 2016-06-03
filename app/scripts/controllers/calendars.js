kinoulinkApp.controller("CalendarsController", ["$scope", "$rootScope", "Calendar", "router",
    function ($scope, $rootScope, Calendar, router)
    {
        $rootScope.menu = "calendar";
        $rootScope.title = 'Mes Calendriers';

        $scope.create = function()
        {
            (new Calendar($scope.calendarNew)).$save(function(response)
            {
                if (response.status == 200)
                {
                    init();
                }
                else
                {
                    $scope.error = response.data;
                }
            });
        };

        function init()
        {
            $scope.calendars = Calendar.query({sort : 'createdAt DESC'});
            $scope.calendarNew = {};
            $scope.error = null;
        }

        init();
    }]);