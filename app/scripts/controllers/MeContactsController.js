kinoulinkApp.controller("MeContactsController", [
    "$scope", "$location", "data",
    function ($scope, $location, data)
    {
        var allContacts;

        $scope.state_view   = 1;
        $scope.loading      = true;
        $scope.search       = "";

        $scope.onUserClick = function(user)
        {
            $location.path(user.href);
        };

        var refreshGroups = function()
        {
            var groups = [];

            if (allContacts == null)
            {
                return ;
            }

            allContacts.forEach(function(item)
            {
                if (matchQuery(item, $scope.search)) {
                    var contact = {
                        id: item.id,
                        avatar: item.details.avatar.small,
                        title: item.details.title,
                        status: getStatus(item),
                        href: '/u/' + item.id
                    };

                    var groupByValue = getGroupValue(item);

                    if (!groups.hasOwnProperty(groupByValue)) {
                        groups[groupByValue] = {title: groupByValue, items: []};
                    }

                    (groups[groupByValue]['items']).push(contact);
                }
            });

            $scope.groups = Object.values(groups);
        };

        data.api("me/contact", {}, function(response)
        {
            allContacts = response.data;

            refreshGroups();
        });

        $scope.emails = "";
        $scope.state_invitation = 1;
        $scope.invitations = [];

        $scope.submitInvitations = function()
        {
            $scope.state_invitation = 2;

            data.api('referring/send', {emails : $scope.emails}, function(response)
            {
                $scope.state_invitation = 1;

                if (response.status === 200)
                {
                    $scope.emails = '';

                    angular.forEach(response.data, function(item)
                    {
                        $scope.invitations.push(item);
                    });

                    ga('send', 'event', 'social', 'referring', 'Partager par email');

                    data.notifyDisplayToast('success', 'kinoulink', 'Invitation envoyée');
                }
                else
                {
                    data.notifyDisplayToast('danger', 'kinoulink', response.data.message);
                }
            });
        };

        $scope.$watch('search', function()
        {
           refreshGroups();
        });

        $scope.share = function(url)
        {
            ga('send', 'event', 'social', 'referring', 'Partager sur un réseau social');

            angular.popupwindow(url, 'Partager kinoulink', 600, 250);
        };

        $scope.refresh = function()
        {
            data.api('referring/list', {}, function(response)
            {
                if (response.status === 200)
                {
                    $scope.invitations = response.data;
                }
            });
        };

        $scope.refresh();

        function getGroupValue(item)
        {
            var str = item.details.title[0];

            return getSlug(str);
        }

        function getSlug(str)
        {
            str = str.toLowerCase();

            var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
            var to   = "aaaaaeeeeeiiiiooooouuuunc------";
            for (var i=0, l=from.length ; i<l ; i++) {
                str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
            }

            return str;
        }

        function getStatus(item)
        {
            var j = (item.details.job === null ? "" : item.details.job), s = (item.details.sector === null ? "" : item.details.sector);

            if (j.length > 0 && s.length > 0)
            {
                return j + ' - ' + s;
            }
            else
            {
                return j + s;
            }
        }

        function matchQuery(item, searchQuery)
        {
            var query = getSlug(searchQuery);
            var value = getSlug(item.details.title);

            if (query.length === 0)
            {
                return true;
            }

            if (value.indexOf(query) >= 0)
            {
                return true;
            }

            return false;
        };
    }]);