'use strict';
var CharacterScript = require('./character.js');
var PlayerScript = require('./player.js');
var EnemyScript = require('./enemy.js');
var SpawnerScript = require('./pool.js');

var PlayScene = {
	create: function () {
		this.level = 1;
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

		this.game.time.events.repeat(Phaser.Timer.SECOND * 2, 10, this.spawnZombie, this);
	},

	update: function () {

	}, 

	spawnZombie: function() {
		this.spawnPoint = this.spawnPoints[Math.floor(Math.random() * this.spawnPoints.length)];
		this.enemiesPool.spawn(this.spawnPoint.x, this.spawnPoint.y);
	}
};

module.exports = PlayScene;