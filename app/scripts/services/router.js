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