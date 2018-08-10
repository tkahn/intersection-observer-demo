# Intersection Observer Demo

This is a demo showing the possibilities of using IntersectionObserver to load images only when they come into view.

It's based on Dean Humes [lazy-observer-load](https://github.com/deanhume/lazy-observer-load/). To this I've added:

* A small Gulp server
* Demo images
* Information about your browser and whether it supports Intersection Observer or not. 

I have also configured it so it monitors the intersection of the images continuosly and shows how many percent of each image is visible in the viewport at any given time.

## Setup
Run "npm install" to install gulp and the gulp server (gulp-connect).
Start the server by typing "gulp" in the terminal. This will start a node webserver at http://localhost:3000. It also starts a watch for html, css and js files in the project so you can play around with the code and not have to refresh the browser all the time.

For further support regarding the gulp server, I refer to [gulp-connect](https://www.npmjs.com/package/gulp-connect).

![Intersection Observer Demo](http://smoothdivscroll.com/intersection-observer-demo/intersection-observer-demo-screenshot.png "Intersection Observer Demo")


