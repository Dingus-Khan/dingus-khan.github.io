var Sprite = function(texture, x, y, w, h, tx, ty, tw, th){
	Drawable.call(this, gl.TRIANGLE_STRIP, 4);

	this.bufferData = [
		0, 0, tx, ty, 1, 1, 1,
		0, h, tx, ty + th, 1, 1, 1,
		w, 0, tx + tw, ty, 1, 1, 1,
		w, h, tx + tw, ty + th, 1, 1, 1
	];

	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.model = Matrix.identity();

	this.changeTex = function (tx, ty, tw, th) {
		this.bufferData = [2] = tx;
		this.bufferData = [3] = ty;

		this.bufferData = [9] = tx;
		this.bufferData = [10] = ty + th;

		this.bufferData = [16] = tx + tw;
		this.bufferData = [17] = ty;

		this.bufferData = [23] = tx + tw;
		this.bufferData = [24] = ty + th;
	};

	this.render = function(){
		spriteShader.use();
		spriteShader.setUniform("model", this.model);
		this.draw(spriteShader, this.texture);
	}
}

requestAnimationFrame(run);
function run() {
	Keyboard.update();
	Clear();
	requestAnimationFrame(run);
}
