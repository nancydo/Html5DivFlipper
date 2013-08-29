function Create2DArray(rows, cols)
{
	var returnArray = new Array();
	for (var i = 0; i < rows; i++)
		returnArray[i] = new Array(cols);

	return returnArray;
};

Point = function(x, y)
{
	// By default, it will be (0,0)
	this.x = 0;
	this.y = 0;

	if (x != null)
		this.x = x;

	if (y != null)
		this.y = y;
};

/******************************************************************************
 * Switches the CSS of the current color theme
 ******************************************************************************/
function SetCssTheme(themeTitle)
{
	var linkElements = document.getElementsByTagName("link");
	for (var i = 0;  i < linkElements.length; i++)
	{
		// If the rel contains the word stylesheet, and has a title
		if ((linkElements[i].rel.indexOf( "stylesheet" ) != -1) && linkElements[i].title) 
		{
			// Disable this theme
			linkElements[i].disabled = true;

			// Unless it has the theme we're switching to.
			if (linkElements[i].title == themeTitle)
				linkElements[i].disabled = false ;
		}
    }

    // Store this preference
    SavedStateManager.SetProperty("Theme", themeTitle);
}

/******************************************************************************
 * Scales the game area according to the screen size,
 ******************************************************************************/
function ScaleGameArea()
{
	var gameAreaWidth = $("#scalingContainer").width();
	var gameAreaHeight = $("#scalingContainer").height();

	var gameAreaAspectRatio = gameAreaWidth / gameAreaHeight;

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();

	var scaleY = windowHeight / gameAreaHeight;
	var scaleX = windowWidth / gameAreaWidth;

	// Height is closer to what we want than width
	if (scaleY <= scaleX)
		scaleX = (gameAreaAspectRatio * windowHeight) / gameAreaWidth;
	else
		scaleY = (windowWidth / gameAreaAspectRatio) / gameAreaHeight;

	$("#scalingContainer").css("transform", "scale(" + scaleX + ", " + scaleY + ")");
}