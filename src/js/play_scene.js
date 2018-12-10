'use strict';
var CharacterScript = require('./character.js');
var PlayerScript = require('./player.js');
var EnemyScript = require('./enemy.js');
var SpawnerScript = require('./pool.js');
var ObjectsScript = require('./object.js');
var MapsScript = require('./maps.js');

var PlayScene = {
	create: function () {
		// VARIABLES LOCALES
		this.level = 0;
		this.score = 0;
		this.enemies = [];
		this.maps = [
			new Maps.map1(this.game),
			new Maps.map2(this.game),
			new Maps.map3(this.game)
		];
		this.walls = this.maps[0].walls;
		this.spawnPoints = this.maps[0].spawnPoints;
		this.enemiesKilled = 0;

		// PLAYER
		this.player = new Player(this.game, {x: this.game.world.width / 2, y: this.game.world.height / 2});
		this.game.add.existing(this.player);

		// ENEMIGOS
		for(var i = 0; i < 100; i++) {
			this.enemies.push(new Zombie(this.game, this.player, {x: 0, y: 0}));
		}
		this.enemiesPool = new Pool(this.game, this.enemies);

		// MUROS
		for(var i = 0; i < this.walls.length; i++) {
			this.game.add.existing(this.walls[i]);
		}

		nextLevel();
	},

	update: function () {
		// COLISIONES
		this.game.physics.arcade.collide(this.enemies, this.enemies);
		this.game.physics.arcade.collide(this.enemies, this.walls, recalculateDir);
		this.game.physics.arcade.collide(this.player, this.walls);

		this.game.physics.arcade.collide(this.enemies, this.player.weapons[this.player.currentWeapon].hash, bulletHitEnemy);
		this.game.physics.arcade.collide(this.walls, this.player.weapons[this.player.currentWeapon].hash, bulletHitWall);

		if (this.enemiesKilled == this.numEnemies) {
			this.enemiesKilled = 0;
			nextLevel();
		}
	}, 

	// INTERFAZ
	render: function () {
		var healthBG = new Phaser.Rectangle(20, 20, 220, 40);
		this.game.debug.geom( healthBG, 'rgba(0,0,0,1)' ) ;

		var health = new Phaser.Rectangle( 30, 30, this.player._currentHealth * 2, 20 );
		this.game.debug.geom( health, 'rgba(255,0,0,1)' ) ;

		this.game.debug.text( "HEALTH: " + this.player._currentHealth, 20, 15, 'rgba(0,0,0,1)' );

		this.game.debug.text( "WEAPON: " + this.player.weapons[this.player.currentWeapon].name, 20, this.game.world.height - 40, 'rgba(0,0,0,1)' );
		this.game.debug.text( "AMMO: " + this.player.weapons[this.player.currentWeapon].ammo, 20, this.game.world.height - 22, 'rgba(0,0,0,1)' );

		this.game.debug.text( "LEVEL: " + this.level, this.game.world.width - 220, 15, 'rgba(0,0,0,1)' );
		this.game.debug.text( "SCORE: " + this.score, this.game.world.width - 120, 15, 'rgba(0,0,0,1)' );
	}
};

function nextLevel() {
	PlayScene.level++;
	PlayScene.numEnemies = PlayScene.level *  2 + 10;
	PlayScene.enemiesPool._group.callAll('increaseHealth');
	PlayScene.game.time.events.add(Phaser.Timer.SECOND * 3, beginSpawning, this);
}

// LLAMA A CREAR ZOMBI CADA X SEGUNDOS
function beginSpawning() {
	PlayScene.game.time.events.repeat(Phaser.Timer.SECOND, PlayScene.numEnemies, spawnZombie, this);
}

// CREA ZOMBI EN SPAWN ALEATORIO
function spawnZombie() {
	PlayScene.spawnPoint = PlayScene.spawnPoints[Math.floor(Math.random() * PlayScene.spawnPoints.length)];
	PlayScene.enemiesPool.spawn(PlayScene.spawnPoint.x, PlayScene.spawnPoint.y);
}

function bulletHitEnemy(enemy, bullet) {
	enemy.modifyHealth(-bullet.damage);
	if (enemy._currentHealth == 0) {
		PlayScene.enemiesKilled++;
		PlayScene.score += enemy._score;
		var blood = PlayScene.game.add.sprite(enemy.position.x, enemy.position.y, 'blood');
		blood.scale.setTo(0.1);
		blood.anchor.setTo(0.5);
		bringAllToTop();
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
}

module.exports = PlayScene;

// ERRORES CONOCIDOS
// - La escopeta provoca errores al impactar varias balas a la vez en el mismo enemigo
