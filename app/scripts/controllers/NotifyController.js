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

    data.onRemoteMessage('chat.message.received', function (incomingData)
    {
        var eventSent = data.sendMessage('chat.message.received', incomingData);

        if (!eventSent.defaultPrevented)
        {
            data.user.notifications.messages++;

            data.sendMessage('bind.user');

            playSound();
        }
    });

    data.onRemoteMessage('push.user', function (incomingData)
    {
        if (incomingData.hasOwnProperty('notifications'))
        {
            data.user.notifications.messages    = incomingData.notifications.messages;
            data.user.notifications.invitations = incomingData.notifications.invitations;

            data.sendMessage('bind.user');
        }
    });
}]);