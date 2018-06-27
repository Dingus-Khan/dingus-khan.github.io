var panelVertexShader = `#version 300 es
in vec2 pos;
in vec3 col;

out vec3 Col;

uniform mat4 proj;
uniform mat4 model;

void main(){
	Col = col;
    gl_Position = proj * model * vec4(pos, 0.0, 1.0);
}`;

var panelFragmentShader = `#version 300 es
precision mediump float;

in vec3 Col;

out vec4 outColour;

void main(){
    outColour = vec4(Col, 1.0);
}`;

var panelShader = new Shader(panelVertexShader, panelFragmentShader);
panelShader.addAttribute("pos", 2, gl.FLOAT, false, 5, 0);
panelShader.addAttribute("col", 3, gl.FLOAT, false, 5, 2);
panelShader.use();

panelShader.setUniform("proj", proj);
panelShader.setUniform("model", Matrix.identity());
