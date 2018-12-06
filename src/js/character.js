// Character
Character = function Character(game, graphic, position, speed, health) {
	var sound;
	Phaser.Sprite.call(this, game, position.x, position.y, graphic);

	this._graphic = graphic;
	this._position = position;
	this._speed = speed;
	this._health = health;
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.loseHealth = function () { };
Character.prototype.die = function () { };

