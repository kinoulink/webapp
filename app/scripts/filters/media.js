kinoulinkApp.filter('thumbnail', function()
{
    return function(media)
    {
       return '//localhost:1337/media/thumbnail/' + media.token + '.jpg';
    };
});