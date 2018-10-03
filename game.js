// Rebuilding matrices code
canvas = document.getElementById("main");
gl = canvas.getContext("webgl2");

var vertexShader =
`#version 300 es
in vec2 pos;
uniform mat4 proj;
uniform mat4 view;
uniform mat4 model;
void main(){
	gl_Position = proj * view * model * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader =
`#version 300 es
precision mediump float;
out vec4 colour;
void main(){
	colour = vec4(1.0, 1.0, 1.0, 1.0);
}`;

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, gl.FALSE, 0, 0);
shader.enableAttributes();

// proj
var proj = [
	2 / 800, 0, 0, 0,
	0, 2 / 600, 0, 0,
	0, 0, 1, 0,
	-1, 1, 0, 1
];

// view (just an identity matrix for now)
var view = [
	1, 0, 0, 0,
	0, 1, 0, 0,
	0, 0, 1, 0,
	0, 0, 0, 1
];

// sprite data
var sprite = [
	0, 0, 100, 0, 100, 100,
	0, 0, 100, 100, 0, 100
];

var vao = gl.createVertexArray();
var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sprite), gl.STATIC_DRAW);

// draw code


// functions to be called in the game loop
function input(){
	console.log("-- input --");
}
function update(){
	console.log("-- update --");
}
function render(){
	console.log("-- render --");
}

function run(){
	input();
	run.t = performance.now();
	if (run.t - run.d >= run.m){
		run.d = run.t;
		update();
	}
	render();
	requestAnimationFrame(run);
};
run.m = 1000 / 60;
run.d = performance.now();
run.t = run.d;
run.s = run.d;
requestAnimationFrame(run);
