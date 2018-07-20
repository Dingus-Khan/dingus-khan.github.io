

class Player extends Animation {
	constructor(tex){
		super(tex);
		// addAnimation(name, start, y, frameW, frameH, w, h, frames){
		// frame format {x, t}
		this.addAnimation("idle_down", 0, 0, 16, 32, 16, 32, [{x: 0, t: 9999}]);
		this.addAnimation("idle_right", 0, 1, 16, 32, 16, 32, [{x: 0, t: 9999}]);
		this.addAnimation("idle_up", 0, 2, 16, 32, 16, 32, [{x: 0, t: 9999}]);
		this.addAnimation("idle_left", 0, 3, 16, 32, 16, 32, [{x: 0, t: 9999}]);

		this.addAnimation("walk_down", 0, 0, 16, 32, 16, 32, [{x: 0, t: 10}, {x: 1, t: 10}, {x: 2, t: 10}, {x: 3, t: 10}]);
		this.addAnimation("walk_right", 0, 1, 16, 32, 16, 32, [{x: 0, t: 10}, {x: 1, t: 10}, {x: 2, t: 10}, {x: 3, t: 10}]);
		this.addAnimation("walk_up", 0, 2, 16, 32, 16, 32, [{x: 0, t: 10}, {x: 1, t: 10}, {x: 2, t: 10}, {x: 3, t: 10}]);
		this.addAnimation("walk_left", 0, 3, 16, 32, 16, 32, [{x: 0, t: 10}, {x: 1, t: 10}, {x: 2, t: 10}, {x: 3, t: 10}]);

		this.addAnimation("attack_down", 0, 4, 32, 32, 32, 32, [{x: 0, t: 4}, {x: 1, t: 4}, {x: 2, t: 4}, {x: 3, t: 8}]);
		this.addAnimation("attack_up", 0, 5, 32, 32, 32, 32, [{x: 0, t: 4}, {x: 1, t: 4}, {x: 2, t: 4}, {x: 3, t: 8}]);
		this.addAnimation("attack_right", 0, 6, 32, 32, 32, 32, [{x: 0, t: 4}, {x: 1, t: 4}, {x: 2, t: 4}, {x: 3, t: 8}]);
		this.addAnimation("attack_left", 0, 7, 32, 32, 32, 32, [{x: 0, t: 4}, {x: 1, t: 4}, {x: 2, t: 4}, {x: 3, t: 8}]);

		this.setAnimation("idle_down");

		this.vel = {x: 0, y: 0};
		this.state = "idle_";
		this.dir = "down";
	}

	update(){
		this.vel.x = -Keyboard.getKey('left') + Keyboard.getKey('right');
		this.vel.y = -Keyboard.getKey('up') + Keyboard.getKey('down');
		if (Keyboard.wasKeyPressed('space')){
			this.state = "attack_";
			Keyboard.keyPressed[Keyboard.keyMap["space"]] = false;
		}

		if (this.state == "attack_"){
			this.vel.x = 0;
			this.vel.y = 0;
		} else if (this.vel.x == 0 && this.vel.y == 0){
			this.state = "idle_";
		} else {
			this.state = "walk_";
			if (this.vel.x != 0 && this.vel.y == 0)
				this.dir = this.vel.x < 0 ? "left" : "right";
			else if (this.vel.x == 0 && this.vel.y != 0)
				this.dir = this.vel.y < 0 ? "up" : "down";
		}

		this.setAnimation(this.state + this.dir);
		this.transform.move(this.vel.x, this.vel.y);
	}

	draw(){
		if (super.draw()){
			this.state = "";
		}
	}
}

/////////////////////////////////////////////////

Keyboard.registerKey('up', 38);
Keyboard.registerKey('left', 37);
Keyboard.registerKey('down', 40);
Keyboard.registerKey('right', 39);
Keyboard.registerKey('space', 32);

var game = new Window(800, 600, 400, 300);

var sprite = new Player("character.png");

requestAnimationFrame(run);
function run(t) {
	sprite.update();

	game.clear();
	game.draw(sprite);
	requestAnimationFrame(run);
}
