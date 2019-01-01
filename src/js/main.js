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
		var music;
		// Button sprites
		this.game.load.spritesheet('playButton', 'images/menus/playButton.png', 260, 80);
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
		this.game.load.spritesheet('zombie', 'images/characters/zombieWalk.png', 276, 424);
		this.game.load.spritesheet('zombieAttack', 'images/characters/zombieAttack.png', 276, 442);
		this.game.load.spritesheet('runner', 'images/characters/runnerWalk.png', 276, 424);
		this.game.load.spritesheet('runnerAttack', 'images/characters/runnerAttack.png', 276, 442);

		// Object sprites
		this.game.load.image('wall', 'images/objects/wall.png');
		this.game.load.image('bullet', 'images/objects/bullet.png');
		this.game.load.image('blood', 'images/objects/blood_splatter.png');
		this.game.load.image('medikit', 'images/objects/medikit.png');
		this.game.load.image('ammocrate', 'images/objects/ammocrate.png');

		// Music
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

		this.game.add.button(520, 500, 'playButton', this.start, this, 2, 0, 1);

		var spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spacebar.onDown.addOnce(this.start, this);

		this.music = this.game.add.audio('menuMusic');
		this.music.loop = true;
		this.music.play();
	},

	start: function() {
		this.game.state.start('mapsMenu', true, false, 0);
	}
};

var MapsMenu = {
	create: function () {
		this.game.add.text(200, 50, 'Choose a map', {font: '60px Arial', fill: '#000000'});

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
