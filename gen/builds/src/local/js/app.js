var kinoulinkApp = angular.module('kinoulinkApp', ['ngResource', 'ngRoute', 'ngSanitize', 'ngFileUpload', 'ui-notification', 'angular-loading-bar', 'ui.calendar'])

.run(['$rootScope', '$location', 'data', function($rootScope, $location, data)
{
    var $html = angular.elementById('html'),
        $body = angular.elementById('body');

    $html.removeClass('loading');

    if (_global_bootstrap_data !== null)
    {
        $rootScope.user = _global_bootstrap_data.user;
        $rootScope.accessToken = _global_bootstrap_data.access_token;
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

        .when('/devices', {
            templateUrl: bzrup('devices'),
            controller: 'DevicesController'
        })
        .when('/devices/:token', {
            templateUrl: bzrup('device'),
            controller: 'DeviceController'
        })
        .when('/devices/:token/media/add', {
            templateUrl: bzrup('deviceMediaAdd'),
            controller: 'DeviceMediaAddController'
        })

        .when('/calendar', {
            templateUrl: bzrup('calendar_list'),
            controller: 'CalendarsController'
        })
        .when('/calendar/:token', {
            templateUrl: bzrup('calendar_details'),
            controller: 'CalendarController'
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
kinoulinkApp.filter('kinoulinkState', function()
{
    return function(value)
    {
       if (value === 1)
       {
           return 'Accepté';
       }
       else if (value === 2)
       {
           return 'Décliné';
       }
       else
       {
           return 'En attente';
       }
    };
});
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
        var $element = $(element);

        dataService.apiGet('playlist', {}, function(response)
        {
            response.data.forEach(function(item)
            {
                $element.append('<option value="' + item.id + '">' + item.title + '</option>');
            });

            /*$element.select2({
                placeholder: "toto"
            })
            .on('change', function(e)
            {
                $timeout((function(model)
                {
                    model.$setViewValue($element.select2("val"));
                })(model), 100);
            })*/
        });

        scope.$watch(attrs.ngModel, function()
        {
            console.log('edited');
        });
    }

    return {
        restrict : 'A',
        template : '',
        link : link
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
            callback(response);
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

            callback(response);
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
kinoulinkApp.controller("DeviceController", ["$scope", "$rootScope", "data", "router",
    function ($scope, $rootScope, dataService, router)
    {
        $rootScope.menu = "devices";

        var device = router.get('token');

        function refresh()
        {
            dataService.apiGet('device/' + device, { }, function(response)
            {
                $scope.device = response.data;
            });
        }

        $scope.addMedia = function()
        {
            dataService.api('user/devices/media/add', { device : device }, function(response)
            {
                refresh();
            });
        };

        $scope.detach = function()
        {
            dataService.api('user/devices/detach', { device : device }, function(response)
            {
                refresh();
            });
        };

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
kinoulinkApp.controller("DeviceMediaAddController", ["$scope", "$rootScope", "data", "router",
    function ($scope, $rootScope,dataService, router)
    {
        $rootScope.menu = "devices";

        var device = router.get('token');

        $scope.device = device;

        function refresh()
        {
            dataService.api('user/media/', { device : device}, function(response)
            {
                $scope.medias = response.data;
            });
        }

        $scope.addMedia = function(media)
        {
            dataService.api('user/devices/media/add', { device : device, media : media._id}, function(response)
            {
                router.path('/devices/' + $scope.device);
            });
        };

        refresh();

    }]);
kinoulinkApp.controller("DevicesController", ["$scope", "$rootScope", "data",
    function ($scope, $rootScope,dataService)
    {
        $rootScope.menu = 'devices';

        $scope.deviceNew = {};

        function refresh()
        {
            dataService.apiGet('device', {}, function(response)
            {
                $scope.devices = response.data;
            });
        }


        $scope.add = function()
        {
            dataService.apiPost('device/create', $scope.deviceNew, function(response)
            {
                if (response.status == 200)
                {
                    refresh();
                }
                else
                {
                    dataService.displayError('Nouvelle KTV', response);
                }
            });
        };

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
kinoulinkApp.controller("MediaController", ["$scope", "$rootScope", "data", "Upload",
    function ($scope, $rootScope, dataService, Upload)
    {
        $scope.loading = true;
        $rootScope.menu = 'media';
        $rootScope.title = 'Mes Médias';

        function refresh()
        {
            dataService.apiGet('media', {}, function(response)
            {
                $scope.loading = false;

                if (response.status == 200)
                {
                    $scope.medias = response.data;
                }
                else
                {
                    dataService.displayError('Media', response);
                }
            });
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
            dataService.apiPost('mediainplaylist', { playlist : $scope.newPlaylist, media : $scope.media.id}, function(response)
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
kinoulinkApp.controller("PlaylistController", ["$scope", "$rootScope", "data", "router", "Upload",
    function ($scope, $rootScope, dataService, router, Upload)
    {
        $rootScope.menu = "playlist";
        $rootScope.title = 'Playlist';

        var token = router.get('token');

        function refresh()
        {
            dataService.apiGet('playlist/' + token, { }, function(response)
            {
                $scope.playlist = response.data;
            });
        }

        $scope.addMedia = function()
        {
            dataService.api('user/devices/media/add', { device : device }, function(response)
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

        refresh();

    }]);
kinoulinkApp.controller("PlaylistsController", ["$scope", "$rootScope", "data", "router",
    function ($scope, $rootScope, dataService, router)
    {
        $rootScope.menu = "playlist";
        $rootScope.title = 'Playlist';

        $scope.playlists = [];
        $scope.playlistNew = {};

        function refresh()
        {
            dataService.apiGet('playlist', { }, function(response)
            {
                $scope.playlists = response.data;
            });
        }

        $scope.add = function()
        {
            dataService.apiPost('playlist/create', $scope.playlistNew, function(response)
            {
                if (response.status == 200)
                {
                    refresh();
                }
                else
                {
                    dataService.displayError('Nouvelle Playlist', response);
                }
            });
        };

        refresh();

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