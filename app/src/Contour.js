'use strict';

require(__dirname + '/polyfills');
let Point = require(__dirname + '/Point');
let Matrix = require(__dirname + '/Matrix');

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

  width() {
    return this.points.max(point => point.x) - this.points.min(point => point.x);
  }

  height() {
    return this.points.max(point => point.y) - this.points.min(point => point.y);
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

  translate(x, y) {
    this.points.forEach((point) => {
      point.translate(x, y);
    });
  }

  xMinIntersect() {
    let xMin = this.points.min(point => point.x);
    let yMin = this.points.filter(point => point.x === xMin).min(point => point.y)
    return new Point(xMin, yMin);
  }

  xMaxIntersect() {
    let xMax = this.points.max(point => point.x);
    let yMax = this.points.filter(point => point.x === xMax).max(point => point.y)
    return new Point(xMax, yMax);
  }

  yMinIntersect() {
    let yMin = this.points.min(point => point.y);
    let xMax = this.points.filter(point => point.y === yMin).max(point => point.x);
    return new Point(xMax, yMin);
  }

  yMaxIntersect() {
    let yMax = this.points.max(point => point.y);
    let xMin = this.points.filter(point => point.y === yMax).min(point => point.x);
    return new Point(xMin, yMax);
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

  enclosedPoints() {
    let matrix = new Matrix(this.width() + 2, this.height() + 2);
    let minX = this.boundingBox().min.x;
    let minY = this.boundingBox().min.y;
    let translatedContour = new Contour(this.points)
    translatedContour.translate((-minX) + 1, (-minY) + 1);

    translatedContour.drawOnMatrix(matrix, 255);
    matrix.floodFill(0, 0, 255);

    let enclosedPoints = [];

    for(let x = 0; x < matrix.width; x++) {
      for(let y = 0; y < matrix.height; y++) {
        if(matrix[x][y] == 0) { enclosedPoints.push(new Point(x + minX - 1, y + minY - 1)); }
      }
    }

    return enclosedPoints;
  }

  static DIRECTIONS = Object.freeze([
    { x: 0, y:-1, heading: 0   }, // ⬆️
    { x: 1, y: 0, heading: 90  }, // ➡️
    { x: 0, y: 1, heading: 180 }, // ⬇️
    { x:-1, y: 0, heading: 270 }, // ⬅️
    { x: 1, y:-1, heading: 45  }, // ↗️
    { x: 1, y: 1, heading: 135 }, // ↘️
    { x:-1, y: 1, heading: 225 }, // ↙️
    { x:-1, y:-1, heading: 315 }  // ↖️
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

        contour.points.push(new Point(x, y, direction.heading));
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
