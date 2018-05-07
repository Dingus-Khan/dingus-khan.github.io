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

function Shader(vertex, fragment){
	var gl = Game.gl;
	vertexShader = System.buildShader(gl, gl.VERTEX_SHADER, vertex);
	fragmentShader = System.buildShader(gl, gl.FRAGMENT_SHADER, fragment);
	this.program = System.linkProgram(gl, vertexShader, fragmentShader);

	this.setUniformv1 = function(uniform, value){
		var gl = Game.gl;
		gl.useProgram(this.program);

		var uniLoc = gl.getUniformLocation(this.program, uniform);
		gl.uniform1f(uniLoc, value);
	}
	this.setUniformv2 = function(uniform, value1, value2){
		var gl = Game.gl;
		gl.useProgram(this.program);

		var uniLoc = gl.getUniformLocation(this.program, uniform);
		gl.uniform2f(uniLoc, value1, value2);
	}
	this.setUniformv3 = function(uniform, value1, value2, value3){
		var gl = Game.gl;
		gl.useProgram(this.program);

		var uniLoc = gl.getUniformLocation(this.program, uniform);
		gl.uniform3f(uniLoc, value1, value2, value3);
	}
	this.setUniformv4 = function(uniform, value1, value2, value3, value4){
		var gl = Game.gl;
		gl.useProgram(this.program);

		var uniLoc = gl.getUniformLocation(this.program, uniform);
		gl.uniform4f(uniLoc, value1, value2, value3, value4);
	}
	this.setUniformm4 = function(uniform, value){
		var gl = Game.gl;
		gl.useProgram(this.program);

		var uniLoc = gl.getUniformLocation(this.program, uniform);
		gl.uniformMatrix4fv(uniLoc, false, value);
	}
};

function Point(x, y, z, r, g, b, texX, texY) {
	this.x = x;
	this.y = y;
	this.z = z;
	this.r = r;
	this.g = g;
	this.b = b;
	this.tX = texX;
	this.tY = texY;
};

function Texture(src) {
	var gl = Game.gl;

	this.textureId = gl.createTexture();
	this.image = new Image();
	this.image.textureId = this.textureId;

	this.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, this.textureId);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
	}
	this.image.src = src;
};

function Sprite(texture, w, h, tx, ty, tw, th){
	var gl = Game.gl;

	this.texture = texture;
	this.w = w;
	this.h = h;
	this.tX = tx;
	this.tY = ty;
	this.tW = tw;
	this.tH = th;

	this.vao = gl.createVertexArray();
	this.vbo = gl.createBuffer();

	this.update = function(){
			var gl = Game.gl;
			gl.bindVertexArray(this.vao);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

			this.points = [];
			this.points[0] = new Point(0, 0, 0, 1, 1, 1, this.tx, this.ty);
			this.points[1] = new Point(0, h, 0, 1, 1, 1, this.tx, this.ty + this.th);
			this.points[2] = new Point(w, 0, 0, 1, 1, 1, this.tx + this.tw, this.ty);
			this.points[3] = new Point(w, h, 0, 1, 1, 1, this.tx + this.tw, this.ty + this.th);

			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(
					0.0, 0.0, 0.0, 1.0, 1.0, 1.0, this.tx, this.ty,
					0.0, h, 0.0, 1.0, 1.0, 1.0, this.tx, this.ty + this.th,
					w, 0.0, 0.0, 1.0, 1.0, 1.0, this.tx + this.tw, this.ty,
					w, h, 0.0, 1.0, 1.0, 1.0, this.tx + this.tw, this.ty + this.th
				), gl.STATIC_DRAW)

			var pos = gl.getAttribLocation(Game.shader.program, "pos");
			gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 8 * 4, 0);
			gl.enableVertexAttribArray(pos);

			var col = gl.getAttribLocation(Game.shader.program, "col");
			gl.vertexAttribPointer(col, 3, gl.FLOAT, false, 8 * 4, 0);
			gl.enableVertexAttribArray(col);

			var tex = gl.getAttribLocation(Game.shader.program, "tex");
			gl.vertexAttribPointer(tex, 2, gl.FLOAT, false, 8 * 4, 0);
			gl.enableVertexAttribArray(tex);

	};

	this.draw = function(){
		var gl = Game.gl;
		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

		this.update();

		Game.shader.setUniformv2("texSize", this.texture.image.width, this.texture.image.height);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}

	this.update();
}

var Game = {
	canvas: undefined,
	gl: undefined,
	shader: undefined,
	proj: undefined,
	resX: 0,
	resY: 0,
	init: function(canvasId, resX, resY){
		this.canvas = document.getElementById(canvasId);
		this.gl = this.canvas.getContext("webgl2");

		this.setResolution(resX === undefined ? this.canvas.width : resX,
			resY === undefined ? this.canvas.height : resY);
	},
	setResolution(resX, resY){
		this.resX = (resX === undefined) ? this.canvas.width : resX;
		this.resY = (resY === undefined) ? this.canvas.height : resY;

		this.proj = [
			2 / this.resX, 0, 0, 0,
			0, -2 / this.resY, 0, 0,
			0, 0, 1, 0,
			-1, 1, 0, 1
		];

		this.gl.viewport(0, this.resX, 0, this.resY);
	},
	clear: function(r, g, b){
		this.gl.clearColor(r, g, b, 1.0);
		this.gl.clear(this.gl.COLOR_BUFFER_BIT);
	},
	useShader: function(shader){
		this.shader = shader;
		this.gl.useProgram(this.shader.program);
		this.shader.setUniformm4("proj", this.proj);
	}
};