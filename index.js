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

  //Add tooltip
  const tooltip = root
    .append("div")
    .attr("id", "tooltip")
    .style("height", "2rem")
    .style("width", "auto")
    .style("visibility", "hidden");

  //Add the data
  let cellHeight = (height - 2 * padding) / 12;
  const colors = [
    "rgb(114, 0, 0)",
    "rgb(207, 86, 39)",
    "rgb(207, 120, 39)",
    "rgb(223, 198, 89)",
    "rgb(238, 225, 168)",
    "rgb(190, 239, 243)",
    "rgb(176, 197, 243)",
    "rgb(76, 120, 214)",
    "rgb(26, 69, 163)",
  ];

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
        return colors[0];
      } else if (temperature > 10.6) {
        return colors[1];
      } else if (temperature > 9.5) {
        return colors[2];
      } else if (temperature > 8.3) {
        return colors[3];
      } else if (temperature > 7.2) {
        return colors[4];
      } else if (temperature > 6.1) {
        return colors[5];
      } else if (temperature > 5.0) {
        return colors[6];
      } else if (temperature > 3.9) {
        return colors[7];
      } else {
        return colors[8];
      }
    })
    .on("mouseover", (item) => {
      tooltip.style("visibility", "visible");
      tooltip.text(
        new Date(
          item.target["__data__"].year,
          item.target["__data__"].month
        ).toLocaleDateString("en-Us", { year: "numeric", month: "short" }) +
          " - Temp: " +
          (baseTemperature + item.target["__data__"].variance).toFixed(2)
      );
      tooltip.attr("data-year", item.target["__data__"].year);

      document.getElementById("tooltip");
    })
    .on("mouseout", (item) => {
      tooltip.style("visibility", "hidden");
      tooltip.text("");
      tooltip.attr("data-year", "");
    });

  //Add legend
  const legend = root
    .append("svg")
    .attr("id", "legend")
    .attr("width", padding + colors.length * 50)
    .attr("height", 200);

  colors.reverse().forEach((color, index) => {
    legend
      .append("rect")
      .attr("fill", color)
      .attr("width", 50)
      .attr("height", 50)
      .attr("x", padding + 50 * index);
  });

  const legendScale = d3.scaleLinear();
  legendScale.domain([0, 12]);
  legendScale.range([padding + 50, padding + colors.length * 50 - 50]);

  const legendAxis = d3.axisBottom(legendScale);
  legendAxis.ticks(8);

  legend
    .append("g")
    .call(legendAxis)
    .attr("transform", "translate(0," + 50 + ")");
};
