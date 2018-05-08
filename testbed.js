var System = {
	buildShader: function(gl, type, src){
		var shader = gl.createShader(type);
		gl.shaderSource(shader, src);
		gl.compileShader(shader);

		var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if (success){
			return shader;
		}

		console.log(gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
	},
	linkProgram: function(gl, vertex, fragment){
		var program = gl.createProgram();
		gl.attachShader(program, vertex);
		gl.attachShader(program, fragment);
		gl.linkProgram(program);

		var success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if (success){
			return program;
		}

		console.log(gl.getProgramInfoLog(program));
		gl.deleteProgram(program);
	}
};

var vertexShader = `#version 300 es
in vec2 pos;
in vec2 tex;

out vec2 Tex;

uniform vec2 texSize;
uniform mat4 proj;
uniform mat4 model;

void main(){
    Tex = tex / texSize;
    gl_Position = proj * model * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;

in vec2 Tex;

out vec4 outColour;

uniform sampler2D texImage;

void main(){
    outColour = texture(texImage, Tex);
}`;

var canvas = document.getElementById("main");
var gl = canvas.getContext("webgl2");

var data = [
    0.0, 0.0, 0.0, 0.0, // x, y, tX, tY
    0.0, 60.0, 0.0, 60.0,
    60.0, 0.0, 60.0, 0.0,
    60.0, 60.0, 60.0, 60.0
];

var vao = gl.createVertexArray();
gl.bindVertexArray(vao);

var vbo = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

var vertex = System.buildShader(gl, gl.VERTEX_SHADER, vertexShader);
var fragment = System.buildShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
var program = System.linkProgram(gl, vertex, fragment);

var pos = gl.getAttribLocation(program, "pos");
gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 4 * 4, 0 * 4);
gl.enableVertexAttribArray(pos);

var tex = gl.getAttribLocation(program, "tex");
gl.vertexAttribPointer(tex, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
gl.enableVertexAttribArray(tex);

gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

var texture = gl.createTexture();

var image = new Image();
image.onload = function(){
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.generateMipmap(gl.TEXTURE_2D);
}
image.src = "test.png";

gl.useProgram(program);

var proj = [
    2 / 800, 0, 0, 0,
    0, -2 / 600, 0, 0,
    0, 0, 1, 0,
    -1, 1, 0, 1
];

var projLoc = gl.getUniformLocation(program, "proj");
gl.uniformMatrix4fv(projLoc, false, proj);


function translation(tx, ty){
	return [
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		Math.round(tx), Math.round(ty), 0, 1
	];
}

function handleInput(event){
		var x = event.key;
		switch(x){
				case "ArrowUp":
						console.log("up");
						break;
		}
}

window.addEventListener("keydown", handleInput);

var val = 0.001;
var x = 0, y = 0;

requestAnimationFrame(render);

function render() {
		gl.clearColor(val, val, val, 1.0);
		val += 0.001;
		x += 1;
		y += Math.sin(x / 100);

    var texSize = gl.getUniformLocation(program, "texSize");
    gl.uniform2f(texSize, image.width, image.height);

		var modelLoc = gl.getUniformLocation(program, "model");
		gl.uniformMatrix4fv(modelLoc, false, translation(x, y));

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		requestAnimationFrame(render);
}

// Frame timer
//https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
//https://webglfundamentals.org/webgl/lessons/webgl-animation.html
