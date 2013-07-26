// A class representing a level
var RECTANGLE_SIZE = 60;
var RECTANGLE_PADDING = 5;

Level = function(gridSize, levelNumber)
{
	this.baseState = (levelNumber - 1) % ENUM_BASE_STATE.NUM_PATTERNS;

	if (!this.currentGrid)
		this.currentGrid = new Grid(gridSize, this.baseState, RECTANGLE_SIZE, RECTANGLE_PADDING);
	if (!this.winningGrid)
		this.winningGrid = new Grid(gridSize, this.baseState, RECTANGLE_SIZE / 2, RECTANGLE_PADDING / 2 + 1);

	// @Nancy: If Level is going to be the 'interface' for the backing store and the UI
	// Maybe there should be something to turn a level object and map it to the UI
	var flipperGrid = document.getElementById("flipperGrid");
	this.currentGrid.CreateDivs(flipperGrid, this.ProcessClick, this);
	flipperGrid.style.width = flipperGrid.style.height = this.currentGrid.Width() + "px";

	var solutionGrid = document.getElementById("solutionGrid");
	this.winningGrid.CreateDivs(solutionGrid);
	solutionGrid.style.width = solutionGrid.style.height = this.winningGrid.Width() + "px";

	// Center the gameArea on the screen
	var width = this.currentGrid.Width() + this.winningGrid.Width();
	$("gameArea").style.marginTop = -width / 2 + "px";
	$("gameArea").style.marginLeft = -width / 2 + "px";

	this.clicks = 0;
	this.hints = 0;

	this.RandomlyClick(1 + Math.floor(levelNumber / ENUM_BASE_STATE.NUM_PATTERNS));
	this.UpdateClicks();
};

Level.prototype.ProcessClick = function(id)
{
	this.currentGrid.GridClick(id);
	this.clicks++;
	this.UpdateClicks();

	DROPLET.currentTime = 0;
	DROPLET.play();

	if (this.IsComplete())
	{
		LEVEL_NUMBER++;
		CURRENT_LEVEL.NewLevel(GRID_SIZE, LEVEL_NUMBER);
	}
}

Level.prototype.NewLevel = function(gridSize, levelNumber)
{
	this.baseState = levelNumber % ENUM_BASE_STATE.NUM_PATTERNS;
	this.currentGrid.FlipBaseState(this.baseState);
	this.winningGrid.FlipBaseState(this.baseState);

	// Center the gameArea on the screen
	var width = this.currentGrid.Width() + this.winningGrid.Width();
	$("gameArea").style.marginTop = -width / 2 + "px";
	$("gameArea").style.marginLeft = -width / 2 + "px";

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
		this.currentGrid.FlipSquare(this.solution[i].x, this.solution[i].y);

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
	$("difficultySpan").textContent =  "Difficulty: " + this.GetDifficulty();
};

Level.prototype.GetHint = function()
{
	if (this.hints >= this.solution.length)
		return;

	this.winningGrid.SetHintPoint(this.solution[this.hints]);
	this.hints++;
};

Level.prototype.GetDifficulty = function()
{
	// Count the number of times a cell is flipped
	// Sum x^2
	var gridSize = this.winningGrid.gridSize;
	var numFlippedArray = Create2DArray(gridSize, gridSize);

	// Initialize the array with 1 or 0, depending if the winning state is flipped.
	for (var row = 0; row < gridSize; row++)
	{
		for (var col = 0; col < gridSize; col++)
		{
			numFlippedArray[row][col] = !this.winningGrid.grid[row][col].on ? 1 : 0;
		}
	}

	// for each click in the solution increment those places
	for (var i = 0; i < this.solution.length; i++)
	{
		var point = this.solution[i];
		IncrementSquare(numFlippedArray, gridSize, point.x, point.y);
	}

	// Calc a difficulty
	var sum = 0;
	for (var row = 0; row < gridSize; row++)
	{
		for (var col = 0; col < gridSize; col++)
		{
			sum += numFlippedArray[row][col] * numFlippedArray[row][col];
		}
	}

	return sum;
};