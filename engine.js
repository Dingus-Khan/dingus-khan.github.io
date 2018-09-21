	class Game { // holds all other objects; contains input, update, and render methods.
	constructor(){
		this.time = 0;
		this.prevTime = 0;
		this.frameTime = 1000 / 60;

		this.Keyboard = new KeyboardInput();
		this.Keyboard.registerKey('space', 32);
	}
	input(){
		this.Keyboard.update();
	}
	update(){
	}
	render(){
	}
	run(t){ // should be called inside the requestanimationframe call
		this.time += t - this.prevTime;
		this.prevTime = t;
		this.input();
		if (this.time >= this.frameTime){
			this.update();
			this.time -= this.frameTime;
		}
		this.render();
		requestAnimationFrame(this.run.bind(this));
	}
}

class KeyboardInput {
	constructor(){
		document.addEventListener("keydown", function(e){
			if (this.keyDown[e.which] == false){
				this.keyPressed[e.which] = true;
			} else {
				this.keyPressed[e.which] = false;
			}

			this.keyDown[e.which] = true;
		}.bind(this));

		document.addEventListener("keyup", function(e){
			this.keyDown[e.which] = false;
			this.keyPressed[e.which] = false;
		}.bind(this));

		this.keyDown = {};
		this.keyPressed = {};
		this.keyMap = {};
	}
	registerKey(key, code){
		this.keyMap[key] = code;
		this.keyDown[this.keyMap[key]] = false;
		this.keyPressed[this.keyMap[key]] = false;
	}
	getKey(key){
		return this.keyDown[this.keyMap[key]];
	}
	wasKeyPressed(key){
		return this.keyPressed[this.keyMap[key]];
	}
	update(){
		for(var prop in this.keyMap){
			this.keyPressed[this.keyMap[key]] = false;
		}
	}
}

class MouseInput {
	constructor(canvas){
		this.pos = new Vector2(0, 0);
		this.scroll = 0;
		this.left = false;
		this.right = false;

		document.addEventListener("mousemove", function(e){
			this.pos.x = e.clientX;
			this.pos.y = e.clientY;
		}.bind(this));

		document.addEventListener("wheel", function(e){
			this.scroll = clamp(e.deltaY, -1, 1);
		}.bind(this));

		canvas.addEventListener("mousedown", function(e){
			switch(e.button){
				case 0:
					this.left = true;
					break;
				case 1:
					this.right = true;
					break;
			}
		}.bind(this));

		canvas.addEventListener("mouseup", function(e){
			switch(e.button){
				case 0:
					this.left = false;
					break;
				case 1:
					this.right = false;
					break;
			}
		}.bind(this));

		canvas.addEventListener("contextmenu", function(e){
			e.preventDefault();
		});
	}
}

class GamePadInput {
	// Later...
}

class Shader {
	constructor(vertex, fragment){
		var v = Shader.BuildShader(gl.VERTEX_SHADER, vertex);
		var f = Shader.BuildShader(gl.FRAGMENT_SHADER, fragment);
		this.shader = Shader.LinkProgram(v, f);
		this.attributes = [];
	}

	static BuildShader(type, src){
		var shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);

		var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success){
			return shader;
		}

		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
	}

	static LinkProgram(vertex, fragment){
		var program = gl.createProgram();
		gl.attachShader(program, vertex);
		gl.attachShader(program, fragment);
		gl.linkProgram(program);

		var success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (success){
			return program;
		}

		console.log(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
	}

	addAttribute(name, count, type, normalise, stride, offset){
		var loc = gl.getAttribLocation(this.shader, name);
		if (loc != -1){
			this.attributes.push({
				loc: loc, count: count, type: type, normalise: normalise, stride: stride, offset: offset
			});
		}
	}
	enableAttributes(){
		for(let i = 0; i < this.attributes.length; i++){
			var attr = this.attributes[i];
			gl.vertexAttribPointer(attr.loc, attr.count, attr.type, attr.normalise, attr.stride * 4, attr.offset * 4);
			gl.enableVertexAttribArray(attr.loc);
		}
	}
	setUniform(name, value){
		var values = [].concat(value);

		var loc = gl.getUniformLocation(this.shader, name);
		switch(values.length){
			case 1:
				gl.uniform1fv(loc, values);
				break;
			case 2:
				gl.uniform2fv(loc, values);
				break;
			case 3:
				gl.uniform3fv(loc, values);
				break;
			case 4:
				gl.uniform4fv(loc, values);
				break;
			case 16:
				gl.uniformMatrix4fv(loc, false, values);
				break;
		}
	}
	use(){
		gl.useProgram(this.shader);
	}
}

class SpriteData { // Stores basic sprite data (w, h, tx, ty, tz, tw, th, r, g, b, transform, id(added by batch), zindex (handled by batch(usually -transform.y)), overrideZ (stops batch from changing zindex(for UI and other special elements))). this covers tiles and sprites, with extra code for animation in the Animation class
	constructor(x, y, w, h, tx, ty, tz, tw, th, r, g, b, overrideZ, zindex){
		this.w = w;
		this.h = h;
		this.tx = tx;
		this.ty = ty;
		this.tz = tz;
		this.tw = tw;
		this.th = th;

		this.overrideZ = overrideZ;
		this.zindex = zindex;

		this.transform = new Transform(0, 0);
		this.id = 0;
	}
}

class SpriteBatch { // Stores and draws SpriteData
	constructor(){
		this.sprites = [];
	}

	draw(){
		let buffer = [];
		for(i = 0; i < this.sprites.length; i++){
			let spr = sprites[i];
			let z = spr.overrideZ ? spr.zindex : -spr.transform.y;
			buffer.push(spr.transform.x, spr.transform.y, z, spr.tx, spr.ty, spr.tz, spr.r, spr.g, spr.b);
		}
	}
}

class TextureData { // Stores basic texture data (name, byte array, width, height, id(added by batch))

}

class TextureBatch { // Stores and handles TextureData (stores in multiple texture units)

}

class Transform {
	constructor(originx, originy){
		this.matrix = Matrix.identity();
		this.originX = originx;
		this.originY = originy;
		this.x = 0;
		this.y = 0;
		this.scaleX = 1;
		this.scaleY = 1;
		this.updateMatrix = true;
	}

	setOrigin(x, y){
		this.originX = x;
		this.originY = y;
		this.updateMatrix = true;
	}

	setPosition(x, y){
		this.x = x; // could add origin here, or handle in update function
		this.y = y;
		this.updateMatrix = true;
	}

	move(x, y){
		this.x += x;
		this.y += y;
		this.updateMatrix = true;
	}

	setScale(x, y){
		this.scaleX = x;
		this.scaleY = y;
		this.updateMatrix = true;
	}

	scale(x, y){
		this.scaleX += x;
		this.scaleY += y;
		this.updateMatrix = true;
	}

	update(){
		if (this.updateMatrix){
			this.matrix = Matrix.translation(-this.originX, -this.originY);
			this.matrix = Matrix.translate(this.matrix, this.x, this.y);
			this.matrix = Matrix.scale(this.matrix, this.scaleX, this.scaleY);
			this.updateMatrix = false;
		}
	}

	getTransformedCoords(){

	}
}

class Camera {
	constructor(x, y, w, h, projW, projH){
		this.projW = projW || w;
		this.projH = projH || h;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		this.proj = [
			2 / this.projW, 0, 0, 0,
			0, -2 / this.projH, 0, 0,
			0, 0, 1, 0,
			-1, 1, 0, 1
		];

		this.view = Matrix.translation(-this.x, -this.y);
	}

	panTo(x, y){
		this.x = x;
		this.y = y;
		this.view = Matrix.translation(-this.x, -this.y);
	}
}

class AudioData { // Stores audio data (name, byte array, duration)

}

class AudioHandler { // Plays audio when requested

}

class AnimationData { // stores a reference to a SpriteData object, and handles shifting frames and such on a timer

}

class AnimationHandler { // stores all AnimationData, and updates each one when necessary

}

class Vector2 {
	constructor(x, y){
		this.x = x || 0; this.y = y || 0;
	}

	normalize(){
		let len = Math.sqrt(this.x * this.x + this.y * this.y);
		this.x /= len;
		this.y /= len;
	}

	set(x, y){
		this.x = x;
		this.y = y;
	}

	getArray(){
		return [this.x, this.y];
	}
}

class Vector3 {
	constructor(x, y, z){
		this.x = x || 0; this.y = y || 0; this.z = z || 0;
	}

	normalize(){
		let len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
		this.x /= len;
		this.y /= len;
		this.z /= len;
	}

	set(x, y, z){
		this.x = x;
		this.y = y;
		this.z = z;
	}

	getArray(){
		return [this.x, this.y, this.z];
	}
}

class Timer {
	constructor(){
		this.startTime = Date.now();
	}

	getMilliseconds() {
		var t = Date.now() - this.startTime;
		this.startTime = Date.now();
		return t;
	}
}

class Matrix {
	static identity (){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	}
	static translation(x, y){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			Math.round(x), Math.round(y), 0, 1
		];
	}
	static translate(m, x, y){
		return this.multiply(m, this.translation(x, y));
	}
	static rotation(r){
		var sine = Math.sin(r);
		var cosine = Math.cos(r);
		return [
			cosine, -sine, 0, 0,
			sine, cosine, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	}
	static rotate(m, r){
		return this.multiply(m, this.rotation(r));
	}
	static scaling(sx, sy){
		return [
			sx, 0, 0, 0,
			0, sy, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	}
	static scale(m, sx, sy){
		return this.multiply(m, this.scaling(sx, sy));
	}
	static multiply(m1, m2){
		return [
			((m1[0] * m2[0]) + (m1[1] * m2[4]) + (m1[2] * m2[8]) + (m1[3] * m2[12])),
			((m1[0] * m2[1]) + (m1[1] * m2[5]) + (m1[2] * m2[9]) + (m1[3] * m2[13])),
			((m1[0] * m2[2]) + (m1[1] * m2[6]) + (m1[2] * m2[10]) + (m1[3] * m2[14])),
			((m1[0] * m2[3]) + (m1[1] * m2[7]) + (m1[2] * m2[11]) + (m1[3] * m2[15])),

			((m1[4] * m2[0]) + (m1[5] * m2[4]) + (m1[6] * m2[8]) + (m1[7] * m2[12])),
			((m1[4] * m2[1]) + (m1[5] * m2[5]) + (m1[6] * m2[9]) + (m1[7] * m2[13])),
			((m1[4] * m2[2]) + (m1[5] * m2[6]) + (m1[6] * m2[10]) + (m1[7] * m2[14])),
			((m1[4] * m2[3]) + (m1[5] * m2[7]) + (m1[6] * m2[11]) + (m1[7] * m2[15])),

			((m1[8] * m2[0]) + (m1[9] * m2[4]) + (m1[10] * m2[8]) + (m1[11] * m2[12])),
			((m1[8] * m2[1]) + (m1[9] * m2[5]) + (m1[10] * m2[9]) + (m1[11] * m2[13])),
			((m1[8] * m2[2]) + (m1[9] * m2[6]) + (m1[10] * m2[10]) + (m1[11] * m2[14])),
			((m1[8] * m2[3]) + (m1[9] * m2[7]) + (m1[10] * m2[11]) + (m1[11] * m2[15])),

			((m1[12] * m2[0]) + (m1[13] * m2[4]) + (m1[14] * m2[8]) + (m1[15] * m2[12])),
			((m1[12] * m2[1]) + (m1[13] * m2[5]) + (m1[14] * m2[9]) + (m1[15] * m2[13])),
			((m1[12] * m2[2]) + (m1[13] * m2[6]) + (m1[14] * m2[10]) + (m1[15] * m2[14])),
			((m1[12] * m2[3]) + (m1[13] * m2[7]) + (m1[14] * m2[11]) + (m1[15] * m2[15]))
		];
	}

	// Think about how to multiply a matrix by a vector and return it
	// Used for producing the translated coordinates on the CPU for the spritebatching
};

class MathsUtilities {
	normalizeVector(vec){
		var len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
		return {
			x: x / len,
			y: y / len
		};
	}
}
