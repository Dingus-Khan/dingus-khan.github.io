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
var squareSpr = new Sprite(300, 250, 100, 100, 0, 0, 100, 100, squareTex);

function run() {
	circleSpr.x = Mouse.x - (circleSpr.w / 2);
	circleSpr.y = Mouse.y - (circleSpr.h / 2);

	nearestY = Math.max(squareSpr.y, Math.min(circleSpr.y, squareSpr.y + squareSpr.h));
	nearestX = Math.max(squareSpr.x, Math.min(circleSpr.x, squareSpr.x + squareSpr.w));

	// circle point collision
	distX = nearestX - (circleSpr.x - circleSpr.w / 2);
	distY = nearestY - (circleSpr.y - circleSpr.h / 2);
	dist = Math.sqrt((distX * distX) + (distY * distY));
	if (dist < (circleSpr.w / 2))
		console.log("hit");

	gl.clear(gl.COLOR_BUFFER_BIT);
	squareSpr.draw();
	circleSpr.draw();
	requestAnimationFrame(run);
}
