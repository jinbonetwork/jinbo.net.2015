var ScrollSpeedMonitor = (function()
{
    var self = this;

    function ScrollSpeedMonitor (callbackMethod)
    {
        callback = callbackMethod;

        jQuery(window).scroll(function(e)
        {
            var scrollTop = jQuery(this).scrollTop();
            didScroll(e.timeStamp, scrollTop);
        });
    }

    var callback;
    var direction = 'unknown';
    var lastDate = -1;
    var lastScrollTop = -1;
	
	this.thisMinimumTrackingDelayInMs = 25;

    function didScroll (timeStamp, scrollTop)
    {
		if (lastDate + self.thisMinimumTrackingDelayInMs <= timeStamp)
		{
			var offset = Math.abs(scrollTop - lastScrollTop);
			var direction = getDirection(scrollTop);			
			var delayInMs = timeStamp - lastDate;
			var speedInPxPerMs = offset / delayInMs;

			if (speedInPxPerMs > 0)
			{
				
				callback(speedInPxPerMs, timeStamp, direction);
			}

			lastDate = timeStamp;
		}
    };

    function getDirection (scrollTop)
    {
        var currentScrollTop = lastScrollTop;
        lastScrollTop = scrollTop;

        if (currentScrollTop > -1)
        {
            if (currentScrollTop >= scrollTop)
            {
                return 'down';
            }

            return 'up';
        }

        return 'unknown';
    }

	function reset ()
	{
		direction = 'unknown';
		lastDate = -1;
		lastScrollTop = -1;
	}
	
    return ScrollSpeedMonitor;
}());
