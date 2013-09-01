StopWatch = function(interval, onTickCallback, onCompleteCallback, countDown)
{
	this._interval = interval;
	this._timeRemaining = 0;
	this._onTickCallback = onTickCallback;
	this._onCompleteCallback = onCompleteCallback;	
	this._countDown = countDown;
	this._intervalId;
};

/************************************************
 * Sets the time remaining (in milliseconds) for this
 * stopwatch.
 ************************************************/
StopWatch.prototype.SetTimeRemaining = function(milliseconds) 
{
	this._timeRemaining = milliseconds;
};

/************************************************
 * Gets the time remaining (in milliseconds) for this
 * stopwatch.
 ************************************************/
StopWatch.prototype.GetTimeRemaining = function() 
{
	return this._timeRemaining;
};

/************************************************
 * Adds time (in milliseconds) to this stopwatch.
 ************************************************/
StopWatch.prototype.AddTime = function(milliseconds)
{
	this._timeRemaining += milliseconds;
	this._onTickCallback(this._timeRemaining);
};

/************************************************
 * Starts this stopwatch.
 ************************************************/
StopWatch.prototype.Start = function()
{
	if (this._intervalId == null)
	{
        // Every interval millisections, tick.
        var _self = this;
        this._intervalId = setInterval(
        	function () 
        	{ 
        		_self.OnTick(); 
        	}, this._interval);

        // Start it off with a tick
        _self.OnTick(); 
	}
};

/************************************************
 * The function that gets called every 'interval'
 ************************************************/
StopWatch.prototype.OnTick = function()
{
	this._timeRemaining += this._countDown ? -this._interval : this._interval;
	this._onTickCallback(this._timeRemaining);

	if (this._timeRemaining < 0)
	{
		this.Stop();
		this._onCompleteCallback();
	}
};

/************************************************
 * Stops this stopwatch, does not call OnComplete
 ************************************************/
StopWatch.prototype.Stop = function()
{
	if (this._intervalId != null)
	{
		this._active = false;
		clearInterval(this._intervalId);
	}
};