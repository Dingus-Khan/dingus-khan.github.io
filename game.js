var game = new Window(800, 600, 800, 600);
var sprite = new Sprite("circle.png", 0, 0, 100, 100, 0, 0, 100, 100, 1, 1, 1);

var nodes = [0, 0, 100, 100, 200, 500, -40, -300, 200, -600, 50, 120, 200, -120];
var targetX = nodes.shift();
var targetY = nodes.shift();

requestAnimationFrame(run);
function run(t) {
	if (sprite.transform.x != targetX || sprite.transform.y != targetY){
		var diffX = sprite.transform.x - targetX;
		var diffY = sprite.transform.y - targetY;
		if (diffX > 0) diffX = Math.min(diffX, 5); else diffX = Math.max(diffX, -5);
		if (diffY > 0) diffY = Math.min(diffY, 5); else diffY = Math.max(diffY, -5);
		sprite.transform.move(diffX, diffY);
	} else {
		targetX = nodes.shift();
		targetY = nodes.shift();
	}

	Keyboard.update();
	game.clear();
	game.draw(sprite);
	requestAnimationFrame(run);
}
