var kinoulinkMe = null, kinoulinkApp = angular.module('kinoulinkApp', ['ngResource', 'ngRoute', 'ngSanitize', 'angularFileUpload', 'angular-loading-bar'])

.run(['$rootScope', '$location', 'data', function($rootScope, $location, data)
{
    var $html = angular.elementById('html'),
        $body = angular.elementById('body');

    $html.removeClass('loading');

    if (kinoulinkMe !== null)
    {
        data.setUser(kinoulinkMe);
    }

    $rootScope.$on('$routeChangeSuccess', function(ev, evData)
    {
        $body.attr('class', evData.controller);

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

    if (kinoulinkMe === null)
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
            redirectTo: '/register'
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
        .when('/media', {
            templateUrl: bzrup('media'),
            controller: 'MediaController'
        })
        .otherwise({
            redirectTo: '/'
        });
    }
}]);

(function()
{
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');

    $http({
        method: 'POST',
        url: bz.api + 'user/me',
        withCredentials: true,
        cache: false,
        responseType: "json",
        timeout : 20000,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
    }).
    error(function(data)
    {
        if (data === null)
        {
            data = {data : {message : "Vérifiez votre connexion Internet!"}};
        }

        angular.elementById('body').html('<div style="margin:2em" class="alert alert-danger"><h1>Oups, kinoulink a un problème: </h1><p>' + data.data.message + '</p></div>');
    }).
    then(function(response)
    {
        var apiResponse = response.data;

        if (apiResponse.status === 200)
        {
            kinoulinkMe = apiResponse.data;

            ga('set', '&uid', kinoulinkMe.id);
        }

        angular.element(document).ready(function() {
            angular.bootstrap(document, ['kinoulinkApp']);
        });
    })
})();

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
    if (_bzConfig.hasOwnProperty('release'))
    {
        url += '.' + _bzConfig.release;
    }

    return 'views/' + url + '.html';
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