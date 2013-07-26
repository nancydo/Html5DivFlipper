LevelFactory = function()
{
	//Set up locals
};

LevelFactory.prototype.GetLevel = function()
{
	return new Level(5, 1);
};


// Creates a level based on a JSON string.
LevelFactory.prototype.CreateLevelFromJSON = function (jsonStr)
{

};

/// Creates a JSON representation of a level.
LevelFactory.prototype.SaveLevelToJSON = function(level) 
{
	// Important parts of a level:
	//	Size
	//	Winning Config
	//	Solution Set
	//  Difficulty
};

