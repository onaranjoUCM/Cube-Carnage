Pool = function (game, entities) {
	this._group = game.add.group();
	this._group.addMultiple(entities);
	this._group.callAll('kill');
}

Pool.prototype.spawn = function (x, y) {
	var entity = this._group.getFirstExists(false);
	if (entity) {
		entity.reset(x, y);
		entity.scale.setTo(0.18, 0.18);
	}
	return entity;
}