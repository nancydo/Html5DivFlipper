/******************************************************************************
 * SavedStateManager
 * A class used to store settings / state of the user.
 ******************************************************************************/
SavedStateManagerClass = function()
{
	this._savedState = new SavedState();
	this.LoadData();
};

/******************************************************************************
 * Applies the current settings to the game
 ******************************************************************************/
SavedStateManagerClass.prototype.ApplySettings = function()
{
	SetCssTheme(this._savedState["Theme"]);
};

/******************************************************************************
 * Loads Data from the cookie.
 ******************************************************************************/
SavedStateManagerClass.prototype.LoadData = function()
{
	var cookies = document.cookie.split(';');
    if (cookies[0])
    	this._savedState = JSON.parse(unescape(cookies[0]));
};

/******************************************************************************
 * Resets all the data to the defaults.
 ******************************************************************************/
SavedStateManagerClass.prototype.ResetData = function()
{
	this._savedState = new SavedState();
	this.ApplySettings();
	this.SaveData();
};

/******************************************************************************
 * Saves the data to the cookie.
 ******************************************************************************/
SavedStateManagerClass.prototype.SaveData = function()
{
	document.cookie = escape(JSON.stringify(this._savedState))
		+ ';expires=' + new Date(2100, 02, 02).toUTCString();
};

/******************************************************************************
 * Sets the theme name in the saved state
 ******************************************************************************/
SavedStateManagerClass.prototype.SetProperty = function(propertyName, propertyValue)
{
	this._savedState[propertyName] = propertyValue;
	this.SaveData();
};

SavedStateManagerClass.prototype.GetLevelStats = function(levelNumber)
{
	return this._savedState["ChallengeStats"].Levels[levelNumber];
};

SavedStateManagerClass.prototype.SaveLevelStats = function(levelStats, levelNumber)
{
	this._savedState["ChallengeStats"].Levels[levelNumber] = levelStats;
	this.SaveData();
};

/******************************************************************************
 * Creates a new saved state with the default settings.
 ******************************************************************************/
var SavedState = function()
{
	this["Theme"] = "Nancy";
	this["ChallengeStats"] = new ChallengeStats();
};

var ChallengeStats = function()
{
	this.Levels = [];
	for (var i = 0; i < 50; i++)
	{
		this.Levels[i] = new LevelStats();
	}

	this.Levels[0].Unlocked = true;
};

var LevelStats = function()
{
	this.Unlocked = false;
	this.Stars = 0;
};
