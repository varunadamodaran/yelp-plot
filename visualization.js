'use strict'; //strict mode: catch silly errors

//the SVG to add stuff to
// var svg = d3.select('#vis-container')
// 		.append('svg')
// 		.attr('height', 500) //can adjust size as desired
// 		.attr('width', 500)
//        .style('border','1px solid gray'); //to show a border


function load_data(YelpData){
    var rating = []
    var review = []
    var name = []
   var p = $.getJSON(YelpData).then(function(data) {
   var len = data.businesses.length
   for (var i =0;i<len;i++){
     rating.push(data.businesses[i].rating)
     review.push(data.businesses[i].review_count)
     name.push(data.businesses[i].name)
   }
   var chart_data = {
     ratings:rating,
     reviews:review,
     names:name
   }
   return chart_data;
   });
   return p;
}

var p = load_data('yelp_data.json').then(function(data) {
   console.log(data);
   draw_plot(data)
   });
   
   
   
function redraw() {
      g.attr("transform",
          "translate(" + d3.event.translate + ")"
          + " scale(" + d3.event.scale + ")");
    } 
// data that you want to plot, I've used separate arrays for x and y values

function draw_plot(chart_data){
 
var xdata = chart_data.reviews
var ydata = chart_data.ratings
var names = chart_data.names

// size and margins for the chart
var margin = {top: 20, right: 20, bottom: 20, left: 60}
  , width = 500 - margin.left - margin.right
  , height = 500 - margin.top - margin.bottom;

// x and y scales
// the scales translate data values to pixel values for you
var x = d3.scale.linear()
          .domain([0, d3.max(xdata)])  // the range of the values to plot
          .range([ 0, width ]);        // the pixel range of the x-axis

var y = d3.scale.linear()
          .domain([0, d3.max(ydata)])
          .range([ height, 0 ]);

// the chart object, includes all margins
var chart = d3.select('#vis-container')
.append('svg')
.attr('height', 500) //can adjust size as desired
.attr('width', 500)
.attr('class', 'chart')

// the main object where the chart and axis will be drawn
var main = chart.append('g')
.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
.attr('width', 500)
.attr('height', 500)
.attr('class', 'main')   

// draw the x axis
var xAxis = d3.svg.axis()
.scale(x)
.orient(500);

main.append('g')
.attr('transform', 'translate(0,' + height + ')')
.attr('class', 'main axis date')
.call(xAxis);

// draw the y axis
var yAxis = d3.svg.axis()
.scale(y)
.orient('left')


main.append('g')
.attr('transform', 'translate(0,0)')
.attr('class', 'main axis date')
.call(yAxis);

// draw the graph object
var g = main.append("svg:g"); 

var tooltip = d3.select("body")
	.append("div")
	.style("visibility", "hidden")
  .style("position", "absolute")
	.text("");




g.selectAll("scatter-dots")
  .data(ydata)  // using the values in the ydata array
  .enter().append("svg:circle")  // create a new circle for each value
      .attr("cy", function (d) { return y(d); } ) // translate y value to a pixel
      .attr("cx", function (d,i) { return x(xdata[i]); } ) // translate x value
      .attr("r", 10) // radius of circle
      .call(d3.behavior.zoom().on("zoom", redraw))
      .attr("fill","grey")
      .style("opacity", 0.6) // opacity of circle
      .on("mouseover", function(d,i) {      
          d3.select(this).transition()
          .duration(750)
          .attr("r", 15)
          .attr("fill","red")
          return tooltip.style("visibility", "visible"),tooltip.text(names[i]+",Rating:"+ydata[i]+",#Reviews:"+xdata[i]);
            })   
      .on("mouseout", function(d) {      
          d3.select(this).transition()
          .duration(750)
          .attr("r", 10)
          .attr("fill","grey")
          return tooltip.style("visibility", "hidden");
            }) 
       .on("mousemove", function(){
         return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
}
//Your code goes here!