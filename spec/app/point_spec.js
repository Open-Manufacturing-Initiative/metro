'use strict';

// References regarding convolution:
// http://www.songho.ca/dsp/convolution/convolution2d_example.html
// https://en.wikipedia.org/wiki/Kernel_(image_processing)

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
});
