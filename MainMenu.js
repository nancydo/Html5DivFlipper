// Constants!
var MAIN_MENU_BUTTON_TOP = 200;
var MAIN_MENU_BUTTON_RIGHT_START = 150;
var MAIN_MENU_BUTTON_RIGHT_FINAL = 100;
var MAIN_MENU_BUTTON_SPACER = 140;
var MAIN_MENU_STAGGER_DELAY = 100;
var ANIMATION_LENGTH = 500;

// Description of all of the buttons on this menu.
var MAIN_MENU_BUTTONS = [
	{ Label: "challengeButton", Enabled: false},
	{ Label: "timedButton", Enabled: true},
	{ Label: "endlessButton", Enabled: true},
	{ Label: "optionsButton", Enabled: false}
	];

// An enum for Main Menu button indices.
var MM_BUTTON_INDICES = {Progression: 0, Timed: 1, Endless: 2, Options: 3};

/******************************************************************************
 * A class which governs the main menu.
 * Makes use of the global singleton GameManager
 ******************************************************************************/
MainMenu = function()
{
	this._logo = null;
	this._showing = false;
};

/******************************************************************************
 * Creates the main menu and animates it into view.
 ******************************************************************************/
MainMenu.prototype.Show = function()
{
	if (!this._showing)
	{
		this._showing = true;
		for (var i = 0; i < MAIN_MENU_BUTTONS.length; i++)
			this.ShowButton(i);
	}
};

/******************************************************************************
 * Animates the main menu away, and destroys the buttons.
 ******************************************************************************/
MainMenu.prototype.Hide = function()
{
	if (this._showing) 
	{
		this._showing = false;
		for (var i = 0; i < MAIN_MENU_BUTTONS.length; i++)
			this.HideButton(i);
	}
};

/******************************************************************************
 * Creates a button and animates it in.
 ******************************************************************************/
MainMenu.prototype.ShowButton = function(buttonIndex)
{
	var button = this.GetButtonFromIndex(buttonIndex);
	/*if (!MAIN_MENU_BUTTONS[buttonIndex].Enabled)
		button.className += "disabled ";*/

	// Have it animate in from the left, by specifying the right to be super far
	// then in its final place.
	button.css("display", "block");
	button.css("right", MAIN_MENU_BUTTON_RIGHT_START + "px");
	button.css("opacity", 0);


	// Setup the event handler
	var _self = this;
	button.bind("click", function() 
		{ 
			_self.ButtonClick(buttonIndex); 
		});

	// After a short delay, move the button to its rightful location.
	var animateIn = function() 
		{ 
			button.css("right", MAIN_MENU_BUTTON_RIGHT_FINAL + "px"); 
			button.css("opacity", MAIN_MENU_BUTTONS[buttonIndex].Enabled ? 1 : 0.5);
		};

	setTimeout(animateIn, 1 + buttonIndex * MAIN_MENU_STAGGER_DELAY);
};

/******************************************************************************
 * The callback for when someone clicks a button on the main menu.
 ******************************************************************************/
MainMenu.prototype.ButtonClick = function(buttonIndex)
{
	SoundManager.Play("boimp");

	var callBack = null;
	if (buttonIndex == MM_BUTTON_INDICES.Timed)
	{
		callBack = function()
		{ 
			GameManager.BeginTimedMode(); 
		};
	}
	else if (buttonIndex = MM_BUTTON_INDICES.Endless)
	{
		callBack = function()
		{ 
			GameManager.BeginEndlessMode(); 
		};
	}
	else
		return;

	// Remove all on click handlers (performance in IE?)
	// Stops Nam from breaking things.
	for (var i = 0; i < MAIN_MENU_BUTTONS.length; i++)
	{
		var button = this.GetButtonFromIndex(buttonIndex);
		button.unbind("click");
	}

	// After stagger delay * number of buttons AND the animation length,
	// start the game.
	setTimeout(callBack, ANIMATION_LENGTH + MAIN_MENU_STAGGER_DELAY * MAIN_MENU_BUTTONS.length);

	// Hide the main menu.
	this.Hide();
};

/******************************************************************************
 * Animates a button off the screen and sets it up to be destroyed.
 ******************************************************************************/
MainMenu.prototype.HideButton = function(buttonIndex)
{
	var button = this.GetButtonFromIndex(buttonIndex);
	var _self = this;

	// Animate the button away,
	var animateAway = function()
	{
		button.css("right", MAIN_MENU_BUTTON_RIGHT_START + "px");
		button.css("opacity", 0);

		// Once the animation has completed, lets set it to display: none
		// so we can't click it anymore.
		setTimeout( function() 
		{
			button.css("display", "none");
		}, ANIMATION_LENGTH);

		setTimeout()
	};

	setTimeout(animateAway, 1 + buttonIndex * MAIN_MENU_STAGGER_DELAY);
};

/******************************************************************************
 * Returns button at an index.
 ******************************************************************************/
MainMenu.prototype.GetButtonFromIndex = function(buttonIndex)
{
	var buttonId = "#" + MAIN_MENU_BUTTONS[buttonIndex].Label;
	var button = $(buttonId);
	return button;
}