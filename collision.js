Keyboard.registerKey('left', 37);
Keyboard.registerKey('up', 38);
Keyboard.registerKey('right', 39);
Keyboard.registerKey('down', 40);
Keyboard.registerKey('space', 32);
Keyboard.registerKey('a', 65);
Keyboard.registerKey('d', 68);
Keyboard.registerKey('s', 83);
Keyboard.registerKey('w', 87);

function circlePoint(circle, point){
	dX = point.x - circle.x;
	dY = point.y - circle.y;
	return ((dX * dX) + (dY * dY) < (circle.r * circle.r));
}

function circleCircle(circle1, circle2){
	dX = circle2.x - circle1.x;
	dY = circle2.y - circle1.y;
	r = circle1.r + circle2.r;
	return ((dX * dX) + (dY * dY) < (r * r));
}

DebugGraphics.init();

var player = {
	x: 0,
	y: 0,
	w: 50,
	h: 50,
	hitCircle: {
		x: 40,
		y: 25,
		r: 25
	},
	hurtCircle: {
		x: 25,
		y: 25,
		r: 50
	},
	dmg: 1,
};

var block = {
	x: 200,
	y: 200,
	w: 100,
	h: 100,
	colour: {r: 0.0, g: 1.0, b: 0.0},
	hurtCircle: {
		x: 50,
		y: 50,
		r: 50
	},
	hp: 200,
};

var bullets = {
	projectiles: [],
	update: function(){
		for(i = 0; i < this.projectiles.length; i++){
			this.projectiles[i].x += this.projectiles[i].spd;
			if (circlePoint({x: block.x + block.hurtCircle.x, y: block.y + block.hurtCircle.y, r: block.hurtCircle.r}, {x: this.projectiles[i].x + 5, y: this.projectiles[i].y + 5})){
				block.colour.g = 0.0;
				block.colour.r = 1.0;
				block.hp -= this.projectiles[i].dmg;
				this.projectiles.splice(i, 1);
			} else if (this.projectiles[i].x - this.projectiles[i].oX > this.projectiles[i].range){
				this.projectiles.splice(i, 1);
			}
		}
	},
	fire: function(x, y, spd, dmg, range){
		this.projectiles.push({ x: x, y: y, spd: spd, dmg: dmg, range: range, oX: x, oY: y });
	},
};

var spd = 2;
var vel = {x: 0, y: 0}

requestAnimationFrame(run);
function run() {
	DebugGraphics.clear();
	vel.x = -(Keyboard.getKey('left') * spd) + (Keyboard.getKey('right') * spd);
	vel.y = -(Keyboard.getKey('up') * spd) + (Keyboard.getKey('down') * spd);

	player.x += vel.x;
	player.y += vel.y;

	block.colour.g = 1.0;
	block.colour.r = 0.0;

	if (block.hp <= 0){
		block.w = 0;
		block.h = 0;
	}

	if (Keyboard.wasKeyPressed('space')){
		if (circleCircle({x: player.x + player.hitCircle.x, y: player.y + player.hitCircle.y, r: player.hitCircle.r}, {x: block.x + block.hurtCircle.x, y: block.y + block.hurtCircle.y, r: block.hurtCircle.r })){
			block.colour.g = 0.0;
			block.colour.r = 1.0;
			block.hp -= 1;
		}

		bullets.fire(player.x, player.y, 2, 10, 200);
	}

	bullets.update();

	DebugGraphics.drawRect(block.x, block.y, block.w, block.h, block.colour.r, block.colour.g, block.colour.b);
	DebugGraphics.drawRect(player.x, player.y, player.w, player.h, 1.0, 1.0, 1.0);

	for(i = 0; i < bullets.projectiles.length; i++){
		DebugGraphics.drawRect(
			bullets.projectiles[i].x,
			bullets.projectiles[i].y,
			10,
			10,
			0.0,
			0.0,
			1.0
		);
	}

	Keyboard.update();
	gl.clear(gl.COLOR_BUFFER_BIT);
	DebugGraphics.draw();
	requestAnimationFrame(run);
}
