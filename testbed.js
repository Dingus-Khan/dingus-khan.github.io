var vertexShader = `#version 300 es
uniform mat4 proj;
void main(){
    gl_Position = proj * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;
out vec4 outColour;
void main(){
    outColour = vec4(1);
}`;

var shader = new Shader(vertexShader, fragmentShader);
shader.use();
shader.setUniform("proj", [2 / 800, 0, 0, 0, 0, -2 / 600, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1]);

requestAnimationFrame(run);
function run() {
	Clear();
	requestAnimationFrame(run);
}
