var vertexShader = `#version 300 es
in vec2 pos;
in vec2 tex;
in vec3 col;

out vec2 Tex;
out vec3 Col;

uniform mat4 proj;

void main(){
    Tex = tex;
	Col = col;
    gl_Position = proj * vec4(pos, 0.0, 1.0);
}`;

var fragmentShader = `#version 300 es
precision mediump float;

in vec2 Tex;
in vec3 Col;

out vec4 outColour;

void main(){
    outColour = vec4(Col, 1.0);
}`;

var v = System.Shaders.BuildShader(gl.VERTEX_SHADER, vertexShader);
var f = System.Shaders.BuildShader(gl.FRAGMENT_SHADER, fragmentShader);
var p = System.Shaders.LinkProgram(v, f);
System.Shaders.UseProgram(p);
System.Display.SetProj(800, 600);
System.Display.ClearColor(0.2, 0.2, 0.2);



requestAnimationFrame(run);
function run() {
	System.Display.Clear();
	requestAnimationFrame(run);
}
