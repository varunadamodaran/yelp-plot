'use strict'; //strict mode: catch silly errors

//the SVG to add stuff to
// var svg = d3.select('#vis-container')
// 		.append('svg')
// 		.attr('height', 500) //can adjust size as desired
// 		.attr('width', 500)
//        .style('border','1px solid gray'); //to show a border


function load_data(YelpData,option){
    var rating = []
    var review = []
    var name = []
    var category = []
    var chart_data = {}
   var p = $.getJSON(YelpData).then(function(data) {
   rating  = []
   review = []
   name = []
   var len = data.businesses.length
  
   for (var i =0;i<len;i++){
     category = []
     var len_cat = data.businesses[i].categories.length
     console.log(data.businesses[i].categories)
     console.log(data.businesses[i].categories[0][0])
     for (var j = 0;j<len_cat;j++){
       var len1 = data.businesses[i].categories[j].length
       console.log(len1)
      for(var k = 0;k<len1;k++){
         category.push(data.businesses[i].categories[j][k])
      }
     }
    console.log(category)
     if (category.indexOf(option) > -1){
     rating.push(data.businesses[i].rating)
     review.push(data.businesses[i].review_count)
     name.push(data.businesses[i].name)
     }
     
   }
   chart_data = {}
   chart_data = {
     ratings:rating,
     reviews:review,
     names:name
   }
   return chart_data;
   });
   return p;
}
var button = $('#Find')
var option = button.click(function(){
    var text = $('#Option').val();
    if(text != ""){
   var p = load_data('yelp_data_restaurants.json',text).then(function(data) {
   console.log(data);
   draw_plot(data)
   });
    }
})

 
 
function redraw() {
      g.attr("transform",
          "translate(" + d3.event.translate + ")"
          + " scale(" + d3.event.scale + ")");
    } 
    
function draw_plot(chart_data){
d3.select('svg').remove()
      var xdata = chart_data.reviews
      var ydata = chart_data.ratings
      var names = chart_data.names

      // size and margins for the chart
      var margin = {top: 40, right: 20, bottom: 120, left: 60}
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
      .attr('class', 'axis')
      .style({ 'stroke': 'Grey', 'fill': 'none'})
      .call(xAxis)
      .selectAll("text")
              .style({ 'stroke': 'black', 'width':''})
              .style({'font-size': '10px', 'font-family': 'sans-serif',
                  'font-style': 'normal', 'font-variant': 'normal', 
                  'font-weight': 'lighter'});


      // Adding label for x axis
      main.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height+40) + ")")
        .style("text-anchor", "middle")
        .attr("fill","#c41200")
        .style({'font-size': '14px', 'font-family': 'sans-serif',
                  'font-style': 'normal', 'font-variant': 'bold', 
                  'font-weight': 'bold'})
        .text("NUMBER  OF  REVIEWS")

      // draw the y axis
      var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')


      main.append('g')
      .attr('transform', 'translate(0,0)')
      .attr('class', 'axis')
      .style({ 'stroke': 'grey', 'fill': 'none'})
      .call(yAxis)
      .selectAll("text")
              .style({ 'stroke': 'black', 'width':''})
              .style({'font-size': '10px', 'font-family': 'sans-serif',
                  'font-style': 'normal', 'font-variant': 'normal', 
                  'font-weight': 'normal'});

      //Adding label for y axis
      main.append("text")
        .attr("transform", "rotate(-90)")
              .attr("y", 0 - margin.left)
              .attr("x",0 - (height / 2))
              .attr("fill","#c41200")
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .style({'font-size': '14px', 'font-family': 'sans-serif',
                  'font-style': 'normal', 'font-variant': 'normal', 
                  'font-weight': 'bold'})
        .text("USER RATINGS")

      // draw the graph object
      var g = main.append("svg:g"); 

      var tooltip = d3.select("body")
        .append("div")
        .style("visibility", "hidden")
        .style("position", "absolute")
        .style({'font-size': '12px', 'font-family': 'sans-serif',
                  'font-style': 'normal', 'font-variant': 'normal', 
                  'font-weight': 'bold'})
        .text("");
        
      g.selectAll("scatter-dots")
        .data(ydata)  // using the values in the ydata array
        .enter().append("svg:circle")  // create a new circle for each value
            .attr("cy", function (d) { return y(d); } ) // translate y value to a pixel
            .attr("cx", function (d,i) { return x(xdata[i]); } ) // translate x value
            .attr("r", 11) // radius of circle
            .call(d3.behavior.zoom().on("zoom", redraw))
            .attr("fill","grey")
            .style("opacity", 0.6) // opacity of circle
            .on("mouseover", function(d,i) {      
                d3.select(this).transition()
                .duration(750)
                .attr("r", 15)
                .attr("fill","#c41200")
                return tooltip.style("visibility", "visible"),tooltip.text(names[i]+",  Rating:"+ydata[i]+",   #Reviews:"+xdata[i]);
                  })   
            .on("mouseout", function(d) {      
                d3.select(this).transition()
                .duration(750)
                .attr("r", 11)
                .attr("fill","grey")
                return tooltip.style("visibility", "hidden");
                  }) 
            .on("mousemove", function(){
              return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
              })
}
