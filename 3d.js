function Cube (sz){
	return [
		-sz, -sz, -sz,
		-sz, -sz, sz,
		-sz, sz, sz
	];
}

class Shape extends Drawable {
	constructor(){
		super(0, 0, 1, 1, 1);
		this.bufferData = Cube(0.5);
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
			uniform sampler2D texImage;
			void main(){
				outColour = vec4(Col, 1);
			}`
		);
		this.shader.addAttribute("pos", 2, gl.FLOAT, false, 5, 0);
		this.shader.addAttribute("col", 3, gl.FLOAT, false, 5, 2);
		this.shader.use();
		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferData), gl.STATIC_DRAW);
	}
	draw(camera){
		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferData), gl.STATIC_DRAW);

		this.shader.use();
		this.shader.enableAttributes();
		this.shader.setUniform("proj", camera.proj);
		this.shader.setUniform("view", camera.view);
		this.shader.setUniform("model", this.transform.matrix);

		gl.drawArrays(gl.TRIANGLES, 0, 4);
	}
}

var game = new Window(800, 600, 800, 600);
var shape = new Shape();
requestAnimationFrame(run);
function run(t) {
	game.clear();
	game.draw(shape);
	requestAnimationFrame(run);
}
