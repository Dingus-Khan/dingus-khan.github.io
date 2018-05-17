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

var canvas = document.getElementById("main");
var gl = canvas.getContext("webgl2");

var Keyboard = {
	keyDown: {},
	keyMap: {},
	registerKey: function(key, code){
		this.keyMap[key] = code;
		this.keyDown[this.keyMap[key]] = false;
	},
	getKey: function(key){
		return this.keyDown[this.keyMap[key]];
	}
};

document.addEventListener("keydown", function(e){
	Keyboard.keyDown[e.which] = true;
});

document.addEventListener("keyup", function(e){
	Keyboard.keyDown[e.which] = false;
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

function Sprite(x, y, w, h, tx, ty, tw, th, texture){
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
	this.animList[0] = new Animation(0, 0, 0, this.tex.w, this.tex.h, 1);

	this.animate = function(){
		this.ticks++;
		if (this.ticks >= this.animList[this.anim].t){
			this.frame++;
			if (this.frame > this.animList[this.anim.end]){
				this.frame = this.animList[this.anim].start;
			}
			this.ticks = 0;
		}

		this.tex.x = this.frame * this.animList[this.anim].w + (this.dir < 0 ? this.animList[this.anim].w : 0);
		this.tex.y = this.animList[this.anim].y * this.animList[this.anim].h;
		this.tex.w = this.animList[this.anim].w * this.dir;
	}

	this.update = function(){
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
		gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 4 * 4, 0 * 4);
		gl.enableVertexAttribArray(pos);

		var tex = gl.getAttribLocation(program, "tex");
		gl.vertexAttribPointer(tex, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
		gl.enableVertexAttribArray(tex);
	},
	addTile: function(x, y, w, h, tx, ty, tw, th){
		this.tileData = this.tileData.concat([ // push in vertex data variables for 6 points
			x, y, tx, ty,
			x + w, y, tx + tw, ty,
			x, y + h, tx, ty + th,
			x + w, y, tx + tw, ty,
			x + w, y + h, tx + tw, ty + th,
			x, y + h, tx, ty + th
		]);

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
