'use strict';

module.exports = class Matrix {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    for(let x = 0; x < width; x++) {
      this[x] = new Array(height).fill(0);
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
    let kernel = Matrix.fromArray(3, 3, input.reverse());
    let output = new Matrix(this.width, this.height);

    for(let x = 0; x < this.width; x++) {
      for(let y = 0; y < this.height; y++) {
        for(let kx = -1; kx < 2; kx++) {
          for(let ky = -1; ky < 2; ky++) {
            if(x == 0 && kx == -1) { continue; }
            if(x == (this.width - 1) && kx == 1) { continue; }
            if(y == 0 && ky == -1) { continue; }
            if(y == (this.height - 1) && ky == 1) { continue; }


            output[x][y] += (kernel[kx + 1][ky + 1] * this[x + kx][y + ky])
          }
        }
      }
    }

    return output;
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
