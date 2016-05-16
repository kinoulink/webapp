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