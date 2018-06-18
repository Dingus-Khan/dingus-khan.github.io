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
Keyboard.registerKey('lshift', 16);

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 4, 0);
shader.addAttribute("tex", 2, gl.FLOAT, false, 4, 2);
shader.use();

shader.setUniform("proj", proj);

function Sprite(tex, w, h, tx, ty, tw, th){
	Drawable.call(this, gl.TRIANGLE_STRIP, 4);

	this.tex = new Texture(tex);
	this.dim = { w: w, h: h };
	this.texCoords = { x: tx, y: ty, w: tw, h: th };

	this.bufferData = [
		0, 0, this.texCoords.x, this.texCoords.y,
		this.dim.w, 0, this.texCoords.x + this.texCoords.w, this.texCoords.y,
		0, this.dim.h, this.texCoords.x, this.texCoords.y + this.texCoords.h,
		this.dim.w, this.dim.h,	this.texCoords.x + this.texCoords.w, this.texCoords.y + this.texCoords.h
	];
	this.updateBuffer = true;

	this.model = Matrix.identity();
	this.pos = { x: 0, y: 0 };

	this.render = function(shader){
		this.model = Matrix.translation(this.pos.x, this.pos.y);
		shader.setUniform("model", this.model);

		this.draw(shader, this.tex);
	}
}

var spr = new Sprite("test.png", 120, 120, 0, 0, 120, 120);
var spr2 = new Sprite("cowsheet.png", 110, 110, 0, 0, 110, 110);

requestAnimationFrame(run);
function run() {
	Clear();
	spr.render(shader);
	spr2.render(shader);
	requestAnimationFrame(run);
}
