var vertexShader = `#version 300 es
in vec2 pos;
in vec2 tex;

out vec2 Tex;

uniform mat4 proj;
uniform mat4 model;

void main(){
	Tex = tex;
    gl_Position = proj * model * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;

in vec2 Tex;

out vec4 outColour;

uniform sampler2D texImage;

void main(){
	ivec2 texSize = textureSize(texImage, 0);
    outColour = texture(texImage, vec2(Tex.x / float(texSize.x), Tex.y / float(texSize.y)));
}`;

Keyboard.registerKey('w', 87);
Keyboard.registerKey('a', 65);
Keyboard.registerKey('s', 83);
Keyboard.registerKey('d', 68);
Keyboard.registerKey('space', 32);

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 4, 0);
shader.addAttribute("tex", 2, gl.FLOAT, false, 4, 2);
shader.use();

shader.setUniform("proj", proj);

function Actor(){
	this.c = "Working";
}

function Sprite(){
	Drawable.call(this, gl.TRIANGLE_STRIP, 4);
	Actor.call(this);

	this.bufferData = [
		0, 0, 0, 0,
		120, 0, 120, 0,
		0, 120, 0, 120,
		120, 120, 120, 120
	];

	this.tex = new Texture("test.png");

	this.vel = {
		x: 0,
		y: 0
	};

	this.spd = 2;
	this.decay = 0.2;
	this.model = Matrix.identity();
	this.dir = 1; // 1 = left, -1 = right
}

var State = function(){
	this.anim = {};
	this.return = undefined;
}

var spr = new Sprite();

requestAnimationFrame(run);
function run() {
	Clear();
	requestAnimationFrame(run);
}
