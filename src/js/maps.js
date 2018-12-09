Maps = {};

// MAP 1
Maps.map1 = function (game) {
	this.spawnPoints = [
		{x: game.world.width / 2, y: 0, angle: 180},
		{x: game.world.width / 2, y: game.world.height - 0, angle: 0},
		{x: 0, y: game.world.height / 2, angle: 90},
		{x: game.world.width - 0, y: game.world.height / 2, angle: 270},
	];

	this.walls = [];
	this.walls.push(new MapObject(game, 'wall', {x: 180, y: 10}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 620, y: 10}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 180, y: 590}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 620, y: 590}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 10, y: 130}, 20, 260));
	this.walls.push(new MapObject(game, 'wall', {x: 10, y: 470}, 20, 260));
	this.walls.push(new MapObject(game, 'wall', {x: 790, y: 130}, 20, 260));
	this.walls.push(new MapObject(game, 'wall', {x: 790, y: 470}, 20, 260));

	this.walls.push(new MapObject(game, 'wall', {x: 400, y: 150}, 400, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 400, y: 450}, 400, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 130, y: 300}, 20, 160));
	this.walls.push(new MapObject(game, 'wall', {x: 650, y: 300}, 20, 160));

	return this;
};

Maps.map1.prototype = Object.create(Phaser.Group.prototype);
Maps.map1.prototype.constructor = Maps.map1;

// MAP 2
Maps.map2 = function (game) {
	this.spawnPoints = [
		{x: game.world.width / 2, y: 0, angle: 180},
		{x: game.world.width / 2, y: game.world.height - 0, angle: 0},
		{x: 0, y: game.world.height / 2, angle: 90},
		{x: game.world.width - 0, y: game.world.height / 2, angle: 270},
	];

	this.walls = [];
	this.walls.push(new MapObject(game, 'wall', {x: 180, y: 10}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 620, y: 10}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 180, y: 590}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 620, y: 590}, 360, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 10, y: 130}, 20, 260));
	this.walls.push(new MapObject(game, 'wall', {x: 10, y: 470}, 20, 260));
	this.walls.push(new MapObject(game, 'wall', {x: 790, y: 130}, 20, 260));
	this.walls.push(new MapObject(game, 'wall', {x: 790, y: 470}, 20, 260));

	return this;
};

Maps.map2.prototype = Object.create(Phaser.Group.prototype);
Maps.map2.prototype.constructor = Maps.map2;

// MAP 3
Maps.map3 = function (game) {
	this.spawnPoints = [
		{x: game.world.width / 2, y: 0, angle: 180},
		{x: game.world.width / 2, y: game.world.height - 0, angle: 0},
		{x: 0, y: game.world.height / 2, angle: 90},
		{x: game.world.width - 0, y: game.world.height / 2, angle: 270},
	];

	this.walls = [];
	this.walls.push(new MapObject(game, 'wall', {x: 400, y: 150}, 400, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 400, y: 450}, 400, 20));
	this.walls.push(new MapObject(game, 'wall', {x: 130, y: 300}, 20, 160));
	this.walls.push(new MapObject(game, 'wall', {x: 650, y: 300}, 20, 160));

	return this;
};

Maps.map3.prototype = Object.create(Phaser.Group.prototype);
Maps.map3.prototype.constructor = Maps.map3;