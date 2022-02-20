// data url
const dataURL =
   "https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=2000";

// setup chart
const height = 460;
const width = 800;
const widthPadding = 10;
const chartContainer = d3.select(".chart");
// apply logo
chartContainer.html(logo);

const chartOuter = chartContainer
   .append("svg")
   .attr("height", height)
   .attr("width", width + widthPadding);

const chart = chartOuter
   .append("g")
   .attr("height", height)
   .attr("width", width)
   .attr("transform", `translate(${widthPadding}, 0)`);

// tooltip
const tip = d3
   .tip()
   .attr("class", "tooltip")
   .attr("id", "tooltip")
   .direction("n")
   .offset([16, 110])
   .html((d) => {
      console.log(d);
      return `
         <p>${d3.timeFormat("%b %d, %Y")(d.date)}</p>
         <p>$${d3.format(",")(d.price)}</p>
      `;
   });
chart.call(tip);

d3.json(dataURL).then((data) => {
   const priceData = data.Data.Data.map((d) => ({
      price: d.close,
      date: new Date(d.time * 1000),
      volumeBTC: d.volumefrom,
      volume: d.volumeto
   }));
   const bandwidth = (width - 50) / priceData.length;
   console.log(data);

   // Add dynamic title/description to chart
   const dateRange = d3.extent(priceData, (d) => d.date);
   const titleContainer = d3
      .select(".chart-outer")
      .append("div")
      .attr("class", "title-container");
   titleContainer
      .append("h1")
      .attr("id", "title")
      .attr("class", "title")
      .text("Daily Bitcoin Price Chart");
   titleContainer
      .append("p")
      .attr("id", "description")
      .attr("class", "subtitle")
      .text(`${d3.timeFormat("%b %d, %Y")(dateRange[0])} - ${d3.timeFormat("%b %d, %Y")(dateRange[1])}`);
   // dates (x-axis)
   const xScale = d3
      .scaleTime()
      .domain(d3.extent(priceData, (d) => d.date))
      .range([0, width - 50]);
   const xAxis = d3.axisBottom(xScale).ticks(12).tickFormat(d3.timeFormat("%b %y"));

   chart
      .append("g")
      .attr("transform", `translate(0, ${height - 20})`)
      .call(xAxis);

   // price (y-axis)
   const yScale = d3
      .scaleLinear()
      .domain([d3.max(priceData, (d) => d.price), 0])
      .range([10, height - 20]);
   const priceScale = d3
      .scaleLinear()
      .domain(yScale.domain().reverse())
      .range(yScale.range());
   const yAxis = d3.axisRight(yScale).tickFormat((d) => `$${d3.format(",")(d)}`);

   chart
      .append("g")
      .attr("transform", `translate(${width - 50}, 0)`)
      .call(yAxis);

   const scaledPrice = priceData.map((d) => priceScale(d.price));
   priceData.forEach((el, i) => (el.scaledPrice = scaledPrice[i]));

   chart
      .selectAll("rect")
      .data(priceData)
      .enter()
      .append("rect")
      .attr("y", (d) => height - d.scaledPrice + 10)
      .attr("x", (d, i) => bandwidth * i)
      .attr("transform", "translate(0, -20)")
      .attr("height", (d) => height - (height - d.scaledPrice) - 10)
      .attr("width", bandwidth)
      .attr("fill", "#f4921a")
      .on("mouseenter", (event, data) => {
         tip.show(data, event.target);
      });
});
