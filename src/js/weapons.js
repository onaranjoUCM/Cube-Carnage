var BulletScript = require('./bullets.js');

Weapon = {};

// PISTOLA
Weapon.pistol = function (game) {
	Phaser.Group.call(this, game, game.world, 'pistolBullets', false, true, Phaser.Physics.ARCADE);

	this.sound = game.add.audio('pistolShot');
	this.nextFire = 0;
	this.bulletSpeed = 600;
	this.fireRate = 500;
	this.damage = 5;

	for (var i = 0; i < 32; i++)
	{
		this.add(new Bullet(game, 'bullet', this.damage), true);
	}
	this.callAll('kill');
	
	return this;
};

Weapon.pistol.prototype = Object.create(Phaser.Group.prototype);
Weapon.pistol.prototype.constructor = Weapon.pistol;

Weapon.pistol.prototype.fire = function (source) {
	if (this.game.time.time < this.nextFire) { return; }

	var angle = source.angle - 90;
	var x;
	var y;
	
	if (angle == 0) {
		x = source.x + 40;
		y = source.y + 13;
	}
	if (angle == -90) {
		x = source.x + 13;
		y = source.y - 40;
	}
	if ( angle == -180) {
		x = source.x - 40;
		y = source.y - 13;
	}
	
	if (angle == -270) {
		x = source.x - 13;
		y = source.y + 40;
	}

	this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed);

	this.nextFire = this.game.time.time + this.fireRate;
	this.sound.play();
};

// RIFLE
Weapon.rifle = function (game) {
	Phaser.Group.call(this, game, game.world, 'rifleBullets', false, true, Phaser.Physics.ARCADE);

	this.sound = game.add.audio('pistolShot');
	this.nextFire = 0;
	this.bulletSpeed = 1000;
	this.fireRate = 100;
	this.damage = 3;

	for (var i = 0; i < 64; i++)
	{
		this.add(new Bullet(game, 'bullet', this.damage), true);
	}

	return this;
};

Weapon.rifle.prototype = Object.create(Phaser.Group.prototype);
Weapon.rifle.prototype.constructor = Weapon.rifle;

Weapon.rifle.prototype.fire = function (source) {
	if (this.game.time.time < this.nextFire) { return; }

	var angle = source.angle - 90;
	var x;
	var y;
	
	if (angle == 0) {
		x = source.x + 40;
		y = source.y + 13;
	}
	if (angle == -90) {
		x = source.x + 13;
		y = source.y - 40;
	}
	if ( angle == -180) {
		x = source.x - 40;
		y = source.y - 13;
	}
	
	if (angle == -270) {
		x = source.x - 13;
		y = source.y + 40;
	}

	this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed);

	this.nextFire = this.game.time.time + this.fireRate;
	this.sound.play();
};

// SHOTGUN
Weapon.shotgun = function (game) {
	Phaser.Group.call(this, game, game.world, 'shotgunBullets', false, true, Phaser.Physics.ARCADE);

	this.sound = game.add.audio('pistolShot');
	this.nextFire = 0;
	this.bulletSpeed = 1000;
	this.fireRate = 1000;
	this.damage = 10;

	for (var i = 0; i < 64; i++)
	{
		this.add(new Bullet(game, 'bullet', this.damage), true);
	}

	return this;
};

Weapon.shotgun.prototype = Object.create(Phaser.Group.prototype);
Weapon.shotgun.prototype.constructor = Weapon.shotgun;

Weapon.shotgun.prototype.fire = function (source) {
	if (this.game.time.time < this.nextFire) { return; }

	var angle = source.angle - 90;
	var x;
	var y;
	
	if (angle == 0) {
		x = source.x + 40;
		y = source.y + 13;
	}
	if (angle == -90) {
		x = source.x + 13;
		y = source.y - 40;
	}
	if ( angle == -180) {
		x = source.x - 40;
		y = source.y - 13;
	}
	
	if (angle == -270) {
		x = source.x - 13;
		y = source.y + 40;
	}

	this.getFirstExists(false).fire(x, y, angle + 30, this.bulletSpeed);
	this.getFirstExists(false).fire(x, y, angle + 15, this.bulletSpeed);
	this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed);
	this.getFirstExists(false).fire(x, y, angle - 15, this.bulletSpeed);
	this.getFirstExists(false).fire(x, y, angle - 30, this.bulletSpeed);

	this.nextFire = this.game.time.time + this.fireRate;
	this.sound.play();
};