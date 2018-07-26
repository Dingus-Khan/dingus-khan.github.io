function Cube (sz){
	return [
/*		-sz,-sz,-sz,
		-sz,-sz, sz,
		-sz, sz, sz,
		sz, sz,-sz,
		-sz,-sz,-sz,
		-sz, sz,-sz,

		sz,-sz, sz,
		-sz,-sz,-sz,
		sz,-sz,-sz,
		sz, sz,-sz,
		sz,-sz,-sz,
		-sz,-sz,-sz,

		-sz,-sz,-sz,
		-sz, sz, sz,
		-sz, sz,-sz,
		sz,-sz, sz,
		-sz,-sz, sz,
		-sz,-sz,-sz,

		-sz, sz, sz,
		-sz,-sz, sz,
		sz,-sz, sz,
		sz, sz, sz,
		sz,-sz,-sz,
		sz, sz,-sz,

		sz,-sz,-sz,
		sz, sz, sz,
		sz,-sz, sz,
		sz, sz, sz,
		sz, sz,-sz,
		-sz, sz,-sz,

		sz, sz, sz,
		-sz, sz,-sz,
		-sz, sz, sz,
		sz, sz, sz,
		-sz, sz, sz,
		sz,-sz, sz*/
		0, 0, 0,
		10, 0, -100,
		5, 10, 100,
	];
}

class Shape extends Drawable {
	constructor(){
		super(0, 0, 1, 1, 1);
		this.transform.setOrigin(0, 0);
		this.bufferData = Cube(1);
		this.shader = new Shader(
			`#version 300 es
			in vec3 pos;
			uniform mat4 proj;
			uniform mat4 view;
			uniform mat4 model;
			void main(){
				gl_Position = proj * view * model * vec4(pos, 1);
			}`,
			`#version 300 es
			precision mediump float;
			out vec4 outColour;
			void main(){
				outColour = vec4(1.0, 1.0, 1.0, 1.0);
			}`
		);
		this.shader.addAttribute("pos", 3, gl.FLOAT, false, 3, 0);
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

		gl.drawArrays(gl.TRIANGLES, 0, this.bufferData.length / 3);
	}
}

var game = new Window(800, 600, 800, 600);
gl.enable(gl.DEPTH_TEST);

var ar = 800.0 / 600.0;
var znear = 1.0;
var zfar = 1000.0;
var range = znear - zfar;
var tanHalfFOV = 1;
game.camera.proj = mat4.create();
mat4.perspective(game.camera.proj, 0.785398, ar, znear, zfar);
var arr = [];
for(i = 0; i < 16; i++){
	arr.push(game.camera.proj[i]);
}
game.camera.proj = arr;
game.camera.view = Matrix.identity();

var shape = new Shape();
requestAnimationFrame(run);
function run(t) {
	//game.clear();
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	game.draw(shape);
	requestAnimationFrame(run);
}
