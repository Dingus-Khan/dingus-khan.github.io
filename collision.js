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

function pointBox(point, box){
	return (point.x > box.x && point.x < box.x + box.w
	&& point.y > box.y && point.y < box.y + box.h);
}

var blocks = [];
var colour = {
	r: 1.0,
	g: 1.0,
	b: 1.0
};

DebugGraphics.init();

function run() {
	DebugGraphics.clear();

	for(i = 0; i < blocks.length; i++){
		if (pointBox({x: Mouse.x, y: Mouse.y}, blocks[i])){
			colour.r = 1.0;
			colour.g = 0.0;
			colour.b = 0.0;
		} else {
			colour.r = 0.0;
			colour.g = 1.0;
			colour.b = 0.0;
		}

		DebugGraphics.drawRect(blocks[i].x, blocks[i].y, blocks[i].w, blocks[i].h, colour.r, colour.g, colour.b);
	}

	gl.clear(gl.COLOR_BUFFER_BIT);
	DebugGraphics.draw();
	requestAnimationFrame(run);
}
