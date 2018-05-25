// SHADER CODE
var ShaderCache = {
	"sprite": {},
	"debug": {},
	"til0e": {},
};

var Camera = {
	x: 0,
	y: 0,
	r: 0,
	z: 0,
	update: true,
	matrix: Matrix.identity()
};

requestAnimationFrame(run);
function run() {
	Keyboard.update();
	gl.clear(gl.COLOR_BUFFER_BIT);
	requestAnimationFrame(run);
}
