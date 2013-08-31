var CHALLENGEMENU_COLS = 5;
var CHALLENGEMENU_ROWS = 5;

var CHALLENGEMENU_STAGGER_DELAY = 20;

ChallengeMenu = function()
{
	this._showing = false;
};

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
			$(icon).attr('src','lock-icon.png');

			$(button).append(label);
			$(button).append(icon);

			this.AnimateButton(i, j, buttonNumber);
			this.AttachClickHandler(button, buttonNumber);
			// After a short delay, move the button to its rightful location.

			buttonNumber++;
			}
		}

	this._showing = true;
};

ChallengeMenu.prototype.AttachClickHandler = function(button, buttonNumber)
{
	var _self = this;		
	$(button).bind("click", function() 
	{ 
		_self.ButtonClick(buttonNumber); 
	});	
}

ChallengeMenu.prototype.ButtonClick = function(buttonNumber)
{
	this.Hide();
	GameManager.BeginChallengeMode(5 * buttonNumber, 5 * (buttonNumber + 2));
}

ChallengeMenu.prototype.AnimateButton = function(i, j, buttonNumber)
{
	var buttonId = "c" + buttonNumber;
	var animateIn = function() 
	{ 
 		$("#" + buttonId).css("opacity", 1); 
	};

	setTimeout(animateIn, 1 + buttonNumber * CHALLENGEMENU_STAGGER_DELAY);
};

ChallengeMenu.prototype.Hide = function()
{
	if (!this._showing)
		return;

	for (var i = 0; i < CHALLENGEMENU_COLS * CHALLENGEMENU_ROWS; i++)
	{
		$("c" + i).remove();
	}

	$("#challengeMenu").css("display", "none");

	this._showing = false;
};

ChallengeMenu.prototype