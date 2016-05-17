kinoulinkApp.directive('myBreadcrumb', ['$http', function($http)
{
    var breadcrumbData;

    function link(scope, element, attrs)
    {
        attrs.$observe('myBreadcrumb',
            function(value)
        {
            var html = '<ol class="breadcrumb">';

            value = scope.$eval(value);

            addNote('Accueil', '/');

            value.forEach(function(item)
            {
                addNote(item.title, item.hasOwnProperty('link') ? item.link : '');
            });

            html += '</ol>';

            function addNote(title, link)
            {
                if (link)
                    html += '<li><a href="#' + link + '">' + title + '</a></li>';
                else
                    html += '<li>' + title + '</li>';
            }

            element.html(html);
        })
    }

    return {
        restrict : 'A',
        template : '',
        link : link,
        'scope' : {
            myBreadcrumb : '@'
        }
    };
}]);