'use strict';

module.exports = class Matrix {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.matrix = new Array();
    for(let i = 0; i < width; i++) {
      this.matrix.push(new Uint8ClampedArray(height));
    }
  }

  get(x, y) {
    return this.matrix[x][y];
  }

  set(x, y, value) {
    this.matrix[x][y] = value;
  }

  map(func) {
    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        this.set(func(this.get(x, y)));
      }
    }
  }

  toImageData() {
    let pixelData = new Array();

    for(let y = 0; y < this.height; y++) {
      for(let x = 0; x < this.width; x++) {
        pixelData.push(this.get(x,y));
        pixelData.push(this.get(x,y));
        pixelData.push(this.get(x,y));
        pixelData.push(255);
      }
    }

    let clampedArray = new Uint8ClampedArray(pixelData);
    return new ImageData(clampedArray, this.width, this.height);
  }

  static fromImageData(imageData) {
    let matrix = new Matrix(imageData.width, imageData.height);

    for(let i = 0; i < imageData.data.length; i += 4) {
      let x = (i / 4) % imageData.width;
      let y = parseInt((i / 4) / imageData.width);

      matrix.set(x, y, imageData.data[i]);
    }

    return matrix;
  }
}
