import React, { Component } from 'react';
import Tabs, { TabPane } from 'bee-tabs';
import Ajax from '../../../utils/ajax';
import Ulink from '../containers/ulink';
import RapidEntrance from '../containers/rapid-entrance';
import InfoDisplay from '../containers/InfoDisplay';
import Charts from '../containers/charts';
import '../index.less';
import './index.less';
const URL = window.reqURL.home;
const FMURL = window.reqURL.fm;
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
			name: '担保管理',
			icon: 'danbaoguanli',
			url: 'fm/assuremanage'
		},
		{
			name: '担保台账',
			icon: 'danbaotaizhang',
			url: 'fm/taizhang'
		},
		{
			name: '授信协议管理',
			icon: 'shouxinxieyiguanli',
			url: 'fm/creditmanage'
		},
		{
			name: '授信协议监控',
			icon: 'shouxinxieyijiankong',
			url: 'fm/creditmonitor'
		},
		{
			name: '发债申请',
			icon: 'fazhaishenqing',
			url: 'http://www.baidu.com'
		},
		{
			name: '发债交易',
			icon: 'fazhaijiaoyi',
			url: 'http://www.baidu.com'
		},
		{
			name: '贷款交易',
			icon: 'daikuanjiaoyi',
			url: 'fm/loantransaction'
		},
		{
			name: '贷款申请',
			icon: 'daikuanshenqing',
			url: 'fm/apply'
		},
		{
			name: '交易成本分析',
			icon: 'jiaoyichengbenfenxi',
			url: 'http://www.baidu.com'
		}
	]
};

export default class TMCxindaiyuan extends Component {
	constructor() {
		super();
		this.state = {
			infoData1Top: {
				guacontract: {
					//担保合约
					free: 0 //待提交
				},
				guaproperty: {
					//担保物权
					free: 0
				},
				guadebt: {
					//担保债务
					free: 0
				},
				amount: {
					//金额
					guaamount: '0.0', //担保金额
					ctryamount: '0.0' //被担保金额
				}
			},
			infoData2Top: {
				// 授信调整
				creditAdjust: {
					tobeSubmmit: 0
				},
				// 授信协议
				creditAgree: {
					nocommit: 0,
					noapprove: 0,
					ining: 0
				},
				// 授信额度
				creditFacility: {
					lavequota: '0',
					usedquota: '0'
				}
			},
			infoData3Top: {
				// 计息
				financepay: {
					financepay_settling: 0,
					financepay_waitcommit: 0,
					financepay_unsettle: 0
				},
				// 申请
				apply: {
					apply_unconfirm: 0,
					apply_applysubmit: 0
				},
				// 付息
				repayinterest: {
					repayinterest_settling: 0,
					repayinterest_waitcommit: 0,
					repayinterest_unsettle: 0
				},
				// 还本
				repayprcpl: {
					repayprcpl_waitcommit: 0,
					repayprcpl_unsettle: 0,
					repayprcpl_settling: 0
				},
				// 合同
				contract: {
					contract_applysubmit: 0,
					contract_unconfirm: 0
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
	// toptab 切换
	handleTabChange = (activeKey) => {
		const _this = this;
		// 担保页签
		if (activeKey === '1') {
			Ajax({
				url: URL + 'fm/guastatistics/getsticsInfo',
				success: function(res) {
					if (res.success && res.data) {
						let infoData1Top = res.data;
						_this.setState({ infoData1Top });
					}
				}
			});
		}
		// 授信页签
		if (activeKey === '2') {
			Ajax({
				url: URL + 'fm/creditCount/count',
				success: function(res) {
					if (res.success && res.data) {
						let infoData2Top = res.data;
						_this.setState({ infoData2Top });
					}
				}
			});
		}
		// 贷款融资页签
		if (activeKey === '3') {
			Ajax({
				url: FMURL + 'fm/firstpage/selectAllCount',
				success: function(res) {
					if (res.success && res.data) {
						let infoData3Top = res.data;
						_this.setState({ infoData3Top });
					}
				}
			});
		}
	};
	handleSidTabChange = (activeKey) => {
		const _this = this;
		// 今年融资情况
		if (activeKey === '1') {
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
		// 贷款融资
		Ajax({
			url: FMURL + 'fm/firstpage/selectAllCount',
			success: function(res) {
				if (res.success && res.data) {
					let infoData3Top = res.data;
					_this.setState({ infoData3Top });
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
		let {
			infoData1Top,
			infoData2Top,
			infoData3Top,
			optionData1,
			optionData2,
			optionData3,
			optionData4,
			optionData5
		} = this.state;
		let infoData1 = [
			{
				title: '担保物权',
				list: [
					{
						name: '待提交',
						num: infoData1Top.guaproperty.free,
						url: 'fm/securityinterest'
					}
				]
			},
			{
				title: '担保合约',
				list: [
					{
						name: '待提交',
						num: infoData1Top.guacontract.free,
						url: 'fm/guaranteecontractmanage'
					}
				]
			},
			{
				title: '担保债务',
				list: [
					{
						name: '待提交',
						num: infoData1Top.guadebt.free,
						url: 'fm/guacontractquote'
					}
				]
			},
			{
				title: '担保金额',
				list: [
					{
						name: '担保金额',
						mny: infoData1Top.amount.guaamount
					},
					{
						name: '被担保金额',
						mny: infoData1Top.amount.ctryamount
					}
				]
			}
		];
		let infoData2 = [
			{
				title: '授信协议',
				list: [
					{
						name: '待提交',
						num: infoData2Top.creditAgree.nocommit,
						url: 'fm/creditmanage'
					},
					{
						name: '待审批',
						num: infoData2Top.creditAgree.noapprove,
						url: 'fm/creditmanage'
					},
					{
						name: '执行中',
						num: infoData2Top.creditAgree.ining,
						url: 'fm/creditmanage'
					}
				]
			},
			{
				title: '授信调整',
				list: [
					{
						name: '待提交',
						num: infoData2Top.creditAdjust.tobeSubmmit,
						url: 'fm/creditadjust'
					}
				]
			},
			{
				title: '授信额度',
				list: [
					{
						name: '已授信额度',
						mny: infoData2Top.creditFacility.lavequota
					},
					{
						name: '可用授信额度',
						mny: infoData2Top.creditFacility.usedquota
					}
				]
			}
		];
		let infoData3 = [
			{
				title: '申请',
				list: [
					{
						name: '待提交',
						num: infoData3Top.apply.apply_applysubmit,
						url: 'fm/apply?status=1'
					},
					{
						name: '待确认',
						num: infoData3Top.apply.apply_unconfirm,
						url: 'fm/apply?status=2'
					}
				]
			},
			{
				title: '合同',
				list: [
					{
						name: '待提交',
						num: infoData3Top.contract.contract_applysubmit,
						url: 'fm/apply?status=3'
					}
				]
			},
			{
				title: '还本',
				list: [
					{
						name: '待提交',
						num: infoData3Top.repayprcpl.repayprcpl_waitcommit,
						url: 'fm/loantransaction?key=1&status=1'
					},
					{
						name: '待结算',
						num: infoData3Top.repayprcpl.repayprcpl_unsettle,
						url: 'fm/loantransaction?key=1&status=2'
					},
					{
						name: '结算中',
						num: infoData3Top.repayprcpl.repayprcpl_settling,
						url: 'fm/loantransaction?key=1&status=3'
					}
				]
			},
			{
				title: '付息',
				list: [
					{
						name: '待提交',
						num: infoData3Top.repayinterest.repayinterest_waitcommit,
						url: 'fm/loantransaction?key=3&status=1'
					},
					{
						name: '待结算',
						num: infoData3Top.repayinterest.repayinterest_unsettle,
						url: 'fm/loantransaction?key=3&status=2'
					},
					{
						name: '结算中',
						num: infoData3Top.repayinterest.repayinterest_settling,
						url: 'fm/loantransaction?key=3&status=3'
					}
				]
			},
			{
				title: '计息',
				list: [
					{
						name: '待提交',
						num: infoData3Top.financepay.financepay_waitcommit,
						url: 'fm/loantransaction?key=2&status=1'
					},
					{
						name: '待结算',
						num: infoData3Top.financepay.financepay_unsettle,
						url: 'fm/loantransaction?key=2&status=2'
					},
					{
						name: '结算中',
						num: infoData3Top.financepay.financepay_settling,
						url: 'fm/loantransaction?key=2&status=3'
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
						<Tabs defaultActiveKey='3' onChange={this.handleTabChange}>
							<TabPane tab='担保' key='1'>
								{infoData1.map((item, index) => {
									return <InfoDisplay infoData={item} index={index} />;
								})}
								<div className='tmc_list_content' />
							</TabPane>
							<TabPane tab='授信' key='2'>
								{infoData2.map((item, index) => {
									return <InfoDisplay infoData={item} index={index} />;
								})}
								<div className='tmc_list_content' />
								<div className='tmc_list_content border-none' />
							</TabPane>
							<TabPane tab='贷款融资' key='3'>
								{infoData3.map((item, index) => {
									return <InfoDisplay infoData={item} index={index} />;
								})}
							</TabPane>
							<TabPane tab='发债融资' key='4'>
								<div className='devMsg'>
									<span>正在努力开发中...</span>
								</div>
							</TabPane>
						</Tabs>
					</div>
					{/* 图表展示区 */}
					<div className='tmc_left_bottom'>
						<Charts options={options} tabChange={this.handleSidTabChange} />
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
