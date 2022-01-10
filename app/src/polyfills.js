'use strict';

if(Array.prototype.first) { throw "Array#first already defined"; }
Array.prototype.first = function(length = 1) {
	if(length === 1) { return this[0]; }
	return this.slice(0, length);
}

if(Array.prototype.last) { throw "Array#last already defined"; }
Array.prototype.last = function(length = 1) {
	if(length === 1) { return this[this.length - 1]; }
	return this.slice(this.length - length, this.length);
}

if(Array.prototype.min) { throw "Array#min already defined"; }
Array.prototype.min = function(func) {
	if(func) {
		return this.reduce((min, x) => {
			return Math.min(min, func(x));
		}, Infinity);
	} else {
		return this.reduce((min, x) => {
			if(isNaN(x)) { throw "typeError: Array#min only works on arrays full of numeric elements when called with no parameters."; }
			return Math.min(min, x);
		});
	}
}

if(Array.prototype.max) { throw "Array#max already defined"; }
Array.prototype.max = function(func) {
	if(func) {
		return this.reduce((max, x) => {
			return Math.max(max, func(x));
		}, 0);
	} else {
		return this.reduce((max, x) => {
			if(isNaN(x)) { throw "typeError: Array#min only works on arrays full of numeric elements when called with no parameters."; }
			return Math.max(max, x);
		});
	}
}

if(Array.prototype.avg) { throw "Array#avg already defined"; }
Array.prototype.avg = function(func) {
	if(func) {
		return this.reduce((total, x) => {
			return total + func(x);
		}, 0) / this.length;
	} else {
		return this.reduce((total, x) => {
			if(isNaN(x)) { throw "typeError: Array#avg only works on arrays full of numeric elements when called with no parameters."; }
			return total + x;
		}) / this.length;
	}
}

if(Array.init) { throw "Array.init already defined"; }
Array.init = function(length, initValue = null) {
	let array = [];
	if(typeof(initValue) === 'function') {
		for(let i = 0; i < length; i++) {
			array.push(initValue(i));
		}
	} else {
		for(let i = 0; i < length; i++) {
			array.push(initValue);
		}
	}
	return array;
}

if(Number.prototype.times) { throw "Number#times already defined"; }
Number.prototype.times = function(func) {
	for(let x = 0; x < this; x++) {
		func(x);
	}
}
