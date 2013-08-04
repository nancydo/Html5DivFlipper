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
	for (var clicks = 1; clicks <= 5; clicks++)
	{
		for (var solutions = 0; solutions < 1000; solutions++)
		{
			var size = Math.floor(Math.random() * 3) + 4;
			var baseState = Math.floor(Math.random() * 5);
			var solutionSet = new SolutionSet(size);
			solutionSet.Randomize(clicks);

			this._puzzles.push(new Puzzle(size, baseState, solutionSet));
		}
	}

	// sort the puzzles based on difficulty.
	this._puzzles.sort( function(a, b)
	 { 
	 	return a.GetDifficulty() - b.GetDifficulty();
	 });

	// log all of this to the log!
	console.log("Puzzles Loaded:" + this._puzzles.length);
};

/************************************************
 * GetPuzzle
 * Returns a level of approximate difficulty.
 ************************************************/
PuzzleFactory.prototype.GetPuzzle = function(difficulty)
{
	for (var i = 0; i < this._puzzles.length; i++)
		if (this._puzzles[i].GetDifficulty() >= difficulty)
			return this._puzzles[i];
		
	alert("you win!")
	return this._puzzles[1];
};


/************************************************
 * Creates a puzzle from a simple struct
 ************************************************/
PuzzleFactory.prototype.CreatePuzzleFromSimpleStruct = function(simpleStruct)
{
	var newSolution = new SolutionSet(simpleStruct.s);
	newSolution._rows = simpleStruct.a.slice(0);

	return new Puzzle(simpleStruct.s, simpleStruct.b, newSolution);
};