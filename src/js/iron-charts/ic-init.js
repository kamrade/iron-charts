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
				.ticks(4)
				.orient('left');
			settings.shapes = {};

			settings.shapes.area = d3.svg.area()
				.interpolate('monotone')
				.x(function(d){ return settings.scale.x(d.date) })
				.y0(settings.sizes.height)
				.y1(function(d){ return settings.scale.y(d.price); });

			settings.shapes.line = d3.svg.line()
				.interpolate('monotone')
				.x(function(d){ return settings.scale.x(d.date); })
				.y(function(d){ return settings.scale.y(d.price); });
		}
		if(options.el) {
			settings.el = options.el;
			settings.svg = d3.select(settings.el);
			settings.svg = settings.svg.append('svg')
				.attr('width', settings.sizes.width + settings.sizes.margins.left + settings.sizes.margins.right)
				.attr('height', settings.sizes.height + settings.sizes.margins.top + settings.sizes.margins.bottom)
				.append('g')
				.attr('transform', 'translate(' + settings.sizes.margins.left + ', ' + settings.sizes.margins.top + ')');
		}
	} else {
		console.log('Use default');
	}
	return settings.svg;
};
