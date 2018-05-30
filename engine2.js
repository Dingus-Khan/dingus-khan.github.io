var canvas = document.getElementById("main");
var gl = canvas.getContext("webgl2");

var System = {
	Init: function(){
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		document.addEventListener("keydown", function(e){
			if (System.Keyboard.keyDown[e.which] == false){
				System.Keyboard.keyPressed[e.which] = true;
			} else {
				System.Keyboard.keyPressed[e.which] = false;
			}
			System.Keyboard.keyDown[e.which] = true;
		});

		document.addEventListener("keyup", function(e){
			System.Keyboard.keyDown[e.which] = false;
			System.Keyboard.keyPressed[e.which] = false;
		});

		document.addEventListener("mousemove", function(e){
			System.Mouse.x = e.clientX;
			System.Mouse.y = e.clientY;
		});

		canvas.addEventListener("mousedown", function(e){
			switch(e.button){
				case 0:
					System.Mouse.left = true;
					break;
				case 1:
					System.Mouse.right = true;
					break;
			}
		});

		canvas.addEventListener("mouseup", function(e){
			switch(e.button){
				case 0:
					System.Mouse.left = false;
					break;
				case 1:
					System.Mouse.right = false;
					break;
			}
		});

		canvas.addEventListener("contextmenu", function(e){
			e.preventDefault();
		});
	},
	Shaders: {
		ActiveShader: undefined,
		BuildShader: function(gl, type, src){
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
		LinkProgram: function(gl, vertex, fragment){
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
		},
		UseProgram: function(program){
			this.Shaders.ActiveShader = program;
			gl.useProgram(program);
		},
	},
	Keyboard: {
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
	},
	Mouse: {
		x: 0,
		y: 0,
		left: false,
		right: false
	},
	Display: {
		Clear: function(){
			gl.clear(gl.COLOR_BUFFER_BIT);
		},
		ClearColor: function(r, g, b){
			gl.clearColor(r, g, b, 1.0);
		}
	},
};

var Maths = {
	Matrix: {
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
	}
};

var Drawing = {
	Modes: {
		POINTS: gl.POINTS,
		LINES: gl.LINES,
		LINE_STRIP: gl.LINE_STRIP,
		TRIANGLES: gl.TRIANGLES,
		TRIANGLE_STRIP: gl.TRIANGLE_STRIP,
		TRIANGLE_FAN: gl.TRIANGLE_FAN
	},
	VertexArray: function(drawMode, texture){
		this.drawMode = drawMode;
		this.texture = texture;
		this.vertices = [];
		this.update = true;

		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();
		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

		this.draw = function(){
			gl.bindVertexArray(this.vao);
			gl.bindBuffer(GL_ARRAY_BUFFER, this.vbo);

			if(this.texture != undefined)
				gl.bindTexture(GL_TEXTURE_2D, this.texture.id);

			if(this.update)
				this.build();

			
		}
		this.addVertex = function(vertex){
			if (!vertex) vertex = {};
			if (!vertex.x) vertex.x = 0;
			if (!vertex.y) vertex.y = 0;
			if (!vertex.r) vertex.r = 0;
			if (!vertex.g) vertex.g = 0;
			if (!vertex.b) vertex.b = 0;
			if (!vertex.tx) vertex.tx = 0;
			if (!vertex.ty) vertex.ty = 0;

			this.vertices.push(vertex);
		},
		this.build = function(){},
	},
	Sprite: function(){
		this.prototype = new VertexArray();
	},
};

System.Init();
