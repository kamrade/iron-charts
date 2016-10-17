var d3 = require("d3");
var classie = require("./classie");
var settings = require("./settings");

console.log( "d3 version is " + d3.version );

var ironCharts = require('./iron-charts/iron-charts')

var icOptions = {
	sizes: {
		width: 960,
		height: 300,
		margins: {
			top: 20,
			bottom: 40,
			left: 40,
			right: 20
		}
	},
	el: '.charts'
};
ironCharts.start(icOptions);
