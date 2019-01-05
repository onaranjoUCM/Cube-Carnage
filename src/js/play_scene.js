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
		this.player = new Player(this.game, {x: this.game.world.width / 2, y: this.game.world.height / 2 + 40});
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
		// BACKGROUND
		this.game.debug.geom(new Phaser.Rectangle(0, 0, 800, 80), 'rgba(0, 0, 153)');
		this.game.debug.geom(new Phaser.Rectangle(10, 10, 780, 60), 'rgba(77, 77, 255)');
		
		// HEALTHBAR
		this.game.debug.geom(new Phaser.Rectangle(20, 20, this.player._currentHealth * 3, 40), 'rgba(255, 0, 0, 0.8)');
		this.game.debug.text("HEALTH: " + this.player._currentHealth, 30, 45, 'rgba(0, 0, 0, 1)', '20px Courier');

		// WEAPON AND AMMO
		this.game.debug.text( "WEAPON: " + this.player.weapons[this.player.currentWeapon].name, 600, 35, 'rgba(0,0,0)', '20px Courier' );
		this.game.debug.text( "AMMO: " + this.player.weapons[this.player.currentWeapon].ammo, 600, 55, 'rgba(0,0,0)', '20px Courier' );

		// LEVEL AND SCORE
		this.game.debug.text( "LEVEL: " + this.level, 350, 35, 'rgba(255, 255, 255)', '20px Courier' );
		this.game.debug.text( "SCORE: " + this.score, 350, 55, 'rgba(255, 255, 255)', '20px Courier' );
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
