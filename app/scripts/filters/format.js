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