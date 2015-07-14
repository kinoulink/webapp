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