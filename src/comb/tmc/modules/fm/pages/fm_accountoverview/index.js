import React, { Component } from 'react';
import { Table, Breadcrumb, InputGroup, FormControl } from 'tinper-bee';
import moment from 'moment';
import Icon from 'bee-icon';
import Button from 'bee-button';
import Upload from 'bee-upload';
import PageJump from '../../../../containers/PageJump';
import Ajax from '../../../../utils/ajax.js';
import '../../../../utils/publicStyle.less';
import './index.less';
import nodataPic from '../../../../static/images/nodata.png';
import { clearInterval } from 'timers';
const { ColumnGroup, Column } = Table;
const URL = window.reqURL.fm;
const format = 'YYYY-MM-DD';
const toDay = moment().format(format);
// 列表表头显示列信息
const columns = [
	{
		title: '序号',
		dataIndex: 'num',
		key: 'num',
		width: '2%'
	},
	{
		title: '基本信息',
		children: [
			{
				title: '借款单位',
				dataIndex: 'companyname',
				key: 'companyname',
				width: '4%'
			},
			{
				title: '资金用途（项目）',
				dataIndex: 'fmuseway',
				key: 'fmuseway',
				width: '4%'
			},
			{
				title: '合约编号',
				dataIndex: 'contractcode',
				key: 'contractcode',
				width: '4%'
			}
		]
	},
	{
		title: '融资方案',
		children: [
			{
				title: '融资机构',
				dataIndex: 'financorganization',
				key: 'financorganization',
				width: '4%'
			},
			{
				title: '交易类型',
				dataIndex: 'transacttype',
				key: 'transacttype',
				width: '4%'
			},
			{
				title: '起始日',
				dataIndex: 'begindate',
				key: 'begindate',
				width: '4%'
			},
			{
				title: '到期日',
				dataIndex: 'enddate',
				key: 'enddate',
				width: '4%'
			},
			{
				title: '融资期限',
				dataIndex: 'periodcount',
				key: 'periodcount',
				width: '4%'
			},
			{
				title: '融资金额',
				dataIndex: 'financamount',
				key: 'financamount',
				width: '4%'
			},
			// {
			// 	title: '融资成本',
			// 	children: [
			// 		{
			// 			title: '利率',
			// 			dataIndex: 'rateid',
			// 			key: 'rateid'
			// 		},
			// 		{
			// 			title: '费用（万元）',
			// 			dataIndex: 'cost',
			// 			key: 'cost'
			// 		},
			// 		{
			// 			title: '综合融资成本',
			// 			dataIndex: 'financingcosts',
			// 			key: 'financingcosts'
			// 		}
			// 	]
			// },
			{
				title: '授信',
				dataIndex: 'creditquota',
				key: 'creditquota',
				width: '4%'
			},
			{
				title: '担保方式',
				dataIndex: 'guaranteetype',
				key: 'guaranteetype',
				width: '4%'
			}
		]
	},
	{
		title: '本金变动情况',
		children: [
			{
				title: '到账金额',
				children: [
					{
						title: '月初余额',
						dataIndex: 'beginBalance',
						key: 'beginBalance',
						width: '4%'
					},
					{
						title: '本月增加',
						dataIndex: 'increase',
						key: 'increase',
						width: '4%'
					},
					{
						title: '本月减少',
						dataIndex: 'decrease',
						key: 'decrease',
						width: '4%'
					},
					{
						title: '本月余额',
						dataIndex: 'endBalance',
						key: 'endBalance',
						width: '4%'
					}
				]
			},
			{
				title: '未到账',
				children: [
					{
						title: '金额',
						dataIndex: 'unLoanmnyAll',
						key: 'unLoanmnyAll',
						width: '4%'
					}
				]
			},
			{
				title: '已归还',
				children: [
					{
						title: '金额',
						dataIndex: 'repaymnyAll',
						key: 'repaymnyAll',
						width: '4%'
					}
				]
			}
		]
	},
	{
		title: '利息变动情况',
		children: [
			{
				title: '未付利息',
				dataIndex: 'unInterestAll',
				key: 'unInterestAll',
				width: '4%'
			},
			{
				title: '已付利息',
				dataIndex: 'interestAll',
				key: 'interestAll',
				width: '4%'
			}
		]
	}
];
let timer;
// 滑动动画
export function scroll_To(tar_x) {
	if (timer) {
		window.clearInterval(timer);
	}
	let t_scroll_x = document.querySelector('.fm_table_content');
	timer = setInterval(function() {
		let current_x = document.querySelector('.fm_table_content').scrollLeft; // 序号
		let step = 20; //步长系数 即剩余的距离除以40 每1ms 移动一段距离
		if (tar_x > current_x) {
			//tar_x > current_x 即向右滚动
			let dist = Math.ceil((tar_x - current_x) / step);
			let next_x = current_x + dist;
			if (next_x < tar_x) {
				t_scroll_x.scrollTo(next_x, 0);
			} else {
				t_scroll_x.scrollTo(tar_x, 0);
				if (timer) {
					window.clearInterval(timer);
				}
			}
		} else {
			//tar_x < current_x即向左滚动
			let dist = Math.ceil((current_x - tar_x) / step);
			let next_x = current_x - dist;
			if (next_x > tar_x) {
				t_scroll_x.scrollTo(next_x, 0);
			} else {
				t_scroll_x.scrollTo(tar_x, 0);
				if (timer) {
					window.clearInterval(timer);
				}
			}
		}
	}, 10);
}

export default class AccountOverview extends Component {
	constructor(props) {
		super(props);
		this.state = {
			menu: {
				bainfo: true,
				fipr: false,
				prchange: false,
				inchange: false
			},
			pageInfo: {
				rows: 10, // 每页多少行
				index: 1, // 当前第几页
				allPage: 0, // 总页数
				allRows: 0 // 总条数
			},
			searchData: {
				transacttype: '', //交易类型
				queryDate: undefined, //日期
				financorganization:''//融资机构
			},
			listArrData: [] // 列表数据
		};
	}
	// 数据请求方法
	reqDataFun = () => {
		let { rows, index, allPage, allRows } = this.state.pageInfo;
		let { transacttype, queryDate,financorganization } = this.state.searchData;
		if (transacttype.refpk) {
			transacttype = transacttype.refpk;
		}else{
			transacttype = '';
		}
		if(financorganization.refpk){
			financorganization = financorganization.refpk;
		}else{
			financorganization = '';
		}
		if(queryDate === undefined){
			queryDate = '';
		}else{
			queryDate = queryDate.format(format);
		}
		const _this = this;
		Ajax({
			url: URL + 'fm/bills/list',
			data: {
				page: index - 1,
				size: rows,
				searchParams: {
					searchMap: {
						queryDate: queryDate, //当前查询日期
						transacttype: transacttype, // 为空查全部
						financorganization: financorganization //融资机构
					}
				}
			},
			success: function(res) {
				if (res.success) {
					if(res.data){
						let resData = res.data.head;
						let { number, numberOfElements, size, totalElements, totalPages } = resData.pageinfo;
						let list = [];
						resData.rows.map((item, index) => {
							let itemData = {};
							for (let childData in item.values) {
								itemData[childData] = item.values[childData].value;
							}
							itemData.num = index + 1;
							list.push(itemData);
						});
						_this.state.pageInfo.allPage = totalPages;
						_this.state.pageInfo.allRows = totalElements;
						_this.setState({
							listArrData: list,
							pageInfo: _this.state.pageInfo
						});
					}else{
						_this.state.pageInfo.allPage = 0;
						_this.state.pageInfo.allRows = 0;
						_this.setState({
							listArrData: [],
							pageInfo: _this.state.pageInfo
						});
					}	
				}
			}
		});
	};
	// 页签切换
	handleMenuClick = (key) => {
		let tWidth = document.querySelector('.fm_table_content'); // 可视区域宽度
		let tW = document.querySelector('.fm_table'); // 表格总宽度
		let th0 = document.querySelector("th[rowspan='3']").offsetLeft; // 序号
		switch (key) {
			case 'bainfo':
				scroll_To(0);
				break;
			case 'fipr':
				let th2 = document.querySelector("th[colspan='8']").offsetLeft; // 融资方案
				scroll_To(th2);
				break;
			case 'prchange':
				let th3 = document.querySelector("th[colspan='6']").offsetLeft; // 本金变动情况
				scroll_To(th3);
				break;
			case 'inchange':
				scroll_To(tW.clientWidth - tWidth.clientWidth);
				break;
			default:
				break;
		}
		// this.tabSwitch(key);
	};
	// 标签选择
	tabSwitch = (key) => {
		let menu = this.state.menu;
		for (let menuItem in menu) {
			if (menuItem === key) {
				menu[menuItem] = true;
			} else {
				menu[menuItem] = false;
			}
		}
		this.setState({
			menu: menu
		});
	};
	// 滑动选择tab
	handleScroll = (e) => {
		let scroll_x = e.target.scrollLeft;
		let tWidth = document.querySelector('.fm_table_content').clientWidth; // 可视区域宽度
		let tW = document.querySelector('.fm_table').clientWidth; // 表格总宽度
		let th2 = document.querySelector("th[colspan='8']").offsetLeft; // 融资方案
		let th3 = document.querySelector("th[colspan='6']").offsetLeft; // 本金变动情况
		if (scroll_x < th2 - 1) {
			this.tabSwitch('bainfo');
		} else if (scroll_x < th3 - 1) {
			this.tabSwitch('fipr');
		} else if (scroll_x < tW - tWidth - 1) {
			this.tabSwitch('prchange');
		} else if (th3 < scroll_x) {
			this.tabSwitch('inchange');
		}
	};
	// 每页显示多少条
	handlePageChange = (rows) => {
		this.state.pageInfo.rows = rows;
		this.state.pageInfo.index = 1;
		this.setState({
			pageInfo: this.state.pageInfo
		});
		this.reqDataFun();
	};
	// 分页切换页面
	handlePageIndexChange = (index) => {
		this.state.pageInfo.index = index;
		this.setState({
			pageInfo: this.state.pageInfo
		});
		this.reqDataFun();
	};
	componentWillReceiveProps(nextProps) {
		let { finbranchRefData2, transtypeRefData2, dateData2, isSearch } = nextProps.searchData;
		this.state.searchData.queryDate = dateData2;
		this.state.searchData.transacttype = transtypeRefData2;
		this.state.searchData.financorganization = finbranchRefData2;
		if (isSearch) {
			this.state.pageInfo.index = 1;
			this.setState({
				searchData: this.state.searchData,
				pageInfo: this.state.pageInfo
			});
			this.reqDataFun();
		}
	}

	componentWillMount() {
		this.reqDataFun();
	}

	render() {
		let { bainfo, fipr, prchange, inchange } = this.state.menu; // 菜单信息
		let { rows, index, allPage, allRows } = this.state.pageInfo; // 分页信息
		let { listArrData } = this.state; // 列表数据
		return (
			<div className='fm_accountoverview'>
				<div className='fm_aco_header'>
					<ul className='move_block'>
						<li
							key={'bainfo'}
							onClick={this.handleMenuClick.bind(this, 'bainfo')}
							className={bainfo ? 'menu_item menuitem_active' : 'menu_item'}
						>
							基本信息
						</li>
						<li
							key={'fipr'}
							onClick={this.handleMenuClick.bind(this, 'fipr')}
							className={fipr ? 'menu_item menuitem_active' : 'menu_item'}
						>
							融资方案
						</li>
						<li
							key={'prchange'}
							onClick={this.handleMenuClick.bind(this, 'prchange')}
							className={prchange ? 'menu_item menuitem_active' : 'menu_item'}
						>
							本金变动情况
						</li>
						<li
							key={'inchange'}
							onClick={this.handleMenuClick.bind(this, 'inchange')}
							className={inchange ? 'menu_item menuitem_active' : 'menu_item'}
						>
							利息变动情况
						</li>
					</ul>
				</div>
				<div className='fm_table_content' onScroll={this.handleScroll}>
					<div className='fm_table'>
						<Table
							emptyText={() => (
								<div>
									<img src={nodataPic} alt='' />
								</div>
							)}
							bordered
							rowKey={'num'}
							size='middle'
							className='bd-table'
							scroll={{ y: 400 }}
							data={listArrData}
							columns={columns}
						/>
					</div>
				</div>
				<div>
					<PageJump
						onChangePageSize={this.handlePageChange}
						onChangePageIndex={this.handlePageIndexChange}
						pageSize={rows}
						activePage={index}
						maxPage={allPage}
						totalSize={allRows}
						pageSizeShow={true}
						pageJumpShow={true}
						maxButtons={5}
					/>
				</div>
			</div>
		);
	}
}
