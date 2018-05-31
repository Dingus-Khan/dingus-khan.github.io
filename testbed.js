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

var drawable = new Drawable(gl.TRIANGLE_FAN, 0);

var offset = 0;
var scale = 1;

drawable.bufferData = [];
for(i = 0; i < 600; i += 2){
	for(j = 0; j < 801; j++){
		offset += (-0.5 + Math.random());
		drawable.bufferData.push(j);
		drawable.bufferData.push(i + (offset * scale));
	}
}
drawable.vertexCount = drawable.bufferData.length / 2;

requestAnimationFrame(run);
function run() {

	Clear();
	drawable.draw(shader);
	requestAnimationFrame(run);
}
