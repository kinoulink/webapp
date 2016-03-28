appConfig.setupNotifications = function(successHandler, errorHandler)
{
    var pushNotification = window.plugins.pushNotification;

    if (device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos") {
        pushNotification.register(
            successHandler,
            errorHandler,
            {
                "senderID": "644732998951",
                "ecb": "onNotification"
            });
    }/* else if (device.platform == 'blackberry10') {
        pushNotification.register(
            successHandler,
            errorHandler,
            {
                invokeTargetId: "replace_with_invoke_target_id",
                appId: "replace_with_app_id",
                ppgUrl: "replace_with_ppg_url", //remove for BES pushes
                ecb: "pushNotificationHandler",
                simChangeCallback: replace_with_simChange_callback,
                pushTransportReadyCallback: replace_with_pushTransportReady_callback,
                launchApplicationOnPush: true
            });
    } else {
        pushNotification.register(
            tokenHandler,
            errorHandler,
            {
                "badge": "true",
                "sound": "true",
                "alert": "true",
                "ecb": "onNotificationAPN"
            });
    }*/
};

// Android and Amazon Fire OS
function onNotification(e)
{
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                appConfig.device.notification = {id : e.regid};
            }
        break;

        case 'message':
            console.log(e.payload);
            /*if ( e.foreground )
            {
            }
            else
            {  // otherwise we were launched because the user touched a notification in the notification tray.
                if ( e.coldstart )
                {
                    $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                }
                else
                {
                    $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
            }

            $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            //Only works for GCM
            $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            //Only works on Amazon Fire OS
            $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');*/
            break;

        case 'error':
            alert('Notification error: "' + e.msg + '"');
            break;

        default:
            break;
    }
}

