var settings = require('./ic-settings');
var d3 = require("d3");
var clear = require('./ic-clear');

module.exports = function() {
	clear();

	settings.zoom = d3.behavior.zoom()
		.x(settings.scale.x)
		// .y(settings.scale.y)
		.scaleExtent([1, 10])
		.on('zoom', zoomed);

	settings.svg = settings.svg.append('svg')
		.attr('width', settings.sizes.width + settings.sizes.margins.left + settings.sizes.margins.right)
		.attr('height', settings.sizes.height + settings.sizes.margins.top + settings.sizes.margins.bottom)
		.append('g')
		.attr('transform', 'translate(' + settings.sizes.margins.left + ', ' + settings.sizes.margins.top + ')')
		.call(settings.zoom);

	settings.svg.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
		.attr('width', settings.sizes.width)
		.attr('height', settings.sizes.height);

	settings.svg.datum(settings.data)
		// .on('dblclick', dblclick)
		;

	var groupArea = settings.svg.append('g');
	groupArea.append('path')
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

	var groupLineCaptured = settings.svg.append('g');
	groupLineCaptured.append('path')
		.attr('class', 'line line-captured')
		.attr('clip-path', 'url(#clip)')
		.attr('d', settings.shapes.lineCaptured);

	var groupLineDeclined = settings.svg.append('g');
	groupLineDeclined.append('path')
		.attr('class', 'line line-declined')
		.attr('clip-path', 'url(#clip)')
		.attr('d', settings.shapes.lineDeclined);

	settings.svg.append('text')
		.attr('x', settings.sizes.width - 6)
		.attr('y', settings.sizes.height - 6)
		.style('text-anchor', 'end')
		.text('Look at this text!');
};


var zoomed = function() {
	console.log(' +++ zooming +++ ');
	// console.log(d3.event.translate);
	// console.log(d3.event.scale);
	settings.svg.select(".x.axis").call(settings.axis.xAxis);
	settings.svg.select(".y.axis").call(settings.axis.yAxis);
	settings.svg.select('.area').attr('d', settings.shapes.area);
	settings.svg.select(".line.line-captured")
		.attr("class", "line line-captured")
		.attr("d", settings.shapes.lineCaptured);
	settings.svg.select(".line.line-declined")
		.attr("class", "line line-declined")
		.attr("d", settings.shapes.lineDeclined);
};

// function dblclick(){
// 	console.log('click');
// 	var n = settings.data.length - 1,
// 		i = Math.floor(Math.random() * n/2),
// 		j = i + Math.floor(Math.random() * n/2) + 1;
// 	settings.scale.x.domain([settings.data[i].date, settings.data[j].date]);
// 	var t = settings.svg.transition().duration(450);
// 	t.select('.x.axis').call(settings.axis.xAxis);
// 	t.select('.area').attr('d', settings.shapes.area);
// 	t.select('.line-captured').attr('d', settings.shapes.lineCaptured);
// 	t.select('.line-declined').attr('d', settings.shapes.lineDeclined);
// 	t.select('.line-voided').attr('d', settings.shapes.lineVoided);
// 	t.select('.line-chargeback').attr('d', settings.shapes.lineChargeback);
// }
