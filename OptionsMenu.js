OptionsMenu = function()
{
	this._optionsOpen = false;

	$("#volume").slider({
      orientation: "horizontal",
      range: "min",
      value: 0.3,
      min: 0,
      max: 1,
      step: 0.1,
      slide: function( event, ui ) {
        $( "#amount" ).text( "Volume: " + ui.value );
        SoundManager.SetMusicVolume(ui.value);
    	}
 	});

  $( "#amount" ).text( "Volume: " + $("#volume").slider("value") );
}

/******************************************************************************
 * Shows the options menu
 ******************************************************************************/
OptionsMenu.prototype.ShowOptionsMenu = function()
{
	/*$("#gameArea").css("background-color", "#FF99C2");
	$("#gameArea").css("opacity", "0.5");*/
  $("#options").css("display", "block");
  $("#optionsButton").css("width", "500px");

	// Show the options buttons
	this._optionsOpen = true;
}

/******************************************************************************
 * Hides the options menu, does the opposite of ShowOptionsMenu
 ******************************************************************************/
OptionsMenu.prototype.HideOptionsMenu = function()
{
	/*$("#gameArea").css("background-color", "");
	$("#gameArea").css("opacity", "1");*/
  $("#options").css("display", "none");
  $("#optionsButton").css("width", "");

	this._optionsOpen = false;
}

OptionsMenu.prototype.ToggleOptionsMenu = function()
{
  this._optionsOpen ? this.HideOptionsMenu() : this.ShowOptionsMenu();
}