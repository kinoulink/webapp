kinoulinkApp.controller("RestaurantController", ["$scope", "$stateParams", "data",
	function ($scope, $stateParams, data)
	{
		var uid = $stateParams.uid;
		
		data.api('data/get', {uid:'r-' + uid}, function(response)
		{
			$scope.title = response.data.title;
		});
	}]);