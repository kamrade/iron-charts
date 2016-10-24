var d3 = require("d3");
var settings = require("./settings");

var historyGraph = (function(){
	var $el;
	var el;
	var tooltip;
	var preloader;

	// options default
	var nodeRadius = 1;
	var gap = 1;
	var margin = {top: 20, right: 0, bottom: 40, left: 50};
	var typeOfTransaction = "";

	var values = {
		all: {
			total: "total",
			payments: "Payment",
			refunds: "Refund",
			payouts: "Payout",
			date: "date"
		},
		payments: {
			total: "total",
			captured: "CAPTURED",
			declined: "DECLINED",
			voided: "VOIDED",
			chargeback: "CHARGEBACK",
			date: "date"
		},
		refunds: {
			total: "total",
			captured: "CAPTURED",
			declined: "DECLINED",
			date: "date"
		},
		payouts: {
			total: "total",
			captured: "CAPTURED",
			declined: "DECLINED",
			date: "date"
		}
	};

	// calculates options
	var width = 0;
	var height = 0;
	var barWidth = 5; // Вычисляется уже в init
	var colors = settings.colors;

	// work
	var dataMain;
	var svg; // main SVG element
	var x; // scaling x
	var y; // scaling y
	var xAxis;
	var yAxis;
	var axis;

	var parseDate = d3.time.format("%Y-%m-%d").parse;
	var formatDate = d3.time.format("%b %d");

// ************************ FUNCTIONS ********************************

// CONNECT SVG
	var connectSVG = function(element, type, options) {
		el = element;
		$el = document.querySelector(element);

		init();
		_createPreloader();
		tooltip = $el.querySelector('.tooltip');

		nodeRadius = options.nodeRadius || nodeRadius;
		gap = options.gap || gap;
		colors = options.colors || colors;
		margin = options.margins || margins;
		typeOfTransaction = type;
	};

	var init = function(){
		width = $el.clientWidth;
		height = $el.clientHeight;

		x = d3.time.scale().range([margin.left, width - margin.right]);
		y = d3.scale.linear().range([height - margin.bottom, margin.top]);

		xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.innerTickSize(-height + margin.top + margin.bottom)
			.outerTickSize(0)
			.tickPadding(10)
			.ticks(d3.time.days, 1)
			.tickFormat(formatDate);
		yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")
			.innerTickSize(-width + margin.left + margin.right)
			.outerTickSize(0)
			.tickPadding(10);
		svg = d3.select(el)
			.append("svg")
			.classed("history-svg", true)
			.attr("width", width)
			.attr("height", height);
		_insertTooltip();
	};

	var normalizeData = function(data){
		data.map(function(d){
			if(typeOfTransaction === "all"){
				d[ values.all.payments ] = d[ values.all.payments ]? d[ values.all.payments ] : 0;
				d[ values.all.refunds ] = d[ values.all.refunds ]? d[ values.all.refunds ] : 0;
				d[ values.all.payouts ] = d[ values.all.payouts ]? d[ values.all.payouts ] : 0;
				d[ values.all.total ] =
					d[ values.all.total ]? d[ values.all.total ] : d[ values.all.payments ] + d[ values.all.refunds ] + d[ values.all.payouts ];
				d[ values.all.date ] = parseDate( d[ values.all.date ].slice(0, 10) );

			} else if (typeOfTransaction === "payments"){
				d[ values.payments.captured ] = d[ values.payments.captured ]? d[ values.payments.captured ] : 0;
				d[ values.payments.declined ] = d[ values.payments.declined ]? d[ values.payments.declined ] : 0;
				d[ values.payments.voided ] = d[ values.payments.voided ]? d[ values.payments.voided ] : 0;
				d[ values.payments.chargeback ] = d[ values.payments.chargeback ]? d[ values.payments.chargeback ] : 0;
				d[ values.payments.total ] =
					d[ values.payments.total ]? d[ values.payments.total ] : d[ values.payments.captured ]
						+ d[ values.payments.declined ] + d[ values.payments.chargeback ] + d[ values.payments.chargeback ];
				d[ values.payments.date ] = parseDate( d[ values.payments.date ].slice(0, 10) );

			} else if(typeOfTransaction === "payouts" || typeOfTransaction === "refunds"){
				d[ values.refunds.captured ] = d[ values.refunds.captured ]? d[ values.refunds.captured ] : 0;
				d[ values.refunds.declined ] = d[ values.refunds.declined ]? d[ values.refunds.declined ] : 0;
				d[ values.refunds.total ] =
					d[ values.refunds.total ]? d[ values.refunds.total ] : d[ values.refunds.captured ] + d[ values.refunds.declined ];
				d[ values.refunds.date ] = parseDate( d[ values.refunds.date ].slice(0, 10) );
			}
		});

		if(data.length > 1){
			var newData = [];
			var tmr;
			for(var i = 0, l = data.length; i < l; i++) {
				newData.push(data[i]);
				if(data[i+1]) {
					tmr = tomorrow(data[i].date);
					while( (data[i+1].date ).toString() != tmr.toString() ) {
						newData.push({
							date: tmr
						});
						for(var key in values[typeOfTransaction]) {
							if (key != values[typeOfTransaction].date){
								newData[newData.length-1][ values[ typeOfTransaction][key] ] = 0;
							}
						}
						tmr = tomorrow(tmr);
					}
				}
			}

			// return data;
			if(newData.length > 30) {
				return newData.slice(newData.length-30, newData.length);
			} else {
				return newData;
			}
		} else {
			return data;
		}
	};

	var tomorrow = function(today){ // args type = Date
		var dt = new Date();
		return new Date(dt.setTime( today.getTime() + (24 * 60 * 60 * 1000) ));
	}

	var drawTotalLine = function(data) {
		var PathGroup = svg.append("g").attr("class", "path-total");
		PathGroup.datum(data);

		var area = d3.svg.area()
			.interpolate('monotone')
			.x(function(d){
				return x(d.date) })
			.y0(height)
			.y1(function(d){
				return y(d.total);
			});

		PathGroup.append('clipPath')
			.attr('id', 'clip')
			.append('rect')
			.attr('width', width - margin.right - margin.left)
			.attr('height', height - margin.top - margin.bottom)
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		PathGroup.append('path')
			.attr('class', 'area')
			.attr('transform', 'translate('+ barWidth/2 +','+ 0 +')')
			.attr('fill', '#333')
			.attr('opacity', 0.1)
			.attr('clip-path', 'url(#clip)')
			.attr('d', area);
	};

	var drawLine = function(key, data){
		var PathGroup = svg.append("g").attr("class", "path-" + typeOfTransaction + "-" +  key);
		var lineCaptured = d3.svg.line()
			.interpolate("linear")
			.x(function(d) { return x(d.date) + barWidth/2; })
			.y(function(d) { return y( d[ values[typeOfTransaction][key] ] ); });
		PathGroup.selectAll("path")
			.data([ data ])
			.enter()
			.append("path")
			.attr("d", lineCaptured)
			.attr("fill", "none")
			.attr("stroke", colors.color[typeOfTransaction][key])
			.attr("stroke-width", gap);
		var dots = svg.append("g")
			.classed(("dots-" + typeOfTransaction + "-" + key), true).selectAll("circle .nodes")
			.data(data)
			.enter()
			.append("svg:circle")
			.classed("nodes", true)
			.attr("cx", function(d){ return x(d.date) + barWidth/2; })
			.attr("cy", function(d){ return y( d[ values[typeOfTransaction][key] ] ); })
			.attr("r", nodeRadius)
			.attr("fill", colors.color[typeOfTransaction][key])
			.attr("stroke", function(d){
				return colors["white"] ;
			})
			.attr("stroke-width", gap);
	};

	var reload = function(filename){
		d3.json(filename, function(rows){
			if(rows){
				rows = normalizeData(rows);
				redraw(rows);
				dataMain = rows;
			} else { console.log("error reading file"); }
		});
	};

	var redraw = function(data) {
		clear();
		init();

		x.domain([ data[0].date, tomorrow( data[data.length - 1].date ) ]);
		y.domain([0, d3.max(data, function(d){ return d.total*1.1 })]);
		barWidth = x( parseDate("2016-07-24") ) - x( parseDate("2016-07-23") ) - gap;

		axis = svg.selectAll(".axis")
			.data([{axis:xAxis, x:0, y:y(0), clazz: "x"},
				{axis:yAxis, x:x.range()[0], y:0, clazz: "y"}]);

		axis.enter().append("g")
			.attr("class", function(d){ return "axis " + d.clazz; })
			.attr("transform", function(d){
				return "translate("+ d.x +","+ d.y +")";
			});
		axis.each(function(d){
			d3.select(this).call(d.axis);
		});

		// поворот текста
		axis.selectAll(".x.axis text")
			.style("text-anchor", "end")
			.attr({dy:"1em",dx:"0.1em", transform: "rotate(-45)"});

		// BARS FAT
		var barsFat = svg.append("g").classed("bg-bars-fat", true).selectAll("rect.bar")
			.data(data);
		barsFat.enter()
			.append("rect")
			.classed("bar", true);
		barsFat
			.attr("x", function(d){ return x(d.date); })
			.attr("width", barWidth)
			.attr("fill", "#ccc")
			.attr("opacity", .3)
			.attr("y", margin.top)
			.attr("height", height - margin.bottom - margin.top );


		// ПРОРИССОВКА ВСЕХ ГРАФИКОВ
		for(var key in values[typeOfTransaction]){
			if (key === 'date') {
				// do nothing
			} else if(key === 'total') {
				drawTotalLine(data);
			} else {
				drawLine(key, data);
			}
		}
	};

// **********************   TOOLS   ***********************

	var destroy = function(){
		if (document.querySelector(".history-svg")) {
			var elForRemove = document.querySelector(".history-svg");
			$el.removeChild( elForRemove );
		}
	}

	var clear = function(){
		$el.innerHTML = '';
		_insertTooltip();
	};

	var _insertTooltip = function(){
		if(!$el.querySelector(".tooltip")){
			var tooltipLocal = document.createElement("div");
			tooltipLocal.className = "tooltip";
			$el.appendChild(tooltipLocal);
			tooltip = $el.querySelector('.tooltip');
		}
	};

	var _createPreloader = function(){
		preloader = document.createElement("div");
		preloader.className = "loader";
		$el.appendChild(preloader);
		var img = preloader.appendChild(document.createElement("img"));
		img.setAttribute("src", "assets/css/imgs/preloader_fast.gif");
	}

	var _showPreloader = function(){
		$el.appendChild( preloader );
	}

// **********************   API   *************************

	var start = function(element, data, type, options){
		connectSVG(element, type, options);
		if(data.length == 0){
			dataMain = null;
			clear();
		} else {
			clear();
			// проверка данных на входе - или это имя файла(string)
			// или объект с данными. потом можно добавить более сложную проверку
			if(typeof data === "string") {
				reload(data);
			} else {
				dataMain = normalizeData(data);
				redraw(dataMain);
			}
		}
	}

	var resizeStart = function(){
		if( dataMain ){
			clear();
			_showPreloader(); // убирается автоматически методом clear внутри redraw()
		}
	};

	var resizeEnd = function(){
		if( dataMain ){
			redraw( dataMain );
		}
	};

	var refresh = function(data, type, fn) {
		if(dataMain){
			typeOfTransaction = type;
			clear();
			_showPreloader();
			reload( data );
			if(fn){ fn(); }
		} else {
			console.log("No data");
		}
	};

	return {
		start: start,
		resizeStart: resizeStart,
		resizeEnd: resizeEnd,
		refresh: refresh
	};

})();

module.exports = historyGraph;
