var vertexShader = `#version 300 es
in vec2 pos;
in vec2 tex;

out vec2 Tex;

uniform mat4 proj;
uniform mat4 model;

uniform vec2 texSize;

void main(){
	Tex = tex / texSize;
    gl_Position = proj * model * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;
out vec4 outColour;

in vec2 Tex;

uniform sampler2D texImage;

void main(){
    outColour = texture(texImage, Tex);
}`;

Keyboard.registerKey('w', 87);
Keyboard.registerKey('a', 65);
Keyboard.registerKey('s', 83);
Keyboard.registerKey('d', 68);

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 4, 0);
shader.addAttribute("tex", 2, gl.FLOAT, false, 4, 2);
shader.use();

shader.setUniform("proj", [2 / 800, 0, 0, 0, 0, -2 / 600, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1]);

var drawable = new Drawable(gl.TRIANGLE_STRIP, 0);

drawable.bufferData = [
	0, 0, 0, 0,
	120, 0, 120, 0,
	0, 120, 0, 120,
	120, 120, 120, 120
];

drawable.vertexCount = drawable.bufferData.length / 4;

var t = new Texture("test.png");
shader.setUniform("texSize", [ t.image.width, t.image.height ]);

var vel = {
	x: 0,
	y: 0
};

var model = Matrix.identity();

var spd = 1;

function impulse(x, y){
	vel.x += (x / 2);
	vel.y += (y / 2);
}

var decay = 0;

requestAnimationFrame(run);
function run() {
	Keyboard.update();

	vel.x /= 2;
	vel.y /= 2;

	vel.x += Math.min((-Keyboard.getKey('a') + Keyboard.getKey('d')) * spd;
	vel.y += (-Keyboard.getKey('w') + Keyboard.getKey('s')) * spd;

	model = Matrix.translate(model, vel.x, vel.y);
	shader.setUniform("model", model);

	Clear();
	drawable.draw(shader, t);
	requestAnimationFrame(run);
}
