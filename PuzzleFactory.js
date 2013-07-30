/************************************************
 * PuzzleFactory.js
 * A class responsible for the generation of puzzles.
 ************************************************/
PuzzleFactory = function()
{
	this._puzzles = new Array();

	// Comment this out to fix your boot time.
	this.Initialize();
};

/************************************************
 * Initialize
 * Generates a bunch of levels and stores them along
 * with their difficulty.
 ************************************************/
PuzzleFactory.prototype.Initialize = function()
{
	// generate all the levels of size 4, on 'all on' grid.
	var size = 4;
	var currentSolution = new SolutionSet(size);
	do {
		var newestPuzzle = new Puzzle(size, 0, currentSolution);
		this._puzzles.push(newestPuzzle);
		currentSolution = EnumerateSolutionSets(currentSolution);
	} while (currentSolution != null)

	// sort puzzles according to difficulty.
	this._puzzles.sort( function(a, b) {
		return a.GetDifficulty() - b.GetDifficulty();
	});

	// log all of this to the log!
	for (var i = 0; i < this._puzzles.length; i++)
		console.log("Puzzle " + i + ": difficulty: "+ this._puzzles[i].GetDifficulty() + " #clicks: " + this._puzzles[i].GetPar());
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