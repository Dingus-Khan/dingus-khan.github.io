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
		r: 25
	},
};

var block = {
	x: 200,
	y: 200,
	w: 100,
	h: 100,
	colour: {r: 0.0, g: 1.0, b: 0.0}
};

requestAnimationFrame(run);
function run() {
	DebugGraphics.clear();
	DebugGraphics.drawRect(block.x, block.y, block.w, block.h, block.colour.r, block.colour.g, block.colour.b);
	DebugGraphics.drawRect(player.x, player.y, player.w, player.h, 1.0, 1.0, 1.0);

	gl.clear(gl.COLOR_BUFFER_BIT);
	DebugGraphics.draw();
	requestAnimationFrame(run);
}
