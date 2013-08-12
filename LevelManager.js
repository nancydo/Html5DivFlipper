function LevelManager()
{
	this._puzzleFactory = new PuzzleFactory();
	this._puzzleNumber = 1;
	this._currentPuzzle = null;

	var _self = this;
	var updateClock = function(timeRemaining)
	{
		_self.UpdateClock(timeRemaining);
	};

	var timeOver = function()
	{
		_self.GameOver();
	};

	this._stopWatch = new StopWatch(1000, updateClock, timeOver);
	this._stopWatch.SetTimeRemaining(30000);
	this._stopWatch.Start();
	
	this.StartLevel();
	SoundManager.Play("happyland");
};

LevelManager.prototype.UpdateClock = function(timeRemaining)
{
	timeRemaining = timeRemaining / 1000.0;
	var gameClock = document.getElementById("gameClock");
	gameClock.textContent = timeRemaining;

	if (timeRemaining < 10)
		SoundManager.Play("tick");
}

LevelManager.prototype.OnClick = function(id)
{
	SoundManager.Play("boimp");

	this._currentPuzzle.ProcessClick(id);
	if (this._currentPuzzle.IsComplete())
		this.LevelComplete();
};

/************************************************
 * Ends the current LevelManager and cleans up.
 ************************************************/
LevelManager.prototype.GameOver = function()
{
	var flipperGrid = document.getElementById("flipperGrid");

	this.DestroyDivs();

	var flipperGrid = document.getElementById("flipperGrid");
	flipperGrid.textContent = "GG";
	SoundManager.Pause("happyland");
};

/************************************************
 * Completes the level and starts the next one.
 ************************************************/
LevelManager.prototype.LevelComplete = function()
{
	this._puzzleNumber = this._currentPuzzle.GetDifficulty() + 1;
	this.StartLevel();

	// Add 5 seconds per successful puzzle.
	this._stopWatch.AddTime(5000);
	SoundManager.Play("complete");
};

LevelManager.prototype.SetupDivs = function()
{
	var flipperGrid = document.getElementById("flipperGrid");
	var solutionGrid = document.getElementById("solutionGrid");
	// Create the divs for the new puzzle
	this._currentPuzzle.GetPlayGrid().CreateDivs(flipperGrid, this.OnClick, this);
	this._currentPuzzle.GetSolutionGrid().CreateDivs(solutionGrid);
};

LevelManager.prototype.DestroyDivs = function()
{
	var flipperGrid = document.getElementById("flipperGrid");
	var solutionGrid = document.getElementById("solutionGrid");

	// Destroy the divs if we have any.
	if (this._currentPuzzle != null)
	{
		this._currentPuzzle.GetPlayGrid().DestroyDivs(flipperGrid);
		this._currentPuzzle.GetSolutionGrid().DestroyDivs(solutionGrid);
	}
};

LevelManager.prototype.StartLevel = function()
{
	this.DestroyDivs();
	this._currentPuzzle = this._puzzleFactory.GetPuzzle(this._puzzleNumber);
	this.SetupDivs();

	// How many pixels to put between the playing board and the solution board.
	var hackySpacingBetweenGrids = 100;
	
	// Center the game area on the screen.
	var gameAreaWidth = this._currentPuzzle.GetPlayGrid().Width() + this._currentPuzzle.GetSolutionGrid().Width() + hackySpacingBetweenGrids;
	$("gameArea").style.marginLeft = -gameAreaWidth / 2 + "px";
	$("gameArea").style.width = gameAreaWidth + "px";

	var gameAreaHeight = this._currentPuzzle.GetPlayGrid().Width();
	$("gameArea").style.height = gameAreaHeight + "px";
	$("gameArea").style.marginTop = -gameAreaHeight / 2 + "px";

	// Set the sizes of the areas.
	flipperGrid.style.width = flipperGrid.style.height = this._currentPuzzle.GetPlayGrid().Width() + "px";
	solutionGrid.style.width = solutionGrid.style.height = this._currentPuzzle.GetSolutionGrid().Width() + "px";

	$("par").textContent = "Par: " + this._currentPuzzle._solutionSet.GetClickPoints().length;
	$("difficultySpan").textContent = "Rating: " + this._currentPuzzle.GetDifficulty();

	var currentPuzzle = this._currentPuzzle;
	var resetButton = document.getElementById("reset");
	resetButton.onclick = function() { currentPuzzle.Reset(); }

	// Add event handler for the hint button
	var hintButton = document.getElementById("hint");
	hintButton.onclick = function() { currentPuzzle.GetHint(); }

	// probably doesn't belong here,
	// Add event handler for the skip button
	var skipButton = document.getElementById("skipButton");
	var myself = this;
	skipButton.onclick = function() { myself.LevelComplete(); }
};
