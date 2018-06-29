var Button = function(){
	Drawable.call(this, gl.TRIANGLE_STRIP, 4);


}

requestAnimationFrame(run);
function run() {
	Keyboard.update();
	Clear();
	requestAnimationFrame(run);
}
