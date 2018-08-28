var game = new Window(800, 600, 800, 600);
Keyboard.registerKey('space', 32);

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
	var spr = new Sprite("circle.png", -350 + (Math.random() * 700), -250 + (Math.random() * 500), 100, 100, 0, 0, 100, 100, Math.random(), Math.random(), Math.random());
	entities.registerEntity(spr);
	return spr;
}

var renderables = entities.entities.filter(function(entity){ return entity.draw !== undefined; })
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.FRONT_AND_BACK);
requestAnimationFrame(run);
function run(t) {
	game.t = t - this.pastTime;
	this.pastTime = t;
	console.log(game.t);


	if (Keyboard.wasKeyPressed('space')){
		addSprite();
		renderables = entities.entities.filter(function(entity){ return entity.draw !== undefined; })
	}

	Keyboard.update();
	game.clear();
	for (i = 0; i < renderables.length; i++)
		game.draw(renderables[i]);
	requestAnimationFrame(run);
}
