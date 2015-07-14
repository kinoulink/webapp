kinoulinkApp.controller("MeInboxController", [
	"$scope", "data", "$timeout",
	function ($scope, data, $timeout)
{
	$scope.threads = null;
    $scope.loading = true;
    $scope.playFx = false;
	
	data.api('inbox/threads', {}, function(response)
    {
       if (response.status === 200)
       {
           var threads = response.data.threads;

           threads.sort(function(a, b)
           {
              return a.date.update < b.date.update ? 1 : -1;
           });

           angular.forEach(threads, function(thread)
           {
                thread.url = '#/me/inbox/t-' + thread.id;
           });

           $scope.threads   = threads;
           $scope.users     = response.data.users;
           $scope.loading   = false;

           $timeout(function()
           {
               $scope.playFx = true;
           }, 200);
       }
    });
}]);