kinoulinkApp.controller("kinoulinkProposalController", ["$scope", "data", "$location",
	function($scope, dataService, $location)
{
    var params = $location.search();

    $scope.recipients = [];
    $scope.proposal_date = 'now';
    $scope.proposal_time = 'now';
    $scope.place = null;
    $scope.place_custom = null;
    $scope.message = '';

    $scope.state_recipient = 1;
    $scope.state_place = 1;

    $scope.search_users = '';

    $scope.$watch('state_recipient', function(v)
    {
        var $input = document.getElementById('kinoulinkCreateSearchUserInput');

        $scope.search_users_results = [];
        $scope.search_users = '';

       if (v == 1)
       {
           setTimeout(function() {
               $input.focus();
           }, 200);
       }
       else
       {
           setTimeout(function() {
               $input.focus();
           }, 200);
       }
    });

    if (params.hasOwnProperty('recipient'))
    {
        dataService.api('data/get', {uid:'u-' + params.recipient}, function(response)
         {
             if (response.status === 200) {
                $scope.recipients.push(response.data);
             }
         });
    }

    $scope.removeRecipient = function(index)
    {
      $scope.recipients.splice(index, 1);
    };

    $scope.onUserClick = function(user)
    {
        user.avatar = {small : user.avatar};

        $scope.recipients.push(user);

        $scope.state_recipient = 1;
    };

    $scope.onRestaurantClick = function(restaurant)
    {
        $scope.place = restaurant;

        $scope.state_place = 1;
    };

    $scope.selectCustomPlace = function()
    {
        $scope.place = {title : $scope.place_custom, status : 'Lieu personnalisé'};

        $scope.state_place = 1;
    };

    $scope.time_options =  [
        {key: '8:00', label: '8:00'},
        {key: '9:00', label: '9:00'},
        {key: '10:00', label: '10:00'},
        {key: '11:00', label: '11:00'},
        {key: '12:00', label: '12:00'},
        {key: '12:30', label: '12:30'},
        {key: '13:00', label: '13:00'},
        {key: '13:30', label: '13:30'},
        {key: '14:00', label: '14:00'},
        {key: '14:30', label: '14:30'},
        {key: '15:30', label: '15:30'},
        {key: '17:00', label: '17:00'},
        {key: '17:30', label: '17:30'},
        {key: '18:00', label: '18:00'},
        {key: '19:30', label: '19:30'},
        {key: '20:00', label: '20:00'},
        {key: '20:30', label: '20:30'},
        {key: '21:00', label: '21:00'},
    ];

    var momentDate =  moment();

    $scope.date_options =  [
        {key:  momentDate.format("DD/MM/YYYY"), label: 'Aujourd\'hui (' + momentDate.format("dddd D MMM") + ')'},
        {key: momentDate.add(1, 'day').format("DD/MM/YYYY"), label: 'Demain (' + momentDate.format("dddd D MMM") + ')'}
    ];

    momentDate = momentDate.add(1, 'day');

    for (var i = 0; i < 10; i++)
    {
        $scope.date_options.push({key: momentDate.format("DD/MM/YYYY"), label: momentDate.format("dddd D MMM")});

        momentDate = momentDate.add(1, 'day');
    }

    $scope.proposal_date = $scope.date_options[0];
    $scope.proposal_time = $scope.time_options[0];

    $scope.submitDetails = function()
    {
        var recipients = [];

        angular.forEach($scope.recipients, function(item)
        {
           recipients.push(item.id);
        });

        if ($scope.place === null)
        {
            return dataService.notifyDisplayToast('danger', 'kinoulink', 'Veuillez spécifier un lieu');
        }

        if (recipients.length === 0)
        {
            return dataService.notifyDisplayToast('danger', 'kinoulink', 'Veuillez inviter au moins une personne');
        }

        $scope.loading = true;

        dataService.api('kinoulink/insert', {
            date : $scope.proposal_date.key,
            time : $scope.proposal_time.key,
            place: $scope.place.hasOwnProperty('id') ? {type: 1, id: $scope.place.id} : {type: 2, title: $scope.place.title},
            recipients: recipients,
            message : $scope.message
        }, function(response)
        {
            if (response.status == 200)
            {
                dataService.notifyDisplayToast('success', 'kinoulink', 'Invitation envoyée !');

                $location.path('/#/me/invitations');
            }
            else
            {
                $scope.loading = false;
            }
        });
    };

    $scope.searchUsers = function()
    {
        dataService.api("data/search", {users : true, query : $scope.search_users}, function(response)
        {
            $scope.search_users_results = response.data.hits;
        });
    };
}]);