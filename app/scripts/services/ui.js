kinoulinkApp.factory("ui",
    ["Notification", function(Notification)
    {
        return {
            displayError: function (title, response)
            {
                if (response.hasOwnProperty('data'))
                {
                    if (response.data.hasOwnProperty('error'))
                    {
                        notifyDisplayToast('danger', title, response.data.error);
                    }
                    else
                    {
                        notifyDisplayToast('danger', title, response.data);
                    }
                }
                else if (response.hasOwnProperty('code'))
                {
                    if (response.code === 'E_VALIDATION')
                    {
                        var message = '';

                        for (var key in response.invalidAttributes)
                        {
                            message += key + ' : ' + response.invalidAttributes[key][0].message + "\n<br />";
                        }

                        notifyDisplayToast('danger', 'Erreur de validation', message);
                    }
                }
            }
        }
    }
]);