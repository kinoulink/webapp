kinoulinkApp.directive('bzInvitationsReceived', ['data', '$compile', function(dataService, $compile)
{
    var userID;

    function link(scope, element, attr)
    {
        userID = scope.me.id;

        scope.$watch(attr.bzInvitationsReceived, function(value)
        {
            angular.forEach(value, function(item)
            {
                element.append(renderInvitation(item));
            });

            $compile(element.contents())(scope);
        });
    }

    function renderInvitation(invitation)
    {
        var accepted = false, declined = false, author = invitation.author.id === userID, html = '<div class="clearfix __row">';

            html += '<div class="table-cell _w-a"><a ng-href="#/u/' + invitation.author.id + '"><img src="' + invitation.author.avatar.big + '" /></a> </div>';

            html += '<div id="invitation-' + invitation.id + '" class="panel-form __m"><div class="row">';

                if (invitation.hasOwnProperty('workflow'))
                {
                    angular.forEach(invitation.workflow, function (step)
                    {
                        if (step.user === dataService.user.id)
                        {
                            if (step.status == 1)
                            {
                                accepted = true;

                                html += '<span class="ribbon _accepted"><i class="fa fa-check"></i></span>';
                            }
                            else if (step.status == 2)
                            {
                                declined = true;

                                html += '<span class="ribbon _declined"><i class="fa fa-plus"></i></span>';
                            }
                        }
                    });
                }

                html += '<div class="col-sm-8">';

                if (author)
                {
                    html += '<h4>Vous avez lancé un bilzunch</h4>';
                }
                else
                {
                    html += '<h4>' + invitation.author.title + ' vous invite à un kinoulink</h4>';
                }

                html += '<span class="__st">' + formatTimeAgo(invitation.createdat) + '</span>' +
                            '<p><i class="fa fa-clock-o"></i> ' + formatDateVerbose(invitation.date) + ' (' + formatDateShortFuture(invitation.when) + ') à ' + invitation.time + '</p>' +
                            '<p><i class="fa fa-map-marker"></i> ' + invitation.place + '</p>';

                            html += '<div>';

                if (invitation.guests.length === 1)
                {
                    html += '<p><i class="fa fa-users"></i> un ' + (author ? '' : 'autre ') +  'invité</p>';
                }
                else if (invitation.guests.length > 0)
                {
                    html += '<p><i class="fa fa-users"></i> ' + invitation.guests.length + (author ? '' : ' autres') +  ' invités</p>';
                }

                html += '</div>';

                html += '</div>';

                html += '<div class="col-sm-4">';

                invitation.guests.forEach(function(item)
                {
                    html += '<span class="guest"><img src="' + item.avatar.small + '" /><br/>' + item.title  + '</span>';
                });

                html += '</div></div>'; // end row

                html += '<div class="_f">';

                    if (!declined && !accepted && !author)
                    {
                        html += '<a class="_a3 pull-right" ng-click="decline(\'' + invitation.id + '\')"><i class="fa fa-times" style="color:indianred"></i> Décliner</a>';
                        html += '<a class="_a2 pull-right" ng-click="accept(\'' + invitation.id + '\')"><i class="fa fa-check" style="color:darkseagreen"></i> Accepter</a>';
                    }

                    html += '<a class="_a1" ng-href="#/kinoulink/' + invitation.id + '">Voir en détails</a>';

                html += '</div>';

        html += '</div></div>';

        return html;
    }

    function formatDateVerbose(value)
    {
        return moment(value, 'DD/MM/YYYY').format('dddd D MMMM');
    }

    function formatDateShortFuture(value)
    {
        return moment(value * 1000).from(moment());
    }

    function formatTimeAgo(value)
    {
        return moment(value * 1000).from(moment());
    }

    return {
        restrict: 'A',
        invitations: '=bz-invitations-received',
        link: link
    };
}]);