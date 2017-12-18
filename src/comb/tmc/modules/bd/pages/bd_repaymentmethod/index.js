import React, { Component } from 'react';
import {
	Breadcrumb,
	Con,
	Row,
	Col,
	Dropdown,
	Button,
	Table,
	Icon,
	FormControl,
	Popconfirm,
	Pagination,
	Modal,
	Select,
	InputGroup,
	FormGroup,
	Label
} from 'tinper-bee';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import Ajax from '../../../../utils/ajax';
import { numFormat, toast, sum } from '../../../../utils/utils.js';
import Formrepaymentmethod from '../../containers/Formrepaymentmethod/';
import ModifyRecord from '../../containers/ModifyRecord';
import moment from 'moment';
import NoData from '../../containers/NoData';
import PageJump from '../../../../containers/PageJump';

const rootUrl = window.reqURL.bd + 'bd/repaymentmethod/';

//默认是新增
let operation = 'add';
//    项目类型编码： code
//   还款方式名称：name
//   还本方式：repaycosttype
//   付息方式：repayinteresttype

//还本期间：   repaycostperiod             付息期间：        repayinterestperiod
//还本开始日期:　　repaycostbegindate　　　　　　　  付息开始日期：  repayinterestbegindate
//  创建人:  creator                创建日期:creationtime
//     备注：remarks
//  变更
let dataSource = [];

const Enum = [
	{
		enumkey: 'repaycosttype',
		enumvalue: [
			{ key: '1', value: '日' },
			{ key: '2', value: '月' },
			{ key: '3', value: '季度' },
			{ key: '4', value: '半年' },
			{ key: '5', value: '年' },
			{ key: '6', value: '到期一次还本' }
		]
	},
	{
		enumkey: 'repayinteresttype',
		enumvalue: [
			{ key: '1', value: '日' },
			{ key: '2', value: '月' },
			{ key: '3', value: '季度' },
			{ key: '4', value: '半年' },
			{ key: '5', value: '年' },
			{ key: '6', value: '到期一次付息' },
			{ key: '7', value: '利随本清' }
		]
	}
];

let i = 3;
let j = 0;
export default class repaymentmethod extends Component {
	constructor() {
		super();
		this.state = {
			columns: [
				{ title: '序号', dataIndex: 'index', key: 'index', width: 30 },
				{ title: '编码', dataIndex: 'code', key: 'code', width: 80,render:(text,record,index)=>{
					return (<Label title={text}>{text}</Label>);
				}},
				{ title: '名称', dataIndex: 'name', key: 'name', width: 80,render:(text,record,index)=>{
					return (<Label title={text}>{text}</Label>);
				}},
				{ title: '还本方式', dataIndex: 'repaycosttype', key: 'repaycosttype', width: 50 },
				{ title: '付息方式', dataIndex: 'repayinteresttype', key: 'repayinteresttype', width: 50 },
				{ title: '还本期间', dataIndex: 'repaycostperiod', key: 'repaycostperiod', width: 50 },
				{ title: '付息期间', dataIndex: 'repayinterestperiod', key: 'repayinterestperiod', width: 50 },
				// { title: '还本开始日期', dataIndex: 'repaycostbegindate', key: 'repaycostbegindate', width: 60 },
				// { title: '付息开始日期', dataIndex: 'repayinterestbegindate', key: 'repayinterestbegindate', width: 60 },
				{ title: '创建人', dataIndex: 'creator', key: 'creator', width: 50 },
				{ title: '创建日期', dataIndex: 'creationtime', key: 'creationtime.display', width: 50 },
				// {/*{
				// 	title: '操作',
				// 	dataIndex: 'operation',
				// 	key: 'operation',
				// 	width: 50,
				// 	render: (text, record, index) => {
				// 		let menu = (
				// 			<Menu multiple onClick={(e) => this.changeDone(index, text, record, e)}>
				// 				<MenuItem key="change">变更</MenuItem>
				// 				<MenuItem key="changerecord">变更记录</MenuItem>
				// 			</Menu>
				// 		);
				// 		return (
				// 			<div>*/}
				// 				{/* <Icon
				// 					className="iconfont icon-bianji icon-style"
				// 					onClick={(e) => this.editDone('edit', index, text, record, e)}
				// 				/> */}
				// 				{/* 变更 */}
				// 				{/**
				// 				 * 需求变更，还款方式不进行变更
				// 				 */}
				// 				{/*<Icon
				// 					data-tooltip="变更"
				// 					className="iconfont icon-biangeng icon-style"
				// 					onClick={() => this.changeDone('change',index, text, record)}
				// 					/>*/}
				// 				{/* 变更记录 */}
				// 				{/*
				// 				<Icon
				// 					data-tooltip="变更记录"
				// 					className="iconfont icon-biangengjilu icon-style"
				// 					onClick={() => this.changeDone('changerecord',index, text, record)}
				// 					/>*/}
				// 				{/* <Popconfirm
				// 					placement="left"
				// 					content="确认删除?"
				// 					onClose={this.onDelete(text, record, index)}
				// 				>
				// 					<Icon className="iconfont icon-shanchu icon-style" />
				// 				</Popconfirm> */}
				// 				{/* <Dropdown trigger={[ 'hover' ]} overlay={menu} animation="slide-up">
				// 					<Icon className="iconfont icon-gengduo edit-icon" />
				// 				</Dropdown> */}
				// 			{/*</div>
				// 		);
				// 	}
				// }*/}
			],
			count: 4,
			showModifyModal: false, //变更模态框
			showModifyRecord: false, //变更记录模态框
			modalData: {},
			dataSource: [],
			breads: [],
			modifyRecord: [],
			modalSize: '',
			pageIndex: 0,
			totalPages: 1,
			totalNums: 0,
			pageSize: 10,
			keyWords: '',
			switch: '',
			message: ''
		};
	}

	closeModifyRecord = () => {
		this.setState({ showModifyRecord: false });
	};
	getTableData = (pageIndex, pageSize,keywords = '') => {
		const _this = this;
		const page = pageIndex;
		const size = pageSize;
		const searchParams = {
			searchMap: {
				keyWords: keywords
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
						if (item.values) {
							_this.processEnum(values);
						}
						return {
							index: j++,
							id: values.id.value,
							code: values.code.value,
							repaycostbegindate: values.repaycostbegindate.value,
							repayinteresttype: values.repayinteresttype.value,
							repaycosttype: values.repaycosttype.value,
							repayinterestperiod: values.repayinterestperiod.value,
							repayinterestbegindate: values.repayinterestbegindate.value,
							repaycostperiod: values.repaycostperiod.value,
							name: values.name.value,
							creator: values.creator.value, //这里后台有数据后要显示为display
							creationtime: moment(values.creationtime.value).format('YYYY-MM-DD'),
							originalid: values.originalid.value,
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
			if (itemEnum.enumkey === 'repaycosttype') {
				itemEnum.enumvalue.map((item) => {
					if (item.key == value.repaycosttype.value) {
						value.repaycosttype.value = item.value;
					}
				});
			}
			if (itemEnum.enumkey === 'repayinteresttype') {
				itemEnum.enumvalue.map((item) => {
					if (item.key == value.repayinteresttype.value) {
						value.repayinteresttype.value = item.value;
					}
				});
			}
		});
		return value;
	}

	//更新数据
	refresh = () => {
		this.getTableData(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
	};

	//请求表格数据
	componentDidMount() {
		this.refresh();
	}

	//点击新增按钮打开模态框
	// |字段           |类型         |是否必须 |     说明
	// |--------------|-------------|---------|--------------|
	// | code         | String      |   是 |   利率编码|
	// | name     | String      |   是 |   还款方式名称|
	// | repaycosttype         | String      |   是 |  还本方式   按年月日，半年，季度|
	// | repayinteresttype     | String      |   是 |  付息方式   按年月日，半年，季度|
	// | repaycostperiod         | Number      |   是 |   还本期间|
	// | repayinterestperiod         | Number      |是 |   付息期间|
	// | interestday      | date      |   是 |  结息日 日期类型|
	// | repaycostbegindate          | date      |   是 |  还本开始日期 |
	// | repayinterestbegindate   | date      |   是 |   付息开始日期|
	// | creator         | String      |   是 |   创建人|
	// | creationtime     | date      |   是 |   创建日期|

	open = (opr, e) => {
		operation = opr;
		this.setState({
			showModifyModal: true,
			modalData: {}
		});
	};

	//点击修改按钮，打开模态框   修改模态框
	editDone = (opr, index, text, record, e) => {
		operation = opr;
		// this.processEnum(record);
		Enum.map((itemEnum) => {
			if (itemEnum.enumkey === 'repaycosttype') {
				itemEnum.enumvalue.map((item) => {
					if (item.value == record.repaycosttype) {
						record.repaycosttype = item.key;
					}
				});
			}
			if (itemEnum.enumkey === 'repayinteresttype') {
				itemEnum.enumvalue.map((item) => {
					if (item.value == record.repayinteresttype) {
						record.repayinteresttype = item.key;
					}
				});
			}
		});
		if (opr === 'edit') {
			this.setState({
				showModifyModal: true,
				modalData: { ...record } //该行数据
			});
		}
	};

	// 点击变更和变更记录，显示对应的模态框
	changeDone = (opr,index, text, record) => {
		operation = opr;
		if (operation === 'change') {
			Enum.map((itemEnum) => {
				if (itemEnum.enumkey === 'repaycosttype') {
					itemEnum.enumvalue.map((item) => {
						if (item.value == record.repaycosttype) {
							record.repaycosttype = item.key;
						}
					});
				}
				if (itemEnum.enumkey === 'repayinteresttype') {
					itemEnum.enumvalue.map((item) => {
						if (item.value == record.repayinteresttype) {
							record.repayinteresttype = item.key;
						}
					});
				}
			});
			//变更
			this.setState({
				showModifyModal: true,
				modalData: { ...record } //该行数据
			});
		} else if (operation == 'changerecord') {
			//变更记录
			this.queryModifyRecord(record.originalid);
			this.setState({
				showModifyRecord: true
			});
		}
	};

	//查询变更记录
	queryModifyRecord = (originalid) => {
		const _this = this;
		const searchParams = {
			originalid: originalid
		};
		Ajax({
			url: rootUrl + 'reviseDetail',
			data: searchParams,
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					const head = data.head;
					const modifyRecordData = head.rows.map((item, index) => {
						let values = item.values;
						if (item.values) {
							values = _this.processEnum(values);
						}
						return {
							code: values.code.value,
							name: values.name.value,
							creator: values.creator.value, //这里后台有数据后要显示为display
							creationtime: values.creationtime.value && values.creationtime.value.substring(0, 10),
							version: values.version ? values.version.value : null,
							revisedate:
								values.revisedate &&
								values.revisedate.value &&
								values.revisedate.value.substring(0, 10),
							reviser: values.reviser ? values.reviser.value : null,
							repayinteresttype: values.repayinteresttype ? values.repayinteresttype.value : null,
							repaycosttype: values.repaycosttype ? values.repaycosttype.value : null,
							repayinterestperiod: values.repayinterestperiod ? values.repayinterestperiod.value : null,
							repaycostperiod: values.repaycostperiod ? values.repaycostperiod.value : null
						};
					});
					// console.log('查询到的变更记录', modifyRecordData);
					_this.setState({
						modifyRecord: modifyRecordData
					});
				} else {
					toast({ content: message.message, color: 'warning' });
					_this.setState({
						modifyRecord: [],
						message: message.message
					});
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};

	// 根据id删除某个条目
	deleteItem(id, index) {
		const _this = this;
		Ajax({
			url: rootUrl + 'delete',
			data: {
				list: [ id ]
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					toast({ content: '删除成功...', color: 'success' });
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
	}
	onDelete = (text, record, index) => {
		return () => {
			this.deleteItem(record.id, index);
			this.getPrevPage();
		};
	};

	//点击取消关闭模态框
	close = (type) => {
		operation = type;
		this.setState({
			showModifyModal: false
		});
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

	//点击模态框确定按钮，保存数据
	handleSubmit = (newData, opre) => {
		const _this = this;
		let {
			id,
			code,
			name,
			repaycosttype,
			creator,
			creationtime,
			repaycostperiod,
			repayinterestbegindate,
			repaycostbegindate,
			repayinterestperiod,
			repayinteresttype,
			remarks,
			originalid,
			ts
		} = newData;
		if (typeof code == 'undefined' || code == '') {
			toast({ content: '请输入还款方式编码', color: 'warning' });
			return;
		}
		if (typeof name == 'undefined' || name == '') {
			toast({ content: '请输入还款方式名称', color: 'warning' });
			return;
		}
		if (typeof repaycosttype == 'undefined' || repaycosttype === '' || repaycosttype === null) {
			toast({ content: '请选择还本方式', color: 'warning' });
			return;
		}
		if (typeof repayinteresttype == 'undefined' || repayinteresttype === '' || repayinteresttype === null) {
			toast({ content: '请选择付息方式', color: 'warning' });
			return;
		}
		if (repaycosttype !== '6') {
			if (typeof repaycostperiod == 'undefined' || repaycostperiod === '') {
				toast({ content: '请输入还本期间', color: 'warning' });
				return;
			}
		} else {
			repaycostperiod = null;
		}
		if (repayinteresttype !== '6' && repayinteresttype !== '7') {
			if (typeof repayinterestperiod == 'undefined' || repayinterestperiod === '') {
				toast({ content: '请选择付息期间', color: 'warning' });
				return;
			}
		} else {
			repayinterestperiod = null;
		}

		//新增一行数据
		if (opre == 'add') {
			const data = {
				head: {
					rows: [
						{
							status: 2,
							values: {
								code: { value: code },
								name: { value: name },
								remarks: { value: remarks },
								repaycostbegindate: {
									value: repaycostbegindate || moment().format('YYYY-MM-DD HH:mm:ss')
								},
								repayinteresttype: { value: repayinteresttype },
								repaycosttype: { value: repaycosttype },
								repayinterestperiod: { value: repayinterestperiod },
								repayinterestbegindate: {
									value: repayinterestbegindate || moment().format('YYYY-MM-DD HH:mm:ss')
								},
								repaycostperiod: { value: repaycostperiod }
							}
						}
					]
				}
			};
			_this.request(rootUrl + 'save', {
				data: data
			});
		}

		//修改一行数据
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
								repaycosttype: { value: repaycosttype },
								// creationtime: { value: creationtime || moment().format('YYYY-MM-DD HH:mm:ss') },
								// creator: { value: creator },
								repayinterestbegindate: {
									value: repayinterestbegindate || moment().format('YYYY-MM-DD HH:mm:ss')
								},
								repaycostbegindate: {
									value: repaycostbegindate || moment().format('YYYY-MM-DD HH:mm:ss')
								},
								repayinterestperiod: { value: repayinterestperiod },
								repaycostperiod: { value: repaycostperiod },
								repayinteresttype: { value: repayinteresttype },
								remarks: { value: remarks },
								originalid: { value: originalid },
								ts: { value: ts }
							}
						}
					]
				}
			};
			_this.request(rootUrl + 'save', {
				data: data
			});
		}

		//变更一行数据
		if (opre == 'change') {
			const data = {
				head: {
					rows: [
						{
							status: 1,
							values: {
								id: { value: id },
								code: { value: code },
								name: { value: name },
								repaycosttype: { value: repaycosttype },
								// creationtime: { value: creationtime || moment().format('YYYY-MM-DD HH:mm:ss') },
								// creator: { value: creator },
								// repayinterestbegindate: {
								// 	value: repayinterestbegindate || moment().format('YYYY-MM-DD HH:mm:ss')
								// },
								// repaycostbegindate: {
								// 	value: repaycostbegindate || moment().format('YYYY-MM-DD HH:mm:ss')
								// },
								repayinterestperiod: { value: repayinterestperiod },
								repaycostperiod: { value: repaycostperiod },
								repayinteresttype: { value: repayinteresttype },
								remarks: { value: remarks },
								originalid: { value: originalid },
								ts: { value: ts }
							}
						}
					]
				}
			};
			_this.request(rootUrl + 'revise', {
				data: data
			});
		}
		_this.setState({ showModifyModal: false });
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

	// 请求上一页
	getPrevPage = () => {
		if (this.state.dataSource.length === 0) {
			this.setState({
				pageIndex: this.state.pageIndex - 1
			});
			this.getTableData(this.state.pageIndex, this.state.pageSize);
		}
	};
	// 分页点击
	handleSelect(index) {
		this.setState(
			{
				pageIndex: index - 1
			},
			() => {
				this.refresh();
			}
		);
	}
	//改变下拉分页
	handlemodifyRecordDataageSize = (pageSize) => {
		this.setState(
			{
				//点击分页时，当前页都跳转到第1页
				pageIndex: 0,
				pageSize
			},
			() => {
				this.refresh();
				// 因为异步原因，所以先执行getPrevPage()判断，后执行refresh取数，修改bug
				// this.getPrevPage();
			}
		);
	};

	render() {
		let { dataSource, columns, totalPages, totalNums, pageSize, pageIndex, showModifyModal, showModifyRecord, modalData, modifyRecord} = this.state;
		//添加序号
		dataSource = dataSource.map((e, i) => {
			return {
				...e,
				key: i,
				index: i + 1
			};
		});
		//添加修改，删除按钮
		return (
			<div className="bd-wraps paymethod">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">基础档案</Breadcrumb.Item>
					<Breadcrumb.Item active>还款方式</Breadcrumb.Item>
				</Breadcrumb>
				<div className="bd-header">
					<div className="bd-title-1">还款方式</div>
					<Button className="btn-2" colors="primary" onClick={this.open.bind(this, 'add')}>
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
				<Table emptyText={NoData} bordered data={dataSource} columns={columns} className="bd-table" />
				{Boolean(totalNums) && (
					<PageJump
						onChangePageSize={this.handlemodifyRecordDataageSize}
						onChangePageIndex={this.handleSelect.bind(this)}
						totalSize={totalNums}
						activePage={pageIndex + 1}
						maxPage={totalPages}
						pageSize={pageSize}
					/>
				)}
				<Formrepaymentmethod
					showModal={showModifyModal}
					opre={operation} //确定是新增还是修改
					modalData={modalData} //修改时，传递的点击行数据
					onClick={this.close} //关闭模态框取消按钮
					//onRefresh={this.refresh}
					onSubmit={this.handleSubmit} //点击模态框保存按钮
				/>
				<ModifyRecord
					showChange={showModifyRecord}
					closeChange={this.closeModifyRecord}
					dataSource={modifyRecord}
				/>
			</div>
		);
	}
}
