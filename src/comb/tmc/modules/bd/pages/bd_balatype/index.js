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
	InputGroup
} from 'tinper-bee';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import Alert from 'bee-alert';
import { Link } from 'react-router';
import DatePicker from 'bee-datepicker';
import moment from 'moment';
import debounce from 'debounce';
import PageJump from '../../../../containers/PageJump';
import BalaTypeForm from '../../containers/BalaTypeForm';
import EditForm from '../../containers/EditForm';
import Ajax from '../../../../utils/ajax';
import { numFormat, toast, sum } from '../../../../utils/utils.js';
import NoData from '../../containers/NoData';

const PAGE_SIZE = 10;
const FORMAT = 'YYYY-MM-DD HH:mm:ss';
let operation = 'add';

const rootURL = window.reqURL.bd + 'bd/balatype/';

export default class BalaType extends Component {
	constructor() {
		super();
		this.state = {
			breads: [],
			dataSource: [],
			columns: [
				{ title: '序号', dataIndex: 'index', key: 'index', width: 70 },
				{ title: '编码', dataIndex: 'code', key: 'code', width: 200 },
				{ title: '名称', dataIndex: 'name', key: 'name', width: 200 },
				{ title: '属性', dataIndex: 'attr', key: 'attr', width: 150 },
				{
					title: '操作',
					dataIndex: 'operation',
					key: 'operation',
					width: 100,
					render: (text, record, index) => {
						return (
							<div>
								<Icon
									className="iconfont icon-bianji icon-style"
									onClick={(e) => this.editDone('edit', index, text, record, e)}
								/>

								{/* <Popconfirm content="确认删除?" onClose={this.onDelete(text, record, index)}>
									<Icon className="iconfont icon-shanchu icon-style" />
								</Popconfirm> */}
							</div>
						);
					}
				}
			],
			count: 4,
			showModal: false,
			pageIndex: 0,
			totalPages: 1,
			totalNums: 0,
			pageSize: 10,
			keyWords: '',
			switch: '',
			last: null,
			modalData: {},
			showAlert: false,
			message: ''
		};
	}

	//error 请求接口错误时回调
	err = () => {
		this.setState({
			dataSource: [],
			totalNums: 0,
			totalPages: 0
		});
	};
	getTableData = (pageIndex, pageSize, keyWords = '') => {
		const _this = this;
		const page = pageIndex ? parseInt(pageIndex) : 0;
		const size = pageSize ? parseInt(pageSize) : 10;
		const searchParams = {
			searchMap: {
				keyWords: keyWords
			}
		};
		Ajax({
			url: rootURL + 'search',
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
						const attrEnum = values.attr.value;
						return {
							id: values.id.value,
							code: values.code.value,
							name: values.name.value,
							attr: attrEnum == '0' ? '银企联云' : attrEnum == '1' ? '银企直联' : '',
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
					_this.err();
				}
			},
			error: function(res) {
				toast({ content: '后台查询出错！' + res.message, color: 'danger' });
			}
		});
	};

	componentWillMount() {
		// 获取页面表格数据
		this.getTableData(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
	}

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

	// 根据id删除某个条目
	deleteItem(id) {
		const _this = this;
		Ajax({
			url: rootURL + 'delete',
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
				toast({ content: '结算方式删除出错！' + res.message, color: 'danger' });
			}
		});
	}

	onDelete = (text, record, index) => {
		return () => {
			this.deleteItem(record.id);
		};
	};

	editDone = (opr, index, text, record, e) => {
		operation = opr;
		let attr = record.attr == '银企联云' ? '0' : record.attr == '银企直联' ? '1' : '';
		record.attr = attr;
		if (opr === 'edit') {
			this.setState({
				showModal: true,
				modalData: { ...record }
			});
		} else if (opr == 'more') {
			//TODO
			console.log(e);
		}
	};

	refresh = () => {
		this.getTableData(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
	};

	open = (opr, e) => {
		operation = opr;
		this.setState({
			showModal: true,
			modalData: {}
		});
	};

	close = (type) => {
		operation = type;
		this.setState({
			showModal: false
		});
	};

	commonApi = (type) => {
		this.close(type);
		console.log('commonApi!', type);
		if (type === 'ADD') {
			this.state.indexNum++;
		}

		if (type === 'DEL') {
			//TODO
			console.log('TODO DEL');
		}
		this.setState();
	};

	searchByKeywords = (pageIndex = 0, pageSize, keyWords) => {
		this.setState({
			pageIndex: 0
		});
		this.getTableData(pageIndex, pageSize, keyWords);
	};

	handleSearchChange = (e) => {
		let search = this.debounce(500, this.handleSearch);
		const value = e.target.value;
		if (value != ' ') {
			this.setState(
				{
					keyWords: e.target.value
				},
				() => {
					search();
				}
			);
		}
	};

	handleSearch = () => {
		this.searchByKeywords(0, this.state.pageSize, this.state.keyWords);
	};

	onSelectNextOpr = ({ key }) => {
		console.log(`${key} selected`);
	};

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

	handleSubmit = (newData, opre) => {
		const _this = this;
		const { id, code, name, attr, ts } = newData;
		if (typeof code == 'undefined' || code == '') {
			toast({ content: '请输入编码', color: 'warning' });
			return;
		}

		if (typeof name == 'undefined' || name == '') {
			toast({ content: '请输入名称', color: 'warning' });
			return;
		}
		//需求变更，控制为非必输项
		// if (typeof attr == 'undefined' || attr == '') {
		// 	toast({ content: '请输入属性', color: 'warning' });
		// 	return;
		// }
		const url = rootURL + 'save';
		let data = null;
		if (opre == 'add') {
			data = {
				head: {
					rows: [
						{
							status: 2,
							values: { code: { value: code }, name: { value: name }, attr: { value: parseInt(attr) } }
						}
					]
				}
			};
		}

		if (opre == 'edit') {
			data = {
				head: {
					rows: [
						{
							status: 1,
							values: {
								id: { value: id },
								code: { value: code },
								name: { value: name },
								attr: { value: parseInt(attr) },
								ts: { value: ts }
							}
						}
					]
				}
			};
		}
		Ajax({
			url: url,
			data: { data },
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
				toast({ content: '结算方式保存出错！' + res.message, color: 'danger' });
			}
		});
		//确认后关闭窗口
		this.setState({
			showModal: false
		});
	};

	throttle = (time, func) => {
		let lastTime = this.state.lastTime;
		return () => {
			//等同于new Date().getTime(), 得到毫秒
			var currTime = +new Date();
			if (lastTime == 0 || currTime - lastTime > time) {
				func.call(this, arguments);
				this.state.lastTime = currTime;
			}
		};
	};

	debounce = (time, func) => {
		var last = this.state.last;
		return () => {
			clearTimeout(last);
			last = setTimeout(function() {
				func.apply(this, arguments);
			}, time);
			this.state.last = last;
		};
	};

	render() {
		let {
			breads,
			tabs,
			dataSource,
			columns,
			keyWords,
			totalPages,
			totalNums,
			pageIndex,
			pageSize,
			showModal,
			modalData
		} = this.state;
		//添加序号
		dataSource = dataSource.map((e, i) => {
			const rowId = e.index;
			return {
				...e,
				key: i,
				index: i + 1
			};
		});
		//添加修改，删除按钮
		return (
			<div className="bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">基础档案</Breadcrumb.Item>
					<Breadcrumb.Item active>结算方式</Breadcrumb.Item>
				</Breadcrumb>
				<div className="bd-header">
					<div className="bd-title-1">结算方式</div>
					<Button colors="primary" className="btn-2" onClick={this.open.bind(this, 'add')}>
						新增
					</Button>

					<InputGroup simple className="search-box fr">
						<FormControl value={keyWords} onChange={this.handleSearchChange} placeholder="搜索名称" />
						<InputGroup.Button shape="border">
							<span className="uf uf-search" onClick={this.handleSearch} />
						</InputGroup.Button>
					</InputGroup>
				</div>

				<Table emptyText={NoData} bordered data={dataSource} columns={columns} className="bd-table" />
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

				<BalaTypeForm
					showModal={showModal}
					opre={operation}
					modalData={modalData}
					onClick={this.close}
					onRefresh={this.refresh}
					onSubmit={this.handleSubmit}
				/>
			</div>
		);
	}
}
