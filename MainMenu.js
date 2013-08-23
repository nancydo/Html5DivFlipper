// Constants!
var MAIN_MENU_BUTTON_TOP = 200;
var MAIN_MENU_BUTTON_RIGHT_START = 150;
var MAIN_MENU_BUTTON_RIGHT_FINAL = 100;
var MAIN_MENU_BUTTON_SPACER = 140;
var MAIN_MENU_STAGGER_DELAY = 100;
var ANIMATION_LENGTH = 500;

// Description of all of the buttons on this menu.
var MAIN_MENU_BUTTONS = [ { Label: "Challenge", Enabled: false, Icon:"star-icon.png" }, 
                { Label: "Timed", Enabled: true, Icon:"clock-icon.png" }, 
                { Label: "Endless", Enabled: false, Icon:"endless-icon.png"}, 
                { Label: "Options", Enabled: false, Icon:"wrench-icon.png"}];

// An enum for Main Menu button indices.
var MM_BUTTON_INDICES = {Progression: 0, Timed: 1, Endless: 2, Options: 3};

/******************************************************************************
 * A class which governs the main menu.
 * Makes use of the global singleton GameManager
 ******************************************************************************/
MainMenu = function()
{
	this._logo = null;
	this._buttonDivs = new Array(MAIN_MENU_BUTTONS.length);
	this._showing = false;
};

/******************************************************************************
 * Creates the main menu and animates it into view.
 ******************************************************************************/
MainMenu.prototype.Show = function()
{
	if (this._showing)
		return;

	this._showing = true;
	for (var i = 0; i < MAIN_MENU_BUTTONS.length; i++)
		this.ShowButton(i); 
};

/******************************************************************************
 * Animates the main menu away, and destroys the buttons.
 ******************************************************************************/
MainMenu.prototype.Hide = function()
{
	if (!this._showing)
		return;

	this._showing = false;
	for (var i = 0; i < MAIN_MENU_BUTTONS.length; i++)
		this.HideButton(i);
};

/******************************************************************************
 * Creates a button and animates it in.
 ******************************************************************************/
MainMenu.prototype.ShowButton = function(buttonIndex)
{
	var button = CreateDefaultButton();

	if (!MAIN_MENU_BUTTONS[buttonIndex].Enabled)
		button.className += "disabled ";

	// Have it animate in from the left, by specifying the right to be super far
	// then in its final place.
	button.style.right = MAIN_MENU_BUTTON_RIGHT_START + "px";
	button.style.top = MAIN_MENU_BUTTON_TOP + MAIN_MENU_BUTTON_SPACER * buttonIndex + "px";
	button.style.opacity = 0;

	// Create the label
	var label = document.createElement("div");
	label.className = "buttonLabel";
	label.textContent = MAIN_MENU_BUTTONS[buttonIndex].Label;
	button.appendChild(label);

	// Create the icon
	var icon = document.createElement("img");
	icon.src = MAIN_MENU_BUTTONS[buttonIndex].Icon;
	icon.className = "buttonIcon";
	button.appendChild(icon);

	// Setup the event handler
	var _self = this;
	button.onclick = function() 
		{ 
			_self.ButtonClick(buttonIndex); 
		};

	// After a short delay, move the button to its rightful location.
	var animateIn = function() 
		{ 
			button.style.right = MAIN_MENU_BUTTON_RIGHT_FINAL + "px"; 
			button.style.opacity = MAIN_MENU_BUTTONS[buttonIndex].Enabled ? 1 : 0.5;
		};

	var gameArea = document.getElementById("gameArea");
	gameArea.appendChild(button);
	this._buttonDivs[buttonIndex] = button;

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
	else
		return;

	// Remove all on click handlers (performance in IE?)
	// Stops Nam from breaking things.
	for (var i = 0; i < MAIN_MENU_BUTTONS.length; i++)
		this._buttonDivs.onclick = null;

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
	var button = this._buttonDivs[buttonIndex];
	var _self = this;

	// Animate the button away,
	var animateAway = function()
	{
		button.style.right = MAIN_MENU_BUTTON_RIGHT_START + "px";
		button.style.opacity = 0;
		setTimeout( function() 
		{
			_self.DestroyButton(buttonIndex);
		}, ANIMATION_LENGTH);
	};

	setTimeout(animateAway, 1 + buttonIndex * MAIN_MENU_STAGGER_DELAY);
};

/******************************************************************************
 * Destroys a button.
 ******************************************************************************/
MainMenu.prototype.DestroyButton = function(buttonIndex)
{
	var gameArea = document.getElementById("gameArea");
	gameArea.removeChild(this._buttonDivs[buttonIndex]);
	this._buttonDivs[buttonIndex] = null;
};

/******************************************************************************
 * Creates a button.
 ******************************************************************************/
function CreateDefaultButton()
{
	var defaultButton = document.createElement("div");
	defaultButton.className += "button ";
	return defaultButton;
}