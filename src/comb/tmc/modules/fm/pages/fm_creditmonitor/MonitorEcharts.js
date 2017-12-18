import React, { Component } from 'react';
import { numFormat, toast } from '../../../../utils/utils.js';
import './index.less';
//导入echarts
var echarts = require('echarts/lib/echarts'); //必须
require('echarts/lib/chart/pie'); //图表类型
require('echarts/lib/component/title'); //标题插件

export class MonitorEcharts extends React.Component {
	constructor(props) {
		super(props);
		this.setPieOption = this.setPieOption.bind(this);
		this.initPieChart = this.initPieChart.bind(this);
	}

	initPieChart(nextProps) {
		console.log('传入数据', nextProps);
		if (nextProps && nextProps.data && typeof nextProps.data != 'undefined') {
			const data = this.dataHandler(nextProps.data); //外部传入的data数据
			let myChart = echarts.init(this.refs.pieChart); //初始化echarts
			//我们要定义一个setPieOption函数将data传入option里面
			let options = this.setPieOption(data);
			//设置options
			myChart.setOption(options);
		}
	}
	dataHandler(item) {
		if (item.lavequota && item.lavequota.value == '0E-8') {
			item.lavequota.value = 0.0;
		}
		if (item.beforequota && item.beforequota.value == '0E-8') {
			item.beforequota.value = 0.0;
		}
		if (item.quota && item.quota.value == '0E-8') {
			item.quota.value = 0.0;
		}
		if (item.applyquota && item.applyquota.value == '0E-8') {
			item.applyquota.value = 0.0;
		}
		if (item.usedquota && item.usedquota.value == '0E-8') {
			item.usedquota.value = 0.0;
		}
		return item;
	}

	// componentDidMount() {
	// 	this.initPieChart();
	// }

	componentWillReceiveProps(nextProps) {
		this.initPieChart(nextProps);
	}

	render() {
		return (
			<div className="pie-react">
				<div ref="pieChart" style={{ width: '100%', height: '393px' }} />
			</div>
		);
	}

	//一个基本的echarts图表配置函数
	setPieOption(initdata) {
		return {
			title: [
				{
					text: `本期授信`,
					textStyle: {
						//文字颜色
						color: '#333333',
						//字体风格,'normal','italic','oblique'
						fontStyle: 'normal',
						//字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
						fontWeight: 'bold',
						//字体系列
						fontFamily: 'sans-serif',
						//字体大小
						fontSize: 15,
						align: 'center'
					},
					textBaseline: 'middle',
					left: 'center',
					top: '37%'
				},
				{
					text: initdata && initdata.quota ? numFormat(parseFloat(initdata.quota.value), '') : 0.0,
					textStyle: {
						//文字颜色
						color: '#333333',
						//字体风格,'normal','italic','oblique'
						fontStyle: 'normal',
						//字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
						fontWeight: 'bold',
						//字体系列
						fontFamily: 'sans-serif',
						//字体大小
						fontSize: 15,
						align: 'center'
					},
					left: 'center',
					top: '40%'
				}
			],
			tooltip: {
				trigger: 'item',
				icon: 'circle',
				// formatter: '{b}: ({d}%) <br/>{c}',
				formatter: (a) => {
					console.log(a);
					return a['name'] + '：' + '(' + a['percent'] + '%)' + '<br/>' + numFormat(parseFloat(a['value']));
				}
			},
			//设置数据
			series: [
				{
					name: [ '授信' ],
					type: 'pie',
					radius: [ '40%', '50%' ],
					center: [ '50%', '40%' ],
					data: [
						{
							value: initdata && initdata.lavequota ? parseFloat(initdata.lavequota.value) : 0.0,
							name: '可用授信',
							itemStyle: {
								normal: {
									color: '#1875F0'
								}
							}
						},
						{
							value: initdata && initdata.beforequota ? parseFloat(initdata.beforequota.value) : 0.0,
							name: '期初占用',
							itemStyle: {
								normal: {
									color: '#5CEC75'
								}
							}
						},
						{
							value: initdata && initdata.usedquota ? parseFloat(initdata.usedquota.value) : 0.0,
							name: '本期占用',
							itemStyle: {
								normal: {
									color: '#50D166'
								}
							}
						},
						{
							value: initdata && initdata.applyquota ? parseFloat(initdata.applyquota.value) : 0.0,
							name: '申请预占',
							itemStyle: {
								normal: {
									color: '#42B856'
								}
							}
						}
					],
					// itemStyle: {
					// 	normal: {
					// 		color: function(params) {
					// 			var colorList = [ '', '#5CEC75', '#50D166', '#42B856' ];
					// 			return colorList[params.dataIndex];
					// 		}
					// 	}
					// },
					label: {
						normal: {
							show: true,
							fontSize: 13
						}
					}
				}
			],
			label: {
				normal: {
					show: true,
					rich: {
						hr: {
							borderColor: '#777',
							// 这里把 width 设置为 '100%'，表示分割线的长度充满文本块。
							// 注意，这里是文本块内容盒（content box）的 100%，而不包含 padding。
							// 虽然这和 CSS 相关的定义有所不同，但是在这类场景中更加方便。
							width: '100%',
							borderWidth: 0.5,
							height: 0
						}
					}
				}
			},
			legend: {
				// selectedMode: false,
				width: 'center',
				bottom: 20,
				orient: 'horizontal',
				textStyle: {
					//文字颜色
					color: '#999999',
					//字体风格,'normal','italic','oblique'
					fontStyle: 'normal',
					//字体粗细 'normal','bold','bolder','lighter',100 | 200 | 300 | 400...
					fontWeight: 'normal',
					//字体系列
					fontFamily: 'sans-serif',
					//字体大小
					fontSize: 12
				},
				// left: 'center',
				itemGap: 20,
				data: [
					{ name: '可用授信', icon: 'circle' },
					{ name: '期初占用', icon: 'circle' },
					{ name: '本期占用', icon: 'circle' },
					{ name: '申请预占', icon: 'circle' }
				]
			}
		};
	}
}
