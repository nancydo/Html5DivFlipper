AnimatedBackground = function()
{
	// Create the container for the background, and make it the first thing in the document, 
	// so everything else goes infront.
	var container = document.createElement("div");
	container.id = "backgroundContainer";
	document.body.insertBefore(container, document.body.firstChild);

	// Create the darkness overlay.
	var darkness = document.createElement("div");
	darkness.id = "backgroundDarkness";
	container.appendChild(darkness);

	// how many squares do we need?
	// To avoid confusion, lets make the background twice as big.
	var rectSize = RECTANGLE_SIZE * 2;
	var rectPadding = RECTANGLE_PADDING * 2;

	// 3000.. coz why not?
	// This should really be the size of your screen, but that can change with resizes.
	// no one has 3000x3000 resolution.
	var cols = 3000 / (rectSize + rectPadding);
	var rows = 3000 / (rectSize + rectPadding);

	this._backgroundRectangles = [];
	for (var currentRow = 0; currentRow < rows; currentRow++)
	{
		for (var currentCol = 0; currentCol < cols; currentCol++)
		{	
			// Create a rectangle
			var rect = new Rectangle(false/*on*/);
			var div = document.createElement("div");
			div.className = rect.on ? "rectangleOn" : "rectangleOff";
			rect.div = div;
			div.style.zIndex = "-10";
			div.style.width = div.style.height = rectSize + "px";
			div.style.left = currentCol * (rectSize + rectPadding) + "px";
			div.style.top = currentRow * (rectSize + rectPadding) + "px";

			// randomly flip it.
			if (Math.round(Math.random()) != 0)
				rect.Flip();

			this._backgroundRectangles.push(rect);
			container.appendChild(div);
		}
	}

	var _self = this;
	var tickFunction = function()
	{
		_self.Randomize();
	};

	setInterval(tickFunction, 12345);
};


/************************************************
 * Randomly flips all the pieces!
 ************************************************/
AnimatedBackground.prototype.Randomize = function()
{
	for (var i = 0; i < this._backgroundRectangles.length; i++)
	{
		var rect = this._backgroundRectangles[i];
		if (Math.round(Math.random()) != 0)
				rect.Flip();
	}
};