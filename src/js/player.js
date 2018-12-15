var CharacterScript = require('./character.js');
var WeaponsScript = require('./weapons.js');

// Player
Player = function Player(game, position) {
	Character.apply(this, [game, 'playerPistol', position, 200, 100]);
	this.keyboard = game.input.keyboard;
	this.weapons = [
		new Weapon.pistol(game),
		new Weapon.rifle(game),
		new Weapon.shotgun(game)
	];
	this.currentWeapon = 0;

	this.scale.setTo(0.075);
	this.frame = 0;
	this.anchor.setTo(0.5, 0.72);
	this.animations.add('walk', [1, 2], 5, true);
	this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
	this.body.setSize(270, 270, 0, 280);
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Character;

Player.prototype.update = function() {
	this.move();
	this.checkInput();
	if (this._currentHealth == 0) {
		 this.game.state.start('menu', true, false);
	}
}

Player.prototype.move = function () {
	this.animations.play('walk');
	if (this.keyboard.isDown(Phaser.Keyboard.A) || this.keyboard.isDown(Phaser.Keyboard.LEFT)) {
		this.body.velocity.x = -this._speed;
		this.body.velocity.y = 0;
		this.angle = -90;
	} else if (this.keyboard.isDown(Phaser.Keyboard.D) || this.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
		this.body.velocity.x = this._speed;
		this.body.velocity.y = 0;
		this.angle = 90;
	} else {
		this.body.velocity.x = 0;
	}

	if (this.keyboard.isDown(Phaser.Keyboard.W) || this.keyboard.isDown(Phaser.Keyboard.UP)) {
		this.body.velocity.x = 0;
		this.body.velocity.y = -this._speed;
		this.angle = 0;
	} else if (this.keyboard.isDown(Phaser.Keyboard.S) || this.keyboard.isDown(Phaser.Keyboard.DOWN)) {
		this.body.velocity.x = 0;
		this.body.velocity.y = this._speed;
		this.angle = 180;
	} else {
		this.body.velocity.y = 0;
	}

	if (
		!this.keyboard.isDown(Phaser.Keyboard.A) && !this.keyboard.isDown(Phaser.Keyboard.D) && !this.keyboard.isDown(Phaser.Keyboard.W) && !this.keyboard.isDown(Phaser.Keyboard.S) &&
		!this.keyboard.isDown(Phaser.Keyboard.UP) && !this.keyboard.isDown(Phaser.Keyboard.DOWN) && !this.keyboard.isDown(Phaser.Keyboard.LEFT) && !this.keyboard.isDown(Phaser.Keyboard.RIGHT)
	) {
		this.frame = 0;
		this.animations.stop();
	}

};

Player.prototype.checkInput = function () {
	if (this.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
	{
		this.weapons[this.currentWeapon].fire(this);
	}
	if (this.keyboard.isDown(Phaser.Keyboard.ONE))
	{
		this.currentWeapon = 0;
		this.loadTexture('playerPistol'), 0;
	}
	if (this.keyboard.isDown(Phaser.Keyboard.TWO))
	{
		this.currentWeapon = 1;
		this.loadTexture('playerRifle'), 0;
	}
	if (this.keyboard.isDown(Phaser.Keyboard.THREE))
	{
		this.currentWeapon = 2;
		this.loadTexture('playerShotgun'), 0;
	}
};