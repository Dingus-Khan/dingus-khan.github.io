

requestAnimationFrame(run);
function run() {
	Keyboard.update();
	gl.clear(gl.COLOR_BUFFER_BIT);
	requestAnimationFrame(run);
}
