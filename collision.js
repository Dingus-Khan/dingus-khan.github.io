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

/*
if (rect1.x < rect2.x + rect2.width &&
   rect1.x + rect1.width > rect2.x &&
   rect1.y < rect2.y + rect2.height &&
   rect1.height + rect1.y > rect2.y) {
*/

function boxBox(box1, box2){
	var pen = {
	};

	return (box1.x < box2.x + box2.w
	&& box1.x + box1.w > box2.x
	&& box1.y < box2.y + box2.h
	&& box1.y + box1.h > box2.y);
}

var blocks = [];
blocks[0] = {x: 0, y: 0, w: 50, h: 50};
var colour = {
	r: 1.0,
	g: 1.0,
	b: 1.0
};

DebugGraphics.init();

function run() {
	if (Keyboard.getKey('up'))
		blocks[0].y -= 1;
	if (Keyboard.getKey('down'))
		blocks[0].y += 1;
	if (Keyboard.getKey('left'))
		blocks[0].x -= 1;
	if (Keyboard.getKey('right'))
		blocks[0].x += 1;

	DebugGraphics.clear();

	for(i = 0; i < blocks.length; i++){
		if (i > 0){
			if (boxBox(blocks[0], blocks[i])){
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
			DebugGraphics.drawRect(blocks[i].x, blocks[i].y, blocks[i].w, blocks[i].h, 1, 1, 1);
		}
	}

	gl.clear(gl.COLOR_BUFFER_BIT);
	DebugGraphics.draw();
	requestAnimationFrame(run);
}
