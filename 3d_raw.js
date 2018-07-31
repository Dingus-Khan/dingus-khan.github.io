function BuildShader(type, src){
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
function LinkProgram(vertex, fragment){
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

var canvas = document.getElementById("main");
var gl = canvas.getContext("webgl2");

gl.enable(gl.DEPTH_TEST);
gl.clearColor(0.1, 0.1, 0.1, 1.0);

var vertexSource =
	`#version 300 es
	in vec3 pos;
	out vec3 Pos;
	uniform mat4 proj;
	uniform mat4 view;
	uniform mat4 model;
	void main(){
		Pos = pos;
		gl_Position = proj * view * model * vec4(pos, 1);
	}`;

var fragmentSource =
	`#version 300 es
	precision mediump float;
	in vec3 Pos;
	out vec4 outColour;
	void main(){
		outColour = vec4(Pos, 1.0);
	}`;

var bufferData = [
	-0.5, -0.5, -0.5,
	 0.5, -0.5, -0.5,
	 0.5,  0.5, -0.5,
	 0.5,  0.5, -0.5,
	-0.5,  0.5, -0.5,
	-0.5, -0.5, -0.5,

	-0.5, -0.5,  0.5,
	 0.5, -0.5,  0.5,
	 0.5,  0.5,  0.5,
	 0.5,  0.5,  0.5,
	-0.5,  0.5,  0.5,
	-0.5, -0.5,  0.5,

	-0.5,  0.5,  0.5,
	-0.5,  0.5, -0.5,
	-0.5, -0.5, -0.5,
	-0.5, -0.5, -0.5,
	-0.5, -0.5,  0.5,
	-0.5,  0.5,  0.5,

	 0.5,  0.5,  0.5,
	 0.5,  0.5, -0.5,
	 0.5, -0.5, -0.5,
	 0.5, -0.5, -0.5,
	 0.5, -0.5,  0.5,
	 0.5,  0.5,  0.5,

	-0.5, -0.5, -0.5,
	 0.5, -0.5, -0.5,
	 0.5, -0.5,  0.5,
	 0.5, -0.5,  0.5,
	-0.5, -0.5,  0.5,
	-0.5, -0.5, -0.5,

	-0.5,  0.5, -0.5,
	 0.5,  0.5, -0.5,
	 0.5,  0.5,  0.5,
	 0.5,  0.5,  0.5,
	-0.5,  0.5,  0.5,
	-0.5,  0.5, -0.5,
];

var vao = gl.createVertexArray();
var vbo = gl.createBuffer();
gl.bindVertexArray(vao);
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferData), gl.STATIC_DRAW);

var vertex = BuildShader(gl.VERTEX_SHADER, vertexSource);
var fragment = BuildShader(gl.FRAGMENT_SHADER, fragmentSource);
var shader = LinkProgram(vertex, fragment);

gl.useProgram(shader);
gl.vertexAttribPointer(gl.getAttribLocation(shader, "pos"), 3, gl.FLOAT, false, 3 * 4, 0 * 4);
gl.enableVertexAttribArray(gl.getAttribLocation(shader, "pos"));

var proj = mat4.create();
mat4.perspective(proj, 0.9, 4.0 / 3.0, 0.1, 100.0);

var view = mat4.create();
mat4.translate(view, view, [0, 0, -3]);

var model = mat4.create();

gl.uniformMatrix4fv(gl.getUniformLocation(shader, "proj"), false, proj);
gl.uniformMatrix4fv(gl.getUniformLocation(shader, "view"), false, view);
gl.uniformMatrix4fv(gl.getUniformLocation(shader, "model"), false, model);

var x = 0;
var z = 0;
var r = 0;

var game = new Window(800, 600, 800, 600);

Keyboard.registerKey('up', 38);
Keyboard.registerKey('left', 37);
Keyboard.registerKey('down', 40);
Keyboard.registerKey('right', 39);
Keyboard.registerKey('space', 32);

requestAnimationFrame(run);
function run(t) {
	Keyboard.update();

	r = (Keyboard.getKey('right') + -Keyboard.getKey('left')) * 1;
	z += Math.cos(r) * (Keyboard.getKey('up') + -Keyboard.getKey('down')) / 8;
	x -= Math.sin(r) * (Keyboard.getKey('up') + -Keyboard.getKey('down')) / 8;

	mat4.translate(view, mat4.create(), [0, 0, 0]);
	mat4.rotate(view, view, 1, [0, r, 0])
	mat4.translate(view, mat4.create(), [x, 0, z]);
	gl.uniformMatrix4fv(gl.getUniformLocation(shader, "view"), false, view);


	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, bufferData.length / 3);
	requestAnimationFrame(run);
}
