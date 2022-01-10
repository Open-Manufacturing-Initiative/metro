'use strict';

console.log("IN IMAGEDATASHIM");

module.exports = class ImageData {
	constructor(array, width, height) {
		this.width = width;
		this.height = height;
		this.data = array;
	}
}