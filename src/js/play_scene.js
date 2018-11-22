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
		this.zombie = new Zombie(this.game, {x: 300, y: 100});
		this.zombie.scale.setTo(0.2, 0.2);
		this.game.add.existing(this.player);
		this.game.add.existing(this.zombie);

		this.player.frame = 0;
		this.player.anchor.setTo(0.5,0.5);
		this.player.animations.add('walk', [1, 2], 3, true);

		this.zombie.frame = 0;
		this.zombie.anchor.setTo(0.5,0.5);
		this.zombie.animations.add('walk', [1, 2], 1, true);
		
		this.game.physics.arcade.enable([ this.player, this.zombie ], Phaser.Physics.ARCADE);
	},

	update: function () {
		this.zombie.move(this.player);
		this.player.move();
		this.game.physics.arcade.overlap(this.player, this.zombie, this.zombie.attack(), null, this);
		this.keys.shoot.onDown.add(playFx, this);
		//if (Phaser.Rectangle.intersects(this.player.getBounds(), this.zombie.getBounds())
			//if (this.zombie._canAttack) {
				//this.zombie._canAttack = false;
				//this.zombie.attack();
				//setTimeout(function(){ zombie._canAttack = true; }, 2000);
			//}
		//}
	}
};

function playFx(key) {
	switch (key.keyCode)
	{
		case Phaser.Keyboard.SPACEBAR:
			this.player.shoot();
			break;
	}
}

module.exports = PlayScene;
