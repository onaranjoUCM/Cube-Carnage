Maps = function(game) { 
	this.map1 = function (game) {
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

	this.map2 = function (game) {
		this.spawnPoints = [
			{x: 20, y: 50, angle: 90},
			{x: game.world.width - 20, y: 50, angle: -90},
			{x: 20, y: game.world.height - 50, angle: 90},
			{x: game.world.width - 20, y: game.world.height - 50, angle: -90}
		];

		this.walls = [];
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width / 2, y: 10}, game.world.width, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width / 2, y: game.world.height - 10}, game.world.width, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 10, y: game.world.height / 2}, 20, game.world.height - 160));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 10, y: game.world.height / 2}, 20, game.world.height - 160));

		this.walls.push(new MapObject(game, 'wall', {x: 230, y: 90}, 260, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 230, y: game.world.height - 90}, 260, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 230, y: 90}, 260, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 230, y: game.world.height - 90}, 260, 20));

		this.walls.push(new MapObject(game, 'wall', {x: 230, y: 260}, 260, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 230, y: game.world.height - 260}, 260, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 230, y: 260}, 260, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 230, y: game.world.height - 260}, 260, 20));

		this.walls.push(new MapObject(game, 'wall', {x: 110, y: 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: 110, y: game.world.height - 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: 350, y: 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: 350, y: game.world.height - 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 350, y: 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 350, y: game.world.height - 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 110, y: 175}, 20, 80));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 110, y: game.world.height - 175}, 20, 80));

		this.walls.push(new MapObject(game, 'wall', {x: 230, y: 175}, 120, 60));
		this.walls.push(new MapObject(game, 'wall', {x: 230, y: game.world.height - 175}, 120, 60));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 230, y: 175}, 120, 60));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 230, y: game.world.height - 175}, 120, 60));

		return this;
	};

	this.map3 = function (game) {
		this.spawnPoints = [
			{x: game.world.width / 2, y: 0, angle: 180},
			{x: game.world.width / 2, y: game.world.height - 0, angle: 0},
			{x: 0, y: game.world.height / 2, angle: 90},
			{x: game.world.width - 0, y: game.world.height / 2, angle: 270},
			{x: 20, y: 50, angle: 90},
			{x: game.world.width - 20, y: 50, angle: -90},
			{x: 20, y: game.world.height - 50, angle: 90},
			{x: game.world.width - 20, y: game.world.height - 50, angle: -90}
		];

		this.walls = [];
		this.walls.push(new MapObject(game, 'wall', {x: 180, y: 10}, 360, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 180, y: 10}, 360, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 180, y: game.world.height - 10}, 360, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 180, y: game.world.height - 10}, 360, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 10, y: 160}, 20, 200));
		this.walls.push(new MapObject(game, 'wall', {x: 10, y: game.world.height - 160}, 20, 200));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 10, y: 160}, 20, 200));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 10, y: game.world.height - 160}, 20, 200));

		this.walls.push(new MapObject(game, 'wall', {x: 310, y: 120}, 100, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 170, y: 120}, 80, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 310, y: 120}, 100, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width -170, y: 120}, 80, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 310, y: game.world.height - 120}, 100, 20));
		this.walls.push(new MapObject(game, 'wall', {x: 170, y: game.world.height - 120}, 80, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 310, y: game.world.height - 120}, 100, 20));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width -170, y: game.world.height - 120}, 80, 20));

		this.walls.push(new MapObject(game, 'wall', {x: 120, y: 185}, 20, 150));
		this.walls.push(new MapObject(game, 'wall', {x: 120, y: game.world.height - 185}, 20, 150));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 120, y: 185}, 20, 150));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 120, y: game.world.height - 185}, 20, 150));

		this.walls.push(new MapObject(game, 'wall', {x: 200, y: 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: 200, y: game.world.height - 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 200, y: 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 200, y: game.world.height - 210}, 20, 100));

		this.walls.push(new MapObject(game, 'wall', {x: 270, y: 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: 270, y: game.world.height - 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 270, y: 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 270, y: game.world.height - 210}, 20, 100));

		this.walls.push(new MapObject(game, 'wall', {x: 350, y: 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: 350, y: game.world.height - 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 350, y: 210}, 20, 100));
		this.walls.push(new MapObject(game, 'wall', {x: game.world.width - 350, y: game.world.height - 210}, 20, 100));

		return this;
	};
};