class SpriteBatch extends Drawable {
	constructor(tex){
		super(0, 0, 1, 1, 1);
		this.sprites = [];
		this.transform.setOrigin(0, 0);

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
	}

	addSprite(x, y, w, h, tx, ty, tw, th, r, g, b){
		this.sprites.push({x, y, w, h, tx, ty, tw, th, r, g, b});
	}

	build(){
		this.bufferData = [];
		for(var spr = 0; spr < this.sprites.length; spr++){
			var sprite = this.sprites[spr];
			this.bufferData.push(
				sprite.x, sprite.y, sprite.tx, sprite.ty, sprite.r, sprite.g, sprite.b,
				sprite.x + sprite.w, sprite.y, sprite.tx + sprite.tw, sprite.ty, sprite.r, sprite.g, sprite.b,
				sprite.x + sprite.w, sprite.y + sprite.h, sprite.tx + sprite.tw, sprite.ty + sprite.th, sprite.r, sprite.g, sprite.b,

				sprite.x, sprite.y, sprite.tx, sprite.ty, sprite.r, sprite.g, sprite.b,
				sprite.x + sprite.w, sprite.y + sprite.h, sprite.tx + sprite.tw, sprite.ty + sprite.th, sprite.r, sprite.g, sprite.b,
				sprite.x, sprite.y + sprite.h, sprite.tx, sprite.ty + sprite.th, sprite.r, sprite.g, sprite.b,
			);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferData), gl.STATIC_DRAW);
		}
	}

	draw(camera){
		if (this.sprites.length == 0)
			return;

		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		this.build();
		this.transform.update();

		this.shader.use();
		this.shader.enableAttributes();
		this.shader.setUniform("proj", camera.proj);
		this.shader.setUniform("view", camera.view);
		this.shader.setUniform("model", this.transform.matrix);
		this.shader.setUniform("texSize", [this.tex.image.width, this.tex.image.height])
		this.tex.bind();
		gl.drawArrays(gl.TRIANGLES, 0, this.bufferData.length / 7);
	}
}

var game = new Window(800, 600, 800, 600);

Keyboard.registerKey('space', 32);

class Projectiles {
	constructor(){
		this.projectiles = [];
		this.bodies = [];
		this.tex = new Texture("proj.png", gl.REPEAT, gl.NEAREST);
	}

	fire(x, y, vel, range, tX, tY){
		this.projectiles.push({
			x: x, y: y, vel: vel, range: range, tX: tX, tY: tY,
			sprite: new Sprite("proj.png", 0, 0, 20, 20, tX, tY, 20, 20, 1, 1, 1)
		});

		this.projectiles[this.projectiles.length - 1].tex = this.tex;
	}

	draw(game){
		for (var proj = 0; proj < this.projectiles.length; proj++){
			this.projectiles[proj].x += this.projectiles[proj].vel;
			this.projectiles[proj].range -= this.projectiles[proj].vel;
			this.projectiles[proj].sprite.transform.move(this.projectiles[proj].vel, 0);
			if (this.projectiles[proj].range <= 0) this.projectiles[proj].vel = 0;
			game.draw(this.projectiles[proj].sprite)
		}
	}
}

var projectiles = new Projectiles();

var batch = new SpriteBatch("proj.png");

requestAnimationFrame(run);
function run(t) {

	if (Keyboard.wasKeyPressed("space"))
		projectiles.fire(0, 0, 10, 1000, 0, 0);

	Keyboard.update();
	game.clear();
	game.draw(batch);
	//projectiles.draw(game);
	requestAnimationFrame(run);
}
