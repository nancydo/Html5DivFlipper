/***************************************************
 * Puzzle.js
 * Describes a puzzle
 ***************************************************/
Puzzle = function(size)
{
	this._size = size;
}

/***********************************************
 * Resets this puzzle to its default base state.
 ***********************************************/
Puzzle.prototype.Reset = function()
{

};

/************************************************
 * Returns whether or not this level is complete or not.
 ************************************************/
Puzzle.prototype.IsComplete = function()
{
	return true;
};

/*************************************************
 * Instructs this puzzle to 'click' at position row/col.
 *************************************************/
Puzzle.prototype.ProcessClick = function(row, col)
{

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
	return 10;
};

/*************************************************
 * Returns the number of clicks in the solution of this puzzle.
 *************************************************/
Puzzle.prototype.GetPar = function()
{
	return 2;
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