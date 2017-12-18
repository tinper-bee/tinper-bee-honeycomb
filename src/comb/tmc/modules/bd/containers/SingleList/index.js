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
import Ajax from '../../../../utils/ajax';
import { numFormat, toast, sum } from '../../../../utils/utils.js';
import InputForm from '../../containers/InputForm';
import BreadCrumbs from '../../containers/BreadCrumbs';
import NoData from '../../containers/NoData';
import PageJump from '../../../../containers/PageJump';

//应用实例(详见bd_project/index):
{
	/* <SingleList 
        name={name}                                     //页面名称
        breads={breads}                                 //面包屑
        columns={columns}                               //单表字段定义
        modalColumns={modalColumns}                     //模态框字段定义
        columnMap={columnMap}                           //模态框字段的key与value的对应关系，只要输入modalColumns会自动生成
        url={url}                                       //请求url
        onLoadSuccess={this.handleLoading.bind(this)}   //子组件必须实现数据加载成功时的数据解析
        requestParam={this.getParam.bind(this)}         //子组件必须规定请求参数格式
        res={res}                                       //模拟数据
        showMockData={true}                             //是否显示模拟数据开关，静态数据测试时打开
      /> */
}

export default class SingleList extends Component {
	constructor(props) {
		super();
		this.addOperation(props.columns);
		this.state = {
			dataSource: [],
			columns: props.columns,
			showModal: false,
			pageIndex: 0,
			totalPages: 1,
			totalNums: 0,
			pageSize: 10,
			keyWords: '',
			switch: '',
			last: null,
			operation: 'add',
			modalData: {},
			showAlert: false,
			message: ''
		};
	}

	addOperation = (columns) => {
		const length = columns.length;
		columns[length - 1] && columns[length - 1].title !== '操作'
			? columns.push({
					title: '操作',
					dataIndex: 'operation',
					key: 'operation',
					width: 200,
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
				})
			: null;
	};

	getTableData = (pageIndex, pageSize, keyWords = '') => {
		const url = this.props.url;
		const page = pageIndex;
		const size = pageSize;
		const searchParams = {
			searchMap: {
				keyWords: keyWords
			}
		};
		const param = {
			page,
			size,
			searchParams
		};
		this.requestData(url.search, param);
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
		const url = this.props.url.delete;
		const data = { id: id };
		const param = this.props.requestParam(data, 'del');
		this.request(url, param);
	}

	onDelete = (text, record, index) => {
		return () => {
			this.deleteItem(record.id);
		};
	};

	editDone = (opr, index, text, record, e) => {
		this.state.operation = opr;
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
		this.state.operation = opr;
		this.setState({
			showModal: true,
			modalData: {}
		});
	};

	close = (type) => {
		this.state.operation = type;
		this.setState({
			showModal: false
		});
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
				pageSize
			},
			() => {
				this.refresh();
			}
		);
	};

	handleSubmit = (newData, opre) => {
		const _this = this;
		const url = this.props.url;
		const columnMap = _this.props.columnMap;
		for (var key in columnMap) {
			//遍历json对象的每个key/value对,p为key
			const value = newData[key];
			const itemName = columnMap[key];
			if (typeof itemName != 'undefined' && value != 0 && (typeof value == 'undefined' || value == '')) {
				if (itemName !== '备注') {
					toast({ content: '请输入' + itemName, color: 'warning' });
					return;
				}
			}
		}

		const data = this.props.requestParam(newData, opre);
		if (opre == 'add') {
			const param = { data: data };
			this.request(url.save, param);
		}

		if (opre == 'edit') {
			const param = { data: data };
			this.request(url.save, param);
		}
		//确认后关闭窗口
		this.setState({
			showModal: false
		});
	};

	requestData = (url, param) => {
		const _this = this;
		Ajax({
			url: url,
			data: param,
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					const newSource = _this.props.onLoadSuccess(data);
					const head = data.head;
					const totalNums = head.pageinfo ? head.pageinfo.totalElements : 0;
					const totalPages = head.pageinfo ? head.pageinfo.totalPages : 0;
					_this.setState({
						dataSource: newSource,
						totalPages: totalPages,
						totalNums: totalNums,
						showAlert: false,
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
		// //测试
		// const { data, error, success } = this.props.res;
		// if (success) {
		// 	const head = data.head;
		// 	const newSource = this.props.onLoadSuccess(data);
		// 	const totalNums = head.rows.length;
		// 	const totalPages =
		// 		totalNums % this.state.pageSize == 0
		// 			? totalNums / this.state.pageSize
		// 			: totalNums / this.state.pageSize + 1;
		// 	_this.setState({
		// 		dataSource: newSource,
		// 		totalPages: totalPages,
		// 		totalNums: totalNums
		// 	});
		// } else {
		// 	alert(message);
		// }
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
			tabs,
			dataSource,
			columns,
			totalPages,
			totalNums,
			showModal,
			modalData,
			keyWords,
			pageIndex,
			pageSize,
			operation,
			showAlert,
			message
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
		//用于判断面包屑结束
		const last = this.props.breads.length - 1;
		//添加修改，删除按钮
		return (
			<div className="bd-wraps">
				<Breadcrumb>
					{this.props.breads.map((item, i) => {
						return i == last ? (
							<Breadcrumb.Item active>{item.value}</Breadcrumb.Item>
						) : (
							<Breadcrumb.Item href={item.href}>{item.value}</Breadcrumb.Item>
						);
					})}
				</Breadcrumb>
				<div className="bd-header">
					<div className="bd-title-1">{this.props.name}</div>
					<Button colors="primary" className="btn-2" onClick={this.open.bind(this, 'add')}>
						新增
					</Button>
					<InputGroup simple className="search-box fr">
						<FormControl value={keyWords} onChange={this.handleSearchChange} placeholder="搜索名称" />
						<InputGroup.Button shape="border">
							<span className="uf uf-search" />
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

				<InputForm
					columns={this.props.modalColumns}
					showModal={showModal}
					opre={operation}
					modalData={modalData}
					onClick={this.close}
					onRefresh={this.refresh}
					onSubmit={this.handleSubmit}
				/>

				{/* {showAlert && (
					<Row>
						<Alert colors="news" className="dark" onClick={() => this.setState({ showAlert: false })}>
							<Icon className="uf uf-notification" />
							<span className="alert-text">
								<strong>错误：</strong>
								{message}
							</span>
						</Alert>
					</Row>
				)} */}
			</div>
		);
	}
}
