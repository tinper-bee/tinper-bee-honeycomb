import React, { Component } from 'react';
import {
	Row,
	Col,
	Menu,
	Table,
	Dropdown,
	Button,
	FormControl,
	Icon,
	Pagination,
	Select,
	Popconfirm,
	InputGroup,
	Breadcrumb
} from 'tinper-bee';
import { Link } from 'react-router';
import Ajax from '../../../../utils/ajax';
import { toast } from '../../../../utils/utils.js';
import NoData from '../../containers/NoData';
import PageJump from '../../../../containers/PageJump';
const { Item, Divider, SubMenu, MenuItemGroup } = Menu;

const rootUrl = window.reqURL.bd + 'bd/partner/';

export default class Partner extends Component {
	constructor() {
		super();
		this.state = {
			head: {
				columns: [
					{ title: '序号', key: 'index', dataIndex: 'key', width: 100 },
					{
						title: '代码',
						key: 'zh',
						dataIndex: 'code.display',
						width: 200,
						render: (text, record, index) => {
							return (
								<div>
									<span
										onClick={(e) => this.editDone('edit', index, text, record, e)}
										style={{ cursor: 'pointer' }}
									>
										{text}
									</span>
								</div>
							);
						}
					},
					{ title: '名称', key: 'hm', dataIndex: 'name.display', width: 200 },
					{ title: '备注', key: 'bz', dataIndex: 'memo.value', width: 300 },
					{
						title: '操作',
						key: 'cz',
						width: 80,
						render: (text, record, index) => {
							return (
								<div>
									{/* 修改 */}
									<span onClick={(e) => this.editDone('edit', index, text, record, e)}>
										<Icon className="iconfont icon-bianji icon-style" />
									</span>
									{/* 删除 */}
									{/* <span >
										<Popconfirm content="确认删除?" onClose={() => this.delRow(record, index)}>
											<Icon className="iconfont icon-shanchu icon-style" />
										</Popconfirm>
									</span> */}
								</div>
							);
						}
					}
				],
				data: []
			},
			pageinfo: {
				number: 0, //当前第几页
				numberOfElements: 0, //当页多少条数据
				size: 10, //每页数据的数量
				totalElements: 0, //总记录条数
				totalPages: 1 //总页数
			},
			keyWords: '' //模糊查询关键字
		};
	}
	editDone = (opr, index, text, record, e) => {
		this.props.router.push({
			pathname: '/bd/bankpartner_add',
			query: { type: 'edit' },
			state: {
				id: record.id
			}
		});
	};

	//请求表信息
	getParnterData = (pageIndex, pageSize) => {
		// 请求主表信息
		Ajax({
			url: rootUrl + 'list',
			data: {
				page: pageIndex,
				size: pageSize,
				searchParams: {
					searchMap: {
						keyWords: this.state.keyWords
					}
				}
			},
			success: (res) => {
				const { data, message, success } = res;
				if (success) {
					const head = data.head;
					const headData = head.rows;
					headData.forEach((item, index) => {
						item.key = index;
						//item.values[id].display=index;
					});
					console.log('headData', headData);
					this.setState(
						{
							head: {
								//columns: headColumns,
								...this.state.head,
								data: headData
							},
							pageinfo: head.pageinfo
						},
						() => {
							console.log('state', this.state);
						}
					);
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};

	componentDidMount() {
		this.getParnterData(this.state.pageinfo.number, this.state.pageinfo.size);
	}
	// 刪除行
	delRow = (record, index) => {
		console.log('主表主键', record.id.value);
		Ajax({
			url: rootUrl + 'del',
			data: {
				ids: [ record.id.value ]
			},
			success: (res) => {
				const { data, message, success } = res;
				if (success) {
					toast({ content: '删除成功...', color: 'success' });
					this.state.head.data.splice(index, 1);
					console.log(this.state.pageinfo);
					this.setState({
						pageinfo: {
							...this.state.pageinfo,
							totalElements: this.state.pageinfo.totalElements - 1
						}
					});
					this.forceUpdate();
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};

	// 下拉列表选择
	onSelectNextOpr = ({ key }) => {
		console.log(`${key} selected`);
	};

	// 处理后台返回的数据
	dataFormat = (data) => {
		let result = [];
		data.map((item, index) => {
			item.values.key = index + 1;
			result.push(item.values);
		});
		return result;
	};
	// 页码选择
	handlePageSelect = (index) => {
		this.setState(
			{
				pageinfo: {
					number: index - 1,
					size: this.state.pageinfo.size
				}
			},
			() => {
				this.getParnterData(this.state.pageinfo.number, this.state.pageinfo.size);
			}
		);
	};

	//模糊查询操作Enter
	handleSearchChange = (e) => {
		this.setState({
			keyWords: e.target.value
		});
		if (e.keyCode == 13) {
			this.setState(
				{
					pageinfo: {
						number: 0,
						size:10
					}
				},
				() => {
					this.getParnterData(this.state.pageinfo.number, this.state.pageinfo.size);
				}
			);
		}
	};

	handleSearchClick = (e) => {
		this.setState(
			{
				pageinfo: {
					number: 0,
					size:10
				}
			},
			() => {
				this.getParnterData(this.state.pageinfo.number, this.state.pageinfo.size);
			}
		);
	};
	
	serchTable = () => {
		let search = this.state.keyWords;
		console.log(search);
		const searchParams = {
			searchMap: {
				keyWords: search
			}
		};
		//模糊查询数据
		Ajax({
			url: rootUrl + 'searchByCondition',
			data: {
				searchParams
			},
			success: (res) => {
				const { data, message, success } = res;
				if (success) {
					let headData = data.head.rows;
					headData.forEach((item, index) => {
						item.key = index;
					});
					this.setState(
						{
							head: {
								...this.state.head,
								data: headData
							},
							pageinfo: res.data.data.head.pageinfo
						},
						() => {
							console.log('state', this.state);
						}
					);
					//this.state.head.data.splice(index, 1);
					//	this.forceUpdate();
					toast({ content: '查询成功...', color: 'success' });
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};

	// 改变分页大小
	handlePageSizeSelect = (pageSize) => {
		this.setState(
			{
				pageinfo: {
					...this.state.pageinfo,
					size: pageSize - 0,
					number: 0
				}
			},
			() => {
				this.getParnterData(this.state.pageinfo.number, this.state.pageinfo.size);
			}
		);
	};

	render() {
		let { columns, data } = this.state.head;
		let { totalElements, number, totalPages, size } = this.state.pageinfo;
		return (
			<div className="bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">基础档案</Breadcrumb.Item>
					<Breadcrumb.Item active>合作伙伴</Breadcrumb.Item>
				</Breadcrumb>
				<div className="bd-header">
					<div className="bd-title-1">合作伙伴</div>
					<Link to={{ pathname: '/bd/bankpartner_add', query: { type: 'add' } }}>
						<Button colors="primary" className="btn-2">
							新增
						</Button>
					</Link>
					<InputGroup simple className="search-box fr">
						<FormControl
							value={this.state.keyWords}
							onChange={this.handleSearchChange}
							onKeyUp={this.handleSearchChange}
							placeholder="搜索名称"
						/>
						<InputGroup.Button shape="border">
							<span className="uf uf-search" onClick={this.handleSearchClick} />
						</InputGroup.Button>
					</InputGroup>
				</div>

				<Table
					emptyText={NoData}
					bordered
					data={this.dataFormat(data)}
					columns={columns}
					className="bd-table"
				/>
				{Boolean(totalElements) && (
					<PageJump
						onChangePageSize={this.handlePageSizeSelect}
						onChangePageIndex={this.handlePageSelect}
						totalSize={totalElements}
						activePage={number + 1}
						maxPage={totalPages}
						pageSize={size}
					/>
				)}
			</div>
		);
	}
}
