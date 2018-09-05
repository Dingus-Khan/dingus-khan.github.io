var game = new Window(1440, 900, 1440, 900);
Keyboard.registerKey('space', 32);

// Texture Array - https://github.com/WebGLSamples/WebGL2Samples/blob/master/samples/texture_2d_array.html#L145-L160
function loadTextures(w, h){ // loads texture images into textures, and then compiles them into a single 3d sampler2Darray
	// prep image data into single Image object
	var images = document.querySelectorAll('img');

	var imgCanvas = document.createElement("canvas");
	imgCanvas.width = w;
	imgCanvas.height = h * images.length;
	var imgCtx = imgCanvas.getContext("2d");
	for(var img = 0; img < images.length; img++){
		imgCtx.drawImage(images[img], 0, img * h);
	}

	var imgData = imgCtx.getImageData(0, 0, w, h * images.length);
	var buf = new Uint8Array(imgData.data.buffer);

	var texture = gl.createTexture();
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D_ARRAY, texture);
	gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, gl.RGBA, w, h, images.length, 0, gl.RGBA, gl.UNSIGNED_BYTE, buf);

	gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.generateMipmap(gl.TEXTURE_2D_ARRAY);

	return {texture: texture, w: w, h: h, count: images.length};
}

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
		super("Graphic");
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
			0, this.h, this.tx, this.ty + this.th, this.textureId, this.r, this.g, this.b
		];
	}
}

class TransformComponent extends Component{
	constructor(originx, originy){
		super("Transform");
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
	constructor(){ // textures = array of texture data
		this.entities = [];
		this.texture = loadTextures(500, 500);

		this.vao = gl.createVertexArray();
		this.vbo = gl.createBuffer();

		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

		this.bufferData = [];

		this.shader = new Shader(
			`#version 300 es
			in vec2 pos;
			in vec2 tex;
			in float texId;
			in vec3 col;
			out vec2 Tex;
			out float TexId;
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
			precision highp sampler2DArray;
			in vec2 Tex;
			in float TexId;
			in vec3 Col;
			out vec4 outColour;
			uniform sampler2DArray texImages;
			void main(){
				outColour = texture(texImages, vec3(Tex, TexId)) * vec4(Col, 1);
			}`
		);
		this.shader.addAttribute("pos", 2, gl.FLOAT, false, 8, 0);
		this.shader.addAttribute("tex", 2, gl.FLOAT, false, 8, 2);
		this.shader.addAttribute("texId", 1, gl.FLOAT, false, 8, 4);
		this.shader.addAttribute("col", 3, gl.FLOAT, false, 8, 5);
		this.transform = new Transform(0, 0);
	}

	addEntity(e){
		this.entities.push(e);
		e.entityId = this.entities.length - 1;
	}

	removeEntity(id){
		this.entities.splice(id, 1).entityId = undefined;
	}

	getEntity(id){
		return this.entities[id];
	}

	draw(camera){
		var renderables = this.entities.filter(function(elem){ return elem.Graphic != undefined; });
		this.bufferData = [];
		for(var i = 0; i < renderables.length; i++){
			renderables[i].Graphic.build();
			this.bufferData = this.bufferData.concat(renderables[i].Graphic.bufferData);
		}

		gl.bindVertexArray(this.vao);
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferData), gl.STATIC_DRAW);

		this.shader.use();
		this.shader.enableAttributes();
		this.shader.setUniform("proj", camera.proj);
		this.shader.setUniform("view", camera.view);
		this.shader.setUniform("model", this.transform.matrix);
		this.shader.setUniform("texSize", [this.texture.w, this.texture.h]);

		gl.bindTexture(gl.TEXTURE_2D_ARRAY, this.texture.texture);

		gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.bufferData.length / 8);
	}
}

game.t = 0;
game.pastTime = 0;

var manager = new EntityManager();

var man = new Entity();
man.addComponent(new GraphicComponent(0, 100, 100, 0, 0, 100, 100, 1, 1, 1));
manager.addEntity(man);

var cow = new Entity();
cow.addComponent(new GraphicComponent(1, 100, 100, 0, 0, 100, 100, 1, 1, 1));
manager.addEntity(cow);

requestAnimationFrame(run);
function run(t) {
	game.t = t - game.pastTime;
	game.pastTime = t;



	game.clear();
	game.draw(manager);
	requestAnimationFrame(run);
}
