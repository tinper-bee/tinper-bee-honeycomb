import React, { Component } from "react";
import { Button, ButtonGroup } from "tinper-bee";
import "./index.less";
// 引入 ECharts 主模块
import echarts from 'echarts';

const defaultData = [["无数据", 0]];

export default class TrendChart extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.paint(this.props.canvasId);
    }

    componentDidUpdate(){
        this.paint(this.props.canvasId);
    }

    paint = (canvasId) => {     

        var data = this.props.data;

        if (data.length == 0)
            data = defaultData;

        var myChart = echarts.init(document.getElementById(canvasId));       
        const _this = this;
        var dateList = data.map(function (item) {
            if(typeof _this.handleXAxisFormart != "undefined"){
                return _this.handleXAxisFormart(item[0]);
            }         
            return item[0];
        });
        var valueList = data.map(function (item) {
            const num = Number(item[1]);
            if (num != NaN) {
                return num;
        　　}
            return item[1];
        });
        //最小值相对于0的偏移量
        const offset = this.props.offset;     
        let min = Math.min.apply(null, valueList) - offset <= 0 ? 0 : Math.min.apply(null, valueList) - offset; 

        var option = {
            title: [{
                left: 'left',
                text: ''
            }],
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [{                       //x轴
                name: this.props.xName,
                nameTextStyle: {
                    color: '#999999'
                },
                axisLine: {
                    lineStyle: {
                        color: '#E1E9F0'
                    }
                },
                axisTick: {                 //坐标轴刻度
                    inside: true
                },
                axisLabel: {                //坐标轴文字
                    margin: 10,
                    textStyle: {
                        color: '#999999',
                        fontSize: 11
                    }
                },               
                boundaryGap: false,         //坐标轴与折线的间隙
                z: 10,
                data: dateList
            }],
            yAxis: [{                       //y轴
                name: this.props.yName,
                nameTextStyle: {
                    color: '#000',
                    fontSize: 15,
                    fontWeight: 'bold'
                },
                axisTick: {                 //坐标刻度
                    show: false             
                },
                axisLabel: {
                    showMaxLabel: false,
                    showMinLabel: false, 
                    textStyle: {            //坐标轴文字
                        color: '#999999',   
                        fontSize: 11
                    }
                },
                splitLine: {
                    lineStyle: {            //坐标线
                        color: '#E1E9F0' 
                    }   
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff'       //坐标轴颜色
                    }
                },
                min: min
            }],
            grid: [{
                top: '15%',
                bottom: '15%'   
            }],
            series: [{
                type: 'line',
                showSymbol: false,
                itemStyle: {
                    normal: {
                        lineStyle: {            // 系列级个性化折线样式，横向渐变描边
                            width: 2,
                            color:  new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(50,145,255,1)'
                            }, {
                                offset: 1,
                                color: 'rgba(50,145,255,1)'
                            }])
                        },
                        areaStyle: {
                            // 区域图，纵向渐变填充
                            color : new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(50,145,255,1)'
                            }, {
                                offset: 1,
                                color: 'rgba(50,145,255,0)'
                            }])
                        }
                    }
                },
                data: valueList
            }]
        };
        myChart.setOption(option);
    }

    handleXAxisFormart = (str) => {
        return this.props.xAxisFormat(str);
    }

    render(){
        return(
            <div 
                id={this.props.canvasId} 
                style={
                    {width: this.props.width, 
                    height: this.props.height,
                    minWidth: this.props.minWidth,
                    minHeight: this.props.minHeight}}>
            </div>
        );     
    }
}