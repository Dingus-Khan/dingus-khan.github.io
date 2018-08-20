var game = new Window(800, 600, 800, 600);
var sprite = new Sprite("circle.png", 0, 0, 100, 100, 0, 0, 100, 100, 1, 1, 1);

var nodes = [75, 125, -164, 150, -213, -184, 112, -261];
var targetX = nodes.shift();
var targetY = nodes.shift();
nodes.push(targetX, targetY);
var spd = 2;

requestAnimationFrame(run);
function run(t) {
	if (targetX != undefined && targetY != undefined){
		if (sprite.transform.x != targetX || sprite.transform.y != targetY){
			var diffX = sprite.transform.x - targetX;
			var diffY = sprite.transform.y - targetY;
			diffX = diffX > 0 ? -Math.min(diffX, spd) : -Math.max(diffX, -spd);
			diffY = diffY > 0 ? -Math.min(diffY, spd) : -Math.max(diffY, -spd);
			sprite.transform.move(diffX, diffY);

			console.log(diffX + ", " + diffY + "; " + targetX + ", " + targetY + "; " + sprite.transform.x + ", " + sprite.transform.y);
		} else {
			targetX = nodes.shift();
			targetY = nodes.shift();
			nodes.push(targetX, targetY);
		}
	}

	Keyboard.update();
	game.clear();
	game.draw(sprite);
	requestAnimationFrame(run);
}
