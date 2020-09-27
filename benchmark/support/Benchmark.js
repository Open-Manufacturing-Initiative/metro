'use strict';

module.exports = class Benchmark {
	constructor(name) {
		this.name = name;
		this.results = [];
	}

	run(times = 1, func) {
		console.log()
		for(let i = 0; i < times; i++) {
			process.stdout.write(`  Benchmarking ${this.name}... Pass ${i + 1}\r`);
			func();
		}
	}

	time(func) {
		let startTime = Date.now();
		func();
		let endTime = Date.now();
		this.results.push(endTime - startTime);
	}

	print() {
		process.stdout.write(`  ${this.name.padEnd(30)} (${this.results.length}x): Average run took: ${Math.round(this.results.avg()).toString().padEnd(4)} ms\r`);
	}

	static do(name, func) {
		let b = new Benchmark(name);
		b.run(3, func.bind(b));
		b.print();
	}

	static class(name, func) {
		process.stdout.write(name);
		func();
		process.stdout.write("\n\n")
	}
}