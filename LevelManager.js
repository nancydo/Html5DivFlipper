function LevelManager(levelFactory)
{
	//Set up locals
	this.levelFactory = levelFactory;
	this.level = 1;

	this.StartLevel();

};

LevelManager.prototype.OnClick = function(id)
{
	this.currentLevel.ProcessClick(id);
	if (this.currentLevel.IsComplete())
	{
		this.level++;
		this.StartLevel();
	}
};

LevelManager.prototype.StartLevel = function()
{
	this.currentLevel = this.levelFactory.GetLevel(this.level);
	
	var flipperGrid = document.getElementById("flipperGrid");
	this.currentLevel.currentGrid.CreateDivs(flipperGrid, this.OnClick, this);
	flipperGrid.style.width = flipperGrid.style.height = this.currentLevel.currentGrid.Width() + "px";

	var solutionGrid = document.getElementById("solutionGrid");
	this.currentLevel.winningGrid.CreateDivs(solutionGrid);
	solutionGrid.style.width = solutionGrid.style.height = this.currentLevel.winningGrid.Width() + "px";

	var currentLevel = this.currentLevel;

	// Set up the buttons... this code might move
	// This does not work right now!
	var resetButton = document.getElementById("reset");
	resetButton.onclick = function() { currentLevel.Reset(); }

	// Add event handler for the reset button
	var hintButton = document.getElementById("hint");
	hintButton.onclick = function() { currentLevel.GetHint(); }
}
