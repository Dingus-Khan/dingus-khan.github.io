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
		this.textureId = textureId;
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
			0, 0, this.tx, this.ty, this.textureId, this.r, this.g, this.b,
			this.w, 0, this.tx + this.tw, this.ty, this.textureId, this.r, this.g, this.b,
			this.w, this.h, this.tx + this.tw, this.ty + this.th, this.textureId, this.r, this.g, this.b,
			0, 0, this.tx, this.ty, this.textureId, this.r, this.g, this.b,
			this.w, this.h, this.tx + this.tw, this.ty + this.th, this.textureId, this.r, this.g, this.b,
			0, this.h, this.tx, this.ty + this.th, this.textureId, this.r, this.h, this.b
		];
	}
}

class TransformComponent extends Component{
	constructor(originx, originy){
		base("Transform");
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
}

// EntityManager - Renderer...
class EntityManager {
	constructor(){
		this.entities = [];

		this.shader = new Shader(
			`#version 300 es
			in vec2 pos;
			in vec2 tex;
			in int texId;
			in vec3 col;
			out vec2 Tex;
			out int TexId;
			out vec3 Col;
			uniform vec2 texSize;
			uniform mat4 proj;
			uniform mat4 view;
			uniform mat4 model;
			void main(){
				Tex = tex / texSize;
				TexId = texId;
				Col = col;
				gl_Position = proj * view * model * vec4(pos, 0, 1);
			}`,
			`#version 300 es
			precision mediump float;
			in vec2 Tex;
			in int TexId;
			in vec3 Col;
			out vec4 outColour;
			uniform sampler2D texImage;
			void main(){
				outColour = texture(texImage, Tex) * vec4(Col, 1);
			}`
		);
		this.shader.addAttribute("pos", 2, gl.FLOAT, false, 8, 0);
		this.shader.addAttribute("tex", 2, gl.FLOAT, false, 8, 2);
		this.shader.addAttribute("texId", 1, gl.FLOAT, false, 8, 4);
		this.shader.addAttribute("col", 3, gl.FLOAT, false, 8, 5);
	}

	addEntity(e){
		this.entities.push(e);
		e.entityId = this.entities.lenth - 1;
	}

	removeEntity(id){
		this.entities.splice(id, 1).entityId = undefined;
	}

	getEntity(id){
		return this.entities[id];
	}

	render(){
		var renderables = this.entities.filter(function(elem){ return elem.Graphic != undefined; });
		var buffer = [];
		for(i = 0; i < renderables.length; i++){
			buffer = buffer.concat(renderables.bufferData);
		}
	}
}

game.t = 0;
game.pastTime = 0;

requestAnimationFrame(run);
function run(t) {
	game.t = t - game.pastTime;
	game.pastTime = t;


	game.clear();
	requestAnimationFrame(run);
}
