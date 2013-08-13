/******************************************************************************
 * A class which is responsible for governing game control through menus
 * and launching games.
 ******************************************************************************/
GameManagerClass = function()
{
	this._animatedBackground = new AnimatedBackground();
	this._mainMenu = new MainMenu();

	this._levelManager = null;
	this.ShowMainMenu();
};

/******************************************************************************
 * Creates and shows the main menu.
 ******************************************************************************/
GameManagerClass.prototype.ShowMainMenu = function()
{
	this._mainMenu.Show();
};

/******************************************************************************
 * Creates the divs for and begins a game for Timed Mode.
 ******************************************************************************/
GameManagerClass.prototype.BeginTimedMode = function()
{
	// Since these live in the HTML right now, find them and show them.
	var gameArea = document.getElementById("gameArea");
	gameArea.style.display = "block";

	var gameClock = document.getElementById("gameClock");
	gameClock.style.display = "block";

	this._levelManager = new LevelManager();
};