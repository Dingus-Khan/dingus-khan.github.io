var vertexShader = `#version 300 es
in vec2 pos;
uniform mat4 proj;
void main(){
    gl_Position = proj * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;
out vec4 outColour;
void main(){
    outColour = vec4(Col, 1.0);
}`;

requestAnimationFrame(run);
function run() {
	Clear();
	requestAnimationFrame(run);
}
