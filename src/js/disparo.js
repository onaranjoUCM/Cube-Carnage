function Bullet(graphic, position, damage, speed) {
  this._graphic = graphic;
  this._damage = position;
  this._damage = damage;
  this._speed = speed;
}

Bullet.prototype.move = function () { };

function rifleBullet(graphic, position, damage, speed) {
  Bullet.apply(this, [graphic, position, damage, speed]);
}

function shotgunBullet(graphic, position, damage, speed) {
  Bullet.apply(this, [graphic, position, damage, speed]);
}

function grenadeBullet(graphic, position, damage, speed) {
  Bullet.apply(this, [graphic, position, damage, speed]);
}