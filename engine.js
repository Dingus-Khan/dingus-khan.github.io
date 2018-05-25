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

var Matrix = {
	identity: function(){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	},
	translation: function(x, y){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			Math.round(x), Math,round(y), 0, 1
		];
	},
	translate: function(m, x, y){
		return this.multiply(m, this.translation(x, y));
	},
	rotation: function(r){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	},
	rotate: function(m, r){
		return this.multiply(m, this.rotation(r));
	},
	scaling: function(sx, sy){
		return [
			sx, 0, 0, 0,
			0, sy, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	},
	scale: function(m, s){
		return this.multiply(m, this.scaling(s));
	},
	multiply: function(m1, m2){
		return [
			((m1[0] * m2[0]) + (m1[1] * m2[4]) + (m1[2] * m2[8]) + (m1[3] * m2[12])),
			((m1[0] * m2[1]) + (m1[1] * m2[5]) + (m1[2] * m2[9]) + (m1[3] * m2[13])),
			((m1[0] * m2[2]) + (m1[1] * m2[6]) + (m1[2] * m2[10]) + (m1[3] * m2[14])),
			((m1[0] * m2[3]) + (m1[1] * m2[7]) + (m1[2] * m2[11]) + (m1[3] * m2[15])),

			((m1[4] * m2[0]) + (m1[5] * m2[4]) + (m1[6] * m2[8]) + (m1[7] * m2[12])),
			((m1[4] * m2[1]) + (m1[5] * m2[5]) + (m1[6] * m2[9]) + (m1[7] * m2[13])),
			((m1[4] * m2[2]) + (m1[5] * m2[6]) + (m1[6] * m2[10]) + (m1[7] * m2[14])),
			((m1[4] * m2[3]) + (m1[5] * m2[7]) + (m1[6] * m2[11]) + (m1[7] * m2[15])),

			((m1[8] * m2[0]) + (m1[9] * m2[4]) + (m1[10] * m2[8]) + (m1[11] * m2[12])),
			((m1[8] * m2[1]) + (m1[9] * m2[5]) + (m1[10] * m2[9]) + (m1[11] * m2[13])),
			((m1[8] * m2[2]) + (m1[9] * m2[6]) + (m1[10] * m2[10]) + (m1[11] * m2[14])),
			((m1[8] * m2[3]) + (m1[9] * m2[7]) + (m1[10] * m2[11]) + (m1[11] * m2[15])),

			((m1[12] * m2[0]) + (m1[13] * m2[4]) + (m1[14] * m2[8]) + (m1[15] * m2[12])),
			((m1[12] * m2[1]) + (m1[13] * m2[5]) + (m1[14] * m2[9]) + (m1[15] * m2[13])),
			((m1[12] * m2[2]) + (m1[13] * m2[6]) + (m1[14] * m2[10]) + (m1[15] * m2[14])),
			((m1[12] * m2[3]) + (m1[13] * m2[7]) + (m1[14] * m2[11]) + (m1[15] * m2[15]))
		];
	}
};

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

var Physics = {
	Point: function(x, y){
		this.x = x || 0;
		this.y = y || 0;
	},
	Circle: function(x, y, radius){
		this.x = x || 0;
		this.y = y || 0;
		this.radius = radius || 0;
	},
	Line: function(x1, y1, x2, y2){
		this.x1 = x1 || 0;
		this.y1 = y1 || 0;
		this.x2 = x2 || 0;
		this.y2 = y2 || 0;
	},
	Box: function(x, y, w, h){
		this.x = x || 0;
		this.y = y || 0;
		this.w = w || 0;
		this.h = h || 0;
	},
	pointBox: function(point, box){
		return (point.x > box.x && point.x < box.x + box.w
		&& point.y > box.y && point.y < box.y + box.h);
	},
	circleCircle: function(circle1, circle2){
		var xdist = circle2.x - circle1.x;
		var ydist = circle2.y - circle1.y;
		var dist = Math.sqrt((xdist * xdist) + (ydist * ydist));
		return dist < (circle1.radius + circle2.radius);
	},
	circleBox: function(circle, box){

	},
	boxBox: function(box1, box2, vel){
		if (vel == undefined){
			vel = {x: 0, y: 0}
		}

		var colX = box1.x + vel.x < box2.x + box2.w	&& box1.x + vel.x + box1.w > box2.x;
		var colY = box1.y + vel.y < box2.y + box2.h && box1.y + vel.y + box1.h > box2.y;

		if (colX && colY){
			var keepX = colY && (box1.x < box2.x + box2.w && box1.x + box1.w > box2.x);
			var keepY = colX && (box1.y < box2.y + box2.h && box1.y + box1.h > box2.y);
			vel.x *= keepX;
			vel.y *= keepY;
		}
		return vel;
	},
	getVectorDirection: function(vec){
		var dir = "";
		if (vec.x == 0 && vec.y == 0)
			dir = "S";
		else if (vec.x > 0 && vec.y == 0)
			dir = "R";
		else if (vec.x < 0 && vec.y == 0)
			dir = "L";
		else if (vec.x == 0 && vec.y > 0)
			dir = "D";
		else if (vec.x == 0 && vec.y < 0)
			dir = "U";
		else if (vec.x > 0 && vec.y > 0)
			dir = "RD";
		else if (vec.x > 0 && vec.y < 0)
			dir = "RU";
		else if (vec.x < 0 && vec.y > 0)
			dir = "LD";
		else if (vec.x < 0 && vec.y < 0)
			dir = "LU";

		return dir;
	}
};

var canvas = document.getElementById("main");
var gl = canvas.getContext("webgl2");

var Keyboard = {
	keyDown: {},
	keyPressed: {},
	keyMap: {},
	registerKey: function(key, code){
		this.keyMap[key] = code;
		this.keyDown[this.keyMap[key]] = false;
		this.keyPressed[this.keyMap[key]] = false;
	},
	getKey: function(key){
		return this.keyDown[this.keyMap[key]];
	},
	wasKeyPressed: function(key){
		return this.keyPressed[this.keyMap[key]];
	},
	update: function(){
		for(var prop in this.keyMap){
			this.keyPressed[this.keyMap[prop]] = false;
		}
	}
};

document.addEventListener("keydown", function(e){
	if (Keyboard.keyDown[e.which] == false){
		Keyboard.keyPressed[e.which] = true;
	} else {
		Keyboard.keyPressed[e.which] = false;
	}
	Keyboard.keyDown[e.which] = true;
});

document.addEventListener("keyup", function(e){
	Keyboard.keyDown[e.which] = false;
	Keyboard.keyPressed[e.which] = false;
});

var Mouse = {
	x: 0,
	y: 0,
	left: false,
	right: false
};

document.addEventListener("mousemove", function(e){
	Mouse.x = e.clientX;
	Mouse.y = e.clientY;
});

canvas.addEventListener("mousedown", function(e){
	switch(e.button){
		case 0:
			Mouse.left = true;
			break;
		case 1:
			Mouse.right = true;
			break;
	}
});

canvas.addEventListener("mouseup", function(e){
	switch(e.button){
		case 0:
			Mouse.left = false;
			break;
		case 1:
			Mouse.right = false;
			break;
	}
});

canvas.addEventListener("contextmenu", function(e){
	e.preventDefault();
});

function Sprite(x, y, w, h, tx, ty, tw, th, texture, r, g, b){
	this.w = w;
	this.h = h;
	this.z = -y;
	this.tex = {};
	this.tex.x = tx;
	this.tex.y = ty;
	this.tex.w = tw;
	this.tex.h = th;
	this.tex.texture = {};
	this.tex.texture.id = texture.texture;
	this.tex.texture.image = texture.image;
	this.updateBuffer = true;
	this.r = (r == undefined ? 1.0 : r);
	this.g = (g == undefined ? 1.0 : g);
	this.b = (b == undefined ? 1.0 : b);

	this.vao = gl.createVertexArray();
	this.vbo = gl.createBuffer();
	gl.bindVertexArray(this.vao);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

	var pos = gl.getAttribLocation(program, "pos");
	gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 7 * 4, 0 * 4);
	gl.enableVertexAttribArray(pos);

	var tex = gl.getAttribLocation(program, "tex");
	gl.vertexAttribPointer(tex, 2, gl.FLOAT, false, 7 * 4, 2 * 4);
	gl.enableVertexAttribArray(tex);

	var col = gl.getAttribLocation(program, "col");
	gl.vertexAttribPointer(col, 3, gl.FLOAT, false, 7 * 4, 4 * 4);
	gl.enableVertexAttribArray(col);

	this.build = function(){
		gl.bindVertexArray(this.vao);
		if (this.updateBuffer){
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

			var data = [
				0.0, 0.0, this.tex.x, this.tex.y, this.r, this.g, this.b,
				0.0, this.h, this.tex.x, this.tex.y + this.tex.h, this.r, this.g, this.b,
				this.w, 0.0, this.tex.x + this.tex.w, this.tex.y, this.r, this.g, this.b,
				this.w, this.h, this.tex.x + this.tex.w, this.tex.y + this.tex.h, this.r, this.g, this.b,
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
	}

	this.move = function(x, y){
		this.x += x;
		this.y += y;
	}

	this.getModel = function(){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			Math.round(this.x), Math.round(this.y), 0, 1
		];
	}

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

	this.ticks = 0;
	this.frame = 0;
	this.anim = 0;
	this.animList = [];

	this.addAnimation = function(anim){
		this.animList.push(anim);
	}

	this.animate = function(){
		this.ticks++;
		if (this.ticks >= this.animList[this.anim].t){
			this.frame++;
			if (this.frame > this.animList[this.anim].end){
				this.frame = this.animList[this.anim].start;
			}
			this.ticks = 0;
			this.updateBuffer = true;
		}

		this.tex.x = this.frame * this.animList[this.anim].w;
		this.tex.y = this.animList[this.anim].y * this.animList[this.anim].h;
		this.tex.w = this.animList[this.anim].w * this.dir;
	}

	this.update = function(){
		if (this.animList.length > 0)
			this.animate();

		this.move(this.vel.x, this.vel.y);
		this.vel.x = 0;
		this.vel.y = 0;
	}

	return this;
}

// start = starting frame, end = ending frame (both on x axis)
// y = y axis
// w = width of frame, h = height of frame
// t = number of ticks for frame
function Animation(start, end, y, w, h, t){
	this.start = start;
	this.end = end;
	this.y = y;
	this.w = w;
	this.h = h;
	this.t = t;
}

var SpriteList = {
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

function Texture(src){
	this.texture = gl.createTexture();
	this.image = new Image();
	this.image.textureid = this.texture;

	this.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, this.textureid);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		gl.generateMipmap(gl.TEXTURE_2D);
	};
	this.image.src = src;
}

var TileBatch = {
	tileData: [],
	tex: {},
	init: function (texture){
		this.tex = texture;

		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();
		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

		var pos = gl.getAttribLocation(program, "pos");
		gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 7 * 4, 0 * 4);
		gl.enableVertexAttribArray(pos);

		var tex = gl.getAttribLocation(program, "tex");
		gl.vertexAttribPointer(tex, 2, gl.FLOAT, false, 7 * 4, 2 * 4);
		gl.enableVertexAttribArray(tex);

		var col = gl.getAttribLocation(program, "col");
		gl.vertexAttribPointer(col, 3, gl.FLOAT, false, 7 * 4, 4 * 4);
		gl.enableVertexAttribArray(col);
	},
	addTile: function(x, y, w, h, tx, ty, tw, th, r, g, b){
		r = r || 1.0;
		g = g || 1.0;
		b = b || 1.0;
		this.tileData = this.tileData.concat([ // push in vertex data variables for 6 points
			x, y, tx, ty, r, g, b,
			x + w, y, tx + tw, ty, r, g, b,
			x, y + h, tx, ty + th, r, g, b,
			x + w, y, tx + tw, ty, r, g, b,
			x + w, y + h, tx + tw, ty + th, r, g, b,
			x, y + h, tx, ty + th, r, g, b
		]);

		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tileData), gl.STATIC_DRAW);
	},
	loadFromString: function(string){
		var array = string.split(',');
		this.tileData = [];
		for(i = 0; i < array.length; i++){
			this.tileData.push(parseInt(array[i]));
		}

		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tileData), gl.STATIC_DRAW);
	},
	undo: function(){
		for(i = 0; i < 24; i++)
			this.tileData.pop();
	},
	clear: function(){
		this.tileData = [];

		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.tileData), gl.STATIC_DRAW);
	},
	draw: function(){
		if (this.tileData.length > 0){
			gl.bindVertexArray(this.vao);
			gl.bindTexture(gl.TEXTURE_2D, this.tex.texture);

			var texSize = gl.getUniformLocation(program, "texSize");
			gl.uniform2f(texSize, this.tex.image.width, this.tex.image.height);

			var modelLoc = gl.getUniformLocation(program, "model");
			gl.uniformMatrix4fv(modelLoc, false, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);

			gl.drawArrays(gl.TRIANGLES, 0, this.tileData.length / 4);
		}
	}
};

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

var vertexShader = `#version 300 es
in vec2 pos;
in vec2 tex;
in vec3 col;

out vec2 Tex;
out vec3 Col;

uniform vec2 texSize;
uniform mat4 proj;
uniform mat4 model;

void main(){
    Tex = tex / texSize;
	Col = col;
    gl_Position = proj * model * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;

in vec2 Tex;
in vec3 Col;

out vec4 outColour;

uniform sampler2D texImage;

void main(){
    outColour = texture(texImage, Tex) * vec4(Col, 1.0);
}`;


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

gl.clearColor(0.1, 0.1, 0.1, 1.0);
