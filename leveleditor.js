var vertexShader = `#version 300 es
in vec2 pos;
in vec3 col;
in vec2 tex;

out vec2 Tex;
out vec3 Col;

uniform mat4 proj;
uniform mat4 model;

void main(){
	Tex = tex;
	Col = col;
    gl_Position = proj * model * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;

in vec2 Tex;
in vec3 Col;

out vec4 outColour;

uniform sampler2D texImage;

void main(){
	ivec2 texSize = textureSize(texImage, 0);
    outColour = texture(texImage, vec2(Tex.x / float(texSize.x), Tex.y / float(texSize.y))) * Col;
}`;

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 7, 0);
shader.addAttribute("col", 2, gl.FLOAT, false, 7, 2);
shader.addAttribute("tex", 2, gl.FLOAT, false, 7, 5);
shader.use();

shader.setUniform("proj", proj);

var Tile = function(x, y, w, h, tx, ty, tw, th){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.tx = tx;
	this.ty = ty;
	this.tw = tw;
	this.th = th;
}

var TileTypes = {
	"Platform": new Tile(0, 0, 100, 100, 0, 0, 100, 100)
};

requestAnimationFrame(run);
function run() {
	Keyboard.update();
	Clear();
	requestAnimationFrame(run);
}
