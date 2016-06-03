kinoulinkApp.controller("calendar_day", ["$scope", "$rootScope", "data", "Calendar", "Playlist", "router",
    function ($scope, $rootScope, dataService, Calendar, Playlist, router)
    {
        var token = router.get('token');

        $rootScope.menu = "calendar";

        $scope.basketList = [];
        $scope.hours = [];
        $scope.showPlaylistPicker = false;
        $scope.newPlaylist = {};

        $scope.playlists = Playlist.query({sort : 'createdAt DESC'});

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
                time : $scope.newPlaylist.time
            };

            dataService.apiPost('playlistinday', item, function(response)
            {
                refresh();

                $scope.showPlaylistPicker = false;
            });
        };

        function refresh()
        {
            dataService.apiGet('calendar/' + token, {}, function(response)
            {
                $scope.calendar = response.data;
            });

            dataService.apiGet('playlistinday', { calendar : token }, function(response)
            {
                var playlists = response.data, calendarPlaylistsByHours = {};

                playlists.forEach(function(entry)
                {
                    if (!calendarPlaylistsByHours.hasOwnProperty(entry.time))
                    {
                        calendarPlaylistsByHours[entry.time] = [];
                    }

                    (calendarPlaylistsByHours[entry.time]).push(entry);
                });

                $scope.calendarPlaylistsByHours = calendarPlaylistsByHours;
            });
        }

        $scope.dragoverCallback = function(event, index, external, type)
        {
            return true;
        };

        $scope.dropCallback = function(event, item, hour, index)
        {
            if (item)
            {
                var playlist = item.hasOwnProperty('playlist') ? item.playlist : item;

                $scope.newPlaylist = {
                    playlist : {
                        id : playlist.id
                    },
                    time : hour,
                    order: index
                };

                $scope.addPlaylist()
            }

            return true;
        };

        $scope.dndMoved = function(item)
        {
            dataService.apiDelete('playlistinday/' + item.id, {}, function(response)
            {
                refresh();
            });
        }

        refresh();

    }]);