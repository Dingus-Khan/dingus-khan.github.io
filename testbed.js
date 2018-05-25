// SHADER CODE
var ShaderCache = {
	"sprite": {},
	"debug": {},
	"tile": {},
};

var Camera = {
	x: 0,
	y: 0,
	r: 0,
	z: 1,
	update: true,
	matrix: Matrix.identity(),
	pan: function(x, y){
		this.x = -x;
		this.y = -y;
		this.update = true;
	},
	rotate: function(r){
		this.r = -r;
		this.update = true;
	},
	zoom: function(z){
		this.z = z;
		this.update = true;
	},
	getMatrix: function(){
		if(this.update){
			this.matrix = Matrix.identity();
			this.matrix = Matrix.translate(this.matrix, this.x, this.y);
			this.matrix = Matrix.rotate(this.matrix, this.r);
			this.matrix = Matrix.scale(this.matrix, this.z, this.z);
			this.update = false;
		}
		return this.matrix;
	},
};

var spritesheet = new Texture("test.png");
var sprite = new Sprite(0, 0, 120, 120, 0, 0, 120, 120, spritesheet, 1.0, 1.0, 1.0);

requestAnimationFrame(run);
function run() {
	Keyboard.update();
	gl.clear(gl.COLOR_BUFFER_BIT);
	sprite.draw();
	requestAnimationFrame(run);
}
