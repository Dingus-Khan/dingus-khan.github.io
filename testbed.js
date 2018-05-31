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
    outColour = vec4(1.0);
}`;

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 0, 0);
shader.use();

shader.setUniform("proj", [2 / 800, 0, 0, 0, 0, -2 / 600, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1]);

var drawable = new Drawable(gl.TRIANGLES, 0);

requestAnimationFrame(run);
function run() {
	drawable.bufferData = [
		Math.abs(Math.sin(performance.now()) + (Math.random())), Math.abs(Math.sin(performance.now()) + (Math.random() * 100)),
		Math.abs(Math.sin(performance.now()) + (Math.random() * 100)), Math.abs(Math.sin(performance.now()) + (Math.random() * 100)),
		Math.abs(Math.sin(performance.now()) + (Math.random() * 100)), Math.abs(Math.sin(performance.now()) + (Math.random() * 100))
	];

	drawable.vertexCount = drawable.bufferData.length / 2;
	drawable.updateBuffer = true;

	Clear();
	drawable.draw(shader);
	requestAnimationFrame(run);
}
