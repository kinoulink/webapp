var kinoulinkMe = null, kinoulinkApp = angular.module('kinoulinkApp', ['ngResource', 'ngRoute', 'ngSanitize', 'ngFileUpload', 'angular-loading-bar'])

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
            return moment(value, 'DD/MM/YYYY').format('dddd D MMMM');
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
        return moment(input * 1000).fromNow(true);
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
}).filter('distance', ['data', 'geolocation', function(dataService, geolocation)
{
    return function(input)
    {
        if (input === null || typeof input === 'undefined') return '';

        var distance = geolocation.getDistanceSimple(dataService.user.position, input);

        if (distance < 0)
        {
            return (distance * 1000).toFixed(0) + ' m';
        }
        else
        {
            return distance.toFixed(2) + ' km';
        }
    };
}]).filter('distance2', function()
{
   return function (distance)
   {
       if (distance.toFixed(0) <= 0)
       {
           return (distance * 1000).toFixed(0) + ' m';
       }
       else
       {
           return distance.toFixed(0) + ' km';
       }
   }
});
kinoulinkApp.directive('bzInvitationsReceived', ['data', '$compile', function(dataService, $compile)
{
    var userID;

    function link(scope, element, attr)
    {
        userID = scope.me.id;

        scope.$watch(attr.bzInvitationsReceived, function(value)
        {
            angular.forEach(value, function(item)
            {
                element.append(renderInvitation(item));
            });

            $compile(element.contents())(scope);
        });
    }

    function renderInvitation(invitation)
    {
        var accepted = false, declined = false, author = invitation.author.id === userID, html = '<div class="clearfix __row">';

            html += '<div class="table-cell _w-a"><a ng-href="#/u/' + invitation.author.id + '"><img src="' + invitation.author.avatar.big + '" /></a> </div>';

            html += '<div id="invitation-' + invitation.id + '" class="panel-form __m"><div class="row">';

                if (invitation.hasOwnProperty('workflow'))
                {
                    angular.forEach(invitation.workflow, function (step)
                    {
                        if (step.user === dataService.user.id)
                        {
                            if (step.status == 1)
                            {
                                accepted = true;

                                html += '<span class="ribbon _accepted"><i class="fa fa-check"></i></span>';
                            }
                            else if (step.status == 2)
                            {
                                declined = true;

                                html += '<span class="ribbon _declined"><i class="fa fa-plus"></i></span>';
                            }
                        }
                    });
                }

                html += '<div class="col-sm-8">';

                if (author)
                {
                    html += '<h4>Vous avez lancé un bilzunch</h4>';
                }
                else
                {
                    html += '<h4>' + invitation.author.title + ' vous invite à un kinoulink</h4>';
                }

                html += '<span class="__st">' + formatTimeAgo(invitation.createdat) + '</span>' +
                            '<p><i class="fa fa-clock-o"></i> ' + formatDateVerbose(invitation.date) + ' (' + formatDateShortFuture(invitation.when) + ') à ' + invitation.time + '</p>' +
                            '<p><i class="fa fa-map-marker"></i> ' + invitation.place + '</p>';

                            html += '<div>';

                if (invitation.guests.length === 1)
                {
                    html += '<p><i class="fa fa-users"></i> un ' + (author ? '' : 'autre ') +  'invité</p>';
                }
                else if (invitation.guests.length > 0)
                {
                    html += '<p><i class="fa fa-users"></i> ' + invitation.guests.length + (author ? '' : ' autres') +  ' invités</p>';
                }

                html += '</div>';

                html += '</div>';

                html += '<div class="col-sm-4">';

                invitation.guests.forEach(function(item)
                {
                    html += '<span class="guest"><img src="' + item.avatar.small + '" /><br/>' + item.title  + '</span>';
                });

                html += '</div></div>'; // end row

                html += '<div class="_f">';

                    if (!declined && !accepted && !author)
                    {
                        html += '<a class="_a3 pull-right" ng-click="decline(\'' + invitation.id + '\')"><i class="fa fa-times" style="color:indianred"></i> Décliner</a>';
                        html += '<a class="_a2 pull-right" ng-click="accept(\'' + invitation.id + '\')"><i class="fa fa-check" style="color:darkseagreen"></i> Accepter</a>';
                    }

                    html += '<a class="_a1" ng-href="#/kinoulink/' + invitation.id + '">Voir en détails</a>';

                html += '</div>';

        html += '</div></div>';

        return html;
    }

    function formatDateVerbose(value)
    {
        return moment(value, 'DD/MM/YYYY').format('dddd D MMMM');
    }

    function formatDateShortFuture(value)
    {
        return moment(value * 1000).from(moment());
    }

    function formatTimeAgo(value)
    {
        return moment(value * 1000).from(moment());
    }

    return {
        restrict: 'A',
        invitations: '=bz-invitations-received',
        link: link
    };
}]);
kinoulinkApp.directive('bzLoader', function()
{
    return {
        restrict: 'E',
        templateUrl : bzrup('directives/loader')
    }
});
kinoulinkApp.directive('bzkinoulinkMessenger', ['data', function(dataService)
{
    var previousMessageItem = null, timerScrollBottom = 0, agoCurrent = null, isInitPhase = true, isNoMessages = true,
        bodyNode = document.getElementById('body');

    function link(scope, rootNode, attr)
    {
        scope.submitMessage = function()
        {
            var message     = scope.message,
                threadUID   = scope.thread.id,
                uid         = dataService.user.id.substr(0, 16) + '-' + (new Date()).getTime();

            if (message.length === 0)
            {
                return ;
            }

            dataService.sendRemoteMessage('chat.message.send', {m : message, t : threadUID});

            dataService.api("inbox/thread/messages/post", {message : message, thread : threadUID, uid : uid}, function(response)
            {

            });

            renderMessage({
                id:         uid,
                user:       dataService.user.id,
                message:    message,
                date:       (new Date()).getTime()/1000
            });

            scope.message = '';
        };

        scope.onMessageRead = function(message)
        {
            if (dataService.user.notifications.messages > 0)
            {
                dataService.user.notifications.messages--;

                dataService.sendMessage('bind.user');
            }

            dataService.sendRemoteMessage('chat.message.read', {i: message.id, t: scope.thread.id});
        };

        scope.$watch('thread', function (value)
        {
            if (angular.isDefined(value))
            {
                scope.thread = value;

                if (value.messages.length === 0)
                {
                    rootNode.append('<span id="messengerNoMessages" class="text-embossed">Aucun message ;-(</span>');
                }
                else
                {
                    value.messages.sort(function(a, b)
                    {
                        return a.date < b.date ? -1 : 1;
                    });

                    angular.forEach(value.messages, function (message) {
                        renderMessage(message);
                    });
                }

                isInitPhase = false;
            }
        });

        scope.$on('chat.message.received', function (event, incomingData)
        {
            if (scope.thread !== null && incomingData.t === scope.thread.id)
            {
                renderMessage({
                    id:         incomingData.i,
                    user:       incomingData.f,
                    message:    incomingData.m,
                    date:       (new Date()).getTime()/1000
                });

                event.preventDefault();
            }
        });

        function getUser(userID)
        {
            var foundUser;

            angular.forEach(scope.thread.users, function (user) {
                if (user.id === userID) {
                    foundUser = user;
                }
            });

            if (foundUser === null) {
                foundUser = {title : 'kinoulink', avatar: bz.root + 'images/avatar.gif'};
            }

            return foundUser;
        }

        function renderMessage(message)
        {
            var userID          = message.user,
                user            = getUser(userID),
                clazz           = (userID === dataService.user.id ? 'from' : 'to'),
                chatNode        = angular.element(rootNode.children()[0]),
                agoMessage      = moment(message.date * 1000).fromNow(),
                messageContent  = parseMessage(message.message);

            if (isNoMessages)
            {
                isNoMessages = false;

                angular.elementById('messengerNoMessages').remove();
            }

            if (message.user === 'kinoulink')
            {
                if (agoMessage !== agoCurrent) {
                    chatNode.append('<dd class="text-center text-embossed __date"><span>' + agoMessage + '</span></dd>');
                }

                chatNode.append('<dd class="_message-notify _type-' + message.type + '">' + messageContent + '</dd>');

                previousMessageItem = null;
            }
            else {
                if (agoMessage === agoCurrent && previousMessageItem !== null && previousMessageItem.data.user === userID) {
                    var htmlNode = document.getElementById(previousMessageItem.htmlNodeID);

                    // if (htmlNode !== null) {
                    htmlNode.innerHTML += '<br />' + messageContent;
                    // }
                }
                else {
                    var htmlNodeID = 'messenger-message-' + Math.floor(Math.random() * 10000000000);

                    if (agoMessage !== agoCurrent) {
                        chatNode.append('<dd class="text-center text-embossed __date"><span>' + agoMessage + '</span></dd>');
                    }

                    chatNode.append('<dd class="' + clazz + '"><p id="' + htmlNodeID + '">' + messageContent + '</p><img class="avatar" src="' + user.avatar + '" /></dd>');

                    previousMessageItem = {data: message, htmlNodeID: htmlNodeID};
                }
            }

            agoCurrent = agoMessage;

            clearTimeout(timerScrollBottom);

            timerScrollBottom = setTimeout(function () {
                window.scrollTo(0, bodyNode.scrollHeight);
            }, isInitPhase ? 500 : 50);

            if (message.hasOwnProperty('id')
                && message.hasOwnProperty('unread')
                && angular.isDefined(message.unread.indexOf)
                && message.unread.indexOf(dataService.user.id) >= 0)
            {
                scope.onMessageRead(message);
            }
        }

    }

    function parseMessage(message)
    {
        if (message === null || message.length === 0)
        {
            return '';
        }

        var replacePatternHTTP  = /(\b(https?):\/\/[-A-Z0-9+&amp;@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;@#\/%=~_|])/ig,
            replacePatternWWW   = /(^|[^\/])(www\.[\S]+(\b|$))/gim,
            emoticonsMap        = {';-)' : 'happy', ':-)' : 'happy', ':p' : 'tongue', ';(' : 'sad', ':(' : 'sad', ';-(' : 'sad', ':s' : 'wink', ':o' : 'confused'},
            emoticonsMap2       = ['wink', 'grin', 'cool', 'angry', 'evil', 'shocked', 'baffled', 'confused', 'neutral', 'sleepy', 'crying'],
            tokens              = message.split(' '),
            newMessage          = '',


        message = htmlentities(message);

        message = message.replace(replacePatternHTTP, '<a class="colored-link-1" title="$1" href="$1" target="_blank">$1</a>');

        message = message.replace(replacePatternWWW, '$1<a class="colored-link-1" href="http://$2" target="_blank">$2</a>');

        angular.forEach(tokens, function(token)
        {
            if (emoticonsMap.hasOwnProperty(token))
            {
                newMessage += '<i class="icon-' + emoticonsMap[token] + '"></i>';
            }
            else if (token[0] === '(' && token[token.length - 1] === ')')
            {
                var k = token.substring(1, token.length - 1);

                if (emoticonsMap2.indexOf(k) > -1)
                {
                    newMessage += '<i class="icon-' + k + '"></i>';
                }
                else
                {
                    newMessage += token;
                }
            }
            else
            {
                newMessage += token;
            }

            newMessage += ' ';
        });

        return newMessage;
    }

    return {
        restrict: 'A',
        template: '<dl class="chat"></dl>' +
            '<form class="message-input" ng-submit="submitMessage()">' +
                '<input name="message" type="text" ng-model="message" placeholder="Entrez votre message ici ...">' +
                '<button type="submit"><i class="fa fa-chevron-right"></i></button>' +
            '</form>',
        scope: {
            'thread' : '=bzThread',
            'onThread' : '=bzOnThread',
            'message' : '@'
        },
        link: link
    };
}]);
kinoulinkApp.directive('bzPresence', ['$http', function($http)
{
    function link(scope, element, attr)
    {
        var user = null;

        scope.refresh = function()
        {
            $http({
                method: 'GET',
                url:'http://messenger.kinoulink.fr/presence/' + user.id,
                withCredentials: false,
                cache: false,
                responseType: "json",
                timeout : 20000,
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                error(function(data)
                {
                }).
                then(function(response)
                {
                    var status = response.data.status;

                    if (status === 200)
                    {
                        element.html('<img src="' + bz.root + 'images/presence-online.png" />');
                    }
                    else
                    {
                        element.html('');
                    }
                })
        };

        scope.$watch(attr.bzUser, function(value)
        {
            user = value;

            scope.refresh();
        });
    }

    return {
        'restrict' : 'E',
        'template' : '',
        'link' : link
    };
}]);
kinoulinkApp.directive('bzRestaurantsBook', ['data', 'geolocation', function(data, geolocation)
{
    function link($scope, element, attrs)
    {
        $scope.restaurants = null;
        $scope.search = '';

        $scope.$watch('search', function(value)
        {
            data.api('data/search', {places : true, users: false, query : value}, function(response)
            {
                if (response.status === 200)
                {
                    $scope.restaurants = response.data.hits;
                }
            });
        });
    }

    function buildUI(searchQuery)
    {
        var _restos = [];

        angular.forEach(allRestaurants, function(item)
        {
            var contact = {
                id: item.id,
                title: item.title,
                status: getStatus(item),
                href: '/r/' + item.id
            };

            _restos.push(contact);
        });

        _restos.sort(function(a, b)
        {
            return a.title < b.title ? 1 : -1;
        });

        return _restos;
    }

    function getStatus(item)
    {
        var j = item.details.address.street + "", s = item.details.address.city + "";

        if (j.length > 0 && s.length > 0)
        {
            return j + ', ' + s;
        }
        else
        {
            return j + s;
        }
    }

    return {
        restrict: 'A',
        templateUrl: bzrup('directives/restaurants_book'),
        link: link
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
(function(angular, bz)
{
	var instance = null;
	
	function DataService($rootScope, $http)
	{
		this.user       = null;
		this.$rootScope = $rootScope;
		this.$http      = $http;
        this.apiRoot    = bz.api;
        this.socket     = null;

        this.$rootScope.messenger_connected = false;
	}


    DataService.prototype.sendMessage = function(name, args)
    {
        return instance.$rootScope.$broadcast(name, args);
    };

	DataService.prototype.setUser = function(value)
	{
        if (instance.user === null)
        {
            instance.user = value;
        }

		instance.user = value;

        instance.sendMessage('bind.user', value);
	};

    DataService.prototype.displayError = function(title, response)
    {
        if (response.data.hasOwnProperty('error'))
        {
            this.notifyDisplayToast('danger', title, response.data.error);
        }
        else
        {
            this.notifyDisplayToast('danger', title, response.data);
        }
    };
	
	DataService.prototype.api = function(service, param, callback)
	{
        if (instance.user !== null)
        {
            param['user_access_token'] = instance.user.access_token;
        }

		return instance.$http({
			method: 'POST',
			url: instance.apiRoot + service,
			data: param,
			withCredentials: true,
			cache: false,
			responseType: "json",
            timeout : 20000,
			headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
		}).
        success(function(response, status, headers, config)
        {
            if (response === null)
            {
                instance.notifyDisplayToast('danger', 'kinoulink API', 'Le serveur kinoulink semble rencontrer un petit problème ;-(');

                response = {status:500, data:null};
            }

           /* if (parseInt(response.status) >= 300)
            {
                instance.notifyDisplayToast('danger', 'kinoulink API', 'Le serveur kinoulink semble rencontrer un petit problème: ' + response.data.message);
            }
*/
            callback(response);
        }).error(function(response, status, headers, config)
        {
            var error;

            if (response === null)
            {
                response = {status:500, data:null};

                error = 'Le serveur kinoulink semble rencontrer un petit problème ;-(';
            }
            else
            {
                error = 'Le serveur kinoulink semble rencontrer un petit problème: ' + response.data;
            }

            instance.notifyDisplayToast('danger', 'kinoulink API', error);

            callback(response);
		});
	};

    DataService.prototype.notifyDisplayToast = function(type, title, message)
    {
        instance.sendMessage('notify.toast.display', {type: type, title: title, message: message});
    };

    DataService.prototype.notifyPlaySound = function()
    {
        instance.sendMessage('notify.sound.play');
    };
	
	kinoulinkApp.factory("data", ["$rootScope", "$http", function($rootScope, $http)
	{
		if (instance === null)
		{
			instance = new DataService($rootScope, $http);
		}
		
		return instance;
	}]);
})(angular, window.bz);
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
            if (bz.phonegap)
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
kinoulinkApp.controller("DeviceController", ["$scope", "data", "router",
    function ($scope, dataService, router)
    {
        var device = router.get('token');

        function refresh()
        {
            dataService.api('user/devices/details', { device : device}, function(response)
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
kinoulinkApp.controller("DeviceMediaAddController", ["$scope", "data", "router",
    function ($scope, dataService, router)
    {
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
kinoulinkApp.controller("DevicesController", ["$scope", "data",
    function ($scope, dataService)
    {
        function refresh()
        {
            dataService.api('user/devices/', {}, function(response)
            {
                $scope.devices = response.data;
            });
        }


        $scope.add = function()
        {
            dataService.api('user/devices/attach', { device : $scope.add.code }, function(response)
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
kinoulinkApp.controller("LoginController", ["$scope", "data", "router",
	function($scope, data, router)
{
	$scope.username = "";
	$scope.password = "";

    if (data.user !== null)
    {
        router.reloadApp();
    }

	if (bz.phonegap)
	{
		$scope.username = window.localStorage.getItem('default_username');
	}

	$scope.doLogin = function()
	{
		var extraData = {device : bz.device};

		if (bz.phonegap)
		{
			window.localStorage.setItem('default_username', $scope.username);
		}

		data.api('user/auth/login', {login: $scope.username, password: $scope.password, extra : extraData}, function(response)
		{
			if (response.status === 200)
			{
                var form = angular.elementById('loginForm');

				ga('send', 'event', 'auth', 'login', 'email');

				if (bz.phonegap)
				{
					router.reloadApp();
				}
				else
				{
					form.removeAttr('onsubmit').removeAttr('ng-submit');

					(form[0]).submit();
				}
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
		 window.open(encodeURI('http://www.kinoulink.fr'), '_system', 'location=yes');
	};

	$scope.openConnect = function(vendor)
	{
		window._kinoulink_callback = function(response)
		{
			if (response.status === 200)
			{
				if (response.data.hasOwnProperty('action')) {
					if (response.data.action === 'register') {
						if (confirm("Nous n'avons trouvé aucun compte rattaché, souhaitez vous vous inscrire à Bizlunch ?")) {
							router.redirectPath('register');
						}
					}
					else
					{
						ga('send', 'event', 'auth', 'login', vendor);

						return router.reloadApp();
					}
				}
				else
				{
					data.notifyDisplayToast('danger', 'Connexion', 'Erreur serveur, action is missing!');

					$scope.$apply();
				}
			}
			else
			{
				data.notifyDisplayToast('danger', 'Connexion', response.data.message);

				$scope.$apply();
			}
		};

		if (bz.phonegap)
		{
			var ssoWindow = window.open(bz.my + 'api/auth/' + vendor + '/authorize', '_blank', 'location=no');

			ssoWindow.addEventListener('loadstop', function (event)
			{
				var url = event.url;

				if (url.indexOf('my.kinoulink.fr/api/auth/') > -1 && url.indexOf('authorize/callback') > 0) {
					ssoWindow.executeScript({
						code: 'window.callbackData'
					}, function (values) {
						window._kinoulink_callback(values[0]);

						setTimeout(function () {
							ssoWindow.close();
						}, 50);
					});
				}
			});
		}
		else
		{
			window.open(bz.api + '/auth/' + vendor + '/authorize', 'Bizlunch Connect', 'width=600,height=300');

            window.onmessage = function(e)
            {
                window._kinoulink_callback(e.data);
            };
		}
	}
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
kinoulinkApp.controller("MediaController", ["$scope", "data", "$upload",
    function ($scope, dataService, $upload)
    {
        function refresh()
        {
            dataService.api('user/media/', {}, function(response)
            {
                $scope.medias = response.data;
            });
        }

        $scope.onFileSelect = function(files)
        {
            var fileToUpload = files[0];

            $scope.uploadProgress = 0;

            $scope.upload = $upload.upload({
                url: dataService.apiRoot + 'user/media/upload',
                method: 'POST',
                cache: false,
                responseType: "json",
                headers : {'Content-Type': 'application/x-www-form-urlencoded'},
                withCredentials: true,
                file: fileToUpload
            }).progress(function(evt) {
                $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config)
            {
                $scope.uploadProgress = 0;

                refresh();
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
        var extraData   = {device : bz.device},
            params        = angular.extend(extraData, $scope.user);

        $scope.loading = true;

		data.api('user/auth/register', params, function(response)
		{
            $scope.loading = false;

			if (response.status === 200)
			{
				data.setUser(response.data);

                ga('send', 'event', 'auth', 'register', 'Inscription', 1);

                if (bz.phonegap) {
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

    $scope.openConnect = function(vendor)
    {
        window._kinoulink_callback = function(response)
        {
            if (response.status === 200)
            {
                if (response.data.hasOwnProperty('action')) {
                    if (response.data.action === 'register') {
                        var userData = response.data.user;

                        $scope.sso = {
                            vendor: vendor
                        };

                        if (userData.hasOwnProperty('first_name'))
                        {
                            $scope.user.name.first = userData.first_name;
                        }

                        if (userData.hasOwnProperty('last_name'))
                        {
                            $scope.user.name.last = userData.last_name;
                        }

                        if (userData.hasOwnProperty('email'))
                        {
                            $scope.user.email = userData.email;
                        }

                        if (userData.hasOwnProperty('firstName'))
                        {
                            $scope.user.name.first = userData.firstName;
                        }

                        if (userData.hasOwnProperty('lastName'))
                        {
                            $scope.user.name.last = userData.lastName;
                        }

                        if (userData.hasOwnProperty('emailAddress'))
                        {
                            $scope.user.email = userData.emailAddress;
                        }

                        if (userData.hasOwnProperty('job'))
                        {
                            $scope.user.job = userData.job;
                        }

                        if (userData.hasOwnProperty('sector'))
                        {
                            $scope.user.sector = userData.sector;
                        }

                        $scope.user.sso = {vendor: vendor, token: response.data.token};
                    }
                    else
                    {
                        return router.reloadApp();
                    }
                } else {
                    data.notifyDisplayToast('danger', 'Connexion', 'Erreur serveur, action is missing!');
                }
            }
            else
            {
                data.notifyDisplayToast('danger', 'Connexion', response.data.message);
            }

            $scope.$apply();
        };

        if (bz.phonegap)
        {
            var ssoWindow = window.open(bz.api + '/auth/' + vendor + '/authorize', '_blank', 'location=no');

            ssoWindow.addEventListener('loadstop', function (event)
            {
                var url = event.url;

                if (url.indexOf('my.kinoulink.fr/api/auth/') > -1 && url.indexOf('authorize/callback') > 0) {
                    ssoWindow.executeScript({
                        code: 'window.callbackData'
                    }, function (values) {
                        window._kinoulink_callback(values[0]);

                        setTimeout(function () {
                            ssoWindow.close();
                        }, 50);
                    });
                }
            });
        }
        else
        {
            window.open(bz.api + '/auth/' + vendor + '/authorize', 'Bizlunch Connect', 'width=600,height=300');

            window.onmessage = function(e)
            {
                window._kinoulink_callback(e.data);
            };
        }
    }
}]);
kinoulinkApp.controller("home", ["$scope", "data",
    function ($scope, dataService)
    {


    }]);