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
  });

  describe("#includes", function() {
    it("returns true if the contour includes a given point", function() {
      let contour = new Contour([new Point(1,1),new Point(2,2)]);
      expect(contour.includes(new Point(1,1))).toEqual(true);
    });

    it("returns false if the contour does not include a given point", function() {
      let contour = new Contour([new Point(1,1),new Point(2,2)]);
      expect(contour.includes(new Point(10,10))).toEqual(false);
    });
  });

  describe("#isClosed", function() {
    it("returns true if the contour is closed", function() {
      let matrix = Matrix.fromArray(5, 5,
        [0,0,0,0,0,
         0,1,1,1,0,
         0,1,0,1,0,
         0,1,1,1,0,
         0,0,0,0,0]
      );
      let contour = Contour.traceFromMatrix(matrix, 1, 1);
      expect(contour.isClosed()).toEqual(true);
    });

    it("returns false if the contour is open", function() {
      let matrix = Matrix.fromArray(5, 5,
        [0,0,0,0,0,
         0,1,1,1,0,
         0,0,0,1,0,
         0,1,1,1,0,
         0,0,0,0,0]
      );
      let contour = Contour.traceFromMatrix(matrix, 1, 1);
      expect(contour.isClosed()).toEqual(false);
    });
  });

  describe("#isOpen", function() {
    it("returns true if the contour is open", function() {
      let matrix = Matrix.fromArray(5, 5,
        [0,0,0,0,0,
         0,1,1,1,0,
         0,0,0,1,0,
         0,1,1,1,0,
         0,0,0,0,0]
      );
      let contour = Contour.traceFromMatrix(matrix, 1, 1);
      expect(contour.isOpen()).toEqual(true);
    });

    it("returns false if the contour is closed", function() {
      let matrix = Matrix.fromArray(5, 5,
        [0,0,0,0,0,
         0,1,1,1,0,
         0,1,0,1,0,
         0,1,1,1,0,
         0,0,0,0,0]
      );
      let contour = Contour.traceFromMatrix(matrix, 1, 1);
      expect(contour.isOpen()).toEqual(false);
    });
  });

  describe("#start", function() {
    it("returns the first point in the contour", function() {
      let contour = new Contour([new Point(2,2), new Point(1,2), new Point(2,1), new Point(10,10), new Point(9,11)]);
      expect(contour.start()).toEqual(new Point(2,2));
    });
  });

  describe("#end", function() {
    it("returns the last point in the contour", function() {
      let contour = new Contour([new Point(2,2), new Point(1,2), new Point(2,1), new Point(10,10), new Point(9,11)]);
      expect(contour.end()).toEqual(new Point(9,11));
    });
  });

  describe("#boundingBox", function(){
    it("correctly returns the bounding box", function(){
      let contour = new Contour([new Point(2,2), new Point(1,2), new Point(2,1), new Point(10,10), new Point(9,11)]);
      expect(contour.boundingBox()).toEqual({ min: new Point(1,1), max: new Point(10,11) });
    });
  });

  describe(".traceFromMatrix", function() {
    it("returns a new contour with the correct points", function() {
      let matrix = Matrix.fromArray(10, 10,
        [0,0,0,0,0,0,0,0,0,0,
         0,1,1,1,0,0,1,1,1,0,
         0,1,0,0,1,1,0,0,1,0,
         0,1,0,0,0,0,0,0,1,0,
         0,1,1,1,0,0,0,0,1,0,
         0,0,0,1,0,0,0,1,0,0,
         0,0,0,1,0,0,1,0,0,0,
         0,0,0,1,0,1,0,0,0,0,
         0,0,0,1,0,1,0,0,0,0,
         0,0,0,1,1,1,0,0,0,0]
      );

      let contour = Contour.traceFromMatrix(matrix, 1, 1);
      expect(contour.boundingBox()).toEqual({ min: new Point(1, 1), max: new Point(8, 9) });
      expect(contour.points.length).toEqual(27);
    });
  });
});
