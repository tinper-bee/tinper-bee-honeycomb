/**
 * 结息日档案
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
	InputGroup,
	Breadcrumb,
	Label
} from 'tinper-bee';
import Ajax from '../../../../utils/ajax';
import { numFormat, toast, sum } from '../../../../utils/utils.js';
import DatePicker from 'bee-datepicker';
import InterestdayModal from '../../containers/InterestDayModal';
import NoData from '../../containers/NoData';
import PageJump from '../../../../containers/PageJump';

const PAGE_SIZE = 10;
const FORMAT = 'YYYY-MM-DD HH:mm:ss';
let operation = 'add';
const rootUrl = window.reqURL.bd + 'bd/interestday/';

const Enum = [
	{
		enumkey: 'type',
		enumvalue: [
			{ key: '0', value: '按年' },
			{ key: '1', value: '按半年' },
			{ key: '2', value: '按季度' },
			{ key: '3', value: '按月' }
		]
	},
	{
		enumkey: 'unit',
		enumvalue: [
			{ key: '0', value: '年' },
			{ key: '1', value: '月' },
			{ key: '2', value: '季度' },
			{ key: '3', value: '日' }
		]
	}
];

export default class InterestDay extends Component {
	constructor() {
		super();
		this.state = {
			breads: [],
			dataSource: [],
			columns: [],
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
							code: values.code.value,
							name: values.name.value,
							type: {
								value: values.type.value,
								display: values.type.display
							},
							cycle: values.cycle.value,
							unit: {
								value: values.unit.value,
								display: values.unit.display
							},
							interestday: values.interestday.value,
							memo: values.memo.value,
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

	processEnum(value) {
		Enum.map((itemEnum) => {
			if (itemEnum.enumkey === 'type') {
				itemEnum.enumvalue.map((item) => {
					if (item.key == value.type.value) {
						value.type.display = item.value;
					}
				});
			}
			if (itemEnum.enumkey === 'unit') {
				itemEnum.enumvalue.map((item) => {
					if (item.key == value.unit.value) {
						value.unit.display = item.value;
					}
				});
			}
		});
		return value;
	}

	columnsData = [
		{ title: '序号', key: 'index', dataIndex: 'index', width: 100 },
		{ title: '编码', key: 'code', dataIndex: 'code', width: 150 ,render:(text,record,index)=>{
			return (<Label title={text}>{text}</Label>);
		}},
		{ title: '名称', key: 'name', dataIndex: 'name', width: 150 ,render:(text,record,index)=>{
			return (<Label title={text}>{text}</Label>);
		}},
		{ title: '结息方式', key: 'type', dataIndex: 'type.display', width: 100 },
		{ title: '结息周期', key: 'cycle', dataIndex: 'cycle', width: 100 },
		{ title: '结息单位', key: 'unit', dataIndex: 'unit.display', width: 100 },
		{ title: '结息日', key: 'interestday', dataIndex: 'interestday', width: 100 },
		{ title: '备注', key: 'memo', dataIndex: 'memo', width: 300 },
		{
			title: '操作',
			dataIndex: 'operation',
			key: 'operation',
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

	// 根据id删除某个条目
	deleteItem(id) {
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
		if (opr === 'edit') {
			this.setState({
				showModal: true,
				modalData: { ...record }
			});
			// 模态框枚举只传值
			// this.state.modalData.type=record.type.value;
			// this.state.modalData.unit=record.type.value;
		} else if (opr == 'more') {
			//TODO
			console.log(e + '这里有没有change');
		}
	};
	// 刷新
	refresh = () => {
		this.getTableData(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
	};
	// 模态框
	open = (opr, e) => {
		operation = opr;
		this.setState({
			showModal: true,
			modalData: {}
		});
	};

	closeModel = (type) => {
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

	handleSubmit = (newData, opre) => {
		const _this = this;
		const { id, code, name, type, cycle, unit, interestday, memo, ts } = newData;
		if (typeof code == 'undefined' || code == '') {
			toast({ content: '请输入编码', color: 'warning' });
			return;
		}
		if (typeof name == 'undefined' || name == '') {
			toast({ content: '请输入名称', color: 'warning' });
			return;
		}
		if (typeof type == 'undefined' || type === null || type === '') {
			toast({ content: '请输入结息方式', color: 'warning' });
			return;
		}
		if (typeof cycle == 'undefined' || cycle == null) {
			toast({ content: '请输入结息周期', color: 'warning' });
			return;
		}
		if (typeof unit == 'undefined' || unit === null || unit === '') {
			toast({ content: '请输入周期单位', color: 'warning' });
			return;
		}
		if (typeof interestday == 'undefined' || interestday == '') {
			toast({ content: '请输入结息日', color: 'warning' });
			return;
		}
		let data = null;
		const url = rootUrl + 'save';
		if (opre == 'add') {
			data = {
				head: {
					rows: [
						{
							status: 2,
							values: {
								code: { value: code },
								name: { value: name },
								type: { value: type },
								cycle: { value: cycle },
								unit: { value: unit },
								interestday: { value: interestday },
								memo: { value: memo }
							}
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
								type: { value: type },
								cycle: { value: cycle },
								unit: { value: unit },
								interestday: { value: interestday },
								memo: { value: memo },
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
				toast({ content: res.message, color: 'danger' });
			}
		});
		//确认后关闭窗口
		this.setState({
			showModal: false
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
			modalData
		} = this.state;
		//添加序号
		dataSource = dataSource.map((e, i) => {
			return {
				...e,
				index: i + 1
			};
		});
		return (
			<div className="bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">基础档案</Breadcrumb.Item>
					<Breadcrumb.Item active>结息日</Breadcrumb.Item>
				</Breadcrumb>
				<div className="bd-header">
					<div className="bd-title-1">结息日</div>
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
					rowKey={'id'}
					data={dataSource}
					columns={columns}
					className="bd-table"
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
					<InterestdayModal
						showModal={showModal}
						opre={operation}
						modalData={modalData}
						onClick={this.closeModel}
						onRefresh={this.refresh}
						onSubmit={this.handleSubmit}
					/>
				)}
			</div>
		);
	}
}
