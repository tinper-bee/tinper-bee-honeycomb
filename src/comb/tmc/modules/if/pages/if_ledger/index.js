import React, { Component } from 'react';
import { Breadcrumb, Button, FormControl, Pagination } from 'tinper-bee';
import moment from 'moment';
import Table from 'bee-table';
import Tabs, { TabPane } from 'bee-tabs';
import Select from 'bee-select';
import axios from 'axios';
import ajax from 'utils/ajax';
import SideModal from 'containers/SideModal';
import { toast } from 'utils/utils.js';
import nodataPic from '../../../../static/images/nodata.png';
import './index.less';
const URL = window.reqURL.fm;

//查看弹出框的申购记录
const columns1 = [
	{ title: '申购时间', key: 'values.subscribetime.value', dataIndex: 'values.subscribetime.value', width: 150 },
	{ title: '申购金额（元）', key: 'values.amtmoney.value', dataIndex: 'values.amtmoney.value', width: 100 },
	{ title: '币种', key: 'values.currtypename.value', dataIndex: 'values.currtypename.value', width: 100 }
];
//查看弹出框的赎回记录
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

export default class Ledger extends Component {
	constructor(props) {
		super(props);
		this.state = {
			subscribe: defaultTableData,
			redemption: defaultTableData,
			showModal: false,
			detailModal: false,
			detailModalData: null,
			key: '',
			columns1: [
				{
					title: '名称/代码',
					key: 'values.prdname.value',
					render: (text, record, index) => {
						return (
							<div>
								<div className="prdname">{record.values.prdname.value}</div>
								<div className="prdcode">{record.values.prdcode.value}</div>
							</div>
						);
					}
				},
				{ title: '投资金额(元)', key: 'values.amtmoney.value', dataIndex: 'values.amtmoney.value' },
				{ title: '累计收益(元)', key: 'values.incomeamt.value', dataIndex: 'values.incomeamt.value' },
				{ title: '已赎回金额', key: 'values.redemptionedamt.value', dataIndex: 'values.redemptionedamt.value' },
				{
					title: '银行名称',
					key: 'banktype_name',
					render: (text, record, index) => {
						let key = this.state.key;
						return <div>{this.state.eacct[key].banktype_name}</div>;
					}
				},
				{
					title: '状态',
					key: 'values.currtypename.value',
					render: (text, record, index) => {
						return (
							<div>
								{record.values.redemptionedamt.value > 0
									? record.values.amtmoney.value + record.values.incomeamt >
										record.values.redemptionedamt.value
										? '部分赎回'
										: '已赎回'
									: '未赎回'}
							</div>
						);
					}
				},
				{
					title: '操作',
					key: 'operate',
					render: (text, record, index) => {
						let { tableData, redemption, subscribe } = this.state;
						return (
							<span className="detail" onClick={this.handleLookClick.bind(this, record)}>
								查看
							</span>
						);
					}
				}
			],
			columns2: [
				{
					title: '支付账户名/支付账户',
					key: 'payaccname',
					width: '260px',
					render: (text, record, index) => {
						return (
							<div>
								<div className="payaccname">{record.payaccname}</div>
								<div className="payaccnum">{record.payaccnum}</div>
							</div>
						);
					}
				},
				{ title: '转入金额(元)', key: 'money', dataIndex: 'money', width: '100px' },
				{ title: '币种', key: 'currtypename', dataIndex: 'currtypename', width: '100px' },
				{ title: '转入时间', key: 'settledate', dataIndex: 'settledate', width: '200px' }
			],
			columns3: [
				{
					title: '收款账户名/收款账户',
					key: 'recaccname',
					width: '260px',
					render: (text, record, index) => {
						return (
							<div>
								<div className="payaccname">{record.recaccname}</div>
								<div className="payaccnum">{record.recaccnum}</div>
							</div>
						);
					}
				},
				{ title: '转出金额(元)', key: 'money', dataIndex: 'money', width: '100px' },
				{ title: '币种', key: 'currtypename', dataIndex: 'currtypename', width: '100px' },
				{ title: '转出时间', key: 'settledate', dataIndex: 'settledate', width: '200px' }
			],
			tableData: defaultTableData,
			slideTableData0: defaultTableData,
			slideTableData1: defaultTableData,
			eacct: [],
			keywords: ""
		};
	}
	componentWillMount = () => {
		let that = this;
		ajax({
			url: URL + 'fm/investcollection/queryAcc',
			data: {},
			success: function(res) {
				const { data, message, success } = res;
				if (data) {
					that.state.eacct = res.data;
				} else {
					that.state.eacct = [];
				}
				that.setState({
					eacct: that.state.eacct
				});
			}
		});
	};

	//银行下拉查询
	handelOnSelect = value => {
		this.state.key = value;
		this.setState({
			key: this.state.key,
			tableData: defaultTableData,
			subscribe: defaultTableData,
			redemption: defaultTableData,
			slideTableData0: defaultTableData,
			slideTableData1: defaultTableData
			// eacct: [],
		});
		this.queryprode();
	};

	queryprode = () => {
		let that = this;
		let { eacct, key, tableData, keywords } = this.state;
		ajax({
			url: URL + 'fm/investcollection/queryprode',
			data: {
				eacctno: eacct[key].code, //银行账号
				pageIndex: tableData.activePage || 0,
				pageSize: tableData.pageinfo.size || 10,
				keywords
			},
			success: function(res) {
				if (res.data) {
					that.state.tableData = { ...that.state.tableData, ...res.data.head };
				} else {
					that.state.tableData = defaultTableData;
					// toast({ content: '返回数据为空', color: 'warning' });
				}
				that.setState({
					tableData: that.state.tableData
				});
			}
		});
	};

	//点击查看
	handleLookClick = data => {
		let { eacct, key } = this.state;
		this.setState({ detailModal: true, detailModalData: data });
		let that = this;
		this.querysubdetail(data);
		this.queryreddetail(data);
	};
	//查询申购记录
	querysubdetail = data => {
		let that = this;
		let { subscribe, eacct, key } = that.state;
		ajax({
			url: URL + 'fm/investcollection/querysubdetail',
			data: {
				pageSize: subscribe.pageinfo.size || 5,
				pageIndex: subscribe.activePage || 0,
				prdcode: data.values.prdcode.value,
				eacctno: eacct[key].code
			},
			success: function(res) {
				if (res.data) {
					subscribe = { ...subscribe, ...res.data.head };
				} else {
					subscribe = defaultTableData;
				}
				that.setState({
					subscribe
				});
			}
		});
	};

	// 查询赎回记录
	queryreddetail = data => {
		let that = this;
		let { redemption, eacct, key } = that.state;
		ajax({
			url: URL + 'fm/investcollection/queryreddetail',
			data: {
				pageSize: redemption.pageinfo.size || 5,
				pageIndex: redemption.activePage || 0,
				prdcode: data.values.prdcode.value,
				eacctno: eacct[key].code
			},
			success: function(res) {
				if (res.data) {
					redemption = { ...redemption, ...res.data.head };
				} else {
					redemption = defaultTableData;
				}
				that.setState({
					redemption
				});
			}
		});
	};

	//点击明细
	handleDetailClick = () => {
		this.setState({ showModal: true });
		this.handleTabClick('0');
	};
	//点击Tab
	handleTabClick = direct => {
		let that = this;
		let { eacct, key } = that.state;
		ajax({
			url: URL + 'fm/transferacc/findTransferDetail',
			data: {
				page: that.state[`slideTableData${direct}`].activePage || 0,
				size: that.state[`slideTableData${direct}`].pageinfo.size || 5,
				searchParams: {
					searchMap: {
						bankaccount: eacct[key].code,
						direct: direct
					}
				}
			},
			success: function(res) {
				if (res.data.message) {
					// toast({ content: res.data.message, color: 'warning' });
					that.state[`slideTableData${direct}`] = defaultTableData;
				} else {
					that.state[`slideTableData${direct}`] = {
						...that.state[`slideTableData${direct}`],
						pageinfo: {
							number: res.data.number,
							numberOfElements: res.data.numberOfElements,
							size: res.data.size,
							totalElements: res.data.totalElements,
							totalPages: res.data.totalPages
						}
					};
					that.state[`slideTableData${direct}`].rows = res.data.data.map((item, key) => {
						item.settledate = moment(item.settledate).format('YYYY-MM-DD h:mm:ss');
						return item;
					});
				}
				that.setState({
					[`slideTableData${direct}`]: that.state[`slideTableData${direct}`]
				});
			}
		});
	};

	render() {
		let {
			tableData,
			redemption,
			subscribe,
			detailModalData,
			detailModal,
			slideTableData0,
			slideTableData1,
			keywords
		} = this.state;
		return (
			<div id="ledger" className="bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">投资理财</Breadcrumb.Item>
					<Breadcrumb.Item active>我的资产</Breadcrumb.Item>
				</Breadcrumb>
				<SideModal
				    title="账户明细"
					showModal={this.state.showModal}
					close={() => {
						this.setState({ showModal: false });
					}}
				>
					<div className="slide-table-warp fixed">
						<Tabs
							defaultActiveKey="0"
							className="tabs"
							onChange={key => {
								this.handleTabClick(key);
							}}
						>
							<TabPane tab="转入" key="0">
								<Table
									emptyText={() => (
										<div>
											<img src={nodataPic} alt="" />
										</div>
									)}
									columns={this.state.columns2}
									data={this.state.slideTableData0.rows}
									className="bd-table high-table"
								/>
								<div className="bd-footer">
									<div className="pagination">
										<Pagination
											first
											last
											prev
											next
											size="sm"
											gap={true}
											boundaryLinks
											items={slideTableData0.pageinfo.totalPages || 1}
											maxButtons={5}
											activePage={slideTableData0.activePage ? slideTableData0.activePage + 1 : 1}
											onSelect={key => {
												slideTableData0.activePage = key - 1;
												this.setState({
													slideTableData0
												});
												this.handleTabClick('0');
											}}
										/>
									</div>
								</div>
							</TabPane>
							<TabPane tab="转出" key="1">
								<Table
									emptyText={() => (
										<div>
											<img src={nodataPic} alt="" />
										</div>
									)}
									columns={this.state.columns3}
									data={this.state.slideTableData1.rows}
									className="bd-table high-table"
								/>
								<div className="bd-footer">
									<div className="pagination">
										<Pagination
											first
											last
											prev
											next
											size="sm"
											gap={true}
											boundaryLinks
											items={slideTableData1.pageinfo.totalPages || 1}
											maxButtons={5}
											activePage={slideTableData1.activePage ? slideTableData1.activePage + 1 : 1}
											onSelect={key => {
												slideTableData1.activePage = key - 1;
												this.setState({
													slideTableData1
												});
												this.handleTabClick('1');
											}}
										/>
									</div>
								</div>
							</TabPane>
						</Tabs>
					</div>
				</SideModal>
				{detailModalData && (
					<SideModal
						title="投资明细"
						showModal={detailModal}
						close={() => {
							this.setState({ detailModal: false });
						}}
					>
						<div className="slide-table-warp">
							<div className="asset-modal">
								<ul className="header-table">
									<li>
										<div className="header-table-title">{detailModalData.values.prdname.value}</div>
										<div className="header-table-content">
											{detailModalData.values.prdcode.value}
										</div>
									</li>
									<li>
										<div className="header-table-title">投资金额(元)</div>
										<div className="header-table-content">
											{detailModalData.values.amtmoney.value}
										</div>
									</li>
									<li>
										<div className="header-table-title">累计收益(元)</div>
										<div className="header-table-content">
											{detailModalData.values.incomeamt.value}
										</div>
									</li>
									<li>
										<div className="header-table-title">可赎回金额(元)</div>
										<div className="header-table-content">
											{Number(detailModalData.values.amtmoney.value) +
												Number(detailModalData.values.incomeamt.value) -
												Number(detailModalData.values.redemptionedamt.value)}
										</div>
									</li>
									<div className="clear" />
								</ul>
								<Tabs defaultActiveKey="1" className="tabs">
									<TabPane tab="申购记录" key="1">
										<Table
											emptyText={() => (
												<div>
													<img src={nodataPic} alt="" />
												</div>
											)}
											columns={columns1}
											data={this.state.subscribe.rows}
											// scroll={{ y: 150 }}
											className="bd-table short-table"
										/>
										<div className="bd-footer">
											<div className="pagination">
												<Pagination
													first
													last
													prev
													next
													size="sm"
													gap={true}
													boundaryLinks
													items={subscribe.pageinfo.totalPages || 1}
													maxButtons={5}
													activePage={subscribe.activePage ? subscribe.activePage + 1 : 1}
													onSelect={key => {
														console.log(key);
														subscribe.activePage = key - 1;
														this.setState({
															subscribe
														});
														this.querysubdetail(detailModalData);
													}}
												/>
											</div>
										</div>
									</TabPane>
									<TabPane tab="赎回记录" key="2">
										<Table
											emptyText={() => (
												<div>
													<img src={nodataPic} alt="" />
												</div>
											)}
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
													size="sm"
													gap={true}
													boundaryLinks
													items={redemption.pageinfo.totalPages || 1}
													maxButtons={5}
													activePage={redemption.activePage ? redemption.activePage + 1 : 1}
													onSelect={key => {
														console.log(key);
														redemption.activePage = key - 1;
														this.setState({
															redemption
														});
														this.queryreddetail(detailModalData);
													}}
												/>
											</div>
										</div>
									</TabPane>
								</Tabs>
							</div>
						</div>
					</SideModal>
				)}
				<div className="ledger">
					<div className="main-header">
						<h6 className="main-title">投资台账</h6>
						<Select 
							value={this.state.key} 
							onSelect={this.handelOnSelect} 
							className="title-select"
						>
							{this.state.eacct.map((item, key) => {
								return <Option value={key}>{item.banktype_name+' '+item.code}</Option>;
							})}
						</Select>
						{this.state.key ? (
							<span className="detail" onClick={this.handleDetailClick}>
								明细
							</span>
						) : (
							''
						)}
						<div className="clear" />
					</div>
					<div className="main-search">
						<FormControl
							className="max-input"
							placeholder="产品编号、名称"
							value={keywords}
							onChange={(e) => {
								this.setState({keywords: e.target.value})
							}}
						/>
						<Button disabled={!this.state.key} className="btn-2" onClick={this.queryprode}>
							查询
						</Button>
					</div>
					<div className="main-table">
						<Table
							columns={this.state.columns1}
							data={this.state.tableData.rows}
							className="bd-table"
							emptyText={() => (
								<div>
									<img src={nodataPic} alt="" />
								</div>
							)}
						/>
						{tableData.pageinfo && (
							<div className="bd-footer">
								<div className="pagination">
									<Pagination
										first
										last
										prev
										next
										boundaryLinks
										size="sm"
										gap={true}
										items={tableData.pageinfo.totalPages || 1}
										maxButtons={5}
										activePage={tableData.activePage ? tableData.activePage + 1 : 1}
										onSelect={key => {
											tableData.activePage = key - 1;
											this.setState({
												tableData
											});
											this.queryprode();
										}}
									/>		
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
