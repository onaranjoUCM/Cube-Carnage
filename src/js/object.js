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

// Medikit
Medikit = function Medikit(game, position, player) {
	MapObject.apply(this, [game, 'medikit', position, 20, 20]);
	
	this.player = player;
}

Medikit.prototype = Object.create(MapObject.prototype);
Medikit.prototype.constructor = MapObject;

Medikit.prototype.update = function() {
	this.game.physics.arcade.overlap(this.player, this, this.restoreHealth, null, this);
}

Medikit.prototype.restoreHealth = function() {
	this.player.modifyHealth(20);
	this.destroy();
}

// AmmoCrate
AmmoCrate = function AmmoCrate(game, position, player) {
	MapObject.apply(this, [game, 'ammocrate', position, 20, 20]);
	
	this.player = player;
}

AmmoCrate.prototype = Object.create(MapObject.prototype);
AmmoCrate.prototype.constructor = MapObject;

AmmoCrate.prototype.update = function() {
	this.game.physics.arcade.overlap(this.player, this, this.restoreAmmo, null, this);
}

AmmoCrate.prototype.restoreAmmo = function() {
	this.player.restoreAmmo(25, 5);
	this.destroy();
}