const root = d3.select("body").append("div").attr("id", "root");
root
  .append("h1")
  .attr("id", "title")
  .text("Monthly Global Land-Surface Temperature");
root
  .append("h2")
  .attr("id", "description")
  .text("1753 - 2015: base temperature 8.66°C");

fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((res) => res.json())
  .then((res) => loadHeatMap(res));

const loadHeatMap = (data) => {
  const width = 800;
  const height = 500;
  const padding = 40;

  //Draw the Canvas
  const svg = root
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "heatMap");

  //Add the X-Axis
  const xScale = d3.scaleLinear();
  xScale.domain([0, 100]);
  xScale.range([padding, width - padding]);

  const xAxis = d3.axisBottom(xScale);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  //Add the Y-Axis
  const yScale = d3.scaleLinear();
  yScale.domain([0, 100]);
  yScale.range([height - padding, padding]);

  const yAxis = d3.axisLeft(yScale);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);
};
