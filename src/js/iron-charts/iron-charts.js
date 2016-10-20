var d3 = require("d3");

var settings = require('./ic-settings');
var init     = require('./ic-init');
var reload   = require('./ic-reload');
var redraw   = require('./ic-redraw');
var clear    = require('./ic-clear');
var svg;

module.exports = (function(){

	var start = function(options, dataPath){
		svg = init(options);
		reload(dataPath);
	};

	return {
		start: start,
		redraw: redraw,
		clear: clear
	};

})();
