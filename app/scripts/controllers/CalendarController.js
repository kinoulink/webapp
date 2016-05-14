kinoulinkApp.controller("CalendarController", ["$scope", "$rootScope", "data", "uiCalendarConfig",
    function ($scope, $rootScope, dataService, uiCalendarConfig)
    {
        $rootScope.menu = "calendar";

        $scope.eventSources = [];

        $scope.uiConfig = {
            calendar:{
                height: 600,
                editable: true,
                header:{
                    left: 'title',
                    center: '',
                    right: 'today prev,next'
                }
            }
        };

        /* remove event */
        $scope.remove = function(index) {
            $scope.events.splice(index,1);
        };
        /* Change View */
        $scope.changeView = function(view,calendar) {
            getCalendar().fullCalendar('changeView',view);
        };
        /* Change View */
        $scope.renderCalender = function(calendar) {
            if(uiCalendarConfig.calendars[calendar]){
                uiCalendarConfig.calendars[calendar].fullCalendar('render');
            }
        };
        /* Render Tooltip */
        $scope.eventRender = function( event, element, view ) {
            element.attr({'tooltip': event.title,
                'tooltip-append-to-body': true});
            $compile(element)($scope);
        };

        function getCalendar()
        {
            return uiCalendarConfig.calendars['myCalendar'];
        }
    }]);