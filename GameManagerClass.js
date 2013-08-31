/******************************************************************************
 * A class which is responsible for governing game control through menus
 * and launching games.
 ******************************************************************************/
GameManagerClass = function()
{
	this._animatedBackground = new AnimatedBackground();
	this._mainMenu = new MainMenu();
	this._optionsMenu = new OptionsMenu();
	this._challengeMenu = new ChallengeMenu();

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
	this._levelManager = new LevelManager(LevelManager.GameModes.Timed);
};

GameManagerClass.prototype.ShowChallengeMenu = function()
{
	this._challengeMenu.Show();
}

GameManagerClass.prototype.BeginEndlessMode = function()
{
	this._levelManager = new LevelManager(LevelManager.GameModes.Endless);
}

GameManagerClass.prototype.OptionsMenu = function()
{
	return this._optionsMenu;
}

GameManagerClass.prototype.BeginChallengeMode = function(lowerbound, upperbound)
{
	this._levelManager = new LevelManager(LevelManager.GameModes.Challenge, lowerbound, upperbound);
}