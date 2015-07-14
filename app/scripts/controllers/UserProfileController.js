kinoulinkApp.controller("UserProfileController", ["$scope", "data", "router",
	function ($scope, data, router)
	{
		var uid = router.get('uid');

        $scope.userID = uid;

		data.api('data/get', {uid:'u-' + uid}, function(response)
		{
            if (response.status === 200) {
                $scope.user = response.data;
            }
		});

        $scope.openInboxMessenger = function()
        {
            data.api('inbox/thread/create', {type:1, recipient:uid}, function(response)
            {
                if (response.status === 200) {
                    var threadID = response.data;

                    router.path('/me/inbox/t-' + threadID);
                }
            });
        };

	}]);