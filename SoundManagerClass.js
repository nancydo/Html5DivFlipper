/************************************************
 * SoundManager
 * A class which is to encapsulate all sound playing.
 ************************************************/
SoundManagerClass = function()
{
	this._masterVolume = 1.0;
	this._musicVolume = 1.0;
	this._effectVolume = 1.0;

	this._sounds = [];

	this.Initialize();
};

/************************************************
 * Set the volume of the music.
 ************************************************/
SoundManagerClass.prototype.SetMusicVolume = function(percent)
{
	this._musicVolume = percent;
	this.UpdateVolumes();
};

/************************************************
 * Loop through all the sounds and update their volumes
 ************************************************/
SoundManagerClass.prototype.UpdateVolumes = function()
{
	for (var index in this._sounds) 
	{
	    if (!this._sounds.hasOwnProperty(index)) 
	        continue;

		var soundObj = this._sounds[index];

		if (soundObj.SoundType == SoundType.Effect)
			soundObj.AudioObject.volume = this._musicVolume * this._effectVolume;
		else
			soundObj.AudioObject.volume = this._musicVolume * this._musicVolume;
	}
};

/************************************************
 * Set the volume of effects
 ************************************************/
SoundManagerClass.prototype.SetEffectVolume = function(percent)
{
	this._effectVolume = percent;
	this.UpdateVolumes();
};

/************************************************
 * Set the volume of the app
 ************************************************/
SoundManagerClass.prototype.SetMasterVolume = function(percent)
{
	this._masterVolume = percent;
	this.UpdateVolumes();
};

/************************************************
 * Initialize the sound manager with some sounds.
 ************************************************/
SoundManagerClass.prototype.Initialize = function()
{
	this.RegisterSound("boimp", SoundType.Effect);
	this.RegisterSound("complete", SoundType.Effect);
	this.RegisterSound("tick", SoundType.Effect);

	this.RegisterSound("happyland", SoundType.Music);
};

/************************************************
 * Plays a sound with the sound manager.
 ************************************************/
SoundManagerClass.prototype.Play = function(soundId)
{
	var soundObject = this._sounds[soundId];
	if (soundObject != null)
	{
		var isEffect = soundObject.SoundType == SoundType.Effect;
		var audioObj = soundObject.AudioObject;

		audioObj.volume = this._masterVolume * (isEffect ? this._effectVolume : this._musicVolume);

		if (audioObj.currentTime != 0)
			audioObj.currentTime = 0;

		if (!isEffect)
			audioObj.loop = true;

		audioObj.play();
	}
};

/************************************************
 * Pauses a sound playing with the sound manager.
 ************************************************/
SoundManagerClass.prototype.Pause = function(soundId)
{
	var soundObject = this._sounds[soundId];
	if (soundObject != null)
		soundObject.AudioObject.pause();
};


/************************************************
 * Plays a sound with the sound manager.
 * Note: Make sure the soundId is the id of an audio object in the html.
 ************************************************/
SoundManagerClass.prototype.RegisterSound = function(soundId, soundType)
{
	this._sounds[soundId] = new SoundClass(soundId, soundType);
};

/************************************************
 * An enum of sound types.
 ************************************************/
var SoundType = {Effect: 0, Music: 1};

/************************************************
 * A class representing a sound object.
 ************************************************/
SoundClass = function(soundId, soundType)
{
	this.AudioObject = document.getElementById(soundId)
	this.SoundType = soundType;
};