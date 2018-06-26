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

Keyboard.registerKey('right', 39);

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 5, 0);
shader.addAttribute("col", 3, gl.FLOAT, false, 5, 2);
shader.use();

shader.setUniform("proj", proj);

var Terrain = function(){
	Drawable.call(this, gl.LINE_LOOP, 0);

	this.bufferData = [];
}

var c = new Terrain();
var x = Math.random() * 800;
var y = Math.random() * 600;

requestAnimationFrame(run);
function run() {

	if (Keyboard.getKey('right')){
		c.bufferData.push(x, y, Math.random(), Math.random(), Math.random());
		c.updateBuffer = true;
		c.vertexCount = c.bufferData.length / 5;

		x += (-30 + (Math.random() * 60));
		y += (-30 + (Math.random() * 60));
	}

	Keyboard.update();
	Clear();
	c.draw(shader);
	requestAnimationFrame(run);
}
