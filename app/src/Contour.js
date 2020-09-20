'use strict';

let Point = require(__dirname + '/Point');

module.exports = class Contour {
  constructor(points) {
    this.points = points;
    this.boundingBox = { min: new Point(Infinity,Infinity), max: new Point(0,0) };

    for(let i = 0; i < points.length; i++) {
      if(points[i].x < this.boundingBox.min.x) { this.boundingBox.min.x = points[i].x; }
      if(points[i].x > this.boundingBox.max.x) { this.boundingBox.max.x = points[i].x; }
      if(points[i].y < this.boundingBox.min.y) { this.boundingBox.min.y = points[i].y; }
      if(points[i].y > this.boundingBox.max.y) { this.boundingBox.max.y = points[i].y; }
    }
  }

  static traceFromMatrix(matrix, startX, startY) {
    let points = [ new Point(startX, startY) ];
    let contourColor = matrix[startX][startY];

    let directions = [
      { x: 0, y:-1 },
      { x: 1, y:-1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 0, y: 1 },
      { x:-1, y: 1 },
      { x:-1, y: 0 },
      { x:-1, y:-1 }
    ];

    while(true) {
      let lastPoint = points[points.length - 2] || points[points.length - 1];
      let currentPoint = points[points.length - 1];
      let newPoint = undefined;

      console.log("LastPoint:");
      console.log(lastPoint);


      for(let i = 0; i < directions.length; i++) {
        let x = currentPoint.x + directions[i].x;
        let y = currentPoint.y + directions[i].y;

        console.log(`X: ${x}, Y:${y}`);

        if(x < 0 || x > matrix.width - 1)  { continue; }
        if(y < 0 || y > matrix.height - 1) { continue; }
        if(matrix[x][y] != contourColor)   { continue; }
        if(x == lastPoint.x && y == lastPoint.y) { continue; }

        console.log("Pushing point...");

        points.push( new Point(x,y) );
        break;
      }

      console.log(points[points.length - 1]);

      if(points[points.length - 1] == points[0]) { break; }
      if(points[points.length - 1] == currentPoint) { break; }
    }

  }
}
