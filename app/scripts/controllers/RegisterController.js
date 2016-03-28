kinoulinkApp.controller("RegisterController", ["$scope", "$location", "data", "router",
	function($scope, $location, data, router)
{
    var htmlNode = angular.elementById('html'), hasFocus = false;

    $scope.user = {name : {first : "", last: "", mode: "b"} };
    $scope.pseudo_type = {b: "Prénom Nom", a : "Prénom N."};
    $scope.sso = null;
    $scope.loading = false;

    htmlNode.removeClass('loading');

    /*if (!browser.isIOS())
    {
        angular.elementById('registerBtFacebook').removeAttr('href');
        angular.elementById('registerBtLinkedin').removeAttr('href');
    }*/

    var searchObject = $location.search();

    if (searchObject.hasOwnProperty('email'))
    {
        $scope.user.email = searchObject.email;
    }

    if (searchObject.hasOwnProperty('firstname'))
    {
        $scope.user.name.first = searchObject.firstname;
    }

    if (searchObject.hasOwnProperty('lastname'))
    {
        $scope.user.name.last = searchObject.lastname;
    }

    $scope.doRegister = function()
	{
        var extraData   = {device : appConfig.device},
            params        = angular.extend(extraData, $scope.user);

        $scope.loading = true;

		data.api('user/auth/register', params, function(response)
		{
            $scope.loading = false;

			if (response.status === 200)
			{
				data.setUser(response.data);

                ga('send', 'event', 'auth', 'register', 'Inscription', 1);

                if (appConfig.phonegap) {
                    router.reloadApp();
                }
                else {
                    var form = angular.elementById('registerForm');

                    form.removeAttr('onsubmit').removeAttr('ng-submit');

                    setTimeout(function () {
                        (form[0]).submit();
                    }, 150);
                }
			}
			else
			{
                data.notifyDisplayToast('danger', 'Inscription', response.data);
			}
		});
	};

    $scope.onInputFocus = function()
    {
        if (!hasFocus)
        {
            hasFocus = true;

            window.scrollTo(0, 150);
            document.body.scrollTop = 150;
        }
    };

    $scope.openConnect = function(vendor)
    {
        window._kinoulink_callback = function(response)
        {
            if (response.status === 200)
            {
                if (response.data.hasOwnProperty('action')) {
                    if (response.data.action === 'register') {
                        var userData = response.data.user;

                        $scope.sso = {
                            vendor: vendor
                        };

                        if (userData.hasOwnProperty('first_name'))
                        {
                            $scope.user.name.first = userData.first_name;
                        }

                        if (userData.hasOwnProperty('last_name'))
                        {
                            $scope.user.name.last = userData.last_name;
                        }

                        if (userData.hasOwnProperty('email'))
                        {
                            $scope.user.email = userData.email;
                        }

                        if (userData.hasOwnProperty('firstName'))
                        {
                            $scope.user.name.first = userData.firstName;
                        }

                        if (userData.hasOwnProperty('lastName'))
                        {
                            $scope.user.name.last = userData.lastName;
                        }

                        if (userData.hasOwnProperty('emailAddress'))
                        {
                            $scope.user.email = userData.emailAddress;
                        }

                        if (userData.hasOwnProperty('job'))
                        {
                            $scope.user.job = userData.job;
                        }

                        if (userData.hasOwnProperty('sector'))
                        {
                            $scope.user.sector = userData.sector;
                        }

                        $scope.user.sso = {vendor: vendor, token: response.data.token};
                    }
                    else
                    {
                        return router.reloadApp();
                    }
                } else {
                    data.notifyDisplayToast('danger', 'Connexion', 'Erreur serveur, action is missing!');
                }
            }
            else
            {
                data.notifyDisplayToast('danger', 'Connexion', response.data.message);
            }

            $scope.$apply();
        };

        if (appConfig.phonegap)
        {
            var ssoWindow = window.open(appConfig.api + '/auth/' + vendor + '/authorize', '_blank', 'location=no');

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
            window.open(appConfig.api + '/auth/' + vendor + '/authorize', 'Bizlunch Connect', 'width=600,height=300');

            window.onmessage = function(e)
            {
                window._kinoulink_callback(e.data);
            };
        }
    }
}]);