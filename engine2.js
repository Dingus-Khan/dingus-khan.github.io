var canvas = document.getElementById("main");
var gl = canvas.getContext("webgl2");

var System = {
	BuildShader: function(type, src){
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
	LinkProgram: function(vertex, fragment){
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

function Init(){
	gl.clearColor(0.2, 0.2, 0.2, 1.0);
}

function Clear(){
	gl.clear(gl.COLOR_BUFFER_BIT);
}

function Shader(vertexShader, fragmentShader){
	var v = System.BuildShader(gl.VERTEX_SHADER, vertexShader);
	var f = System.BuildShader(gl.FRAGMENT_SHADER, fragmentShader);
	this.shader = System.LinkProgram(v, f);

	this.attributes = [];

	this.addAttribute = function(name, count, type, normalise, stride, offset){
		var loc = gl.getAttribLocation(this.shader, name);
		this.attributes.push({
			loc: loc, count: count, type: type, normalise: normalise, stride: stride, offset: offset
		});
	}

	this.enableAttributes = function(){
		for(i = 0; i < this.attributes.length; i++){
			var attr = this.attributes[i];
			gl.vertexAttribPointer(attr.loc, attr.count, attr.type, attr.normalise, attr.stride, attr.offset);
			gl.enableVertexAttribArray(attr.loc);
		}
	}

	this.setUniform = function(name, value){
		var values = [].concat(value);

		var loc = gl.getUniformLocation(this.shader, name);
		switch(values.length){
			case 1:
				gl.uniform1fv(loc, values);
				break;
			case 2:
				gl.uniform2fv(loc, values);
				break;
			case 3:
				gl.uniform3fv(loc, values);
				break;
			case 4:
				gl.uniform4fv(loc, values);
				break;
			case 16:
				gl.uniformMatrix4fv(loc, false, values);
				break;
		}
	}

	this.use = function(){
		gl.useProgram(this.shader);
	}
}

function Drawable(drawMode, vertexCount){
	this.vao = gl.createVertexArray();
	this.vbo = gl.createBuffer();
	this.drawMode = drawMode;
	this.bufferData = [];
	this.vertexCount = vertexCount;
	this.updateBuffer = true;

	this.build = function(){
		if (this.updateBuffer){
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferData), gl.STATIC_DRAW);
			this.updateBuffer = false;
		}
	}

	this.draw = function(shader){
		if (this.vertexCount > 0){
			gl.bindVertexArray(this.vao);
			gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);

			this.build();

			shader.enableAttributes();

			gl.drawArrays(this.drawMode, 0, this.vertexCount);
		}
	}
}

function Sprite(){
	Drawable.call(this, gl.TRIANGLE_STRIP);
}

Init();
