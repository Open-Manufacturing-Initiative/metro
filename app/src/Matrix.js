'use strict';

require(__dirname + '/polyfills');
let Point = require(__dirname + '/Point');

module.exports = class Matrix {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    width.times((x) => {
      this[x] = new Array(height).fill(0);
    });
  }

  map(func) {
    for(let x = 0; x < this.width; x++) {
      for(let y = 0; y < this.height; y++) {
        this[x][y] = func(this[x][y]);
      }
    }
  }

  convolve(input) {
    let kernel = input.reverse();
    let output = new Matrix(this.width, this.height);

    for(let x = 0; x < this.width; x++) {
      for(let y = 0; y < this.height; y++) {
        let accumulator = 0;

        let xMinusOne = Math.max(0, x - 1);
        let yMinusOne = Math.max(0, y - 1);
        let yPlusOne  = Math.min(this.height - 1, y + 1);
        let xPlusOne  = Math.min(this.width - 1, x + 1);

        accumulator += (kernel[0] * this[xMinusOne][yMinusOne]);
        accumulator += (kernel[1] * this[x        ][yMinusOne]);
        accumulator += (kernel[2] * this[xPlusOne ][yMinusOne]);
        accumulator += (kernel[3] * this[xMinusOne][y        ]);
        accumulator += (kernel[4] * this[x        ][y        ]);
        accumulator += (kernel[5] * this[xPlusOne ][y        ]);
        accumulator += (kernel[6] * this[xMinusOne][yPlusOne ]);
        accumulator += (kernel[7] * this[x        ][yPlusOne ]);
        accumulator += (kernel[8] * this[xPlusOne ][yPlusOne ]);

        output[x][y] = Math.min(Math.max(accumulator, 0), 255);
      }
    }

    return output;
  }

  weightedConvolve(input) {
    let kernel = input.reverse();
    let output = new Matrix(this.width, this.height);
    let weight = Math.max(1, kernel.reduce(function(a,b) { return a + b }));

    for(let x = 0; x < this.width; x++) {
      for(let y = 0; y < this.height; y++) {
        let accumulator = 0;

        let xMinusOne = Math.max(0, x - 1);
        let yMinusOne = Math.max(0, y - 1);
        let yPlusOne  = Math.min(this.height - 1, y + 1);
        let xPlusOne  = Math.min(this.width - 1, x + 1);

        accumulator += (kernel[0] * this[xMinusOne][yMinusOne]);
        accumulator += (kernel[1] * this[x        ][yMinusOne]);
        accumulator += (kernel[2] * this[xPlusOne ][yMinusOne]);
        accumulator += (kernel[3] * this[xMinusOne][y        ]);
        accumulator += (kernel[4] * this[x        ][y        ]);
        accumulator += (kernel[5] * this[xPlusOne ][y        ]);
        accumulator += (kernel[6] * this[xMinusOne][yPlusOne ]);
        accumulator += (kernel[7] * this[x        ][yPlusOne ]);
        accumulator += (kernel[8] * this[xPlusOne ][yPlusOne ]);

        output[x][y] = Math.min(Math.max(Math.floor(accumulator / weight), 0), 255);
      }
    }

    return output;
  }

  floodFill(xStart, yStart, fillValue) {
    let startValue = this[xStart][yStart];
    let fillQueue = [ new Point(xStart, yStart) ];

    while(fillQueue.length > 0) {
      let point = fillQueue.pop();
      this[point.x][point.y] = fillValue;

      Matrix.DIRECTIONS.forEach((direction) => {
        let x = point.x + direction.x;
        let y = point.y + direction.y;

        if(x < 0 || x > this.width - 1)     { return; }
        if(y < 0 || y > this.height - 1)    { return; }
        if(this[x][y] != startValue)        { return; }

        fillQueue.push(new Point(x, y));
      });
    }
  }

  toImageData() {
    let pixelData = new Array();

    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        pixelData.push(this[x][y]);
        pixelData.push(this[x][y]);
        pixelData.push(this[x][y]);
        pixelData.push(255);
      }
    }

    let clampedArray = new Uint8ClampedArray(pixelData);
    return new ImageData(clampedArray, this.width, this.height);
  }

  toArray() {
    let pixelData = new Array();

    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        pixelData.push(this[x][y]);
      }
    }

    return pixelData;
  }

  static DIRECTIONS = Object.freeze([
    { x: 0, y:-1 }, // ⬆️
    { x: 1, y: 0 }, // ➡️
    { x: 0, y: 1 }, // ⬇️
    { x:-1, y: 0 }  // ⬅️
  ]);

  static fromImageData(imageData) {
    let matrix = new Matrix(imageData.width, imageData.height);

    for(let i = 0; i < imageData.data.length; i += 4) {
      let x = (i / 4) % imageData.width;
      let y = parseInt((i / 4) / imageData.width);

      matrix[x][y] = imageData.data[i];
    }

    return matrix;
  }

  static fromArray(width, height, pixelData) {
    let matrix = new Matrix(width, height);
    for(let i = 0; i < (width * height); i++) {
      let x = i % width;
      let y = parseInt(i / width);

      matrix[x][y] = pixelData[i];
    }

    return matrix;
  }
}
