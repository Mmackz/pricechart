// data url
const dataURL = "https://min-api.cryptocompare.com/data/v2/histoday?fsym=BTC&tsym=USD&limit=2000"

// setup chart
const height = 600;
const width = 960;
const chartContainer = d3.select(".chart");
const chart = chartContainer.append("svg").attr("height", height).attr("width", width);

d3.json(dataURL).then(data => {
   console.log(data.Data.Data[0])
   const priceData = data.Data.Data.map(d => ({price: d.close, date: d.time, volumeBTC: d.volumefrom, volume: d.volumeto}))

})
