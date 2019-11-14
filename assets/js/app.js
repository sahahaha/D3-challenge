var svgWidth = 700;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(healthData) {
  	console.log(healthData)
    //Casting data from file as numbers
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Scale functions
    var xScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.poverty)-1, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d.healthcare)-1, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

    // Axis functions
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Applying axis to the chart
    chart.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chart.append("g")
      .call(leftAxis);

    // Creating the circles and their lables
    var circles = chart.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.poverty))
    .attr("cy", d => yScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "lightblue")
    .attr("opacity", "0.8");

    var abbrGroup = chart.selectAll("label")
    .data(healthData)
    .enter()
    .append("text")
    .text(d => d.abbr)
    .attr("font-size",9)
    .attr("font-weight","bold")
    .attr("fill", "white")
    .attr("x", d => xScale(d.poverty)-7)
    .attr("y", d => yScale(d.healthcare)+4);

    // Create axes labels
    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 10)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chart.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
  });