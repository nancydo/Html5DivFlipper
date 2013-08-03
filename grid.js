// Grid Globals
var ENUM_BASE_STATE = { ALL_ON: 0, OUTLINE: 1, BACKSLASH: 2, DIAMOND: 3, CHECKERBOARD: 4, NUM_PATTERNS: 5};

// Grid Class
Grid = function(gridSize, baseState, rectangleSize, rectanglePadding)
{
	this.grid = Create2DArray(gridSize, gridSize);
	this.gridSize = gridSize;
	this.rectangleSize = rectangleSize;
	this.rectanglePadding = rectanglePadding;

	for (var row = 0; row < gridSize; row++)
	{
		for (var col = 0; col < gridSize; col++)
		{
			// Create a grid where all rectangles are "on"
			this.grid[row][col] = new Rectangle(true);
		}
	}

	this.FlipBaseState(baseState);
}

Grid.prototype.CreateDivs = function(outerDiv, handler, self)
{
	for (var row = 0; row < this.gridSize; row++)
	{
		for (var col = 0; col < this.gridSize; col++)
		{
			var rectangle = this.grid[row][col];

			var div = document.createElement("div");
			div.className = rectangle.on ? "rectangleOn" : "rectangleOff";
			div.id = row + ":" + col;
			div.style.width = div.style.height = this.rectangleSize + "px";
			div.style.left = col * (this.rectangleSize + this.rectanglePadding) + "px";
			div.style.top = row * (this.rectangleSize + this.rectanglePadding)+ "px";
			div.onclick =  function() { self.OnClick(this.id); };
			this.grid[row][col].div = div;
			outerDiv.appendChild(div);
		}
	}
};

Grid.prototype.DestroyDivs = function(outerDiv)
{
	for (var row = 0; row < this.gridSize; row++)
	{
		for (var col = 0; col < this.gridSize; col++)
		{
			var rectangle = this.grid[row][col];
			outerDiv.removeChild(rectangle.div);
		}
	}
};

Grid.prototype.Width = function()
{
	return this.rectangleSize * this.gridSize + (this.gridSize - 1) * this.rectanglePadding;
}

Grid.prototype.GridClick = function(id)
{
	id = id.split(":");
	var row = 1 * id[0];
	var col = 1 * id[1];
	this.FlipSquare(row, col);
}

// Flips the elements of this grid corresponding to the base state.
// Assumes an "all on grid"
Grid.prototype.FlipBaseState = function(baseState)
{
	this.SetupAllOn();

	// Grids are by default all on.
	if (baseState == ENUM_BASE_STATE.ALL_ON)
		return;

	if (baseState == ENUM_BASE_STATE.OUTLINE)
		this.SetupBaseOutline();

	if (baseState == ENUM_BASE_STATE.BACKSLASH)
		this.SetupBaseBackslash();

	if (baseState == ENUM_BASE_STATE.DIAMOND)
		this.SetupBaseDiamond();

	if (baseState == ENUM_BASE_STATE.CHECKERBOARD)
		this.SetupBaseCheckerBoard();
};

Grid.prototype.SetupBaseCheckerBoard = function()
{
	for (var row = 0; row < this.gridSize; row++)
	{
		for (var col = 0; col < this.gridSize; col++)
		{
			if ((row + col) % 2 == 0)
				this.grid[row][col].EnsureOff();
		}
	}
}

// Ensures all rectangles are on.
Grid.prototype.SetupAllOn = function()
{
	for (var row = 0; row < this.gridSize; row++)
	{
		for (var col = 0; col < this.gridSize; col++)
		{
			this.grid[row][col].EnsureOn();
		}
	}
}

// Flips the grid to look like
// xxxxx
// x...x
// x...x
// x...x
// xxxxx
Grid.prototype.SetupBaseOutline = function()
{
	for (var i = 0; i < this.gridSize; i++)
	{
		for (var j = 0; j < this.gridSize; j++)
		{
			if (i == 0 || j == 0 || i == this.gridSize - 1 || j == this.gridSize - 1)
			{
				this.grid[i][j].EnsureOff();
			}
		}
	}
};

// Flips a backslash
// x....
// .x...
// ..x..
// ...x.
// ....x
Grid.prototype.SetupBaseBackslash = function()
{
	for (var i = 0; i < this.gridSize; i++)
	{
		this.grid[i][i].EnsureOff();
	}	
};

// Flips a diamond
// ..x..   ..xx..
// .x.x.   .x..x.
// x.5.x   x..6.x
// .x.x.   x....x
// ..x..   .x..x.
//         ..xx..
Grid.prototype.SetupBaseDiamond = function()
{
	var gridMax = this.gridSize - 1;
	var midpoint = gridMax / 2;

	// On 'even' grids, the midpoint is in the middle
	var midpointOffset = (this.gridSize % 2) == 0 ? 0.5 : 0;

	for (var i = 0; i <= midpoint; i++)
	{
		var currentAdjustment = midpointOffset + i;

		this.grid[i][midpoint + currentAdjustment].EnsureOff();
		this.grid[i][midpoint - currentAdjustment].EnsureOff();
		
		this.grid[gridMax - i][midpoint + currentAdjustment].EnsureOff();
		this.grid[gridMax - i][midpoint - currentAdjustment].EnsureOff();
	}
};


// Returns true if this grid is in the same configuration as the 
// specified grid.
Grid.prototype.SameConfiguration = function(grid2)
{
	// Must have the same number of rows.
	if (this.grid.length != grid2.grid.length)
		return false;

	for (var row = 0; row < this.grid.length; row++)
	{
		for (var col = 0; col < this.grid[row].length; col++)
		{
			// Each row must have same number of columns
			if (this.grid[row].length != grid2.grid[row].length)
				return false;

			// Each slot must be the same state
			if (this.grid[row][col].on != grid2.grid[row][col].on)
				return false;
		}
	}

	return true;
};


// Update all the elements in the grid
Grid.prototype.Update = function(ctx)
{
	for (var row = 0; row < this.gridSize; row++)
	{
		for (var col = 0; col < this.gridSize; col++)
		{
			this.grid[row][col].Update();
		}
	}
};


Grid.prototype.SetHintPoint = function(point)
{
	this.grid[point.x][point.y].Hint();
}

// Flips a square centered at grid[x][y]
Grid.prototype.FlipSquare = function(row, col)
{
	for (var i = -1; i <= 1; i++)
	{
		for (var j = -1; j <= 1; j++)
		{
			var curRow = row + i;
			var curCol = col + j;
			if (curRow >= 0 && curCol >= 0 && this.grid && this.grid[curRow])
			{
				var rectangle = this.grid[curRow][curCol];
				if (rectangle != null)
				{
					rectangle.Flip();
				}
			}
		}
	}
};