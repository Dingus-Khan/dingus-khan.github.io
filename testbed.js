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
Keyboard.registerKey('up', 38);
Keyboard.registerKey('left', 37);
Keyboard.registerKey('down', 40);
Keyboard.registerKey('right', 39);

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

var SpriteBatch = {
	sprites: [],
	draw: function(shader){
		this.sprites.sort(function(a, b){ return a.pos.y > b.pos.y; });

		for(s = 0; s < this.sprites.length; s++){
			this.sprites[s].render(shader);
		}
	}
};

SpriteBatch.sprites[0] = spr;
SpriteBatch.sprites[1] = spr2;

spr.hitCircle = 25;
spr2.hitCircle = 20;

function circleCollision(ax, ay, ar, bx, by, br){
	var x = ax - bx;
	var y = ay - by;
	var d = Math.sqrt((x * x) + (y * y));
	return d < (ar + br);
}

function randomInt(min, max){
	return parseInt(min + Math.random() * max);
}

var actionGen = function(){
	if (this.actionTimer == undefined)
		this.actionTimer = 0;

	if (this.actionTimer == 0){
		this.action = randomInt(0, 15);

		if (action < 5) {
			console.log("idle");
			this.actionTimer = randomInt(5, 20);
		} else if (action < 7) {
			console.log("walk up");
			this.actionTimer = randomInt(5, 20);
		} else if (action < 9) {
			console.log("walk down");
			this.actionTimer = randomInt(5, 20);
		} else if (action < 11) {
			console.log("walk left");
			this.actionTimer = randomInt(5, 20);
		} else if (action < 13) {
			console.log("walk right");
			this.actionTimer = randomInt(5, 20);
		} else {
			console.log("continue");
			this.actionTimer = 1;
		}
	}

	this.actionTimer--;
}

requestAnimationFrame(run);
function run() {
	actionGen();

	Keyboard.update();

	spr.pos.x += (Keyboard.getKey('d') - Keyboard.getKey('a')) * 2;
	spr.pos.y += (Keyboard.getKey('s') - Keyboard.getKey('w')) * 2;

	spr2.pos.x += (Keyboard.getKey('right') - Keyboard.getKey('left')) * 2;
	spr2.pos.y += (Keyboard.getKey('down') - Keyboard.getKey('up')) * 2;

	if (circleCollision(spr.pos.x + spr.dim.w / 2, spr.pos.y + spr.dim.h, spr.hitCircle, spr2.pos.x + spr2.dim.w / 2, spr2.pos.y + spr2.dim.h, spr2.hitCircle)){
		spr.pos.x -= (Keyboard.getKey('d') - Keyboard.getKey('a')) * 2;
		spr.pos.y -= (Keyboard.getKey('s') - Keyboard.getKey('w')) * 2;

		spr2.pos.x -= (Keyboard.getKey('right') - Keyboard.getKey('left')) * 2;
		spr2.pos.y -= (Keyboard.getKey('down') - Keyboard.getKey('up')) * 2;
	}

	Clear();
	SpriteBatch.draw(shader);
	requestAnimationFrame(run);
}
