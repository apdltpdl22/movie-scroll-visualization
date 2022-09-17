import { scroller } from "./scroller.js";
import { LineChart } from "./charts/line_chart.js";
import {
  getMovieData
} from './services/movie_data.js';

const WIDTH = 1000;
const HEIGHT = 1000;
async function getData() {
  const dateSet = new Set();
  const csv = await d3.csv(`./data/movie2019.csv`);
  const data = csv.map(d => {
    const date = new Date(d.date);
    dateSet.add(date);
    d.date = date;
    d.value = parseInt(d.value);
    return d;
  }).sort((a, b) => a.date - b.date);
  const dates = Array.from(dateSet).sort();


let lineChart;

setTimeout(drawInitial(), 100);

/*
  drawInitial 함수
    : 초기설정을 처리합니다. 
    1) visbox 너비와 높이 설정
    2) 차트 클래스의 인스턴스 생성
*/
function drawInitial() {
  d3.select("#visbox")
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .attr("opacity", 1);

  lineChart = new LineChart('line-chart', WIDTH, HEIGHT)

  draw1();

  const body = d3.select("body");
  const svg = body.append("svg")
      .attr("width", width)
      .attr("height", height);

  svg.append('g')
    .attr('transform', 'translate(0,' + (height - margin.bottom) + ')')
    .call(xAxis);

  svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',0)')
    .call(yAxis);


  // 3. 라인 차트 그리기
  //  1) d3.line과 x, y메소드 구현
  //    - x {key}는 'date'
  //    - y {key}는 'value'
  const line = 


  //  2) svg에 path 요소와 속성 추가
  //   (svg는 d3.select(’svg’)로 위에서 먼저 할당된 변수입니다.)
  //    - path 요소 추가
  //    - data binding : data 변수
  //    - d 속성 : line 변수  
  //    - fill 속성 : 'none'
  //    - stroke 속성 : d3.schemeTableau10[0]
  svg.append()
}


/*
  clean 함수
    : 'visType'에 따라, 해당 화면에 보여줄 필요가 없는 시각화들을 (보이지 않도록) 가립니다.
    ex) unshow() 메소드를 호출하면, .attr("opacity", 0); 를 처리함 
*/
function clean(visType) {
  const svg = d3.select("#visbox").select("svg");

  if (visType !== "isFirst") {
    svg.selectAll(".movie-img").attr("opacity", 0);
    console.log("clean first chart");
  }
  if (visType !== "isLine"){
    lineChart.unshow();
    console.log("clean line chart");
  }
}


/*
  draw1 ~ draw3
    : visbox(우측 화면)에 보여지는 부분 
    - draw1 : 사진 
    - draw2~3 : 라인차트 
 */
function draw1() {
  clean("isFirst");

  const svg = d3.select("#visbox").select("svg");

  if (!svg.select(".movie-img").empty()) {
    svg.select(".movie-img").attr("opacity", 1);
    return;
  }

  svg
    .append("svg:image")
    .attr("class", "movie-img")
    .attr("xlink:href", "images/movie.png")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", "100%")
    .attr("height", "92%");
}


async function draw2() {
  clean("isLine");

  const { dates, data } = await getMovieData('2019');
  lineChart.drawChart(dates, data).show();
}


async function draw3() {
  clean("isLine");

  const { dates, data } = await getMovieData('2020');
  lineChart.drawChart(dates, data).show();
}


/*
  scroller에서 
  visFuncList에 등록된 순서대로 
  visbox sections에 맞춰 보여줌
*/
const visFuncList = [
  draw1,
  draw2,
  draw3,
];
scroller(visFuncList)();