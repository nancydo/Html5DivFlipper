/************************************************
 * An enum for the different game modes we support.
 ************************************************/
LevelManager.GameModes = {Timed: 0, Endless: 1, Challenge: 2};
LevelManager.PuzzlesPerChallenge = 10;

function LevelManager(gameMode, challengeNumber)
{
	this._puzzleFactory = new PuzzleFactory();
	this._puzzleNumber = 1;
	this._currentPuzzle = null;
	this._gameMode = gameMode;
	this._challenges = [];
	this._currentStars = 3;

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

		this._stopWatch = new StopWatch(1000, updateClock, timeOver, true);
		this._stopWatch.SetTimeRemaining(30000);
		this._stopWatch.Start();
		$("#gameClockIcon").attr('src', 'clock-icon.png');
	}

	if (this._gameMode == LevelManager.GameModes.Challenge)
	{
		this._threshholds = []

		var lowerbound = challengeNumber * 5;
		var upperbound = lowerbound + 10;

		// 10 seconds of animations
		var pseudoClicks = Math.ceil((challengeNumber + 1) / 4);
		var pseudoDiffAvg = LevelManager.PuzzlesPerChallenge * (lowerbound + upperbound) / 2;

		this._threshholds[0] = 10 + pseudoDiffAvg * pseudoClicks / 8;
		this._threshholds[1] = this._threshholds[0] * 2;
		this._threshholds[2] = this._threshholds[1] * 2;

		var _self = this;
		var updateClock = function(timeRemaining)
		{
			_self.UpdateClock(timeRemaining);
		};

		this._challengeNumber = challengeNumber;
		this._puzzleFactory.GetChallenges(lowerbound, upperbound, LevelManager.PuzzlesPerChallenge, this._challenges);
		$("#gameLevelLabel").text("Puzzle");

		this._stopWatch = new StopWatch(1000, updateClock, null, false);
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
	$("#gameLevelStatus").css("display", "block");
	$("#resetButton").css("display", "block");

	if (this._gameMode == LevelManager.GameModes.Timed ||
		this._gameMode == LevelManager.GameModes.Challenge)
	{
		$("#gameClockStatus").css("display", "block");
	}

	var _self = this;
	$("#resetButton").bind("click", function() 
	{ 
		_self._currentPuzzle.Reset();
	});
};

LevelManager.prototype.UpdateClock = function(timeRemaining)
{
	if (this._gameMode == LevelManager.GameModes.Challenge)
	{
		var timePlayed = timeRemaining / 1000;

		var thresh = 0;
		timeRemaining = 0;
		for (thresh = 0; thresh < this._threshholds.length; thresh++)
		{
			if (timePlayed < this._threshholds[thresh])
			{
				timeRemaining = (this._threshholds[thresh] - timePlayed) * 1000;
				break;
			}
		}
		this._currentStars = 3 - thresh;

		$("#gameClockIcon").attr('src', this._currentStars + 'stars.png');
	}

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

	if (minutesRemaining == 0 && 
		secondsRemaining < 10 && 
		this._gameMode == LevelManager.GameModes.Timed)
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
	$("#gameLevelStatus").css("display", "none");

	var _self = this;
	$("#resetButton").css("display", "none");
	$("#resetButton").unbind("click");

	if (this._gameMode == LevelManager.GameModes.Timed ||
		this._gameMode == LevelManager.GameModes.Challenge)
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

	if (this._gameMode == LevelManager.GameModes.Challenge)
	{
		var timePlayed = this._stopWatch.GetTimeRemaining() / 1000;
		var levelStats = SavedStateManager.GetLevelStats(this._challengeNumber);
		levelStats.Stars = this._currentStars;

		// Unlock the next level.
		if (levelStats.Stars > 0)
		{
			var nextLevelStats = SavedStateManager.GetLevelStats(this._challengeNumber + 1);
			nextLevelStats.Unlocked = true;
			SavedStateManager.SaveLevelStats(this._challengeNumber + 1, levelStats);
		}

		this._stopWatch.Stop();

		// Save the stats of this level.
		SavedStateManager.SaveLevelStats(this._challengeNumber, levelStats);
	}

	GameManager.ShowMainMenu();
	
	SoundManager.Pause("happyland");
};

/************************************************
 * Completes the level and starts the next one.
 ************************************************/
LevelManager.prototype.LevelComplete = function()
{
	if (this._gameMode == LevelManager.GameModes.Timed ||
		this._gameMode == LevelManager.GameModes.Endless)
	{
		this._puzzleNumber = this._currentPuzzle.GetDifficulty() + 1;
	}
	else if (this._gameMode == LevelManager.GameModes.Challenge)
	{
		this._puzzleNumber++;
	}

	this._currentPuzzle.GetPlayGrid().RemoveClickHandlers();

	var _self = this;
	setTimeout( function() {
		// Add 5 seconds per successful puzzle.	
		if (_self._gameMode == LevelManager.GameModes.Timed)
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

	if (this._gameMode == LevelManager.GameModes.Timed ||
		this._gameMode == LevelManager.GameModes.Endless)
	{
		this._currentPuzzle = this._puzzleFactory.GetPuzzle(this._puzzleNumber);
	}
	else if (this._gameMode == LevelManager.GameModes.Challenge)
	{
		// We're done with this challenge
		if (this._puzzleNumber == LevelManager.PuzzlesPerChallenge)
		{
			this._currentPuzzle = null;
			this.GameOver();
			return;
		}

		this._currentPuzzle = this._challenges[this._puzzleNumber];
	}

	this.SetupDivs();

	// Let the puzzle on the solution sit for 1 second before letting them play.
	var _self = this;
	setTimeout( function() { _self.BeginPuzzle(); }, 1000);

	$("#parStatus").text(this._currentPuzzle._solutionSet.GetClickPoints().length);
	$("#gameLevelContent").text(this._puzzleNumber);

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

LevelManager.prototype.ResetPuzzle = function()
{
	this._currentPuzzle.Reset();
}