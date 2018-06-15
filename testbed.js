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

function Actor(){
	this.states = {};
	this.activeState = {};
	this.addState = function(stateName, state){
		this.states[stateName] = state;
	}
	this.setState = function(stateName){
		this.activeState = this.states[stateName];
	}
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

	this.decay = 0.2;

	this.model = Matrix.identity();

	this.render = function(shader){
		this.activeState.update(this);
		this.vel.x -= (this.vel.x > this.decay / 10 || this.vel.x < -(this.decay / 10) ? this.vel.x * this.decay : this.vel.x);
		this.vel.y -= (this.vel.y > this.decay / 10 || this.vel.y < -(this.decay / 10) ? this.vel.y * this.decay : this.vel.y);
		this.model = Matrix.translate(this.model, this.vel.x, this.vel.y);
		shader.setUniform("model", this.model);
		this.draw(shader, this.tex);
	}
}

/*
	State Handling -
		States should implement	the following methods
		and fields:

		update(drawable)
		anim{start, end, y, time}
		frame
		ticks
*/

var IdleState = {
	update: function(drawable){
		this.ticks++;
		if (this.ticks > this.anim.time){
			this.frame++;
			this.ticks = 0;

			drawable.bufferData = [
				0, 0, this.frame * 120, this.anim.y * 120,
				120, 0, this.frame * 120 + 120, this.anim.y * 120,
				0, 120, this.frame * 120, this.anim.y * 120 + 120,
				120, 120, this.frame * 120 + 120, this.anim.y * 120 + 120
			];
			drawable.updateBuffer = true;
		}
		if (this.frame == this.anim.end) this.frame = this.anim.start;

		if ((Keyboard.getKey('w') != Keyboard.getKey('s'))
		|| (Keyboard.getKey('a') != Keyboard.getKey('d')))
			drawable.setState('walk');
	},
	anim: { start: 0, end: 6, y: 0, time: 4 },
	frame: 0,
	ticks: 0,
	dir: 1,
};

var WalkState = {
	update: function(drawable){
		this.ticks++;
		if (this.ticks > this.anim.time){
			this.frame++;
			this.ticks = 0;

			drawable.bufferData = [
				0, 0, this.frame * 120, this.anim.y * 120,
				120, 0, this.frame * 120 + 120, this.anim.y * 120,
				0, 120, this.frame * 120, this.anim.y * 120 + 120,
				120, 120, this.frame * 120 + 120, this.anim.y * 120 + 120
			];
			drawable.updateBuffer = true;
		}
		if (this.frame == this.anim.end) this.frame = this.anim.start;

		if (!(Keyboard.getKey('w') != Keyboard.getKey('s')) && !(Keyboard.getKey('a') != Keyboard.getKey('d'))){
			drawable.setState('idle');
		} else {
			drawable.vel.x = (Keyboard.getKey('d') - Keyboard.getKey('a')) * this.walkSpd;
			drawable.vel.y = (Keyboard.getKey('s') - Keyboard.getKey('w')) * this.walkSpd;
		}
	},
	anim: { start: 0, end: 6, y: 1, time: 4 },
	frame: 0,
	ticks: 0,
	dir: 1,
	walkSpd: 4,
};

var spr = new Sprite();
spr.addState('idle', IdleState);
spr.addState('walk', WalkState);
spr.setState('idle');

requestAnimationFrame(run);
function run() {
	Clear();
	spr.render(shader);
	requestAnimationFrame(run);
}
