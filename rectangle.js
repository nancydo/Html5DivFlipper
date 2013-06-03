Rectangle = function(x, y, on)
{
	this.x = x;
	this.y = y;
	this.on = on;
};

Rectangle.prototype.EnsureOff = function()
{
	if (this.on)
		this.Flip();
};

Rectangle.prototype.EnsureOn = function()
{
	if (!this.on)
		this.Flip();
};

Rectangle.prototype.Flip = function()
{
	this.on = !this.on;
	if (this.div)
		this.div.className = this.on ? "rectangleOn" : "rectangleOff";
};