require("./../app/src/polyfills");
let Benchmark = require("./support/Benchmark");
let Point = require("./../app/src/Point");
let Matrix = require("./../app/src/Matrix");
let Contour = require("./../app/src/Contour");

Benchmark.class("Matrix", () => {
	Benchmark.do("Matrix.new", function() {
	  this.time(() => {
		  new Matrix(1920, 1080);
		});
	});

	Benchmark.do("Matrix#convolve", function() {
	  let matrix = new Matrix(1920, 1080);

	  this.time(() => {
		  matrix.convolve(
		   [1,1,1,
		    1,1,1,
		    1,1,1]
		  );
		});
	});

	Benchmark.do("Matrix#weightedConvolve", function() {
	  let matrix = new Matrix(1920, 1080);

	  this.time(() => {
		  matrix.weightedConvolve(
		   [1,1,1,
		    1,1,1,
		    1,1,1]
		  );
		});
	});

	Benchmark.do("Matrix#map", function() {
	  let matrix = new Matrix(1920, 1080);

	  this.time(() => {
		  matrix.map((point) => {
		  	//no-op
		  });
		});
	});

	Benchmark.do("Matrix#floodFill", function() {
	  let matrix = new Matrix(1920, 1080);

	  this.time(() => {
		  matrix.floodFill(0,0, 255);
		});
	});

	Benchmark.do("Matrix#fromImageData", function() {
	  let pixelData = new Uint8ClampedArray(1920 * 1080 * 4).fill(255);
	  let imageData = { width: 1920, height: 1080, data: pixelData };

	  this.time(() => {
		  Matrix.fromImageData(imageData);
		});
	});

	Benchmark.do("Matrix#toImageData", function() {
		let matrix = new Matrix(1920, 1080);

	  this.time(() => {
		  matrix.toImageData();
		});
	});

	Benchmark.do("Matrix#fromArray", function() {
	  let array = new Uint8ClampedArray(1920 * 1080);

	  this.time(() => {
		  Matrix.fromArray(1920, 1080, array);
		});
	});

	Benchmark.do("Matrix#toArray", function() {
		let matrix = new Matrix(1920, 1080);

	  this.time(() => {
		  matrix.toArray();
		});
	});

	Benchmark.do("Matrix#[x][y](x1000)", function() {
	  let matrix = new Matrix(1920, 1080);

	  this.time(() => {
	  	for(let x = 0; x < 1000; x++){
	  		matrix[10][1000];
	  	}
		});
	});
});

Benchmark.class("Point", () => {
	Benchmark.do("Point.new", function() {
		this.time(() => {
			new Point(10, 10, 90);
		});
	});

	Benchmark.do("Point#translate", function() {
		let point = new Point(10, 10, 90);
		this.time(() => {
			point.translate(10, 10);
		});
	});
});

Benchmark.class("Contour", () => {
	Benchmark.do("Contour.new", function() {
		let points = Array.init(5000, i => new Point(i,i));

		this.time(() => {
			new Contour(points);
		});
	});

	Benchmark.do("Contour#includes", function() {
		let contour = new Contour(Array.init(5000, i => new Point(i,i)));

		this.time(() => {
			contour.includes(new Point(Infinity, Infinity));
		});
	});

	Benchmark.do("Contour#isClosed", function() {
		let contour = new Contour(Array.init(5000, i => new Point(i,i)));

		this.time(() => {
			contour.isClosed();
		});
	});

	Benchmark.do("Contour#isOpen", function() {
		let contour = new Contour(Array.init(5000, i => new Point(i,i)));

		this.time(() => {
			contour.isOpen();
		});
	});
});
