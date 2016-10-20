var d3 = require("d3");

var settings = require('./ic-settings');
var init     = require('./ic-init');
var reload   = require('./ic-reload');
var svg;

module.exports = (function(){

	var start = function(options){
		svg = init(options);
		reload('../data/data.csv');
	};

	return {
		start: start
	};

})();
