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

var squareTex = new Texture("square.png");
var squareSpr = new Sprite(200, 450, 100, 100, 0, 0, 100, 100, squareTex);

function run() {
	circleSpr.x = Mouse.x - (circleSpr.w / 2);
	circleSpr.y = Mouse.y - (circleSpr.h / 2);

	nearestY = Math.Max(squareSpr.y, Math.Min(circleSpr.y, squareSpr.y + squareSpr.h));
	nearestX = Math.Max(squareSpr.x, Math.Min(circleSpr.x, squareSpr.x + squareSpr.w));

	console.log(nearestX + " " + nearestY);

	gl.clear(gl.COLOR_BUFFER_BIT);
	squareSpr.draw();
	circleSpr.draw();
	requestAnimationFrame(run);
}
