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
}

/******************************************************************************
 * Scales the game area according to the screen size,
 ******************************************************************************/
function ScaleGameArea()
{
	var gameAreaWidth = $("#gameArea").width();
	var gameAreaHeight = $("#gameArea").height();

	var gameAreaAspectRatio = gameAreaWidth / gameAreaHeight;

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();

	var heightDelta = windowHeight - gameAreaHeight;
	var widthDelta = windowWidth - gameAreaWidth;

	var scaleX = 0;
	var scaleY = 0;

	// Height is closer to what we want than width
	if (heightDelta <= widthDelta)
	{

		scaleY = windowHeight / gameAreaHeight;

		var newHeight = scaleY * gameAreaHeight;
		var newWidth = gameAreaAspectRatio * newHeight;

		scaleX = newWidth / gameAreaWidth;

	}
	else
	{
		scaleX = windowWidth / gameAreaWidth;

		var newWidth = scaleX * gameAreaWidth;
		var newHeight = newWidth / gameAreaAspectRatio;

		scaleY = newHeight / gameAreaHeight;
	}

	$("#gameArea").css("transform", "scale(" + scaleX + ", " + scaleY + ")");
}