'use strict';

var PlayScene = {
	create: function () {
		var CharacterScript = require('./character.js');
		var player;
		var zombie;
		var keys;
		this.keyboard = this.game.input.keyboard;
		this.keys = this.keyboard.addKeys({ shoot: Phaser.Keyboard.SPACEBAR, switchLeft: Phaser.Keyboard.TWO, switchRight: Phaser.Keyboard.THREE });

		this.player = new Player(this.game, {x: 50, y: 50});
		this.player.scale.setTo(0.25,0.25);
		this.zombie = new Zombie(this.game, {x: this.game.world.width / 2, y:this.game.world.height / 2});
		this.zombie.scale.setTo(0.2, 0.2);
		this.game.add.existing(this.zombie);
		this.game.add.existing(this.player);

		this.player.frame = 0;
		this.player.anchor.setTo(0.5,0.5);
		this.player.animations.add('walk', [1, 2], 1, true);

		this.zombie.frame = 0;
		this.zombie.anchor.setTo(0.5,0.5);
		this.zombie.animations.add('walk', [1, 2], 1, true);
		
		this.game.physics.arcade.enable([ this.player, this.zombie ], Phaser.Physics.ARCADE);
		this.player.body.collideWorldBounds = true;
		this.player.body.immovable = true;
		this.zombie.body.collideWorldBounds = true;
	},

	update: function () {
		if (this.zombie != null) {this.zombie.move(this.player);}
		this.player.move();
		this.game.physics.arcade.overlap(this.player, this.zombie, zombieAttack, null, this);
		this.game.physics.arcade.collide(this.player, this.zombie);
		this.keys.shoot.onDown.add(keyPressed, this);
	}
};

function keyPressed(key) {
	switch (key.keyCode)
	{
		case Phaser.Keyboard.SPACEBAR:
			this.player.shoot();
			this.zombie.kill();
			this.zombie.reset(this.game.world.width / 2, this.game.world.height / 2);
			break;
	}
}

function zombieAttack() { this.zombie.attack(); }

module.exports = PlayScene;
