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