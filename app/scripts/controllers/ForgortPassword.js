kinoulinkApp.controller('ForgotPassword', ['$scope', 'data', 'router', '$location',
    function($scope, dataService, router, $location)
{
    var params = $location.search();

    $scope.loading = false;
    $scope.step    = 1;
    $scope.entry   = {};
    $scope.email   = '';
    $scope.email_sent = false;

    if (params.hasOwnProperty('code'))
    {
        $scope.step       = 2;
        $scope.entry.code = params.code;
    }

    $scope.submitLink = function()
    {
        $scope.loading = true;

        dataService.api('auth/forgot-password', {'email' : $scope.email}, function(response)
        {
            $scope.loading = false;

            if (response.status === 200)
            {
                $scope.email_sent   = true;
                $scope.step         = 2;
            }
            else
            {
                dataService.notifyDisplayToast('danger', 'Connexion', response.data.message);
            }
        });
    };

    $scope.submitPassword = function()
    {
        $scope.loading = true;

        dataService.api('auth/reset-password', $scope.entry, function(response)
        {
            $scope.loading = false;

            if (response.status === 200)
            {
                alert('Mot de passe enregistré !');

                router.reloadApp();
            }
            else
            {
                dataService.notifyDisplayToast('danger', 'Connexion', response.data.message);
            }
        });
    };
}]);