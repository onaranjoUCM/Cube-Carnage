function Character(graphic, position, speed, health) {
  this._graphic = graphic;
  this._position = position;
  this._speed = speed;
  this._health = health;
}

Character.prototype.move = function () { };
Character.prototype.loseHealth = function () { };
Character.prototype.die = function () { };

function Enemy(graphic, position, speed, health, score) {
  Character.apply(this, [graphic, position, speed, health]);
  this._score = score;
}

Enemy.prototype.attack = function () { };

function Player(position) {
  Character.apply(this, ['Player.png', position, 5, 100]);
  this.score = 0;
  this.rifleAmmo = 100;
  this.shotgunAmmo = 20;
  this.grenades = 5;
}

Player.prototype.shoot = function () { };
Player.prototype.switchWeapon = function () { };
Player.prototype.modifyHealth = function () { };