// Global Variables
var SoundManager;

var RECTANGLE_SIZE = 60;
var RECTANGLE_PADDING = 5;

// Called immediately once our window loads
// We should set up our globals here.
function InitGlobals()
{	
	SoundManager = new SoundManagerClass();
	SoundManager.SetMasterVolume(0.7);
	SoundManager.SetMusicVolume(0.3);
	SoundManager.SetEffectVolume(0.6);
}

// The main function called on window load
window.onload = function()
{
	InitGlobals();

	var levelManager = new LevelManager();
};