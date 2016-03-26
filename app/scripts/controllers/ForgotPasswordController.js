kinoulinkApp.controller("ForgotPassword", ["$scope", "data",
    function ($scope, dataService)
    {
        var htmlNode = angular.elementById('html');

        htmlNode.removeClass('loading');

        $scope.loading = false;
    }]);