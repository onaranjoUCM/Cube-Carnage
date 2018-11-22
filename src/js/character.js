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


// Player
Player = function Player(game, position) {
	Character.apply(this, [game, 'player', position, 5, 100]);
	this.keyboard = game.input.keyboard;
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Character;

Player.prototype.move = function () {
	this.animations.play('walk');
	if (this.keyboard.isDown(Phaser.Keyboard.A) || this.keyboard.isDown(Phaser.Keyboard.LEFT)) {
		this.x -= this._speed;
		this.angle = -90;
	} else if (this.keyboard.isDown(Phaser.Keyboard.D) || this.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
		this.x += this._speed;
		this.angle = 90;
	}

	if (this.keyboard.isDown(Phaser.Keyboard.W) || this.keyboard.isDown(Phaser.Keyboard.UP)) {
		this.y -= this._speed;
		this.angle = 0;
	} else if (this.keyboard.isDown(Phaser.Keyboard.S) || this.keyboard.isDown(Phaser.Keyboard.DOWN)) {
		this.y += this._speed;
		this.angle = 180;
	}

	if (
		!this.keyboard.isDown(Phaser.Keyboard.A) && !this.keyboard.isDown(Phaser.Keyboard.D) && !this.keyboard.isDown(Phaser.Keyboard.W) && !this.keyboard.isDown(Phaser.Keyboard.S)) {
		this.frame = 0;
		this.animations.stop();
	}

};
Player.prototype.shoot = function () {
	this.sound = this.game.add.audio('pistolShot');
	this.sound.play();
};
Player.prototype.switchWeapon = function () { };
Player.prototype.modifyHealth = function () { };


// Enemy
Enemy = function Enemy(game, graphic, position, speed, health, score) {
	Character.apply(this, [game, graphic, position, speed, health]);
	this._score = score;
	this._canAttack = true;
	this._attackSpeed = 1000;
	this._lastAttackTime = Date.now();
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Character;
Enemy.prototype.move = function (player) {
	this.animations.play('walk');

	if (this.y > player.y) {
		this.y -= this._speed;
		this.angle = 0;
	} else if (this.y < player.y) {
		this.y += this._speed;
		this.angle = 180;
	}

	if (this.x > player.x) {
		this.x -= this._speed;
		this.angle = -90;
	} else if (this.x < player.x) {
		this.x += this._speed;
		this.angle = 90;
	}
};

Enemy.prototype.attack = function () {
	//if (Date.now() - this._lastAttackTime > this._attackSpeed) {
		this.sound = this.game.add.audio('zombieAttack');
		this.sound.play();
	//}
};

// Zombie
Zombie = function Zombie(game, position) {
	Enemy.apply(this, [game, 'zombie', position, 1, 10, 1]);
}

Zombie.prototype = Object.create(Enemy.prototype);
Zombie.prototype.constructor = Enemy;