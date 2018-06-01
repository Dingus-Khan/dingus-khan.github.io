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

drawable.bufferData = [
];

drawable.vertexCount = drawable.bufferData.length / 6;
drawable.updateBuffer = true;

requestAnimationFrame(run);
function run() {
	Clear();
	drawable.draw(shader);
	requestAnimationFrame(run);
}
