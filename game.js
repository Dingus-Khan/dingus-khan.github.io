class Player extends Animation{
	constructor(tex){
		super(tex);
		this.weapon = new Animation(tex);

		this.addAnimation("idle_right", 0, 0, 100, 100, 100, 100, [{x: 0, t: 10},{x: 100, t: 10},{x: 200, t: 10},{x: 300, t: 10},{x: 400, t: 10},{x: 500, t: 10}]);
		this.addAnimation("idle_left", 0, 0, 100, 100, 100, 100, [{x: 0, t: 10},{x: 100, t: 10},{x: 200, t: 10},{x: 300, t: 10},{x: 400, t: 10},{x: 500, t: 10}]);

		this.setAnimation("idle_right");
	}

	draw(){
		super.draw();
	}
}

Keyboard.registerKey('up', 38);
Keyboard.registerKey('left', 37);
Keyboard.registerKey('down', 40);
Keyboard.registerKey('right', 39);
Keyboard.registerKey('space', 32);

var game = new Window(800, 600, 400, 300);

var sprite = new Player("test.png");

requestAnimationFrame(run);
function run(t) {
	game.clear();
	game.draw(sprite);
	requestAnimationFrame(run);
}
