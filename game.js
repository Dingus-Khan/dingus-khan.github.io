var game = new Window(800, 600, 800, 600);

var bullet = new Sprite("proj.png", 0, 0, 20, 20, 0, 0, 20, 20, 1, 1, 1);
var bullet2 = new Sprite("proj.png", 0, 0, 40, 40, 0, 0, 20, 20, 1, 1, 1);
var bullet3 = new Sprite("proj.png", 0, 0, 60, 60, 0, 0, 20, 20, 1, 1, 1);

bullet.transform.move(-30, 0);
bullet3.transform.move(30, 0);

Keyboard.registerKey('space', 32);

requestAnimationFrame(run);
function run(t) {

	if (Keyboard.wasKeyPressed("space"))
		console.log("shoot");

	Keyboard.update();
	game.clear();
	game.draw(bullet);
	game.draw(bullet2);
	game.draw(bullet3);
	requestAnimationFrame(run);
}
