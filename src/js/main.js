var d3 = require("d3");
var classie = require("./classie");
var settings = require("./settings");
console.log( "d3 version is " + d3.version );

var ironCharts = require('./iron-charts/iron-charts');

var icOptions = {
	sizes: {
		width: 900,
		height: 300,
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

ironCharts.start(icOptions, '../data/data.csv');




var redrawBtn = document.getElementById('redraw');
redrawBtn.addEventListener('click', function(){
	ironCharts.redraw();
}, false);

var clearBtn = document.getElementById('clear');
clearBtn.addEventListener('click', function(){
	ironCharts.clear();
}, false);
