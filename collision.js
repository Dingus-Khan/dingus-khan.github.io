Keyboard.registerKey('left', 37);
Keyboard.registerKey('up', 38);
Keyboard.registerKey('right', 39);
Keyboard.registerKey('down', 40);
Keyboard.registerKey('space', 32);
Keyboard.registerKey('a', 65);
Keyboard.registerKey('d', 68);
Keyboard.registerKey('s', 83);
Keyboard.registerKey('w', 87);

requestAnimationFrame(run);

var circleTex = new Texture("circle.png");
var circleSpr = new Sprite(0, 0, 100, 100, 0, 0, 100, 100, circleTex);

function run() {
	circleSpr.x = Mouse.x - (circleSpr.w / 2);
	circleSpr.y = Mouse.y - (circleSpr.h / 2);

	gl.clear(gl.COLOR_BUFFER_BIT);
	circleSpr.draw();
	requestAnimationFrame(run);
}
