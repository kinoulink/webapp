kinoulinkApp.controller('header',
['$scope', 'data', '$location',
    function($scope, data, $location)
    {
        $scope.notifications = 0;

        $scope.$on('bind.user', function()
        {
            if (data.user !== null) {
                $scope.notifications = data.user.notifications.messages + data.user.notifications.invitations;
            }
        });

        $scope.$emit('bind.user');

        $scope.onSearchClick = function()
        {
          data.sendMessage('header.search.click');
        };
    }
]);