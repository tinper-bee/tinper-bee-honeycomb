import React, { Component } from 'react';
import Ajax from '../../../utils/ajax';
import Ulink from '../containers/ulink';
import RapidEntrance from '../containers/rapid-entrance';
import InfoDisplay from '../containers/InfoDisplay';
import Charts from '../containers/charts';
import '../index.less';
const FMURL = window.reqURL.fm;
const BmpURL = window.reqURL.bpm;
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
			name: '结算服务',
			icon: 'fuwulei',
			url: 'pass/settlement'
		},
		{
			name: '异常结算服务',
			icon: 'fuwulei',
			url: 'pass/unsettlement'
		},
		{
			name: '投资台账',
			icon: 'danbaotaizhang',
			url: 'if/ledger'
		},
		{
			name: '申购录入',
			icon: 'lurulei',
			url: 'if/offline'
		},
		{
			name: '赎回录入',
			icon: 'lurulei',
			url: 'if/offline'
		},
		{
			name: '转入录入',
			icon: 'lurulei',
			url: 'if/offline'
		},
		{
			name: '转出录入',
			icon: 'lurulei',
			url: 'if/offline'
		}
	]
};

export default class TMCzijintouziyuan extends Component {
	constructor() {
		super();
		this.state = {
			infoDataTop: {
				// 申购
				subscribeNum: {
					commitCount: 0, // 待审批
					approverCount: 0 //审批中
				},
				// 赎回
				redemptionNum: {
					commitCount: '', // 待审批
					approverCount: '' // 审批中
				},
				// 转入
				rec: {
					SETTLE_NONE: 0, //待结算
					SETTLE_ING: 0 // 结算中
				},
				// 转出
				pay: {
					SETTLE_NONE: 0, //待结算
					SETTLE_ING: 0 // 结算中
				},
				// 账户情况
				accNum: {
					accCount: '0', // 投资账户总数
					amtmoneyCount: '0', // 累计投资总金额
					redemptionedamtCount: '0' // 累计赎回总金额
				}
			},
			optionData1: {
				nameData: [],
				moneyData: [],
				maxmoney: '50',
				minmoney: '0'
			},
			optionData2: {
				nameData: [],
				moneyData: [],
				maxmoney: '50',
				minmoney: '0'
			},
			optionData3: {
				nameData: [],
				moneyData: [],
				maxmoney: '50',
				minmoney: '0'
			}
		};
	}
	handleTabChange = (activeKey) => {
		const _this = this;
		if (activeKey === '1') {
			Ajax({
				url: FMURL + 'fm/investindex/subscribeState',
				success: function(res) {
					if (res.success && res.data) {
						let optionData1 = {
							nameData: [],
							moneyData: [],
							maxmoney: '50',
							minmoney: '0'
						};
						res.data.data.map((item, index) => {
							optionData1.nameData.push(item.name);
							optionData1.moneyData.push(item.money);
						});
						optionData1.maxmoney = res.data.maxmoney;
						optionData1.minmoney = res.data.minmoney;
						_this.setState({ optionData1 });
					}
				}
			});
		}
		if (activeKey === '2') {
			Ajax({
				url: FMURL + 'fm/investindex/bankState',
				success: function(res) {
					if (res.success && res.data) {
						let optionData2 = {
							nameData: [],
							moneyData: [],
							maxmoney: '50',
							minmoney: '0'
						};
						res.data.data.map((item, index) => {
							optionData2.nameData.push(item.name);
							optionData2.moneyData.push(item.money);
						});
						optionData2.maxmoney = res.data.maxmoney;
						optionData2.minmoney = res.data.minmoney;
						_this.setState({ optionData2 });
					}
				}
			});
		}
		if (activeKey === '3') {
			Ajax({
				url: FMURL + 'fm/investindex/rateState',
				success: function(res) {
					if (res.success && res.data) {
						let optionData3 = {
							nameData: [],
							moneyData: [],
							maxmoney: '50',
							minmoney: '0'
						};
						res.data.data.map((item, index) => {
							optionData3.nameData.push(item.name);
							optionData3.moneyData.push(item.money);
						});
						optionData3.maxmoney = res.data.maxmoney;
						optionData3.minmoney = res.data.minmoney;
						_this.setState({ optionData3 });
					}
				}
			});
		}
	};

	componentWillMount() {
		const _this = this;
		Ajax({
			url: FMURL + 'fm/investindex/staffQuery',
			success: function(res) {
				if (res.success && res.data) {
					let infoDataTop = res.data;
					_this.setState({ infoDataTop });
				}
			}
		});
		Ajax({
			url: FMURL + 'fm/investindex/subscribeState',
			success: function(res) {
				if (res.success && res.data) {
					let optionData1 = {
						nameData: [],
						moneyData: [],
						maxmoney: '50',
						minmoney: '0'
					};
					res.data.data.map((item, index) => {
						optionData1.nameData.push(item.name);
						optionData1.moneyData.push(item.money);
					});
					optionData1.maxmoney = res.data.maxmoney;
					optionData1.minmoney = res.data.minmoney;
					_this.setState({ optionData1 });
				}
			}
		});
	}

	render() {
		let { infoDataTop, optionData1, optionData2, optionData3 } = this.state;
		let infoData = [
			{
				title: '申购',
				list: [
					{
						name: '已提交',
						num: infoDataTop.subscribeNum.commitCount,
						url: 'if/myasset?tab=3&status=1'
					},
					{
						name: '申购成功',
						num: infoDataTop.subscribeNum.approverCount,
						url: 'if/myasset?tab=3&status=1'
					}
				]
			},
			{
				title: '赎回',
				list: [
					{
						name: '已提交',
						num: infoDataTop.redemptionNum.commitCount,
						url: 'if/myasset?tab=3&status=2'
					},
					{
						name: '赎回成功',
						num: infoDataTop.redemptionNum.approverCount,
						url: 'if/myasset?tab=3&status=2'
					}
				]
			},
			{
				title: '转入',
				list: [
					{
						name: '平台结算中',
						num: infoDataTop.rec.SETTLE_NONE,
						url: 'if/myasset?tab=3&status=3'
					},
					{
						name: '平台结算成功',
						num: infoDataTop.rec.SETTLE_ING,
						url: 'if/myasset?tab=3&status=3'
					}
				]
			},
			{
				title: '转出',
				list: [
					{
						name: '平台结算中',
						num: infoDataTop.pay.SETTLE_NONE,
						url: 'if/myasset?tab=3&status=4'
					},
					{
						name: '平台结算成功',
						num: infoDataTop.pay.SETTLE_ING,
						url: 'if/myasset?tab=3&status=4'
					}
				]
			},
			{
				title: '投资收益情况',
				list: [
					{
						name: '累计投资',
						mny: infoDataTop.accNum.amtmoneyCount
					},
					{
						name: '累计赎回',
						mny: infoDataTop.accNum.redemptionedamtCount
					}
				]
			}
		];
		let options = [
			{
				id: 'chartsContent',
				tab: '理财产品投资情况',
				chartsData: {
					tooltip: {},
					xAxis: {
						data: optionData1.nameData
					},
					yAxis: {
						min: optionData1.minmoney,
						max: optionData1.maxmoney
					},
					series: [
						{
							name: '理财产品投资情况',
							type: 'bar',
							data: optionData1.moneyData
						}
					]
				}
			},
			{
				id: 'chartsContent2',
				tab: '各银行投资情况',
				chartsData: {
					tooltip: {},
					xAxis: {
						min: optionData2.minmoney,
						max: optionData2.maxmoney
					},
					yAxis: {
						data: optionData2.nameData
					},
					series: [
						{
							name: '各银行投资情况',
							type: 'bar',
							data: optionData2.moneyData
						}
					]
				}
			},
			{
				id: 'chartsContent3',
				tab: '七日年化收益情况',
				chartsData: {
					tooltip: {},
					xAxis: {
						data: optionData3.nameData
					},
					yAxis: {
						min: optionData3.minmoney,
						max: optionData3.maxmoney
					},
					series: [
						{
							name: '七日年化收益情况',
							type: 'bar',
							data: optionData3.moneyData
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
						{optionData1.nameData && <Charts options={options} tabChange={this.handleTabChange} />}
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
