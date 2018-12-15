// Character
Character = function Character(game, graphic, position, speed, health) {
	var sound;
	Phaser.Sprite.call(this, game, position.x, position.y, graphic);

	this._graphic = graphic;
	this._position = position;
	this._speed = speed;
	this._health = health;
	this._currentHealth = health;
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.modifyHealth = function (increment) {
	this._currentHealth += increment;
	if (this._currentHealth < 0) { this._currentHealth = 0; }
	if (this._currentHealth > 100) { this._currentHealth = 100; }
};