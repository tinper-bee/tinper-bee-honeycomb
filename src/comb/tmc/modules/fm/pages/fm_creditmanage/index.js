/* 银行授信协议 */
import React, { Component } from 'react';
import { Breadcrumb, Button, Table, InputGroup, FormControl, Icon, Checkbox } from 'tinper-bee';
import { Link } from 'react-router';
import PageJump from '../../../../containers/PageJump';
import NoData from '../../../../containers/NoData';
import { numFormat, toast } from '../../../../utils/utils.js';
import Ajax from '../../../../utils/ajax.js';
import * as enumData from './enumData';
import ModifyRecordModal from './ModifyRecord';
import DeleteModal from '../../../../containers/DeleteModal';
import './index.less';

const rootURL = window.reqURL.fm + 'fm/';
export default class CreditManage extends Component {
	constructor() {
		super();
		this.state = {
			columns: [
				{ title: '序号', key: 'xh', dataIndex: 'key', width: 70 },
				{ title: '协议编码', key: 'xybm', dataIndex: 'agreecode', width: 200 },
				{ title: '协议类型', key: 'xylx', dataIndex: 'agreetype.display', width: 150 },
				{ title: '授信银行/授信人', key: 'sxyh', dataIndex: 'agreebankid_creditorgid', width: 250 },
				{ title: '币种/原币额度', key: 'bz', dataIndex: 'currenyid_money', width: 150 },
				{ title: '起始日期/结束日期', key: 'qsrq', dataIndex: 'begindate_enddate', width: 150 },
				{ title: '协议状态', key: 'xyzt', dataIndex: 'agreestatus.display', width: 100 },
				{
					title: '操作',
					key: 'cz',
					width: 120,
					render: (text, record, index) => {
						let value = record.agreestatus.value;
						return (
							<div>
								{/* 根据协议状态 agreestatus
									待提交 0 提交 修改 删除
									待审批 3 收回
									未执行 1 
									在执行 5 变更 变更记录 结束
									已结束 6 取消结束*/}

								{/* 修改 */}
								{value == 0 && (
									<Link
										to={{
											pathname: '/fm/creditdetail',
											query: { type: 'edit' },
											state: { id: record.id.value, agreestatus: record.agreestatus }
										}}
									>
										<Icon className="iconfont icon-bianji icon-style" />
									</Link>
								)}
								{/* 提交 */}
								{value == 0 && (
									<Icon
										data-tooltip="提交"
										className="iconfont icon-tijiao icon-style"
										onClick={(e) => this.handleOperationType('commit', index, text, record, e)}
									/>
								)}
								{/* 删除 */}
								{value == 0 &&
								this.state.data[index].version.value - 1 === 0 && (
									<DeleteModal
										onConfirm={(e) => this.handleOperationType('delete', index, text, record, e)}
									/>
								)}

								{/* 收回 */}
								{value == 3 && (
									<Icon
										data-tooltip="收回"
										className="iconfont icon-shouhui icon-style"
										onClick={(e) => this.handleOperationType('uncommit', index, text, record, e)}
									/>
								)}

								{/* 变更 */}
								{value == 5 && (
									<Link
										to={{
											pathname: '/fm/creditdetail',
											query: { type: 'modify' },
											state: { id: record.id.value, agreestatus: record.agreestatus }
										}}
									>
										<Icon className="iconfont icon-biangeng icon-style" />
									</Link>
								)}
								{/* 变更记录 */}
								{value == 5 && (
									<Icon
										className="iconfont icon-biangengjilu icon-style"
										onClick={(e) =>
											this.handleOperationType('modifyrecord', index, text, record, e)}
									/>
								)}
								{/* 结束 */}
								{value == 5 && (
									<Icon
										data-tooltip="结束"
										className="uf uf-ju-c-o icon-style"
										style={{ fontSize: 20 }}
										onClick={(e) => this.handleOperationType('end', index, text, record, e)}
									/>
								)}
								{/* 取消结束 */}
								{value == 6 && (
									<Icon
										data-tooltip="取消结束"
										className="uf uf-activate-2 icon-style"
										style={{ fontSize: 20 }}
										onClick={(e) => this.handleOperationType('unend', index, text, record, e)}
									/>
								)}
							</div>
						);
					}
				}
			],
			data: [],
			keyWords: '',
			pageSize: 10,
			pageIndex: 0,
			totalPages: 0,
			totalElements: 0,
			modifyRecordData: [], //变更记录数据,
			showModal: false
		};
	}

	componentDidMount() {
		let { pageIndex, pageSize } = this.state;
		this.getTableData();
	}

	// 请求表格数据
	getTableData = (page, size, word) => {
		let { pageIndex, pageSize, keyWords } = this.state;
		page = page || pageIndex;
		size = size || pageSize;
		keyWords = word || keyWords;
		const searchParams = {
			searchMap: {
				keyWords
			}
		};
		console.log('请求参数:', page, size, keyWords);
		Ajax({
			url: rootURL + 'creditagree/list',
			data: {
				page,
				size,
				searchParams
			},
			success: (res) => {
				const { data, message, success } = res;
				if (!data) return;
				let pageinfo = data.creditagree && data.creditagree.pageinfo;
				if (success) {
					let dataSource =
						data.creditagree &&
						data.creditagree.rows.map((item) => {
							item.values.agreestatus.display = this.enumMapping(
								item.values.agreestatus.value,
								enumData.agreeStatusAry
							);
							item.values.agreetype.display = this.enumMapping(
								item.values.agreetype.value,
								enumData.agreeTypeAry
							);
							return item.values;
						});
					let processedData = [];
					dataSource &&
						dataSource.forEach((item, index) => {
							item.agreecode = (
								<Link
									to={{
										pathname: `/fm/creditdetail`,
										query: { type: 'view' },
										state: { id: item.id.value, agreestatus: item.agreestatus }
									}}
								>
									{item.agreecode.value}
								</Link>
							);
							item.agreebankid_creditorgid = (
								<span>
									{item.agreebankid.display}
									<br />
									{item.creditorgid.display}
								</span>
							);
							item.currenyid_money = (
								<span>
									{item.currenyid.display}
									<br />
									{numFormat(item.money.value, '')}
								</span>
							);
							item.begindate_enddate = (
								<span>
									{item.begindate.value}
									<br />
									{item.enddate.value}
								</span>
							);
							processedData.push({
								key: index + 1,
								id: item.id,
								agreecode: item.agreecode,
								agreetype: item.agreetype,
								agreebankid_creditorgid: item.agreebankid_creditorgid,
								currenyid_money: item.currenyid_money,
								begindate_enddate: item.begindate_enddate,
								agreestatus: item.agreestatus,
								version: item.version,
								ts: item.ts
							});
						});
					this.setState({
						data: processedData,
						// pageIndex: data.creditagree.pageinfo.number,
						// pageSize: data.creditagree.pageinfo.size,
						totalElements: data.creditagree.pageinfo.totalElements,
						totalPages: data.creditagree.pageinfo.totalPages
					});
				} else {
					toast({ content: message, color: 'warning' });
					this.err();
				}
			},
			error: (res) => {
				if (res === '') {
					return;
				} else {
					toast({ content: res.message, color: 'danger' });
					this.setState({
						data: []
					});
				}
			}
		});
	};

	// 请求变更记录表格数据
	getModifyRecordData = (id) => {
		Ajax({
			url: rootURL + `creditagree/recordchange`,
			data: { id },
			success: (res) => {
				let { data, message, success } = res;
				console.log(res);
				let modifyRecordData = [];
				res.data.creditagree.rows.forEach((item) => {
					modifyRecordData.unshift(item.values);
				});
				this.setState(
					{
						modifyRecordData
					},
					() => {
						console.log(this.state.modifyRecordData);
					}
				);
			},
			error: (res) => {
				if (res === '') {
					return;
				} else {
					console.log('danger', res.message);
					toast({ content: res.message, color: 'danger' });
					this.setState({
						modifyRecordData: []
					});
				}
			}
		});
	};

	// 点击操作按钮执行对应的操作
	handleOperationType = (operation, index, text, record) => {
		// console.log(operation, index, text, record);
		let id = record.id,
			ts = record.ts;
		switch (operation) {
			case 'commit':
				console.log('提交');
				this.newRequest('commit', id, ts);
				break;
			case 'uncommit':
				console.log('收回');
				this.newRequest('unCommit', id, ts);
				break;
			case 'modifyrecord':
				console.log('变更记录');
				this.getModifyRecordData(id.value);
				this.setState({
					showModal: true
				});
				break;
			case 'end':
				console.log('结束');
				this.newRequest('end', id, ts);
				break;
			case 'unend':
				console.log('取消结束');
				this.newRequest('unend', id, ts);
				break;
			case 'delete':
				console.log('删除', record);
				this.newRequest('del', id, ts);
				break;
			default:
				break;
		}
	};

	// 删除,提交,取消提交,结束,取消结束 接口
	newRequest = (path, id, ts) => {
		const pathMatching = [
			{ path: 'commit', type: '提交' },
			{ path: 'unCommit', type: '收回' },
			{ path: 'end', type: '结束' },
			{ path: 'unend', type: '取消结束' },
			{ path: 'del', type: '删除' }
		];
		let matched = pathMatching.find((item) => item.path == path);
		let data = {
			creditagree: {
				rows: [ { values: { id, ts } } ]
			}
		};
		Ajax({
			url: rootURL + `creditagree/${path}`,
			data: { data },
			success: (res) => {
				let { data, message, success } = res;
				if (success) {
					toast({ content: `${matched.type}成功！` });
					this.getTableData();
				}
			},
			error: (res) => {
				if (res === '') {
					return;
				} else {
					console.log('danger', res.message);
					toast({ content: res.message, color: 'danger' });
				}
			}
		});
	};

	// 输入内容回车搜索
	handleSearchChange = (e) => {
		this.setState({
			keyWords: e.target.value
		});
		if (e.keyCode == 13) {
			this.setState(
				{
					pageIndex: 0,
					pageSize: 10
				},
				this.getTableData
			);
		}
	};

	// 点击放大镜图标搜索
	handleSearchClick = () => {
		this.getTableData(0);
	};

	// 切换分页大小
	handlePageSizeSelect = (val) => {
		this.setState(
			{
				pageSize: val,
				pageIndex: 0
			},
			this.getTableData
		);
	};

	// 切换页码
	handlePageIndexSelect = (val) => {
		this.setState(
			{
				pageIndex: val - 1
			},
			this.getTableData
		);
	};

	// 下拉列表枚举值映射
	enumMapping = (value, ary) => {
		let result = ary.find((item, index) => item.value == value);
		if (!result) return '-';
		return result.key;
	};

	render() {
		let { columns, data, pageSize, pageIndex, totalPages, totalElements, keyWords } = this.state;
		return (
			<div className="bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">授信</Breadcrumb.Item>
					<Breadcrumb.Item active>授信协议管理</Breadcrumb.Item>
				</Breadcrumb>
				<div className="bd-header">
					<div className="bd-title-1">授信协议管理</div>
					<Link to={{ pathname: '/fm/creditdetail', query: { type: 'add' } }}>
						<Button colors="primary" className="btn-2">
							新增
						</Button>
					</Link>
					<InputGroup simple className="search-box fr">
						<FormControl
							value={keyWords}
							onChange={this.handleSearchChange}
							onKeyUp={this.handleSearchChange}
							placeholder="搜索协议编号、授信银行"
						/>
						<InputGroup.Button shape="border">
							<span className="uf uf-search" onClick={this.handleSearchClick} />
						</InputGroup.Button>
					</InputGroup>
				</div>

				<Table emptyText={NoData} columns={columns} data={data} className="bd-table bd-table-double" />

				{Boolean(totalElements) && (
					<PageJump
						onChangePageSize={this.handlePageSizeSelect}
						onChangePageIndex={this.handlePageIndexSelect}
						totalSize={totalElements}
						activePage={pageIndex + 1}
						maxPage={totalPages}
						pageSize={pageSize}
					/>
				)}

				<ModifyRecordModal
					showModal={this.state.showModal}
					modalData={this.state.modifyRecordData}
					enumMapping={this.enumMapping}
					close={() => {
						this.setState({ showModal: false });
					}}
				/>
			</div>
		);
	}
}
