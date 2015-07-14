kinoulinkApp.controller("MenuController",
    ["$scope", "$rootScope", "$timeout", "data", "browser",
    function($scope, $rootScope, $timeout, data, browser)
{
    $scope.user = data.user;
    $scope.showNotitication = false;

    $scope.$on('bind.user', function()
    {
        $scope.user = data.user;
    });

    $scope.logout = function()
    {
      data.api('auth/logout', {}, function(response)
      {
          window.location.reload();
      });
    };

    $rootScope.$watch('navOpened', function(value)
    {
        angular.elementById('html').toggleClass('menu');

        if (browser.isMobile()) {
            $scope.showNotitication = false;

            if (value) {
                $timeout(function () {
                    $scope.showNotitication = true;
                }, 150);
            }
        }
    });

    $timeout(function()
    {
        $scope.showNotitication = true;
    }, 300);
}]);