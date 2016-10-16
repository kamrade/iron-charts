var settings = require('./ic-settings');
var d3 = require("d3");

module.exports = function(options){
	if(options){
		if(options.sizes) {
			settings.sizes.width   = options.sizes.width;
			settings.sizes.height  = options.sizes.height;
			settings.sizes.margins = options.sizes.margins;
		}
		if(options.el) {
			settings.el = options.el;
			settings.svg = d3.select(settings.el)
		}
	} else {
		console.log('Use default');
		console.log('Make sure You set target element "options.el"');
	}
	return settings.svg;
};
