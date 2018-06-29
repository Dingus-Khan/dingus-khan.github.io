Keyboard.registerKey('t', 84);

requestAnimationFrame(run);
function run() {
	Keyboard.update();
	Clear();
	requestAnimationFrame(run);
}
