'use strict';

let Point = require(__dirname + '/Point');

module.exports = class Contour {
  constructor(points) {
    this.points = points;
  }

  boundingBox() {
    let boundingBox = { min: new Point(Infinity,Infinity), max: new Point(0,0) };

    this.points.forEach((point) => {
      if(point.x < boundingBox.min.x) { boundingBox.min.x = point.x; }
      if(point.x > boundingBox.max.x) { boundingBox.max.x = point.x; }
      if(point.y < boundingBox.min.y) { boundingBox.min.y = point.y; }
      if(point.y > boundingBox.max.y) { boundingBox.max.y = point.y; }
    });

    return boundingBox;
  }

  includes(otherPoint) {
    return this.points.find((point) => {
      return point.x === otherPoint.x && point.y === otherPoint.y;
    }) != undefined;
  }

  isClosed() {
    let xDiff = Math.abs(this.start().x - this.end().x);
    let yDiff = Math.abs(this.start().y - this.end().y);

    return xDiff < 2 && yDiff < 2;
  }

  isOpen() {
    return !this.isClosed();
  }

  start() {
    return this.points[0];
  }

  end() {
    return this.points[this.points.length - 1];
  }

  drawOnMatrix(matrix, color) {
    this.points.forEach((point) => {
      matrix[point.x][point.y] = color;
    });
  }

  static DIRECTIONS = Object.freeze([
    { x: 0, y:-1 },
    { x: 1, y:-1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x:-1, y: 1 },
    { x:-1, y: 0 },
    { x:-1, y:-1 }
  ]);

  static traceFromMatrix(matrix, startX, startY) {
    let contour = new Contour([new Point(startX, startY)]);
    let contourColor = matrix[contour.start().x][contour.start().y];

    while(true) {
      let newPoint = Contour.DIRECTIONS.find((direction) => {
        let x = contour.end().x + direction.x;
        let y = contour.end().y + direction.y;

        if(x < 0 || x > matrix.width - 1)     { return false; }
        if(y < 0 || y > matrix.height - 1)    { return false; }
        if(matrix[x][y] != contourColor)      { return false; }
        if(contour.includes(new Point(x,y)))  { return false; }

        contour.points.push(new Point(x,y));
        return true;
      });

      if(!newPoint) { return contour; }
    }
  }

  static findContoursFromMatrix(matrix, backgroundColor = 0) {
    let contours = [];

    for(let x = 0; x < matrix.width; x++) {
      for(let y = 0; y < matrix.height; y++) {
        if(matrix[x][y] != backgroundColor) {
          let contour = Contour.traceFromMatrix(matrix, x, y)
          contour.drawOnMatrix(matrix, backgroundColor);

          if(contour.isClosed() && contour.points.length > 9) {
            contours.push(contour);
          }
        }
      }
    }

    contours.forEach((contour) => {
      contour.drawOnMatrix(matrix, 255);
    });

    return contours;
  }
}
