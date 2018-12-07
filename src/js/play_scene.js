'use strict';
var CharacterScript = require('./character.js');
var PlayerScript = require('./player.js');
var EnemyScript = require('./enemy.js');
var SpawnerScript = require('./pool.js');

var PlayScene = {
	create: function () {
		this.level = 10;
		this.score = 0;
		this.enemies = [];
		this.spawnPoints = [
			{x: this.game.world.width / 2, y: 0, angle: 180},
			{x: this.game.world.width / 2, y: this.game.world.height - 0, angle: 0},
			{x: 0, y: this.game.world.height / 2, angle: 90},
			{x: this.game.world.width - 0, y: this.game.world.height / 2, angle: 270},
		];

		this.player = new Player(this.game, {x: this.game.world.width / 2, y: this.game.world.height / 2});
		this.game.add.existing(this.player);

		for(var i = 0; i < this.level * 10; i++) {
			this.enemies.push(new Zombie(this.game, this.player, {x: 0, y: 0}));
		}
		this.enemiesPool = new Pool(this.game, this.enemies);

		this.game.time.events.repeat(Phaser.Timer.SECOND, this.level * 10, this.spawnZombie, this);
	},

	update: function () {
		this.game.physics.arcade.collide(this.enemies, this.enemies);
		this.game.physics.arcade.collide(this.enemies, this.player.weapons[this.player.currentWeapon].hash, this.hit);
	}, 

	spawnZombie: function() {
		this.spawnPoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
		this.enemiesPool.spawn(this.spawnPoint.x, this.spawnPoint.y);
	}, 

	hit: function(enemy, bullet) {
		enemy.modifyHealth(-bullet.damage);
		bullet.kill();
	},

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

module.exports = PlayScene;