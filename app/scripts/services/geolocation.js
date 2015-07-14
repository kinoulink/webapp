kinoulinkApp.factory('geolocation', ['data', function(data)
{
    var watchingID = 0;

    return {
        start: function()
        {
            if (navigator.geolocation)
            {
                watchingID = navigator.geolocation.watchPosition(function(position)
                {
                    data.sendMessage('geo.position', position);
                },
                function(error)
                {
                    data.sendMessage('geo.position', getErrorMessage(error));
                },
                {
                    enableHighAccuracy: true,
                    maximumAge: 3000,
                    timeout: 10000
                });
            }
            else
            {
                data.sendMessage('geo.error', '404');
            }
        },
        stop : function()
        {
            if (navigator.geolocation)
            {
                navigator.geolocation.clearWatch(watchingID);
            }
        },
        /**
         * Calculates the distance between two spots.
         * This method is more simple but also far more inaccurate
         *
         * @param    object    Start position {latitude: 123, longitude: 123}
         * @param    object    End position {latitude: 123, longitude: 123}
         * @param    integer   Accuracy (in meters)
         * @return   integer   Distance (in meters)
         */
        getDistanceSimple: function(start, end)
        {
            var lat1 = start.lat, lon1 = start.lon, lat2 = end.lat, lon2 = end.lon;
            var deg2rad = 0.017453292519943295; // === Math.PI / 180
            var cos = Math.cos;

            lat1 *= deg2rad;
            lon1 *= deg2rad;
            lat2 *= deg2rad;
            lon2 *= deg2rad;
            var diam = 12742; // Diameter of the earth in km (2 * 6371)
            var dLat = lat2 - lat1;
            var dLon = lon2 - lon1;
            var a = (
                (1 - cos(dLat)) +
                (1 - cos(dLon)) * cos(lat1) * cos(lat2)
                ) / 2;

            return diam * Math.asin(Math.sqrt(a));
        }
    };

    function getErrorMessage(error)
    {
        var content = '';

        switch (error.code)
        {
            case 0:
            {
                content = 'UNKNOWN_ERROR';
            }
                break;
            case 1:
            {
                content = 'PERMISSION_DENIED';
            }
                break;
            case 2:
            {
                content = 'POSITION_UNAVAILABLE';
            }
                break;
            case 3:
            {
                content = 'TIMEOUT';
            }break;

            case 9:
            {
                content = 'GEOLOCATION_NOT_SUPPORTED';
            }
        }

        return content;
    }
}]);