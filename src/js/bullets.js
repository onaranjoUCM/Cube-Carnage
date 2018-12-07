Bullet = function (game, key, damage) {
	Phaser.Sprite.call(this, game, 0, 0, key);

	this.damage = damage;
	this.anchor.set(0.5);
	this.checkWorldBounds = true;
	this.outOfBoundsKill = true;
	this.exists = false;
	this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed) {
	this.reset(x, y);
	this.scale.set(1);
	this.body.mass = 0.1;

	this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
	this.angle = angle;
};

Bullet.prototype.update = function () {
	this.game.physics.arcade.collide(this.game, this);
}