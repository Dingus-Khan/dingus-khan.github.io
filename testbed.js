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
	h: 100,
	tx: 0,
	ty: 0,
	tw: 100,
	th: 100
};

var sprite = new Sprite(0, 0, tile.w, tile.h, 0, 0, tile.w, tile.h, tileSet);
spriteList.sprites[0] = sprite;

var gridFactorX = 1;
var gridFactorY = 1;

var showOverlay = false;

var selectionTex = new Texture("selection.png");
var tileSetOverlay = new Sprite(0, 0, tileSet.image.width, tileSet.image.height, 0, 0, tileSet.image.width, tileSet.iamge.height, tileSet);
var selectionSprite = new Sprite(tile.tx, tile.ty, tile.tw, tile.th, tile.tx, tile.ty, tile.tw, tile.th, tileSet);

function run() {
	gl.clear(gl.COLOR_BUFFER_BIT);

	if (!showOverlay){
		tile.x = Mouse.x - Mouse.x % gridFactorX;
		tile.y = Mouse.y - Mouse.y % gridFactorY;
		sprite.w = tile.w;
		sprite.h = tile.h;
		sprite.tex.x = tile.tx;
		sprite.tex.y = tile.ty;
		sprite.tex.w = tile.tw;
		sprite.tex.h = tile.th;
		sprite.updateBuffer = true;
		sprite.setPosition(tile.x, tile.y);

		if(Mouse.left){
			TileBatch.addTile(tile.x, tile.y, tile.w, tile.h, tile.tx, tile.ty, tile.tw, tile.th);
			Mouse.left = false;
		}

		TileBatch.draw();
		spriteList.draw();
	} else {
		tile.x = Mouse.x - Mouse.x % tile.tw;
		tile.y = Mouse.y - Mouse.y % tile.th;
	}
	requestAnimationFrame(run);
}
