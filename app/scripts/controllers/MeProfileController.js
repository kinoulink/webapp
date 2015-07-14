kinoulinkApp.controller("MeProfileController", ["$scope", "data", "$upload", "geolocation",
    function ($scope, dataService, $upload, geolocation)
{
    $scope.user = dataService.user;
    $scope.uploadProgress = 0;
    $scope.pseudo_type = {a : "Prénom N.", b: "Prénom Nom"};
    $scope.geoWorkflowStep = 0;
    $scope.geo = {city:'', address: ''};

    $scope.loadingStatus = false;

    $scope.submitStatus = function()
    {
        $scope.loadingStatus = true;

        dataService.api('me/status/edit', {status : $scope.user.status.text}, function(response)
        {
            $scope.loadingStatus = false;

            if (response.status === 200)
            {
                dataService.notifyDisplayToast('success', 'kinoulink', 'Statut enregistré !');
            }
            else
            {
                dataService.notifyDisplayToast('danger', 'kinoulink', response.data.message);
            }
        });
    };

	$scope.submitDetails = function()
    {
        //data.setUser($scope.user);

        dataService.api('me/edit', $scope.user, function(response)
        {
            if (response.status === 200)
            {
                dataService.notifyDisplayToast('success', 'kinoulink', 'Informations enregistrées !');
            }
            else
            {
                dataService.notifyDisplayToast('danger', 'kinoulink', response.data.message);
            }
        });
    };

    $scope.onFileSelect = function(files)
    {
        var fileToUpload = files[0];

        $scope.uploadProgress = 0;

        $scope.upload = $upload.upload({
            url: dataService.apiRoot + 'me/avatar/upload',
            method: 'POST',
            cache: false,
            responseType: "json",
            headers : {'Content-Type': 'application/x-www-form-urlencoded'},
            withCredentials: true,
            file: fileToUpload,
        }).progress(function(evt) {
            $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(data, status, headers, config)
        {
            $scope.uploadProgress = 0;

            dataService.user.avatar.small = data.data.small;
            dataService.user.avatar.big = data.data.big;
        });
    };

    $scope.submitPassword = function()
    {
        dataService.api('me/password/change', {password:$scope.password}, function(response)
        {

        });
    };

    $scope.$watch('user.name', function(value)
    {
        var firstname = $scope.user.name.first,
            lastname = $scope.user.name.last;

        $scope.pseudo_type = {a : firstname + " " + (lastname.length > 0 ? (lastname[0] + '.') : ''), b: firstname + " " + lastname};
    }, true);

    $scope.geoSearch = function()
    {
        var myGeocoder = new google.maps.Geocoder();
        var GeocoderOptions = {
            'address' : $scope.geo.city,
            'region' : 'FR'
        };

        $scope.geoWorkflowStep = 2;

        myGeocoder.geocode( GeocoderOptions, function(results , status)
        {
            $scope.geoWorkflowStep = 0;

            if (status == google.maps.GeocoderStatus.OK)
            {
                var coords = results[0].geometry.location, lat = formatCoord(coords.lat()), lon = formatCoord(coords.lng());

                setUserPosition(lat, lon);
            }
            else
            {
                dataService.notifyDisplayToast('error', 'Géo-localisation', 'Impossible de décoder cette ville ou cette adresse !');
            }

            $scope.$apply();
        });
    };

    $scope.geoCenterOnPosition = function()
    {
        $scope.geoWorkflowStep = 2;

        geolocation.start();
    };

    $scope.$on('geo.position', function(event, position)
    {
        $scope.geoWorkflowStep = 0;

        geolocation.stop();

        if (position.hasOwnProperty('coords'))
        {
            var coords = position.coords, lat = formatCoord(coords.latitude), lon = formatCoord(coords.longitude);

            setUserPosition(lat, lon);
        }
        else
        {
            dataService.notifyDisplayToast('danger', 'Géo-localisation', 'Erreur ' + position);
        }
    });

    function setUserPosition(lat, lon)
    {
        $scope.user.avatar.map = 'https://maps.googleapis.com/maps/api/staticmap?zoom=13&size=100x100&maptype=roadmap%20&markers=color:blue%7Clabel:S%7C' + lat + ',' + lon;

        dataService.user.position = {lat: lat, lon: lon};

        dataService.api('me/position', dataService.user.position, function (response) {

        });
    }

    function formatCoord(value)
    {
        return parseFloat(parseFloat("" + value).toFixed(3));
    }
}]);