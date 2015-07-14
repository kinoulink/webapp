kinoulinkApp.filter('kinoulinkState', function()
{
    return function(value)
    {
       if (value === 1)
       {
           return 'Accepté';
       }
       else if (value === 2)
       {
           return 'Décliné';
       }
       else
       {
           return 'En attente';
       }
    };
});