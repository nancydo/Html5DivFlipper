// Global Variables
var CURRENT_LEVEL;
var LEVEL_NUMBER = 0;
var RECTANGLE_SIZE = 45;
var RECTANGLE_PADDING = 5;

var DROPLET = new Audio("droplet.mp3");
var BG_MUSIC = new Audio("happyland.mp3");
var GRID_SIZE = 5;
var GRID;


function Create2DArray(rows, cols)
{
	var returnArray = new Array();
	for (var i = 0; i < rows; i++)
		returnArray[i] = new Array(cols);

	return returnArray;
}

// Called immediately once our window loads
// We should set up our globals here.
function InitGlobals()
{
	BG_MUSIC.volume = 0.4;
	BG_MUSIC.play();
	BG_MUSIC.loop = true;
}

function GridClick(event)
{
	var id = this.id.split(":");
	var row = 1 * id[0];
	var col = 1 * id[1];

	for (var i = -1; i <= 1; i++)
	{
		for (var j = -1; j <= 1; j++)
		{
			var curRow = row + i;
			var curCol = col + j;
			if (curRow >= 0 && curCol >= 0)
			{
				var rectangle = GRID[curRow][curCol];
				if (rectangle != null)
				{
					if (rectangle.className == "rectangleOn")
						rectangle.className = "rectangleOff";
					else
						rectangle.className = "rectangleOn";
				}
			}
		}
	}
}

function SetupGrid()
{
	var flipperGrid = document.getElementById("flipperGrid");
	GRID = Create2DArray(GRID_SIZE, GRID_SIZE);

	for (var row = 0; row < GRID_SIZE; row++)
	{
		for (var col = 0; col < GRID_SIZE; col++)
		{
			var rectangle = document.createElement("div");
			rectangle.className = "rectangleOff";
			rectangle.id = row + ":" + col;
			rectangle.style.width = rectangle.style.height = RECTANGLE_SIZE + "px";
			rectangle.onclick = GridClick;
			flipperGrid.appendChild(rectangle);
			GRID[row][col] = rectangle;

		}
	}
}

function CenterTiles()
{
	var top = (window.innerHeight - GRID_SIZE * (RECTANGLE_SIZE + RECTANGLE_PADDING)) / 2;
	var left = (window.innerWidth - GRID_SIZE * (RECTANGLE_SIZE + RECTANGLE_PADDING)) / 2;
	for (var i = 0; i < GRID_SIZE; i++)
	{
		for (var j = 0; j < GRID_SIZE; j++)
		{
			var rectangle = GRID[i][j];
			rectangle.style.left = left + (i * (RECTANGLE_SIZE + RECTANGLE_PADDING)) + "px";
			rectangle.style.top =  top + (j * (RECTANGLE_SIZE + RECTANGLE_PADDING)) + "px";
		}
	}
}

window.onresize = function()
{
	CenterTiles();

}

// The main function called on window load
window.onload = function()
{
	SetupGrid();
	CenterTiles();

	// Add event handler for the reset button
	var resetButton = document.getElementById("reset");

	// Add event handler for the reset button
	var hintButton = document.getElementById("hint");
};