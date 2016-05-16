(function()
{
    var initInjector = angular.injector(['ng']);
    var $http = initInjector.get('$http');
    var accessToken = localStorage.getItem('access_token');

    $http({
        method: 'POST',
        url: appConfig.api + 'user/me',
        withCredentials: true,
        cache: false,
        responseType: "json",
        timeout : 20000,
        headers : {'Content-Type': 'application/json', 'X-Auth-Token' : accessToken}
    }).
    error(function(data)
    {
        if (data === null)
        {
            data = {data  : "Vérifiez votre connexion Internet!"};
        }

        angular.elementById('body').html('<div style="margin:2em" class="alert alert-danger"><h1>Oups, kinoulink a un problème: </h1><p>' + data.data + '</p></div>');
    }).
    then(function(response)
    {
        var apiResponse = response.data;

        if (apiResponse.status === 200)
        {
            _global_bootstrap_data = {
                user : apiResponse.data,
                access_token : accessToken
            };

            ga('set', '&uid', _global_bootstrap_data);
        }

        angular.element(document).ready(function() {
            angular.bootstrap(document, ['kinoulinkApp']);
        });
    })
})();