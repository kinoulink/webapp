kinoulinkApp.directive('mySelect', ['data', '$timeout', function(dataService, $timeout)
{
    function link(scope, element, attrs, model)
    {
        var $element = $(element);

        dataService.apiGet('playlist', {}, function(response)
        {
            response.data.forEach(function(item)
            {
                $element.append('<option value="' + item.id + '">' + item.title + '</option>');
            });

            /*$element.select2({
                placeholder: "toto"
            })
            .on('change', function(e)
            {
                $timeout((function(model)
                {
                    model.$setViewValue($element.select2("val"));
                })(model), 100);
            })*/
        });

        scope.$watch(attrs.ngModel, function()
        {
            console.log('edited');
        });
    }

    return {
        restrict : 'A',
        template : '',
        link : link
    };
}]);