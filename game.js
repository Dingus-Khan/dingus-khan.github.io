var game = new Window(1440, 900, 1440, 900);
Keyboard.registerKey('space', 32);

// Texture Array - https://github.com/WebGLSamples/WebGL2Samples/blob/master/samples/texture_2d_array.html#L145-L160

// Entity Management
// Entities can have components
// Possible components are:
//		Graphic
//		Transform
//		Sound
//		Collision
//		Physics
//		Animation
class Entity {
	constructor(){
	}

	addComponent(component){
		this[component.type] = component;
	}
}

class Component {
	constructor(type){
		this.type = type;
	}
}

// Graphic
// basically holds a texture id and sprite definition (no transform or actual texture data)
class GraphicComponent extends Component{
	constructor(textureId, w, h, tx, ty, tw, th, r, g, b){
		base("Graphic");
		this.textureId = 0;
		this.w = w;
		this.h = h;
		this.tx = tx;
		this.ty = ty;
		this.tw = tw;
		this.th = th;
		this.r = r;
		this.g = g;
		this.b = b;
		this.bufferData = [];
	}

	build(){
		this.bufferData = [
			0, 0, this.tx, this.ty, this.r, this.g, this.b,
			this.w, 0, this.tx + this.tw, this.ty, this.r, this.g, this.b,
			this.w, this.h, this.tx + this.tw, this.ty + this.th, this.r, this.g, this.b,
			0, 0, this.tx, this.ty, this.r, this.g, this.b,
			this.w, this.h, this.tx + this.tw, this.ty + this.th, this.r, this.g, this.b,
			0, this.h, this.tx, this.ty + this.th, this.r, this.h, this.b
		];
	}
}

class TransformComponent extends Component{
	constructor(x, y){
		base("Transform");
		this.x = x;
		this.y = y;
	}
}

game.t = 0;
game.pastTime = 0;

requestAnimationFrame(run);
function run(t) {
	game.t = t - game.pastTime;
	game.pastTime = t;


	projectileHandler.update();
	game.clear();
	game.draw(sprites);
	requestAnimationFrame(run);
}
