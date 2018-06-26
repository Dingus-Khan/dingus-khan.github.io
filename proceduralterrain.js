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
	Drawable.call(this, gl.TRIANGLE_STRIP, 4);

	this.bufferData = [
		0, 0, Math.random(), Math.random(), Math.random(),
	];

	var width = 17;
	var height = 17;
	for(r = 0; r < width; r++){
		for(c = 0; c < height; c++){
			this.bufferData.push(r * 30, c * 30, Math.random(), Math.random(), Math.random());
		}
	}

	this.vertexCount = this.bufferData.length / 5;
}

var c = new Terrain();
var x = 100;
var y = 100;
var z = 0;
var xInc = 100;

requestAnimationFrame(run);
function run() {

	if (Keyboard.wasKeyPressed('right')){
		if (z == 0){
			x += xInc;
			y -= 100;
			z = 1;
		} else {
			y += 100;
			z = 0;
		}

		c.bufferData.push(x, y, Math.random(), Math.random(), Math.random());
		c.updateBuffer = true;
		c.vertexCount = c.bufferData.length / 5;

		if (x > 800){
			xInc = -xInc;
			y += 100;
		}
	}

	Keyboard.update();
	Clear();
	c.draw(shader);
	requestAnimationFrame(run);
}
