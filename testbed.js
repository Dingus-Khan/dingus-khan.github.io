var vertexShader = `#version 300 es
in vec2 pos;
in vec4 col;
uniform mat4 proj;

out vec4 Col;

void main(){
	Col = col;
    gl_Position = proj * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;
in vec4 Col;
out vec4 outColour;
void main(){
    outColour = Col;
}`;

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 6, 0);
shader.addAttribute("col", 4, gl.FLOAT, false, 6, 2);
shader.use();

shader.setUniform("proj", [2 / 800, 0, 0, 0, 0, -2 / 600, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1]);

var drawable = new Drawable(gl.TRIANGLES, 0);

var x = 0;
var y = 0;

drawable.bufferData = [
	x, y, 1, 1, 1, 1,
	x + 50, y + 50, 1, 1, 1, 1,
	x, y + 100, 1, 1, 1, 1,
];

drawable.vertexCount = drawable.bufferData.length / 6;
drawable.updateBuffer = true;

var t = 0;
var vel = 50;
var dir = 1;

Keyboard.registerKey("right", 39);
Keyboard.registerKey("left", 37);

requestAnimationFrame(run);
function run() {
	vel += 1;

	x += vel;

	drawable.bufferData = [
		x, y, 1, 0, 0, 1,
		x - (vel * 100), y + 50, 1, 0, 0, 1,
		x, y + 100, 1, 0, 0, 1,
		x, y, 1, 1, 1, 1,
		x + (50 * dir), y + 50, 1, 1, 1, 1,
		x, y + 100, 1, 1, 1, 1,
	];

	drawable.vertexCount = drawable.bufferData.length / 6;
	drawable.updateBuffer = true;

	Clear();
	drawable.draw(shader);
	requestAnimationFrame(run);
}
