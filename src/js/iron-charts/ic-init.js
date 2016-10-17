var settings = require('./ic-settings');
var d3 = require("d3");

module.exports = function(options){
	if(options){
		if(options.sizes) {
			// set
			settings.sizes.width   = options.sizes.width;
			settings.sizes.height  = options.sizes.height;
			settings.sizes.margins = options.sizes.margins;
			settings.scale = {};
			// calculate
			settings.scale.x = d3.time.scale()
				.range([0, settings.sizes.width]);
			settings.scale.y = d3.scale.linear()
				.range([settings.sizes.height, 0]);
			settings.axis = {};
			settings.axis.xAxis = d3.svg.axis()
				.scale(settings.scale.x)
				.tickSize(-1*settings.sizes.height);
			settings.axis.yAxis = d3.svg.axis()
				.scale(settings.scale.y)
				.ticks(20)
				.orient('left');
		}
		if(options.el) {
			settings.el = options.el;
			settings.svg = d3.select(settings.el)
		}
	} else {
		console.log('Use default');
		console.log('Make sure You set target element "options.el"');
	}
	return settings.svg;
};
