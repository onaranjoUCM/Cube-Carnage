Pool = function (game, entities) {
	this._group = game.add.physicsGroup(Phaser.Physics.ARCADE);
	this._group.addMultiple(entities);
	this._group.callAll('kill');
}

Pool.prototype.spawn = function (x, y) {
	var entity = this._group.getFirstExists(false);
	if (entity) {
		entity.reset(x, y);
		entity._currentHealth = entity._health;
		entity.scale.setTo(0.12, 0.12);
	}
	return entity;
}