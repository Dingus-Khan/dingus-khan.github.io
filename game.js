var game = new Window(800, 600, 800, 600);
var sprite = new Sprite("circle.png", 0, 0, 100, 100, 0, 0, 100, 100, 0, 1, 1);

/**********************************\
\**********************************/

class EntityHandler {
	constructor(){
		this.entities = [];
		this.entityId = 1;
	}

	getEntity(id){
		return this.entities.find(function(entity){ return entity.id == id; });
	}

	registerEntity(entity){
		entity.id = this.entityId;
		this.entityId++;
	}

	unregisterEntity(id){
		var index = this.entities.findIndex(function(entity){return entity.id == id;});
		this.entities.splice(index, 1).id = undefined;
	}

	getNearbyEntities(id, range){
		var item = this.entities.findIndex(function(elem){ return elem.id == id; });
		return this.entities.filter(function(entity){
			var dx = entity.transform.x - this.entities[item].transform.x;
			var dy = entity.transform.y - this.entities[item].transform.y;

			return Math.abs(dx) <= range || Math.abs(dy) <= range;
		});
	}
}

var target = {x: 0, y: 0};
var targetSz = {w: 100, h: 100};

requestAnimationFrame(run);
function run(t) {
	sprite.transform.setPosition(lerp(sprite.transform.x, target.x, 0.1), lerp(sprite.transform.y, target.y, 0.1));
	sprite.setSize(lerp(sprite.w, targetSz.w, 0.1), lerp(sprite.h, targetSz.h, 0.1));

	Keyboard.update();
	game.clear();
	game.draw(sprite);
	requestAnimationFrame(run);
}
