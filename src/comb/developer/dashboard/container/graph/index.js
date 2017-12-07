import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
import '../../macarons';

import './index.less';

export default class Graph extends PureComponent {
  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  getOPtionLine(data) {

    let {
      maxVal,
      minVal,
      value,
      timeLine
    } = timeformat(data);

    return {
      title: {
        show: true,
        text: '近12小时访问量',
        left: 'center',
        top: '15px',
        textStyle: {
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis',
        show: !!value.length
      },
      xAxis: [
        {
          type: 'category',
          data: timeLine,
        }
      ],
      yAxis: [
        {
          type: 'value',
          // name: '访问量',
          min: 0,
          max: maxVal,
          axisLabel: {
            formatter: '{value}次'
          },
          interval: Math.floor(maxVal / 10) + 1,
          splitLine: {
            show: value.length
          }
        }

      ],
      series: [{
        name: '访问量',
        type: 'line',
        data: value,
      }],
      graphic: {
        type: 'text',
        left: 'center',
        top: '40%',
        style: {
          fill: 'lightgray',
          text: value.length == 0 ? '暂无数据' : '',
          font: 'bold 26px Microsoft YaHei'
        },
        shape: {
          width: 50,
          height: 50
        },
        zIndex: 100
      }
    };
  }

  render() {
    return (
      <div className="graph">
        <ReactEcharts
          theme={"macarons"}
          option={
            this.getOPtionLine(this.props.data)
          }
        />
      </div>
    )
  }
}


function timeformat(data = []) {
  let timeLine = [];
  let value = [];
  let minVal = 0;
  let maxVal = 20;
  let ZeroCount = 0;


  data.forEach((d, i) => {
    //获取时间
    timeLine.push(timeTransform(d['name']));

    let item = parseInt(d['value']);

    maxVal = item > maxVal ? item : maxVal;
    minVal = item < minVal ? item : minVal;

    value.push(item);

    // 是否为零
    item === 0 && ZeroCount++;
  });

  // 判断数据是否全是零
  if (ZeroCount === value.length) {
    value = [];
  }

  if (!value.length) {
    let len = 10;
    let halfHour = 30 * 60 * 1000;
    let startTime = Date.now() - halfHour * len;
    for (let i = 0; i < len; i++) {
      timeLine.push(timeTransform(startTime));
      startTime += halfHour;
    }
  }
  return {
    maxVal,
    minVal,
    value,
    timeLine
  }
}

function timeTransform(time) {
  let t = new Date(parseInt(time));
  return t.toTimeString().slice(0, 5);
}