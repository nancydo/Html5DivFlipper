StopWatch = function(interval, onTickCallback, onCompleteCallback)
{
	this._interval = interval;
	this._timeRemaining = 0;
	this._onTickCallback = onTickCallback;
	this._onCompleteCallback = onCompleteCallback;	
	this._intervalId;
};

StopWatch.prototype.SetTimeRemaining = function(milliseconds) 
{
	this._timeRemaining = milliseconds;
};

StopWatch.prototype.AddTime = function(milliseconds)
{
	this._timeRemaining += milliseconds;
	this._onTickCallback(this._timeRemaining);
};

StopWatch.prototype.Start = function()
{
	if (this._intervalId == null)
	{
        var _self = this;
        // Every interval millisections, tick.
        this._intervalId = setInterval(
        	function () 
        	{ 
        		_self.OnTick(); 
        	}, this._interval);

        // Start it off with a tick
        _self.OnTick(); 
	}
};

StopWatch.prototype.OnTick = function()
{
	this._timeRemaining -= this._interval;
	this._onTickCallback(this._timeRemaining);

	if (this._timeRemaining < 0)
	{
		this.Stop();
		this._onCompleteCallback();
	}
};

StopWatch.prototype.Stop = function()
{
	if (this._intervalId != null)
	{
		this._active = false;
		clearInterval(this._intervalId);
	}
};