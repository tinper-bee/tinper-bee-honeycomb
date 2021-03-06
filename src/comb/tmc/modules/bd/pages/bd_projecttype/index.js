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
	InputGroup,
	Select
} from 'tinper-bee';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import Ajax from '../../../../utils/ajax';
import { numFormat, toast, sum } from '../../../../utils/utils.js';
import Formprojecttype from '../../containers/Formprojecttype';
import NoData from '../../containers/NoData';
import PageJump from '../../../../containers/PageJump';

//默认是新增
let operation = 'add';
const rootUrl = window.reqURL.bd + 'bd/projectClass/';
//  name :  项目类型名称
//  项目类型编码： code
//  备注：description
let dataSource = [];
let i = 3;
export default class Projecttype extends Component {
	constructor() {
		super();
		this.state = {
			breads: [],
			//dataSource: [],
			dataSource: dataSource,
			columns: [
				{ title: '序号', dataIndex: 'index', key: 'index', width: 100 },
				{ title: '编码', dataIndex: 'code', key: 'code', width: 200 },
				{ title: '名称', dataIndex: 'name', key: 'name', width: 200 },
				{ title: '备注', dataIndex: 'description', key: 'description', width: 300 },
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
			modalData: {},
			message: ''
		};
	}

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
						return {
							index: item.rowId,
							id: values.id.value,
							code: values.code.value,
							name: values.name.value,
							creator: values.creator.display,
							createdTime: values.creationtime.value,
							description: values.description.value,
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

	//更新数据
	refresh = () => {
		this.getTableData(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
	};

	//请求表格数据
	componentWillMount() {
		this.refresh();
	}

	//点击新增按钮打开模态框
	open = (opr, e) => {
		operation = opr;
		this.setState({
			showModal: true,
			modalData: {}
		});
	};

	//点击修改按钮，打开模态框
	editDone = (opr, index, text, record, e) => {
		operation = opr;
		if (opr === 'edit') {
			this.setState({
				showModal: true,
				modalData: { ...record } //该行数据
			});
		} else if (opr == 'more') {
			//TODO
			console.log(e);
		}
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
		};
	};

	//点击取消关闭模态框
	close = (type) => {
		operation = type;
		this.setState({
			showModal: false
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
		const { id, code, name, ftype, description, ts } = newData;
		if (typeof code == 'undefined' || code == '') {
			toast({ content: '请输入项目类型编码', color: 'warning' });
			return;
		}
		if (typeof name == 'undefined' || name == '') {
			toast({ content: '请选择项目类型', color: 'warning' });
			return;
		}
		let data = null;
		const url = rootUrl + 'save';
		//新增一行数据
		if (opre == 'add') {
			data = {
				head: {
					rows: [
						{
							status: 2,
							values: {
								code: { value: code },
								name: { value: name },
								description: { value: description }
							}
						}
					]
				}
			};
		}

		//修改一行数据
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
								ftype: { value: ftype },
								description: { value: description },
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
				toast({
					content: res.message == '保存失败：' ? res.message + '已存在该项目类型，请修改' : res.message,
					color: 'danger'
				});
			}
		});
		//确认后关闭窗口
		this.setState({
			showModal: false
		});
	};

	// 分页点击
	handleSelect = (index) => {
		this.setState(
			{
				pageIndex: index - 1
			},
			() => {
				this.refresh();
			}
		);
	};

	//改变下拉分页
	handleChangePageSize = (pageSize) => {
		let num = parseInt(pageSize, 10);
		this.setState(
			{
				pageSize,
				pageIndex: 0
			},
			() => {
				this.refresh();
			}
		);
	};

	render() {
		let { dataSource, columns, totalPages, totalNums, pageSize, pageIndex, showModal, modalData } = this.state;
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
			<div className="bd-wraps">
				<Breadcrumb className="bd-breadCrumb">
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">基础档案</Breadcrumb.Item>
					<Breadcrumb.Item active>项目类型</Breadcrumb.Item>
				</Breadcrumb>
				<div className="bd-header">
					<div className="bd-title-1">项目类型</div>
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
				<Table bordered data={dataSource} columns={columns} emptyText={NoData} className="bd-table" />
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
				<Formprojecttype
					showModal={showModal}
					opre={operation} //确定是新增还是修改
					modalData={modalData} //修改时，传递的点击行数据
					onClick={this.close} //关闭模态框取消按钮
					//onRefresh={this.refresh}
					onSubmit={this.handleSubmit} //点击模态框保存按钮
				/>
			</div>
		);
	}
}
