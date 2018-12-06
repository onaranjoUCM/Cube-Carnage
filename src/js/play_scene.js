'use strict';
var CharacterScript = require('./character.js');
var PlayerScript = require('./player.js');
var EnemyScript = require('./enemy.js');

var PlayScene = {
	create: function () {
		this.enemies = this.game.add.group();

		this.player = new Player(this.game, {x: 50, y: 50});
		this.zombie = new Zombie(this.game, {x: this.game.world.width / 2, y:this.game.world.height / 2});
		this.enemies.add(this.zombie);

		this.game.add.existing(this.zombie);
		this.game.add.existing(this.player);
	},

	update: function () {
		this.player.update();
		this.zombie.update(this.player);
		if (this.game.physics.arcade.collide(this.zombie, this.game.pistolBullets, this))
		{
			console.log('boom');
		}
	}
};

module.exports = PlayScene;
