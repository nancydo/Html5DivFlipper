/***************************************************
 * Puzzle.js
 * Describes a puzzle
 ***************************************************/
Puzzle = function(size, baseState, solutionSet)
{
	this._size = size;
	this._playGrid = new Grid(size, baseState);
	this._solutionGrid = new Grid(size, baseState);
	this._baseState = baseState;
	this._solutionSet = solutionSet;
}

/***********************************************
 * Resets this puzzle to its default base state.
 ***********************************************/
Puzzle.prototype.Reset = function()
{
	this._playGrid.FlipBaseState(this._baseState);
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
Puzzle.prototype.ProcessClick = function(row, col)
{
	this._playGrid.FlipSquare(row, col);
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

	// Initialize the array with 1 or 0, depending if the winning state is flipped.
	for (var row = 0; row < gridSize; row++)
	{
		for (var col = 0; col < gridSize; col++)
		{
			numFlippedArray[row][col] = !this._solutionGrid.grid[row][col].on ? 1 : 0;
		}
	}

	var solutionPoints = this._solutionSet.GetClickPoints();

	// for each click in the solution increment those places
	for (var i = 0; i < solutionPoints.length; i++)
	{
		var point = solutionPoints[i];
		IncrementSquare(numFlippedArray, gridSize, point.x, point.y);
	}

	// Calc a difficulty
	var sum = 0;
	for (var row = 0; row < gridSize; row++)
	{
		for (var col = 0; col < gridSize; col++)
		{
			sum += numFlippedArray[row][col] * numFlippedArray[row][col];
		}
	}

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
	simpleStruct.BaseState = this._baseState;
	simpleStruct.Size = this._size;
	simpleStruct.Difficulty = this._difficulty;
	simpleStruct.SolutionSetRows = this._solutionSet._rows.slice(0);

	return simpleStruct;
};