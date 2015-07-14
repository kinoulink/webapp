document.addEventListener("deviceready", function()
{
    bz.device = device;

    document.getElementById('html').classList.add(device.platform.toLowerCase());

    bz.setupNotifications(function()
    {
    }, function()
    {
    });

}, false);