var game = new Window(800, 600, 800, 600);

class EntityHandler {
	constructor(){
		this.entities = [];
		this.entityId = 1;
	}

	registerEntity(entity){
		this.entities[this.entityId] = entity;
		entity.id = this.entityId;
		entity.components = {};
		entity.addComponent = function(component){ this.components[component.name] = component; }
		entity.removeComponent = function(component){ if (component.name !== undefined){ component = component.name } this.component[component] = undefined; }
		this.entityId++;
	}

	unregisterEntity(id){
		this.entities[id].entity.id = undefined;
		entity.components = undefined;
		entity.addComponent = undefined;
		entity.removeComponent = undefined;
		this.entities[id] = undefined;
	}

	getEntity(id){
		return this.entities[id];
	}
}

////////////////////////////////////////
var entities = new EntityHandler();

var sprite = new Sprite("circle.png", 0, 0, 100, 100, 0, 0, 100, 100, 0, 1, 1);
entities.registerEntity(sprite);

function addSprite(){
	var spr = new Sprite("circle.png", 0, 0, 100, 100, 0, 0, 100, 100, Math.rand(), Math.rand(), Math.rand());
	entities.registerEntity(sprite);
	return spr;
}

var renderables = entities.entities.filter(function(entity){ return entity.draw !== undefined; })

requestAnimationFrame(run);
function run(t) {
	game.t = t - this.pastTime;
	this.pastTime = t;
	//console.log(game.t);

	Keyboard.update();

	if (Keyboard.wasKeyPressed('space')){
		addSprite();
		renderables = entities.entities.filter(function(entity){ return entity.draw !== undefined; })
	}

	game.clear();
	for (i = 0; i < renderables.length; i++)
		game.draw(renderables[i]);
	requestAnimationFrame(run);
}
