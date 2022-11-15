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
  const width = 1400;
  const height = 600;
  const padding = 100;
  const baseTemperature = data.baseTemperature;
  const monthlyVariance = data.monthlyVariance;

  //Draw the Canvas
  const svg = root
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "heatMap");

  //Add the X-Axis
  let minYear = d3.min(monthlyVariance, (d) => d.year);
  let maxYear = d3.max(monthlyVariance, (d) => d.year);
  const xScale = d3.scaleTime();
  xScale.domain([new Date(minYear, 0), new Date(maxYear, 0)]);
  xScale.range([padding, width - padding]);

  const xAxis = d3.axisBottom(xScale);
  xAxis.ticks(20);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(xAxis);

  //Add the Y-Axis
  const yScale = d3.scaleTime();
  yScale.domain([new Date(1970, 0), new Date(1970, 11)]);
  yScale.range([padding, height - padding - 34]);

  const yAxis = d3.axisLeft(yScale);
  yAxis.tickFormat(d3.timeFormat("%B"));
  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);

  //Add the data
  let cellHeight = (height - 2 * padding) / 12;

  svg
    .selectAll("rect")
    .data(monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => baseTemperature - d.variance)
    .attr("x", (d) => xScale(new Date(d.year, 0)))
    .attr("y", (d) => yScale(new Date(1970, d.month - 1)))
    .attr("width", (width - 2 * padding) / (maxYear - minYear))
    .attr("height", cellHeight)
    .attr("fill", (d) => {
      let temperature = baseTemperature + d.variance;
      if (temperature > 11.7) {
        return "rgb(114, 0, 0)";
      } else if (temperature > 10.6) {
        return "rgb(207, 86, 39)";
      } else if (temperature > 9.5) {
        return "rgb(207, 120, 39)";
      } else if (temperature > 8.3) {
        return "rgb(223, 198, 89)";
      } else if (temperature > 7.2) {
        return "rgb(238, 225, 168)";
      } else if (temperature > 6.1) {
        return "rgb(190, 239, 243)";
      } else if (temperature > 5.0) {
        return "rgb(176, 197, 243)";
      } else if (temperature > 3.9) {
        return "rgb(76, 120, 214)";
      } else {
        return "rgb(26, 69, 163)";
      }
    })
    .append("title")
    .text((d) => {
      return (
        new Date(d.year, d.month - 1).toDateString() +
        " Temp: " +
        (baseTemperature + d.variance) +
        "°C"
      );
    });
};
