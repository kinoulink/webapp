kinoulinkApp.directive('mySelect', ['data', '$timeout', function(dataService, $timeout)
{
    function link(scope, element, attrs, model)
    {
        scope.placeholderLabel = attrs.placeholder;
        scope.showDropdown = false;

        var dropdownElement = element.find('div');

        dataService.apiGet('playlist', {}, function(response)
        {
            scope.items = response.data;
        });

        scope.$watch(attrs.ngModel, function(value)
        {
            if (value.hasOwnProperty('title'))
            {
                scope.placeholderLabel = value.title;
            }
        });

        scope.clickOnItem = function(item)
        {
            model.$setViewValue(item);

            scope.showDropdown = false;
        }
    }

    return {
        restrict : 'A',
        template : '<button class="btn btn-default" ng-click="showDropdown = !showDropdown" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> {{ placeholderLabel }} <span class="caret"></span></button><div ng-show="showDropdown"><div class="list-group"><button ng-repeat="item in items" ng-click="clickOnItem(item)" class="list-group-item">{{ item.title }}</button></div></div>',
        link : link,
        require : 'ngModel'
    };
}]);