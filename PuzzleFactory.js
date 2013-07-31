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
 * Enumerates solution sets, calling callBack
 ************************************************/
function EnumerateSolutionSets(currentSet, maxClicks, depth, callBack)
{
	var size = currentSet.GetSize();
	if (depth == size || maxClicks == 0)
	{
		callBack(currentSet);
		return;
	}

	var bound = 1 << size;
	for (var currentPermutation = 0; currentPermutation < bound; currentPermutation++)
	{
		var clicks = CountOfOnBits(currentPermutation, size);
		if (clicks <= maxClicks)
		{
			currentSet._rows[depth] = currentPermutation;
			EnumerateSolutionSets(currentSet, maxClicks - clicks, depth + 1, callBack);	
			currentSet._rows[depth] = 0;
		}
	};
};

/************************************************
 * Returns the number of 1s in the bits.
 ************************************************/
function CountOfOnBits(numberToCount, numberOfBits)
{
	var countOfOnes = 0;
	for (var i = 0; i < numberOfBits; i++)
	{
		if ((numberToCount & (1 << i)) != 0)
			countOfOnes++;
	}
	return countOfOnes;
};

/************************************************
 * Initialize
 * Generates a bunch of levels and stores them along
 * with their difficulty.
 ************************************************/
PuzzleFactory.prototype.Initialize = function()
{
	// Could maybe randomize the base state here?

	for (var size = 4; size <= 6; size++)
	{
		var puzzleArray = this._puzzles;
		var addToArrayCallback = function (currentSet)
		{
			var newPuzzle = new Puzzle(size, 0, currentSet.Clone());
			puzzleArray.push(newPuzzle);
		};
		var currentSolution = new SolutionSet(size);
		EnumerateSolutionSets(currentSolution, 3 /*maxClicks*/, 0/*depth*/, addToArrayCallback);
	}

	// log all of this to the log!
	console.log("Puzzles Loaded:" + this._puzzles.length);
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