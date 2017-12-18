import React, { Component } from 'react';
import {
	Label,
	Table,
	Dropdown,
	Button,
	FormControl,
	Icon,
	Pagination,
	Select,
	Popconfirm,
	Breadcrumb,
	InputGroup
} from 'tinper-bee';
import { Link } from 'react-router';
import Ajax from '../../../../utils/ajax';
import { numFormat, toast, sum } from '../../../../utils/utils.js';
import './index.less';
import NoData from '../../containers/NoData';
import PageJump from '../../../../containers/PageJump';
import './formatMoney.js'; //数字和货币格式转换

let bodyDataAry = [];
const accounttypeList = [
	{ key: '活期', value: 0 },
	{ key: '定期', value: 1 },
	{ key: '通知', value: 2 },
	{ key: '保证金', value: 3 },
	{ key: '理财', value: 4 }
];
export default class Bankaccbas extends Component {
	constructor() {
		super();
		this.state = {
			head: {
				columns: [
					{ title: '序号', key: 'key', dataIndex: 'key', width: 100 }, //前端按索引key排序号
					{ title: '账号', key: 'zh', dataIndex: 'code.value', width: 150,render:(text,record,index)=>{
						return (<Label title={text}>{text}</Label>);
					} },
					{ title: '户名', key: 'hm', dataIndex: 'name.value', width: 150 ,render:(text,record,index)=>{
						return (<Label title={text}>{text}</Label>);
					}},
					{ title: '开户行', key: 'khh', dataIndex: 'bankid.display', width: 200 ,render:(text,record,index)=>{
						return (<Label title={text}>{text}</Label>);
					}},
					{ title: '开户公司', key: 'khgs', dataIndex: 'orgid.display', width: 150,render:(text,record,index)=>{
						return (<Label title={text}>{text}</Label>);
					} },
					{ title: '开户时间', key: 'khsj', dataIndex: 'opentime.value', width: 100 },
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
									{/* <span>
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
			body: {
				columns: [
					{
						title: '序号',
						key: 'key',
						dataIndex: 'key',
						width: 50
					},
					{
						title: '子户编码',
						key: 'code',
						dataIndex: 'code.value',
						width: 100
					},
					{
						title: '子户名称',
						key: 'name',
						dataIndex: 'name.value',
						width: 100
					},
					{
						title: '币种',
						key: 'currtypeid',
						dataIndex: 'currtypeid.display',
						width: 50
					},
					{
						title: '账户类型',
						key: 'accounttype',
						dataIndex: 'accounttype.display',
						width: 50
					},
					{
						title: '期初余额',
						key: 'balance',
						dataIndex: 'balance.value',
						width: 100
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
			keyWords: ''
		};
	}

	componentDidMount() {
		this.getHeadData();
	}

	// 请求主表信息
	getHeadData = () => {
		const searchParams = {
			searchMap: {
				keyWords: this.state.keyWords
			}
		};
		this.state.body.data=[];
		Ajax({
			url: window.reqURL.bd + 'bd/bankaccbas/list',
			data: {
				page: this.state.pageinfo.number,
				size: this.state.pageinfo.size,
				searchParams
			},
			success: (res) => {
				const { data, message, success } = res;
				if (success) {
					let headData = data.head.rows;
					headData.forEach((item, index) => {
						item.values.key = index + 1;
					});
					if (!data.head.pageinfo){
						this.setState({
							head: {
								...this.state.head,
								data: headData
							},
							pageinfo: {
								number: 0, //当前第几页
								numberOfElements: 0, //当页多少条数据
								size: 10, //每页数据的数量
								totalElements: 0, //总记录条数
								totalPages: 1 //总页数
							}
						});
					}else{
						this.setState({
							head: {
								...this.state.head,
								data: headData
							},
							pageinfo: data.head.pageinfo
						});
					}
				} else {
					toast({ content: message.message, color: 'warning' });
				}
				console.log('head', this.state.head);
			},
			error: (res) => {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};

	// 请求上一页
	getPrevPage = () => {
		if (this.state.head.data.length === 0) {
			this.setState(
				{
					pageinfo: {
						...this.state.pageinfo,
						number: this.state.pageinfo.number - 1
					}
				},
				this.getHeadData
			);
		}
	};

	// 子表展开函数
	onExpand = (isClosed, record) => {
		// console.log(isClosed, record);
		console.log('主表主键', record.id.value);
		if (isClosed) {
			Ajax({
				url: window.reqURL.bd + 'bd/bankaccbas/subquery',
				data: {
					id: record.id.value
				},
				success: (res) => {
					const { data, message, success } = res;
					if (success) {
						console.log('请求回来的子表数据', data.body.rows);
						// 子表中的账户类型根据value值将display变成对应的中文
						// 给子表每一行加一个索引
						data.body.rows.forEach((item, index) => {
							item.values.key = index + 1;
							typeof item.values.accounttype.value === 'number' &&
								(item.values.accounttype.display = accounttypeList[item.values.accounttype.value].key); //账户类型的display转换
							item.values.balance.value = (item.values.balance.value - 0).formatMoney(); //初期余额返回的是字符串，转数字后转货币格式
						});
						// 定义一个二维数组，[[],[索引1的主表对应的子表信息]]
						// record.key - 1 //主表的索引
						bodyDataAry[record.key - 1] = data.body.rows;
						this.setState(
							{
								body: {
									...this.state.body,
									data: bodyDataAry
								}
							},
							() => {
								console.log('请求子表后的state', this.state);
								console.log('子表的数据data', this.state.body.data);
							}
						);
						this.forceUpdate();
					} else {
						toast({ content: message.message, color: 'warning' });
					}
				},
				error: (res) => {
					toast({ content: '后台查询出错！' + res.message, color: 'danger' });
				}
			});
		}
	};

	expandedRowRender = (record, index) => {
		let data = this.state.body.data[index];
		return (
			<Table
				emptyText={() => <span>暂无记录</span>}
				columns={this.state.body.columns}
				data={this.dataFormat(data)}
				className="bd-table bd-subtable"
			/>
		);
	};

	editDone = (opr, index, text, record, e) => {
		// 点击编辑，要把当前点击的这一行的id传到下一个页面
		console.log(record, record.id);
		this.props.router.push({
			pathname: '/bd/bankaccbas_add',
			query: { type: 'edit' },
			state: {
				id: record.id
			}
		});
	};

	// 处理后台返回的数据
	dataFormat = (data) => {
		let result = [];
		data &&
			data.map((item, index) => {
				result.push(item.values);
			});
		result.forEach((item, index) => {
			for (var key in item) {
				// trim  去掉首尾的空格  如果字段内容全是空格或者null
				if (item[key].display === 'null' || (item[key].display && item[key].display.trim() === '')) {
					item[key].display = '-';
				}
			}
		});
		return result;
	};

	// 删除行
	delRow = (record, index) => {
		console.log('主表主键', record.id.value);
		Ajax({
			url: window.reqURL.bd + 'bd/bankaccbas/del',
			data: {
				ids: [ record.id.value ]
			},
			success: (res) => {
				const { data, message, success } = res;
				if (success) {
					this.state.head.data.splice(index, 1);
					this.forceUpdate();
				} else {
					toast({ content: message.message, color: 'warning' });
				}
				this.getHeadData();
				this.getPrevPage();
			},
			error: (res) => {
				toast({ content: '删除出错！' + res.message, color: 'danger' });
			}
		});
	};

	// 页码选择
	handlePageSelect = (eventKey) => {
		this.setState(
			{
				pageinfo: {
					...this.state.pageinfo,
					number: eventKey - 1
				}
			},
			this.getHeadData
		);
	};

	// 改变分页大小
	handlePageSizeSelect = (value) => {
		this.setState(
			{
				pageinfo: {
					...this.state.pageinfo,
					size: value - 0,
					number: 0
				}
			},
			this.getHeadData
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
					this.getHeadData();
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
				this.getHeadData();
			}
		);
	};

	render() {
		let { totalElements, number, totalPages, size } = this.state.pageinfo;
		let { columns, data } = this.state.head;
		return (
			<div className="bd-wraps bd-bankaccbas-main">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">基础档案</Breadcrumb.Item>
					<Breadcrumb.Item active>银行账户管理</Breadcrumb.Item>
				</Breadcrumb>
				<div className="bd-header">
					<div className="bd-title-1">银行账户管理</div>
					<Link to={{ pathname: '/bd/bankaccbas_add', query: { type: 'add' } }}>
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
					onExpand={this.onExpand}
					expandedRowRender={this.expandedRowRender}
					columns={columns}
					data={this.dataFormat(data)}
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
