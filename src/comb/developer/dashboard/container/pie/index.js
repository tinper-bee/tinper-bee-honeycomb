import React, { Component, PureComponent } from 'react';
import {hashHistory} from 'react-router';

import PropTypes from 'prop-types';
import * as d3 from 'd3';

export default class Pie extends PureComponent {
  static propTypes = {
    /* data */
    value: PropTypes.arrayOf(PropTypes.number),
    label: PropTypes.arrayOf(PropTypes.string),
    unit: PropTypes.string,
    labelAppend: PropTypes.string,
    title: PropTypes.string,
    /* chart conf */
    heightOffset: PropTypes.number,
    alpha: PropTypes.number,
    color: PropTypes.arrayOf(PropTypes.string),
    circleSpan: PropTypes.arrayOf(PropTypes.number),
    labelLineLength1: PropTypes.number,
    labelLineLength2: PropTypes.number,
  }

  static defaultProps = {
    label: ['健康', '异常', '未知'],
    value: [0, 0, 0],
    unit: '个',
    labelAppend: '应用',
    title: '应用健康状况比例图',

    heightOffset: 30,
    alpha: 0.5,
    color: ['#29b6f6', '#ff71a1', '#f0d200'],//依次为正常、异常、未知应用颜色
    circleSpan: [25, 15, 10],
    labelLineLength1: 25,
    labelLineLength2: 100,
  }



  state = {
    mounted: false,
    pieLayout: [],
  }

  geoInfo = {
    width: 0,
    height: 0,
    radius: 0,
  }

  getPieLayout = (val) => {
    return d3
      .pie()
      .sort(null)
      .value(d => d)(val);
  }

  colorScale = null;
  outerArc = null;


  componentWillMount() {
    // 这里已经可以为图表开始准备数据了
    this.colorScale = d3.scaleOrdinal()
      .domain(this.props.label)
      .range(this.props.color);


  }
  componentDidMount() {
    this.setState({
      mounted: true,
      pieLayout: this.getPieLayout(this.props.value),//数字转换成角度
    });

    this.getGeoInfo();//设定图的大小，长宽半径
    /* must follow getGeoInfo*/
    this.outerArc = this.getArcShape(
      0,
      this.props.labelLineLength1 +
      this.geoInfo.radius *
      this.props.alpha
    );

    window.addEventListener('resize',this.onResize);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        pieLayout: this.getPieLayout(nextProps.value),
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    let props = this.props;
    let state = this.state;
    return Object.keys(nextProps).some(key => nextProps[key] !== props[key]) ||
      Object.keys(nextState).some(key => nextState !== state[key]);
  }

  componentWillUnMount(){
    window.removeEventListener('resize', this.onResize);
  }
  onResize = () => {
    this.getGeoInfo();
    /* must follow getGeoInfo*/
    this.outerArc = this.getArcShape(
      0,
      this.props.labelLineLength1 +
      this.geoInfo.radius *
      this.props.alpha
    );
    this.forceUpdate();
  }

  getGeoInfo = () => {
    let { width, height } = calcGeo(this.refs.container);

    this.geoInfo = {
      width,
      height,
      radius: Math.min(width, height) / 2,
    }
  }

  getArcShape = (span, base) => {
    let { radius } = this.geoInfo;
    let { alpha } = this.props;
    base = base || radius * alpha;

    return d3.arc()
      .outerRadius(base + span / 2)
      .innerRadius(base - span / 2);
  }

  getBetaFactor = (d) => {
    return midAngle(d) < Math.PI ? 1 : -1;
  }

  getPercent = (d) => {
    let percent = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
    return percent.toFixed(2);
  }

  getSum = () => {
    let ret = this.props.value.reduce((r, v) => r + v, 0);
    return ret !== ret ? 0 : ret;
  }

  viewUnhealthyApp = () => {
    if(this.props.value[1]!== 0) {
       location.href='/fe/appManager/index.html?unhealthy='+ true;//正式环境没有根目录，要加一层/fe
    }
  }

  render() {
    let { pieLayout } = this.state;
    let { heightOffset } = this.props;
    let geoWidth = this.geoInfo.width;
    let geoHeight = this.geoInfo.height;

    return (
        <div
        ref="container"
        style={{ width: '100%', height: '100%' }}
      >
        {
          this.state.mounted && (
            <svg
              width="100%"
              height="100%"
              fontSize={12}
            >

              <text
                transform={`translate(${geoWidth / 2},30)`}//旋转画布
                textAnchor="middle"
                fontSize="16"
              >
                {this.props.title}
              </text>
              <g transform={`translate(${geoWidth / 2 - 94} ,45)`}>
                {
                  this.props.label.map((item, index) => {
                    return (
                      <g transform={`translate(${index * 70},0)`}>
                        <rect
                          x="0"
                          y="0"
                          width="15"
                          height="15"
                          fill={this.props.color[index]}
                        />
                        <text
                          x="2em"
                          y="1em"
                        >
                          {item}
                        </text>
                      </g>
                    )
                  })
                }
              </g>
              <g
                transform={`translate(${geoWidth / 2},${geoHeight / 2 + heightOffset})`}>
                <circle
                  cx="0"
                  cy="0"
                  r={this.geoInfo.radius * this.props.alpha}
                  fill="#f4f4f4"
                />
                <g>
                  {pieLayout.map((d, i) => {
                    let { label, circleSpan } = this.props;
                    let { colorScale } = this;
                    let arc = this.getArcShape(circleSpan[i]);

                    return (
                      <path
                        fill={colorScale(label[i])}
                        class="slice"
                        d={arc(d)}
                      />
                     )
                   })
                  }
                </g>
                <g>
                  {pieLayout.map((d, i) => {
                    let { label, circleSpan, labelLineLength2 } = this.props;
                    let {
                      colorScale,
                      getArcShape,
                      outerArc,
                      getBetaFactor,
                      getPercent
                    } = this;
                    if (getPercent(d) == '0.00') {
                      return null;
                    }
                    let beta = getBetaFactor(d);
                    let pos1 = getArcShape(circleSpan[i]).centroid(d);
                    let pos2 = outerArc.centroid(d);
                    let pos3 = [pos2[0] + beta * labelLineLength2, pos2[1]];

                    // 保存pos3，后面的文字基于这个位置
                    d.labelPos = pos3;

                    d.test = 'dsafka';
                    return (
                      <polyline
                        points={`${pos1} ${pos2} ${pos3}`}
                        strokeWidth="1"
                        fill="none"
                        stroke={colorScale(label[i])}
                      />
                    )
                  })}
                </g>
                <g>
                  {pieLayout.map((d, i) => {
                    let { label, labelAppend, unit } = this.props;
                    let { getBetaFactor, getPercent, colorScale } = this;

                    if (getPercent(d) == '0.00') {
                      return null;
                    }

                    return (
                      <g style={{cursor: 'pointer'}} onClick={label[i] === '异常' && this.viewUnhealthyApp}>
                        <text
                          x={d.labelPos[0]}
                          y={d.labelPos[1]}
                          dy="-5"
                          textAnchor={getBetaFactor(d) > 0 ? "end" : "start"}
                        >
                          <tspan>
                            {label[i] + labelAppend}
                          </tspan>
                          <tspan
                            dx=".5em"
                            fontSize="smaller"
                            fill={colorScale(label[i])}
                          >
                            {getPercent(d) + '%'}
                          </tspan>
                        </text>
                        <text
                          x={d.labelPos[0]}
                          y={d.labelPos[1]}
                          dy="2.2em"
                          textAnchor={getBetaFactor(d) > 0 ? "end" : "start"}
                        >
                          <tspan
                            fontSize="xx-large"
                            fill={colorScale(label[i])}
                          >
                            {d.value}
                          </tspan>
                          <tspan dx=".5em">
                            {unit}
                          </tspan>
                        </text>
                      </g>
                    )
                  })}
                </g>
                <g>
                  <text
                    fontSize="xx-large"
                    textAnchor="middle"
                    fill="#9b9b9b"
                  >
                    {this.getSum()}
                  </text>
                  <text
                    textAnchor="middle"
                    style={{ transform: 'translate(0,1.5em)' }}
                    fill="#9b9b9b"
                  >
                    {`总${this.props.labelAppend}数`}
                  </text>
                </g>

              </g>
            </svg>
          )
        }

      </div >
    )
  }
}


function calcGeo(ele) {
  if (!ele.clientWidth) {
    console.warn('no an element!')
    return {
      width: 0,
      height: 0,
    }
  }
  return {
    width: ele.clientWidth,
    height: ele.clientHeight,
  }
}

function midAngle(datum) {
  return datum.startAngle + (datum.endAngle - datum.startAngle) / 2;
}
