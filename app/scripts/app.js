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
    }).when('/event', {
        templateUrl: bzrup("event/event"),
        controller: "EventIndex"
    }).when('/event/create', {
        templateUrl: bzrup("event/create"),
        controller: 'EventCreate'
    }).when('/event/:uid', {
        templateUrl: bzrup("event/viewer"),
        controller: "EventDetails",
        ga: '/event/details'
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
        .when('/people', {
                templateUrl: bzrup('people'),
                controller: 'PeopleController',
                reloadOnSearch: false
            })
        .when('/account', {
            templateUrl: bzrup('my/profile'),
            controller: 'UserProfileController'
        })
        .when('/me/invitations', {
            templateUrl: bzrup('kinoulinking/index'),
            controller: 'InvitationsController'
        })
        .when('/refering/linkedin',
        {
            templateUrl : bzrup('refering/linkedin'),
            controller: 'ReferingLinkedin'
        })
        .when('/kinoulink/new', {
            templateUrl: bzrup("kinoulinking/create"),
            controller: 'kinoulinkProposalController'
        })
        .when('/kinoulink/:uid', {
            templateUrl: bzrup("kinoulinking/details"),
            controller: 'kinoulinkDetailsController'
        })
        .when('/me', {
            templateUrl: bzrup("me_profile"),
            controller: 'MeProfileController'
        })
        .when('/me/notifications/emails', {
            templateUrl: bzrup("me/emails"),
            controller: 'MeNotifEmails'
        })
        .when('/me/inbox', {
            templateUrl: bzrup("me_inbox"),
            controller: 'MeInboxController'
        })
        .when('/me/inbox/t-:uid', {
            templateUrl: bzrup("messenger"),
            controller: 'MessengerController'
        })
        .when('/me/contacts', {
            templateUrl: bzrup("me_contacts"),
            controller: 'MeContactsController'
        })
        .when('/r/:uid', {
            templateUrl: bzrup("restaurant"),
            controller: 'RestaurantController'
        })
        .when('/u/:uid', {
            templateUrl: bzrup("user_profile"),
            controller: 'UserProfileController'
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
        url: bz.api + 'auth/me',
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