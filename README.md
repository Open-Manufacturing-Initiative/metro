# Metro

Metro is an open-source system for taking measurements of physical objects using flatbed scanners as an imaging system. Metro aims to replicate the functionality of a computerized 'optical comparator' for much lower cost and with no specialized hardware, albeit with reduced accuracy.

Metro uses computer vision techniques for finding the outlines of scanned parts, classifying parts according to a stored library of user-created templates, and facilitating automatic measurement of parts.

Metro is written in pure JavaScript in order to ensure it's easily portable between different systems/architectures, and in order to keep the barrier to understanding and contributing to the project as low as possible.

### Installation

To install Metro as an end-user please see the Metro website: TODO

### Setting up your development environment

- Install Node Version Manager: https://github.com/nvm-sh/nvm
- Install Node 12.16.3: `nvm install 12.16.3`
- Clone this repo: `git clone git@github.com:Open-Manufacturing-Initiative/metro.git`
- Open the Metro directory: `cd metro`
- Install Node packages: `npm install`
- Run the tests: `npm test`
- Run the benchmarks: `npm run benchmark`
- Start the Electron app: `npm start`

### TODO:

Things that need to be done:
- `Matrix.fromArray` should raise error when `array.length != width * height`
- Work on automatically determing correct threshold level
- Work on finding contour centroids
- Shape classification by counting centroid to contour distance peaks?
- Work on classifying & fingerprinting Parts
- Work out nicer way of setting up tests with matrixes
- Work out how to use images as input for specs
- Use `Point#translate` or similar in contour finding and floodfill loops
- Implement `Contour#copy`
- Implement `Contour#xMinIntersect`, etc...
- Implement `Contour#minBoundingCircle`?
- Implement `Contour#width`
- Implement `Contour#height`
- Implement `Contour#center`
- Implement `Contour#findChildren`
- Implement `Contour#children`
- Implement `Contour#parent`
- Implement `Contour#findEnclosedContours`


### License

This project is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).