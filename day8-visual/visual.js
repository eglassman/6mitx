var outer_width = 1500;
var outer_height = 300;
var margin = { top: 20, right: 20, bottom: 20, left: 20 };
var chart_width = outer_width - margin.left - margin.right;
var chart_height = outer_height - margin.top - margin.bottom;

var stack = d3.layout.stack();
var stacked_data = stack(data);

var y_stack_max = d3.max(stacked_data, function(layer) {
                    return d3.max(layer, function(d) { return d.y + d.y0; });
                  });
var y_group_max = d3.max(stacked_data, function(layer) {
                    return d3.max(layer, function(d) { return d.y; });
                  });
var x_scale = d3.scale.ordinal().domain(d3.range(data[0].length)) .rangeBands([0, chart_width]);
var y_scale = d3.scale.linear().domain([0, y_stack_max]).range([chart_height, 0]);

var chart = d3.select(".chart-container")
  .append("svg").attr("class", "chart").attr("height", outer_height).attr("width", outer_width)
  .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.selectAll("line").data(y_scale.ticks(10))
  .enter().append("line")
    .attr("x1", 0).attr("x2", chart_width).attr("y1", y_scale).attr("y2", y_scale);

chart.selectAll(".y-scale-label").data(y_scale.ticks(10))
  .enter().append("text").attr("class", "y-scale-label")
    .attr("x", 0).attr("y", y_scale)
    .attr("dx", -margin.left/8).attr("dy", "0.3em")
    .attr("text-anchor", "end")
    .text(String);

var layer_groups = chart.selectAll(".layer").data(stacked_data)
  .enter().append("g").attr("class", "layer");

var rects = layer_groups.selectAll("rect").data(function(d) { return d; })
  .enter().append("rect")
    .attr("x", function(d, i) { return x_scale(i); })
    .attr("y", function(d) { return y_scale(d.y0 + d.y); })
    .attr("width", x_scale.rangeBand())
    .attr("height", function(d) { return y_scale(d.y0) - y_scale(d.y0 + d.y); });

function goGrouped() {
  y_scale.domain([0, y_group_max]);

  rects.transition()
    .duration(1000)
    .delay(function(d, i) { return i * 20; })
    .attr("x", function(d, i, j) {
                 return x_scale(i) + x_scale.rangeBand()/stacked_data.length*j;
               })
    .attr("width", x_scale.rangeBand()/stacked_data.length)
    .transition()
    .attr("y", function(d) { return y_scale(d.y); })
    .attr("height", function(d) { return chart_height - y_scale(d.y); });
}
