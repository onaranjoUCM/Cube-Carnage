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
		this.game.load.audio('menuMusic', 'audio/Heroic_Intrusion.ogg');
	},

	create: function () {
		this.game.state.start('menu');
		this.music = this.game.add.audio('menuMusic');
		this.music.loop = true;
		this.music.play();
	}
};

var MenuScene = {
	preload: function () {
		var music;
		// TODO: load here the assets for the game
		this.game.load.spritesheet('player', 'images/playerWalkingRifle.png', 131, 275);
		this.game.load.spritesheet('zombie', 'images/zombieWalking.png', 183, 271);
		this.game.load.image('zombi', 'images/zombie.png');

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
	},

	start: function() {
		this.game.state.start('play');
		PreloaderScene.music.stop();
		this.music = this.game.add.audio('gameMusic');
		this.music.loop = true;
		this.music.play();
	}
};
