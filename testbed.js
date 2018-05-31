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

requestAnimationFrame(run);
function run() {
	Clear();
	requestAnimationFrame(run);
}
