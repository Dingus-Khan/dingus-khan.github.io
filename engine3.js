var canvas = document.getElementById("main");
var gl = canvas.getContext("webgl2");



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
			Math.round(x), Math.round(y), 0, 1
		];
	},
	translate: function(m, x, y){
		return this.multiply(m, this.translation(x, y));
	},
	rotation: function(r){
		var sine = Math.sin(r);
		var cosine = Math.cos(r);
		return [
			cosine, -sine, 0, 0,
			sine, cosine, 0, 0,
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
	scale: function(m, sx, sy){
		return this.multiply(m, this.scaling(sx, sy));
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

var Camera = function(x, y, w, h) {
	this.proj = [
		2 / w, 0, 0, 0,
		0, -2 / h, 0,
		0, 0, 0, 1, 0,
		-1, 1, 0, 1
	];

	this.view = Matrix.translation(x, y);
}

var camera = new Camera(0, 0, 800, 600);

var System = {
	BuildShader: function(type, src){
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
	LinkProgram: function(vertex, fragment){
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

function Shader(vertexShader, fragmentShader){
	var v = System.BuildShader(gl.VERTEX_SHADER, vertexShader);
	var f = System.BuildShader(gl.FRAGMENT_SHADER, fragmentShader);
	this.shader = System.LinkProgram(v, f);

	this.attributes = [];

	this.addAttribute = function(name, count, type, normalise, stride, offset){
		var loc = gl.getAttribLocation(this.shader, name);
		if (loc != -1){
			this.attributes.push({
				loc: loc, count: count, type: type, normalise: normalise, stride: stride, offset: offset
			});
		}
	}

	this.enableAttributes = function(){
		for(i = 0; i < this.attributes.length; i++){
			var attr = this.attributes[i];
			gl.vertexAttribPointer(attr.loc, attr.count, attr.type, attr.normalise, attr.stride * 4, attr.offset * 4);
			gl.enableVertexAttribArray(attr.loc);
		}
	}

	this.setUniform = function(name, value){
		var values = [].concat(value);

		var loc = gl.getUniformLocation(this.shader, name);
		switch(values.length){
			case 1:
				gl.uniform1fv(loc, values);
				break;
			case 2:
				gl.uniform2fv(loc, values);
				break;
			case 3:
				gl.uniform3fv(loc, values);
				break;
			case 4:
				gl.uniform4fv(loc, values);
				break;
			case 16:
				gl.uniformMatrix4fv(loc, false, values);
				break;
		}
	}

	this.use = function(){
		gl.useProgram(this.shader);
	}
}

function Texture(image, wrapMode, filterMode){
	this.texture = gl.createTexture();
	this.image = new Image();
	this.image.textureid = this.texture;
	this.image.wrapMode = wrapMode || gl.REPEAT;
	this.image.filterMode = filterMode || gl.NEAREST;

	this.image.onload = function(){
		gl.bindTexture(gl.TEXTURE_2D, this.textureid);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapMode);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapMode);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.filterMode);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.filterMode);

		gl.generateMipmap(gl.TEXTURE_2D);
	}

	this.image.src = image;

	this.bind = function(){
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
	}
}

var Shape = function(x, y, w, h){
	this.shader = new Shader(
		`#version 300 es
		in vec2 pos;
		in vec3 col;
		out vec3 Col;
		uniform mat4 proj;
		uniform mat4 view;
		uniform mat4 model;
		void main(){
			Col = col;
			gl_Position = proj * view * model * vec4(pos, 0, 1);
		}`,
		`#version 300 es
		precision mediump float;
		in vec3 Col;
		out vec4 outColour;
		void main(){
			outColour = vec4(Col, 1.0);
		}`
	);
	this.shader.addAttribute("pos", 2, gl.FLOAT, false, 5, 0);
	this.shader.addAttribute("col", 3, gl.FLOAT, false, 5, 2);
	this.shader.use();

	this.vao = gl.createVertexArray();
	this.vbo = gl.createBuffer();
	this.bufferData = [
		0, 0, 1, 1, 1,
		w, 0, 1, 1, 1,
		0, h, 1, 1, 1,
		w, h, 1, 1, 1
	];

	gl.bindVertexArray(this.vao);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferData), gl.STATIC_DRAW);
	this.shader.enableAttributes();

	this.model = Matrix.identity();
	this.x = x;
	this.y = y;

	this.move = function(x, y){
		this.x += x;
		this.y += y;
		this.model = Matrix.translate(this.model, x, y);
	}

	this.draw = function(){
		gl.bindVertexArray(this.vao);
		this.shader.use();
		this.shader.setUniform("proj", camera.proj);
		this.shader.setUniform("view", camera.view);
		this.shader.setUniform("model", this.model);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
}

var TileMap = function(tex){
	this.shader = new Shader(
		`#version 300 es
		in vec2 pos;
		in vec2 tex;
		in vec3 col;
		out vec2 Tex;
		out vec3 Col;
		uniform vec2 texSize;
		uniform mat4 proj;
		uniform mat4 view;
		void main(){
			Tex = tex / texSize;
			Col = col;
			gl_Position = proj * view * vec4(pos, 0, 1);
		}`,
		`#version 300 es
		precision mediump float;
		in vec2 Tex;
		in vec3 Col;
		out vec4 outColour;
		uniform sampler2D texImage;
		void main(){
			outColour = texture(texImage, Tex) * vec4(Col, 1);
		}`);
	this.shader.addAttribute("pos", 2, gl.FLOAT, false, 7, 0);
	this.shader.addAttribute("tex", 2, gl.FLOAT, false, 7, 2);
	this.shader.addAttribute("col", 3, gl.FLOAT, false, 7, 4);
	this.shader.use();

	this.tex = new Texture(tex, gl.REPEAT, gl.NEAREST);

	this.vao = gl.createVertexArray();
	this.vbo = gl.createBuffer();
	this.bufferData = [];
	this.tiles = [];

	gl.bindVertexArray(this.vao);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferData), gl.STATIC_DRAW);
	this.shader.enableAttributes();

	this.rebuild = true;
	this.addTile = function(x, y, w, h, tx, ty, tw, th, r, g, b){
		r = r || 1;
		g = g || 1;
		b = b || 1;
		this.tiles.push({
			x, y, w, h, tx, ty, tw, th, r, g, b
		});
		this.rebuild = true;
	}

	this.build = function(){
		this.tiles.forEach(function(tile, obj){
			obj.bufferData.push([
				tile.x, tile.y, tile.tx, tile.ty, tile.r, tile.g, tile.b,
				tile.x + tile.w, tile.y, tile.tx + tile.tw, tile.ty, tile.r, tile.g, tile.b,
				tile.x + tile.w, tile.y + tile.h, tile.tx + tile.tw, tile.ty + tile.th, tile.r, tile.g, tile.b,
				tile.x, tile.y, tile.tx, tile.ty, tile.r, tile.g, tile.b,
				tile.x + tile.w, tile.y + tile.h, tile.tx + tile.tw, tile.ty + tile.th, tile.r, tile.g, tile.b,
				tile.x, tile.y + tile.h, tile.tx, tile.ty + tile.th, tile.r, tile.g, tile.b,
			]);
		});
		this.rebuild = false;
	}

	this.draw = function(){
		if (this.bufferData.length == 0)
			return;

		if (this.rebuild)
			this.build();

		gl.bindVertexArray(this.vao);
		this.shader.use();
		this.shader.setUniform("proj", camera.proj);
		this.shader.setUniform("view", camera.view);
		this.shader.setUniform("texSize", [this.tex.image.width, this.tex.image.height])
		this.tex.bind();
		gl.drawArrays(gl.TRIANGLES, 0, this.bufferData.length / 7);
	}
}

gl.clearColor(0.1, 0.1, 0.1, 1.0);

var tm = new TileMap("tileset.png");

requestAnimationFrame(run);
function run() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	tm.draw();
	requestAnimationFrame(run);
}
