document.addEventListener("deviceready", function()
{
    appConfig.device = device;

    document.getElementById('html').classList.add(device.platform.toLowerCase());

    appConfig.setupNotifications(function()
    {
    }, function()
    {
    });

}, false);