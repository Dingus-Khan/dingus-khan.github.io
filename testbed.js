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

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 4, 0);
shader.addAttribute("tex", 2, gl.FLOAT, false, 4, 2);
shader.use();

shader.setUniform("proj", [2 / 800, 0, 0, 0, 0, -2 / 600, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1]);

function Sprite(){
	Drawable.call(this, gl.TRIANGLE_STRIP, 4);

	this.anims = {
		idle: { s: 0, e: 6, y: 0, t: 6 },
		walk: {}
	};
	this.anim = this.anims.idle;
	this.frame = 0;
	this.ticks = 0;

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

	this.render = function(shader){
		this.dir = this.vel.x > 0 ? 1 : (this.vel.x < 0 ? -1 : this.dir);

		if (this.dir == 1){
			this.bufferData = [
				0, 0, this.frame * 120, 0,
				120, 0, this.frame * 120 + 120, 0,
				0, 120, this.frame * 0, 120,
				120, 120, this.frame * 120 + 120, 120,
			];
		} else {
			this.bufferData = [
				120, 0, this.frame * 120 - 120, 0,
				0, 0, this.frame * 120, 0,
				120, 120, this.frame * 120 - 120, 120,
				0, 120, this.frame * 120, 120,
			];
		}

		this.updateBuffer = true;
		this.draw(shader, this.tex);
		this.ticks++;
		if(this.ticks >= this.anim.t){
			this.ticks -= this.anim.t;
			this.frame++;
		}
		if (this.frame == 6)
			this.frame = 0;
	}
}

var spr = new Sprite();

requestAnimationFrame(run);
function run() {
	Keyboard.update();

	spr.vel.x += (-Keyboard.getKey('a') + Keyboard.getKey('d')) * spr.spd;
	spr.vel.y += (-Keyboard.getKey('w') + Keyboard.getKey('s')) * spr.spd;

	spr.vel.x -= (spr.vel.x * spr.decay);
	spr.vel.y -= (spr.vel.y * spr.decay);

	spr.model = Matrix.translate(spr.model, spr.vel.x, spr.vel.y);
	shader.setUniform("model", spr.model);

	Clear();
	spr.render(shader);
	requestAnimationFrame(run);
}
