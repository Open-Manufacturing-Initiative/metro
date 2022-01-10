'use strict';

require(__dirname + '/polyfills');
const Point = require(__dirname + '/Point');

module.exports = class Matrix {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    for(let x = 0; x < this.width; x++) {
      this[x] = new Uint8ClampedArray(height).fill(0);
    }
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

        output[x][y] = accumulator;
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

        output[x][y] = accumulator / weight;
      }
    }

    return output;
  }

  floodFill(xStart, yStart, fillValue) {
    let startValue = this[xStart][yStart];
    let fillQueue = [new Point(xStart, yStart)];

    while(fillQueue.length > 0) {
      let point = fillQueue.pop();
      let x = point.x;
      let y = point.y;

      let lastColorRight = undefined;
      let lastColorLeft  = undefined;

      while(y > 0 && this[x][y - 1] == startValue) { y-- }

      for(; y < this.height; y++) {
        if(this[x][y] != startValue) { break; }
        this[x][y] = fillValue;

        if(x < this.width - 1) { 
          let rightValue = this[x + 1][y];
          if(rightValue == startValue && rightValue != lastColorRight) { fillQueue.push(new Point(x + 1, y)); }
          lastColorRight = rightValue; 
        }

        if(x > 0) { 
          let leftValue = this[x - 1][y];
          if(leftValue == startValue && leftValue != lastColorLeft ) { fillQueue.push(new Point(x - 1, y)); }
          lastColorLeft = leftValue; 
        }
      }
    }
  }

  floodColumn(xStart, yStart, fillValue) {
    let column = this[xStart];
    let startValue = column[yStart];
    let adjacentPixels = [];

    this[xStart][yStart] = fillValue;

    for(let y = yStart + 1; y < this.height; y++) {
      if(column[y] != startValue) { break; }
      this[xStart][y] = fillValue;
    }

    for(let y = yStart - 1; y > 0; y--) {
      if(column[y] != startValue) { break; }
      this[xStart][y] = fillValue;
    }
  }

  toImageData() {
    let width = this.width;
    let height = this.height;
    let pixelData = new Uint8ClampedArray(width * height * 4);

    for(let x = 0; x < width; x++) {
      for(let y = 0; y < height; y++) {
        let i = (((y * width) + x) * 4);
        pixelData[i] = pixelData[i + 1] = pixelData[i + 2] = this[x][y];
        pixelData[i + 3] = 255;
      }
    }

    return { data: pixelData, width: this.width, height: this.height }
  }

  toArray() {
    let width = this.width;
    let height = this.height;
    let pixelData = new Uint8ClampedArray(width * height);

    for(let x = 0; x < width; x++) {
      for(let y = 0; y < height; y++) {
        pixelData[((y * width) + x)] = this[x][y];
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
    let width = imageData.width;
    let height = imageData.height;
    let pixelData = imageData.data;

    for(let x = 0; x < width; x++) {
      for(let y = 0; y < height; y++) {
        matrix[x][y] = pixelData[((y * width) + x) * 4];
      }
    }

    return matrix;
  }

  static fromArray(width, height, pixelData) {
    let matrix = new Matrix(width, height);

    for(let x = 0; x < width; x++) {
      for(let y = 0; y < height; y++) {
        matrix[x][y] = pixelData[(y * width) + x];
      }
    }

    return matrix;
  }
}
