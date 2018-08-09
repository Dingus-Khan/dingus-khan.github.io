var game = new Window(800, 600, 800, 600);

Keyboard.registerKey('space', 32);

class Projectiles {
	constructor(){
		this.projectiles = [];
		this.bodies = [];
	}

	fire(x, y, vel, range, tX, tY){
		this.projectiles.push({
			x: x, y: y, vel: vel, range: range, tX: tX, tY: tY,
			sprite: new Sprite("proj.png", 0, 0, 20, 20, tX, tY, 20, 20)
		});
	}

	draw(game){
		for (var proj = 0; proj < this.projectiles.length; proj++){
			projectiles[proj].x += projectiles[proj].vel;
			projectiles[proj].range -= projectiles[proj].vel;
			game.draw(projectiles[proj].sprite)
		}
	}
}

var projectiles = new Projectiles();

requestAnimationFrame(run);
function run(t) {

	if (Keyboard.wasKeyPressed("space"))
		console.log("shoot");

	Keyboard.update();
	game.clear();
	projectiles.draw(game);
	requestAnimationFrame(run);
}
