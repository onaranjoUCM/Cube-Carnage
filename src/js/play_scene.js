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
		this.walls = this.maps[1].walls;
		this.spawnPoints = this.maps[1].spawnPoints;

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

		this.nextLevel();
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

		if (this.enemiesKilled >= this.numEnemies) {
			this.enemiesKilled = 0;
			this.nextLevel();
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
		for(var i = 0; i < this.walls.length; i++) {
			this.walls[i].bringToTop();
		}
		for(var i = 0; i < this.zombies.length; i++) {
			this.zombies[i].bringToTop();
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
