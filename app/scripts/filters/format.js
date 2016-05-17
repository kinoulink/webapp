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
        return moment(input).fromNow(true);
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
});