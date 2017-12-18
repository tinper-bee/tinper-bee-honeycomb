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
			name: '审批',
			icon: 'shenpi',
			url: 'pbm/approveList'
		},
		{
			name: '查看投资台账',
			icon: 'danbaotaizhang',
			url: 'if/ledger'
		}
	]
};
export default class TMCzijintouzizhuguan extends Component {
	constructor() {
		super();
		this.state = {
			infoDataTop: {
				accCount: 0, // 投资账户总数
				amtmoneyCount: '0', // 累计投资总金额
				redemptionedamtCount: '0', // 累计赎回总金额
				incomeamt: '0', //累计收益
				bmpNum: 0 //待审批数量
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
			url: FMURL + 'fm/investindex/supervisorQuery',
			success: function(res) {
				if (res.success && res.data) {
					_this.state.infoDataTop.accCount = res.data.accCount;
					_this.state.infoDataTop.amtmoneyCount = res.data.amtmoneyCount;
					_this.state.infoDataTop.redemptionedamtCount = res.data.redemptionedamtCount;
					_this.state.infoDataTop.incomeamt = res.data.incomeamt;
					_this.setState({
						infoDataTop: _this.state.infoDataTop
					});
				}
			}
		});
		Ajax({
			url: BmpURL + 'bpm/querycount',
			data: {
				busitypes: [ 'fm0012', 'fm0013', 'fm0014', 'fm0015', 'fm0016' ]
			},
			success: function(res) {
				if (res.success && res.data) {
					_this.state.infoDataTop.bmpNum = res.data;
					_this.setState({
						infoDataTop: _this.state.infoDataTop
					});
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
				title: '审批',
				list: [
					{
						name: '待审批',
						num: infoDataTop.bmpNum,
						url: 'pbm/approveList'
					}
				]
			},
			{
				title: '账户情况',
				list: [
					{
						name: '投资账户数',
						num: infoDataTop.accCount,
						url: 'if/ledger'
					}
				]
			},
			{
				title: '投资',
				list: [
					{
						name: '累计投资',
						mny: infoDataTop.amtmoneyCount
					}
				]
			},
			{
				title: '赎回',
				list: [
					{
						name: '累计赎回金额',
						mny: infoDataTop.redemptionedamtCount
					}
				]
			},
			{
				title: '盈利情况',
				list: [
					{
						name: '累计盈利情况',
						mny: infoDataTop.incomeamt
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
						min: 0,
						max: 3000
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
						min: 0,
						max: 3000
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
