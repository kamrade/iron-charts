var d3 = require("d3");

var settings = require('./ic-settings');
var init     = require('./ic-init');
var reload   = require('./ic-reload');
var redraw   = require('./ic-redraw');
var clear    = require('./ic-clear');
var svg;

module.exports = (function(){

	var start = function(options, dataPath, dataType){
		svg = init(options);
		reload(dataPath, dataType);
	};

	return {
		start: start,
		redraw: redraw,
		clear: clear
	};

})();
