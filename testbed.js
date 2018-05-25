// SHADER CODE
var ShaderCache = {
	"sprite": {},
	"debug": {},
	"tile": {},
};



var spritesheet = new Texture("test.png");
var sprite = new Sprite(0, 0, 120, 120, 0, 0, 120, 120, spritesheet, 1.0, 1.0, 1.0);
sprite.move(370, 270);

var tileSet = new Texture("tileset.png");
TileBatch.init(tileSet);



requestAnimationFrame(run);
function run() {
	Camera.update();
	Keyboard.update();
	gl.clear(gl.COLOR_BUFFER_BIT);
	sprite.draw();
	requestAnimationFrame(run);
}
