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
    let contourColor = matrix[startX][startY];

    while(true) {
      let lastPoint = contour.points[contour.points.length - 1];

      let newPoint = Contour.DIRECTIONS.find((direction) => {
        let x = lastPoint.x + direction.x;
        let y = lastPoint.y + direction.y;

        if(x < 0 || x > matrix.width - 1)     { return false; }
        if(y < 0 || y > matrix.height - 1)    { return false; }
        if(matrix[x][y] != contourColor)      { return false; }
        if(contour.includes(new Point(x,y)))  { return false; }

        contour.points.push(new Point(x,y));
        return true;
      });

      if(!newPoint) { break; }
    }
    return contour;
  }
}
