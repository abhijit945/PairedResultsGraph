var options = {
    IS_ZOOMABLE: false,
    SHOW_AXIS_LABELS: true,
    CALC_PAIR_MEDIAN: false,
    DATE_FORMAT: "%Y-%m-%d",
    NS_VIZ: "viz-prg-",
    XTICK_COUNT: 8
};
var AXIS_LABELS = {
    X_LABEL: "Date/time",
    Y_LABEL: "BP values"
};

var PLOT_CLASS = {
    CENTER_LINE: "center",
    LOWER_CIRCLE: "whisker-lower",
    MIDDLE_AXALSQ: "axis-aligned-square",
    UPPER_CIRCLE: "whisker-upper"
};

var circleRad = 4,//2r is the square length,breadth
    duration = 1,
    domain = null,
    value = Number;

var margin = { top: 40, right: 40, bottom: 40, left: 40 },
    width = 800,
    height = 500;

//Base Functions
var minVal = d3.min(data, function(d) {
        return d.low;
    }),
    maxVal = d3.max(data, function(d) {
        return d.high;
    });
var dateFormat = function(dt) {
    var parser = d3.time.format(options.DATE_FORMAT).parse;
    return parser(dt).getTime();
};
var getXLowerBound = function() {
    return dateFormat(data[ 0 ].date);
};
var getXUpperBound = function() {
    return dateFormat(data[ data.length - 1 ].date);
};
var handleZoomAction = function() {
    svg.select(".x.axis").call(xAxis);
    svg.selectAll(".box").attr("transform", reTranslateGraph);
};
var reTranslateGraph = function(d) {
    return "translate(" + x(dateFormat(d.date), 0) + ")";
};

//Base Variables
var x_origin_offset = (getXUpperBound() - getXLowerBound()) / 10;
var y_origin_offset = (maxVal - minVal) / 10;

var x = d3.time.scale()
    .domain([ new Date(getXLowerBound() - x_origin_offset),
        new Date(getXUpperBound() + x_origin_offset) ])
    .range([ 0, width - margin.right - margin.left ]);

var y = d3.scale.linear()
    .domain([ !minVal ? 0 : minVal - y_origin_offset, maxVal + y_origin_offset ])
    .range([ height - margin.top - margin.bottom, 0 ]);

//Append X-Axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickSize(4)
    .ticks(d3.min([data.length, options.XTICK_COUNT]))
    .tickFormat(d3.time.format(options.DATE_FORMAT))
    .tickPadding(5);

if (options.IS_ZOOMABLE) {
    xAxis.tickValues(data.map(function(d) {
        return d3.time.format(options.DATE_FORMAT).parse(d.date);
    }));
    //xAxis.tickValues(x.domain());
}

//Append Y-Axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickSize(4)
    .tickPadding(5);

//Instantiate Zoom action
var zoom = d3.behavior.zoom()
    .x(x)
    .scaleExtent([ 0.5, 50 ])
    .on("zoom", handleZoomAction);

//D3 Instantiation
var rootContainer = d3.select('#base-container');

var tip = rootContainer.append("div")
    .attr("id", options.NS_VIZ + "tooltip-container")
    .attr("class", "tooltip-container")
    .style("opacity", 0);

var svgBase = rootContainer.append('svg')
    .attr('viewBox', "0 0 " + width + " " + height)
    .attr('preserveAspectRatio', "xMidYMid meet")
    .attr('id', options.NS_VIZ + "base")
    .attr('class', "base");

svgBase.append('g')
    .append("defs")
    .append("clipPath")
    .attr("id", options.NS_VIZ + "clip")
    .append("rect")
    .attr("id", options.NS_VIZ + "clip-rect")
    .attr("class", "zoom-pane")
    .attr("x", "0")
    .attr("y", "0")
    .attr("width", width - margin.left)
    .attr("height", height - margin.top - margin.bottom);

var svg = d3.select('g');

if (options.SHOW_AXIS_LABELS) {
    //X-Axis label
    svg.append("text")
        .attr("id", options.NS_VIZ + "x-label")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.left)
        .attr("y", height - margin.bottom)
        .text(AXIS_LABELS.X_LABEL);

//Y-Axis label
    svg.append("text")
        .attr("id", options.NS_VIZ + "y-label")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 2)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text(AXIS_LABELS.Y_LABEL);
}

svg.append('g')
    .attr('id', options.NS_VIZ + 'x-axis')
    .attr('class', 'x axis')
    .attr('transform', 'translate(' + margin.left + ', ' + (height - margin.top - margin.bottom) + ')')
    .call(xAxis);

svg.append('g')
    .attr('id', options.NS_VIZ + 'y-axis')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + margin.left + ', 0)')
    .call(yAxis);

if (options.IS_ZOOMABLE) {
    svgBase.call(zoom);
}

var clipPath = svg.append('g')
    .attr("clip-path", "url(#" + options.NS_VIZ + "clip)")
    .attr('transform', 'translate(' + margin.left + ', 0)');

clipPath.append('svg:rect')
    .attr("width", width - margin.left)
    .attr("height", height - margin.top - margin.bottom)
    .attr('fill', 'white');

clipPath.selectAll('box')
    .data(data)
    .enter()
    .append('g')
    .attr("id", options.NS_VIZ + "box")
    .attr("class", "box")
    .call(d3.box());
