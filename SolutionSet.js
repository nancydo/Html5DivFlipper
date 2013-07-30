/************************************************
 * SolutionSet.js
 * A class describing a solution set for a puzzle.
 *
 * It is essentially an array of ints
 * where the bits of those ints represent columns
 * and the index represents the rows.
 ************************************************/
SolutionSet = function(size)
{
	this._size = size;
	this._rows = new Array(size);

	// Fill the solution with an 'off' state
	for (var i = 0; i < size; i++)
		this._rows[i] = 0;
};

/************************************************
 * Returns this solution set as an array of points (x,y)
 ************************************************/
SolutionSet.prototype.GetClickPoints = function()
{
	var points = [];
	for (var row = 0; row < this._size; row++)
	{
		for (var col = 0; col < this._size; col++)
		{
			if ((this._rows[row] & (1 << col)) != 0)
				points.push(new Point(row, col));
		}
	}
	return points;
};

/**************************************************
 * Randomly adds numClicks to this solution set.
 **************************************************/
SolutionSet.prototype.Randomize = function(numClicks)
{
	for (var i = 0; i < numClicks; i++)
	{
		var row = Math.floor(Math.random() * this._size);
		var col = Math.floor(Math.random() * this._size);

		this._rows[row] |= 1 << col;
	}
};

/*************************************************
 * Returns the number of clicks in this solution set.
 *************************************************/
SolutionSet.prototype.GetCount = function()
{
	// We could probably do this better, but this should work for now.
	return this.GetClickPoints().length;
};

/*************************************************
 * Enumerates solution sets.
 * returns null if we wrapped.
 **************************************************/
SolutionSet.prototype.Clone = function()
{
	var newSet = new SolutionSet(this._size);
	newSet._rows = this._rows.slice(0);
	return newSet;
};

/************************************************
 * Increments this solution set
 * Returns whether we overflowed.
 ************************************************/
SolutionSet.prototype.Increment = function()
{
	var overFlow = 1;
	var row = 0;

	while (overFlow > 0 && row < this._size)
	{
		// increment this row.
		this._rows[row]++;

		// We overflowed the row if there is more than size 1s.
		overFlow = Math.floor(this._rows[row] / (1 << this._size));

		// If we overflowed, lets set this back to 0
		// (shouldn't ever matter, but may)
		if (overFlow > 0)
			this._rows[row] = 0;

		// On to the next row!
		row++;
	};

	// If we're still overflowing on the last row, we have gone too far.
	return overFlow > 0;
};

/************************************************
 * Enumerates solution sets.
 * returns null if we wrapped.
 ************************************************/
function EnumerateSolutionSets(previousSet)
{
	var newSet = previousSet.Clone();

	if (!newSet.Increment())
		return newSet;

	return null;
};