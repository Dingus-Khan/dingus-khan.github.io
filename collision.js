Keyboard.registerKey('left', 37);
Keyboard.registerKey('up', 38);
Keyboard.registerKey('right', 39);
Keyboard.registerKey('down', 40);
Keyboard.registerKey('space', 32);
Keyboard.registerKey('a', 65);
Keyboard.registerKey('d', 68);
Keyboard.registerKey('s', 83);
Keyboard.registerKey('w', 87);

requestAnimationFrame(run);

var DebugGraphics = {
	texture: {},
	shapes: [],
	init: function(){
		this.texture = new Texture("debug.png");
	},
	drawRect: function(x, y, w, h, r, g, b){
		this.shapes.push(new Sprite(x, y, w, h, 0, 0, 1, 1, this.texture, r, g, b));
	},
	draw: function(){
		for(i = 0; i < this.shapes.length; i++){
			this.shapes[i].draw();
		}
	},
	clear: function(){
		this.shapes = [];
	},
};

var blocks = [];

blocks.push({x: 10, y: 10, w: 50, h: 10});
blocks.push({x: 0, y: 0, w: 800, h: 10});
blocks.push({x: 0, y: 0, w: 10, h: 600});
blocks.push({x: 0, y: 590, w: 800, h: 10});
blocks.push({x: 790, y: 0, w: 10, h: 600});
blocks.push({x: 60, y: 0, w: 10, h: 540});
blocks.push({x: 60, y: 540, w: 400, h: 10});
blocks.push({x: 140, y: 340, w: 20, h: 200});
blocks.push({x: 600, y: 340, w: 200, h: 20});
blocks.push({x: 600, y: 340, w: 20, h: 220});

var colour = {
	r: 1.0,
	g: 1.0,
	b: 1.0
};

DebugGraphics.init();

vel = {x: 0, y: 0};

var spd = 2;

function run() {
	vel.x = (Keyboard.getKey('right') + -Keyboard.getKey('left')) * spd;
	vel.y = (Keyboard.getKey('down') + -Keyboard.getKey('up')) * spd;

	console.log(Physics.getDirection(vel));

	DebugGraphics.clear();

	for(i = blocks.length - 1; i > -1; i--){
		if (i > 0){
			var newVel = Physics.boxBox(blocks[0], blocks[i], vel);
			if (newVel.x != vel.x && newVel.y != vel.y){
				colour.r = 1.0;
				colour.g = 0.0;
				colour.b = 0.0;

			} else {
				colour.r = 0.0;
				colour.g = 1.0;
				colour.b = 0.0;
			}
			DebugGraphics.drawRect(blocks[i].x, blocks[i].y, blocks[i].w, blocks[i].h, colour.r, colour.g, colour.b);
		} else {
			blocks[0].x += vel.x;
			blocks[0].y += vel.y;
			DebugGraphics.drawRect(blocks[i].x, blocks[i].y, blocks[i].w, blocks[i].h, 1, 1, 1);
		}
	}

	gl.clear(gl.COLOR_BUFFER_BIT);
	DebugGraphics.draw();
	requestAnimationFrame(run);
}
