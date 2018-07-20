class Player extends Animation{
	constructor(tex){
		super(tex);
		this.weapon = new Animation(tex);

		this.addAnimation("idle_right", 0, 0, 120, 120, 120, 120, [{x: 0, t: 5},{x: 120, t: 5},{x: 240, t: 5},{x: 360, t: 5},{x: 480, t: 5},{x: 600, t: 5}]);
		this.addAnimation("idle_left", 0, 0, -120, 120, 120, 120, [{x: 0, t: 5},{x: 120, t: 5},{x: 240, t: 5},{x: 360, t: 5},{x: 480, t: 5},{x: 600, t: 5}]);

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

var game = new Window(800, 600, 800, 600);

var sprite = new Player("test.png");

requestAnimationFrame(run);
function run(t) {
	if (Keyboard.getKey('left') && !Keyboard.getKey('right'))
		sprite.setAnimation("idle_left");
	if (Keyboard.getKey('right') && !Keyboard.getKey('left'))
		sprite.setAnimation("idle_right");

	game.clear();
	game.draw(sprite);
	requestAnimationFrame(run);
}
