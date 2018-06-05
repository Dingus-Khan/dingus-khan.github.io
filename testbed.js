var vertexShader = `#version 300 es
in vec2 pos;

uniform mat4 proj;

void main(){
	gl_PointSize = 5.0;
    gl_Position = proj * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;

out vec4 outColour;

void main(){
    outColour = vec4(1);
}`;

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 4, 0);
shader.addAttribute("tex", 2, gl.FLOAT, false, 4, 2);
shader.use();

shader.setUniform("proj", [2 / 800, 0, 0, 0, 0, -2 / 600, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1]);

// particles: x, y, decay

var particles = new Drawable(gl.POINTS, 0);
var particleList = [];

requestAnimationFrame(run);
function run() {
	if (Mouse.left){
		particleList.unshift({x: Mouse.x, y: Mouse.y});
	}

	for(i = 0; i < particleList.length; i++){
		particles.bufferData = particles.bufferData.concat([particleList[i].x, particleList[i].y]);
		particles.vertexCount = particles.bufferData.length / 2;
		particles.updateBuffer = true;
	}

	Clear();
	particles.draw(shader);
	requestAnimationFrame(run);
}
