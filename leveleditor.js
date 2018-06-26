var vertexShader = `#version 300 es
in vec2 pos;
in vec3 col;

out vec3 Col;

uniform mat4 proj;
uniform mat4 model;

void main(){
	Col = col;
    gl_Position = proj * model * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;

in vec3 Col;

out vec4 outColour;

void main(){
    outColour = vec4(Col, 1.0);
}`;

Keyboard.registerKey('t', 84);

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 5, 0);
shader.addAttribute("col", 3, gl.FLOAT, false, 5, 2);
shader.use();

shader.setUniform("proj", proj);
shader.setUniform("model", Matrix.identity());

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

var TilePanel = function(){
	Drawable.call(this, gl.TRIANGLES, 0);

	this.bufferData.push(0, 0, 0.75, 0.75, 0.75);
	this.bufferData.push(0, 600, 0.75, 0.75, 0.75);
	this.bufferData.push(200, 600, 0.75, 0.75, 0.75);
	this.bufferData.push(0, 0, 0.75, 0.75, 0.75);
	this.bufferData.push(200, 600, 0.75, 0.75, 0.75);
	this.bufferData.push(200, 0, 0.75, 0.75, 0.75);

	this.show = true;
	this.vertexCount = this.bufferData.length / 5;
	this.updateBuffer = true;

	this.x = 600;
	this.y = 0;
	this.w = 200;
	this.h = 800;
	this.show = true;
	this.transition = false;

	this.render = function(shader){
		if (this.x > 600 && this.show == true)
			this.x -= 10;
		if (this.x < 800 && this.show == false)
			this.x += 10;

		this.model = Matrix.translation(this.x, this.y);
		shader.setUniform("model", this.model);
		this.draw(shader);
	}
}

var panel = new TilePanel();

requestAnimationFrame(run);
function run() {
	if (Keyboard.wasKeyPressed('t')){
		panel.show = !panel.show;
	}

	Keyboard.update();
	Clear();
	panel.render(shader);
	requestAnimationFrame(run);
}
