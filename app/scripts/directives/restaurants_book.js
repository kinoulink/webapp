kinoulinkApp.directive('bzRestaurantsBook', ['data', 'geolocation', function(data, geolocation)
{
    function link($scope, element, attrs)
    {
        $scope.restaurants = null;
        $scope.search = '';

        $scope.$watch('search', function(value)
        {
            data.api('data/search', {places : true, users: false, query : value}, function(response)
            {
                if (response.status === 200)
                {
                    $scope.restaurants = response.data.hits;
                }
            });
        });
    }

    function buildUI(searchQuery)
    {
        var _restos = [];

        angular.forEach(allRestaurants, function(item)
        {
            var contact = {
                id: item.id,
                title: item.title,
                status: getStatus(item),
                href: '/r/' + item.id
            };

            _restos.push(contact);
        });

        _restos.sort(function(a, b)
        {
            return a.title < b.title ? 1 : -1;
        });

        return _restos;
    }

    function getStatus(item)
    {
        var j = item.details.address.street + "", s = item.details.address.city + "";

        if (j.length > 0 && s.length > 0)
        {
            return j + ', ' + s;
        }
        else
        {
            return j + s;
        }
    }

    return {
        restrict: 'A',
        templateUrl: bzrup('directives/restaurants_book'),
        link: link
    };
}]);