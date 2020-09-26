'use strict';

describe("Point", () => {
  let Point = require(__dirname + '../../app/src/Point');

  describe("new", () => {
    it("returns a Point", () => {
      let point = new Point(1,2);
      expect(point).toEqual(jasmine.any(Point));
    });

    it("correctly sets #x", () => {
      let point = new Point(1,2);
      expect(point.x).toEqual(1);
    });

    it("correctly sets #y", () => {
      let point = new Point(1,2);
      expect(point.y).toEqual(2);
    });
  });

  describe("#translate", () => {
    it("moves the point by the given amount", () => {
      let point = new Point(1, 10);
      point.translate(10, 10);
      expect(point.x).toEqual(11);
      expect(point.y).toEqual(20);
    });

    it("moves the point by a given negative amount", () => {
      let point = new Point(50, 100);
      point.translate(-10, -10);
      expect(point.x).toEqual(40);
      expect(point.y).toEqual(90);
    });

    it("throws an error when the translation would make the coordinates negative", () => {
      let point = new Point(50, 100);
      expect(() => point.translate(-100, -100)).toThrow("Error: translation would make point have negative values");
    });
  });
});
