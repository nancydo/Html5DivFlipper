/************************************************
 * PuzzleFactory.js
 * A class responsible for the generation of puzzles.
 ************************************************/
PuzzleFactory = function()
{
	
};

/************************************************
 * Initialize
 * Generates a bunch of levels and stores them along
 * with their difficulty.
 */
PuzzleFactory.prototype.Initialize = function()
{
	// ^_^
};

/************************************************
 * GetPuzzle
 * Returns a level of approximate difficulty.
 ************************************************/
LevelFactory.prototype.GetPuzzle = function(difficulty)
{
	var solutionSet = new SolutionSet(5);
	solutionSet.Randomize(2);

	return new Puzzle(5 /*size*/, ENUM_BASE_STATE.DIAMOND, solutionSet);
};