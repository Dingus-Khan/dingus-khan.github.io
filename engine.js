class Game { // holds all other objects; contains input, update, and render methods.
	constructor(){
		this.time = 0;
		this.prevTime = 0;
		this.frameTime = 1000 / 60;
	}
	input(){
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
			console.log("tick: " + this.time);
		}
		this.render();
		requestAnimationFrame(this.run.bind(this));
	}
}

class KeyboardInput {

}

class MouseInput {

}

class GamePadInput {

}

class Shader {

}

class SpriteData { // Stores basic sprite data (w, h, tx, ty, tz, tw, th, r, g, b, transform, id(added by batch), zindex (handled by batch(usually -transform.y)), overrideZ (stops batch from changing zindex(for UI and other special elements))). this covers tiles and sprites, with extra code for animation in the Animation class

}

class SpriteBatch { // Stores and draws SpriteData

}

class TextureData { // Stores basic texture data (name, byte array, width, height, id(added by batch))

}

class TextureBatch { // Stores and handles TextureData (stores in multiple texture units)

}

class Transform { // setposition/rotation/scale, move/rotate/scale, update, getmatrix

}

class Camera {

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
	
}

class MathsUtilities {
	function normalizeVector(vec){
		var len = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
		return {
			x: x / len,
			y: y / len
		};
	}
}
