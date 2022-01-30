
let ws = new WebSocket('wss://stream.binance.com:9443/ws/etheur@trade');
let stockPriceElement = document.getElementById('stock-price');
let lastPrice = null;

ws.onmessage = (event) => {
    let stockObject = JSON.parse(event.data);
    let price = parseFloat(stockObject.p).toFixed(2)
stockPriceElement.innerText = price;

stockPriceElement.style.color = !lastPrice || lastPrice === price ? 'black' : price > lastPrice ? 'green' : 'red';

lastPrice = price;
}

const log = console.log;

const chartProperties = {
  width:1400,
  height:599,
  timeScale:{
    timeVisible:true,
    secondsVisible:false,
  }
}

const domElement = document.getElementById('tvchart');
const chart = LightweightCharts.createChart(domElement,chartProperties);
const candleSeries = chart.addCandlestickSeries();


fetch(`http://127.0.0.1:9665/fetchAPI?endpoint=https://api.binance.com/api/v3/klines?symbol=ETHUSDT&interval=1m&limit=1000`)
  .then(res => res.json())
  .then(data => {
    const cdata = data.map(d => {
      return {time:d[0]/1000,open:parseFloat(d[1]),high:parseFloat(d[2]),low:parseFloat(d[3]),close:parseFloat(d[4])}
    });
    candleSeries.setData(cdata);
  })
  .catch(err => log(err))

const socket = io.connect('http://127.0.0.1:4000/');

socket.on('KLINE',(pl)=>{
  
  candleSeries.update(pl);
});
