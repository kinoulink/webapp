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
                foundUser = {title : 'kinoulink', avatar: appConfig.root + 'images/avatar.gif'};
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