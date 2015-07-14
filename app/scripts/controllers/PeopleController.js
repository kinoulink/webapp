kinoulinkApp.controller('PeopleController',
['$scope', '$compile', '$location', 'data', 'layout', 'geolocation',
	function($scope, $compile, $location, data, layout, geolocation)
{
    var TYPE_PLACE = 2, SOURCE_LOAD_DATA_BOUNDS = 1, SOURCE_LOAD_DATA_SEARCH = 2,
        map = null, mapCenterDirty = true, mapCluster = null, mapInfoWindow = null, mapSelectedMarker = null, mapMyMarker = null, mapFomerBounds = null,
        tmrMapCenterChangedEvent = 0, googleMapReady = false, mapBounds = null, workflowInit = 0, sourceLoadData = SOURCE_LOAD_DATA_BOUNDS,
        locationParams  = $location.search(),
        $leftColumn     = angular.elementById('home-map'),
        $rightColumn    = angular.elementById('home-list'),
        $layoutSizr     = angular.elementById('home-layout-sizr'),
        $header         = angular.elementById('header'),
        $window         = angular.element(window);

    $scope.searchResultItems    = [];
    $scope.message_list_header  = '';
    $scope.markers              = [];
    $scope.filters              = angular.extend({users:true, places: false, query: ''}, locationParams);
    $scope.viewIndex            =  1;
    $scope.loading              = true;

    if (typeof google !== 'object' || typeof google.maps !== 'object')
    {
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r;
            i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date();
            a = s.createElement(o),
                m = s.getElementsByTagName(o)[0];
            a.async = 1;
            a.src = g;
            m.parentNode.insertBefore(a, m)
        })(window, document, 'script', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBUPEz0N6UW3M1wxtimX4hLxrDhWPpM-t8&callback=initializeGoogleMaps', 'google-maps');

        window.initializeGoogleMaps = function()
        {
            googleMapReady = true;
        };
    }
    else
    {
        googleMapReady = true;
    }

    $scope.$on('$routeUpdate', function()
    {
        $scope.filters = angular.extend({users:true, places:false, query: ''}, $location.search());
    });

    $scope.$on('header.search.click', function()
    {
        $scope.viewIndex = 2;

        document.getElementById('home-search-query-input').focus();
    });

    $scope.$watch('viewIndex', function(v)
    {
        if (v === 1 && map !== null) {
            setTimeout(function() {
                google.maps.event.trigger(map, 'resize');

                if (mapBounds !== null && sourceLoadData == SOURCE_LOAD_DATA_SEARCH)
                {
                    map.fitBounds(mapBounds);
                }

                mapBounds = null;

            }, 800);
        }
    });

    $scope.apiSearchResponse = function(response)
    {
        var markers = [], markerBounds = null;
        var inBoundsTotal       = response.data.total,
            messageInBounds     = '';

        $scope.searchResultItems = response.data.hits;

        if (inBoundsTotal === 0)
        {
            messageInBounds = 'Aucun résultat';
        }
        else if (inBoundsTotal === 1)
        {
            messageInBounds = '1 résultat';
        }
        else
        {
            messageInBounds = inBoundsTotal + ' résultats';
        }

        if ($scope.filters.query === '') {
            messageInBounds += ' proche de vous';
        }

        $scope.message_list_header = messageInBounds;

        if (googleMapReady)
        {
            markerBounds = new google.maps.LatLngBounds();
        }

        if (googleMapReady && map !== null && mapCluster === null)
        {
            mapCluster = new MarkerClusterer(map, [],
            {
                maxZoom: 15,
                gridSize: 30,
                styles : [{
                    url: bz.root + 'images/mark-empty.png',
                    height: 35,
                    width: 35,
                    anchor: [0, 0],
                    textColor: '#ffffff',
                    textSize: 10
                },
                {
                    url: bz.root + 'images/mark-empty.png',
                    height: 42,
                    width: 42,
                    anchor: [0, 0],
                    textColor: '#ffffff',
                    textSize: 12
                },
                {
                    url: bz.root + 'images/mark-empty.png',
                    height: 48,
                    width: 48,
                    anchor: [0, 0],
                    textColor: '#ffffff',
                    textSize: 14
                }]
            });
        }

        if (mapCluster !== null)
        {
            mapCluster.clearMarkers();
        }

        if (markerBounds !== null && mapMyMarker !== null)
        {
            markerBounds.extend(mapMyMarker.getPosition());
        }

        angular.forEach($scope.searchResultItems, function(item)
        {
            if (item.type == TYPE_PLACE)
            {
                item.subtitle = item.address.street + ', ' + item.address.city;
            }
            else
            {
                item.subtitle = item.job + ' ' + item.sector;
            }

            item.distance = geolocation.getDistanceSimple(data.user.position, item.location);

            if (googleMapReady)
            {
                var marker = new google.maps.Marker(
                {
                    position: new google.maps.LatLng(item.location.lat, item.location.lon),
                    title: item.title,
                    icon: new google.maps.MarkerImage(item.avatar, null, null, new google.maps.Point(20, 22),  new google.maps.Size(40, 44))
                });

                marker.source = item.id;

                (function(_item) {
                    google.maps.event.addListener(marker, 'click', function () {
                        $scope.onListItemClick(1, _item);
                    })
                })(item);

                mapCluster.addMarker(marker);

                markerBounds.extend(marker.getPosition());
            }

            markers.push(item);
        });

        $scope.markers = markers;

        if (map !== null && sourceLoadData == SOURCE_LOAD_DATA_SEARCH)
        {
            map.fitBounds(markerBounds);

            mapBounds = markerBounds;
        }
    };

    function geolocationCallback(e, positionOrError)
    {
        if (positionOrError.hasOwnProperty('coords'))
        {
            var coords = positionOrError.coords, lat = angular.floatPrecision(coords.latitude), lon = angular.floatPrecision(coords.longitude);

            if (!mapCenterDirty && googleMapReady)
            {
                mapCenterDirty = false;

                map.setCenter(new google.maps.LatLng(coords.latitude, coords.longitude));
            }

            if (data.user.position.lat !== lat || data.user.position.lon !== lon)
            {
                data.user.position = {lat: lat, lon: lon};

                data.api('me/position', data.user.position, function (response) {});

                if (mapMyMarker !== null)
                {
                    mapMyMarker.setPosition({lat:lat,lng:lon});
                }
            }
        }
        else if (positionOrError === 'PERMISSION_DENIED')
        {
            data.notifyDisplayToast('danger', 'Géo-location', 'Vous devez autoriser kinoulink et ce navigateur a accéder à la géo-localisation !');
        }
        else if (typeof positionOrError !== 'string')
        {
            var _m = JSON.stringify(positionOrError);

            data.notifyDisplayToast('danger', 'Géo-location', 'Une erreur nous empêche de vous géo-localiser ;-( "' + _m + '"');
        }
        else if (positionOrError !== 'TIMEOUT')
        {
            data.notifyDisplayToast('danger', 'Géo-location', 'Une erreur nous empêche de vous géo-localiser ;-( "' + positionOrError + '"');
        }
    }

	$scope.layout =
	{
        mouseUp : function ()
        {
            $window.unbind('mousemove', $scope.layout.divMove);
        },

        mouseDown : function(e)
        {
            $window.bind('mousemove', $scope.layout.divMove);
        },

        divMove : function(e)
        {
            var windowWidth = layout.getWindowSize().width();

            if (e.clientX > 0.25 * windowWidth) {
                var ratio = Math.floor((100 * (e.clientX - 0.25 * windowWidth)) / (0.75 * windowWidth));

                $leftColumn.css('width', ratio + '%');
                $rightColumn.css('width', (100 - ratio) + '%');
            }

            if(e.stopPropagation) e.stopPropagation();
            if(e.preventDefault) e.preventDefault();
            e.cancelBubble=true;
            e.returnValue=false;

            return false;
        }
	};

    $scope.initializeMap = function()
    {
        if (!googleMapReady)
        {
            setTimeout(function()
            {
                $scope.initializeMap();
            }, 500);

            return false;
        }

        $leftColumn.removeClass('div-loading');

        var position = (data.user.hasOwnProperty('position') && data.user.position.lat != 0)  ? data.user.position : {lat:43.3063684, lng:5.9048835};
        var myLatlng = new google.maps.LatLng(position.lat, position.lon);
        var mapOptions = {
            center: myLatlng,
            zoom: 14,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            panControl: false,
            zoomControl: true,
            mapTypeControl: false,
            scaleControl: false,
            overviewMapControl: false,
            styles: [{"featureType":"landscape.natural","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#e0efef"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"hue":"#1900ff"},{"color":"#c0e8e8"}]},{"featureType":"landscape.man_made","elementType":"geometry.fill"},{"featureType":"road","elementType":"geometry","stylers":[{"lightness":100},{"visibility":"simplified"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","stylers":[{"color":"#ABDAE9"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"visibility":"on"},{"lightness":700}]}]
        };
		
        map = new google.maps.Map($leftColumn[0], mapOptions);
        window.map = map;
        mapMyMarker =  new google.maps.Marker(
        {
            map: map,
            position: new google.maps.LatLng(data.user.position.lat, data.user.position.lon),
            title: 'Ma position',
            icon: new google.maps.MarkerImage(bz.root + 'images/mark-me.png', new google.maps.Size(194, 194), null, new google.maps.Point(49, 49),  new google.maps.Size(97, 97))
        });

        google.maps.event.addListener(map, 'dragstart', function()
        {
            $header.addClass('discret');
        });

        google.maps.event.addListener(map, 'dragend', function()
        {
            $header.removeClass('discret');
        });

        google.maps.event.addListener(map, 'idle', $scope.mapBoundsChanged);
    };

    $scope.mapBoundsChanged = function(e)
    {
        if (workflowInit === 0)
        {
            workflowInit = 1;
        }

        if ($scope.viewIndex != 1 || $scope.filters.query !== '')
        {
            return ;
        }

        var mapBounds = map.getBounds(), mapBoundMin = mapBounds.getSouthWest(), mapBoundMax = mapBounds.getNorthEast();

        var newMapBounds = {
            'min': {
                'lat': angular.floatPrecision(mapBoundMin.lat()),
                'lon': angular.floatPrecision(mapBoundMin.lng())
            },
            'max': {
                'lat': angular.floatPrecision(mapBoundMax.lat()),
                'lon': angular.floatPrecision(mapBoundMax.lng())
            }
        };

        if (mapFomerBounds === null
            || newMapBounds.min.lat !== mapFomerBounds.min.lat
            || newMapBounds.min.lon !== mapFomerBounds.min.lon
            || newMapBounds.max.lat !== mapFomerBounds.max.lat
            || newMapBounds.max.lon !== mapFomerBounds.max.lon)
        {
            mapFomerBounds = newMapBounds;

            clearTimeout(tmrMapCenterChangedEvent);

            tmrMapCenterChangedEvent = setTimeout(function () {
                $scope.loadData(SOURCE_LOAD_DATA_BOUNDS);
            }, 1000);
        }
    };

    $scope.loadData = function(source)
    {
        sourceLoadData = source;

        $scope.loading = true;

        data.api('data/search', angular.extend({'bounds': mapFomerBounds}, $scope.filters), function (response)
        {
            $scope.apiSearchResponse(response);

            $scope.loading                  = false;
        });
    };

    $scope.submitSearchForm = function()
    {
        document.getElementById('home-search-form').blur();

        $location.search($scope.filters);

        $scope.loadData(SOURCE_LOAD_DATA_SEARCH);
    };
	
	$scope.onListItemClick = function(source, item)
	{
        var contentString;

        if (item.type === TYPE_PLACE)
        {
            contentString = '<div class="__mapInfoWindow">' +
            '<h3>' + item.title + '</h3>' +
            '<p>' + item.address.street + '</p>' +
            '<p>' + item.address.city + '</p>' +
            '<div class="clearfix _l">' +
            '<a class="_l1" href="#" ng-href="#/kinoulink/new?recipient=' + item.id + '">kinoulinker</a>' +
            '</div>' +
            '</div>';
        }
        else
        {
            contentString = '<div class="__mapInfoWindow">' +
            '<div class="clearfix">' +
            '<div class="pull-left __a"><img src="' + item.avatar + '" /></div>' +
            '<div class="__r">' +
            '<h3>' + item.title + '</h3>' +
            '<p>' + item.job + '</p>' +
            '<p>' + item.sector + '</p>' +
            '</div>' +
            '</div>' +
            '<div class="clearfix _l">' +
            '<a class="btn btn-success" href="#" ng-href="#/kinoulink/new?recipient=' + item.id + '">kinoulinker</a>' +
            '<a class="btn btn-primary" href="#" ng-href="#/u/' + item.id + '">Profile</a>' +
            '</div>' +
            '</div>';
        }

        if (source === 2 && $scope.viewIndex === 2)
        {
            contentString = '<div id="home-modal" class="modal"><div class="modal-backdrop in" ng-click="closeModal()"></div>' + contentString + '</div>';

            var contentNode = $compile(contentString)($scope);

            angular.elementById('page').append(contentNode);
        }
        else if (map !== null)
        {
            var contentNode = $compile(contentString)($scope), marker = null, position = new google.maps.LatLng(item.location.lat, item.location.lon);

            angular.forEach(mapCluster.getMarkers(), function(_marker)
            {
               if (_marker.source === item.id)
               {
                   marker = _marker;

                   return false;
               }
            });

            if (mapInfoWindow == null)
            {
                mapInfoWindow =  new google.maps.InfoWindow({
                    maxWidth: layout.getWindowSize().width() - 20
                });

                google.maps.event.addListener(mapInfoWindow, 'closeclick', function()
                {
                    mapSelectedMarker.setMap(null);
                });
            }

            mapInfoWindow.setPosition(position);

            mapInfoWindow.setContent(contentNode[0]);

            if (mapSelectedMarker !== null)
            {
                mapSelectedMarker.setMap(null);
            }

            mapSelectedMarker = new google.maps.Marker(
            {
                map: map,
                position: new google.maps.LatLng(item.location.lat, item.location.lon),
                title: item.title + ' (' + item.type + ')',
                icon: new google.maps.MarkerImage(bz.root + 'images/mark-selected.png',null, null, new google.maps.Point(20, 22),  new google.maps.Size(40, 44))
            });

            mapInfoWindow.open(map, mapSelectedMarker);
        }
	};
	
	$scope.closeModal = function()
	{
		angular.elementById('home-modal').remove();
	};

    $scope.updateLayout = function()
    {
        var windowHeight = layout.getWindowSize().height(), isMobile = layout.isMobile();

        if (isMobile)
        {
            windowHeight -= 39;
        }

        if ($leftColumn !== null && $rightColumn !== null)
        {
            $leftColumn.css('height', windowHeight + 'px');
            $rightColumn.css((isMobile ? 'min-' : '') + 'height', windowHeight + 'px');

            if (googleMapReady) {
                google.maps.event.trigger(map, 'resize');
            }
        }
    };

    $scope.$on('$destroy', function ()
    {
        $window.unbind('resize', $scope.updateLayout);
        $window.unbind('mouseup', $scope.layout.mouseUp);

        $layoutSizr.unbind('mousedown', $scope.layout.mouseDown);

        google.maps.event.clearListeners(map);

        map.getDiv().remove();

        delete window.map;
        delete map;

        geolocation.stop();
    });

    $scope.initializeMap();

    geolocation.start();

    $scope.updateLayout();

    $window.bind('resize', $scope.updateLayout);
    $layoutSizr.bind('mousedown', $scope.layout.mouseDown);
    $window.bind('mouseup', $scope.layout.mouseUp);

    $scope.$on('geo.position', geolocationCallback);

    if (locationParams.hasOwnProperty('search'))
    {
        $scope.$emit('header.search.click');
    }
}]);