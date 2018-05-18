Keyboard.registerKey('left', 37);
Keyboard.registerKey('up', 38);
Keyboard.registerKey('right', 39);
Keyboard.registerKey('down', 40);
Keyboard.registerKey('space', 32);
Keyboard.registerKey('a', 65);
Keyboard.registerKey('d', 68);
Keyboard.registerKey('s', 83);
Keyboard.registerKey('w', 87);

requestAnimationFrame(run);

var DebugGraphics = {
	drawRect: function(x, y, w, h){
		
	},
};

function run() {
	gl.clear(gl.COLOR_BUFFER_BIT);
	requestAnimationFrame(run);
}
