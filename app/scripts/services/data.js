(function(angular, bz)
{
	var instance = null;
	
	function DataService($rootScope, $http, Notification)
	{
		this.user           = null;
		this.$rootScope     = $rootScope;
		this.$http          = $http;
        this.Notification   = Notification;
        this.apiRoot        = appConfig.api;

        this.$rootScope.messenger_connected = false;
	}

    DataService.prototype.sendMessage = function(name, args)
    {
        return instance.$rootScope.$broadcast(name, args);
    };

	DataService.prototype.setUser = function(value)
	{
        if (instance.user === null)
        {
            instance.user = value;
        }

		instance.user = value;

        instance.sendMessage('bind.user', value);
	};

    DataService.prototype.displayError = function(title, response)
    {
        if (response.data.hasOwnProperty('error'))
        {
            this.notifyDisplayToast('danger', title, response.data.error);
        }
        else
        {
            this.notifyDisplayToast('danger', title, response.data);
        }
    };
	
	DataService.prototype.api = function(service, param, callback)
	{
        if (instance.user !== null)
        {
            param['user_access_token'] = instance.user.access_token;
        }

		return instance.$http({
			method: 'POST',
			url: instance.apiRoot + service,
			data: param,
			withCredentials: true,
			cache: false,
			responseType: "json",
            timeout : 20000,
			headers : {'Content-Type': 'application/x-www-form-urlencoded'} 
		}).
        success(function(response, status, headers, config)
        {
            if (response === null)
            {
                instance.notifyDisplayToast('danger', 'kinoulink API', 'Le serveur kinoulink semble rencontrer un petit problème ;-(');

                response = {status:500, data:null};
            }
            else
            {
                if (response.status == 200)
                {
                    Rollbar.info("API /" + service, {query : param});
                }
                else
                {
                    Rollbar.error("API /" + service, {query : param, response : response});
                }
            }

           /* if (parseInt(response.status) >= 300)
            {
                instance.notifyDisplayToast('danger', 'kinoulink API', 'Le serveur kinoulink semble rencontrer un petit problème: ' + response.data.message);
            }
*/
            callback(response);
        }).error(function(response, status, headers, config)
        {
            var error;

            if (response === null)
            {
                response = {status:500, data:null};

                error = 'Le serveur kinoulink semble rencontrer un petit problème ;-(';
            }
            else
            {
                error = 'Le serveur kinoulink semble rencontrer un petit problème: ' + response.data;
            }

            instance.notifyDisplayToast('danger', 'kinoulink API', error);

            callback(response);
		});
	};

    DataService.prototype.notifyDisplayToast = function(type, title, message)
    {
        this.Notification.error({message : message, title : title, positionY : 'bottom'});
    };

    DataService.prototype.notifyPlaySound = function()
    {
        instance.sendMessage('notify.sound.play');
    };
	
	kinoulinkApp.factory("data", ["$rootScope", "$http", "Notification", function($rootScope, $http, Notification)
	{
		if (instance === null)
		{
			instance = new DataService($rootScope, $http, Notification);
		}
		
		return instance;
	}]);
})(angular, window.bz);