var vertexShader = `#version 300 es
in vec2 pos;
in vec3 col;
in vec2 tex;

out vec2 Tex;
out vec3 Col;

uniform mat4 proj;
uniform mat4 model;

void main(){
	Tex = tex;
	Col = col;
    gl_Position = proj * model * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;

in vec2 Tex;
in vec3 Col;

out vec4 outColour;

uniform sampler2D texImage;

void main(){
	ivec2 texSize = textureSize(texImage, 0);
    outColour = texture(texImage, vec2(Tex.x / float(texSize.x), Tex.y / float(texSize.y))) * Col;
}`;
