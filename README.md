# KnobsSVG

![KnobsSVG](http://vaguilera.com/projects/knobssvg/)

Lightwheight JavaScript library that generates circular Knobs in SVG. 

### Usage

Include the `knobssvg.js` file in your HTML file. There are no dependencies.

Create a graph by calling:

```js
KnobsSVG.create({
	id:         'circles-1',
	percentage: 43,
	radius:     60,
	width:      10,
	colors:     ['#D3B6C6', '#4B253A'],

}).onChange( function(value) {
				
	console.log(value);
			
});
```

where

* `id` 					- the DOM element that will hold the graph
* `percentage` 	- the percentage dictating the smaller circle
* `radius` 			- the radius of the circles
* `width` 			- the width of the ring (optional, has value 10, if not specified)
* `colors` 			- an array of colors, with the first item coloring the full circle (optional, it will be `['#EEE', '#F00']` if not specified)

### Styles

The styles have been specified inline to avoid external dependencies. But they can be overriden via CSS easily, being simply HTML elements.

To help with this, a few CSS classes have been exposed:

* `circles-wrp` 			- the element containing the graph


### Inspirations

Code forked by:

* [LugoLabs/Circles](https://github.com/lugolabs/circles)


### Licence

KnobsSVG is licensed under the terms of the MIT License.

### Changelog

* 0.0.1    Forked and modified to allow user interaction
* 0.0.2    Name change and user events added
