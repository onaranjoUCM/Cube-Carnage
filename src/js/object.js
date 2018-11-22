function Item(graphic, position) {
    this._graphic = graphic;
    this._position = position;
}

function Barrel(graphic, position) {
    Item.apply(this, [graphic, position]);
}

Barrel.prototype.explode = function () { };

function AmmoCrate(graphic, position) {
    Item.apply(this, [graphic, position]);
}

AmmoCrate.prototype.incrementAmmo = function () { };

function Wall(graphic, position) {
    Item.apply(this, [graphic, position]);
}

function Spawn(graphic, position) {
    Item.apply(this, [graphic, position]);
}

Spawn.prototype.spawnZombie = function () { };