function LevelManager(puzzleFactory)
{
	//Set up locals
	this._puzzleFactory = puzzleFactory;
	this._puzzleNumber = 1;
	this._currentPuzzle = null;

	this.StartLevel();
};

LevelManager.prototype.OnClick = function(id)
{
	// TODO: Get Row and Column from id
	var row = 1;
	var col = 2;
	
	DROPLET.currentTime = 0;
	DROPLET.play();

	this._currentPuzzle.ProcessClick(id);
	if (this._currentPuzzle.IsComplete())
	{
		this._puzzleNumber = this._currentPuzzle.GetDifficulty() + 1;
		this.StartLevel();
	}
};

/************************************************
 * Completes the level and starts the next one.
 ************************************************/
LevelManager.prototype.LevelComplete= function()
{
	this._puzzleNumber = this._currentPuzzle.GetDifficulty() + 1;
	this.StartLevel();
};

LevelManager.prototype.StartLevel = function()
{
	var flipperGrid = document.getElementById("flipperGrid");
	var solutionGrid = document.getElementById("solutionGrid");

	// Destroy the divs if we have any.
	if (this._currentPuzzle != null)
	{
		this._currentPuzzle.GetPlayGrid().DestroyDivs(flipperGrid);
		this._currentPuzzle.GetSolutionGrid().DestroyDivs(solutionGrid);
	}

	// Get a new puzzle.
	this._currentPuzzle = this._puzzleFactory.GetPuzzle(this._puzzleNumber);
	
	// Create the divs for the new puzzle
	this._currentPuzzle.GetPlayGrid().CreateDivs(flipperGrid, this.OnClick, this);
	this._currentPuzzle.GetSolutionGrid().CreateDivs(solutionGrid);
	
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
