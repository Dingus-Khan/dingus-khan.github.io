var game = new Window(800, 600, 800, 600);

var sprite = new Sprite("tileset.png", 0, 0, 120, 120, 0, 0, 120, 120, 1, 1, 1);

requestAnimationFrame(run);
function run(t) {
	game.clear();
	game.draw(sprite);
	requestAnimationFrame(run);
}
