var CharacterScript = require('./character.js');

// Enemy
Enemy = function Enemy(game, graphic, position, speed, health, score) {
	Character.apply(this, [game, graphic, position, speed, health]);
	this._score = score;
	this._attackSpeed = 2000;
	this._updateDirectionSpeed = 1000;
	this._lastAttackTime = Date.now();
	this._lastMove = Date.now();
	
	this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Character;

Enemy.prototype.update = function(player) {
	this.updateDirection(player);
	this.game.physics.arcade.overlap(player, this, this.attack, null, this);
	this.game.physics.arcade.collide(player, this);
}

// Zombie
Zombie = function Zombie(game, position) {
	Enemy.apply(this, [game, 'zombie', position, 50, 10, 1]);

	this.scale.setTo(0.2, 0.2);
	this.frame = 0;
	this.anchor.setTo(0.5,0.5);
	this.animations.add('walk', [1, 2], 1, true);
}

Zombie.prototype = Object.create(Enemy.prototype);
Zombie.prototype.constructor = Enemy;

Zombie.prototype.updateDirection = function (player) {
	this.animations.play('walk');
	if (Date.now() - this._lastMove > this._updateDirectionSpeed) {
		this._lastMove = Date.now();
		var distanceToPlayerX = Math.abs(this.x - player.x);
		var distanceToPlayerY = Math.abs(this.y - player.y);
		if (distanceToPlayerX > distanceToPlayerY) {
			this.body.velocity.y = 0;
			if (this.x > player.x) {
				this.body.velocity.x = -this._speed;
				this.angle = -90;
			} else if (this.x < player.x) {
				this.body.velocity.x = this._speed;
				this.angle = 90;
			}
		} else {
			this.body.velocity.x = 0;
			if (this.y > player.y) {
				this.body.velocity.y = -this._speed;
				this.angle = 0;
			} else if (this.y < player.y) {
				this.body.velocity.y = this._speed;
				this.angle = 180;
			}
		}
	}
};

Zombie.prototype.attack = function () {
	if (Date.now() - this._lastAttackTime > this._attackSpeed) {
		this._lastAttackTime = Date.now();
		this.sound = this.game.add.audio('zombieAttack');
		this.sound.play();
	}
};