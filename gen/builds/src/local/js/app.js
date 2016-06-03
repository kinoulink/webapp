var kinoulinkApp = angular.module('kinoulinkApp', ['ngResource', 'ngRoute', 'ngSanitize', 'ngFileUpload', 'ui-notification', 'angular-loading-bar', 'dndLists'])

.run(['$rootScope', '$location', '$http', function($rootScope, $location, $http)
{
    var $html = angular.elementById('html'),
        $body = angular.elementById('body');

    $html.removeClass('loading');

    if (_global_bootstrap_data !== null)
    {
        $rootScope.user = _global_bootstrap_data.user;
        $rootScope.accessToken = _global_bootstrap_data.access_token;

        $http.defaults.headers.common['x-auth-token'] = _global_bootstrap_data.access_token;
    }

    $rootScope.$on('$routeChangeSuccess', function(ev, evData)
    {
        $body.attr('class', evData.controller);

        $rootScope.sidebarToggled = false;

        setTimeout(function()
        {
            $body.addClass('fx-delay');
        }, 100);

        ga('send', 'pageview', $location.path());

        $html.removeClass('focus');
    });

    clearInterval(window.__bz_loader);
}])
.config(['$routeProvider', function ($routeProvider)
{
    $routeProvider.when('/about', {
        templateUrl: bzrup("about")
    });

    if (_global_bootstrap_data === null)
    {
        $routeProvider.when('/login', {
            templateUrl: bzrup("auth/login"),
            controller: 'LoginController'
        }).when('/forgot-password', {
            templateUrl: bzrup("auth/forgot-password"),
            controller: 'ForgotPassword'
        })
        .when('/register', {
            templateUrl: bzrup("auth/register"),
            controller: 'RegisterController'
        }).otherwise({
            redirectTo: '/login'
        });
    }
    else
    {
        $routeProvider
        .when('/', {
            templateUrl: bzrup('home'),
            controller: 'home',
            reloadOnSearch: false
        })

        .when('/device', {
            templateUrl: bzrup('devices'),
            controller: 'devices'
        })
        .when('/device/:token', {
            templateUrl: bzrup('device'),
            controller: 'device'
        })
        .when('/devices/:token/media/add', {
            templateUrl: bzrup('deviceMediaAdd'),
            controller: 'DeviceMediaAddController'
        })

        .when('/calendar', {
            templateUrl: bzrup('calendar_list'),
            controller: 'CalendarsController'
        })
        .when('/calendar/:token/day', {
            templateUrl: bzrup('calendar_day_details'),
            controller: 'calendar_day'
        })
        .when('/calendar/:token/month', {
            templateUrl: bzrup('calendar_month_details'),
            controller: 'calendar_month'
        })

        .when('/playlist', {
            templateUrl: bzrup('playlist_list'),
            controller: 'PlaylistsController'
        })
        .when('/playlist/:token', {
            templateUrl: bzrup('playlist_details'),
            controller: 'PlaylistController'
        })


        .when('/media', {
            templateUrl: bzrup('media'),
            controller: 'MediaController'
        })
        .when('/media/:token', {
            templateUrl: bzrup('media_details'),
            controller: 'MediaDetailsController'
        })

        .otherwise({
            redirectTo: '/'
        });
    }
}]);

function formatDateVerbose(value)
{
    return moment(value, 'DD/MM/YYYY').format('dddd D MMMM');
}

function formatDateShortFuture(value)
{
    return moment(value, 'DD/MM/YYYY').from(moment());
}

function bzrup(url)
{
    return url + '.html';
}

angular.floatPrecision = function(number)
{
    return parseFloat(number.toFixed(3));
};

angular.elementById = function (id) {
    return angular.element(document.getElementById(id));
};

angular.popupwindow = function(url, title, w, h) {
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
};

Object.values = function (obj) {
    var vals = [];
    for( var key in obj ) {
        if ( obj.hasOwnProperty(key) ) {
            vals.push(obj[key]);
        }
    }
    return vals;
};
(function()
{
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    var accessToken = localStorage.getItem('access_token');

    $http({
        method: 'POST',
        url: appConfig.api + 'user/me',
        withCredentials: true,
        cache: false,
        responseType: "json",
        timeout : 20000,
        headers : {'Content-Type': 'application/json', 'X-Auth-Token' : accessToken}
    }).
    error(function(data)
    {
        if (data === null)
        {
            data = {data  : "Vérifiez votre connexion Internet!"};
        }

        angular.elementById('body').html('<div style="margin:2em" class="alert alert-danger"><h1>Oups, kinoulink a un problème: </h1><p>' + data.data + '</p></div>');
    }).
    then(function(response)
    {
        var apiResponse = response.data;

        if (apiResponse.status === 200)
        {
            _global_bootstrap_data = {
                user : apiResponse.data,
                access_token : accessToken
            };

            ga('set', '&uid', _global_bootstrap_data);
        }

        angular.element(document).ready(function() {
            angular.bootstrap(document, ['kinoulinkApp']);
        });
    })
})();
kinoulinkApp.filter('formatDateVerbose', function()
{
    return function(value)
    {
        if (typeof value === 'string') {
            return moment(value).format('dddd D MMMM');
        } else {
            return moment(value * 1000).format('dddd D MMMM');
        }
    };
}).filter('formatDateShortFuture', function()
{
    return function(value)
    {
        return moment(value, 'DD/MM/YYYY').from(moment());
    };
}).filter('moment', function()
{
    return function (input)
    {
        return moment(input).fromNow(true);
    };
}).filter('momentVerbose', function()
{
    return function (input)
    {
        return moment(input * 1000).fromNow();
    };
}).filter('formatTime', function()
{
    return function (input)
    {
        return moment(input * 1000).format('H:mm');
    };
}).filter('pluralize', function()
{
    return function (input, text)
    {
        return input + ' ' + text + (input > 1 ? 's' : '');
    };
}).filter('minutes', function()
{
    return function (seconds)
    {
        return parseInt(seconds) > 0 ? (Math.floor(seconds/60) + ' min') : '';
    };
});
kinoulinkApp.filter('thumbnail', function()
{
    return function(media)
    {
       return '//localhost:1337/media/thumbnail/' + media.token + '.jpg';
    };
});
kinoulinkApp.directive('myBreadcrumb', ['$http', function($http)
{
    var breadcrumbData;

    function link(scope, element, attrs)
    {
        attrs.$observe('myBreadcrumb',
            function(value)
        {
            var html = '<ol class="breadcrumb">';

            value = scope.$eval(value);

            addNote('Accueil', '/');

            value.forEach(function(item)
            {
                addNote(item.title, item.hasOwnProperty('link') ? item.link : '');
            });

            html += '</ol>';

            function addNote(title, link)
            {
                if (link)
                    html += '<li><a href="#' + link + '">' + title + '</a></li>';
                else
                    html += '<li>' + title + '</li>';
            }

            element.html(html);
        })
    }

    return {
        restrict : 'A',
        template : '',
        link : link,
        'scope' : {
            myBreadcrumb : '@'
        }
    };
}]);
kinoulinkApp.directive('bzLoader', function()
{
    return {
        restrict: 'E',
        templateUrl : bzrup('directives/loader')
    }
});
kinoulinkApp.directive('mySelect', ['data', '$timeout', function(dataService, $timeout)
{
    function link(scope, element, attrs, model)
    {
        scope.placeholderLabel = attrs.placeholder;
        scope.showDropdown = false;

        var dropdownElement = element.find('div');

        dataService.apiGet('playlist', {}, function(response)
        {
            scope.items = response.data;
        });

        scope.$watch(attrs.ngModel, function(value)
        {
            if (value.hasOwnProperty('title'))
            {
                scope.placeholderLabel = value.title;
            }
        });

        scope.clickOnItem = function(item)
        {
            model.$setViewValue(item);

            scope.showDropdown = false;
        }
    }

    return {
        restrict : 'A',
        template : '<button class="btn btn-default" ng-click="showDropdown = !showDropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> {{ placeholderLabel }} <span class="caret"></span></button><div ng-show="showDropdown"><div class="list-group"><button ng-repeat="item in items" ng-click="clickOnItem(item)" class="list-group-item">{{ item.title }}</button></div></div>',
        link : link,
        require : 'ngModel'
    };
}]);
kinoulinkApp.factory("browser", ["layout", function(layout)
{
   return {
     isIOS : function()
     {
         return /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
     },
       isMobile : function ()
       {
           var header = document.getElementById('header');

           return layout.isVisible(header);
       }
   };
}]);
kinoulinkApp.factory("data",
    ["$rootScope", "$http", "Notification", function($rootScope, $http, Notification)
{
    return {
        displayError: function (title, response)
        {
            if (response.hasOwnProperty('data'))
            {
                if (response.data.hasOwnProperty('error'))
                {
                    notifyDisplayToast('danger', title, response.data.error);
                }
                else
                {
                    notifyDisplayToast('danger', title, response.data);
                }
            }
            else if (response.hasOwnProperty('code'))
            {
                if (response.code === 'E_VALIDATION')
                {
                    var message = '';

                    for (var key in response.invalidAttributes)
                    {
                        message += key + ' : ' + response.invalidAttributes[key][0].message + "\n<br />";
                    }

                    notifyDisplayToast('danger', 'Erreur de validation', message);
                }
            }
        },

        setLocal: function(key, value)
        {
            localStorage.setItem(key, value);
        },

        getLocal : function(key)
        {
            return localStorage.getItem(key);
        },

        apiGet: function(service, param, cb)
        {
            return callAPI('get', service, param, cb);
        },

        apiPost: function(service, param, cb)
        {
            return callAPI('post', service, param, cb);
        },

        apiDelete: function(service, param, cb)
        {
            return callAPI('delete', service, param, cb);
        },

        api: callAPI,

        notifyDisplayToast: notifyDisplayToast
    };

    function notifyDisplayToast(type, title, message)
    {
        Notification.error({
            message: message,
            title: title,
            positionY: 'bottom'
        });
    }

    function callAPI(method, service, param, callback)
    {
        return $http({
            method: method,
            url: appConfig.api + service,
            data: param,
            withCredentials: false,
            cache: false,
            responseType: "json",
            timeout: 20000,
            headers: {'Content-Type': 'application/json', 'X-Auth-Token' : $rootScope.accessToken}
        }).success(function (response, status, headers, config)
        {
            if (response === null)
            {
                notifyDisplayToast('danger', 'kinoulink API', 'Le serveur kinoulink semble rencontrer un petit problème ;-(');

                response = {
                    status: 500,
                    data: null
                };
            }
            else
            {
                /*  if (response.status == 200)
                 {
                 Rollbar.info("API /" + service, {query : param});
                 }
                 else
                 {
                 Rollbar.error("API /" + service, {query : param, response : response});
                 }*/
            }

            /* if (parseInt(response.status) >= 300)
             {
             instance.notifyDisplayToast('danger', 'kinoulink API', 'Le serveur kinoulink semble rencontrer un petit problème: ' + response.data.message);
             }
             */
            if (callback) callback(response);
        }).error(function (response, status, headers, config)
        {
            var error;

            if (response === null)
            {
                response = {
                    status: 500,
                    data: null
                };

                error = 'Le serveur kinoulink semble rencontrer un petit problème ;-(';
            }
            else
            {
                error = 'Le serveur kinoulink semble rencontrer un petit problème: ' + response.data;
            }

            notifyDisplayToast('danger', 'kinoulink API', error);

            if (callback) callback(response);
        });
    }


}]);
kinoulinkApp.factory('layout', function()
{
    function init()
    {
       /* var wSize = getWindowSize();

        if (wSize.width() < 800) {
            document.getElementById('page').style.minHeight = (wSize.height() + 100) +'px';

            setTimeout(function () {
                window.scrollTo(0, 1);
            }, 1000);
        }*/
    }

    function isMobile()
    {
        var header = document.getElementById('header');

        return isVisible(header);
    }

    function isVisible(el)
    {
        return el.offsetWidth > 0 && el.offsetHeight > 0;
    }

    function getWindowSize()
    {
        var docEl = document.documentElement,
            d = document,
            b = document.body,
            IS_BODY_ACTING_ROOT = docEl && docEl.clientHeight === 0;

        // Used to feature test Opera returning wrong values
        // for documentElement.clientHeight.
        function isDocumentElementHeightOff()
        {
            var div = d.createElement('div'),
                r;
            div.style.height = "50000px";
            d.body.insertBefore(div, d.body.firstChild);
            r = d.documentElement.clientHeight > 49000;
            d.body.removeChild(div);
            return r;
        }

        if (typeof document.clientWidth === "number")
        {
            return {
                width: function()
                {
                    return d.clientWidth;
                },
                height: function()
                {
                    return d.clientHeight;
                }
            };
        }
        else if (IS_BODY_ACTING_ROOT || isDocumentElementHeightOff())
        {
            return {
                width: function()
                {
                    return b.clientWidth;
                },
                height: function()
                {
                    return b.clientHeight;
                }
            };
        }
        else
        {
            return {
                width: function()
                {
                    return docEl.clientWidth;
                },
                height: function()
                {
                    return docEl.clientHeight;
                }
            };
        }
    }

    return {
        getWindowSize: getWindowSize,
        init: init,
        isVisible: isVisible,
        isMobile: isMobile
    };

});
kinoulinkApp
.factory("apiResource",
    ["$resource", function($resource)
    {
        function transformResponse(data, header)
        {
            var wrapped = angular.fromJson(data);

            return wrapped.data;
        }

        return function(uri, paramDefaults)
        {
            var actions = {
                query: {
                    isArray: true,
                    transformResponse: transformResponse
                },
                get: {
                    transformResponse: transformResponse
                },
                save : {
                    params : {id : 'create'},
                    method: 'POST'
                }

            };

            return $resource(appConfig.api + uri, paramDefaults, actions);
        }
    }
])
.factory('Device', ['apiResource',
    function(apiResource){
        return apiResource('device/:id', {id:'@id'});
    }]
)
.factory('Playlist', ['apiResource',
    function(apiResource){
        return apiResource('playlist/:id', {id:'@id'});
    }]
)
.factory('Calendar', ['apiResource',
    function(apiResource){
        return apiResource('calendar/:id', {id:'@id'});
    }]
)
.factory('Media', ['apiResource',
    function(apiResource){
        return apiResource('media/:id', {id:'@id'});
    }]
)
.factory('MediaInPlaylist', ['apiResource',
    function(apiResource){
        return apiResource('mediainplaylist/:id', {id:'@id'});
    }]
)


.factory('DeviceAction', ['apiResource',
    function(apiResource){
        return apiResource('deviceaction/:id', {id:'@id'});
    }]
);
kinoulinkApp.factory('router', [
    '$location', '$routeParams', function($location, $routeParams)
    {
        function redirectPath(path)
        {
            return redirectInternUri('#' + path);
        }

        function redirectInternUri(uri)
        {
            if (appConfig.phonegap)
            {
                return redirectUrl('file://' + location.pathname + uri);// 'file:///android_asset/www/index.html' + uri);
            }
            else
            {
                return redirectUrl('/' + uri);
            }
        }

        function redirectUrl(url)
        {
            window.location.href = url;
        }

        return {
            redirectUri     : redirectUrl,
            redirectPath    : redirectPath,
            reload          : function()
            {
                window.location.reload();
            },
            reloadApp       : function()
            {
                redirectInternUri('');
            },
            path         : function(path)
            {
                return $location.path(path);
            },
            get         : function(name)
            {
                return $routeParams[name];
            }
        };
    }
]);
kinoulinkApp.factory("ui",
    ["Notification", function(Notification)
    {
        return {
            displayError: function (title, response)
            {
                if (response.hasOwnProperty('data'))
                {
                    if (response.data.hasOwnProperty('error'))
                    {
                        notifyDisplayToast('danger', title, response.data.error);
                    }
                    else
                    {
                        notifyDisplayToast('danger', title, response.data);
                    }
                }
                else if (response.hasOwnProperty('code'))
                {
                    if (response.code === 'E_VALIDATION')
                    {
                        var message = '';

                        for (var key in response.invalidAttributes)
                        {
                            message += key + ' : ' + response.invalidAttributes[key][0].message + "\n<br />";
                        }

                        notifyDisplayToast('danger', 'Erreur de validation', message);
                    }
                }
            }
        }
    }
]);
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

            dataService.apiPost('playlistinday', { calendar : token }, function(response)
            {

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
kinoulinkApp.controller("ForgotPassword", ["$scope", "data",
    function ($scope, dataService)
    {
        var htmlNode = angular.elementById('html');

        htmlNode.removeClass('loading');

        $scope.loading = false;
    }]);
kinoulinkApp.controller("LoginController", ["$scope", "$rootScope", "data", "router",
	function($scope, $rootScope, data, router)
{
	$scope.username = "";
	$scope.password = "";

    $scope.connected = false;

	$scope.username = data.getLocal('default_username');

	$scope.doLogin = function()
	{
		var extraData = {device : appConfig.device};

		data.setLocal('default_username', $scope.username);

		data.api('user/login', {email: $scope.username, password: $scope.password, extra : extraData}, function(response)
		{
			if (response.status == 200)
			{
                var form = angular.elementById('loginForm');

				ga('send', 'event', 'auth', 'login', 'email');

                router.reloadApp();

                $scope.connected = true;

                $rootScope.user = response.data.user;
                $rootScope.accessToken = response.data.access_token;

                data.setLocal('access_token', response.data.access_token);

/*
				if (appConfig.phonegap)
				{
					router.reloadApp();
				}
				else
				{
					form.removeAttr('onsubmit').removeAttr('ng-submit');

					(form[0]).submit();
				}*/
			}
			else
			{
                data.displayError('Connexion', response);
			}
		});
	};

    $scope.onInputFocus = function()
    {

    };
	
	$scope.openSite = function()
	{
		 window.open(encodeURI('http://www.kinoulink.com'), '_system', 'location=yes');
	};
}]);
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
kinoulinkApp.controller("MediaController", ["$scope", "$rootScope", "Media", "data", "Upload",
    function ($scope, $rootScope, Media, dataService, Upload)
    {
        $rootScope.menu = 'media';
        $rootScope.title = 'Mes Médias';

        $scope.medias = null;

        function refresh()
        {
            $scope.medias = Media.query({sort : 'createdAt DESC'});
        }

        $scope.onFileSelect = function(files)
        {
            var fileToUpload = files[0];

            $scope.uploadProgress = 0;

            $scope.upload = Upload.upload({
                url: appConfig.api + 'media/upload',
                method: 'POST',
                cache: false,
                responseType: "json",
                headers : {'Content-Type': 'application/x-www-form-urlencoded', 'X-Auth-Token' : $rootScope.accessToken},
                withCredentials: true,
                file: fileToUpload
            })
            .progress(function(evt)
            {
                $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
            })
            .success(function(data, status, headers, config)
            {
                $scope.uploadProgress = 0;

                if (data.status == 200)
                {
                    refresh();
                }
                else
                {
                    dataService.displayError('Téléchargement', data);
                }
            });
        };


        $scope.add = function()
        {
            dataService.api('user/media/upload', { device : $scope.add.code }, function(response)
            {
                refresh();
            });
        };

        refresh();
    }]);
kinoulinkApp.controller("MediaDetailsController", ["$scope", "$rootScope", "data", "router",
    function ($scope, $rootScope, dataService, router)
    {
        $scope.loading = true;
        $scope.newPlaylist = 0;

        $rootScope.menu = 'media';
        $rootScope.title = 'Mes Médias';

        $scope.media = {'title' : 'Chargement ...'};

        var token = router.get('token');

        function refresh()
        {
            dataService.apiGet('media/' + token, {}, function(response)
            {
                $scope.loading = false;

                if (response.status == 200)
                {
                    $scope.media = response.data;
                }
                else
                {
                    dataService.displayError('Media', response);
                }
            });
        }

        dataService.apiGet('playlist', {}, function(response)
        {
            $scope.playlists = response.data;
        })

        $scope.addToPlaylist = function()
        {
            dataService.apiPost('mediainplaylist', { playlist : $scope.newPlaylist.id, media : $scope.media.id}, function(response)
            {
                refresh();
            });
        };

        refresh();
    }]);
kinoulinkApp.controller('NotifyController', ['$scope', 'data', function($scope, data)
{
    var $body = document.getElementById('body');

    $scope.notif_title = null;
    $scope.notif_message = null;
    $scope.notif_type = null;

    function playSound()
    {
        document.getElementById("audioNotif").play();
    }

    function displayToast(event, options)
    {
        $scope.notif_type = options.type;
        $scope.notif_title =  options.title;
        $scope.notif_message =  options.message;

        setTimeout(function()
        {
            $scope.notif_type = null;
            $scope.$apply();
        }, 10000);
    }

    $scope.$on('notify.sound.play', playSound);
    $scope.$on('notify.toast.display', displayToast);

}]);
kinoulinkApp.controller("RegisterController", ["$scope", "$location", "data", "router",
	function($scope, $location, data, router)
{
    var htmlNode = angular.elementById('html'), hasFocus = false;

    $scope.user = {name : {first : "", last: "", mode: "b"} };
    $scope.pseudo_type = {b: "Prénom Nom", a : "Prénom N."};
    $scope.sso = null;
    $scope.loading = false;

    htmlNode.removeClass('loading');

    /*if (!browser.isIOS())
    {
        angular.elementById('registerBtFacebook').removeAttr('href');
        angular.elementById('registerBtLinkedin').removeAttr('href');
    }*/

    var searchObject = $location.search();

    if (searchObject.hasOwnProperty('email'))
    {
        $scope.user.email = searchObject.email;
    }

    if (searchObject.hasOwnProperty('firstname'))
    {
        $scope.user.name.first = searchObject.firstname;
    }

    if (searchObject.hasOwnProperty('lastname'))
    {
        $scope.user.name.last = searchObject.lastname;
    }

    $scope.doRegister = function()
	{
        var extraData   = {device : appConfig.device},
            params        = angular.extend(extraData, $scope.user);

        $scope.loading = true;

		data.api('user/create', params, function(response)
		{
            $scope.loading = false;

			if (response.status === 200)
			{
				data.setUser(response.data);

                ga('send', 'event', 'auth', 'register', 'Inscription', 1);

                if (appConfig.phonegap) {
                    router.reloadApp();
                }
                else {
                    var form = angular.elementById('registerForm');

                    form.removeAttr('onsubmit').removeAttr('ng-submit');

                    setTimeout(function () {
                        (form[0]).submit();
                    }, 150);
                }
			}
			else
			{
                data.notifyDisplayToast('danger', 'Inscription', response.data);
			}
		});
	};

    $scope.onInputFocus = function()
    {
        if (!hasFocus)
        {
            hasFocus = true;

            window.scrollTo(0, 150);
            document.body.scrollTop = 150;
        }
    };

}]);
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
kinoulinkApp.controller("device", ["$scope", "$rootScope", "Device", "router",
    function ($scope, $rootScope, Device, router)
    {
        $rootScope.menu = "devices";
        $rootScope.title = 'KTV';

        $scope.edition = false;
        $scope.errorEdition = "";

        function refresh()
        {
            $scope.device = Device.get({ id : router.get('token') });
        }

        $scope.sendAction = function(action)
        {
            dataService.api('user/devices/actions/add', { device : device, action : action }, function(response)
            {
                refresh();
            });
        };

        $scope.removeMedia = function(media)
        {
            dataService.api('user/devices/media/remove', { device : device, media : media }, function(response)
            {
                refresh();
            });
        };

        refresh();

    }]);
kinoulinkApp.controller("devices", ["$scope", "$rootScope", "Device",
    function ($scope, $rootScope, Device)
    {
        $rootScope.menu = 'devices';
        $rootScope.title = 'KTV';

        $scope.deviceNew = {};
        $scope.error = '';

        function refresh()
        {
            $scope.devices = Device.query();
        }

        $scope.add = function()
        {
            (new Device($scope.deviceNew)).$save(function(response)
            {
                if (response.status == 200)
                {
                    refresh();
                }
                else
                {
                    $scope.error = response.data;
                }
            });
        };

        refresh();

    }]);
kinoulinkApp.controller("home", ["$scope", "data",
    function ($scope, dataService)
    {


    }]);
kinoulinkApp.controller("menu", ["$scope", "$window", "data",
    function ($scope, $window, dataService)
    {
        $scope.logout = function()
        {
            localStorage.removeItem('access_token');

            $window.location.reload();
        };

    }]);
kinoulinkApp.controller("PlaylistController", ["$scope", "$rootScope", "$timeout", "Playlist", "MediaInPlaylist", "data", "router", "Upload",
    function ($scope, $rootScope, $timeout, Playlist, MediaInPlaylist, dataService, router, Upload)
    {
        $rootScope.menu = "playlist";
        $rootScope.title = 'Playlist';

        var token = router.get('token');

        function refresh()
        {
            $scope.playlist = Playlist.get({ id : token});

            $scope.medias = MediaInPlaylist.query({ playlist : token, sort : 'createdAt DESC'});
        }

        $scope.removeLink = function(link)
        {
            MediaInPlaylist.remove({id : link.id}, function(response)
            {
                refresh();
            });
        };

        $scope.onFileSelect = function(files)
        {
            var fileToUpload = files[0];

            $scope.uploadProgress = 0;

            $scope.upload = Upload.upload({
                    url: appConfig.api + 'media/upload',
                    method: 'POST',
                    cache: false,
                    responseType: "json",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Auth-Token': $rootScope.accessToken
                    },
                    withCredentials: true,
                    file: fileToUpload
                })
                .progress(function (evt)
                {
                    $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
                })
                .success(function (data, status, headers, config)
                {
                    $scope.uploadProgress = 0;

                    if (data.status == 200)
                    {
                        refresh();
                    }
                    else
                    {
                        dataService.displayError('Téléchargement', data);
                    }
                });
        };

        var changeTimeoutPromise = null;

        $scope.mediaDurationChange = function(item)
        {
            if (changeTimeoutPromise)
            {
                $timeout.cancel(changeTimeoutPromise);
            }

            changeTimeoutPromise = $timeout(function()
            {
                dataService.apiPost('mediainplaylist/duration', {
                    id : item.id,
                    duration : item.duration
                }, function()
                {
                    refresh()
                });
            }, 500);
        };

        refresh();

    }]);
kinoulinkApp.controller("PlaylistsController", ["$scope", "$rootScope", "Playlist", "router",
    function ($scope, $rootScope, Playlist, router)
    {
        $rootScope.menu = "playlist";
        $rootScope.title = 'Playlist';

        $scope.playlists = [];
        $scope.error = null;

        function refresh()
        {
            $scope.playlists = Playlist.query({sort : 'createdAt DESC'});

            $scope.playlistNew = { 'color' : pastelColors()};
        }

        $scope.add = function()
        {
            (new Playlist($scope.playlistNew)).$save(function(response)
            {
                if (response.status == 200)
                {
                    $scope.playlistNew = {};
                    $scope.error = null;

                    refresh();
                }
                else
                {
                    $scope.error = response.data;
                }
            });
        };

        refresh();

        function pastelColors()
        {
            var r = (Math.round(Math.random()* 127) + 127).toString(16);
            var g = (Math.round(Math.random()* 127) + 127).toString(16);
            var b = (Math.round(Math.random()* 127) + 127).toString(16);
            return '#' + r + g + b;
        }
    }]);