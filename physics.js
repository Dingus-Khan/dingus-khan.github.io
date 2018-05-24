Keyboard.registerKey('left', 37);
Keyboard.registerKey('up', 38);
Keyboard.registerKey('right', 39);
Keyboard.registerKey('down', 40);
Keyboard.registerKey('z', 90);
Keyboard.registerKey('a', 65);
Keyboard.registerKey('d', 68);
Keyboard.registerKey('s', 83);
Keyboard.registerKey('w', 87);

var DamageTypes = {
	NORMAL: 1,
	FIRE: 2,
	WATER: 3,
	ELECTRIC: 4,
	WIND: 5,
};

var DamageHandler = {
	entities: [],
	register: function(entity){
		entities.push(entity);
	},
	notifyAll: function(event){
		for(var entity in this.entities){
			entity.notify(event);
		}
	},
};

requestAnimationFrame(run);
function run() {
	Keyboard.update();
	gl.clear(gl.COLOR_BUFFER_BIT);
	requestAnimationFrame(run);
}
