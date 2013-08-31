var CHALLENGEMENU_COLS = 5;
var CHALLENGEMENU_ROWS = 5;
var CHALLENGEMENU_STAGGER_DELAY = 20;

ChallengeMenu = function()
{
	this._showing = false;
};

/******************************************************************************
 * Shows the menu.
 ******************************************************************************/
ChallengeMenu.prototype.Show = function()
{
	if (this._showing)
		return;

	var buttonNumber = 0;
	$("#challengeMenu").css("display", "block");

	for (var i = 0; i < CHALLENGEMENU_ROWS; i++)
		{
		for (var j = 0; j < CHALLENGEMENU_COLS; j++)
			{
			this.CreateButton(i, j, buttonNumber);
			buttonNumber++;
			}
		}

	this._showing = true;
};

/******************************************************************************
 * Creates a button.
 ******************************************************************************/
ChallengeMenu.prototype.CreateButton = function(i, j, buttonNumber)
{
	var button = document.createElement("div");
	$(button).css("top", i * 135 + "px");
	$(button).css("left", j * 135 + "px");
	$(button).attr("id", "c" + buttonNumber);
	$(button).addClass("button");
	$(button).css("display", "block");
	$(button).css("opacity", 0);
	$("#challengeMenu").append(button);

	var label = document.createElement("div");
	$(label).text(buttonNumber + 1);
	$(label).addClass("buttonLabel");

	var icon = document.createElement("img");
	$(icon).addClass("buttonIcon");

	var levelStats = SavedStateManager.GetLevelStats(buttonNumber);
	if (levelStats.Unlocked)
	{
		this.AttachClickHandler(button, buttonNumber);
		$(icon).attr('src', levelStats.Stars + 'stars.png');
	}
	else
	{
		$(icon).attr('src','lock-icon.png');
	}

	$(button).append(label);
	$(button).append(icon);
	this.AnimateButton(buttonNumber, 1);
}

/******************************************************************************
 * Attaches click hander to the button
 ******************************************************************************/
ChallengeMenu.prototype.AttachClickHandler = function(button, buttonNumber)
{
	var _self = this;		
	$(button).bind("click", function() 
	{ 
		_self.ButtonClick(buttonNumber); 
	});	
}

/******************************************************************************
 * On click handler for the challenge menu.
 ******************************************************************************/
ChallengeMenu.prototype.ButtonClick = function(buttonNumber)
{
	this.Hide();

	setTimeout( function() 
		{ 
			GameManager.BeginChallengeMode(buttonNumber);
		}, ANIMATION_LENGTH);
	
}

/******************************************************************************
 * Removes the divs from the DOM.
 ******************************************************************************/
ChallengeMenu.prototype.AnimateButton = function(buttonNumber, opacity)
{
	var buttonId = "c" + buttonNumber;
	var animateIn = function() 
	{ 
 		$("#" + buttonId).css("opacity", opacity); 
	};

	setTimeout(animateIn, 1 + buttonNumber * CHALLENGEMENU_STAGGER_DELAY);
};

/******************************************************************************
 * Animates all the divs away, then removes them from the dom.
 ******************************************************************************/
ChallengeMenu.prototype.Hide = function()
{
	if (!this._showing)
		return;

	for (var i = 0; i < CHALLENGEMENU_COLS * CHALLENGEMENU_ROWS; i++)
	{
		this.AnimateButton(i, 0);
	}
	var _self = this;
	setTimeout( function() { _self.DisposeDivs(); }, ANIMATION_LENGTH);

	this._showing = false;
};

/******************************************************************************
 * Removes the divs from the DOM.
 ******************************************************************************/
ChallengeMenu.prototype.DisposeDivs = function()
{
	for (var i = 0; i < CHALLENGEMENU_COLS * CHALLENGEMENU_ROWS; i++)
		$("#c" + i).remove();

	$("#challengeMenu").css("display", "none");
}