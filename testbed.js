var vertexShader = `#version 300 es
in vec2 pos;
in vec2 tex;
in vec3 col;

out vec2 Tex;
out vec3 Col;

uniform vec2 texSize;
uniform mat4 proj;
uniform mat4 view;
uniform mat4 model;

void main(){
    Tex = tex / texSize;
	Col = col;
    gl_Position = proj * view * model * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;

in vec2 Tex;
in vec3 Col;

out vec4 outColour;

uniform sampler2D texImage;

void main(){
    outColour = texture(texImage, Tex) * vec4(Col, 1.0);
}`;

System.Display.SetProj(800, 600);

System.Display.ClearColor(0.2, 0.2, 0.2);
requestAnimationFrame(run);
function run() {
	System.Display.Clear();
	requestAnimationFrame(run);
}
