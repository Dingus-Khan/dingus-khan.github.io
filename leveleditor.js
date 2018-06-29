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
	this.texture = new Texture(texture, gl.REPEAT, gl.NEAREST);

	this.changeTexCoords = function (tx, ty, tw, th) {
		this.bufferData[2] = tx;
		this.bufferData[3] = ty;

		this.bufferData[9] = tx;
		this.bufferData[10] = ty + th;

		this.bufferData[16] = tx + tw;
		this.bufferData[17] = ty;

		this.bufferData[23] = tx + tw;
		this.bufferData[24] = ty + th;

		this.updateBuffer = true;
	};

	this.render = function(){
		spriteShader.use();
		this.model = Matrix.translate(this.model, this.x, this.y);
		spriteShader.setUniform("model", this.model);
		this.draw(spriteShader, this.texture);
	}
}

var spr = new Sprite("test.png", 0, 0, 100, 100, 0, 0, 100, 100);

requestAnimationFrame(run);
function run() {
	Keyboard.update();
	Clear();
	spr.render();
	requestAnimationFrame(run);
}
