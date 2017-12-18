import React, { Component } from 'react';
import {
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
	Select,
	InputGroup
} from 'tinper-bee';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import Alert from 'bee-alert';
import { Link } from 'react-router';
import debounce from 'debounce';
import "./index.less";
import Ajax from '../../../../utils/ajax';
import { numFormat, toast, sum } from '../../../../utils/utils.js';
import InputForm from '../../containers/InputForm';
import BreadCrumbs from '../../../../containers/BreadCrumbs';
import NoData from '../../../../containers/NoData';

export default class StateList extends Component {
	constructor(props) {
		super(props);
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

	getTableData = (pageIndex, pageSize, keyWords = '') => {
		//测试数据
		// const dataSource = this.props.onLoadSuccess();
		// this.setState({dataSource: dataSource});
		// return;
		const url = this.props.url;
		const page = pageIndex;
		const size = pageSize;
		const searchParams = {
			searchMap: {

			}
		};
		const param = {
			page,
			size,
			searchParams
		};
		this.requestData(url.list, param);
	};

	componentWillMount() {
		// 获取页面表格数据
		this.getTableData(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
	}

	// 分页点击
	handleSelect(index) {
		this.setState(
			{
				pageIndex: index - 1
			},
			() => {
				this.getTableData(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
			}
		);
	}

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

	refresh = () => {
		this.getTableData(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
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
		let { tabs, dataSource, columns, totalPages, totalNums, pageSize, showModal, modalData } = this.state;
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
			<div>
				<div className={this.props.noTopRadius ? "no-radius-header" : "bd-header"}>					
					<div className="bd-title-1">{this.props.name}</div>
					<Button colors="primary" className="btn-2" onClick={this.props.add}>
						新增
					</Button>
					<InputGroup simple className="search-box fr">
						<FormControl
							value={this.state.keyWords}
							onChange={this.handleSearchChange}
							placeholder={this.props.searchHint}
						/>
						<InputGroup.Button shape="border">
							<span className="uf uf-search" />
						</InputGroup.Button>
					</InputGroup>
				</div>
				<Table
					emptyText={NoData}
					bordered
					data={dataSource}
					columns={columns}
					className="bd-table"
				/>
				{totalNums > 0 && (
					<div className="bd-footer">
						<div className="page-size">
							<Select defaultValue={'10条/页'} onChange={this.handleChangePageSize}>
								<Option value="10">10条/页</Option>
								<Option value="20">20条/页</Option>
								<Option value="50">50条/页</Option>
								<Option value="100">100条/页</Option>
							</Select>
							共{totalNums} 条
						</div>
						{this.state.totalPages > 0 && (
							<div className="pagination">
								<Pagination
									gap
									prev
									next
									boundaryLinks
									items={totalPages}
									maxButtons={5}
									activePage={this.state.pageIndex + 1}
									onSelect={this.handleSelect.bind(this)}
								/>
							</div>
						)}
					</div>
				)}
				{/* <InputForm
					columns={this.props.modalColumns}
					showModal={showModal}
					opre={this.state.operation}
					modalData={modalData}
					onClick={this.close}
					onRefresh={this.refresh}
					onSubmit={this.handleSubmit}
				/> */}

				{this.state.showAlert && (
					<Row>
						<Alert colors="news" className="dark" onClick={() => this.setState({ showAlert: false })}>
							<Icon className="uf uf-notification" />
							<span className="alert-text">
								<strong>错误：</strong>
								{this.state.message}
							</span>
						</Alert>
					</Row>
				)}
			</div>
		);
	}
}
