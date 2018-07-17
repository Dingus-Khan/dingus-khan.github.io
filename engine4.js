var canvas;
var gl;

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

var Mouse = {
	x: 0,
	y: 0,
	left: false,
	right: false
};

class Window {
	constructor(w, h){
		this.width = w;
		this.height = h;

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

		document.addEventListener("mousemove", function(e){
			Mouse.x = e.clientX;
			Mouse.y = e.clientY;
		});

		document.getElementById("main").addEventListener("mousedown", function(e){
			switch(e.button){
				case 0:
					Mouse.left = true;
					break;
				case 1:
					Mouse.right = true;
					break;
			}
		});

		document.getElementById("main").addEventListener("mouseup", function(e){
			switch(e.button){
				case 0:
					Mouse.left = false;
					break;
				case 1:
					Mouse.right = false;
					break;
			}
		});

		document.getElementById("main").addEventListener("contextmenu", function(e){
			e.preventDefault();
		});

		canvas = document.getElementById("main");
		gl = canvas.getContext("webgl2");
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		gl.clearColor(0.1, 0.1, 0.1, 1.0);

		this.camera = new Camera(0, 0, w, h);
	}

	setCamera(camera){
		this.camera = camera;
	}

	clear(){
		gl.clear(gl.COLOR_BUFFER_BIT);
	}

	draw(drawable){
		if (drawable.shader != undefined){
			drawable.shader.use();
			drawable.shader.enableAttributes();
			drawable.shader.setUniform("proj", this.camera.proj);
			drawable.shader.setUniform("view", this.camera.view);
		}

		drawable.draw();
	}
}

class Shader {
	constructor(vertex, fragment){
		var v = Shader.BuildShader(gl.VERTEX_SHADER, vertex);
		var f = Shader.BuildShader(gl.FRAGMENT_SHADER, fragment);
		this.shader = Shader.LinkProgram(v, f);
		this.attributes = [];
	}

	static BuildShader(type, src){
		var shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);

		var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success){
			return shader;
		}

		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
	}

	static LinkProgram(vertex, fragment){
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

	addAttribute(name, count, type, normalise, stride, offset){
		var loc = gl.getAttribLocation(this.shader, name);
		if (loc != -1){
			this.attributes.push({
				loc: loc, count: count, type: type, normalise: normalise, stride: stride, offset: offset
			});
		}
	}
	enableAttributes(){
		for(let i = 0; i < this.attributes.length; i++){
			var attr = this.attributes[i];
			gl.vertexAttribPointer(attr.loc, attr.count, attr.type, attr.normalise, attr.stride * 4, attr.offset * 4);
			gl.enableVertexAttribArray(attr.loc);
		}
	}
	setUniform(name, value){
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
	use(){
		gl.useProgram(this.shader);
	}
}

class Texture {
	constructor(image, wrapMode, filterMode){
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
}

class Matrix {
	static identity (){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	}
	static translation(x, y){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			Math.round(x), Math.round(y), 0, 1
		];
	}
	static translate(m, x, y){
		return this.multiply(m, this.translation(x, y));
	}
	static rotation(r){
		var sine = Math.sin(r);
		var cosine = Math.cos(r);
		return [
			cosine, -sine, 0, 0,
			sine, cosine, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	}
	static rotate(m, r){
		return this.multiply(m, this.rotation(r));
	}
	static scaling(sx, sy){
		return [
			sx, 0, 0, 0,
			0, sy, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	}
	static scale(m, sx, sy){
		return this.multiply(m, this.scaling(sx, sy));
	}
	static multiply(m1, m2){
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

class Camera {
	constructor(x, y, w, h){
		this.originX = w/2;
		this.originY = h/2;

		this.x = x - this.originX;
		this.y = y - this.originY;

		this.w = w;
		this.h = h;
		this.proj = [
			2 / w, 0, 0, 0,
			0, -2 / h, 0, 0,
			0, 0, 0, 1,
			-1, 1, 0, 1
		];
		this.view = Matrix.translation(this.x, this.y);
	}
}

class Drawable {
	constructor(x, y, r, g, b){
		this.x = x;
		this.y = y;
		this.r = r;
		this.g = g;
		this.b = b;
		this.depth = -y;
		this.model = Matrix.translation(x, y);

		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();
		this.bufferData = [];

		this.rebuild = true;
	}
};

class Sprite extends Drawable {
	constructor(tex, x, y, w, h, tx, ty, tw, th, r, g, b){
		super(x, y, r, g, b);

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
			uniform mat4 model;
			void main(){
				Tex = tex / texSize;
				Col = col;
				gl_Position = proj * view * model * vec4(pos, 0, 1);
			}`,
			`#version 300 es
			precision mediump float;
			in vec2 Tex;
			in vec3 Col;
			out vec4 outColour;
			uniform sampler2D texImage;
			void main(){
				outColour = texture(texImage, Tex) * vec4(Col, 1);
			}`
		);
		this.shader.addAttribute("pos", 2, gl.FLOAT, false, 7, 0);
		this.shader.addAttribute("tex", 2, gl.FLOAT, false, 7, 2);
		this.shader.addAttribute("col", 3, gl.FLOAT, false, 7, 4);
		this.shader.use();

		this.tex = new Texture(tex, gl.REPEAT, gl.NEAREST);

		this.bufferData = [
			x, y, tx, ty, r, g, b,
			x + w, y, tx + tw, ty, r, g, b,
			x, y + h, tx, ty + th, r, g, b,
			x + w, y + h, tx + tw, ty + th, r, g, b
		];
	}
	build(){
		if (this.rebuild){
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferData), gl.STATIC_DRAW);
			this.rebuild = false;
		}
	}
	draw(){
		if (this.bufferData.length == 0)
			return;

		gl.bindVertexArray(this.vao);
		this.build();
		this.shader.setUniform("model", this.model);
		this.shader.setUniform("texSize", [this.tex.image.width, this.tex.image.height])
		this.tex.bind();
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	}
}

/////////////////////////////////////////////////

var game = new Window(800, 600);

var sprite = new Sprite("character.png", 0, 0, 100, 100, 0, 0, 100, 100, 1, 1, 1);

requestAnimationFrame(run);
function run() {
	game.clear();
	game.draw(sprite);
	requestAnimationFrame(run);
}
