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

var entTexture = new Texture("test.png");

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

var sprite = new Sprite(300, 200, 120, 120, 0, 0, 120, 120, entTexture);
var sprite2 = new Sprite(0, 0, 60, 60, 0, 0, 120, 120, entTexture);

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

spriteList.sprites[0] = sprite;
spriteList.sprites[1] = sprite2;

function run() {
	sprite.setVelocity((-Keyboard.getKey('left') || false) + (Keyboard.getKey('right') || false), (-Keyboard.getKey('up') || false) + (Keyboard.getKey('down') || false));
	sprite2.setVelocity((-Keyboard.getKey('a') || false) + (Keyboard.getKey('d') || false), (-Keyboard.getKey('w') || false) + (Keyboard.getKey('s') || false));

	if (checkCollision(sprite, sprite2)){
		//sprite.setVelocity(0, 0);
		sprite2.setVelocity(sprite.vel.x, sprite.vel.y);
	}

	if (Mouse.x > sprite.x + sprite.w)
		sprite.dir = 1;
	else if (Mouse.x < sprite.x)
		sprite.dir = -1;

	sprite.update();
	sprite2.update();
    gl.clear(gl.COLOR_BUFFER_BIT);
	spriteList.draw();
	requestAnimationFrame(run);
}
