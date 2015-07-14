kinoulinkApp.controller("home", ["$scope", "data",
    function ($scope, dataService)
    {
        var token;

        $scope.user = dataService.user;

        dataService.api('/suggest/profiles', {}, function(response)
        {
            $scope.suggestions = response.data;
        })

        $scope.inviteViaLinkedin = function()
        {
            window.open(bz.api + '/auth/linkedin/authorize', 'kinoulink Connect', 'width=600,height=300');

            window.onmessage = function(e)
            {
                var data = e.data.data;

                token = data.token;

                dataService.api('/auth/linkedin/connections', {token : token}, function(response)
                {
                   $scope.linkedin_contacts = response.data;
                });
            };
        };

        var workers = 0;

        $scope.sendLinkedinInvitationToAll = function()
        {
            $scope.runInvitationWorker();
            $scope.runInvitationWorker();
            $scope.runInvitationWorker();
        };

        $scope.runInvitationWorker = function()
        {
            for (var i = 0; i < $scope.linkedin_contacts.length; i++)
            {
                var contact = $scope.linkedin_contacts[i];

                if (!contact.hasOwnProperty('status'))
                {
                    contact.status = 1;

                    workers++;

                    dataService.api('/auth/linkedin/invitations/send', {token : token, contact : contact}, function(response)
                    {
                        workers--;

                        contact.status = 2;

                        $scope.runInvitationWorker();
                    });

                    return ;
                }
            }
        };

        $scope.sendLinkedinInvitation = function(contact)
        {
            contact.status = 1;

            dataService.api('/auth/linkedin/invitations/send', {token : token, contact : contact}, function(response)
            {
                contact.status = 2;
            });
        };

    }]);