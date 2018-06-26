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
    outColour = texture(texImage, vec2(Tex.x / float(texSize.x), Tex.y / float(texSize.y))) * vec4(Col, 1.0);
}`;

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 7, 0);
shader.addAttribute("col", 2, gl.FLOAT, false, 7, 2);
shader.addAttribute("tex", 2, gl.FLOAT, false, 7, 5);
shader.use();

shader.setUniform("proj", proj);

var Tile = function(tx, ty, tw, th, w, h){
	this.x = 0;
	this.y = 0;
	this.w = w || tw;
	this.h = h || th;
	this.tx = tx;
	this.ty = ty;
	this.tw = tw;
	this.th = th;
}

var Tiles = {
	"Platform": function(){ return new Tile(0, 0, 100, 100)},
	"PlatformEdge": function(){ return new Tile(100, 0, 100, 100); },
	"PlatformBreakR": function(){ return new Tile(200, 0, 100, 100); },
	"RedCircle": function(){ return new Tile(300, 0, 200, 200); },
	"BlueCircle": function(){ return new Tile(500, 0, 200, 200); },
	"PlatformBreakL": function(){ return new Tile(700, 0, 100, 100); },
	"PlatformStandEnd": function(){ return new Tile(0, 100, 100, 100); },
	"PlatformEdgeStand": function(){ return new Tile(100, 100, 100, 100); },
	"PlatformStandMiddle": function(){ return new Tile(100, 200, 100, 100); },
	"BlueSafeZone": function(){ return new Tile(400, 200, 100, 100); },
	"RedSafeZone": function(){ return new Tile(500, 200, 100, 100); },
	"BlueSpawnZone": function(){ return new Tile(600, 200, 100, 100); },
	"RedSpawnZone": function(){ return new Tile(700, 200, 100, 100); }
};

requestAnimationFrame(run);
function run() {
	Keyboard.update();
	Clear();
	requestAnimationFrame(run);
}
