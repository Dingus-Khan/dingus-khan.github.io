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



var buttonVertexShader = `#version 300 es
	in vec2 pos;
	in vec2 tex;
	in vec3 col;

	out vec2 Tex;
	out vec3 Col;

	uniform vec2 texSize;
	uniform mat4 proj;
	uniform mat4 model;

	void main(){
		Tex = tex / texSize;
		Col = col;
		gl_Position = proj * model * vec4(pos, 0.0, 1.0);
	}
`;

var buttonFragmentShader = `#version 300 es
	in vec2 Tex;
	in vec3 Col;

	out vec4 outColour;

	uniform sampler2D texImage;

	void main(){
		outColour = texture(texImage, Tex) * vec4(Col, 1.0);
	}
`;

var buttonShader = new Shader(buttonVertexShader, buttonFragmentShader);
buttonShader.addAttribute("pos", 2, gl.FLOAT, false, 7, 0);
buttonShader.addAttribute("tex", 2, gl.FLOAT, false, 7, 2);
buttonShader.addAttribute("col", 3, gl.FLOAT, false, 7, 5);
buttonShader.use();

buttonShader.setUniform("proj", proj);
buttonShader.setUniform("model", Matrix.identity());
