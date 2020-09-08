'use strict';

describe("Matrix", function() {
  let Matrix = require(__dirname + '../../metro/src/Matrix');

  describe("new", function() {
    it("returns a Matrix", function() {
      let matrix = new Matrix(10, 10);
      expect(matrix).toEqual(jasmine.any(Matrix));
    });

    it("returns a Matrix with the correct width", function() {
      let matrix = new Matrix(10, 12);
      expect(matrix.width).toEqual(10);
    });

    it("returns a Matrix with the correct height", function() {
      let matrix = new Matrix(10, 12);
      expect(matrix.height).toEqual(12);
    });

    it("returns a Matrix with a correctly sized 2D matrix array", function() {
      let matrix = new Matrix(10, 12);
      expect(matrix.matrix.length).toEqual(10);
      expect(matrix.matrix[0].length).toEqual(12);
    });
  });

  describe("#get", function() {
    it("returns the value at the given location", function() {
      let matrix = new Matrix(3, 3);
      matrix.matrix[0][1] = 123;

      expect(matrix.get(0,1)).toEqual(123);
    });
  });

  describe("#set", function() {
    it("sets the value at the given location", function() {
      let matrix = new Matrix(3, 3);
      matrix.set(0, 1, 234);

      expect(matrix.matrix[0][1]).toEqual(234);
    });
  });

  describe("#toImageData", function() {
    it("returns the Matrix as an ImageData object", function() {
      let matrix = new Matrix(2, 2);
      matrix.matrix[0][0] = 0;
      matrix.matrix[1][0] = 2;
      matrix.matrix[0][1] = 4;
      matrix.matrix[1][1] = 8;

      let imageData = matrix.toImageData();
      let pixelData = new Uint8ClampedArray([0,0,0,255,2,2,2,255,4,4,4,255,8,8,8,255]);
      expect(imageData).toEqual(new ImageData(pixelData, 2, 2));
    });
  });
});
