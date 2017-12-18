import React, { Component } from 'react';
import './index.less';
import { Pagination } from 'tinper-bee';
import Tabs, { TabPane } from 'bee-tabs';
import Table from 'bee-table';
import axios from 'axios';
import ajax from 'utils/ajax';
const URL = window.reqURL.fm;

let data1 = [
	{ title: '阿里巴巴公司债券', content: '预计年华收益6.5%' },
	{ title: '目前投资金额(元）', content: '100,000,000' },
	{ title: '累计收益（元）', content: '3,000.00' },
	{ title: '可赎回金额', content: '3,000.00' }
];
const columns1 = [
	{ title: '申购时间', key: 'values.subscribetime.value', dataIndex: 'values.subscribetime.value', width: 150 },
	{ title: '申购金额（元）', key: 'values.amtmoney.value', dataIndex: 'values.amtmoney.value', width: 100 },
	{ title: '币种', key: 'values.currtypename.value', dataIndex: 'values.currtypename.value', width: 100 }
];
const columns2 = [
	{ title: '赎回时间', key: 'values.redemptiontime.value', dataIndex: 'values.redemptiontime.value', width: 100 },
	{ title: '赎回金额（元）', key: 'values.redemptionamt.value', dataIndex: 'values.redemptionamt.value', width: 100 },
	{ title: '币种', key: 'values.currtypename.value', dataIndex: 'values.currtypename.value', width: 100 }
];

const defaultTableData = {
	pageinfo: {},
	rows: [],
	activePage: 0
};

export default class AssetModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			header: data1,
			subscribe: defaultTableData,
			redemption: defaultTableData
		};
	}
	componentWillMount() {
		this.searchSubscribeDetail();
		this.search();
	}

	// 申购
	searchSubscribeDetail = () => {
		let that = this;
		let { subscribe, redemption } = this.state;
		ajax({
			url: URL + 'fm/subscribe/search',
			data: {
				pageSize: subscribe.pageinfo.size || 5,
				pageIndex: subscribe.activePage || 0,
				prdcode: that.props.data.values.prdcode.value
			},
			success: function (res) {
				if (res.data) {
					subscribe = {...subscribe, ...res.data.head};
					subscribe.rows.map((item, key) => {
						item.values.amtmoney.value = item.values.amtmoney.value || '0'
					});
					that.setState({
						subscribe
					});
				}
			}
		});
	};

	// 赎回
	search = () => {
		let that = this;
		let { subscribe, redemption } = this.state;
		ajax({
			url: URL + 'fm/redemption/search',
			data: {
				pageSize: redemption.pageinfo.size || 5,
				pageIndex: redemption.activePage || 0,
				prdcode: that.props.data.values.prdcode.value,
				// status: '1'
				customercode: this.props.customercode
			},
			success: function (res) {
				redemption = {...redemption, ...res.data.head};
				redemption.rows.map((item, key) => {
					item.values.redemptionamt.value = item.values.redemptionamt.value || '0';
				});
				that.setState({
					redemption
				});
			}
		});
	};
	render() {
		let { subscribe, redemption } = this.state;
		console.log(this.props)
		let { data } = this.props
		return (
			<div className="asset-modal">
				{/* <h6 className="title">投资明细</h6> */}
				<ul className="header-table">
					<li>
						<div className="header-table-title">{data.values.prdname.value}</div>
						<div className="header-table-content">{data.values.prdcode.value}</div>
					</li>
					<li>
						<div className="header-table-title">目前投资金额(元）</div>
						<div className="header-table-content">{data.values.amtmoney.value}</div>
					</li>
					<li>
						<div className="header-table-title">累计收益（元）</div>
						<div className="header-table-content">{data.values.incomeamt.value}</div>
					</li>
					<li>
						<div className="header-table-title">可赎回金额</div>
						<div className="header-table-content">{Number(data.values.amtmoney.value) +
							Number(data.values.incomeamt.value) -
							Number(data.values.redemptionedamt.value)}</div>
					</li>
					<div className="clear" />
				</ul>
				<Tabs defaultActiveKey="1" className="tabs">
					<TabPane tab="申购记录" key="1">
						<Table
							columns={columns1}
							data={this.state.subscribe.rows}
							className="bd-table short-table"
						/>
						<div className="bd-footer">
							<div className="pagination">
								<Pagination
									first
									last
									prev
									next
									boundaryLinks
									items={subscribe.pageinfo.totalPages || 1}
									maxButtons={5}
									activePage={subscribe.activePage ? subscribe.activePage + 1 : 1}
									onSelect={key => {
										subscribe.activePage = key - 1;
										this.setState({
											subscribe
										});
										this.searchSubscribeDetail();
									}}
								/>
							</div>
						</div>
					</TabPane>
					<TabPane tab="赎回记录" key="2">
						<Table
							columns={columns2}
							data={this.state.redemption.rows}
							className="bd-table short-table"
						/>
						<div className="bd-footer">
							<div className="pagination">
								<Pagination
									first
									last
									prev
									next
									boundaryLinks
									items={redemption.pageinfo.totalPages || 1}
									maxButtons={5}
									activePage={redemption.activePage ? redemption.activePage + 1 : 1}
									onSelect={key => {
										redemption.activePage = key - 1;
										this.setState({
											redemption
										});
										this.search();
									}}
								/>
							</div>
						</div>
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
