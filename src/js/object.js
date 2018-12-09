MapObject = function MapObject(game, graphic, position, w, h) {
	Phaser.Sprite.call(this, game, position.x, position.y, graphic);

	this._graphic = graphic;
	this._position = position;
	this.width = w;
	this.height = h;
	
	this.anchor.setTo(0.5,0.5);
	
	this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);
	this.body.immovable = true;
}

MapObject.prototype = Object.create(Phaser.Sprite.prototype);
MapObject.prototype.constructor = MapObject;