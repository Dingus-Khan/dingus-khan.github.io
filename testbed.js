var System = {
	buildShader: function(gl, type, src){
		var shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);

		var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success){
			return shader;
		}

		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
	},
	linkProgram: function(gl, vertex, fragment){
		var program = gl.createProgram();
		gl.attachShader(program, vertex);
		gl.attachShader(program, fragment);
		gl.linkProgram(program);

		var success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (success){
			return program;
		}

		console.log(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
	}
};

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

function Sprite(x, y, w, h, tx, ty, tw, th, tex, texImage){
	this.w = w;
	this.h = h;
	this.z = -y;
	this.tex = {};
	this.tex.x = tx;
	this.tex.y = ty;
	this.tex.w = tw;
	this.tex.h = th;
	this.tex.texture = {};
	this.tex.texture.id = tex;
	this.tex.texture.image = texImage;
	this.updateBuffer = true;

	this.vao = gl.createVertexArray();
	this.vbo = gl.createBuffer();
	gl.bindVertexArray(this.vao);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

	var pos = gl.getAttribLocation(program, "pos");
	gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 4 * 4, 0 * 4);
	gl.enableVertexAttribArray(pos);

	var tex = gl.getAttribLocation(program, "tex");
	gl.vertexAttribPointer(tex, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
	gl.enableVertexAttribArray(tex);

	this.build = function(){
		gl.bindVertexArray(this.vao);
		if (this.updateBuffer){
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

			var data = [
				0.0, 0.0, this.tex.x, this.tex.y,
				0.0, this.h, this.tex.x, this.tex.y + this.tex.h,
				this.w, 0.0, this.tex.x + this.tex.w, this.tex.y,
				this.w, this.h, this.tex.x + this.tex.w, this.tex.y + this.tex.h
			];

			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
			this.updateBuffer = false;
		}
	}

	this.draw = function(){
		this.build();
		gl.bindTexture(gl.TEXTURE_2D, this.tex.texture.id);

		var texSize = gl.getUniformLocation(program, "texSize");
		gl.uniform2f(texSize, this.tex.texture.image.width, this.tex.texture.image.height);

		var modelLoc = gl.getUniformLocation(program, "model");
		gl.uniformMatrix4fv(modelLoc, false, this.getModel());

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	this.x = x;
	this.y = y;

	this.setPosition = function(x, y){
		this.x = x;
		this.y = y;
		this.updateBuffer = true;
	}

	this.move = function(x, y){
		this.x += x;
		this.y += y;
		this.updateBuffer = true;
	}

	this.getModel = function(){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			Math.round(this.x), Math.round(this.y), 0, 1
		];
	}

	this.tickCounter = 0;
	this.anim = 0;
	this.frame = 0;
	this.frameSize = tw;
	this.animList = [];
	this.animList[0] = {
		start: 0,
		end: 5,
		y: 0,
		t: 5
	};

	this.animList[1] = {
		start: 0,
		end: 5,
		y: 1,
		t: 5
	};

	this.vel = {};
	this.vel.x = 0;
	this.vel.y = 0;
	this.spd = 2;
	this.dir = 1; // 1 == right, -1 == left

	this.setVelocity = function(x, y){
		this.vel.x = x * this.spd;
		this.vel.y = y * this.spd;
		this.dir = (this.vel.x == 0 ? this.dir : (this.vel.x > 0 ? 1 : -1));
	}

	this.update = function(){
		if(this.vel.x != 0 || this.vel.y != 0){
			this.anim = 1;
		} else {
			this.anim = 0;
		}

		this.tickCounter++;
		if (this.tickCounter >= this.animList[this.anim].t){
			this.frame++;
			if (this.frame > this.animList[this.anim].end){
				this.frame = this.animList[this.anim].start;
			}
			this.tickCounter = 0;
		}

		this.tex.x = this.frame * this.frameSize + (this.dir < 0 ? this.frameSize : 0);
		this.tex.y = this.animList[this.anim].y * this.frameSize;
		this.tex.w = this.frameSize * this.dir;

		this.move(this.vel.x, this.vel.y);
		this.vel.x = 0;
		this.vel.y = 0;
	}

	return this;
}

var canvas = document.getElementById("main");
var gl = canvas.getContext("webgl2");

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

var keyDown = {};
var	keyMap = {
	'left': 37,
	'up': 38,
	'right': 39,
	'down': 40,
	'a': 65,
	'd': 68,
	's': 83,
	'w': 87
};

document.addEventListener("keydown", function(e){
	keyDown[e.which] = true;
});
document.addEventListener("keyup", function(e){
	keyDown[e.which] = false;
});

var vertex = System.buildShader(gl, gl.VERTEX_SHADER, vertexShader);
var fragment = System.buildShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
var program = System.linkProgram(gl, vertex, fragment);

var texture = gl.createTexture();

var image = new Image();
image.onload = function(){
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.generateMipmap(gl.TEXTURE_2D);
}
image.src = "test.png";

var block = gl.createTexture();

var blockImg = new Image();
blockImg.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, block);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, blockImg);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

	gl.generateMipmap(gl.TEXTURE_2D);
}
blockImg.src = "block.png";

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

var sprite = new Sprite(300, 200, 120, 120, 0, 0, 120, 120, texture, image);
var sprite2 = new Sprite(0, 0, 60, 60, 0, 0, 120, 120, texture, image);

var spriteList = {
	sprites: [],
	sort: function(){
		this.sprites.sort(function(a, b){ return a.y + a.h > b.y + b.h; });
	},
	draw: function(){
		this.sort();
		for(i = 0; i < this.sprites.length; i++){
			this.sprites[i].draw();
		}
	}
};

function checkCollision(a, b){
	var c1 = {r: a.w / 2, x: a.x + (a.w / 2) + a.vel.x, y: a.y + (a.h / 2) + a.vel.y};
	var c2 = {r: b.w / 2, x: b.x + (b.w / 2) + b.vel.x, y: b.y + (b.h / 2) + b.vel.y};
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
	sprite.setVelocity((-keyDown[keyMap['left']] || false) + (keyDown[keyMap['right']] || false), (-keyDown[keyMap['up']] || false) + (keyDown[keyMap['down']] || false));
	sprite2.setVelocity((-keyDown[keyMap['a']] || false) + (keyDown[keyMap['d']] || false), (-keyDown[keyMap['w']] || false) + (keyDown[keyMap['s']] || false));

	if (checkCollision(sprite, sprite2)){
		sprite.setVelocity(-sprite.vel.x, -sprite.vel.y);
		sprite2.setVelocity(-sprite2.vel.x, -sprite2.vel.y);
	}

	sprite.update();
	sprite2.update();
    gl.clear(gl.COLOR_BUFFER_BIT);
	spriteList.draw();
	requestAnimationFrame(run);
}
