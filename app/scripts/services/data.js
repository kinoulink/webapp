kinoulinkApp.factory("data",
    ["$rootScope", "$http", "Notification", function($rootScope, $http, Notification)
{
    return {
        displayError: function (title, response)
        {
            if (response.hasOwnProperty('data'))
            {
                if (response.data.hasOwnProperty('error'))
                {
                    notifyDisplayToast('danger', title, response.data.error);
                }
                else
                {
                    notifyDisplayToast('danger', title, response.data);
                }
            }
            else if (response.hasOwnProperty('code'))
            {
                if (response.code === 'E_VALIDATION')
                {
                    var message = '';

                    for (var key in response.invalidAttributes)
                    {
                        message += key + ' : ' + response.invalidAttributes[key][0].message + "\n<br />";
                    }

                    notifyDisplayToast('danger', 'Erreur de validation', message);
                }
            }
        },

        setLocal: function(key, value)
        {
            localStorage.setItem(key, value);
        },

        getLocal : function(key)
        {
            return localStorage.getItem(key);
        },

        apiGet: function(service, param, cb)
        {
            return callAPI('get', service, param, cb);
        },

        apiPost: function(service, param, cb)
        {
            return callAPI('post', service, param, cb);
        },

        apiDelete: function(service, param, cb)
        {
            return callAPI('delete', service, param, cb);
        },

        api: callAPI,

        notifyDisplayToast: notifyDisplayToast
    };

    function notifyDisplayToast(type, title, message)
    {
        Notification.error({
            message: message,
            title: title,
            positionY: 'bottom'
        });
    }

    function callAPI(method, service, param, callback)
    {
        return $http({
            method: method,
            url: appConfig.api + service,
            data: param,
            withCredentials: false,
            cache: false,
            responseType: "json",
            timeout: 20000,
            headers: {'Content-Type': 'application/json', 'X-Auth-Token' : $rootScope.accessToken}
        }).success(function (response, status, headers, config)
        {
            if (response === null)
            {
                notifyDisplayToast('danger', 'kinoulink API', 'Le serveur kinoulink semble rencontrer un petit problème ;-(');

                response = {
                    status: 500,
                    data: null
                };
            }
            else
            {
                /*  if (response.status == 200)
                 {
                 Rollbar.info("API /" + service, {query : param});
                 }
                 else
                 {
                 Rollbar.error("API /" + service, {query : param, response : response});
                 }*/
            }

            /* if (parseInt(response.status) >= 300)
             {
             instance.notifyDisplayToast('danger', 'kinoulink API', 'Le serveur kinoulink semble rencontrer un petit problème: ' + response.data.message);
             }
             */
            if (callback) callback(response);
        }).error(function (response, status, headers, config)
        {
            var error;

            if (response === null)
            {
                response = {
                    status: 500,
                    data: null
                };

                error = 'Le serveur kinoulink semble rencontrer un petit problème ;-(';
            }
            else
            {
                error = 'Le serveur kinoulink semble rencontrer un petit problème: ' + response.data;
            }

            notifyDisplayToast('danger', 'kinoulink API', error);

            if (callback) callback(response);
        });
    }


}]);