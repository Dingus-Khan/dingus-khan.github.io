var game = new Window(800, 600, 800, 600);

Keyboard.registerKey('space', 32);

class Projectiles {
	constructor(){
		this.projectiles = [];
		this.bodies = [];
		this.tex = new Texture("proj.png", gl.REPEAT, gl.NEAREST);
	}

	fire(x, y, vel, range, tX, tY){
		this.projectiles.push({
			x: x, y: y, vel: vel, range: range, tX: tX, tY: tY,
			sprite: new Sprite("proj.png", 0, 0, 20, 20, tX, tY, 20, 20, 1, 1, 1)
		});

		this.projectiles[this.projectiles.length - 1].tex = this.tex;
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
		projectiles.fire(0, 0, 10, 100, 0, 0);

	Keyboard.update();
	game.clear();
	projectiles.draw(game);
	requestAnimationFrame(run);
}
