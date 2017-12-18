/**
 * 基准利率档案
 * majfd
 * 2017/11/4
 */
import React, { Component } from 'react';
import {
	Con,
	Row,
	Col,
	Dropdown,
	Button,
	Table,
	Icon,
	Form,
	FormGroup,
	FormControl,
	Popconfirm,
	Pagination,
	Modal,
	Select,
	InputNumber,
	InputGroup,
	Breadcrumb,
	Label
} from 'tinper-bee';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import DatePicker from 'bee-datepicker';
import moment from 'moment';
import debounce from 'debounce';
import Ajax from '../../../../utils/ajax';
import { numFormat, toast, sum } from '../../../../utils/utils.js';
import BaseRateModal from './BaseRateModal';
import ChangeRateModal from './ChangeRateModal';
import ChangeRecordModal from './ChangeRecordModal';
import Refer from '../../../../containers/Refer';
import NoData from '../../containers/NoData';
import PageJump from '../../../../containers/PageJump';

const PAGE_SIZE = 10;
const FORMAT = 'YYYY-MM-DD HH:mm:ss';
const FORMAT_YMD = 'YYYY-MM-DD';
let operation = 'add';
const rootUrl = window.reqURL.bd + 'bd/rate/';

const Enum = [
	{
		enumkey: 'ratetype',
		enumvalue: [
			{ key: '0', value: 'Libor利率' },
			{ key: '1', value: '贷款利率' },
			{ key: '2', value: '活期利率' },
			{ key: '3', value: '定期利率' }
		]
	}
];

const Option = Select.Option;
let beforeInfo = '';

export default class BaseRate extends Component {
	constructor() {
		super();
		this.state = {
			breads: [],
			dataSource: [],
			columns: [],
			count: 4,
			showModal: false,
			showChange: false,
			showRecord: false,
			pageIndex: 0,
			totalPages: 1,
			totalNums: 0,
			pageSize: 10,
			keyWords: '',
			switch: '',
			modalData: {},
			defaultData: {},
			rateDataSource: [],
			message: ''
		};
	}
	// 当前界面数据
	getTableData = (pageIndex, pageSize, keyWords = '') => {
		const _this = this;
		const page = pageIndex;
		const size = pageSize;
		const searchParams = {
			searchMap: {
				keyWords: keyWords
			}
		};
		Ajax({
			url: rootUrl + 'search',
			data: {
				page,
				size,
				searchParams
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					const head = data.head;
					const newSource = head.rows.map((item, index) => {
						const values = item.values;
						_this.processEnum(values);
						return {
							index: item.rowId,
							id: values.id.value,
							originalid: values.originalid.value,
							code: values.code.value,
							name: values.name.value,
							creator: {
								display: values.creator ? values.creator.display : '', //后台有数据后这里变成display
								value: values.creator.value
							},
							creationtime: values.creationtime.value
								? moment(values.creationtime.value).format(FORMAT_YMD)
								: '',
							ratedays: values.ratedays ? values.ratedays.value : '',
							ratetype: {
								display: values.ratetype ? values.ratetype.display : '',
								value: values.ratetype ? values.ratetype.value : ''
							},
							ratestartdate: {
								value: values.ratestartdate ? values.ratestartdate.value : '',
								display: values.ratestartdate
									? moment(values.ratestartdate.value).format(FORMAT_YMD)
									: ''
							},
							rate: values.rate.value
								? numFormat(values.rate.value, '', parseInt(values.digit.value), ',')
								: 0,
							overdue: values.overdue.value
								? numFormat(values.overdue.value, '', parseInt(values.digit.value), ',')
								: '',
							advance: values.advance.value
								? numFormat(values.advance.value, '', parseInt(values.digit.value), ',')
								: '',
							// rate: values.rate ? values.rate.value : '',
							currtypeid: {
								display: values.currtypeid ? values.currtypeid.display : '',
								value: values.currtypeid ? values.currtypeid.value : values.currtypeid
							},
							revisedate: values.revisedate.value
								? moment(values.revisedate.value).format(FORMAT_YMD)
								: '',
							digit: values.digit ? values.digit.value : '',
							// overdue: values.overdue ? values.overdue.value : '',
							// advance: values.advance ? values.advance.value : '',
							ts: values.ts.value
						};
					});
					const totalNums = head.pageinfo ? head.pageinfo.totalElements : 0;
					const totalPages = head.pageinfo ? head.pageinfo.totalPages : 1;
					_this.setState({
						dataSource: newSource,
						totalPages: totalPages,
						totalNums: totalNums,
						message: ''
					});
				} else {
					toast({ content: message.message, color: 'warning' });
					_this.setState({
						dataSource: [],
						totalPages: 0,
						totalNums: 0,
						message: message.message
					});
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};
	// 枚举值显示处理
	processEnum(value) {
		Enum.map((itemEnum) => {
			if (itemEnum.enumkey === 'ratetype') {
				itemEnum.enumvalue.map((item) => {
					if (item.key == value.ratetype.value) {
						value.ratetype.display = item.value;
					}
				});
			}
		});
		return value;
	}
	columnsData = [
		{ title: '序号', key: 'index', dataIndex: 'index', width: 70 },
		{ title: '利率编码', key: 'code', dataIndex: 'code', width: 100 ,render:(text,record,index)=>{
			return (<Label title={text}>{text}</Label>);
		}},
		{ title: '利率名称', key: 'name', dataIndex: 'name', width: 100 ,render:(text,record,index)=>{
			return (<Label title={text}>{text}</Label>);
		}},
		{ title: '利率类型', key: 'ratetype', dataIndex: 'ratetype.display', width: 80 },
		{ title: '利率天数', key: 'ratedays', dataIndex: 'ratedays', width: 70 },
		{ title: '起效日期', key: 'ratestartdate', dataIndex: 'ratestartdate.display', width: 100 },
		{ title: '币种', key: 'currtypeid', dataIndex: 'currtypeid.display', width: 60 },
		{ title: '利率%', key: 'rate', dataIndex: 'rate', width: 60 },
		{ title: '逾期利率%', key: 'overdue', dataIndex: 'overdue', width: 60 },
		{ title: '提前利率%', key: 'advance', dataIndex: 'advance', width: 60 },
		{ title: '变更日期', key: 'revisedate', dataIndex: 'revisedate', width: 80 },
		{ title: '创建人', key: 'creator', dataIndex: 'creator.display', width: 80 },
		{ title: '创建日期', key: 'creationtime', dataIndex: 'creationtime', width: 80 },
		{
			title: '操作',
			dataIndex: 'operation',
			key: 'operation',
			width: 80,
			render: (text, record, index) => {
				let menu = (
					<Menu multiple onClick={this.changeDone.bind(this, 'change', index, text, record)}>
						<MenuItem key="change">变更</MenuItem>
						<MenuItem key="changerecord">变更记录</MenuItem>
					</Menu>
				);
				return (
					<div>
						{/* 变更 */}
						<Icon
							data-tooltip="变更"
							className="iconfont icon-biangeng icon-style"
							onClick={() => this.changeDone('change', index, text, record)}
						/>
						{/* 变更记录 */}
						<Icon
							data-tooltip="变更记录"
							className="iconfont icon-biangengjilu icon-style"
							onClick={() => this.changeDone('changerecord', index, text, record)}
						/>
					</div>
				);
			}
		}
	];
	// 获取表格 表头数据
	componentDidMount() {
		var _this = this;

		_this.setState({
			columns: this.columnsData
		});

		// 获取页面表格数据
		this.refresh();
	}
	// 变更、变更记录
	onSelectNextOpr = ({ key }) => {
		if (key === 'change') {
			console.log(`${key} selected`);
		} else if (key === 'changeRecod') {
			console.log(`${key} selected`);
		}
		console.log(`${key} selected`);
	};
	// 根据id删除某个条目
	deleteItem(id) {
		Ajax({
			url: rootUrl + 'delete',
			data: {
				list: [ id ]
			},
			success: (res)=> {
				const { data, message, success } = res;
				if (success) {
					toast({ content: '删除成功...', color: 'success' });
					this.getTableData(this.state.pageIndex, this.state.pageSize);
				} else {
					toast({ content: message.message, color: 'warning' });
					this.setState({ message: message });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	}
	// 删除
	onDelete = (text, record, index) => {
		return () => {
			this.deleteItem(record.id);
		};
	};
	// 编辑
	editDone = (opr, index, text, record, e) => {
		operation = opr;
		console.log(opr, index, text, record, e);
		record.ratestartdate = record.ratestartdate.value;
		record.revisedate = record.revisedate ? record.revisedate.value : '';
		record.creationtime = record.creationtime ? record.creationtime.value : '';
		if (opr === 'edit') {
			this.setState({
				showModal: true,
				modalData: { ...record }
			});
		} else if (opr == 'more') {
			//TODO
			console.log(e + '这里有没有change');
		}
		console.log(this.state.modalData);
	};

	//变更
	changeDone = (oper, index, text, record) => {
		const rootUrl = window.reqURL.bd + 'bd/rate/';
		operation = oper;
		if (operation === 'change') {
			record.ratestartdate = record.ratestartdate.value;
			this.setState({
				showChange: true,
				modalData: { ...record }
			});
			console.log(this.modalData);
		} else if (operation == 'changerecord') {
			// 原始版本主键
			let originalid = record.originalid;
			const searchParams = {
				originalid: originalid
			};
			Ajax({
				url: rootUrl + 'reviseDetail',
				data: searchParams,
				success: (res)=> {
					const { data, message, success } = res;
					if (success) {
						const head = data.head;
						const newSource = head.rows.map((item, index) => {
							const values = item.values;
							this.processEnum(values);
							return {
								index: item.rowId,
								id: values.id.value,
								originalid: values.originalid.value,
								code: values.code.value,
								name: values.name.value,
								ratetype: {
									display: values.ratetype ? values.ratetype.display : null,
									value: values.ratetype ? values.ratetype.value : null
								},
								ratestartdate: values.ratestartdate.value
									? moment(values.ratestartdate.value).format(FORMAT_YMD)
									: null,
								rate: values.rate.value
									? numFormat(values.rate.value, '', parseInt(values.digit.value), ',')
									: 0,
								overdue: values.overdue.value
									? numFormat(values.overdue.value, '', parseInt(values.digit.value), ',')
									: '',
								advance: values.advance.value
									? numFormat(values.advance.value, '', parseInt(values.digit.value), ',')
									: '',
								revisedate: values.revisedate.value
									? moment(values.revisedate.value).format(FORMAT_YMD)
									: null,
								version: values.version.value,
								reviser: {
									display: values.reviser ? values.reviser.display : values.reviser,
									value: values.reviser ? values.reviser.value : values.reviser
								}
							};
						});
						this.setState({
							showRecord: true,
							rateDataSource: newSource
						});
					} else {
						toast({ content: message.message, color: 'warning' });
						this.setState({
							showRecord: false,
							rateDataSource: [],
							message: message.message
						});
					}
				},
				error: function(res) {
					toast({ content: res.message, color: 'danger' });
				}
			});
		}
	};

	// 刷新
	refresh = () => {
		this.getTableData(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
	};
	// 模态框
	open = (opr, e) => {
		operation = opr;
		if (operation === 'change') {
			this.setState({
				showChange: true,
				modalData: {}
			});
		} else if (operation === 'changerecord') {
			this.setState({
				showRecord: true,
				modalData: {}
			});
		} else {
			console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
			// moment().format('YYYY-MM-DD HH:mm:ss')
			// const defUrl=rootUrl+'default';
			// const defReq={};
			// // 新增时获取默认值
			// this.axiosRequest(defReq,defUrl);
			this.setState({
				showModal: true,
				modalData: {
					// ...defaultData
					ratetype: {
						value: '1'
					},
					ratedays: '360',
					ratestartdate: moment().format('YYYY-MM-DD HH:mm:ss'),
					// currtypeid: {
					// 	refcode: '',
					// 	refname: '人民币'
					// },
					digit: '2'
				}
			});
		}
	};
	// 取消按钮关闭弹框
	closeModel = (type) => {
		operation = type;
		if (operation === 'change') {
			this.setState({
				showChange: false
			});
		} else if (operation === 'changerecord') {
			this.setState({
				showRecord: false
			});
		} else if (operation === 'cancel') {
			this.setState({
				showModal: false,
				showRecord: false,
				showChange: false
			});
		} else {
			this.setState({
				showModal: false
			});
		}
	};
	// 搜索
	searchByKeywords = (pageIndex = 0, pageSize, keyWords) => {
		this.setState({
			pageIndex: 0
		});
		this.getTableData(pageIndex, pageSize, keyWords);
	};
	// 搜索
	handleSearchChange = (e) => {
		this.setState(
			{
				keyWords: e.target.value
			},
			() => {
				this.searchByKeywords(0, this.state.pageSize, this.state.keyWords);
			}
		);
	};
	// 搜索
	handleSearch = () => {
		this.searchByKeywords(0, this.state.pageSize, this.state.keyWords);
	};
	// 分页
	handleChangePageSize = (pageSize) => {
		let num = parseInt(pageSize, 10);
		this.setState(
			{
				//点击分页时，当前页都跳转到第1页
				pageIndex: 0,
				pageSize
			},
			() => {
				this.refresh();
			}
		);
	};
	// 分页点击
	handleSelect = (index) => {
		this.setState(
			{
				pageIndex: index - 1
			},
			() => {
				this.getTableData(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
			}
		);
	};
	beforeSubmitCheck(
		code,
		name,
		ratedays,
		ratetype,
		ratestartdate,
		rate,
		currtypeid,
		enable,
		digit,
		overdue,
		advance
	) {
		if (typeof code == 'undefined' || code === '') {
			beforeInfo = '请输入编码';
			return true;
		}

		if (typeof name == 'undefined' || name === '') {
			beforeInfo = '请输入名称';
			return true;
		}
		if (!(currtypeid && currtypeid.value && currtypeid.display)) {
			beforeInfo = '请输入币种';
			return true;
		}
		if (typeof ratetype == 'undefined' || ratetype === '' || ratetype == null) {
			beforeInfo = '请输入利率类型';
			return true;
		}
		if (typeof rate == 'undefined' || rate === '' || rate == null) {
			beforeInfo = '请输入利率';
			return true;
		}
		if (typeof ratestartdate == 'undefined' || ratestartdate === '' || ratestartdate == null) {
			beforeInfo = '请输入利率起效日期';
			return true;
		}
		if (typeof digit == 'undefined' || digit === '' || digit == null) {
			beforeInfo = '请输入利率精度';
			return true;
		}
		return false;
	}
	// 确定保存按钮
	handleSubmit = (newData, opre) => {
		const _this = this;
		console.log('操作:');
		console.log(opre);
		console.log(newData);
		let {
			id,
			code,
			name,
			ratedays,
			ratetype,
			ratestartdate,
			rate,
			currtypeid,
			enable,
			digit,
			overdue,
			advance,
			originalid,
			ts
		} = newData;
		let ret = this.beforeSubmitCheck(
			code,
			name,
			ratedays,
			ratetype,
			ratestartdate,
			rate,
			currtypeid,
			enable,
			digit,
			overdue,
			advance
		);
		if (ret) {
			toast({ content: beforeInfo, color: 'warning' });
			return;
		}
		const precison = parseInt(digit);
		// 新增
		if (opre == 'add') {
			const data = {
				head: {
					rows: [
						{
							status: 2,
							values: {
								code: { value: code },
								name: { value: name },
								ratedays: {
									value: parseInt(ratedays)
								},
								ratetype: {
									value: ratetype ? parseInt(ratetype) : null
								},
								ratestartdate: { value: moment(ratestartdate).format(FORMAT) },
								rate: {
									value: rate ? parseFloat(rate).toFixed(precison) : null
								},
								currtypeid: currtypeid,
								digit: {
									value: parseInt(digit)
								},
								overdue: {
									value: overdue ? parseFloat(overdue).toFixed(precison) : null
								},
								advance: {
									value: advance ? parseFloat(advance).toFixed(precison) : null
								}
							}
						}
					]
				}
			};
			const param = { data };
			const url = rootUrl + 'save';
			_this.request(url, param);
			_this.setState({
				showModal: false
			});
		}
		// 修改
		if (opre == 'edit') {
			const data = {
				head: {
					rows: [
						{
							status: 1,
							values: {
								id: { value: id },
								code: { value: code },
								name: { value: name },
								ratedays: { value: parseInt(ratedays) },
								ratetype: { value: parseInt(ratetype) },
								ratestartdate: { value: moment(ratestartdate).format(FORMAT) },
								rate: { value: parseFloat(rate).toFixed(precison) },
								digit: { value: parseInt(digit) },
								overdue: { value: overdue ? parseFloat(overdue).toFixed(precison) : null },
								advance: { value: advance ? parseFloat(advance).toFixed(precison) : null },
								currtypeid: currtypeid,
								originalid: { value: originalid },
								ts: { value: ts }
							}
						}
					]
				}
			};
			const param = { data };
			const url = rootUrl + 'save';
			_this.request(url, param);
			_this.setState({
				showModal: false
			});
		}
		// 变更
		if (opre == 'change') {
			const data = {
				head: {
					rows: [
						{
							status: 1,
							values: {
								id: { value: id },
								ratestartdate: { value: moment(ratestartdate).format(FORMAT) },
								rate: { value: rate },
								overdue: { value: overdue ? parseFloat(overdue).toFixed(precison) : null },
								advance: { value: advance ? parseFloat(advance).toFixed(precison) : null },
								ts: { value: ts }
							}
						}
					]
				}
			};
			const param = { data };
			const url = rootUrl + 'revise';
			_this.request(url, param);
			//确认后关闭窗口
			_this.setState({
				showChange: false
			});
		}
	};

	request = (url, param) => {
		const _this = this;
		Ajax({
			url: url,
			data: param,
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					_this.getTableData(_this.state.pageIndex, _this.state.pageSize);
				} else {
					toast({ content: message.message, color: 'warning' });
					_this.setState({ message: message });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};

	render() {
		let {
			breads,
			tabs,
			dataSource,
			columns,
			totalPages,
			totalNums,
			pageSize,
			pageIndex,
			showModal,
			showChange,
			showRecord,
			modalData,
			rateDataSource
		} = this.state;
		//添加序号
		dataSource = dataSource.map((e, i) => {
			return {
				...e,
				index: i + 1
			};
		});
		rateDataSource = rateDataSource.map((e, j) => {
			return {
				...e,
				index: j + 1
			};
		});
		return (
			<div className="bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">基础档案</Breadcrumb.Item>
					<Breadcrumb.Item active>利率管理</Breadcrumb.Item>
				</Breadcrumb>
				<div className="bd-header">
					<div className="bd-title-1">利率管理</div>
					<Button colors="primary" className="btn-2" onClick={this.open.bind(this, 'add')}>
						新增
					</Button>

					<InputGroup simple className="search-box fr">
						<FormControl
							value={this.state.keyWords}
							onChange={this.handleSearchChange}
							placeholder="搜索名称"
						/>
						<InputGroup.Button shape="border">
							<span className="uf uf-search" onClick={this.handleSearch} />
						</InputGroup.Button>
					</InputGroup>
				</div>

				<Table
					emptyText={NoData}
					bordered
					data={dataSource}
					columns={columns}
					className="bd-table"
					rowKey={'id'}
				/>

				{Boolean(totalNums) && (
					<PageJump
						onChangePageSize={this.handleChangePageSize}
						onChangePageIndex={this.handleSelect}
						totalSize={totalNums}
						activePage={pageIndex + 1}
						maxPage={totalPages}
						pageSize={pageSize}
					/>
				)}

				{showModal && (
					<BaseRateModal
						showModal={showModal}
						opre={operation}
						modalData={modalData}
						onClick={this.closeModel}
						onRefresh={this.refresh}
						onSubmit={this.handleSubmit}
					/>
				)}
				{showChange && (
					<ChangeRateModal
						showModal={showChange}
						opre={operation}
						modalData={modalData}
						onClick={this.closeModel}
						onRefresh={this.refresh}
						onSubmit={this.handleSubmit}
					/>
				)}
				{showRecord && (
					<ChangeRecordModal
						showModal={showRecord}
						opre={operation}
						modalData={modalData}
						rateDataSource={rateDataSource}
						onClick={this.closeModel}
						onRefresh={this.refresh}
					/>
				)}
			</div>
		);
	}
}
