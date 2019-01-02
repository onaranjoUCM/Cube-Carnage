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
	this.sound = this.game.add.audio('zombieAttack');
	this.sound.volume = 0.01;

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
	game.state.add('mapsMenu', MapsMenu);
	game.state.add('play', PlayScene);
	game.state.add('scoreboard', Scoreboard);
	game.state.add('nameMenu', NameMenu);
	game.state.add('controls', Controls);

	game.state.start('boot');
};

var BootScene = {
	preload: function () {
		this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
		this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
		this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
		this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
		this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);

		// load here assets required for the loading screen
		this.game.load.image('preloader_bar', 'images/menus/preloader_bar.png');
	},

	create: function () {
		this.game.state.start('preloader');
	}
};

var PreloaderScene = {
	preload: function () {
		this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
		this.loadingBar.anchor.setTo(0, 0.5);
		this.load.setPreloadSprite(this.loadingBar);

		this.game.load.image('title', 'images/menus/CubeCarnage.png');
		this.game.load.image('logo', 'images/menus/kitten.png');
		this.game.load.audio('menuMusic', 'audio/Heroic_Intrusion.ogg');
	},

	create: function () {
		this.game.state.start('menu');
	}
};

var MenuScene = {
	preload: function () {
		// Button sprites
		this.game.load.spritesheet('playButton', 'images/menus/playButton.png', 260, 80);
		this.game.load.spritesheet('backButton', 'images/menus/backButton.png', 161, 60);
		this.game.load.spritesheet('map1button', 'images/menus/map1button.png', 208, 58);
		this.game.load.spritesheet('map2button', 'images/menus/map2button.png', 208, 58);
		this.game.load.spritesheet('map3button', 'images/menus/map3button.png', 208, 58);

		// Map sprites
		this.game.load.image('map1', 'images/menus/map1.png');
		this.game.load.image('map2', 'images/menus/map2.png');
		this.game.load.image('map3', 'images/menus/map3.png');

		// Player sprites
		this.game.load.spritesheet('playerPistol', 'images/characters/playerWalkingPistol.png', 276, 584);
		this.game.load.spritesheet('playerRifle', 'images/characters/playerWalkingRifle.png', 276, 584);
		this.game.load.spritesheet('playerShotgun', 'images/characters/playerWalkingShotgun.png', 276, 584);

		// Enemy sprites
		this.game.load.spritesheet('zombie', 'images/characters/zombie.png', 276, 442);
		this.game.load.spritesheet('runner', 'images/characters/runner.png', 276, 442);

		// Object sprites
		this.game.load.image('pauseMenu', 'images/menus/pauseMenu.png');
		this.game.load.image('wall', 'images/objects/wall.png');
		this.game.load.image('bullet', 'images/objects/bullet.png');
		this.game.load.image('blood', 'images/objects/blood_splatter.png');
		this.game.load.image('medikit', 'images/objects/medikit.png');
		this.game.load.image('ammocrate', 'images/objects/ammocrate.png');

		// Music
		var music;
		this.game.load.audio('gameMusic', 'audio/Humble_Match.ogg');

		// Audio effects
		this.game.load.audio('pistolShot', 'audio/pistolShot.mp3');
		this.game.load.audio('zombieAttack', 'audio/zombieAttack.mp3');
		this.game.load.audio('emptyGun', 'audio/emptyGun.mp3');
		this.game.load.audio('heal', 'audio/heal.mp3');
		this.game.load.audio('heartbeat', 'audio/heartbeat.mp3');
		this.game.load.audio('shotgun', 'audio/shotgun.mp3');
		this.game.load.audio('switchWeapon', 'audio/switchWeapon.mp3');
		this.game.load.audio('noMercy', 'audio/noMercy.mp3');
	},

	create: function () {
		var title = this.game.add.sprite(this.game.world.width / 2, this.game.world.height / 2, 'title');
		title.scale.setTo(0.55,1.31);
		title.anchor.setTo(0.5,0.5);

		this.game.add.sprite(-40,500, 'logo');

		this.game.add.button(530, 440, 'playButton', this.start, this, 2, 0, 1);
		this.game.add.button(630, 530, 'backButton', this.controls, this, 2, 0, 1);

		this.music = this.game.add.audio('menuMusic');
		this.music.volume = 0.01;
		this.music.loop = true;

		this.music.play();
	},
	
	start: function() {
		if (!this.music.isPlaying) {
			this.music.play();
		}
		this.game.state.start('nameMenu', true, false, 0);
	},
	
	controls: function() {
		this.music.stop();
		this.game.state.start('controls', true, false, 0);
	}
};

var Controls = {
	create: function () {
		var title = this.game.add.text(this.game.world.centerX, 100, 'Controls', {font: '60px Arial', fill: '#000000'});
		this.game.add.text(this.game.world.centerX - 200, 200, 'Move: WASD or ARROW KEYS', {font: '30px Arial', fill: '#000000'});
		this.game.add.text(this.game.world.centerX - 200, 250, 'Shoot: SPACEBAR or NUMPAD 0', {font: '30px Arial', fill: '#000000'});
		this.game.add.text(this.game.world.centerX - 200, 300, 'Switch weapon: 1, 2 and 3', {font: '30px Arial', fill: '#000000'});
		this.game.add.text(this.game.world.centerX - 200, 350, 'Pause: Escape', {font: '30px Arial', fill: '#000000'});
		var returnButton = this.game.add.button(this.game.world.centerX, 500, 'backButton', this.goToMenu, this, 2, 0, 1);
		title.anchor.setTo(0.5);
		returnButton.anchor.setTo(0.5);
	},

	goToMenu: function() {
		this.game.state.start('menu', true, false);
	}
};

var NameMenu = {
	create: function () {
		this.playerName = '';
		this.title = this.game.add.text(this.game.world.centerX, 250, 'Write your name', {font: '40px Arial', fill: '#000000'});
		this.pressEnter = this.game.add.text(this.game.world.centerX, 550, 'Press Enter to continue', {font: '20px Arial', fill: '#000000'});
		this.textbox = this.game.add.text(330, 300, '', {font: '20px Arial', fill: '#000000'});
		this.title.anchor.setTo(0.5);
		this.pressEnter.anchor.setTo(0.5);

		this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
	},

	keyPress: function(char) {
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER) && this.game.state.current == "nameMenu"){
			if (NameMenu.playerName == '') {
				localStorage.setItem('playerName', 'John Cubick');
			} else {
				localStorage.setItem('playerName', NameMenu.playerName);
			}
			this.game.state.start('mapsMenu', true, false);
		}

		if (NameMenu.playerName.length <= 12) {
			NameMenu.playerName += char;
			NameMenu.textbox.text = NameMenu.playerName;
		}
	},

	update: function() {
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.BACKSPACE) && this.game.state.current == "nameMenu"){
			console.log("aids");
		}
	}
};

var MapsMenu = {
	create: function () {
		this.title = this.game.add.text(this.game.world.centerX, 100, 'Choose a map', {font: '60px Arial', fill: '#000000'});
		this.name = this.game.add.text(this.game.world.centerX, 550, 'Name: ' + localStorage.getItem('playerName'), {font: '30px Arial', fill: '#000000'});
		this.title.anchor.setTo(0.5);
		this.name.anchor.setTo(0.5);

		var map1 = this.game.add.sprite(50,220, 'map1');
		var map2 = this.game.add.sprite(300,220, 'map2');
		var map3 = this.game.add.sprite(550,220, 'map3');
		map1.scale.setTo(0.25);
		map2.scale.setTo(0.25);
		map3.scale.setTo(0.25);

		this.game.add.button(44, 400, 'map1button', this.map1Clicked, this, 2, 0, 1);
		this.game.add.button(296, 400, 'map2button', this.map2Clicked, this, 2, 0, 1);
		this.game.add.button(548, 400, 'map3button', this.map3Clicked, this, 2, 0, 1);
	},

	map1Clicked: function() {
		MenuScene.music.stop();
		window.localStorage.setItem("map", 1);
		this.game.state.start('play', true, false, 0);
	},

	map2Clicked: function() {
		MenuScene.music.stop();
		window.localStorage.setItem("map", 2);
		this.game.state.start('play', true, false, 0);
	},

	map3Clicked: function() {
		MenuScene.music.stop();
		window.localStorage.setItem("map", 3);
		this.game.state.start('play', true, false, 0);
	}
};

var Scoreboard = {
	create: function () {

		var title = this.game.add.text(this.game.world.centerX, 100, 'Scoreboard', {font: '60px Arial', fill: '#000000'});
		var returnButton = this.game.add.button(this.game.world.centerX, 500, 'backButton', this.goToMenu, this, 2, 0, 1);
		title.anchor.setTo(0.5);
		returnButton.anchor.setTo(0.5);

		var scores = this.allStorage();
		scores.sort(function(a, b){return b.score - a.score});

		for (var i = 0; i < scores.length; i++) {
			if (i == 5) { break; }
			this.game.add.text(250, 200 + (40 * i), scores[i].name + ": " + scores[i].score, {font: '40px Arial', fill: '#000000'});
		}
	},

	goToMenu: function() {
		this.game.state.start('menu', true, false);
	},

	allStorage: function() {
		var values = [],
			keys = Object.keys(localStorage),
			i = keys.length;

		while ( i-- ) {
			if (localStorage.key(i) != 'playerName' && localStorage.key(i) != 'map') {
				values.push({name: localStorage.key(i), score: localStorage.getItem(keys[i])});
			}
		}

		return values;
	}
};
},{"./play_scene.js":7}],5:[function(require,module,exports){
Maps = function(game) { 
	this.map1 = function (game) {
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

	this.map2 = function (game) {
		this.spawnPoints = [
			{x: 20, y: 50, angle: 90},
			{x: game.world.width - 20, y: 50, angle: -90},
			{x: 20, y: game.world.height - 50, angle: 90},
			{x: game.world.width - 20, y: game.world.height - 50, angle: -90}
		];

		this.walls = [];
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width / 2, y: 10}, game.world.width, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width / 2, y: game.world.height - 10}, game.world.width, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 10, y: game.world.height / 2}, 20, game.world.height - 160));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 10, y: game.world.height / 2}, 20, game.world.height - 160));

		this.walls.push(new MapObject(game, 'wall', {x: 230, y: 90}, 260, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 230, y: game.world.height - 90}, 260, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 230, y: 90}, 260, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 230, y: game.world.height - 90}, 260, 20));

		this.walls.push(new MapObject(game, 'wall', {x: 230, y: 260}, 260, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 230, y: game.world.height - 260}, 260, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 230, y: 260}, 260, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 230, y: game.world.height - 260}, 260, 20));

		this.walls.push(new MapObject(game, 'wall', {x: 110, y: 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: 110, y: game.world.height - 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: 350, y: 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: 350, y: game.world.height - 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 350, y: 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 350, y: game.world.height - 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 110, y: 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 110, y: game.world.height - 175}, 20, 80));

		this.walls.push(new MapObject(game, 'wall', {x: 230, y: 175}, 120, 60));
		this.walls.push(new MapObject(game, 'wall', {x: 230, y: game.world.height - 175}, 120, 60));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 230, y: 175}, 120, 60));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 230, y: game.world.height - 175}, 120, 60));

		return this;
	};

	this.map3 = function (game) {
		this.spawnPoints = [
			{x: game.world.width / 2, y: 0, angle: 180},
			{x: game.world.width / 2, y: game.world.height - 0, angle: 0},
			{x: 0, y: game.world.height / 2, angle: 90},
			{x: game.world.width - 0, y: game.world.height / 2, angle: 270},
			{x: 20, y: 50, angle: 90},
			{x: game.world.width - 20, y: 50, angle: -90},
			{x: 20, y: game.world.height - 50, angle: 90},
			{x: game.world.width - 20, y: game.world.height - 50, angle: -90}
		];

		this.walls = [];
		this.walls.push(new MapObject(game, 'wall', {x: 180, y: 10}, 360, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 180, y: 10}, 360, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 180, y: game.world.height - 10}, 360, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 180, y: game.world.height - 10}, 360, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 10, y: 160}, 20, 200));
		this.walls.push(new MapObject(game, 'wall', {x: 10, y: game.world.height - 160}, 20, 200));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 10, y: 160}, 20, 200));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 10, y: game.world.height - 160}, 20, 200));

		this.walls.push(new MapObject(game, 'wall', {x: 310, y: 120}, 100, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 170, y: 120}, 80, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 310, y: 120}, 100, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width -170, y: 120}, 80, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 310, y: game.world.height - 120}, 100, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 170, y: game.world.height - 120}, 80, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 310, y: game.world.height - 120}, 100, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width -170, y: game.world.height - 120}, 80, 20));

		this.walls.push(new MapObject(game, 'wall', {x: 120, y: 185}, 20, 150));
		this.walls.push(new MapObject(game, 'wall', {x: 120, y: game.world.height - 185}, 20, 150));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 120, y: 185}, 20, 150));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 120, y: game.world.height - 185}, 20, 150));

		this.walls.push(new MapObject(game, 'wall', {x: 200, y: 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: 200, y: game.world.height - 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 200, y: 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 200, y: game.world.height - 210}, 20, 100));

		this.walls.push(new MapObject(game, 'wall', {x: 270, y: 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: 270, y: game.world.height - 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 270, y: 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 270, y: game.world.height - 210}, 20, 100));

		this.walls.push(new MapObject(game, 'wall', {x: 350, y: 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: 350, y: game.world.height - 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 350, y: 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 350, y: game.world.height - 210}, 20, 100));

		return this;
	};
};
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
	this.sound = game.add.audio('heal');
	this.sound.volume = 0.01;
}

Medikit.prototype = Object.create(MapObject.prototype);
Medikit.prototype.constructor = MapObject;

Medikit.prototype.update = function() {
	this.game.physics.arcade.overlap(this.player, this, this.restoreHealth, null, this);
}

Medikit.prototype.restoreHealth = function() {
	this.sound.play();
	this.player.modifyHealth(20);
	this.destroy();
}

// AmmoCrate
AmmoCrate = function AmmoCrate(game, position, player) {
	MapObject.apply(this, [game, 'ammocrate', position, 20, 20]);
	
	this.player = player;
	this.sound = game.add.audio('switchWeapon');
	this.sound.volume = 0.01;
}

AmmoCrate.prototype = Object.create(MapObject.prototype);
AmmoCrate.prototype.constructor = MapObject;

AmmoCrate.prototype.update = function() {
	this.game.physics.arcade.overlap(this.player, this, this.restoreAmmo, null, this);
}

AmmoCrate.prototype.restoreAmmo = function() {
	this.sound.play();
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
		// AUDIO
		this.noMercy = this.game.add.audio('noMercy');
		this.noMercy.volume = 0.01;
		this.music = this.game.add.audio('gameMusic');
		this.music.volume = 0.01;
		this.music.stop();
		this.music.loop = true;
		this.music.play();

		// VARIABLES LOCALES
		this.level = 0;
		this.score = 0;
		this.enemiesKilled = 0;
		this.maps = new Maps(this.game);

		// MAPA
		if (window.localStorage.getItem("map") == 1) {
			this.walls = this.maps.map1(this.game).walls;
			this.spawnPoints = this.maps.map1(this.game).spawnPoints;
		}
		if (window.localStorage.getItem("map") == 2) {
			this.walls = this.maps.map2(this.game).walls;
			this.spawnPoints = this.maps.map2(this.game).spawnPoints;
		}
		if (window.localStorage.getItem("map") == 3) {
			this.walls = this.maps.map3(this.game).walls;
			this.spawnPoints = this.maps.map3(this.game).spawnPoints;
		}

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

		// Pause
		this.pauseMenu;
		this.game.input.onDown.add(this.unpause, self);

		this.nextLevel();
	},

	unpause: function(event) {
		if (PlayScene.game.paused && event.y > 440 && event.y < 500) {
			// Continue button
			if(event.x > 130 && event.x < 340) {
				PlayScene.pauseMenu.destroy();
				PlayScene.game.paused = false;
			}

			// Menu button
			if(event.x > 480 && event.x < 680) {
				PlayScene.player.heartbeatSound.stop();
				PlayScene.game.state.states.play.music.stop();
				PlayScene.game.state.start('menu', true, false);
				PlayScene.game.paused = false;
			}
		}
	},

	update: function () {
		// COLISIONES ZOMBIES
		this.game.physics.arcade.collide(this.zombies, this.zombies);
		this.game.physics.arcade.collide(this.zombies, this.runners);
		this.game.physics.arcade.collide(this.zombies, this.walls, this.recalculateDir);

		// COLISIONES RUNNERS
		this.game.physics.arcade.collide(this.runners, this.runners);
		this.game.physics.arcade.collide(this.runners, this.walls, this.recalculateDir);

		this.game.physics.arcade.collide(this.player, this.walls);

		// COLISIONES BALAS
		this.game.physics.arcade.collide(this.zombies, this.player.weapons[this.player.currentWeapon].hash, this.bulletHitEnemy);
		this.game.physics.arcade.collide(this.runners, this.player.weapons[this.player.currentWeapon].hash, this.bulletHitEnemy);
		this.game.physics.arcade.collide(this.walls, this.player.weapons[this.player.currentWeapon].hash, this.bulletHitWall);

		// Comprueba los enemigos para pasar de nivel
		if (this.enemiesKilled >= this.numEnemies) {
			this.enemiesKilled = 0;
			this.nextLevel();
		}

		// Comprueba la salud del jugador para acabar la partida
		if (this.player._currentHealth == 0) {
			this.game.state.states.play.music.stop();
			localStorage.setItem(localStorage.getItem('playerName'), this.score);
			this.game.state.start('scoreboard', true, false);
		}

		// Pause menu
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.ESC)) {
			this.game.paused = true;
			this.pauseMenu = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'pauseMenu');
			this.pauseMenu.anchor.setTo(0.5, 0.5);
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
	},

	nextLevel: function() {
		this.level++;
		this.numEnemies = this.level *  2 + 10;
		this.zombiesPool._group.callAll('increaseHealth');
		this.runnersPool._group.callAll('increaseHealth');
		this.game.time.events.add(Phaser.Timer.SECOND * 3, this.beginSpawning, this);
	},

	// LLAMA A CREAR ZOMBI CADA X SEGUNDOS
	beginSpawning: function() {
		this.noMercy.play();
		this.game.time.events.repeat(Phaser.Timer.SECOND, this.numEnemies, this.spawnEnemy, this);
	},

	// CREA ZOMBI EN SPAWN ALEATORIO
	spawnEnemy: function() {
		this.spawnPoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
		if(Math.random() < this.level / 20) {
			this.runnersPool.spawn(this.spawnPoint.x, this.spawnPoint.y);
		} else {
			this.zombiesPool.spawn(this.spawnPoint.x, this.spawnPoint.y);
		}
	},

	bulletHitEnemy: function(enemy, bullet) {
		enemy.modifyHealth(-bullet.damage);
		if (enemy._currentHealth == 0) {
			PlayScene.enemiesKilled++;
			PlayScene.score += enemy._score;

			PlayScene.spawnBlood(enemy);
			if (enemy.key == 'runner') { PlayScene.spawnReward(enemy); }
		}
		bullet.kill();
	},

	bulletHitWall: function(enemy, bullet) {
		bullet.kill();
	},

	recalculateDir: function(enemy) {
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
	},

	bringAllToTop: function() {
		this.player.bringToTop();
		this.game.world.bringToTop(this.zombiesPool._group);
		this.game.world.bringToTop(this.runnersPool._group);
		for(var i = 0; i < this.walls.length; i++) {
			this.walls[i].bringToTop();
		}
	},

	spawnBlood: function(enemy) {
		var blood = this.game.add.sprite(enemy.position.x, enemy.position.y, 'blood');
		blood.scale.setTo(0.1);
		blood.anchor.setTo(0.5);
		PlayScene.bringAllToTop();
	},

	spawnReward: function(enemy) {
		var reward;
		if(Math.random() < 0.5) {
			reward = new Medikit(this.game, enemy.position, this.player);
		} else {
			reward = new AmmoCrate(this.game, enemy.position, this.player);
		}
		this.game.add.existing(reward);
		PlayScene.bringAllToTop();
	}

};

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
	this.switchWeaponSound = game.add.audio('switchWeapon');
	this.switchWeaponSound.volume = 0.01;
	this.heartbeatSound = game.add.audio('heartbeat');
	this.heartbeatSound.loop = true;
	this.heartbeatSound.volume = 0.1;

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
	
	if (this._currentHealth <= 25 && !this.heartbeatSound.isPlaying) {
		this.heartbeatSound.play();
	}
	if (this._currentHealth > 25 || this._currentHealth == 0) {
		this.heartbeatSound.stop();
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
	if (this.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || this.keyboard.isDown(Phaser.Keyboard.NUMPAD_0))
	{
		this.weapons[this.currentWeapon].fire(this);
	}
	if (this.keyboard.isDown(Phaser.Keyboard.ONE) || this.keyboard.isDown(Phaser.Keyboard.NUMPAD_1))
	{
		this.switchWeaponSound.play();
		this.currentWeapon = 0;
		this.loadTexture('playerPistol'), 0;
	}
	if (this.keyboard.isDown(Phaser.Keyboard.TWO) || this.keyboard.isDown(Phaser.Keyboard.NUMPAD_2))
	{
		this.switchWeaponSound.play();
		this.currentWeapon = 1;
		this.loadTexture('playerRifle'), 0;
	}
	if (this.keyboard.isDown(Phaser.Keyboard.THREE) || this.keyboard.isDown(Phaser.Keyboard.NUMPAD_3))
	{
		this.switchWeaponSound.play();
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
	this.sound.volume = 0.005;
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
	this.sound.volume = 0.005;
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
	this.sound = game.add.audio('shotgun');
	this.sound.volume = 0.005;
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
