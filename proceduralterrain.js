var vertexShader = `#version 300 es
in vec2 pos;
in vec3 col;

out vec3 Col;

uniform mat4 proj;

void main(){
	Col = col;
    gl_Position = proj * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;

in vec3 Col;
out vec4 outColour;

void main(){
    outColour = vec4(Col, 1.0);
}`;

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 5, 0);
shader.addAttribute("col", 3, gl.FLOAT, false, 5, 2);
shader.use();

shader.setUniform("proj", proj);

var Terrain = function(){
	Drawable.call(this, gl.TRIANGLE_STRIP, 16);

	this.bufferData = [
		0, 0, 1.0, 1.0, 1.0,
		100, 0, 1.0, 1.0, 1.0,
		0, 100, 1.0, 1.0, 1.0,
		100, 100, 1.0, 1.0, 1.0,
		100, 0, 1.0, 1.0, 1.0,
		200, 0, 1.0, 1.0, 1.0,
		100, 100, 1.0, 1.0, 1.0,
		200, 100, 1.0, 1.0, 1.0,
		0, 100, 1.0, 1.0, 1.0,
		100, 100, 1.0, 1.0, 1.0,
		0, 200, 1.0, 1.0, 1.0,
		100, 200, 1.0, 1.0, 1.0,
		100, 100, 1.0, 1.0, 1.0,
		200, 100, 1.0, 1.0, 1.0,
		100, 200, 1.0, 1.0, 1.0,
		200, 200, 1.0, 1.0, 1.0
	];
}

var c = new Terrain();

requestAnimationFrame(run);
function run() {
	Clear();
	c.draw(shader);
	requestAnimationFrame(run);
}
