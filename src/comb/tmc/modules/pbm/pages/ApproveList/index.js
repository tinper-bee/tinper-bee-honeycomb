import React, { Component } from 'react';
import { Row, Col, Breadcrumb, Checkbox, Button, InputGroup, FormControl, Select, Pagination } from 'tinper-bee';
import Tabs, { TabPane } from 'bee-tabs';
import ApproveListItem from './ApproveListItem';
import './index.less';
import ajax from 'utils/ajax';
import ApproveDetailButton from 'containers/ApproveDetailButton';
import { toast } from 'utils/utils.js';
const URL = window.reqURL.bpm;

export default class ApproveList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			classify: [],
			approveList: [], //列表数据
			pageInfo: {},
			categoryinfo: [], //分类数据
			activePage: 1,
			totalnums: 100,
			status: 0,
			busiType: sessionStorage.approveBusiType || ''
		};
	}

	componentDidMount() {
		this.querybills();
	}

	handleSelect(eventKey) {
		console.log(eventKey);
		this.setState({
			activePage: eventKey
		});
	}
	//改变每页显示数据的条数
	handlePageSizeSelect(e) {
		console.log(e);
	}

	querybills = () => {
		let that = this;
		let { pageInfo } = this.state;
		ajax({
			loading: true,
			url: URL + 'bpm/querybills',
			data: {
				busitype: this.state.busiType === 'null' ? null : this.state.busiType,
				status: this.state.status,
				pageIndex: pageInfo.pageIndex || 1,
				pageSize: '5'
			},
			success: function(res) {
				that.setState({
					approveList: res.data.bills,
					categoryinfo: [ { billCategory: '全部', billtypecode: 'null', count: res.data.counts } ].concat(
						res.data.categoryinfo
					),
					pageInfo: res.data.page
				});
			}
		});
	};

	approvebill = (data, action) => {
		let that = this;
		ajax({
			loading: true,
			url: URL + 'bpm/' + action,
			data: { data },
			success: function(res) {
				if (res.success) {
					switch (action) {
						case 'approvebills':
							toast({ content: '审批成功' });
							break;
						case 'unapprovebills':
							toast({ content: '取消审批成功' });
							break;
						case 'rejectbills':
							toast({ content: '驳回成功' });
							break;

						default:
							break;
					}
					that.querybills();
				}
			}
		});
	};

	multiApprove = (action) => {
		let that = this;
		let data = [];
		this.state.approveList.map((e, i) => {
			if (e.checked) {
				data.push({
					businesskey: e.businesskey,
					billid: e.vbillId
				});
			}
		});
		this.approvebill(data, action);
	};

	onCheck = (index) => {
		this.state.approveList[index].checked = !this.state.approveList[index].checked;
		this.setState({
			approveList: this.state.approveList
		});
	};

	checkAll = (checked) => {
		this.state.approveList = this.state.approveList.map((e, i) => {
			return {
				...e,
				checked
			};
		});
		this.setState({
			approveList: this.state.approveList
		});
	};

	render() {
		let { categoryinfo, approveList, pageInfo } = this.state;
		let checked = approveList.length > 0;
		for (let item of approveList) {
			if (!item.checked) {
				checked = false;
				break;
			}
		}
		return (
			<div id="approve-list" className="bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item>审批</Breadcrumb.Item>
				</Breadcrumb>
				<div className="approve-list">
					<div className="header">
						<Tabs
							defaultActiveKey={sessionStorage.approveStatus || '0'}
							tabBarStyle="simple"
							className="tabs"
							onChange={(key) => {
								sessionStorage.approveStatus = key;
								this.setState(
									{
										status: Number(key)
									},
									() => {
										this.querybills();
									}
								);
							}}
						>
							<TabPane tab="未审核" key="0" />
							<TabPane tab="已审核" key="1" />
						</Tabs>
						<div className="right-nav clearfix">
							<Checkbox className="checkbox" checked={checked} onChange={this.checkAll} />全选
							{this.state.status == '0' && (
								<Button
									className="btn-2"
									style={{ marginLeft: '17px' }}
									onClick={this.multiApprove.bind(this, 'approvebills')}
								>
									审批通过
								</Button>
							)}
							{this.state.status == '1' && (
								<Button
									className="btn-2"
									style={{ marginLeft: '17px' }}
									onClick={this.multiApprove.bind(this, 'unapprovebills')}
								>
									取消审批
								</Button>
							)}
							{this.state.status == '0' && (
								<Button
									className="btn-2 btn-cancel"
									style={{ marginLeft: '10px' }}
									onClick={this.multiApprove.bind(this, 'rejectbills')}
								>
									驳回
								</Button>
							)}
							<span className="search">
								<FormControl type="text" placeholder="搜索合同名称" />
								<span className="iconfont icon-icon-sousuo"> </span>
							</span>
						</div>
					</div>
					<div className="container clearfix">
						<div className="left">
							{categoryinfo && (
								<Tabs
									defaultActiveKey={this.state.busiType || 'null'}
									tabBarPosition="left"
									className="tab-left"
									onChange={(key) => {
										sessionStorage.approveBusiType = key;
										this.setState(
											{
												busiType: key
											},
											() => {
												this.querybills();
											}
										);
									}}
								>
									{categoryinfo.map((e, i) => {
										return <TabPane key={e.billtypecode} tab={`${e.billCategory} ${e.count}`} />;
									})}
								</Tabs>
							)}
						</div>
						<div className="right">
							{approveList.map((item, i) => {
								return (
									<ApproveListItem
										status={this.state.status}
										key={i}
										index={i}
										data={item}
										approvebill={this.approvebill}
										onCheck={this.onCheck.bind(this, i)}
									/>
								);
							})}
							<div className="bd-footer">
								{/* <div className="page-size">
									<Select defaultValue={'10条/页'} onSelect={this.handlePageSizeSelect}>
										<Option value="10">10条/页</Option>
										<Option value="20">20条/页</Option>
										<Option value="50">50条/页</Option>
										<Option value="100">100条/页</Option>
									</Select>
									共 {this.state.totalnums} 条
								</div> */}
								<div className="pagination">
									{/* <span className="toPage">
										跳至
										<FormControl className="toPage-input" value={this.state.activePage + 1} /> 页
										<Button
											className="insurebtn"
											onClick={this.handleSelect.bind(this, this.state.activePage + 1)}
										>
											确定
										</Button>
									</span> */}
									<Pagination
										first
										last
										prev
										next
										boundaryLinks
										size="sm"
										gap={true}
										items={pageInfo.maxPage || 1}
										maxButtons={5}
										activePage={pageInfo.pageIndex ? pageInfo.pageIndex : 1}
										onSelect={(key) => {
											console.log(key);
											pageInfo.pageIndex = key;
											this.setState({
												pageInfo
											});
											this.querybills();
										}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
