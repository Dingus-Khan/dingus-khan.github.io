

Keyboard.registerKey('t', 84);


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

var Button = function(x, y, w, h, tx, ty, tw, th){
	Drawable.call(this, gl.TRIANGLE_STRIP, 0);

	this.bufferData = [
		0, 0, tx, ty, 1, 1, 1,
		w, 0, tx + tw, ty, 1, 1, 1,
		0, h, tx, ty + th, 1, 1, 1,
		w, h, tx + tw, ty + th, 1, 1, 1
	];
}

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

	this.buttons = [];

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
	panel.render(panelShader);
	requestAnimationFrame(run);
}
