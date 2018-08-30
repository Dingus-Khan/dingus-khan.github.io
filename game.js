var game = new Window(1440, 900, 1440, 900);
Keyboard.registerKey('space', 32);

class EntityHandler {
	constructor(){
		this.entities = {};
		this.renderables = [];
		this.entityId = 1;
	}

	registerEntity(entity){
		this.entities[this.entityId] = entity;
		entity.id = this.entityId;
		this.entityId++;

		if (entity.draw !== undefined)
			this.renderables.push(entity);
	}

	unregisterEntity(id){
		this.entities[id].entity.id = undefined;
		this.entities[id] = undefined;
		var ren = this.renderables.findIndex(function(elem){ return elem.id == id; });
		if (ren !== undefined){
			this.renderables.splice(ren, 1);
		}
	}

	getEntity(id){
		return this.entities[id];
	}
}

////////////////////////////////////////
var entities = new EntityHandler();

var sprites = new SpriteBatch(cowSheetUri.uri);
sprites.addSprite(-10, -10, 110, 110, 0, 0, 110, 110, 1, 0.5, 0.5);
var a = sprites.sprites[0];


requestAnimationFrame(run);
function run(t) {
	game.t = t - this.pastTime;
	this.pastTime = t;

	if (Keyboard.getKey('space'))
		sprites.addSprite(Math.random() * 800, Math.random() * 600, 110, 110, 0, 0, 110, 110, Math.random(), Math.random(), Math.random());

	a.x = lerp(a.x, Mouse.x, 0.01);
	a.y = lerp(a.y, Mouse.y, 0.01);

	game.clear();
	game.draw(sprites);
	requestAnimationFrame(run);
}
