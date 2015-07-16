(function(angular, bz)
{
	var instance = null;
	
	function DataService($rootScope, $http)
	{
		this.user       = null;
		this.$rootScope = $rootScope;
		this.$http      = $http;
        this.apiRoot    = bz.api;
        this.socket     = null;

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
        instance.sendMessage('notify.toast.display', {type: type, title: title, message: message});
    };

    DataService.prototype.notifyPlaySound = function()
    {
        instance.sendMessage('notify.sound.play');
    };
	
	kinoulinkApp.factory("data", ["$rootScope", "$http", function($rootScope, $http)
	{
		if (instance === null)
		{
			instance = new DataService($rootScope, $http);
		}
		
		return instance;
	}]);
})(angular, window.bz);