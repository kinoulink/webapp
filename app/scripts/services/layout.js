kinoulinkApp.factory('layout', function()
{
    function init()
    {
       /* var wSize = getWindowSize();

        if (wSize.width() < 800) {
            document.getElementById('page').style.minHeight = (wSize.height() + 100) +'px';

            setTimeout(function () {
                window.scrollTo(0, 1);
            }, 1000);
        }*/
    }

    function isMobile()
    {
        var header = document.getElementById('header');

        return isVisible(header);
    }

    function isVisible(el)
    {
        return el.offsetWidth > 0 && el.offsetHeight > 0;
    }

    function getWindowSize()
    {
        var docEl = document.documentElement,
            d = document,
            b = document.body,
            IS_BODY_ACTING_ROOT = docEl && docEl.clientHeight === 0;

        // Used to feature test Opera returning wrong values
        // for documentElement.clientHeight.
        function isDocumentElementHeightOff()
        {
            var div = d.createElement('div'),
                r;
            div.style.height = "50000px";
            d.body.insertBefore(div, d.body.firstChild);
            r = d.documentElement.clientHeight > 49000;
            d.body.removeChild(div);
            return r;
        }

        if (typeof document.clientWidth === "number")
        {
            return {
                width: function()
                {
                    return d.clientWidth;
                },
                height: function()
                {
                    return d.clientHeight;
                }
            };
        }
        else if (IS_BODY_ACTING_ROOT || isDocumentElementHeightOff())
        {
            return {
                width: function()
                {
                    return b.clientWidth;
                },
                height: function()
                {
                    return b.clientHeight;
                }
            };
        }
        else
        {
            return {
                width: function()
                {
                    return docEl.clientWidth;
                },
                height: function()
                {
                    return docEl.clientHeight;
                }
            };
        }
    }

    return {
        getWindowSize: getWindowSize,
        init: init,
        isVisible: isVisible,
        isMobile: isMobile
    };

});