var CharacterScript = require('./character.js');

// Enemy
Enemy = function Enemy(game, player, graphic, position, speed, health, score) {
	Character.apply(this, [game, graphic, position, speed, health]);
	this._score = score;
	this.player = player;
	this._lastAttackTime = Date.now();
	this._lastMove = Date.now();
	this.sound = this.game.add.audio('zombieAttack');
	this.sound.volume = 0.1;

	this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);
	this.body.collideWorldBounds = true;

	this.frame = 0;
	this.anchor.setTo(0.5, 0.55);
	this.body.setSize(270, 270, 0, 100);
}

Enemy.prototype = Object.create(Character.prototype);
Enemy.prototype.constructor = Character;

Enemy.prototype.update = function() {
	this.updateDirection(this.player);
	this.game.physics.arcade.overlap(this.player, this, this.attack, null, this);
	this.game.physics.arcade.collide(this.player, this);
	if (this._currentHealth <= 0) {
		this.kill();
	}
}

Enemy.prototype.updateDirection = function (player) {
	if(!this.animations._anims.attack.isPlaying) {
		this.animations.play('walk');
		if (Date.now() - this._lastMove > this._updateDirectionSpeed) {
			this._lastMove = Date.now();
			var distanceToPlayerX = Math.abs(this.x - this.player.x);
			var distanceToPlayerY = Math.abs(this.y - this.player.y);
			if (distanceToPlayerX > distanceToPlayerY || this.body.blocked.up || this.body.blocked.down) {
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
	}
};

Enemy.prototype.increaseHealth = function () {
	this._health += 2;
};

Enemy.prototype.attack = function () {
	if (this.game.time.time < this.nextAttack) { return; }

	this.animations.play('attack', this._attackAnimationSpeed, false);
	this._lastAttackTime = Date.now();
	this.player.modifyHealth(-this.damage);
	this.sound.play();
	this.nextAttack = this.game.time.time + this._attackSpeed;
};

// Zombie
Zombie = function Zombie(game, player, position) {
	Enemy.apply(this, [game, player, 'zombie', position, 50, 8, 10]);
	this.damage = 10;

	this._attackSpeed = 1000;
	this._attackAnimationSpeed = 2;
	this._updateDirectionSpeed = 1000;
	this.animations.add('walk', [4, 5], 2, true);
	this.animations.add('attack', [1, 2], 2, true);
}

Zombie.prototype = Object.create(Enemy.prototype);
Zombie.prototype.constructor = Enemy;
// Runner
Runner = function Runner(game, player, position) {
	Enemy.apply(this, [game, player, 'runner', position, 150, 8, 20]);
	this.damage = 10;

	this._attackSpeed = 500;
	this._attackAnimationSpeed = 4;
	this._updateDirectionSpeed = 300;
	this.animations.add('walk', [4, 5], 2, true);
	this.animations.add('attack', [1, 2], 2, true);
}

Runner.prototype = Object.create(Enemy.prototype);
Runner.prototype.constructor = Enemy;