(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
	this.scale.set(0.5);
	this.body.mass = 0.1;

	this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
	this.angle = angle;
};

Bullet.prototype.update = function () {
	this.game.physics.arcade.collide(this.game, this);
}
},{}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
var CharacterScript = require('./character.js');

// Enemy
Enemy = function Enemy(game, player, graphic, position, speed, health, score) {
	Character.apply(this, [game, graphic, position, speed, health]);
	this._score = score;
	this.player = player;
	this._lastAttackTime = Date.now();
	this._lastMove = Date.now();
	
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
};

Enemy.prototype.increaseHealth = function () {
	this._health += 2;
};

Enemy.prototype.attack = function () {
	if (Date.now() - this._lastAttackTime > this._attackSpeed) {
		this._lastAttackTime = Date.now();
		this.player.modifyHealth(-this.damage);
		this.sound = this.game.add.audio('zombieAttack');
		this.sound.volume = 2;
		this.sound.play();
	}
};

// Zombie
Zombie = function Zombie(game, player, position) {
	Enemy.apply(this, [game, player, 'zombie', position, 50, 8, 10]);
	this.damage = 10;
	
	this._attackSpeed = 1000;
	this._updateDirectionSpeed = 1000;
	this.animations.add('walk', [1, 2], 2, true);
}

Zombie.prototype = Object.create(Enemy.prototype);
Zombie.prototype.constructor = Enemy;

// Runner
Runner = function Runner(game, player, position) {
	Enemy.apply(this, [game, player, 'runner', position, 150, 8, 10]);
	this.damage = 10;
	
	this._attackSpeed = 500;
	this._updateDirectionSpeed = 300;
	this.animations.add('walk', [1, 2], 4, true);
}

Runner.prototype = Object.create(Enemy.prototype);
Runner.prototype.constructor = Enemy;
},{"./character.js":2}],4:[function(require,module,exports){
'use strict';

window.onload = function () {
	var PlayScene = require('./play_scene.js');
	var config = {
		width: 800,
		height: 600,
		renderer: Phaser.AUTO,
		backgroundColor: '#ffffff',
		parent: 'game',
		transparent: false,
		antialias: false,
		state: this,
		scaleMode: Phaser.ScaleManager.EXACT_FIT
	};
	var game = new Phaser.Game(config);

	game.state.add('boot', BootScene);
	game.state.add('preloader', PreloaderScene);
	game.state.add('menu', MenuScene);
	game.state.add('play', PlayScene);

	game.state.start('boot');
};

var BootScene = {
	preload: function () {
		// load here assets required for the loading screen
		this.game.load.image('preloader_bar', 'images/preloader_bar.png');
	},

	create: function () {
		this.game.state.start('preloader');
	}
};

var PreloaderScene = {
	preload: function () {
		var music;
		this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
		this.loadingBar.anchor.setTo(0, 0.5);
		this.load.setPreloadSprite(this.loadingBar);

		this.game.load.image('title', 'images/CubeCarnage.png');
		this.game.load.image('logo', 'images/kitten.png');
		this.game.load.image('wall', 'images/wall.png');
		this.game.load.audio('menuMusic', 'audio/Heroic_Intrusion.ogg');
	},

	create: function () {
		this.game.state.start('menu');
	}
};

var MenuScene = {
	preload: function () {
		var music;
		this.game.load.spritesheet('playerPistol', 'images/playerWalkingPistol.png', 276, 584);
		this.game.load.spritesheet('playerRifle', 'images/playerWalkingRifle.png', 276, 584);
		this.game.load.spritesheet('playerShotgun', 'images/playerWalkingShotgun.png', 276, 584);
		this.game.load.spritesheet('zombie', 'images/zombieWalk.png', 276, 424);
		this.game.load.spritesheet('zombieAttack', 'images/zombieAttack.png', 276, 442);
		this.game.load.spritesheet('runner', 'images/runnerWalk.png', 276, 424);
		this.game.load.spritesheet('runnerAttack', 'images/runnerAttack.png', 276, 442);
		this.game.load.image('bullet', 'images/bullet.png');
		this.game.load.image('blood', 'images/blood_splatter.png');
		this.game.load.image('medikit', 'images/medikit.png');
		this.game.load.image('ammocrate', 'images/ammocrate.png');
		
		this.game.load.audio('gameMusic', 'audio/Humble_Match.ogg');
		this.game.load.audio('pistolShot', 'audio/pistolShot.mp3');
		this.game.load.audio('zombieAttack', 'audio/zombieAttack.mp3');
	},

	create: function () {
		var title = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'title');
		title.scale.setTo(0.55,1.31);
		title.anchor.setTo(0.5,0.5);

		var logo = this.game.add.sprite(620,500, 'logo');

		var nameLabel = this.game.add.text(80, this.game.world.height - 80, 'Press SPACEBAR to play', {font: '30px Arial', fill: '#000000'});

		var spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spacebar.onDown.addOnce(this.start, this);
		
		this.music = this.game.add.audio('menuMusic');
		this.music.loop = true;
		this.music.play();
	},

	start: function() {
		this.music.stop();
		this.game.state.start('play', true, false, 0);
	}
};

},{"./play_scene.js":7}],5:[function(require,module,exports){
Maps = {};

// MAP 1
Maps.map1 = function (game) {
	this.spawnPoints = [
		{x: game.world.width / 2, y: 0, angle: 180},
		{x: game.world.width / 2, y: game.world.height - 0, angle: 0},
		{x: 0, y: game.world.height / 2, angle: 90},
		{x: game.world.width - 0, y: game.world.height / 2, angle: 270},
	];

	this.walls = [];
	this.walls.push(new MapObject(game, 'wall', {x: 180, y: 10}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 620, y: 10}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 180, y: 590}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 620, y: 590}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 10, y: 130}, 20, 260));
	this.walls.push(new MapObject(game, 'wall', {x: 10, y: 470}, 20, 260));
	this.walls.push(new MapObject(game, 'wall', {x: 790, y: 130}, 20, 260));
	this.walls.push(new MapObject(game, 'wall', {x: 790, y: 470}, 20, 260));

	this.walls.push(new MapObject(game, 'wall', {x: 400, y: 150}, 400, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 400, y: 450}, 400, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 130, y: 300}, 20, 160));
	this.walls.push(new MapObject(game, 'wall', {x: 650, y: 300}, 20, 160));

	return this;
};

Maps.map1.prototype = Object.create(Phaser.Group.prototype);
Maps.map1.prototype.constructor = Maps.map1;

// MAP 2
Maps.map2 = function (game) {
	this.spawnPoints = [
		{x: game.world.width / 2, y: 0, angle: 180},
		{x: game.world.width / 2, y: game.world.height - 0, angle: 0},
		{x: 0, y: game.world.height / 2, angle: 90},
		{x: game.world.width - 0, y: game.world.height / 2, angle: 270},
	];

	this.walls = [];
	this.walls.push(new MapObject(game, 'wall', {x: 180, y: 10}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 620, y: 10}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 180, y: 590}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 620, y: 590}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 10, y: 130}, 20, 260));
	this.walls.push(new MapObject(game, 'wall', {x: 10, y: 470}, 20, 260));
	this.walls.push(new MapObject(game, 'wall', {x: 790, y: 130}, 20, 260));
	this.walls.push(new MapObject(game, 'wall', {x: 790, y: 470}, 20, 260));

	return this;
};

Maps.map2.prototype = Object.create(Phaser.Group.prototype);
Maps.map2.prototype.constructor = Maps.map2;

// MAP 3
Maps.map3 = function (game) {
	this.spawnPoints = [
		{x: game.world.width / 2, y: 0, angle: 180},
		{x: game.world.width / 2, y: game.world.height - 0, angle: 0},
		{x: 0, y: game.world.height / 2, angle: 90},
		{x: game.world.width - 0, y: game.world.height / 2, angle: 270},
	];

	this.walls = [];
	this.walls.push(new MapObject(game, 'wall', {x: 400, y: 150}, 400, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 400, y: 450}, 400, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 130, y: 300}, 20, 160));
	this.walls.push(new MapObject(game, 'wall', {x: 650, y: 300}, 20, 160));

	return this;
};

Maps.map3.prototype = Object.create(Phaser.Group.prototype);
Maps.map3.prototype.constructor = Maps.map3;
},{}],6:[function(require,module,exports){
MapObject = function MapObject(game, graphic, position, w, h) {
	Phaser.Sprite.call(this, game, position.x, position.y, graphic);

	this._graphic = graphic;
	this._position = position;
	this.width = w;
	this.height = h;
	
	this.anchor.setTo(0.5,0.5);
	
	this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);
	this.body.immovable = true;
}

MapObject.prototype = Object.create(Phaser.Sprite.prototype);
MapObject.prototype.constructor = MapObject;

// Medikit
Medikit = function Medikit(game, position, player) {
	MapObject.apply(this, [game, 'medikit', position, 20, 20]);
	
	this.player = player;
}

Medikit.prototype = Object.create(MapObject.prototype);
Medikit.prototype.constructor = MapObject;

Medikit.prototype.update = function() {
	this.game.physics.arcade.overlap(this.player, this, this.restoreHealth, null, this);
}

Medikit.prototype.restoreHealth = function() {
	this.player.modifyHealth(20);
	this.destroy();
}

// AmmoCrate
AmmoCrate = function AmmoCrate(game, position, player) {
	MapObject.apply(this, [game, 'ammocrate', position, 20, 20]);
	
	this.player = player;
}

AmmoCrate.prototype = Object.create(MapObject.prototype);
AmmoCrate.prototype.constructor = MapObject;

AmmoCrate.prototype.update = function() {
	this.game.physics.arcade.overlap(this.player, this, this.restoreAmmo, null, this);
}

AmmoCrate.prototype.restoreAmmo = function() {
	this.player.restoreAmmo(25, 5);
	this.destroy();
}
},{}],7:[function(require,module,exports){
'use strict';
var CharacterScript = require('./character.js');
var PlayerScript = require('./player.js');
var EnemyScript = require('./enemy.js');
var SpawnerScript = require('./pool.js');
var ObjectsScript = require('./object.js');
var MapsScript = require('./maps.js');

var PlayScene = {
	create: function () {
		// MUSICA
		this.music = this.game.add.audio('gameMusic');
		this.music.stop();
		this.music.loop = true;
		this.music.play();

		// VARIABLES LOCALES
		this.level = 0;
		this.score = 0;
		this.enemiesKilled = 0;
		this.maps = [
			new Maps.map1(this.game),
			new Maps.map2(this.game),
			new Maps.map3(this.game)
		];
		this.walls = this.maps[0].walls;
		this.spawnPoints = this.maps[0].spawnPoints;

		// PLAYER
		this.player = new Player(this.game, {x: this.game.world.width / 2, y: this.game.world.height / 2});
		this.game.add.existing(this.player);

		// ZOMBIES
		this.zombies = [];
		for(var i = 0; i < 100; i++) {
			this.zombies.push(new Zombie(this.game, this.player, {x: 0, y: 0}));
		}
		this.zombiesPool = new Pool(this.game, this.zombies);

		// RUNNERS
		this.runners = [];
		for(var i = 0; i < 50; i++) {
			this.runners.push(new Runner(this.game, this.player, {x: 0, y: 0}));
		}
		this.runnersPool = new Pool(this.game, this.runners);

		// MUROS
		for(var i = 0; i < this.walls.length; i++) {
			this.game.add.existing(this.walls[i]);
		}

		nextLevel();
	},

	update: function () {
		// COLISIONES ZOMBIES
		this.game.physics.arcade.collide(this.zombies, this.zombies);
		this.game.physics.arcade.collide(this.zombies, this.runners);
		this.game.physics.arcade.collide(this.zombies, this.walls, recalculateDir);

		// COLISIONES RUNNERS
		this.game.physics.arcade.collide(this.runners, this.runners);
		this.game.physics.arcade.collide(this.runners, this.walls, recalculateDir);

		this.game.physics.arcade.collide(this.player, this.walls);

		// COLISIONES BALAS
		this.game.physics.arcade.collide(this.zombies, this.player.weapons[this.player.currentWeapon].hash, bulletHitEnemy);
		this.game.physics.arcade.collide(this.runners, this.player.weapons[this.player.currentWeapon].hash, bulletHitEnemy);
		this.game.physics.arcade.collide(this.walls, this.player.weapons[this.player.currentWeapon].hash, bulletHitWall);

		if (this.enemiesKilled >= this.numEnemies) {
			this.enemiesKilled = 0;
			nextLevel();
		}
	}, 

	// INTERFAZ
	render: function () {
		// HEALTHBAR
		var healthBG = new Phaser.Rectangle(20, 20, 320, 50);
		this.game.debug.geom(healthBG, 'rgba(0, 0, 0, 0.2)') ;
		var health = new Phaser.Rectangle(30,30,this.player._currentHealth*3,30);
		this.game.debug.geom( health, 'rgba(255, 0, 0, 0.8)' ) ;
		this.game.debug.text( "HEALTH: " + this.player._currentHealth, 40, 50, 'rgba(0, 0, 0, 1)' );

		// WEAPON AND AMMO
		var weaponBG = new Phaser.Rectangle(20, this.game.world.height-60, 160, 40);
		this.game.debug.geom(weaponBG, 'rgba(255, 215, 0, 0.5)') ;
		this.game.debug.text( "WEAPON: " + this.player.weapons[this.player.currentWeapon].name, 25, this.game.world.height - 43, 'rgba(0,0,0,1)' );
		this.game.debug.text( "AMMO: " + this.player.weapons[this.player.currentWeapon].ammo, 25, this.game.world.height - 25, 'rgba(0,0,0,1)' );

		// LEVEL AND SCORE
		this.game.debug.text( "LEVEL: " + this.level, this.game.world.width - 220, 15, 'rgba(255, 255, 255, 1)' );
		this.game.debug.text( "SCORE: " + this.score, this.game.world.width - 120, 15, 'rgba(255, 255, 255, 1)' );
	}
};

function nextLevel() {
	PlayScene.level++;
	PlayScene.numEnemies = PlayScene.level *  2 + 10;
	PlayScene.zombiesPool._group.callAll('increaseHealth');
	PlayScene.runnersPool._group.callAll('increaseHealth');
	PlayScene.game.time.events.add(Phaser.Timer.SECOND * 3, beginSpawning, this);
}

// LLAMA A CREAR ZOMBI CADA X SEGUNDOS
function beginSpawning() {
	PlayScene.game.time.events.repeat(Phaser.Timer.SECOND, PlayScene.numEnemies, spawnEnemy, this);
}

// CREA ZOMBI EN SPAWN ALEATORIO
function spawnEnemy() {
	PlayScene.spawnPoint = PlayScene.spawnPoints[Math.floor(Math.random() * PlayScene.spawnPoints.length)];
	if(Math.random() < PlayScene.level / 20) {
		PlayScene.runnersPool.spawn(PlayScene.spawnPoint.x, PlayScene.spawnPoint.y);
	} else {
		PlayScene.zombiesPool.spawn(PlayScene.spawnPoint.x, PlayScene.spawnPoint.y);
	}
}

function bulletHitEnemy(enemy, bullet) {
	enemy.modifyHealth(-bullet.damage);
	if (enemy._currentHealth == 0) {
		PlayScene.enemiesKilled++;
		PlayScene.score += enemy._score;

		spawnBlood(enemy);
		if (enemy.key == 'runner') { spawnReward(enemy); }
	}
	bullet.kill();
}

function bulletHitWall(enemy, bullet) {
	bullet.kill();
}

function recalculateDir(enemy) {
	if (enemy.angle == 90 || enemy.angle == -90) {
		if (PlayScene.player.position.y > enemy.position.y) {
			enemy.angle = 180;
			enemy.body.velocity.y = enemy._speed;
		} else {
			enemy.angle = 0;
			enemy.body.velocity.y = -enemy._speed;
		}
	}

	if (enemy.angle == 0 || enemy.angle == -180) {
		if (PlayScene.player.position.x > enemy.position.x) {
			enemy.angle = 90;
			enemy.body.velocity.x = enemy._speed;
		} else {
			enemy.angle = -90;
			enemy.body.velocity.x = -enemy._speed;
		}
	}
}

function bringAllToTop() {
	PlayScene.player.bringToTop();
	for(var i = 0; i < PlayScene.walls.length; i++) {
		PlayScene.walls[i].bringToTop();
	}
	for(var i = 0; i < PlayScene.zombies.length; i++) {
		PlayScene.zombies[i].bringToTop();
	}
	console.log(PlayScene.walls[0]);
	console.log(PlayScene.zombies[0])
}

function spawnBlood(enemy) {
	var blood = PlayScene.game.add.sprite(enemy.position.x, enemy.position.y, 'blood');
	blood.scale.setTo(0.1);
	blood.anchor.setTo(0.5);
	bringAllToTop();
}

function spawnReward(enemy) {
	var reward;
	if(Math.random() < 0.5) {
		reward = new Medikit(PlayScene.game, enemy.position, PlayScene.player);
	} else {
		reward = new AmmoCrate(PlayScene.game, enemy.position, PlayScene.player);
	}
	PlayScene.game.add.existing(reward);
	bringAllToTop();
}

module.exports = PlayScene;

},{"./character.js":2,"./enemy.js":3,"./maps.js":5,"./object.js":6,"./player.js":8,"./pool.js":9}],8:[function(require,module,exports){
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
	this.body.setSize(290, 290, 0, 280);
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Character;

Player.prototype.update = function() {
	this.move();
	this.checkInput();
	if (this._currentHealth == 0) {
		this.game.state.states.play.music.stop();
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

Player.prototype.restoreAmmo = function (rifleAmmo, shotgunAmmo) {
	this.weapons[1].ammo += rifleAmmo;
	this.weapons[2].ammo += shotgunAmmo;
}
},{"./character.js":2,"./weapons.js":10}],9:[function(require,module,exports){
Pool = function (game, entities) {
	this._group = game.add.physicsGroup(Phaser.Physics.ARCADE);
	this._group.addMultiple(entities);
	this._group.callAll('kill');
}

Pool.prototype.spawn = function (x, y) {
	var entity = this._group.getFirstExists(false);
	if (entity) {
		entity.reset(x, y);
		entity._currentHealth = entity._health;
		entity.scale.setTo(0.075);
	}
	return entity;
}
},{}],10:[function(require,module,exports){
var BulletScript = require('./bullets.js');

Weapon = {};

// PISTOLA
Weapon.pistol = function (game) {
	Phaser.Group.call(this, game, game.world, 'pistolBullets', false, true, Phaser.Physics.ARCADE);

	this.name = "Pistol";
	this.sound = game.add.audio('pistolShot');
	this.nextFire = 0;
	this.bulletSpeed = 600;
	this.fireRate = 500;
	this.damage = 5;
	this.ammo = "Unlimited";

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
	
	if (angle == 0) { x = source.x + 10; y = source.y + 8; }
	if (angle == -90) { x = source.x + 8; y = source.y - 10; }
	if ( angle == -180) { x = source.x - 10; y = source.y - 8; }
	if (angle == -270) { x = source.x - 8; y = source.y + 10; }

	this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed);

	this.nextFire = this.game.time.time + this.fireRate;
	this.sound.play();
};

// RIFLE
Weapon.rifle = function (game) {
	Phaser.Group.call(this, game, game.world, 'rifleBullets', false, true, Phaser.Physics.ARCADE);

	this.name = "Rifle";
	this.sound = game.add.audio('pistolShot');
	this.nextFire = 0;
	this.bulletSpeed = 1000;
	this.fireRate = 100;
	this.damage = 3;
	this.ammo = 100;

	for (var i = 0; i < 64; i++)
	{
		this.add(new Bullet(game, 'bullet', this.damage), true);
	}

	return this;
};

Weapon.rifle.prototype = Object.create(Phaser.Group.prototype);
Weapon.rifle.prototype.constructor = Weapon.rifle;

Weapon.rifle.prototype.fire = function (source) {
	if (this.game.time.time < this.nextFire || this.ammo <= 0) { return; }

	var angle = source.angle - 90;
	var x;
	var y;
	this.ammo--;
	
	if (angle == 0) { x = source.x + 10; y = source.y + 8; }
	if (angle == -90) { x = source.x + 8; y = source.y - 10; }
	if ( angle == -180) { x = source.x - 10; y = source.y - 8; }
	if (angle == -270) { x = source.x - 8; y = source.y + 10; }

	this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed);

	this.nextFire = this.game.time.time + this.fireRate;
	this.sound.play();
};

// SHOTGUN
Weapon.shotgun = function (game) {
	Phaser.Group.call(this, game, game.world, 'shotgunBullets', false, true, Phaser.Physics.ARCADE);

	this.name = "Shotgun";
	this.sound = game.add.audio('pistolShot');
	this.nextFire = 0;
	this.bulletSpeed = 1000;
	this.fireRate = 1000;
	this.damage = 10;
	this.ammo = 20;

	for (var i = 0; i < 64; i++)
	{
		this.add(new Bullet(game, 'bullet', this.damage), true);
	}

	return this;
};

Weapon.shotgun.prototype = Object.create(Phaser.Group.prototype);
Weapon.shotgun.prototype.constructor = Weapon.shotgun;

Weapon.shotgun.prototype.fire = function (source) {
	if (this.game.time.time < this.nextFire || this.ammo <= 0) { return; }

	var angle = source.angle - 90;
	var x;
	var y;
	this.ammo--;
	
	if (angle == 0) { x = source.x + 10; y = source.y + 8; }
	if (angle == -90) { x = source.x + 8; y = source.y - 10; }
	if ( angle == -180) { x = source.x - 10; y = source.y - 8; }
	if (angle == -270) { x = source.x - 8; y = source.y + 10; }

	this.getFirstExists(false).fire(x, y, angle + 30, this.bulletSpeed);
	this.getFirstExists(false).fire(x, y, angle + 15, this.bulletSpeed);
	this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed);
	this.getFirstExists(false).fire(x, y, angle - 15, this.bulletSpeed);
	this.getFirstExists(false).fire(x, y, angle - 30, this.bulletSpeed);

	this.nextFire = this.game.time.time + this.fireRate;
	this.sound.play();
};
},{"./bullets.js":1}]},{},[4]);
