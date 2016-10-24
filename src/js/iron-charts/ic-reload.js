var settings = require('./ic-settings');
var redraw = require('./ic-redraw');
var d3 = require("d3");

// var parse = d3.time.format("%b %Y").parse;
//
// function type(d) {
// 	d.date = parse(d.date);
// 	d.total = +d.total;
// 	if (d.symbol === "S&P 500") return d;
// }

var normalize = function(data){
	data.map(function(d){
		d.date = new Date(d.date);
	});
	return data;
};

module.exports = function(dataPath, dataType) {
	if (dataType === 'csv') {
		d3.csv(dataPath, type, function(error, data) {
			if(error) throw error;

			if(settings.scale) {
				settings.scale.x.domain([ data[0].date, data[data.length - 1].date ]);
				settings.scale.y.domain([ 0, d3.max(data, function(d){ return d.total; }) ]).nice();
			}
			settings.data = data;
			redraw();
		});
	} else if(dataType === 'json') {
		d3.json(dataPath, function(error, data) {
			if(error) throw error;
			data = normalize(data);
			if(settings.scale) {
				settings.scale.x.domain([ data[0].date, data[data.length - 1].date ]);
				settings.scale.y.domain([ 0, d3.max(data, function(d){ return d.total; }) ]).nice();
			}
			settings.data = data;
			redraw();
		});
	}

};
