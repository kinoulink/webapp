kinoulinkApp.controller("LoginController", ["$scope", "data", "router",
	function($scope, data, router)
{
	$scope.username = "";
	$scope.password = "";

    $scope.connected = false;

    if (data.user !== null)
    {
        router.reloadApp();
    }

	if (appConfig.phonegap)
	{
		$scope.username = window.localStorage.getItem('default_username');
	}

	$scope.doLogin = function()
	{
		var extraData = {device : appConfig.device};

		if (appConfig.phonegap)
		{
			window.localStorage.setItem('default_username', $scope.username);
		}

		data.api('user/auth/login', {login: $scope.username, password: $scope.password, extra : extraData}, function(response)
		{
			if (response.status == 200)
			{
                var form = angular.elementById('loginForm');

				ga('send', 'event', 'auth', 'login', 'email');

                router.reloadApp();

                $scope.connected = true;
/*
				if (appConfig.phonegap)
				{
					router.reloadApp();
				}
				else
				{
					form.removeAttr('onsubmit').removeAttr('ng-submit');

					(form[0]).submit();
				}*/
			}
			else
			{
                data.displayError('Connexion', response);
			}
		});
	};

    $scope.onInputFocus = function()
    {

    };
	
	$scope.openSite = function()
	{
		 window.open(encodeURI('http://www.kinoulink.com'), '_system', 'location=yes');
	};
}]);