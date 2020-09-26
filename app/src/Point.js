'use strict';

module.exports = class Point {
  constructor(x, y, heading) {
    this.x = x;
    this.y = y;
    this.heading = heading;
  }

  translate(x, y) {
  	if(this.x + x < 0 || this.y < 0) { throw "Error: translation would make point have negative values" }
  	this.x += x;
  	this.y += y;
  }
}
