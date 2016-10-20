var settings = require('./ic-settings');
var d3 = require("d3");

module.exports = function() {
	settings.svg.datum(settings.data)
	settings.svg.append('path')
		.attr('class', 'area')
		.attr('fill', 'url(#Gradient1)')
		.attr('clip-path', 'url(#clip)')
		.attr('d', settings.shapes.area);

	settings.svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0,' + settings.sizes.height + ')')
		.call(settings.axis.xAxis);

	settings.svg.append('g')
		.attr('class', 'y axis')
		.call(settings.axis.yAxis);

	settings.svg.append('path')
		.attr('class', 'line')
		.attr('clip-path', 'url(#clip)')
		.attr('d', settings.shapes.line);

	settings.svg.append('text')
		.attr('x', settings.sizes.width - 6)
		.attr('y', settings.sizes.height - 6)
		.style('text-anchor', 'end')
		.text(settings.data[0].symbol);
};
