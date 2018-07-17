class Keyboard {
	constructor(){
		this.KeyDown = {};
		this.KeyPressed = {};
		this.KeyMap = {};

		document.addEventListener("keydown", function(e){
			if (this.KeyDown[e.which] == false){
				this.KeyPressed[e.which] = true;
			} else {
				this.KeyPressed[e.which] = false;
			}

			this.KeyDown[e.which] = true;
		});

		document.addEventListener("keyup", function(e){
			this.KeyDown[e.which] = false;
			this.KeyPressed[e.which] = false;
		});
	}
	registerKey(key, code){
		this.KeyMap[key] = code;
		this.KeyDown[this.KeyMap[key]] = false;
		this.KeyPressed[this.KeyMap[key]] = false;
	}
	getKey(key){
		return this.KeyDown[this.KeyMap[key]];
	}
	wasKeyPressed(key){
		return this.KeyPressed[this.KeyMap[key]];
	}
	update(){
		for(var prop in this.KeyMap){
			this.keyPressed[this.keyMap[prop]] = false;
		}
	}
}

class Mouse {
	constructor(){
		this.x = 0;
		this.y = 0;
		this.left = 0;
		this.right = 0;

		document.addEventListener("mousemove", function(e){
			Mouse.x = e.clientX;
			Mouse.y = e.clientY;
		});

		document.getElementById("main").addEventListener("mousedown", function(e){
			switch(e.button){
				case 0:
					Mouse.left = true;
					break;
				case 1:
					Mouse.right = true;
					break;
			}
		});

		document.getElementById("main").addEventListener("mouseup", function(e){
			switch(e.button){
				case 0:
					Mouse.left = false;
					break;
				case 1:
					Mouse.right = false;
					break;
			}
		});
	}
}

class Window {
	constructor(w, h){
		this.width = w;
		this.height = h;

	}
}
