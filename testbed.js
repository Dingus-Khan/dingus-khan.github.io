var vertexShader = `#version 300 es
in vec2 pos;
in vec4 col;
uniform mat4 proj;

out vec4 Col;

void main(){
	Col = col;
    gl_Position = proj * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;
in vec4 Col;
out vec4 outColour;
void main(){
    outColour = Col;
}`;

var shader = new Shader(vertexShader, fragmentShader);
shader.addAttribute("pos", 2, gl.FLOAT, false, 6, 0);
shader.addAttribute("col", 4, gl.FLOAT, false, 6, 2);
shader.use();

shader.setUniform("proj", [2 / 800, 0, 0, 0, 0, -2 / 600, 0, 0, 0, 0, 1, 0, -1, 1, 0, 1]);

function SquareBatch(){
	Drawable.call(this, gl.TRIANGLES);

	this.squares = [];
	this.add = function(square){
		this.squares.push(square);
	}
	this.refresh = function(){
		this.bufferData = [];
		for(i = 0; i < this.squares.length; i++){
			var s = this.squares[i];
			s.update();
			this.bufferData = this.bufferData.concat([
				s.x, s.y, s.r, s.g, s.b, 1.0,
				s.x + s.w, s.y, s.r, s.g, s.b, 1.0,
				s.x + s.w, s.y + s.h, s.r, s.g, s.b, 1.0,
				s.x, s.y, s.r, s.g, s.b, 1.0,
				s.x + s.w, s.y + s.h, s.r, s.g, s.b, 1.0,
				s.x, s.y + s.h, s.r, s.g, s.b, 1.0,
			]);
		}

		this.vertexCount = this.bufferData.length / 6;
		this.update = true;
	}
}

function Square(x, y, w, h, r, g, b){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.r = r;
	this.g = g;
	this.b = b;

	this.vx = 0;
	this.vy = 0;

	this.update = function(){
		this.x += this.vx;
		this.y += this.vy;
	}
}

var squares = new SquareBatch();
var me = new Square(0, 0, 100, 100, 0, 1, 0);
squares.add(me);

requestAnimationFrame(run);
function run() {
	me.vx = 1;

	squares.refresh();
	
	Clear();
	squares.draw(shader);
	requestAnimationFrame(run);
}
