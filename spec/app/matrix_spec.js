'use strict';

// References regarding convolution:
// http://www.songho.ca/dsp/convolution/convolution2d_example.html
// https://en.wikipedia.org/wiki/Kernel_(image_processing)

describe("Matrix", () => {
  let Matrix = require(__dirname + '../../app/src/Matrix');

  describe("new", () => {
    it("returns a Matrix", () => {
      let matrix = new Matrix(10, 10);
      expect(matrix).toEqual(jasmine.any(Matrix));
    });

    it("returns a Matrix with the correct width", () => {
      let matrix = new Matrix(10, 12);
      expect(matrix.width).toEqual(10);
    });

    it("returns a Matrix with the correct height", () => {
      let matrix = new Matrix(10, 12);
      expect(matrix.height).toEqual(12);
    });

    it("returns a Matrix with a correctly sized 2D matrix array", () => {
      let matrix = new Matrix(10, 12);
      expect(matrix.width).toEqual(10);
      expect(matrix[0].length).toEqual(12);
    });
  });

  describe("#[]", () => {
    it("sets and returns the value at the given location", () => {
      let matrix = new Matrix(3, 3);
      matrix[0][1] = 123;

      expect(matrix[0][1]).toEqual(123);
    });
  });

  describe("#map", () => {
    it("applies a function to all values in the matrix", () => {
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

  describe("#convolve", () => {
    it("applies a 3x3 convolution kernel to the matrix", () => {
      let matrix = Matrix.fromArray(5, 5,
        [0,0,0,0,0,
         0,1,2,3,0,
         0,4,5,6,0,
         0,7,8,9,0,
         0,0,0,0,0]
      );

      let output = matrix.convolve(
       [-1,-2,-1,
         0, 0, 0,
         1, 2, 1]
      );

      expect(output.toArray()).toEqual(
       [ 0,  0,  0,  0, 0,
         0,  0,  0,  0, 0,
         0,  0,  0,  0, 0,
         4, 13, 20, 17, 6,
         7, 22, 32, 26, 9]
      );
    });

    it("tests the performance of convolve", () => {
      let matrix = new Matrix(5000, 5000);
      let startTime = Date.now();

      let output = matrix.convolve(
       [1,1,1,
        1,1,1,
        1,1,1]
      );

      let endTime = Date.now();
      console.log(`convolve took: ${endTime - startTime} milliseconds`);
    });

    it("detects edges", () => {
      let matrix = Matrix.fromArray(6, 6,
        [  0,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0,  0,
         255,255,255,255,255,255,
         255,255,255,255,255,255,
         255,255,255,255,255,255]
      );

      let output = matrix.convolve(
       [-1,-1,-1,
        -1, 8,-1,
        -1,-1,-1]
      );

      expect(new Uint8ClampedArray(output.toArray())).toEqual(new Uint8ClampedArray(
        [  0,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0,  0,
         255,255,255,255,255,255,
           0,  0,  0,  0,  0,  0,
           0,  0,  0,  0,  0,  0]
      ));
    });
  });

  describe("#weightedConvolve", () => {
    it("applies a 3x3 box blur convolution kernel to the matrix", () => {
      let matrix = Matrix.fromArray(3, 3,
        [1,1,1,
         1,2,1,
         1,1,1]
      );

      let output = matrix.weightedConvolve(
       [1,1,1,
        1,1,1,
        1,1,1]
      );

      expect(output.toArray()).toEqual(
        [1,1,1,
         1,1,1,
         1,1,1]
      );
    });

    it("tests the performance of weightedConvolve", () => {
      let matrix = new Matrix(5000, 5000);
      let startTime = Date.now();

      let output = matrix.weightedConvolve(
       [1,1,1,
        1,1,1,
        1,1,1]
      );

      let endTime = Date.now();
      console.log(`weightedConvolve took: ${endTime - startTime} milliseconds`);
    });
  });

  describe("#toImageData", () => {
    it("returns the Matrix as an ImageData object", () => {
      let matrix = Matrix.fromArray(2, 2, [0,2,4,8]);
      let imageData = matrix.toImageData();
      let pixelData = new Uint8ClampedArray([0,0,0,255,2,2,2,255,4,4,4,255,8,8,8,255]);

      expect(imageData).toEqual(new ImageData(pixelData, 2, 2));
    });
  });

  describe("#toArray", () => {
    it("returns the Matrix as a flat array", () => {
      let matrix = Matrix.fromArray(2, 2, [1,2,3,4]);
      expect(matrix.toArray()).toEqual([1,2,3,4]);
    });
  });

  describe(".fromImageData", () => {
    it("creates a Matrix from an ImageData object", () => {
      let pixelData = new Uint8ClampedArray([0,0,0,255,2,2,2,255,4,4,4,255,8,8,8,255]);
      let imageData = new ImageData(pixelData, 2, 2);
      let matrix = Matrix.fromImageData(imageData);

      expect(matrix[0][0]).toEqual(0);
      expect(matrix[1][0]).toEqual(2);
      expect(matrix[0][1]).toEqual(4);
      expect(matrix[1][1]).toEqual(8);
    });
  });

  describe(".fromArray", () => {
    it("creates a Matrix from an array given width and height", () => {
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
