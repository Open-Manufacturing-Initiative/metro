'use strict';

describe("Matrix", function() {
  let Matrix = require(__dirname + '../../app/src/Matrix');

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
      expect(matrix.width).toEqual(10);
      expect(matrix[0].length).toEqual(12);
    });
  });

  describe("#[]", function() {
    it("sets and returns the value at the given location", function() {
      let matrix = new Matrix(3, 3);
      matrix[0][1] = 123;

      expect(matrix[0][1]).toEqual(123);
    });
  });

  describe("#map", function() {
    it("applies a function to all values in the matrix", function() {
      let matrix = new Matrix(2, 2);
      matrix[0][0] = 0;
      matrix[1][0] = 2;
      matrix[0][1] = 4;
      matrix[1][1] = 8;

      matrix.map(function(x) {
        return x + 2;
      });

      expect(matrix[0][0]).toEqual(2);
      expect(matrix[1][0]).toEqual(4);
      expect(matrix[0][1]).toEqual(6);
      expect(matrix[1][1]).toEqual(10);
    });
  });

  describe("#convolve", function() {
    it("applies a simple convolution kernel to a horizontal matrix", function() {
      let matrix = Matrix.fromArray(3, 1, [1,2,3]);

      let output = matrix.convolve(
       [1,1,1,
        3,0,2,
        1,1,1]
      );

      expect(output.toArray()).toEqual([6,11,4]);
    });

    it("allows the use of negative values in the kernel", function() {
      let matrix = Matrix.fromArray(3, 1, [1,2,3]);

      let output = matrix.convolve(
       [ 1, 1, 1,
        -3, 0,-2,
         1, 1, 1]
      );

      expect(output.toArray()).toEqual([-6,-11,-4]);
    });

    it("applies a 3x3 convolution kernel to the matrix", function() {
      let matrix = Matrix.fromArray(3, 3,
       [1,2,3,
        4,5,6,
        7,8,9]
      );

      let output = matrix.convolve(
       [-1,-2,-1,
         0, 0, 0,
         1, 2, 1]
      );

      expect(output.toArray()).toEqual(
       [-13,-20,-17,
        -18,-24,-18,
         13, 20, 17]
      );
    });
  });

  describe("#toImageData", function() {
    it("returns the Matrix as an ImageData object", function() {
      let matrix = Matrix.fromArray(2, 2, [0,2,4,8]);
      let imageData = matrix.toImageData();
      let pixelData = new Uint8ClampedArray([0,0,0,255,2,2,2,255,4,4,4,255,8,8,8,255]);

      expect(imageData).toEqual(new ImageData(pixelData, 2, 2));
    });
  });

  describe("#toArray", function() {
    it("returns the Matrix as a flat array", function() {
      let matrix = Matrix.fromArray(2, 2, [1,2,3,4]);
      expect(matrix.toArray()).toEqual([1,2,3,4]);
    });
  });

  describe(".fromImageData", function() {
    it("creates a Matrix from an ImageData object", function() {
      let pixelData = new Uint8ClampedArray([0,0,0,255,2,2,2,255,4,4,4,255,8,8,8,255]);
      let imageData = new ImageData(pixelData, 2, 2);
      let matrix = Matrix.fromImageData(imageData);

      expect(matrix[0][0]).toEqual(0);
      expect(matrix[1][0]).toEqual(2);
      expect(matrix[0][1]).toEqual(4);
      expect(matrix[1][1]).toEqual(8);
    });
  });

  describe(".fromArray", function() {
    it("creates a Matrix from an array given width and height", function() {
      let matrix = Matrix.fromArray(3, 3,
       [1,2,3,
        4,5,6,
        7,8,9]
      );

      expect(matrix[0][0]).toEqual(1);
      expect(matrix[1][0]).toEqual(2);
      expect(matrix[2][0]).toEqual(3);
      expect(matrix[0][1]).toEqual(4);
      expect(matrix[1][1]).toEqual(5);
      expect(matrix[2][1]).toEqual(6);
      expect(matrix[0][2]).toEqual(7);
      expect(matrix[1][2]).toEqual(8);
      expect(matrix[2][2]).toEqual(9);
    });
  });
});
