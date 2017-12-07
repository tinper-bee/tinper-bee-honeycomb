import React, { Component } from 'react'
import { Row, Col, Button } from 'tinper-bee'
import ReactEcharts from 'echarts-for-react';
import macarons from "./macarons"





//引入自定义组件
import ResInfo from 'component/resInfo'
import AppDesc from 'component/appDesc'
import AppStat from 'component/appStat'

//引入接口
import {
  getResStatus,
  getNewAppInfo,
} from '../serves/console'

export default class MainPage extends Component {

  state = {
    resStatus: {},
    appInfo: [],
    graphInfo: [],
    accountInfo: [],
  }

  componentDidMount() {
    getResStatus().then(data => {
      this.setState({
        resStatus: data
      })
    });
    getNewAppInfo().then(({appInfo,graphInfo,accountInfo})=>{
      this.setState({
        graphInfo,
        appInfo,
        accountInfo
      })
    })
  }
  render() {
    let {
      appHealthy = 0,
      appUnhealthy = 0,
      app = 0,
      cpu = 0,
      cpuLeft = 0,
      disk = 0,
      diskLeft = 0,
      hosts = 0,
      mem = 0,
      memLeft = 0,
      taskHealthy = 0,
      task = 0
    } = format(this.state.resStatus);


    return (
      <div style={{height:'100%', backgroundColor: '#fcfcfc', paddingTop: 20 }}>
        <div className="dashboard--res-info">
          <Col md={8}>
            <ResInfo logo="cpu" data={[{ desc: 'CPU剩余', data: cpuLeft }, { desc: 'CPU总数', data: cpu, sub: true }]} />
            <ResInfo logo="piechart" data={[{ desc: '内存剩余', data: memLeft }, { desc: '内存总量', data: mem, sub: true }]} />
            <ResInfo logo="disk" data={[{ desc: '磁盘剩余空间', data: diskLeft }, { desc: '磁盘总量', data: disk, sub: true }]} />
            <div className="h-split-line"></div>
            <ResInfo logo="box" data={[{ desc: '异常实例', data: task - taskHealthy},{ desc: '总实例', data: task, sub: true }]} />
              {
                  appUnhealthy > 0 ? (
                      <a href='/fe/appManager/index.html#/?showPublishList=true'>
                        <ResInfo logo="box" data={[{ desc: '异常应用', data: appUnhealthy },{ desc: '所有应用', data: app ,sub: true}]} />
                      </a>
                  ) : (
                      <ResInfo logo="box" data={[{ desc: '异常应用', data: appUnhealthy },{ desc: '所有应用', data: app ,sub: true}]} />
                  )
              }


            <div className="dashboard--link">
              <a className="u-button dashboraer--link__pretty" href='/fe/continuous/index.html#/createApp?route=/fe/dashboard/index.html'>
                <span className="cl cl-cloud-create" style={{ fontSize: 35, marginRight: 15, verticalAlign: 'middle' }}></span>
                创建应用
              </a>
            </div>
            <div style={{ clear: 'both' }}></div>
          </Col>
          <Col md={4}>
            <ReactEcharts
              option={
                this.getOPtionPie(this.state.resStatus)
              }
              style={{ height: '300px', width: '100%', clear: 'both', overflow: 'visible' }}
              className='echarts-for-echarts'
            />
          </Col>
        </div>
        <div className="dashboard--app-title">

        </div>
        <div style={{ margin: "20px 40px", background: "#fcfcfc",minHeight:500 }}>
            {
              this.state.appInfo.map((info, index) => {
                return (
                    <div className="app-list" key={index}>
                      <AppDesc data={this.state.accountInfo[index]} index={index}/>
                      <AppStat data={this.state.appInfo[index]} />
                      <div className="" style={{ width: '50%', float: 'left' }}>
                        <ReactEcharts
                          theme={"macarons"}
                          option={
                            this.getOPtionLine(this.state.graphInfo[index])
                          }
                          style={{ height: '250px', width: '100%',    marginTop: '20px' }}
                          className='echarts-for-echarts'
                        />
                      </div>
                    </div>)

              })
            }
        </div>

      </div>
    )
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
        text: '我的访问量',
        left: 'center',
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
        type: 'bar',
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


  getOPtionPie(data) {
    const {
      appHealthy = 0,
      appUnhealthy = 0,
      app = 0,
    } = data;
    const unknown = app - appHealthy - appUnhealthy;

    const dataItems = FilterFalsy([
      { value: appHealthy, name: '健康' ,itemStyle:{normal:{color:'#71E99D'},emphasis:{color:'#71E99D'}}},
      { value: appUnhealthy, name: '异常' ,itemStyle:{normal:{color:'#EE5350'},emphasis:{color:'#EE5350'}}},
      { value: unknown, name: '未知' ,itemStyle:{normal:{color:'#d8d8d8'},emphasis:{color:'#d8d8d8'}}},
    ])
    let invisible = dataItems.length !== 0;
    return {
      tooltip: {
      },
      title: {
        show: true,
        text: '应用健康情况',
        left: 'center',
        textStyle: {
          fontWeight: 'normal'
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        selectedMode:false,
        data: !invisible ?[]: ['健康', '异常', '未知']
      },
      graphic: [{
        z: 50,
        type: 'group',
        left: 'center',
        top: '20%',
        width: 200,
        height: 100,
        children: [{
          z: 50,
          invisible,
          type: 'circle',
          left: 'left',
          top: 'center',
          style: {
            fill: '#2EC7C9',
          },
          shape: {
            r: 100,
          },
          zIndex: 100
        }, {
          z: 50,
          invisible,
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            fill: 'white',
            text: '暂无数据',
            color: 'white',
            font: '26px Microsoft YaHei'
          },
          zIndex: 100
        }]
      }, {
        z: 50,
        type: 'group',
        left: 'left',
        top: '0',
        width: '20px',
        height: '15px',
        children: [{
          invisible,
          type: 'rect',
          left: 'center',
          top: 'top',
          style: {
            fill: '#71E99D',
          },
          shape: {
            width: 30,
            height: 15
          },
          zIndex: 100
        }, {
          invisible: invisible,
          type: 'text',
          left: 40,
          top: '80%',
          style: {
            verticalAlign: 'bottom',
            text: '健康',
            fill: 'darkgray'
          },
          shape: {
            width: 50,
            height: 50
          },
          zIndex: 100
        }]
      }, {
        z: 50,

        type: 'group',
        left: 'left',
        top: '30',
        width: '20px',
        height: '10px',

        children: [{

          invisible: invisible,
          type: 'rect',
          left: 'left',
          top: '55%',
          style: {
            fill: '#EE5350',
          },
          shape: {
            width: 30,
            height: 15
          },
          zIndex: 100
        }, {
          invisible: invisible,
          type: 'text',
          left: 40,
          top: '80%',
          style: {
            fill: 'darkgray',
            text: '异常',
          },
          shape: {
            width: 50,
            height: 50
          },
          zIndex: 100
        }]
      }, {
        type: 'group',
        left: 'left',
        top: '60',
        width: '20px',
        height: '10px',
        children: [{
          invisible: invisible,
          type: 'rect',
          left: 'center',
          top: '55%',
          style: {
            fill: '#ccc',
          },
          shape: {
            width: 30,
            height: 15
          },
          zIndex: 100
        }, {
          invisible: invisible,
          type: 'text',
          left: 40,
          top: '80%',
          style: {
            fill: 'darkgray',
            text: '未知',
          },
          shape: {
            width: 50,
            height: 50
          },
          zIndex: 100
        }]
      }],
      series: [
        {
          name: '健康状况',
          type: 'pie',
          center: ['50%', '60%'],
          radius: [0, '70%'],
          z: 100,
          data: dataItems
        }
      ]
    };
  }
}


function format(data) {
  let {
    appHealthy = 0,
    appUnhealthy = 0,
    app = 0,
    cpu = 0,
    cpuLeft = 0,
    disk = 0,
    diskLeft = 0,
    hosts = 0,
    mem = 0,
    memLeft = 0,
    taskHealthy = 0,
    task = 0
  } = data;

  //pretyy
  cpuLeft = parseFloat(cpuLeft).toFixed(2);
  cpu = parseFloat(cpu).toFixed(2);
  disk = (disk / 1024).toFixed(2) + 'GB';
  diskLeft = (diskLeft / 1024).toFixed(2) + 'GB';
  mem = (mem / 1024).toFixed(2) + 'GB';
  memLeft = (memLeft / 1024).toFixed(2) + 'GB';

  return {
    appHealthy,
    appUnhealthy,
    app,
    cpu,
    cpuLeft,
    disk,
    diskLeft,
    hosts,
    mem,
    memLeft,
    taskHealthy,
    task
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

function FilterFalsy(data = []) {
  let zeroCount = 0;
  let ret = data.map(item => {
    if (item['value'] === 0) {
      zeroCount++;
      item['labelLine'] = { normal:{show: false },emphasis:{show:false}};
      item['label'] = { normal: { show: false },emphasis:{show:false} }
    }
    return item;
  });

  if(zeroCount == data.length){
    ret = [];
  }

  return ret;
  // return data;
}
