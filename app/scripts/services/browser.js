kinoulinkApp.factory("browser", ["layout", function(layout)
{
   return {
     isIOS : function()
     {
         return /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
     },
       isMobile : function ()
       {
           var header = document.getElementById('header');

           return layout.isVisible(header);
       }
   };
}]);