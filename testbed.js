// SHADER CODE
var ShaderCache = {
	"sprite": {},
	"debug": {},
	"tile": {},
};

var Camera = {
	x: 0,
	y: 0,
	trauma: 0,
	r: 0,
	z: 1,
	updateMatrix: true,
	matrix: Matrix.identity(),
	panTo: function(x, y){
		this.x = -x;
		this.y = -y;
		this.updateMatrix = true;
	},
	rotateTo: function(r){
		this.r = -r;
		this.updateMatrix = true;
	},
	zoom: function(z){
		this.z = z;
		this.updateMatrix = true;
	},
	getMatrix: function(){
		if(this.updateMatrix){
			this.matrix = Matrix.identity();
			this.matrix = Matrix.translate(this.matrix, this.x, this.y);
			this.matrix = Matrix.rotate(this.matrix, this.r);
			this.matrix = Matrix.scale(this.matrix, this.z, this.z);
			this.updateMatrix = false;
		}
		return this.matrix;
	},
	update: function(){
		if (trauma > 0){
			trauma--;
		}
		var shakeX = (trauma * (-1 + getRandomInt(2));
		var shakeY = (trauma * (-1 + getRandomInt(2));
		var shakeR = (trauma * (-30 + getRandomInt(60));

		console.log(shakeX + " " + shakeY + " " + shakeR);
	}
};

var spritesheet = new Texture("test.png");
var sprite = new Sprite(0, 0, 120, 120, 0, 0, 120, 120, spritesheet, 1.0, 1.0, 1.0);

requestAnimationFrame(run);
function run() {
	Camera.update();
	Keyboard.update();
	gl.clear(gl.COLOR_BUFFER_BIT);
	sprite.draw();
	requestAnimationFrame(run);
}
