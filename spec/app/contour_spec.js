'use strict';

describe("Contour", () => {
  let Contour = require(__dirname + '../../app/src/Contour');
  let Point   = require(__dirname + '../../app/src/Point');
  let Matrix  = require(__dirname + '../../app/src/Matrix');

  describe("new", () => {
    it("returns a Contour", () => {
      let contour = new Contour([new Point(1,1),new Point(2,2)]);
      expect(contour).toEqual(jasmine.any(Contour));
    });

    it("correctly sets #points", () => {
      let contour = new Contour([new Point(1,1),new Point(2,2)]);
      expect(contour.points).toEqual([new Point(1,1),new Point(2,2)]);
    });
  });

  describe("#includes", () => {
    it("returns true if the contour includes a given point", () => {
      let contour = new Contour([new Point(1,1),new Point(2,2)]);
      expect(contour.includes(new Point(1,1))).toEqual(true);
    });

    it("returns false if the contour does not include a given point", () => {
      let contour = new Contour([new Point(1,1),new Point(2,2)]);
      expect(contour.includes(new Point(10,10))).toEqual(false);
    });
  });

  describe("#isClosed", () => {
    it("returns true if the contour is closed", () => {
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

    it("returns false if the contour is open", () => {
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

  describe("#isOpen", () => {
    it("returns true if the contour is open", () => {
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

    it("returns false if the contour is closed", () => {
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

  describe("#start", () => {
    it("returns the first point in the contour", () => {
      let contour = new Contour([new Point(2,2), new Point(1,2), new Point(2,1), new Point(10,10), new Point(9,11)]);
      expect(contour.start()).toEqual(new Point(2,2));
    });
  });

  describe("#end", () => {
    it("returns the last point in the contour", () => {
      let contour = new Contour([new Point(2,2), new Point(1,2), new Point(2,1), new Point(10,10), new Point(9,11)]);
      expect(contour.end()).toEqual(new Point(9,11));
    });
  });

  describe("#boundingBox", () =>{
    it("correctly returns the bounding box", () =>{
      let contour = new Contour([new Point(2,2), new Point(1,2), new Point(2,1), new Point(10,10), new Point(9,11)]);
      expect(contour.boundingBox()).toEqual({ min: new Point(1,1), max: new Point(10,11) });
    });
  });

  describe("#drawOnMatrix", () =>{
    it("draws each of the points on a target Matrix in the given color", () =>{
      let contour = new Contour([new Point(1,1), new Point(1,2), new Point(1,3), new Point(2,4), new Point(3,4)]);
      let matrix = new Matrix(5,5);

      contour.drawOnMatrix(matrix, 9);

      expect(matrix.toArray()).toEqual(
       [0,0,0,0,0,
        0,9,0,0,0,
        0,9,0,0,0,
        0,9,0,0,0,
        0,0,9,9,0]
      );
    });
  });

  describe("#xMinIntersect", () => {
    it("returns the coordinates of the left-most point in the contour", () => {
      let matrix = Matrix.fromArray(11, 11,
        [0,0,0,0,1,1,1,0,0,0,0,
         0,0,0,1,0,0,0,1,0,0,0,
         0,0,1,0,0,0,0,0,1,0,0,
         0,1,0,0,0,0,0,0,0,1,0,
         1,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,1,
         0,1,0,0,0,0,0,0,0,1,0,
         0,0,1,0,0,0,0,0,1,0,0,
         0,0,0,1,0,0,0,1,0,0,0,
         0,0,0,0,1,1,1,0,0,0,0]
      );

      let contour = Contour.traceFromMatrix(matrix, 5, 0);
      expect(contour.boundingBox()).toEqual({ min: new Point(0, 0), max: new Point(10, 10) });
      expect(contour.points.length).toEqual(24);
      expect(contour.xMinIntersect()).toEqual(new Point(0,4));
    });
  });

  describe("#xMaxIntersect", () => {
    it("returns the coordinates of the right-most point in the contour", () => {
      let matrix = Matrix.fromArray(11, 11,
        [0,0,0,0,1,1,1,0,0,0,0,
         0,0,0,1,0,0,0,1,0,0,0,
         0,0,1,0,0,0,0,0,1,0,0,
         0,1,0,0,0,0,0,0,0,1,0,
         1,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,1,
         0,1,0,0,0,0,0,0,0,1,0,
         0,0,1,0,0,0,0,0,1,0,0,
         0,0,0,1,0,0,0,1,0,0,0,
         0,0,0,0,1,1,1,0,0,0,0]
      );

      let contour = Contour.traceFromMatrix(matrix, 5, 0);
      expect(contour.boundingBox()).toEqual({ min: new Point(0, 0), max: new Point(10, 10) });
      expect(contour.points.length).toEqual(24);
      expect(contour.xMaxIntersect()).toEqual(new Point(10,6));
    });
  });

  describe("#yMinIntersect", () => {
    it("returns the coordinates of the left-most point in the contour", () => {
      let matrix = Matrix.fromArray(11, 11,
        [0,0,0,0,1,1,1,0,0,0,0,
         0,0,0,1,0,0,0,1,0,0,0,
         0,0,1,0,0,0,0,0,1,0,0,
         0,1,0,0,0,0,0,0,0,1,0,
         1,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,1,
         0,1,0,0,0,0,0,0,0,1,0,
         0,0,1,0,0,0,0,0,1,0,0,
         0,0,0,1,0,0,0,1,0,0,0,
         0,0,0,0,1,1,1,0,0,0,0]
      );

      let contour = Contour.traceFromMatrix(matrix, 5, 0);
      expect(contour.boundingBox()).toEqual({ min: new Point(0, 0), max: new Point(10, 10) });
      expect(contour.points.length).toEqual(24);
      expect(contour.yMinIntersect()).toEqual(new Point(6,0));
    });
  });

  describe("#yMaxIntersect", () => {
    it("returns the coordinates of the bottom-most point in the contour", () => {
      let matrix = Matrix.fromArray(11, 11,
        [0,0,0,0,1,1,1,0,0,0,0,
         0,0,0,1,0,0,0,1,0,0,0,
         0,0,1,0,0,0,0,0,1,0,0,
         0,1,0,0,0,0,0,0,0,1,0,
         1,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,1,
         0,1,0,0,0,0,0,0,0,1,0,
         0,0,1,0,0,0,0,0,1,0,0,
         0,0,0,1,0,0,0,1,0,0,0,
         0,0,0,0,1,1,1,0,0,0,0]
      );

      let contour = Contour.traceFromMatrix(matrix, 5, 0);
      expect(contour.boundingBox()).toEqual({ min: new Point(0, 0), max: new Point(10, 10) });
      expect(contour.points.length).toEqual(24);
      expect(contour.yMaxIntersect()).toEqual(new Point(4,10));
    });
  });

  describe("#findVertices", () => {
    it("returns the coordinates of the vertices in the contour", () => {
      let matrix = Matrix.fromArray(11, 11,
        [0,0,0,0,1,1,1,0,0,0,0,
         0,0,0,1,0,0,0,1,0,0,0,
         0,0,1,0,0,0,0,0,1,0,0,
         0,1,0,0,0,0,0,0,0,1,0,
         1,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,1,
         1,0,0,0,0,0,0,0,0,0,1,
         0,1,0,0,0,0,0,0,0,1,0,
         0,0,1,0,0,0,0,0,1,0,0,
         0,0,0,1,0,0,0,1,0,0,0,
         0,0,0,0,1,1,1,0,0,0,0]
      );

      let contour = Contour.traceFromMatrix(matrix, 5, 0);
      expect(contour.points.length).toEqual(24);
      expect(contour.findVertices()).toEqual([new Point(5,0), new Point(10,5), new Point(5, 10), new Point(0,5)]);
    });
  });

  describe(".traceFromMatrix", () => {
    it("returns a new contour with the correct points", () => {
      let matrix = Matrix.fromArray(10, 10,
        [0,0,0,0,0,0,0,0,0,0,
         0,1,1,1,0,0,1,1,1,0,
         0,1,0,1,1,1,1,0,1,0,
         0,1,0,0,0,1,0,0,1,0,
         0,1,1,1,0,0,0,1,1,0,
         0,0,0,1,0,0,0,1,0,0,
         0,0,0,1,0,0,1,1,0,0,
         0,0,0,1,0,1,0,0,0,0,
         0,0,0,1,0,1,0,0,0,0,
         0,0,0,1,1,1,0,0,0,0]
      );

      let contour = Contour.traceFromMatrix(matrix, 1, 1);
      expect(contour.boundingBox()).toEqual({ min: new Point(1, 1), max: new Point(8, 9) });
      expect(contour.points.length).toEqual(31);
      expect(contour.isClosed()).toEqual(true);
    });
  });

  describe(".findContoursFromMatrix", () => {
    it("returns all the contours in a Matrix", () => {
      let matrix = Matrix.fromArray(10, 10,
        [0,0,0,0,1,1,1,1,1,1,
         1,1,1,0,1,0,0,0,0,1,
         1,0,1,0,1,0,1,1,0,1,
         1,0,1,0,1,0,1,1,0,1,
         1,1,1,0,1,0,1,1,0,1,
         0,0,0,0,1,0,1,1,0,1,
         1,1,1,0,1,0,1,1,0,1,
         1,0,1,0,1,0,0,0,0,1,
         1,0,1,0,1,0,0,0,0,1,
         1,1,1,0,1,1,1,1,1,1]
      );

      let contours = Contour.findContoursFromMatrix(matrix);
      expect(contours.length).toEqual(4);

      expect(contours[0].boundingBox()).toEqual({ min: new Point(0,1), max: new Point(2,4) });
      expect(contours[0].isClosed()).toEqual(true);

      expect(contours[1].boundingBox()).toEqual({ min: new Point(0,6), max: new Point(2,9) });
      expect(contours[1].isClosed()).toEqual(true);

      expect(contours[2].boundingBox()).toEqual({ min: new Point(4,0), max: new Point(9,9) });
      expect(contours[2].isClosed()).toEqual(true);

      expect(contours[3].boundingBox()).toEqual({ min: new Point(6,2), max: new Point(7,6) });
      expect(contours[3].isClosed()).toEqual(true);
    });

    it("discards any open contours", () => {
      let matrix = Matrix.fromArray(10, 10,
        [0,0,1,0,0,1,0,1,0,0,
         0,0,1,0,0,1,0,1,0,0,
         0,0,1,0,0,1,0,1,0,0,
         0,0,1,0,0,1,0,1,0,0,
         0,0,1,0,0,1,0,1,0,0,
         0,0,1,0,0,1,0,1,0,0,
         0,0,1,0,0,1,0,1,0,0,
         0,0,1,0,0,1,0,1,0,0,
         0,0,1,0,0,1,0,1,0,0,
         0,0,1,0,0,1,0,1,0,0]
      );

      let contours = Contour.findContoursFromMatrix(matrix);
      expect(contours.length).toEqual(0);
    });

    it("discards any closed contours shorter than 10 points", () => {
      let matrix = Matrix.fromArray(5, 5,
        [0,0,0,0,0,
         0,1,1,1,0,
         0,1,0,1,0,
         0,1,1,1,0,
         0,0,0,0,0]
      );

      let contours = Contour.findContoursFromMatrix(matrix);
      expect(contours.length).toEqual(0);
    });
  });
});
