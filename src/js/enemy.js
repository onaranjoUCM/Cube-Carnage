var CharacterScript = require('./character.js');

// Enemy
Enemy = function Enemy(game, player, graphic, position, speed, health, score) {
	Character.apply(this, [game, graphic, position, speed, health]);
	this.player = player;
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

Enemy.prototype.update = function() {
	this.updateDirection(this.player);
	this.game.physics.arcade.overlap(this.player, this, this.attack, null, this);
	this.game.physics.arcade.collide(this.player, this);
	if (this._health <= 0) {
		this.kill();
	}
}

// Zombie
Zombie = function Zombie(game, player, position) {
	Enemy.apply(this, [game, player, 'zombie', position, 50, 10, 1]);
	
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
		var distanceToPlayerX = Math.abs(this.x - this.player.x);
		var distanceToPlayerY = Math.abs(this.y - this.player.y);
		if (distanceToPlayerX > distanceToPlayerY) {
			this.body.velocity.y = 0;
			if (this.x > this.player.x) {
				this.body.velocity.x = -this._speed;
				this.angle = -90;
			} else if (this.x < this.player.x) {
				this.body.velocity.x = this._speed;
				this.angle = 90;
			}
		} else {
			this.body.velocity.x = 0;
			if (this.y > this.player.y) {
				this.body.velocity.y = -this._speed;
				this.angle = 0;
			} else if (this.y < this.player.y) {
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