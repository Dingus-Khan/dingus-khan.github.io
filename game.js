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

sprites.addSprite(0, 0, 100, 100, 0, 0, 100, 100, 1, 0.5, 0.5);

requestAnimationFrame(run);
function run(t) {
	game.t = t - this.pastTime;
	this.pastTime = t;

	game.clear();
	window.draw(sprites);
	requestAnimationFrame(run);
}
