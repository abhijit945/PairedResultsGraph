var renderGraph = function(d) {
    var quartile = boxQuartiles,
        hoverEnterEventHandler = handleMouseEnter,
        hoverLeaveEventHandler = handleMouseLeave;
    var g = d3.select(this);
    var quartileData = quartile(d);
    var whiskerData = d;

    // Update center line: the vertical line spanning the whiskers.
    var center = g.selectAll("line.center")
        .data(whiskerData ? [ whiskerData ] : []);

    var whiskerUpper = g.selectAll("circle.whisker-upper")
        .data(whiskerData ? [ whiskerData ] : []);

    var whiskerLower = g.selectAll("circle.whisker-lower")
        .data(whiskerData ? [ whiskerData ] : []);

    var medianPoint = g.selectAll("rect.axis-aligned-square")
        .data(whiskerData ? [ whiskerData ] : []);

    d.plotSize = circleRad;

    if (d.high && d.low) {
        center.enter().insert("line")
            .attr("class", "center")
            .attr("x1", function(d) {
                return x(dateFormat(d.date));
            })
            .attr("y1", function(d) {
                return y(d.low);
            })
            .attr("x2", function(d) {
                return x(dateFormat(d.date));
            })
            .attr("y2", function(d) {
                return y(d.high);
            })
            .transition()
            .duration(duration)
            .style("opacity", 1)
            .attr("y1", function(d) {
                return y(d.low);
            })
            .attr("y2", function(d) {
                return y(d.high);
            });
        if (options.CALC_PAIR_MEDIAN) {
            // Update median line.
            medianPoint.enter().append("rect")
                .attr("class", "axis-aligned-square")
                .attr("transform", "translate(" + (x(dateFormat(d.date))) + ", " + (y(quartileData) - circleRad) + ") rotate(45)")
                .attr("height", function() {
                    return circleRad * 2;
                })
                .attr("width", function() {
                    return circleRad * 2;
                })
                .on("mouseenter", hoverEnterEventHandler)
                .on("mouseleave", hoverLeaveEventHandler)
                .transition()
                .duration(duration);
        }
    }
    if (d.high) {
        whiskerUpper.enter().insert("circle")
            .attr("class", "whisker-upper")
            .attr("cx", function(d) {
                return x(dateFormat(d.date));
            })
            .attr("r", circleRad)
            .attr("cy", function(d) {
                return y(d.high);
            })
            .style("opacity", 1)
            .on("mouseenter", hoverEnterEventHandler)
            .on("mouseleave", hoverLeaveEventHandler)
            .transition()
            .duration(duration)
            .attr("cy", function(d) {
                return y(d.high);
            })
            .style("opacity", 1);
    }

    if (d.low) {
        whiskerLower.enter().insert("circle")
            .attr("class", "whisker-lower")
            .attr("cx", function(d) {
                return x(dateFormat(d.date));
            })
            .attr("r", circleRad)
            .attr("cy", function(d) {
                return y(d.low);
            })
            .style("opacity", 1)
            .on("mouseenter", hoverEnterEventHandler)
            .on("mouseleave", hoverLeaveEventHandler)
            .transition()
            .duration(duration)
            .attr("cy", function(d) {
                return y(d.low);
            })
            .style("opacity", 1);
    }
};

//Take the mean for the values: Ideally get the formula?
var boxQuartiles = function(d) {
    return d.quartile = (d.high + (2 * d.low)) / 3;
};

var handleMouseEnter = function(d) {
    var currentPlotId = null;
    switch (d3.event.target.getAttribute("class")) {
        case PLOT_CLASS.UPPER_CIRCLE:
            currentPlotId = d.high;
            d3.select(this)
                .attr("r", d.plotSize * 2);
            break;
        case PLOT_CLASS.LOWER_CIRCLE:
            currentPlotId = d.low;
            d3.select(this)
                .attr("r", d.plotSize * 2);
            break;
        case PLOT_CLASS.MIDDLE_AXALSQ:
            currentPlotId = d.quartile;
            d3.select(this)
                .attr("height", function() {
                    return d.plotSize * 4;
                })
                .attr("width", function() {
                    return d.plotSize * 4;
                });
            break;
        default:
            break;
    }
    tip.transition()
        .duration(100)
        .style("opacity", 1);
    tip.text(d.date + ": " + currentPlotId)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY + 10) + "px");
};

var handleMouseLeave = function(d) {
    switch (d3.event.target.getAttribute("class")) {
        case PLOT_CLASS.UPPER_CIRCLE:
        case PLOT_CLASS.LOWER_CIRCLE:
            d3.select(this)
                .attr("r", d.plotSize);
            break;
        case PLOT_CLASS.MIDDLE_AXALSQ:
            d3.select(this)
                .attr("height", function() {
                    return d.plotSize * 2;
                })
                .attr("width", function() {
                    return d.plotSize * 2;
                });
            break;
        default:
            break;

    }
    tip.transition()
        .duration(300)
        .style("opacity", 0);
};

(function() {
    d3.box = function() {
        function box(g) {
            g.each(renderGraph);
        }

        box.duration = function(x) {
            if (!arguments.length) return duration;
            duration = x;
            return box;
        };

        box.domain = function(x) {
            if (!arguments.length) return domain;
            domain = x == null ? x : d3.functor(x);
            return box;
        };

        box.value = function(x) {
            if (!arguments.length) return value;
            value = x;
            return box;
        };

        return box;
    };
})();