var camera = new Camera(0, 0, 800, 600);

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
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		for(t = 0; t < this.tiles.length; t++){
			this.bufferData.push(
				this.tiles[t].x, this.tiles[t].y, this.tiles[t].tx, this.tiles[t].ty, this.tiles[t].r, this.tiles[t].g, this.tiles[t].b,
				this.tiles[t].x + this.tiles[t].w, this.tiles[t].y, this.tiles[t].tx + this.tiles[t].tw, this.tiles[t].ty, this.tiles[t].r, this.tiles[t].g, this.tiles[t].b,
				this.tiles[t].x + this.tiles[t].w, this.tiles[t].y + this.tiles[t].h, this.tiles[t].tx + this.tiles[t].tw, this.tiles[t].ty + this.tiles[t].th, this.tiles[t].r, this.tiles[t].g, this.tiles[t].b,

				this.tiles[t].x, this.tiles[t].y, this.tiles[t].tx, this.tiles[t].ty, this.tiles[t].r, this.tiles[t].g, this.tiles[t].b,
				this.tiles[t].x + this.tiles[t].w, this.tiles[t].y + this.tiles[t].h, this.tiles[t].tx + this.tiles[t].tw, this.tiles[t].ty + this.tiles[t].th, this.tiles[t].r, this.tiles[t].g, this.tiles[t].b,
				this.tiles[t].x, this.tiles[t].y + this.tiles[t].h, this.tiles[t].tx, this.tiles[t].ty + this.tiles[t].th, this.tiles[t].r, this.tiles[t].g, this.tiles[t].b
			);
		};
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferData), gl.STATIC_DRAW);
		this.rebuild = false;
	}

	this.draw = function(){
		if (this.tiles.length == 0)
			return;

		gl.bindVertexArray(this.vao);

		if (this.rebuild)
			this.build();

		this.shader.use();
		this.shader.setUniform("proj", camera.proj);
		this.shader.setUniform("view", camera.view);
		this.shader.setUniform("texSize", [this.tex.image.width, this.tex.image.height])
		this.tex.bind();
		gl.drawArrays(gl.TRIANGLES, 0, this.tiles.length * 6);
	}
}

var Sprite = function(tex){
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

	this.vao = gl.createVertexArray();
	this.vbo = gl.createBuffer();
	this.bufferData = [
		0, 0, 0, 0, 1, 1, 1,
		32, 0, 16, 0, 1, 1, 1,
		0, 64, 0, 32, 1, 1, 1,
		32, 64, 16, 32, 1, 1, 1
	];

	gl.bindVertexArray(this.vao);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferData), gl.STATIC_DRAW);
	this.shader.enableAttributes();

	this.model = Matrix.identity();
	this.x = 0;
	this.y = 0;

	this.spd = 2;
	this.vel = {
		x: 0,
		y: 0
	};

	this.draw = function(){
		this.model = Matrix.translate(this.model, this.vel.x, this.vel.y);

		if (this.bufferData.length == 0)
			return;

		gl.bindVertexArray(this.vao);

		if (this.rebuild)
			this.build();

		this.shader.use();
		this.shader.setUniform("proj", camera.proj);
		this.shader.setUniform("view", camera.view);
		this.shader.setUniform("model", this.model);
		this.shader.setUniform("texSize", [this.tex.image.width, this.tex.image.height])
		this.tex.bind();
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.bufferData.length / 7);
	}
}

gl.clearColor(0.1, 0.1, 0.1, 1.0);

var tm = new TileMap("tileset.png");
tm.addTile(0, 0, 100, 100, 0, 0, 100, 100, 1, 1, 1);
tm.addTile(100, 0, 100, 100, 0, 0, 100, 100, 1, 1, 1);
var spr = new Sprite("character.png");

Keyboard.registerKey('up', 38);
Keyboard.registerKey('left', 37);
Keyboard.registerKey('down', 40);
Keyboard.registerKey('right', 39);

var timer = 0, max = 10;

requestAnimationFrame(run);
function run() {
	spr.vel.x = (-Keyboard.getKey('left') + Keyboard.getKey('right')) * spr.spd;
	spr.vel.y = (-Keyboard.getKey('up') + Keyboard.getKey('down')) * spr.spd;

	gl.clear(gl.COLOR_BUFFER_BIT);
	tm.draw();
	spr.draw();
	requestAnimationFrame(run);
}
