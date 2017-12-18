import React, { Component } from 'react';
import Ajax from '../../../utils/ajax';
import Ulink from '../containers/ulink';
import RapidEntrance from '../containers/rapid-entrance';
import InfoDisplay from '../containers/InfoDisplay';
import Charts from '../containers/charts';
import '../index.less';
const URL = window.reqURL.home;
const FMURL = window.reqURL.fm;
const BpmRUL = window.reqURL.bpm;
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
			name: '审批',
			icon: 'shenpi',
			url: 'pbm/approveList'
		},
		{
			name: '授信协议监控',
			icon: 'shouxinxieyijiankong',
			url: 'fm/creditmonitor'
		},
		{
			name: '担保台账',
			icon: 'danbaotaizhang',
			url: 'fm/taizhang'
		},
		{
			name: '贷款融资台账',
			icon: 'danbaotaizhang',
			url: 'fm/loantransaction?key=4'
		},
		{
			name: '外债融资台账',
			icon: 'danbaotaizhang',
			url: 'fm/loantransaction?key=4'
		}
	]
};
export default class TMCxindaizhuguan extends Component {
	constructor() {
		super();
		this.state = {
			infoDataTop: {
				bpmNum: '0',
				// 授信
				creditFacility: {
					lavequota: '0',
					usedquota: '0'
				},
				// 担保
				amount: {
					//金额
					guaamount: '0', //担保金额
					ctryamount: '0' //被担保金额
				},
				// 间接融资情况
				financepay: {
					financepayThisYear: 0, // 今年融资
					financepayAll: 0 // 总融资
				}
			},
			optionData1: {
				nameData: [],
				mnyData: []
			},
			optionData2: {
				nameData: [],
				mnyData: []
			},
			optionData3: {
				moneyData: [],
				nameData: []
			},
			optionData4: {
				guaamountData: [],
				ctryamountData: []
			},
			optionData5: {
				lavequota: '0',
				usedquota: '0'
			}
		};
	}
	handleSidTabChange = (activeKey) => {
		const _this = this;
		// 今年融资情况
		if (activeKey === '1') {
			Ajax({
				url: FMURL + 'fm/loanStatistics/queryloanmnyByYear',
				success: function(res) {
					let optionData1 = {
						nameData: [],
						mnyData: []
					};
					res.data.map((item, index) => {
						optionData1.nameData.push(item.bankname);
						optionData1.mnyData.push({ name: item.bankname, value: item.loanmny });
					});
					_this.setState({ optionData1 });
				}
			});
		}
		// 各金融机构应还本金
		if (activeKey === '2') {
			Ajax({
				url: FMURL + 'fm/loanStatistics/queryRepayInfoByMonth',
				success: function(res) {
					let optionData2 = {
						nameData: [],
						mnyData: []
					};
					res.data.map((item, index) => {
						optionData2.nameData.push(item.bankname);
						optionData2.mnyData.push(item.loanmny);
					});
					_this.setState({ optionData2 });
				}
			});
		}
		// 综合融资成本分析
		if (activeKey === '3') {
			Ajax({
				url: FMURL + 'fm/financing/orgcostdesc',
				success: function(res) {
					if (res.success && res.data) {
						let optionData3 = {
							moneyData: [],
							nameData: []
						};
						res.data.map((item, index) => {
							optionData3.nameData.push(item.name);
							optionData3.moneyData.push({
								name: item.name,
								value: item.money
							});
						});
						_this.setState({ optionData3 });
					}
				}
			});
		}
		// 担保情况
		if (activeKey === '4') {
			Ajax({
				url: URL + 'fm/guastatistics/getsticsAmount',
				success: function(res) {
					if (res.success && res.data) {
						let optionData4 = {
							guaamountData: [],
							ctryamountData: []
						};
						res.data.amountinmoth.map((item, index) => {
							optionData4.guaamountData.push(item.guaamount);
							optionData4.ctryamountData.push(item.ctryamount);
						});
						_this.setState({ optionData4 });
					}
				}
			});
		}
		// 授信情况
		if (activeKey === '5') {
			Ajax({
				url: URL + 'fm/creditCount/count',
				success: function(res) {
					if (res.success && res.data) {
						let optionData5 = res.data.creditFacility;
						_this.setState({ optionData5 });
					}
				}
			});
		}
	};
	componentWillMount() {
		const _this = this;
		// 审批
		Ajax({
			url: BpmRUL + 'bpm/querycount',
			data: {
				busitypes: [
					'fm0001',
					'fm0002',
					'fm0003',
					'fm0004',
					'fm0005',
					'fm0006',
					'fm0007',
					'fm0008',
					'fm0009',
					'fm0010',
					'fm0011',
					'fm0017',
					'fm0018',
					'fm0019',
					'fm0020',
					'fm0021'
				]
			},
			success: function(res) {
				if (res.success && res.data) {
					_this.state.infoDataTop.bpmNum = res.data;
					_this.setState({
						infoDataTop: _this.state.infoDataTop
					});
				}
			}
		});
		// 授信情况
		Ajax({
			url: URL + 'fm/creditCount/count',
			success: function(res) {
				if (res.success && res.data) {
					_this.state.infoDataTop.creditFacility = res.data.creditFacility;
					_this.setState({ infoDataTop: _this.state.infoDataTop });
				}
			}
		});
		// 担保
		Ajax({
			url: URL + 'fm/guastatistics/getsticsInfo',
			success: function(res) {
				if (res.success && res.data) {
					_this.state.infoDataTop.amount = res.data.amount;
					_this.setState({ infoDataTop: _this.state.infoDataTop });
				}
			}
		});
		// 间接融资情况
		Ajax({
			url: FMURL + 'fm/firstpage/selectFinancepayCount',
			success: function(res) {
				if (res.success && res.data) {
					_this.state.infoDataTop.financepay = res.data;
					_this.setState({ infoDataTop: _this.state.infoDataTop });
				}
			}
		});

		// 今年融资情况
		Ajax({
			url: FMURL + 'fm/loanStatistics/queryloanmnyByYear',
			success: function(res) {
				if (res.success && res.data) {
					let optionData1 = {
						nameData: [],
						mnyData: []
					};
					res.data.map((item, index) => {
						optionData1.nameData.push(item.bankname);
						optionData1.mnyData.push({ name: item.bankname, value: item.loanmny });
					});
					_this.setState({ optionData1 });
				}
			}
		});
	}
	render() {
		let { infoDataTop, optionData1, optionData2, optionData3, optionData4, optionData5 } = this.state;
		let infoData = [
			{
				title: '审批',
				list: [
					{
						name: '待审',
						num: infoDataTop.bpmNum,
						url: 'pbm/approveList'
					}
				]
			},
			{
				title: '直接融资情况',
				list: [
					{
						name: '累计融资',
						mny: '0'
					},
					{
						name: '今年融资',
						mny: '0'
					}
				]
			},
			{
				title: '间接融资情况',
				list: [
					{
						name: '累计融资',
						mny: infoDataTop.financepay.financepayAll
					},
					{
						name: '今年融资',
						mny: infoDataTop.financepay.inancepayThisYear
					}
				]
			},
			{
				title: '总授信情况',
				list: [
					{
						name: '总授信额度',
						mny: infoDataTop.creditFacility.lavequota
					},
					{
						name: '当前可用额度',
						mny: infoDataTop.creditFacility.usedquota
					}
				]
			},
			{
				title: '总担保情况',
				list: [
					{
						name: '担保总金额',
						mny: infoDataTop.amount.guaamount
					},
					{
						name: '可用担保额度',
						mny: infoDataTop.amount.ctryamount
					}
				]
			}
		];
		let options = [
			{
				id: 'chartsContent',
				tab: '今年融资统计',
				chartsData: {
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b}: {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						x: 'left',
						data: optionData1.nameData
					},
					series: [
						{
							name: '今年融资统计',
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
							data: optionData1.mnyData
						}
					]
				}
			},
			{
				id: 'chartsContent2',
				tab: '各金融机构应还本金',
				chartsData: {
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: [ '本月' ]
					},
					calculable: true,
					xAxis: [
						{
							type: 'category',
							data: optionData2.nameData
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
						{
							name: '本月',
							type: 'bar',
							data: optionData2.mnyData,
							markPoint: {
								data: [ { type: 'max', name: '最大值' }, { type: 'min', name: '最小值' } ]
							},
							markLine: {
								data: [ { type: 'average', name: '平均值' } ]
							}
						}
					]
				}
			},
			{
				id: 'chartsContent3',
				tab: '综合融资成本分析',
				chartsData: {
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b}: {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						x: 'left',
						data: optionData3.nameData
					},
					series: [
						{
							name: '综合融资成本分析',
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
									show: true
								}
							},
							data: optionData3.moneyData
						}
					]
				}
			},
			{
				id: 'chartsContent4',
				tab: '担保情况',
				chartsData: {
					tooltip: {
						trigger: 'axis'
					},
					legend: {
						data: [ '担保额度', '被担保额度' ]
					},
					calculable: true,
					xAxis: [
						{
							type: 'category',
							data: [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ]
						}
					],
					yAxis: [
						{
							type: 'value'
						}
					],
					series: [
						{
							name: '担保额度',
							type: 'line',
							data: optionData4.guaamountData,
							markPoint: {
								data: [ { type: 'max', name: '最大值' }, { type: 'min', name: '最小值' } ]
							},
							markLine: {
								data: [ { type: 'average', name: '平均值' } ]
							}
						},
						{
							name: '被担保额度',
							type: 'line',
							data: optionData4.ctryamountData,
							markPoint: {
								data: [ { type: 'max', name: '最大值' }, { type: 'min', name: '最小值' } ]
							},
							markLine: {
								data: [ { type: 'average', name: '平均值' } ]
							}
						}
					]
				}
			},
			{
				id: 'chartsContent5',
				tab: '授信情况',
				chartsData: {
					tooltip: {
						trigger: 'item',
						formatter: '{a} <br/>{b} : {c} ({d}%)'
					},
					legend: {
						orient: 'vertical',
						left: 'left',
						data: [ '已授信额度', '可用授信额度' ]
					},
					series: [
						{
							name: '授信情况',
							type: 'pie',
							radius: '55%',
							center: [ '50%', '60%' ],
							data: [
								{ value: optionData5.lavequota, name: '已授信额度' },
								{ value: optionData5.usedquota, name: '可用授信额度' }
							],
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							}
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
					</div>
					{/* 图表展示区 */}
					<div className='tmc_left_bottom'>
						{optionData1.nameData.length > 0 && (
							<Charts options={options} tabChange={this.handleSidTabChange} />
						)}
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
