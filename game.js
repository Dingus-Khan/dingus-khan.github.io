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
sprites.addSprite(0, 0, 110, 110, 0, 0, 110, 110, 1, 0.5, 0.5);
var a = sprites.sprites[0];
var vel = {x: 0, y: 0};

game.t = 0;
game.pastTime = 0;

requestAnimationFrame(run);
function run(t) {
	game.t = t - game.pastTime;
	game.pastTime = t;

	if (Keyboard.getKey('space'))
		sprites.addSprite(Math.random() * 1330, Math.random() * 790, 110, 110, 0, 0, 110, 110, Math.random(), Math.random(), Math.random());

	vel.x = a.x - lerp(a.x, Mouse.x, game.t / 1000);
	vel.y = a.y - lerp(a.y, Mouse.y, game.t / 1000);

	a.x -= vel.x; a.y -= vel.y;
	game.clear();
	game.draw(sprites);
	requestAnimationFrame(run);
}
