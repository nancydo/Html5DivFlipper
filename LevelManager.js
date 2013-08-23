/************************************************
 * An enum for the different game modes we support.
 ************************************************/
LevelManager.GameModes = {Timed: 0, Endless: 1, Challenge: 2};

function LevelManager(gameMode)
{
	this._puzzleFactory = new PuzzleFactory();
	this._puzzleNumber = 1;
	this._currentPuzzle = null;
	this._gameMode = gameMode;

	this.RevealGameComponents();

	// Create the game clock for Timed mode.
	if (this._gameMode == LevelManager.GameModes.Timed)
	{
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
	}

	this.StartLevel();
	SoundManager.Play("happyland");
};

/******************************************************************************
 * Reveals the divs within the game area required for this game mode.
 ******************************************************************************/
LevelManager.prototype.RevealGameComponents = function()
{
	$("#flipperGrid").css("display", "block");
	$("#solutionParStatus").css("display", "block");

	if (this._gameMode == LevelManager.GameModes.Timed)
	{
		$("#gameClockStatus").css("display", "block");
	}
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

	var gameClock = document.getElementById("gameClockLabel");
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

LevelManager.prototype.HideGameComponents = function()
{
	$("#flipperGrid").css("display", "none");
	$("#solutionParStatus").css("display", "none");

	if (this._gameMode == LevelManager.GameModes.Timed)
	{
		$("#gameClockStatus").css("display", "none");
	}
};

/************************************************
 * Ends the current LevelManager and cleans up.
 ************************************************/
LevelManager.prototype.GameOver = function()
{
	this.DestroyDivs();

	this.HideGameComponents();

	// Maybe GameManger.EndTimedMode()
	GameManager.ShowMainMenu();
	
	SoundManager.Pause("happyland");
};

/************************************************
 * Completes the level and starts the next one.
 ************************************************/
LevelManager.prototype.LevelComplete = function()
{
	this._puzzleNumber = this._currentPuzzle.GetDifficulty() + 1;

	this._currentPuzzle.GetPlayGrid().RemoveClickHandlers();


	var _self = this;
	setTimeout( function() {
		// Add 5 seconds per successful puzzle.	
		if (this._gameMode == LevelManager.GameModes.Timed)
			_self._stopWatch.AddTime(5000);
	
		SoundManager.Play("complete"); 
		_self.StartLevel();
	}, 500);

};


LevelManager.prototype.SetupDivs = function()
{
	var flipperGrid = document.getElementById("flipperGrid");
	var solutionGrid = document.getElementById("solutionGrid");

	// Create the divs for the new puzzle
	this._currentPuzzle.GetPlayGrid().CreateDivs(flipperGrid);
	this._currentPuzzle.GetSolutionGrid().CreateDivs(solutionGrid);
};

LevelManager.prototype.DestroyDivs = function()
{
	// Destroy the divs if we have any.
	if (this._currentPuzzle != null)
	{
		var flipperGrid = document.getElementById("flipperGrid");
		var solutionGrid = document.getElementById("solutionGrid");
		this._currentPuzzle.GetPlayGrid().DestroyDivs(flipperGrid);
		this._currentPuzzle.GetSolutionGrid().DestroyDivs(solutionGrid);
	}
};

LevelManager.prototype.StartLevel = function()
{
	this.DestroyDivs();

	this._currentPuzzle = this._puzzleFactory.GetPuzzle(this._puzzleNumber);
	this.SetupDivs();

	// Let the puzzle on the solution sit for 1 second before letting them play.
	var _self = this;
	setTimeout( function() { _self.BeginPuzzle(); }, 1000);

	$("#parStatus").text(this._currentPuzzle._solutionSet.GetClickPoints().length);
	$("#levelStatus").text("Rating: " + this._currentPuzzle.GetDifficulty());

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