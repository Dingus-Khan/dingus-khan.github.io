var vertexShader = `#version 300 es

in vec3 pos;
in vec3 col;
in vec2 tex;

out vec3 Col;
out vec2 Tex;

uniform vec2 texSize;
uniform mat4 proj;

void main(){
	Col = col;
	Tex = vec2(tex.x / texSize.x, tex.y / texSize.y);
	gl_Position = proj * vec4(pos, 1);
}`;

var fragmentShader = `#version 300 es
precision mediump float;

in vec3 Col;
in vec2 Tex;

out vec4 outColour;

uniform sampler2D texImage;

void main(){
	outColour = texture(texImage, vec2(Tex.x, -Tex.y)) * vec4(Col, 1.0);
}`;

Game.init("main", 800, 600);
var shader = new Shader(vertexShader, fragmentShader);
Game.useShader(shader);

var texture = new Texture("test.png");
var data = [
    0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0,
    1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0
];

var gl = Game.gl;


gl.bindTexture(gl.TEXTURE_2D, texture.textureId);


var vao = gl.createVertexArray();
var vbo = gl.createBuffer();

gl.bindVertexArray(vao);
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

var pos = gl.getAttribLocation(Game.shader.program, "pos");
gl.vertexAttribPointer(pos, 3, gl.FLOAT, false, 8 * 4, 0 * 4);
gl.enableVertexAttribArray(pos);

var col = gl.getAttribLocation(Game.shader.program, "col");
gl.vertexAttribPointer(col, 3, gl.FLOAT, false, 8 * 4, 3 * 4);
gl.enableVertexAttribArray(col);

var tex = gl.getAttribLocation(Game.shader.program, "tex");
gl.vertexAttribPointer(tex, 2, gl.FLOAT, false, 8 * 4, 6 * 4);
gl.enableVertexAttribArray(tex);

Game.clear(0.1, 0.1, 0.1);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);