'use strict';

describe("polyfills", () => {
  require(__dirname + '../../app/src/polyfills');

  describe("Array#last", () => {
    it("returns the last element when called with no parameters", () => {
      let array = [1,2,3,4,5,6];
      expect(array.last()).toEqual(6);
    });

    it("returns the last n elements when called with an integer", () => {
      let array = [1,2,3,4,5,6];
      expect(array.last(3)).toEqual([4,5,6]);
    });
  });

  describe("Array#first", () => {
    it("returns the first element when called with no parameters", () => {
      let array = [1,2,3,4,5,6];
      expect(array.first()).toEqual(1);
    });

    it("returns the first n elements when called with an integer", () => {
      let array = [1,2,3,4,5,6];
      expect(array.first(3)).toEqual([1,2,3]);
    });
  });

  describe("Array#min", () => {
    it("returns the lowest numerical element when called with no parameters", () => {
      let array = [5,4,3,2,1,4,5];
      expect(array.min()).toEqual(1);
    });

    it("raises typeError when called without paramaters on an array that is not numeric", () => {
      let array = [{},NaN];
      expect(() => { array.min(); }).toThrow("typeError: Array#min only works on arrays full of numeric elements when called with no parameters.");
    });

    it("uses a supplied function to find the min", () => {
      let array = [{a: 5}, {a: 4}, {a: 3}, {a: 1}, {a: 2}];
      expect(array.min(x => x.a)).toEqual(1);
    });
  });

  describe("Array#max", () => {
    it("returns the highest numerical element when called with no parameters", () => {
      let array = [5,4,3,2,9,4,5];
      expect(array.max()).toEqual(9);
    });

    it("raises typeError when called without paramaters on an array that is not numeric", () => {
      let array = [{},NaN];
      expect(() => { array.max(); }).toThrow("typeError: Array#min only works on arrays full of numeric elements when called with no parameters.");
    });

    it("uses a supplied function to find the max", () => {
      let array = [{a: 5}, {a: 4}, {a: 3}, {a: 9}, {a: 2}];
      expect(array.max(x => x.a)).toEqual(9);
    });
  });

 describe("Array#avg", () => {
    it("returns theaverage of the numerical elements when called with no parameters", () => {
      let array = [5,4,3,2,9,4,5];
      expect(array.avg()).toEqual(4.571428571428571);
    });

    it("raises typeError when called without paramaters on an array that is not numeric", () => {
      let array = [{},NaN];
      expect(() => { array.avg(); }).toThrow("typeError: Array#avg only works on arrays full of numeric elements when called with no parameters.");
    });

    it("uses a supplied function to find the average", () => {
      let array = [{a: 5}, {a: 4}, {a: 3}, {a: 9}, {a: 2}];
      expect(array.avg(x => x.a)).toEqual(4.6);
    });
  });
});
