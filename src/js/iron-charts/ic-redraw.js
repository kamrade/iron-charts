var settings = require('./ic-settings');
var d3 = require("d3");
var clear = require('./ic-clear');

module.exports = function() {
	clear();
	settings.svg.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
		.attr('width', settings.sizes.width)
		.attr('height', settings.sizes.height);

	settings.svg.datum(settings.data).on('click', click);

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


function click(){
	console.log('click');
	var n = settings.data.length - 1,
		i = Math.floor(Math.random() * n/2),
		j = i + Math.floor(Math.random() * n/2) + 1;
	settings.scale.x.domain([settings.data[i].date, settings.data[j].date]);
	var t = settings.svg.transition().duration(450);
	t.select('.x.axis').call(settings.axis.xAxis);
	t.select('.area').attr('d', settings.shapes.area);
	t.select('.line').attr('d', settings.shapes.line);
}
