var d3 = require("d3");
var classie = require("./classie");
var settings = require("./settings");

console.log( "d3 version is " + d3.version );

var ironCharts = require('./iron-charts/iron-charts');

var icOptions = {
	sizes: {
		width: 600,
		height: 200,
		margins: {
			top: 20,
			bottom: 40,
			left: 40,
			right: 20
		}
	},
	el: '.charts',
	scale: {},
	axis: {},
	shapes: {}
};

ironCharts.start(icOptions, '../data/data.csv', 'csv');

var redrawBtn = document.getElementById('redraw');
redrawBtn.addEventListener('click', function(){
	ironCharts.redraw();
}, false);

var clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', function(){
	ironCharts.clear();
}, false);


// var historyChart = require('./history-chart/history-chart');
// historyChart.start("#history-chart-d3", '/data/transactions.json', 'payments', {
// 	nodeRadius: 4,
// 	gap: 1.5,
// 	margins: {top: 20, right: 20, bottom: 64, left: 50}
// });
