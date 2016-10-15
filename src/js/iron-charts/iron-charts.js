var d3 = require("d3");

module.exports = (function(){

	var margin = {
		top: 40,
		right: 40,
		bottom: 40,
		left: 40
	};
	var autosize = false;
	var width  = 960 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;
	var parse = d3.time.format("%b %Y").parse;
	var svg;
	var $el;

	var init = function(el, options){

		console.log('initialization...');
		if(options){
			if ('margin' in options) {
				margin = options.margin;
			}
			if ('size' in options) {
				width = options.size.width - margin.left - margin.right;
				height = options.size.height - margin.top - margin.bottom;
			}
			if ('autosize' in options) {
				autosize = options.autosize;
			}
		}

		if(el) {
			$el = document.querySelector(el);
		}
		svg = d3.select('.charts');

		console.log(width+'x'+height);
		console.log((width + margin.left + margin.right)+'x'+(height + margin.top + margin.bottom));

		var x = d3.time.scale()
			.range([0, width]);

		var y = d3.scale.linear()
			.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.tickSize(-height);

		var yAxis = d3.svg.axis()
			.scale(y)
			.ticks(20)
			.orient('left');

		var area = d3.svg.area()
			.interpolate('monotone')
			.x(function(d){ return x(d.date); })
			.y0(height)
			.y1(function(d){ return y(d.price); });

		var line = d3.svg.line()
			.interpolate('monotone')
			.x(function(d){
				return x(d.date);
			})
			.y(function(d){
				return y(d.price);
			});

		svg = svg.append('svg')
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

			svg.datum(data)
				.on('click', click);

			svg.append('path')
				.attr('class', 'area')
				.attr('fill', 'rgba(231, 106, 73, 0.8)')
				.attr('clip-path', 'url(#clip)')
				.attr('d', area);

			svg.append('g')
				.attr('class', 'x axis')
				.attr('transform', 'translate(0,' + height + ')')
				.call(xAxis);

			svg.append('g')
				.attr('class', 'y axis')
				.call(yAxis);

			svg.append('path')
				.attr('class', 'line')
				.attr('clip-path', 'url(#clip)')
				.attr('d', line);

			svg.append('text')
				.attr('x', width - 6)
				.attr('y', height - 6)
				.style('text-anchor', 'end')
				.text(data[0].symbol);

			function click(){
				var n = data.length - 1,
					i = Math.floor(Math.random() * n/2),
					j = i + Math.floor(Math.random() * n/2) + 1;
				x.domain([data[i].date, data[j].date]);
				var t = svg.transition().duration(450);
				t.select('.x.axis').call(xAxis);
				t.select('.area').attr('d', area);
				t.select('.line').attr('d', line);
			}

		});

	};


	function type(d) {
		d.date = parse(d.date);
		d.price = +d.price;
		if (d.symbol === "S&P 500") return d;
	}

	return {
		init: init
	};

})();