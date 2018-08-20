var game = new Window(800, 600, 800, 600);

var sprite = new Sprite("circle.png", 0, 0, 100, 100, 0, 0, 100, 100, 1, 1, 1);

sprite.transform.x = 100;

requestAnimationFrame(run);
function run(t) {
	Keyboard.update();
	game.clear();
	game.draw(sprite);
	requestAnimationFrame(run);
}
