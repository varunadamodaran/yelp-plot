'use strict'; //strict mode: catch silly errors

// This function loads data from the JSON file provided
function load_data(YelpData,option,city){
  //Initializing local variables
    var rating = []
    var review = []
    var name = []
    var category = []
    var chart_data = {}
    // Get JSON data
    var p = $.getJSON(YelpData).then(function(data1) {
    rating  = []
    review = []
    name = []
    
    var len_array = data1.length
    // Loop through the array of objects
    for (var a =0 ; a<len_array;a++){
        var data = data1[a] 
        var len = data.businesses.length
        // Loop within one object. Each object contains 20 businesses data
        for (var i =0;i<len;i++){
          category = []
          console.log( data.businesses[i].location)
          var data_city = data.businesses[i].location.city.toLowerCase()
          console.log(data_city)
          console.log(city)
          var len_cat = data.businesses[i].categories.length
          // Loop through the number of categories for each business and create an array of categories
          for (var j = 0;j<len_cat;j++){
              var len1 = data.businesses[i].categories[j].length
              console.log(len1)
              for(var k = 0;k<len1;k++){
                  category.push(data.businesses[i].categories[j][k])
              }
              }
          // If the category and city of the business matches those provided by the user, add the business to the plot data
          if (category.indexOf(option) > -1 && data_city == city ){
          rating.push(data.businesses[i].rating)
          review.push(data.businesses[i].review_count)
          name.push(data.businesses[i].name)
          }
          
        }
      //Clear data for each new business
      chart_data = {}
      chart_data = {
        ratings:rating,
        reviews:review,
        names:name
      }
    }
    // return the data to be plotted by the chart
    return chart_data;
    });
    return p;
}

/// Functions on the click of the "Visualize Data" button
var button = $('#Find')
var option = button.click(function(){
    var text = $('#Option').val(); // Retrieving the user's choice of categories
    var city = $('#City').val(); // Retrieving the user's choice of city
    if(text != ""){
   var p = load_data('yelp_data1.json',text,city).then(function(data) { // calling the load data function 
   //console.log(data)
   draw_plot(data) // Call the function for drawing plot 
   });
    }
})

 
 
// function redraw(g) {
//       g.attr("transform",
//           "translate(" + d3.event.translate + ")"
//           + " scale(" + d3.event.scale + ")");
//     } 

// This function draw the scatter plot after loading the data
function draw_plot(chart_data){
  
      // Clear the chart whenever user changes the inputs
      d3.select('svg').remove()
      var xdata = chart_data.reviews // x axis is the number of reviews
      var ydata = chart_data.ratings // y axis is the rating
      var names = chart_data.names // the name of the business 

      // size and margins for the chart
      var margin = {top: 40, right: 20, bottom: 120, left: 60}
        , width = 1000 - margin.left - margin.right
        , height = 500 - margin.top - margin.bottom;

      // x and y scales
      // the scales translate data values to pixel values 
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
      .attr('width', 1000)
      .attr('class', 'chart')
      

      // the main object where the chart and axis will be drawn
      var main = chart.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('width', 1000)
      .attr('height', 500)
      .attr('class', 'main') 

      // draw the x axis
      var xAxis = d3.svg.axis()
      .scale(x)
      .orient(1000);
      
      main.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .attr('class', 'axis')
      .style({ 'stroke': 'Grey', 'fill': 'none'})
      .call(xAxis)
      .selectAll("text")
      .style({ 'stroke': 'black', 'width':''})
      .style({'font-size': '11px', 'font-family': 'serif', // Style for the x axis
          'font-style': 'normal', 'font-variant': 'normal', 
          'font-weight': 'lighter'});


      // Adding label for x axis
      main.append("text")
        .attr("transform", "translate(" + (width / 2) + " ," + (height+40) + ")")
        .style("text-anchor", "middle")
        .attr("fill","#c41200")
        .style({'font-size': '14px', 'font-family': 'sans-serif', // Style for the x axis label
                  'font-style': 'normal', 'font-variant': 'bold', 
                  'font-weight': 'bold'})
        .text("Number  Of  Reviews")

      // draw the y axis
      var yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')


      main.append('g')
      .attr('transform', 'translate(0,0)')
      .attr('class', 'axis')
      .style({ 'stroke': 'grey', 'fill': 'none'}) // Style the y axis
      .call(yAxis)
      .selectAll("text")
              .style({ 'stroke': 'black', 'width':''}) 
              .style({'font-size': '11px', 'font-family': 'serif',
                  'font-style': 'normal', 'font-variant': 'normal', 
                  'font-weight': 'normal'});

      //Adding label for y axis
      main.append("text")
        .attr("transform", "rotate(-90)")  // Style the y axis label
              .attr("y", 0 - margin.left)
              .attr("x",0 - (height / 2))
              .attr("fill","#c41200")
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .style({'font-size': '14px', 'font-family': 'sans-serif',
                  'font-style': 'normal', 'font-variant': 'normal', 
                  'font-weight': 'bold'})
        .text("User Ratings")

      // draw the graph object
      var g = main.append("svg:g"); 
      
      // the tool tip variable which contains the style for the tool tip 
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
            .attr("r", 13) // radius of circle
            .attr("fill","grey")
            .style("opacity", 0.65) // opacity of circle
            .on("mouseover", function(d,i) {    // the actions to be performed on mouse over  
                d3.select(this).transition()
                .duration(750)
                .attr("r", 15) // set the radius on mouse over
                .attr("fill","#c41200") // color change on mouse over
                .style("opacity", 0.7)
                return tooltip.style("visibility", "visible"),tooltip.text(names[i]+ ",  Rating:"+ydata[i]+",   #Reviews:"+xdata[i]);
                  })   // set the tool tip variable and return it
            .on("mouseout", function(d) {      // actions to be performed on mouse out
                d3.select(this).transition()
                .duration(750)
                .attr("r", 13)
                .attr("fill","grey") // color back to grey on mouse out
                return tooltip.style("visibility", "hidden"); // Tool tip is hidden
                  }) 
            .on("mousemove", function(){
              return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
              })

}
