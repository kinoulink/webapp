kinoulinkApp.controller("MessengerController", ["$scope", "$routeParams", "data",
    function ($scope, $routeParams, dataService)
{
    var threadUID = $routeParams.uid;

    $scope.menu     = false;
    $scope.conversation = {};
    $scope.loading = true;

    dataService.api("inbox/thread", {thread : threadUID}, function(response)
    {
        var thread = $scope.thread = response.data.thread;

        $scope.loading = false;

        thread.messages = response.data.messages;

        if (thread.users.length === 2) {
            angular.forEach(thread.users, function (item) {
                if (item.id !== dataService.user.id) {
                    $scope.conversation = {title: 'Conversation avec ' + item.title, avatar: item.avatar};
                }
            });
        } else {
            $scope.conversation = {title: 'Conversation entre ' + thread.users.length + ' personnes', avatar: '/images/group.png'};
        }
    });

    $scope.doTrash = function()
    {
        dataService.api('inbox/thread/delete', {thread: threadUID}, function()
        {
            $location.path('/me/inbox').replace();
        });
    };

    $scope.notMe = function(user)
    {
      return user.id !== dataService.user.id;
    };
}]);