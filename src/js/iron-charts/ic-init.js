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
				.tickSize(-1*settings.sizes.width)
				.orient('left');
			settings.shapes = {};

			settings.shapes.area = d3.svg.area()
				.interpolate('linear')
				.x(function(d){ return settings.scale.x(d.date) })
				.y0(settings.sizes.height)
				.y1(function(d){ return settings.scale.y(d.total); });

			settings.shapes.lineTotal = d3.svg.line()
				.interpolate('linear')
				.x(function(d){ return settings.scale.x(d.date); })
				.y(function(d){ return settings.scale.y(d.total); });

			settings.shapes.lineCaptured = d3.svg.line()
				.interpolate('linear')
				.x(function(d){ return settings.scale.x(d.date); })
				.y(function(d){ return settings.scale.y(d.CAPTURED); });

			settings.shapes.lineDeclined = d3.svg.line()
				.interpolate('linear')
				.x(function(d){ return settings.scale.x(d.date); })
				.y(function(d){ return settings.scale.y(d.DECLINED); });


		}
		if(options.el) {
			settings.el = options.el;
			settings.svg = d3.select(settings.el);

		}
	} else {
		console.log('Use default');
	}
	return settings.svg;
};
