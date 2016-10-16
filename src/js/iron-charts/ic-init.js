var settings = require('./ic-settings');

module.exports = function(options){
	if(options){
		if(options.sizes) {
			settings.sizes.width   = options.sizes.width;
			settings.sizes.height  = options.sizes.height;
			settings.sizes.margins = options.sizes.margins;
		}
	} else {
		console.log('Use default');
	}
};


// if(options){
// 	if ('margin' in options) {
// 		margin = options.margin;
// 	}
// 	if ('size' in options) {
// 		width = options.size.width - margin.left - margin.right;
// 		height = options.size.height - margin.top - margin.bottom;
// 	}
// 	if ('autosize' in options) {
// 		autosize = options.autosize;
// 	}
// }
