import React, { Component } from 'react';
import { Row, Col, Table, Button, FormControl, Select, Popconfirm } from 'tinper-bee';
import moment from 'moment';
import { hashHistory } from 'react-router';
import Tabs, { TabPane } from 'bee-tabs';
import DatePicker from 'bee-datepicker';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import Ajax from '../../../../utils/ajax.js';
import Refer from '../../../../containers/Refer';
import PageJump from '../../../../containers/PageJump';
import { numFormat, toast } from '../../../../utils/utils.js';
import AccountOverview from '../fm_accountoverview';
import './index.less';
import nodataPic from '../../../../static/images/nodata.png';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { RangePicker } = DatePicker;
const format = 'YYYY-MM-DD';
const URL = window.reqURL.fm;
const toDay = moment().format(format);
const columns = [
	{
		title: '序号',
		dataIndex: 'num',
		key: 'num'
	},
	{
		title: '合同编号',
		dataIndex: 'contractcode',
		key: 'contractcode'
	},
	{
		title: '交易类型',
		dataIndex: 'transacttype',
		key: 'transacttype'
	},
	{
		title: '交易事件',
		dataIndex: 'event',
		key: 'event'
	},
	{
		title: '放款编号',
		dataIndex: 'loancode',
		key: 'loancode'
	},
	{
		title: '放款金额',
		dataIndex: 'loanmny',
		key: 'loanmny'
	},
	{
		title: '日期',
		dataIndex: 'date',
		key: 'date'
	},
	{
		title: '未还本金',
		dataIndex: 'unRepaymnyAll',
		key: 'unRepaymnyAll'
	},
	{
		title: '已付利息',
		dataIndex: 'interestmny',
		key: 'interestmny'
	},
	{
		title: '未付利息',
		dataIndex: 'unInterestmnyAll',
		key: 'unInterestmnyAll'
	},
	{
		title: '还款编号',
		dataIndex: 'repaycode',
		key: 'repaycode'
	},
	{
		title: '已还本金',
		dataIndex: 'repaymny',
		key: 'repaymny'
	},

	{
		title: '付费编号',
		dataIndex: 'paymentcode',
		key: 'paymentcode'
	},
	{
		title: '已付手续费',
		dataIndex: 'cost',
		key: 'cost'
	}
];
export default class FinanceLedger extends Component {
	constructor() {
		super();
		this.state = {
			tabIndex: '1',
			searchData1: {
				transtypeRefData1: {}, // 交易类型
				// finorgRefData1: {},
				dateData1: undefined, // 日期
				contractData1: undefined, // 合同编号
				loannumData1: undefined // 放款编号
			},
			searchData2: {
				dateData2: undefined,
				finbranchRefData2: {},
				transtypeRefData2: {},
				isSearch: false
			},
			pageInfo: {
				rows: 10, // 每页多少行
				index: 1, // 当前第几页
				allPage: 0, // 总页数
				allRows: 0 // 总条数
			},
			keyWords: '', //模糊查询关键字
			dataList: [],
			contractcodes: [], // 合同编号下拉数据
			loancodes: [] // 放款编号下拉数据
		};
	}

	// 请求数据
	reqDataFun = () => {
		let { rows, index, allPage, allRows } = this.state.pageInfo;
		let { transtypeRefData1, dateData1, contractData1, loannumData1 } = this.state.searchData1;
		if (contractData1 === undefined) {
			contractData1 = '';
		}
		if (loannumData1 === undefined) {
			loannumData1 = '';
		}
		if (dateData1 === undefined) {
			dateData1 = '';
		} else {
			dateData1 = dateData1.format(format);
		}
		if (transtypeRefData1.refpk === undefined) {
			transtypeRefData1.refpk = '';
		}
		const _this = this;
		Ajax({
			url: URL + 'fm/bills/detailslist',
			data: {
				page: index - 1 + '', //当前页
				size: rows + '', //每页条数
				transacttype: transtypeRefData1.refpk, //交易类型
				contractcode: contractData1, //合同编号
				querydate: dateData1, //日期
				loancode: loannumData1, //放款编号
				event: '-1' //交易事件 -1全部 0-放款   1-还本 2-付息 3-付费
			},
			success: function(res) {
				if (res.success) {
					if (res.data) {
						let resData = res.data.head;
						let list = [];
						resData.rows.map((item, index) => {
							let itemData = item.values;
							let listItem = {};
							for (let child in itemData) {
								listItem[child] = itemData[child].value;
							}
							listItem.num = index + 1;
							list.push(listItem);
						});
						let { number, numberOfElements, size, totalElements, totalPages } = resData.pageinfo;
						_this.state.pageInfo.allPage = totalPages;
						_this.state.pageInfo.allRows = totalElements;
						_this.setState({
							dataList: list,
							pageInfo: _this.state.pageInfo
						});
					} else {
						_this.state.pageInfo.allPage = 0;
						_this.state.pageInfo.allRows = 0;
						_this.setState({
							dataList: [],
							pageInfo: _this.state.pageInfo
						});
					}
				}
			}
		});
	};
	// 页码选择
	handlePageIndexChange = (pageIndex) => {
		this.state.pageInfo.index = pageIndex;
		this.setState({
			pageInfo: this.state.pageInfo
		});
		this.reqDataFun();
	};

	//页数量选择
	handlePageChange = (value) => {
		this.state.pageInfo.rows = value;
		this.state.pageInfo.index = 1;
		this.setState({
			pageInfo: this.state.pageInfo
		});
		this.reqDataFun();
	};
	// 查询按钮
	handleSearchClick = (source) => {
		if (typeof source === 'string') {
			if (source === 'searchData1') {
				this.state.pageInfo.index = 1;
				this.reqDataFun();
			} else {
				this.state.searchData2.isSearch = true;
				this.setState({
					searchData2: this.state.searchData2
				});
			}
		}
	};
	// 重置按钮
	handleSearchReset = (source) => {
		if (typeof source === 'string') {
			let searchData = this.state[source];
			for (let item in searchData) {
				if (typeof searchData[item] === 'string') {
					if (item === 'contractData1' || item === 'loannumData1') {
						this.state[source][item] = undefined;
					} else {
						this.state[source][item] = '';
					}
				}
				if (typeof searchData[item] === 'object') {
					if (item === 'dateData1' || item === 'dateData2') {
						this.state[source][item] = undefined;
					}
					if (item === 'transtypeRefData1' || item === 'finbranchRefData2' || item === 'transtypeRefData2') {
						this.state[source][item] = {};
					}
				}
			}
			this.state.pageInfo.index = 1;
			if (source === 'searchData1') {
				this.setState({
					searchData1: this.state.searchData1,
					pageInfo: this.state.pageInfo
				});
				this.reqDataFun();
			} else {
				this.state.searchData2.isSearch = true;
				this.setState({
					searchData2: this.state.searchData2
				});
			}
			console.log(this.state[source]);
		}
	};
	// 页签切换
	handleTabChange = (key) => {
		const _this = this;
		this.state.pageInfo.rows = 10;
		this.state.pageInfo.index = 1;
		if (key === '1') {
			this.state.searchData2.isSearch = false;
			this.setState({
				pageInfo: this.state.pageInfo,
				searchData2: this.state.searchData2
			});
			this.reqDataFun();
		}
		this.setState({
			tabIndex: key
		});
	};
	// 下拉内容响应数据整理
	resSelectDataFun = (reqData) => {
		let name = reqData.selectName;
		const _this = this;
		Ajax({
			url: URL + reqData.url,
			data: reqData.data,
			success: function(res) {
				if (res.success) {
					if (name === 'contractcodes') {
						_this.setState({
							contractcodes: res[name]
						});
					} else if (name === 'loancodes') {
						_this.setState({
							loancodes: res[name]
						});
					}
				}
			}
		});
	};
	componentWillMount() {
		this.handleTabChange('1');
	}
	render() {
		let { keyWords, dataList, tabIndex, contractcodes, loancodes } = this.state;
		let { rows, index, allPage, allRows } = this.state.pageInfo;
		let { transtypeRefData1, dateData1, contractData1, loannumData1 } = this.state.searchData1;
		let { finbranchRefData2, transtypeRefData2, dateData2 } = this.state.searchData2;

		return (
			<div className='fm-financeledger'>
				{tabIndex === '1' ? (
					<div className='search-content'>
						{/* <div className='search-item width-120'>
							<Refer
								ctx={'/uitemplate_web'}
								refModelUrl={'/bd/finorgRef/'}
								refCode={'finorgRef'}
								refName={'财务组织'}
								placeholder={'财务组织'}
								value={finorgRefData1}
								onChange={(value) => {
									let { refname, refpk, refcode } = value;
									finorgRefData1.refname = refname;
									finorgRefData1.refpk = refpk;
									finorgRefData1.refcode = refcode;
									this.setState({
										searchData1: this.state.searchData1
									});
								}}
							/>
						</div> */}
						<div className='search-item width-120'>
							<Refer
								ctx={'/uitemplate_web'}
								refModelUrl={'/bd/transtypeRef/'}
								refCode={'transtypeRef'}
								placeholder={'交易类型'}
								refName={'交易类型'}
								value={transtypeRefData1}
								onChange={(value) => {
									let { refname, refpk, refcode } = value;
									transtypeRefData1.refname = refname;
									transtypeRefData1.refpk = refpk;
									transtypeRefData1.refcode = refcode;
									this.setState({
										searchData1: this.state.searchData1
									});
								}}
								clientParam={{
									maincategory: 2 //1234对应投资品种、融资品种、费用项目、银行交易项目
								}}
								multiLevelMenu={[
									{
										name: [ '交易大类' ],
										code: [ 'refname' ]
									},
									{
										name: [ '交易类型' ],
										code: [ 'refname' ]
									}
								]}
							/>
						</div>
						<div className='search-item width-120'>
							<Select
								showSearch
								placeholder='合同编号'
								optionFilterProp='children'
								onSelect={(value) => {
									this.state.searchData1.contractData1 = value;
									this.setState({
										searchData1: this.state.searchData1
									});
								}}
								value={contractData1}
								onSearch={(value) => {
									if (value.length > 0) {
										this.resSelectDataFun({
											url: 'fm/bills/contractcodelist',
											data: {
												contractcode: value
											},
											selectName: 'contractcodes'
										});
									}
								}}
							>
								{contractcodes ? (
									contractcodes.map((item, index) => {
										return <Option value={item}>{item}</Option>;
									})
								) : null}
							</Select>
						</div>
						<div className='search-item width-120'>
							<DatePicker
								format={format}
								onSelect={(d) => {
									this.state.searchData1.dateData1 = d;
									this.setState({
										searchData1: this.state.searchData1
									});
								}}
								value={dateData1}
								onChange={(d) => {}}
								locale={zhCN}
								renderIcon={()=>(<i className='iconfont icon-rili'/>)}
								placeholder='日期'
							/>
						</div>
						<div className='search-item width-120'>
							<Select
								showSearch
								placeholder='放款编号'
								optionFilterProp='children'
								onSelect={(value) => {
									this.state.searchData1.loannumData1 = value;
									this.setState({
										searchData1: this.state.searchData1
									});
								}}
								value={loannumData1}
								onSearch={(value) => {
									if (value.length > 0) {
										this.resSelectDataFun({
											url: 'fm/bills/loancodelist',
											data: {
												loancode: value
											},
											selectName: 'loancodes'
										});
									}
								}}
							>
								{loancodes ? (
									loancodes.map((item, index) => {
										return <Option value={item}>{item}</Option>;
									})
								) : null}
							</Select>
						</div>
						<Button
							className='search-button search-item'
							onClick={this.handleSearchClick.bind(this, 'searchData1')}
						>
							查询
						</Button>
						<div
							className='search-item search-reset'
							onClick={this.handleSearchReset.bind(this, 'searchData1')}
						>
							重置
						</div>
					</div>
				) : (
					<div className='search-content'>
						<div className='search-item width-120'>
							<Refer
								ctx={'/uitemplate_web'}
								refModelUrl={'/bd/finbranchRef/'}
								refCode={'finbranchRef'}
								refName={'金融网点'}
								placeholder={'融资机构'}
								value={finbranchRefData2}
								onChange={(value) => {
									let { refname, refpk, refcode } = value;
									finbranchRefData2.refname = refname;
									finbranchRefData2.refpk = refpk;
									finbranchRefData2.refcode = refcode;
									this.state.searchData2.isSearch = false;
									this.setState({
										searchData2: this.state.searchData2
									});
								}}
								multiLevelMenu={[
									{
										name: [ '金融机构' ],
										code: [ 'refname' ]
									},
									{
										name: [ '金融网点' ],
										code: [ 'refname' ]
									}
								]}
							/>
						</div>
						<div className='search-item width-120'>
							<DatePicker
								format={format}
								onSelect={(d) => {
									this.state.searchData2.dateData2 = d;
									this.state.searchData2.isSearch = false;
									this.setState({
										searchData2: this.state.searchData2
									});
								}}
								value={dateData2}
								onChange={(d) => {}}
								locale={zhCN}
								renderIcon={()=>(<i className='iconfont icon-rili'/>)}
								placeholder='日期'
							/>
						</div>
						<div className='search-item width-120'>
							<Refer
								ctx={'/uitemplate_web'}
								refModelUrl={'/bd/transtypeRef/'}
								refCode={'transtypeRef'}
								refName={'交易类型'}
								placeholder='交易类型'
								value={transtypeRefData2}
								onChange={(value) => {
									let { refname, refpk, refcode } = value;
									transtypeRefData2.refname = refname;
									transtypeRefData2.refpk = refpk;
									transtypeRefData2.refcode = refcode;
									this.state.searchData2.isSearch = false;
									this.setState({
										searchData2: this.state.searchData2
									});
								}}
								clientParam={{
									maincategory: 1 //1234对应投资品种、融资品种、费用项目、银行交易项目
								}}
								multiLevelMenu={[
									{
										name: [ '交易大类' ],
										code: [ 'refname' ]
									},
									{
										name: [ '交易类型' ],
										code: [ 'refname' ]
									}
								]}
								referFilter={{
									type: 'loan' //是贷款时加这个
								}}
							/>
						</div>
						<Button
							className='search-button search-item'
							onClick={this.handleSearchClick.bind(this, 'searchData2')}
						>
							查询
						</Button>
						<div
							className='search-item search-reset'
							onClick={this.handleSearchReset.bind(this, 'searchData2')}
						>
							重置
						</div>
					</div>
				)}
				<Tabs defaultActiveKey='1' onChange={this.handleTabChange}>
					<TabPane tab='融资台账明细' key='1'>
						<div className='fm-financeledger-table1'>
							<Table
								bordered
								columns={columns}
								data={dataList}
								rowKey={'num'}
								emptyText={() => (
									<div>
										<img src={nodataPic} alt='' />
									</div>
								)}
								className='bd-table'
							/>
						</div>
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
					</TabPane>
					<TabPane tab='融资台账总览' key='2'>
						{tabIndex === '2' ? <AccountOverview searchData={this.state.searchData2} /> : null}
					</TabPane>
				</Tabs>
			</div>
		);
	}
}
