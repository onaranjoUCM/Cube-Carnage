'use strict';
var CharacterScript = require('./character.js');
var PlayerScript = require('./player.js');
var EnemyScript = require('./enemy.js');
var SpawnerScript = require('./pool.js');

var PlayScene = {
	create: function () {
		this.level = 0;
		this.score = 0;
		this.enemies = [];
		this.spawnPoints = [
			{x: this.game.world.width / 2, y: 0, angle: 180},
			{x: this.game.world.width / 2, y: this.game.world.height - 0, angle: 0},
			{x: 0, y: this.game.world.height / 2, angle: 90},
			{x: this.game.world.width - 0, y: this.game.world.height / 2, angle: 270},
		];
		this.enemiesKilled = 0;

		this.player = new Player(this.game, {x: this.game.world.width / 2, y: this.game.world.height / 2});
		this.game.add.existing(this.player);

		for(var i = 0; i < 100; i++) {
			this.enemies.push(new Zombie(this.game, this.player, {x: 0, y: 0}));
		}
		this.enemiesPool = new Pool(this.game, this.enemies);

		nextLevel();
	},

	update: function () {
		this.game.physics.arcade.collide(this.enemies, this.enemies);
		this.game.physics.arcade.collide(this.enemies, this.player.weapons[this.player.currentWeapon].hash, hit);

		if (this.enemiesKilled == this.numEnemies) {
			this.enemiesKilled = 0;
			nextLevel();
		}
	}, 

	// INTERFAZ
	render: function () {
		var healthBG = new Phaser.Rectangle(20, 30, 220, 40);
		this.game.debug.geom( healthBG, 'rgba(0,0,0,1)' ) ;

		var health = new Phaser.Rectangle( 30, 40, this.player._currentHealth * 2, 20 );
		this.game.debug.geom( health, 'rgba(255,0,0,1)' ) ;

		this.game.debug.text( "HEALTH: " + this.player._currentHealth, 20, 20, 'rgba(0,0,0,1)' );

		this.game.debug.text( "WEAPON: " + this.player.weapons[this.player.currentWeapon].name, 20, this.game.world.height - 40, 'rgba(0,0,0,1)' );
		this.game.debug.text( "AMMO: " + this.player.weapons[this.player.currentWeapon].ammo, 20, this.game.world.height - 20, 'rgba(0,0,0,1)' );

		this.game.debug.text( "LEVEL: " + this.level, this.game.world.width - 100, 20, 'rgba(0,0,0,1)' );
		this.game.debug.text( "SCORE: " + this.score, this.game.world.width - 100, 40, 'rgba(0,0,0,1)' );
	}
};

// PASA DE NIVEL
function nextLevel() {
	PlayScene.level++;
	PlayScene.numEnemies = PlayScene.level *  2 + 10;
	PlayScene.enemiesPool._group.callAll('increaseHealth');
	PlayScene.game.time.events.add(Phaser.Timer.SECOND * 3, beginSpawning, this);
}

// LLAMA A CREAR ZOMBI CADA X SEGUNDOS
function beginSpawning() {
	console.log("asd");
	PlayScene.game.time.events.repeat(Phaser.Timer.SECOND, PlayScene.numEnemies, spawnZombie, this);
}

// CREA ZOMBI EN SPAWN ALEATORIO
function spawnZombie() {
	PlayScene.spawnPoint = PlayScene.spawnPoints[Math.floor(Math.random() * PlayScene.spawnPoints.length)];
	PlayScene.enemiesPool.spawn(PlayScene.spawnPoint.x, PlayScene.spawnPoint.y);
}

// BALA IMPACTA EN ZOMBI
function hit(enemy, bullet) {
	enemy.modifyHealth(-bullet.damage);
	if (enemy._currentHealth == 0) {
		PlayScene.enemiesKilled++;
		PlayScene.score += enemy._score;
	}
	bullet.kill();
	console.log(enemy._health);
}

module.exports = PlayScene;