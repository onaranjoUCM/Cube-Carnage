'use strict';

window.onload = function () {
	var PlayScene = require('./play_scene.js');
	var config = {
		width: 800,
		height: 680,
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
		this.game.load.spritesheet('controlsButton', 'images/menus/controlsButton.png', 181, 60);
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
		title.scale.setTo(0.55,1.55);
		title.anchor.setTo(0.5,0.5);

		this.game.add.sprite(-40,570, 'logo');

		this.game.add.button(530, 520, 'playButton', this.start, this, 2, 0, 1);
		this.game.add.button(610, 610, 'controlsButton', this.controls, this, 2, 0, 1);

		this.music = this.game.add.audio('menuMusic');
		this.music.volume = 0.01;
		this.music.loop = true;
		this.music.onDecoded.add(this.playMusic, this);
	},
	
	start: function() {
		this.game.state.start('nameMenu', true, false, 0);
	},
	
	controls: function() {
		this.music.stop();
		this.game.state.start('controls', true, false, 0);
	},
	
	playMusic: function() {
		this.music.play();
	}
};

var Controls = {
	create: function () {
		var title = this.game.add.text(this.game.world.centerX, 100, 'Controls', {font: '60px Arial', fill: '#000000'});
		this.game.add.text(this.game.world.centerX - 200, 250, 'Move: WASD or ARROW KEYS', {font: '30px Arial', fill: '#000000'});
		this.game.add.text(this.game.world.centerX - 200, 300, 'Shoot: SPACEBAR or NUMPAD 0', {font: '30px Arial', fill: '#000000'});
		this.game.add.text(this.game.world.centerX - 200, 350, 'Switch weapon: 1, 2 and 3', {font: '30px Arial', fill: '#000000'});
		this.game.add.text(this.game.world.centerX - 200, 400, 'Pause: Escape', {font: '30px Arial', fill: '#000000'});
		var returnButton = this.game.add.button(this.game.world.centerX, 600, 'backButton', this.goToMenu, this, 2, 0, 1);
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
		this.title = this.game.add.text(this.game.world.centerX, 200, 'Write your name', {font: '40px Arial', fill: '#000000'});
		this.pressBackspace = this.game.add.text(this.game.world.centerX, 500, 'Press Backspace to reset', {font: '20px Arial', fill: '#000000'});
		this.pressEnter = this.game.add.text(this.game.world.centerX, 530, 'Press Enter to continue', {font: '20px Arial', fill: '#000000'});
		this.textbox = this.game.add.text(350, 300, 'John Cubick', {font: '20px Arial', fill: '#999999'});
		this.title.anchor.setTo(0.5);
		this.pressBackspace.anchor.setTo(0.5);
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
			NameMenu.textbox.fill = '#000000';
			NameMenu.playerName += char;
			NameMenu.textbox.text = NameMenu.playerName;
		}
	},

	update: function() {
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.BACKSPACE) && this.game.state.current == "nameMenu") {
			NameMenu.playerName = '';
			NameMenu.textbox.text = NameMenu.playerName;
		}
	},
	
	render: function() {
		//this.game.debug.geom(new Phaser.Rectangle(300, 320, 200, 1), 'rgba(0, 0, 0)');
	}
};

var MapsMenu = {
	create: function () {
		this.title = this.game.add.text(this.game.world.centerX, 100, 'Choose a map', {font: '60px Arial', fill: '#000000'});
		this.name = this.game.add.text(this.game.world.centerX, 600, 'Name: ' + localStorage.getItem('playerName'), {font: '30px Arial', fill: '#000000'});
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