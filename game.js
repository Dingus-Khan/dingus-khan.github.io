class Player extends Animation{
	constructor(sprite, weapons){
		super(sprite);
		this.addAnimation("idle_right", 0, 0, 120, 120, 120, 120, [{x: 0, t: 5},{x: 120, t: 5},{x: 240, t: 5},{x: 360, t: 5},{x: 480, t: 5},{x: 600, t: 5}]);
		this.addAnimation("idle_left", 0, 0, -120, 120, 120, 120, [{x: 0, t: 5},{x: 120, t: 5},{x: 240, t: 5},{x: 360, t: 5},{x: 480, t: 5},{x: 600, t: 5}]);
		this.addAnimation("walk_right", 0, 1, 120, 120, 120, 120, [{x: 0, t: 5},{x: 120, t: 5},{x: 240, t: 5},{x: 360, t: 5},{x: 480, t: 5},{x: 600, t: 5}]);
		this.addAnimation("walk_left", 0, 1, -120, 120, 120, 120, [{x: 0, t: 5},{x: 120, t: 5},{x: 240, t: 5},{x: 360, t: 5},{x: 480, t: 5},{x: 600, t: 5}]);
		this.addAnimation("attackIdle_right", 0, 4, 120, 120, 120, 120, [{x: 0, t: 5},{x: 120, t: 5},{x: 240, t: 5},{x: 360, t: 5},{x: 480, t: 5},{x: 600, t: 5}]);
		this.addAnimation("attackIdle_left", 0, 4, -120, 120, 120, 120, [{x: 0, t: 5},{x: 120, t: 5},{x: 240, t: 5},{x: 360, t: 5},{x: 480, t: 5},{x: 600, t: 5}]);
		this.setAnimation("attackIdle_right");

		this.weapon = new Weapon(weapons);
	}

	draw(camera){
		super.draw(camera);
		this.weapon.draw(camera);
	}
}

class Weapon extends Animation{
	constructor(tex){
		super(tex);
		this.addAnimation("gunIdle_right", 0, 16, 60, 60, 60, 60, [{x: 0, t: 5}, {x: 60, t: 5}]);
		this.addAnimation("gunShoot_right", 0, 17, 60, 60, 60, 60, [{x: 0, t: 50}]);
		this.setAnimation("gunIdle_right");
	}
}

Keyboard.registerKey('up', 38);
Keyboard.registerKey('left', 37);
Keyboard.registerKey('down', 40);
Keyboard.registerKey('right', 39);
Keyboard.registerKey('space', 32);

var game = new Window(800, 600, 800, 600);

var sprite = new Player("test.png", "test.png");

requestAnimationFrame(run);
function run(t) {
	game.clear();
	game.draw(sprite);
	requestAnimationFrame(run);
}
