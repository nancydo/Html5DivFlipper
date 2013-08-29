// Global Variables
var SoundManager;
var GameManager;
var SavedStateManager;

var RECTANGLE_SIZE = 60;
var RECTANGLE_PADDING = 5;

// Called immediately once our window loads
// We should set up our globals here.
function InitGlobals()
{	
	SavedStateManager = new SavedStateManagerClass();
	SavedStateManager.ApplySettings();

	SoundManager = new SoundManagerClass();

	SoundManager.SetMasterVolume(0.7);
	SoundManager.SetMusicVolume(0.3);
	SoundManager.SetEffectVolume(0.6);

	GameManager = new GameManagerClass();
}

// The main function called on window load
function Main()
{
	InitGlobals();
	ScaleGameArea();
	$(window).bind("resize", ScaleGameArea);
};