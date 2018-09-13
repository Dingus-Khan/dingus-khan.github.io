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
