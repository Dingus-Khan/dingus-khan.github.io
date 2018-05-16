var vertexShader = `#version 300 es
in vec2 pos;
in vec2 tex;

out vec2 Tex;

uniform vec2 texSize;
uniform mat4 proj;
uniform mat4 model;

void main(){
    Tex = tex / texSize;
    gl_Position = proj * model * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;

in vec2 Tex;

out vec4 outColour;

uniform sampler2D texImage;

void main(){
    outColour = texture(texImage, Tex);
}`;

Keyboard.registerKey('left', 37);
Keyboard.registerKey('up', 38);
Keyboard.registerKey('right', 39);
Keyboard.registerKey('down', 40);
Keyboard.registerKey('space', 32);
Keyboard.registerKey('a', 65);
Keyboard.registerKey('d', 68);
Keyboard.registerKey('s', 83);
Keyboard.registerKey('w', 87);

var vertex = System.buildShader(gl, gl.VERTEX_SHADER, vertexShader);
var fragment = System.buildShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
var program = System.linkProgram(gl, vertex, fragment);

gl.useProgram(program);

var proj = [
    2 / 800, 0, 0, 0,
    0, -2 / 600, 0, 0,
    0, 0, 2 / 1200, 0,
    -1, 1, 0.5, 1
];

var projLoc = gl.getUniformLocation(program, "proj");
gl.uniformMatrix4fv(projLoc, false, proj);

requestAnimationFrame(run);

gl.clearColor(0.1, 0.1, 0.1, 1.0);

function checkCollision(a, b){
	var c1 = {r: a.w / 3, x: a.x + (a.w / 2) + a.vel.x, y: a.y + (a.h / 1.5) + a.vel.y};
	var c2 = {r: b.w / 3, x: b.x + (b.w / 2) + b.vel.x, y: b.y + (b.h / 1.5) + b.vel.y};
	var dx = c1.x - c2.x;
	var dy = c1.y - c2.y;
	var dist = Math.sqrt(dx * dx + dy * dy);
	if (dist < c1.r + c2.r){
		return true;
	} else {
		return false;
	}
}

var tileSet = new Texture("tileset.png");
TileBatch.init(tileSet);

var tile = {
	x: 0,
	y: 0,
	w: 100,
	h: 100
};

var sprite = new Sprite(0, 0, tile.w, tile.h, 0, 0, tile.w, tile.h, tileSet);
spriteList.sprites[0] = sprite;


function run() {
	sprite.w = tile.w;
	sprite.h = tile.h;
	sprite.updateBuffer = true;
	sprite.setPosition(Mouse.x - Mouse.x % 100, Mouse.y - Mouse.y % 100);

	if(Mouse.left){
		TileBatch.addTile(tile.x, tile.y, tile.w, tile.y, 0, 0, tile.w, tile.y);
		Mouse.left = false;
	}

    gl.clear(gl.COLOR_BUFFER_BIT);
	TileBatch.draw();
	spriteList.draw();
	requestAnimationFrame(run);
}
