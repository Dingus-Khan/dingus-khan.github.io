var game = new Window(800, 600, 800, 600);
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

	render(){

	}
}

////////////////////////////////////////
var entities = new EntityHandler();

var sprite = new Sprite("circle.png", 0, 0, 100, 100, 0, 0, 100, 100, 0, 1, 1);
entities.registerEntity(sprite);

function addSprite(){
	var spr = new Sprite("circle.png", -350 + (Math.random() * 700), -250 + (Math.random() * 500), 100, 100, 0, 0, 100, 100, Math.random(), Math.random(), Math.random());
	entities.registerEntity(spr);
	return spr;
}


requestAnimationFrame(run);
function run(t) {
	game.t = t - this.pastTime;
	this.pastTime = t;

	Keyboard.update();
	game.clear();
	requestAnimationFrame(run);
}
