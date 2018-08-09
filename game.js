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
			sprite: new Sprite("proj.png", 0, 0, 20, 20, tX, tY, 20, 20, 1, 1, 1)
		});
	}

	draw(game){
		for (var proj = 0; proj < this.projectiles.length; proj++){
			this.projectiles[proj].x += this.projectiles[proj].vel;
			this.projectiles[proj].range -= this.projectiles[proj].vel;
			this.projectiles[proj].sprite.transform.move(this.projectiles[proj].vel, 0);
			if (this.projectiles[proj].range <= 0) this.projectiles[proj].vel = 0;
			game.draw(this.projectiles[proj].sprite)
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
