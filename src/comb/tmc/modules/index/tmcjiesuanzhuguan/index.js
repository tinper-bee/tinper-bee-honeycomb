import React, { Component } from 'react';
import Ajax from '../../../utils/ajax';
import Ulink from '../containers/ulink';
import RapidEntrance from '../containers/rapid-entrance';
import InfoDisplay from '../containers/InfoDisplay';
import Charts from '../containers/charts';
import '../index.less';
import './index.less';
const URL = window.reqURL.home;
const BURL = window.reqURL.bpm;
let ulinkdata = {
	title: '常用链接',
	listData: [
		{
			name: '强势来袭！资金云成功上线啦。。。',
			url: 'http://www.baidu.com'
		},
		{
			name: '资金云投资理财本周更新内容！',
			url: 'http://www.baidu.com'
		},
		{
			name: '可以在线充值购买短信充值包了',
			url: 'http://www.baidu.com'
		},
		{
			name: '资金云投资理财本周更新内容！',
			url: 'http://www.baidu.com'
		},
		{
			name: '担保物权合同查询',
			url: 'http://www.baidu.com'
		},
		{
			name: '可以在线充值购买短信充值包了',
			url: 'http://www.baidu.com'
		}
	]
};
let entranceData = {
	title: '快捷入口',
	listData: [
		{
			name: '银行对账单',
			icon: 'yinhangduizhangdan',
			url: 'pass/bankreceipt'
		},
		{
			name: '交易查询',
			icon: 'chaxunlei',
			url: 'pass/search'
		}
	]
};
export default class TMCjiesuanzhuguan extends Component {
	constructor() {
		super();
		this.state = {
			infoTopData: {
				moneyinweek: {
					recemny: 0,
					paymny: 0
				},
				forsettlemoney: {
					recemny: 0,
					paymny: 0
				}
			},
			bpmNum: 0,
			forsettlemoneyData: {
				recemny: 0,
				paymny: 0
			},
			moneyinsevendayData: {
				dateData: [],
				recemnyData: [],
				paymnyData: []
			}
		};
	}

	componentWillMount() {
		const _this = this;
		Ajax({
			url: URL + 'pass/homepageshow/homepageshow',
			success: function(res) {
				if (res.success) {
					let { forsettlemoney, moneyinweek, moneyinsevenday } = res.data;
					let infoTopData = {
						moneyinweek: moneyinweek,
						forsettlemoney: forsettlemoney
					};
					let forsettlemoneyData = forsettlemoney;
					let moneyinsevendayData = {
						dateData: [],
						recemnyData: [],
						paymnyData: []
					};
					moneyinsevenday.map((item, index) => {
						moneyinsevendayData.dateData.push(item.date);
						moneyinsevendayData.recemnyData.push(item.recemny);
						moneyinsevendayData.paymnyData.push(item.paymny);
					});
					_this.setState({ infoTopData, forsettlemoneyData, moneyinsevendayData });
				}
			}
		});
		Ajax({
			url: BURL + 'bpm/querycount',
			data: {
				// busitypes:['pass0001','pass0002','pass0003']
				busitypes: [ 'pass0001' ]
			},
			success: function(res) {
				if (res.success) {
					_this.setState({
						bpmNum: res.data
					});
				}
			}
		});
	}

	render() {
		let { infoTopData, forsettlemoneyData, moneyinsevendayData, bpmNum } = this.state;
		let infoData = [
			{
				title: '审批',
				list: [
					{
						name: '待审批',
						num: bpmNum,
						url: 'pbm/approveList'
					}
				]
			},
			{
				title: '本周收支总额',
				list: [
					{
						name: '收入',
						mny: infoTopData.moneyinweek.recemny
					},
					{
						name: '支出',
						mny: infoTopData.moneyinweek.paymny
					}
				]
			},
			{
				title: '预计流入流出',
				list: [
					{
						name: '预计流入',
						mny: infoTopData.forsettlemoney.recemny
					},
					{
						name: '预计流出',
						mny: infoTopData.forsettlemoney.paymny
					}
				]
			}
		];
		let options = [
			{
				id: 'chartsContent',
				tab: '上周收支曲线',
				chartsData: {
					color: [ '#5793f3', '#d14a61', '#675bba' ],
					tooltip: {
						trigger: 'none',
						axisPointer: {
							type: 'cross'
						}
					},
					legend: {
						data: [ '收入', '支出' ]
					},
					grid: {
						top: 70,
						bottom: 50
					},
					xAxis: [
						{
							type: 'category',
							axisTick: {
								alignWithLabel: true
							},
							axisLine: {
								onZero: false,
								lineStyle: {
									color: '#d14a61'
								}
							},
							axisPointer: {
								label: {
									formatter: function(params) {
										return (
											'支出金额  ' +
											params.value +
											(params.seriesData.length ? '：' + params.seriesData[0].data + '万元' : '')
										);
									}
								}
							},
							data: moneyinsevendayData.dateData
						},
						{
							type: 'category',
							axisTick: {
								alignWithLabel: true
							},
							axisLine: {
								onZero: false,
								lineStyle: {
									color: '#5793f3'
								}
							},
							axisPointer: {
								label: {
									formatter: function(params) {
										return (
											'收入金额  ' +
											params.value +
											(params.seriesData.length ? '：' + params.seriesData[0].data + '万元' : '')
										);
									}
								}
							},
							data: moneyinsevendayData.dateData
						}
					],
					yAxis: [
						{
							type: 'value'
							// min: '0',
							// max: '250'
						}
					],
					series: [
						{
							name: '收入',
							type: 'line',
							xAxisIndex: 1,
							smooth: true,
							data: moneyinsevendayData.recemnyData
						},
						{
							name: '支出',
							type: 'line',
							smooth: true,
							data: moneyinsevendayData.paymnyData
						}
					]
				}
			},
			{
				id: 'chartsContent2',
				tab: '预计流入流出',
				chartsData: {
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b}: {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						x: 'left',
						data: [ '预计流入', '预计流出' ]
					},
					series: [
						{
							name: '预计流入流出',
							type: 'pie',
							radius: [ '50%', '70%' ],
							avoidLabelOverlap: false,
							label: {
								normal: {
									show: false,
									position: 'center'
								},
								emphasis: {
									show: true,
									textStyle: {
										fontSize: '30',
										fontWeight: 'bold'
									}
								}
							},
							labelLine: {
								normal: {
									show: false
								}
							},
							data: [
								{ value: forsettlemoneyData.recemny, name: '预计流入' },
								{ value: forsettlemoneyData.paymny, name: '预计流出' }
							]
						}
					]
				}
			}
		];
		return (
			<div className='tmc_index_content'>
				<div className='tmc_index_left'>
					{/* 信息提醒区 */}
					<div className='tmc_left_top'>
						{infoData.map((item, index) => {
							return <InfoDisplay infoData={item} index={index} />;
						})}
						<div className='tmc_list_content' />
						<div className='tmc_list_content border-none' />
					</div>
					{/* 图表展示区 */}
					<div className='tmc_left_bottom'>
						{moneyinsevendayData.dateData.length > 0 && <Charts options={options} />}
					</div>
				</div>
				<div className='tmc_index_right'>
					{/* 常用链接区 */}
					<div className='tmc_right_top'>
						<Ulink ulinkdata={ulinkdata} />
					</div>
					{/* 快捷入口区 */}
					<div className='tmc_right_bottom'>
						<RapidEntrance entranceData={entranceData} />
					</div>
				</div>
			</div>
		);
	}
}
