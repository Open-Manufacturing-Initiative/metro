'use strict';

describe("Contour", function() {
  let Contour = require(__dirname + '../../app/src/Contour');
  let Point = require(__dirname + '../../app/src/Point');
  let Matrix = require(__dirname + '../../app/src/Matrix');

  describe("new", function() {
    it("returns a Contour", function() {
      let contour = new Contour([new Point(1,1),new Point(2,2)]);
      expect(contour).toEqual(jasmine.any(Contour));
    });

    it("correctly sets #points", function() {
      let contour = new Contour([new Point(1,1),new Point(2,2)]);
      expect(contour.points).toEqual([new Point(1,1),new Point(2,2)]);
    });

    it("correctly sets #boundingBox", function() {
      let contour = new Contour([new Point(2,2), new Point(1,2), new Point(2,1), new Point(10,10), new Point(9,11)]);
      expect(contour.boundingBox).toEqual({ min: new Point(1,1), max: new Point(10,11) });
    });
  });

  describe(".traceFromMatrix", function() {
    it("returns a new contour with the correct points", function() {
      let matrix = Matrix.fromArray(10, 10,
        [0,0,0,0,0,0,0,0,0,0,
         0,1,1,1,0,0,1,1,1,0,
         0,1,0,0,1,1,1,0,1,0,
         0,1,0,0,0,0,0,0,1,0,
         0,1,1,1,0,0,0,0,1,0,
         0,0,0,1,0,0,0,1,0,0,
         0,0,0,1,0,0,1,0,0,0,
         0,0,0,1,0,1,0,0,0,0,
         0,0,0,1,0,1,0,0,0,0,
         0,0,0,1,1,1,0,0,0,0]
      );

      let contour = Contour.traceFromMatrix(matrix, 1, 1);
      expect(contour.boundingBox).toEqual([[1,1],[8,9]]);
      expect(contour.points.length).toEqual(28);
    });
  });
});
