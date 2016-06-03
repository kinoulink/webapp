kinoulinkApp.controller("CalendarController", ["$scope", "$rootScope", "data", "router",
    function ($scope, $rootScope, dataService, router)
    {
        var token = router.get('token');

        $rootScope.menu = "calendar";

        $scope.days = [{id: 1, title: 'Lundi'}, {id: 2, title: 'Mardi'}, {id: 3, title: 'Mercredi'}, {id: 4, title: 'Jeudi'}, {id: 5, title: 'Vendredi'}, {id: 6, title: 'Samedi'}, {id: 7, title: 'Dimanche'}];
        $scope.hours = [];
        $scope.showPlaylistPicker = false;
        $scope.newPlaylist = {};

        for(var i = 0; i < 24; i++)
        {
            var title = ((i < 10) ? ('0' + i) : i) + ':00';

            $scope.hours.push({ id : i, title : title});
        }

        $scope.clickOnDay = function(day, hour)
        {
            $scope.newPlaylist = {
                day : day,
                hour : hour
            };

            $scope.showPlaylistPicker = true;
        };

        $scope.addPlaylist = function()
        {
            var item = {
                calendar : $scope.calendar.id,
                playlist : $scope.newPlaylist.playlist.id,
                day : $scope.newPlaylist.day.id,
                time : $scope.newPlaylist.time
            };

            dataService.apiPost('playlistincalendar', item, function(response)
            {
                refresh();

                $scope.showPlaylistPicker = false;
            });
        };

        dataService.apiGet('playlist', {}, function(response)
        {
            $scope.playlists = response.data;
        });

        function refresh()
        {
            dataService.apiGet('calendar/' + token, {}, function(response)
            {
                $scope.calendar = response.data;
            });

            dataService.apiGet('playlistincalendar', { calendar : token }, function(response)
            {
                var calendarPlaylists = response.data,
                    calendarPlaylistsByDay = {};

                $scope.days.forEach(function(day)
                {
                    calendarPlaylistsByDay["" + day.id] = {};

                    $scope.hours.forEach(function(hour)
                    {
                        calendarPlaylistsByDay["" + day.id]["" + hour.id] = [];
                    });
                });

                calendarPlaylists.forEach(function(item)
                {
                    if (item.hasOwnProperty('time'))
                    {
                        (calendarPlaylistsByDay[item.day + ""][item.time + ""]).push(item);
                    }
                });

                $scope.calendarPlaylistsByDay = calendarPlaylistsByDay;
            });
        }

        refresh();

    }]);