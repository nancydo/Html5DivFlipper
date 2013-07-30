/************************************************
 * PuzzleFactory.js
 * A class responsible for the generation of puzzles.
 ************************************************/
PuzzleFactory = function()
{
	this._puzzles = new Array();
	this.Initialize();
};

/************************************************
 * Initialize
 * Generates a bunch of levels and stores them along
 * with their difficulty.
 */
PuzzleFactory.prototype.Initialize = function()
{
	var size = 4;
	var currentSolution = new SolutionSet(size);
	do {
		var newestPuzzle = new Puzzle(size, 0, currentSolution);
		this._puzzles.push(newestPuzzle);
		currentSolution = EnumerateSolutionSets(currentSolution);
	} while (currentSolution != null)
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