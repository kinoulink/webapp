kinoulinkApp.controller("LoginController", ["$scope", "$rootScope", "data", "router",
	function($scope, $rootScope, data, router)
{
	$scope.username = "";
	$scope.password = "";

    $scope.connected = false;

	$scope.username = data.getLocal('default_username');

	$scope.doLogin = function()
	{
		var extraData = {device : appConfig.device};

		data.setLocal('default_username', $scope.username);

		data.api('user/login', {email: $scope.username, password: $scope.password, extra : extraData}, function(response)
		{
			if (response.status == 200)
			{
                var form = angular.elementById('loginForm');

				ga('send', 'event', 'auth', 'login', 'email');

                router.reloadApp();

                $scope.connected = true;

                $rootScope.user = response.data.user;
                $rootScope.accessToken = response.data.access_token;

                data.setLocal('access_token', response.data.access_token);

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