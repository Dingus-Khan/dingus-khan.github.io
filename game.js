var game = new Window(800, 600, 800, 600);

var bullet = new Sprite("proj.png", 0, 0, 20, 20, 0, 0, 20, 20, 1, 1, 1);
var bullet2 = new Sprite("proj.png", 0, 0, 40, 40, 0, 0, 20, 20, 1, 1, 1);
var bullet3 = new Sprite("proj.png", 0, 0, 60, 60, 0, 0, 20, 20, 1, 1, 1);

requestAnimationFrame(run);
function run(t) {
	game.clear();
	game.draw(bullet);
	requestAnimationFrame(run);
}
