// Global Variables
var CURRENT_LEVEL;
var LEVEL_NUMBER = 5	;
var RECTANGLE_SIZE = 60;
var RECTANGLE_PADDING = 5;

var DROPLET = new Audio("droplet.mp3");
var BG_MUSIC = new Audio("happyland.mp3");
var GRID_SIZE = 5;
var GRID;

// Called immediately once our window loads
// We should set up our globals here.
function InitGlobals()
{
	/*BG_MUSIC.volume = 0.4;
	BG_MUSIC.play();
	BG_MUSIC.loop = true;*/
}

// The main function called on window load
window.onload = function()
{
	InitGlobals();
	CURRENT_LEVEL = new Level(GRID_SIZE, LEVEL_NUMBER);

	// Add event handler for the reset button
	var resetButton = document.getElementById("reset");
	resetButton.onclick = function() { CURRENT_LEVEL.Reset(); }

	// Add event handler for the reset button
	var hintButton = document.getElementById("hint");
	hintButton.onclick = function() { CURRENT_LEVEL.GetHint(); }

};