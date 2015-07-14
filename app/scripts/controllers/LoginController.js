kinoulinkApp.controller("LoginController", ["$scope", "data", "router",
	function($scope, data, router)
{
	$scope.username = "";
	$scope.password = "";

    if (data.user !== null)
    {
        router.reloadApp();
    }

	if (bz.phonegap)
	{
		$scope.username = window.localStorage.getItem('default_username');
	}

	$scope.doLogin = function()
	{
		var extraData = {device : bz.device};

		if (bz.phonegap)
		{
			window.localStorage.setItem('default_username', $scope.username);
		}

		data.api('auth/login', {login: $scope.username, password: $scope.password, extra : extraData}, function(response)
		{
			if (response.status === 200)
			{
                var form = angular.elementById('loginForm');

				ga('send', 'event', 'auth', 'login', 'email');

				if (bz.phonegap)
				{
					router.reloadApp();
				}
				else
				{
					form.removeAttr('onsubmit').removeAttr('ng-submit');

					(form[0]).submit();
				}
			}
			else
			{
                data.notifyDisplayToast('danger', 'Connexion', response.data.message);
			}
		});
	};

    $scope.onInputFocus = function()
    {

    };
	
	$scope.openSite = function()
	{
		 window.open(encodeURI('http://www.kinoulink.fr'), '_system', 'location=yes');
	};

	$scope.openConnect = function(vendor)
	{
		window._kinoulink_callback = function(response)
		{
			if (response.status === 200)
			{
				if (response.data.hasOwnProperty('action')) {
					if (response.data.action === 'register') {
						if (confirm("Nous n'avons trouvé aucun compte rattaché, souhaitez vous vous inscrire à kinoulink ?")) {
							router.redirectPath('register');
						}
					}
					else
					{
						ga('send', 'event', 'auth', 'login', vendor);

						return router.reloadApp();
					}
				}
				else
				{
					data.notifyDisplayToast('danger', 'Connexion', 'Erreur serveur, action is missing!');

					$scope.$apply();
				}
			}
			else
			{
				data.notifyDisplayToast('danger', 'Connexion', response.data.message);

				$scope.$apply();
			}
		};

		if (bz.phonegap)
		{
			var ssoWindow = window.open(bz.my + 'api/auth/' + vendor + '/authorize', '_blank', 'location=no');

			ssoWindow.addEventListener('loadstop', function (event)
			{
				var url = event.url;

				if (url.indexOf('my.kinoulink.fr/api/auth/') > -1 && url.indexOf('authorize/callback') > 0) {
					ssoWindow.executeScript({
						code: 'window.callbackData'
					}, function (values) {
						window._kinoulink_callback(values[0]);

						setTimeout(function () {
							ssoWindow.close();
						}, 50);
					});
				}
			});
		}
		else
		{
			window.open(bz.api + '/auth/' + vendor + '/authorize', 'kinoulink Connect', 'width=600,height=300');

            window.onmessage = function(e)
            {
                window._kinoulink_callback(e.data);
            };
		}
	}
}]);