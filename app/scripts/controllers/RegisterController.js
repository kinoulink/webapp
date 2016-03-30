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

}]);