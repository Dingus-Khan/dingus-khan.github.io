var canvas = document.getElementById("main");
var gl = canvas.getContext("webgl2");

var Matrix = {
	identity: function(){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	},
	translation: function(x, y){
		return [
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			Math.round(x), Math.round(y), 0, 1
		];
	},
	translate: function(m, x, y){
		return this.multiply(m, this.translation(x, y));
	},
	rotation: function(r){
		var sine = Math.sin(r);
		var cosine = Math.cos(r);
		return [
			cosine, -sine, 0, 0,
			sine, cosine, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	},
	rotate: function(m, r){
		return this.multiply(m, this.rotation(r));
	},
	scaling: function(sx, sy){
		return [
			sx, 0, 0, 0,
			0, sy, 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		];
	},
	scale: function(m, sx, sy){
		return this.multiply(m, this.scaling(sx, sy));
	},
	multiply: function(m1, m2){
		return [
			((m1[0] * m2[0]) + (m1[1] * m2[4]) + (m1[2] * m2[8]) + (m1[3] * m2[12])),
			((m1[0] * m2[1]) + (m1[1] * m2[5]) + (m1[2] * m2[9]) + (m1[3] * m2[13])),
			((m1[0] * m2[2]) + (m1[1] * m2[6]) + (m1[2] * m2[10]) + (m1[3] * m2[14])),
			((m1[0] * m2[3]) + (m1[1] * m2[7]) + (m1[2] * m2[11]) + (m1[3] * m2[15])),

			((m1[4] * m2[0]) + (m1[5] * m2[4]) + (m1[6] * m2[8]) + (m1[7] * m2[12])),
			((m1[4] * m2[1]) + (m1[5] * m2[5]) + (m1[6] * m2[9]) + (m1[7] * m2[13])),
			((m1[4] * m2[2]) + (m1[5] * m2[6]) + (m1[6] * m2[10]) + (m1[7] * m2[14])),
			((m1[4] * m2[3]) + (m1[5] * m2[7]) + (m1[6] * m2[11]) + (m1[7] * m2[15])),

			((m1[8] * m2[0]) + (m1[9] * m2[4]) + (m1[10] * m2[8]) + (m1[11] * m2[12])),
			((m1[8] * m2[1]) + (m1[9] * m2[5]) + (m1[10] * m2[9]) + (m1[11] * m2[13])),
			((m1[8] * m2[2]) + (m1[9] * m2[6]) + (m1[10] * m2[10]) + (m1[11] * m2[14])),
			((m1[8] * m2[3]) + (m1[9] * m2[7]) + (m1[10] * m2[11]) + (m1[11] * m2[15])),

			((m1[12] * m2[0]) + (m1[13] * m2[4]) + (m1[14] * m2[8]) + (m1[15] * m2[12])),
			((m1[12] * m2[1]) + (m1[13] * m2[5]) + (m1[14] * m2[9]) + (m1[15] * m2[13])),
			((m1[12] * m2[2]) + (m1[13] * m2[6]) + (m1[14] * m2[10]) + (m1[15] * m2[14])),
			((m1[12] * m2[3]) + (m1[13] * m2[7]) + (m1[14] * m2[11]) + (m1[15] * m2[15]))
		];
	}
};

var Sprite = function(x, y, w, h, tx, ty, tw, th, r, g, b){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.tx = tx;
	this.ty = ty;
	this.tw = tw;
	this.th = th;
	this.r = r;
	this.g = g;
	this.b = b;
}

var SpriteBatch = function(){
	this.sprites = [];
	this.bufferData = [];
	this.add = function(sprite){
		this.sprites.push(sprite);
	}
	this.build = function(){
		this.sprites.forEach(function(spr){
			this.bufferData.push([
				spr.x, spr.y, spr.tx, spr.ty, spr.r, spr.g, spr.b,
				spr.x + spr.w, spr.y, spr.tx + spr.tw, spr.ty, spr.r, spr.g, spr.b,
				spr.x + spr.w, spr.y + spr.h, spr.tx + spr.tw, spr.ty + spr.th, spr.r, spr.g, spr.b,

				spr.x, spr.y, spr.tx, spr.ty, spr.r, spr.g, spr.b,
				spr.x + spr.w, spr.y + spr.h, spr.tx + spr.tw, spr.ty + spr.th, spr.r, spr.g, spr.b,
				spr.x, spr.y + spr.h, spr.tx, spr.ty + spr.th, spr.r, spr.g, spr.b,
			]);
		});
	}
	this.draw = function(){

	}
}
