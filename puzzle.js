/***************************************************
 * Puzzle.js
 * Describes a puzzle
 ***************************************************/
Puzzle = function(size, baseState, solutionSet)
{
	this._size = size;
	this._playGrid = new Grid(size, baseState, RECTANGLE_SIZE, RECTANGLE_PADDING);
	this._solutionGrid = new Grid(size, baseState, RECTANGLE_SIZE, RECTANGLE_PADDING);
	this._baseState = baseState;
	this._solutionSet = solutionSet;
	this.FlipSolution();
};

/************************************************
 * Flips all the squares around solution click points.
 ************************************************/
Puzzle.prototype.FlipSolution = function()
{
	var clickPoints = this._solutionSet.GetClickPoints();
	for (var i = 0; i < clickPoints.length; i++)
	{
		var point = clickPoints[i];
		this._playGrid.FlipSquare(point.x, point.y);
	}
}

/***********************************************
 * Resets this puzzle to its default base state.
 ***********************************************/
Puzzle.prototype.Reset = function()
{
	this._playGrid.FlipBaseState(this._baseState);
	this.FlipSolution();
};

/************************************************
 * Returns whether or not this level is complete or not.
 ************************************************/
Puzzle.prototype.IsComplete = function()
{
	return this._playGrid.SameConfiguration(this._solutionGrid);
};

/*************************************************
 * Instructs this puzzle to 'click' at position row/col.
 *************************************************/
Puzzle.prototype.ProcessClick = function(id)
{
	this._playGrid.GridClick(id);
};

/************************************************
 * Returns the size of this level.
 * 4 - 4x4
 * 5 - 5x5
 * 6 - 6x6
 ************************************************/
Puzzle.prototype.GetSize = function()
{
	return this._size;
};

/************************************************
 * Returns the number of zeros neighbouring this cell.
 ************************************************/
function CountNeighbouringZeros(array, size, row, col)
{
	var sum = 0;
	for (var i = -1; i <= 1; i++)
	{
		for (var j = -1; j <= 1; j++)
		{
			var curRow = row + i;
			var curCol = col + j;
			if (0 <= curRow && curRow < size &&
				0 <= curCol && curCol < size)
			{
				if (array[curRow][curCol] == 0)
					sum++				
			}
		}
	}
	return sum;
};

/************************************************
 * Incremends a square around row col.
 ************************************************/
function IncrementSquare(array, size, row, col)
{
	for (var i = -1; i <= 1; i++)
	{
		for (var j = -1; j <= 1; j++)
		{
			var curRow = row + i;
			var curCol = col + j;
			if (0 <= curRow && curRow < size &&
				0 <= curCol && curCol < size)
			{
				array[curRow][curCol]++;
			}
		}
	}
};
/************************************************
 * Returns the difficulty heuristic of this level.
 ************************************************/
Puzzle.prototype.GetDifficulty = function()
{
	// Cache the difficulty.
	if (this._difficulty != null)
		return this._difficulty;

	// Count the number of times a cell is flipped
	// Sum x^2
	var gridSize = this._size;
	var numFlippedArray = Create2DArray(gridSize, gridSize);
	var slotsThatMatterArray = Create2DArray(gridSize, gridSize);

	// Initialize the array with 1 or 0, depending if the winning state is flipped.
	for (var row = 0; row < gridSize; row++)
	{
		for (var col = 0; col < gridSize; col++)
		{
			numFlippedArray[row][col] = !this._solutionGrid.grid[row][col].on ? 1 : 0;
			slotsThatMatterArray[row][col] = 0;
		}
	}

	// Fill the base array with the number of neighbouring zeros.
	for (var row = 0; row < gridSize; row++)
	{
		for (var col = 0; col < gridSize; col++)
		{
			if (numFlippedArray[row][col] != 0)
				numFlippedArray[row][col] = CountNeighbouringZeros(numFlippedArray, gridSize, row, col);
		}
	}

	var solutionPoints = this._solutionSet.GetClickPoints();

	// for each click in the solution increment those places
	for (var i = 0; i < solutionPoints.length; i++)
	{
		var point = solutionPoints[i];
		IncrementSquare(numFlippedArray, gridSize, point.x, point.y);
		IncrementSquare(slotsThatMatterArray, gridSize, point.x, point.y);
	}

	// Calc a difficulty
	var sum = 0;
	for (var row = 0; row < gridSize; row++)
	{
		for (var col = 0; col < gridSize; col++)
		{
			// Square the value in the slot
			if (slotsThatMatterArray[row][col] != 0)
				sum += Math.pow(numFlippedArray[row][col], 2);
		}
	}

	this._difficulty = sum;
	return sum;
};

/*************************************************
 * Returns the number of clicks in the solution of this puzzle.
 *************************************************/
Puzzle.prototype.GetPar = function()
{
	return this._solutionSet.GetCount();
};

/*************************************************
 * Returns the current 'grid' the user is playing on.
 *************************************************/
Puzzle.prototype.GetPlayGrid = function()
{
	return this._playGrid;
};

/**************************************************
 * Returns the 'solution' grid of this level.
 **************************************************/
Puzzle.prototype.GetSolutionGrid = function()
{
	return this._solutionGrid;
};

/*************************************************
 * Returns a simple struct of this level for saving.
 *************************************************/
Puzzle.prototype.GetSimpleStruct = function()
{
	var simpleStruct = {};
	simpleStruct.b = this._baseState;
	simpleStruct.s = this._size;
	simpleStruct.d = this._difficulty;
	simpleStruct.a = this._solutionSet._rows.slice(0);

	return simpleStruct;
};