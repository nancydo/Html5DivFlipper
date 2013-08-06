// Global Variables
var RECTANGLE_SIZE = 60;
var RECTANGLE_PADDING = 5;
var DROPLET = new Audio("droplet.mp3");
var BG_MUSIC = new Audio("happyland.mp3");

// Called immediately once our window loads
// We should set up our globals here.
function InitGlobals()
{
	BG_MUSIC.volume = 0.4;
//	BG_MUSIC.play();
	BG_MUSIC.loop = true;
}

// The main function called on window load
window.onload = function()
{
	InitGlobals();
	var puzzleFactory = new PuzzleFactory();
	var levelManager = new LevelManager(puzzleFactory);
};