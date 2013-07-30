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
};

/************************************************
 * Returns this solution set as an array of points (x,y)
 ************************************************/
SolutionSet.prototype.GetClickPoints = function()
{
	var points = [];
	for (var row = 0; row < this._size; row++)
	{
		for (var col = 0; col < this._size; cols++)
		{
			if ((this._rows[row] & 1 << col) != 0)
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
SolutionSet.prototype.EnumerateSolutionSet = function()
{

};