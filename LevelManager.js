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
	this._currentPuzzle.ProcessClick(id);
	if (this._currentPuzzle.IsComplete())
	{
		this._puzzleNumber++;
		this.StartLevel();
	}
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
	

	var hackySpacingBetweenGrids = 100;
	// Center the gameArea on the screen
	var width = this._currentPuzzle.GetPlayGrid().Width() + this._currentPuzzle.GetSolutionGrid().Width() + hackySpacingBetweenGrids;
	$("gameArea").style.marginTop = -width / 2 + "px";
	$("gameArea").style.marginLeft = -width / 2 + "px";
	$("gameArea").style.width = width + "px";

	// Set the sizes of the areas.
	flipperGrid.style.width = flipperGrid.style.height = this._currentPuzzle.GetPlayGrid().Width() + "px";
	solutionGrid.style.width = solutionGrid.style.height = this._currentPuzzle.GetSolutionGrid().Width() + "px";

	var currentPuzzle = this._currentPuzzle;
	var resetButton = document.getElementById("reset");
	resetButton.onclick = function() { currentPuzzle.Reset(); }

	// Add event handler for the reset button
	var hintButton = document.getElementById("hint");
	hintButton.onclick = function() { currentPuzzle.GetHint(); }
}
