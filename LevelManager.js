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
	// Get total seconds remaining.
	var secondsRemaining = Math.floor(timeRemaining / 1000.0);

	// Get total minutes remaining and adjust remaining seconds.
	var minutesRemaining = Math.floor(secondsRemaining / 60.0); 
	secondsRemaining = secondsRemaining % 60;

	var timeString = "";

	if (minutesRemaining < 10)
		timeString += "0";

	timeString += minutesRemaining;
	timeString += ":";

	// Start ticking with less than 10 seconds left.
	if (secondsRemaining < 10)
		timeString += "0";

	timeString += secondsRemaining;

	var gameClock = document.getElementById("gameClock");
	gameClock.textContent = timeString;

	if (minutesRemaining == 0 && secondsRemaining < 10)
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
	this.DestroyDivs();

	var gameArea = document.getElementById("gameArea");
	gameArea.style.display = "none";

	var gameClock = document.getElementById("gameClock");
	gameClock.style.display = "none";

	GameManager.ShowMainMenu();
	
	SoundManager.Pause("happyland");
};

/************************************************
 * Completes the level and starts the next one.
 ************************************************/
LevelManager.prototype.LevelComplete = function()
{
	// Since these live in the HTML right now, find them and show them.
	var gameArea = document.getElementById("gameArea");
	var gameClock = document.getElementById("gameClock");

	this._puzzleNumber = this._currentPuzzle.GetDifficulty() + 1;
	this.StartLevel();

	// Add 5 seconds per successful puzzle.
	this._stopWatch.AddTime(5000);
	SoundManager.Play("complete");
};


LevelManager.prototype.SetupDivs = function()
{
	var flipperGrid = document.getElementById("flipperGrid");

	// Create the divs for the new puzzle
	this._currentPuzzle.GetPlayGrid().CreateDivs(flipperGrid);

	// Center the game area on the screen.
	var gameAreaDiv = document.getElementById("gameArea");
	var gameAreaWidth = this._currentPuzzle.GetPlayGrid().Width();// + this._currentPuzzle.GetSolutionGrid().Width() + hackySpacingBetweenGrids;

	gameAreaDiv.style.marginLeft = -gameAreaWidth / 2 + "px";
	gameAreaDiv.style.marginTop = -gameAreaWidth / 2 + "px";

	gameAreaDiv.style.width = gameAreaWidth + "px";
	gameAreaDiv.style.height = gameAreaWidth + "px";

	// Set the sizes of the areas.
	flipperGrid.style.width = flipperGrid.style.height = this._currentPuzzle.GetPlayGrid().Width() + "px";
};

LevelManager.prototype.DestroyDivs = function()
{
	var flipperGrid = document.getElementById("flipperGrid");

	// Destroy the divs if we have any.
	if (this._currentPuzzle != null)
		this._currentPuzzle.GetPlayGrid().DestroyDivs(flipperGrid);
};

LevelManager.prototype.StartLevel = function()
{
	this.DestroyDivs();

	this._currentPuzzle = this._puzzleFactory.GetPuzzle(this._puzzleNumber);
	this.SetupDivs();

	// Let the puzzle on the solution sit for 1 second before letting them play.
	var _self = this;
	setTimeout( function() { _self.BeginPuzzle(); }, 1000);

	$("par").textContent = "Par: " + this._currentPuzzle._solutionSet.GetClickPoints().length;
	$("difficultySpan").textContent = "Rating: " + this._currentPuzzle.GetDifficulty();

	var currentPuzzle = this._currentPuzzle;
};

LevelManager.prototype.BeginPuzzle = function()
{
	this._currentPuzzle.FlipSolution();

	var _self = this;
	var clickHandler = function()
		{
			_self.OnClick(this.id);
		};

	this._currentPuzzle.GetPlayGrid().AttachClickHandlers(clickHandler);
}