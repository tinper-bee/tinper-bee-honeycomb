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
import PageJump from 'containers/PageJump';
import CCTypeForm from '../CCTypeForm';
import EditForm from '../EditForm';
import BreadCrumbs from '../BreadCrumbs';
import Ajax from 'utils/ajax';
import { numFormat, toast, sum } from 'utils/utils.js';
import NoData from '../NoData';


const PAGE_SIZE = 10;
const FORMAT = 'YYYY-MM-DD HH:mm:ss';
let operation = 'add';
let res = {
	data: {
		rows: [
			{
				rowId: 0,
				status: 0,
				values: {
					id: {
						display: null,
						scale: -1,
						value: '1001K71000000000014U'
					},
					code: {
						display: '0001',
						scale: -1,
						value: '0001'
					},
					name: {
						display: '授信类别1',
						scale: -1,
						value: '授信类别1'
					},
					creator: {
						display: 'szg',
						scale: -1,
						value: '人员pk'
					},
					createdTime: {
						display: null,
						scale: -1,
						value: '2017-11-1'
					}
				}
			}
		]
	},
	error: null,
	success: true
};

const rootURL = window.reqURL.bd + 'bd/cctype/';
export default class Demo extends Component {
	constructor() {
		super();
		this.state = {
			dataSource: [],
			showModal: false,
			pageIndex: 0,
			totalPages: 1,
			totalNums: 0,
			pageSize: 10,
			keyWords: '',
			modalData: {},
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
		const page = pageIndex;
		const size = pageSize;
		const searchParams = {
			searchMap: {
				keyWords: keyWords
			}
		};
		Ajax({
			url: _this.props.searchUrl,
			data: {
				page,
				size,
				searchParams
			},
			success: function(res) {
				const { data, message, success } = res;

				if (success) {
					const head = data.head;
					var newSource = head.rows.map((item, index) => {
						const values = item.values;
						console.log(values)
						const source = _this.props.mapDataSource;
						const obj = {};
							console.log(source)
						for(let key in source) {
							obj[key] = (values[key] && values[key][source[key]])
						}
						console.log(obj)
						return {
							key: `key${index}`,
							index: index,
							id: values.id.value,
							ts: values.ts.value,
							...obj
						};

						
					});

					
					var totalNums = head.pageinfo ? head.pageinfo.totalElements : 0;
					var totalPages = head.pageinfo ? head.pageinfo.totalPages : 1;

					console.log(newSource, totalNums, totalPages)
					_this.setState({
						dataSource: newSource,
						totalPages: totalPages,
						totalNums: totalNums,
					},() => {
						console.log(_this.state.newSource, _this.state.totalNums, _this.state.totalPages)
					});
				} else {
					toast({ content: message.message, color: 'warning' });
					_this.err();
				}
			}
		});
	};

	componentWillMount() {
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
				toast({ content: '后台报错,请联系管理员', color: 'danger' });
			}
		});
	}

	onDelete = (text, record, index) => {
		return () => {
			this.deleteItem(record.id);
		};
	};

	editDone = (opr, index, text, record, e) => {
		console.log(opr, index, text, record, e)
		// operation = opr;
		// if (opr === 'edit') {
		// 	this.setState({
		// 		showModal: true,
		// 		modalData: { ...record }
		// 	});
		// } else if (opr == 'more') {
		// 	//TODO
		// 	console.log(e);
		// }
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
	handlePageSizeSelect = (pageSize) => {
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
		// const { id, code, name, ts } = newData;
		
		if (opre == 'add') {
			let values = this.props.mapSave.head.rows[0].values;
			for(let key in values) {
				for(let k in newData) {
					if(key === k) {
						this.props.mapSave.head.rows[0].values[key].value = newData[k]
					}
					return;
				}
			}
			let data = {...this.props.mapSave}

			// data = {
			// 	head: { rows: [ { status: 2, values: { code: { value: code }, name: { value: name } } } ] }
			// };
		}
		if (opre == 'edit') {
			// data = {
			// 	head: {
			// 		rows: [
			// 			{
			// 				status: 1,
			// 				values: {
			// 					id: { value: id },
			// 					code: { value: code },
			// 					name: { value: name },
			// 					ts: { value: ts }
			// 				}
			// 			}
			// 		]
			// 	}
			// };
		}
		Ajax({
			url: rootURL + 'save',
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
			dataSource,
			totalPages,
			totalNums,
			pageSize,
			pageIndex,
			showModal,
		} = this.state;

		const {
			columns,
			breads,
			title,
			modalData
		} = this.props;

		//添加序号
		// dataSource = dataSource.map((e, i) => {
		// 	return {
		// 		...e,
		// 		key: i,
		// 		index: i + 1
		// 	};
		// });
		//添加修改，删除按钮
		return (
			<div className="bd-wraps">
				<BreadCrumbs items={breads} />
				<div className="bd-header">
					<div className="bd-title-1">{title}</div>
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

				<Table bordered data={dataSource} columns={columns} emptyText={NoData} className="bd-table" />
				{Boolean(totalNums) && (
					<PageJump
						onChangePageSize={this.handlePageSizeSelect}
						onChangePageIndex={this.handleSelect}
						totalSize={totalNums}
						activePage={pageIndex + 1}
						maxPage={totalPages}
						pageSize={pageSize}
					/>
				)}
				
			</div>
		);
	}
}
