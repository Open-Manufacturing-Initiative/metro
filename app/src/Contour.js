'use strict';

require(__dirname + '/polyfills');
let Point = require(__dirname + '/Point');

module.exports = class Contour {
  constructor(points) {
    this.points = points;
  }

  boundingBox() {
    return { 
      min: new Point(this.points.min(point => point.x), this.points.min(point => point.y)), 
      max: new Point(this.points.max(point => point.x), this.points.max(point => point.y)),
    }
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
    return this.points.first();
  }

  end() {
    return this.points.last();
  }

  xMinIntersect() {
    let xMin = this.points.min(point => point.x);
    let yMin = this.points.filter(point => point.x === xMin).min(point => point.y);
    return new Point(xMin, yMin);
  }

  xMaxIntersect() {
    let xMax = this.points.max(point => point.x);
    let yMax = this.points.filter(point => point.x === xMax).max(point => point.y);
 
    let xMax = this.boundingBox().max.x;
    let xMaxIntersect = new Point(xMax,0);
    this.points.forEach((point) => {
      if(point.x === xMax && point.y > xMaxIntersect.y) { xMaxIntersect = point; }
    });
    return xMaxIntersect;
  }

  yMinIntersect() {
    let yMin = this.boundingBox().min.y;
    let yMinIntersect = new Point(0,yMin);
    this.points.forEach((point) => {
      if(point.y === yMin && point.x > yMinIntersect.x) { yMinIntersect = point; }
    });
    return yMinIntersect;
  }

  yMaxIntersect() {
    let yMax = this.boundingBox().max.y;
    let yMaxIntersect = new Point(Infinity,yMax);
    this.points.forEach((point) => {
      if(point.y === yMax && point.x < yMaxIntersect.x) { yMaxIntersect = point; }
    });
    return yMaxIntersect;
  }

  drawOnMatrix(matrix, color) {
    this.points.forEach((point) => {
      matrix[point.x][point.y] = color;
    });
  }

  drawOnCanvas(canvas, color) {
    let context = canvas.canvas.getContext("2d");
    let boundingBox = this.boundingBox();

    context.beginPath();
    context.moveTo(boundingBox.min.x, boundingBox.min.y);
    context.lineTo(boundingBox.max.x, boundingBox.min.y);
    context.lineTo(boundingBox.max.x, boundingBox.max.y);
    context.lineTo(boundingBox.min.x, boundingBox.max.y);
    context.lineTo(boundingBox.min.x, boundingBox.min.y);
    context.strokeStyle = "green";
    context.stroke();

    let xMinIntersect = this.xMinIntersect();

    context.beginPath();
    context.arc(xMinIntersect.x, xMinIntersect.y, 4, 0, 2 * Math.PI, false);
    context.fillStyle = "blue";
    context.fill();

    let xMaxIntersect = this.xMaxIntersect();

    context.beginPath();
    context.arc(xMaxIntersect.x, xMaxIntersect.y, 4, 0, 2 * Math.PI, false);
    context.fillStyle = "blue";
    context.fill();

    let yMinIntersect = this.yMinIntersect();

    context.beginPath();
    context.arc(yMinIntersect.x, yMinIntersect.y, 4, 0, 2 * Math.PI, false);
    context.fillStyle = "blue";
    context.fill();

    let yMaxIntersect = this.yMaxIntersect();

    context.beginPath();
    context.arc(yMaxIntersect.x, yMaxIntersect.y, 4, 0, 2 * Math.PI, false);
    context.fillStyle = "blue";
    context.fill();

    context.fillStyle = color;
    this.points.forEach((point) => {
      context.fillRect( point.x, point.y, 1, 1 );
    });
  }

  findContigousPixels

  static DIRECTIONS = Object.freeze([
    { x: 0, y:-1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x:-1, y: 0 },
    { x: 1, y:-1 },
    { x: 1, y: 1 },
    { x:-1, y: 1 },
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
