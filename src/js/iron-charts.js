var d3 = require("d3");

module.exports = (function(){

	var margin = {
		top: 40,
		right: 40,
		bottom: 40,
		left: 40
	};

	var width  = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var parse = d3.time.format("%b %Y").parse;

	var x = d3.time.scale()
		.range([0, width]);

	var y = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.tickSize(-height);

	var yAxis = d3.svg.axis()
		.scale(y)
		.ticks(4)
		.orient('right');

	var area = d3.svg.area()
		.interpolate('monotone')
		.x(function(d){
			return x(d.date);
		})
		.y0(height)
		.y1(function(d){
			return y(d.price);
		});

	var line = d3.svg.line()
		.interpolate('monotone')
		.x(function(d){
			return x(d.date);
		})
		.y(function(d){
			return y(d.price);
		});

	var svg = d3.select('.charts').append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
		.append('g')
			.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

	svg.append('clipPath')
			.attr('id', 'clip')
		.append('rect')
			.attr('width', width)
			.attr('height', height);

	d3.csv('../data/data.csv', type, function(error, data){
		if(error) throw error;

		x.domain([data[0].date, data[data.length - 1].date]);
		y.domain([0, d3.max(data, function(d){ return d.price; })]).nice();
		console.log(data);
		svg.datum(data)
			.on('click', click);

		svg.append('path')
			.attr('class', 'area')
			.attr('clip-path', 'url(#clip)')
			.attr('d', area);

	});


	function click(){
		console.log('click');
	}

	function type(d) {
		d.date = parse(d.date);
		d.price = +d.price;
		if (d.symbol === "S&P 500") return d;
	}

	var init = function(){
		console.log('initialization...');
	};

	return {
		init: init
	};

})();
