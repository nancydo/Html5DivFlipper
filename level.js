// A class representing a level
Level = function(gridSize, levelNumber)
{
	this.baseState = levelNumber % ENUM_BASE_STATE.NUM_PATTERNS;
	this.currentGrid = new Grid(gridSize, this.baseState);
	this.winningGrid = new Grid(gridSize, this.baseState);

	this.currentGrid.CreateDivs();

	this.clicks = 0;
	this.hints = 0;

	this.RandomlyClick(Math.floor(levelNumber / ENUM_BASE_STATE.NUM_PATTERNS));
	this.UpdateClicks();
};

// Randomly click numClicks times and store the solution
Level.prototype.RandomlyClick = function(numClicks)
{
	this.solution = new Array();

	for (var i = 0; i < numClicks; i++)
	{
		var x = Math.floor(Math.random() * this.currentGrid.gridSize);
		var y = Math.floor(Math.random() * this.currentGrid.gridSize);

		this.solution[i] = new Point(x, y);
		this.currentGrid.FlipSquare(x, y);
	}

	var parSpan = document.getElementById("parSpan");
	parSpan.textContent = "Par: " + numClicks;
};

// Resets the level to the original configuration
Level.prototype.Reset = function()
{
	this.currentGrid.FlipBaseState(this.baseState);
	for (var i = 0; i < this.solution.length; i++)
	{
		alert(this.solution[i].x + " " + this.solution[i].y);
		this.currentGrid.FlipSquare(this.solution[i].x, this.solution[i].y);
	}

	this.clicks = 0;
};


// Returns whether the level is in a complete configuration
Level.prototype.IsComplete = function()
{
	return this.currentGrid.SameConfiguration(this.winningGrid);
};

// Updates the UI to show how many clicks the user has made.
Level.prototype.UpdateClicks = function()
{
	$("clicks").textContent = "Clicks: " + this.clicks;

	// This functionality really ought to go on a button or something
	if (this.clicks >= this.solution.length * 2)
		this.Reset();
}

Level.prototype.GetHint = function()
{
	if (this.hints > this.solution.length)
		return;

	this.winningGrid.SetHintPoint(this.solution[this.hints]);
	this.hints++;
}