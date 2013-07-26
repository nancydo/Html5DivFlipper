function Create2DArray(rows, cols)
{
	var returnArray = new Array();
	for (var i = 0; i < rows; i++)
		returnArray[i] = new Array(cols);

	return returnArray;
};

Point = function(x, y)
{
	// By default, it will be (0,0)
	this.x = 0;
	this.y = 0;

	if (x != null)
		this.x = x;

	if (y != null)
		this.y = y;
};

// Increments the squares around row/col
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