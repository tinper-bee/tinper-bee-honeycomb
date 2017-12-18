/**
 * 授信协议调整列表页
 * majfd
 * 版本 1.0
 */
import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Table, Button, FormControl, Icon, Modal, Select, InputGroup, Popconfirm } from 'tinper-bee';
import Loading from 'bee-loading';
import { Link } from 'react-router';
import 'bee-loading-state/build/Loadingstate.css';
import { numFormat, toast } from '../../../../utils/utils.js';
import Ajax from '../../../../utils/ajax.js';
import DeleteModal from '../../../../containers/DeleteModal';
import MsgModal from '../../../../containers/MsgModal';
import { CheckBox, CheckBoxs } from '../../../../containers/CheckBoxs';
import PageJump from '../../../../containers/PageJump';
import CheckTable from '../../../../containers/CheckTable';
import Refer from '../../../../containers/Refer';
import BreadCrumbs from '../../../bd/containers/BreadCrumbs';
import NoData from '../../../../containers/NoData';
import Form from 'bee-form';
import { CheckboxItem, RadioItem, TextAreaItem, InputItem, DateTimePickerItem } from 'containers/FormItems';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import moment from 'moment';
const rootURL = window.reqURL.fm;
const format = 'YYYY-MM-DD';
const { FormItem } = Form;
import './index.less';

export default class CreditAdjustList extends Component {
	constructor() {
		super();
		this.state = {
			checkedList: [],
			pageIndex: 1, //当前页
			pageSize: 10, //每页显示几条
			maxPage: 1,
			totalSize: 0,
			currentRecord: {},
			currentKey: 0,
			keyWords: '', //模糊查询关键字
			loadingShow: false,
			dataList: [],
			MsgModalShow: false,
		};
	}

	componentWillMount() {
		this.getCreditListQuery(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
	}

	componentDidMount() {}

	getCreditListQuery(page, size, keyWords = '') {
		const _this = this;
		const searchMap = {
			keyWords: keyWords
		};
		Ajax({
			url: rootURL + 'fm/creditAdjust/pageQuery',
			data: {
				page: page - 1,
				size,
				searchParams: {
					searchMap
				}
			},
			success: (res) => {
				const { data, message, success } = res;
				if (success) {
					let dataList = data && data.head && data.head.rows && data.head.rows.map((item) => item.values);
					let pageinfo = data && data.head ? data.head.pageinfo || {} : {};
					console.log('666', dataList && JSON.stringify(dataList) !== '{}' ? dataList : []);
					_this.setState({
						dataList: dataList && JSON.stringify(dataList) !== '{}' ? dataList : [],
						maxPage: pageinfo.totalPages || 1,
						totalSize: pageinfo.totalElements || 0,
						loadingShow: false
					});
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: (res) => {
				toast({ content: res.message, color: 'danger' });
			}
		});
	}

	// 页码选择
	onChangePageIndex = (page) => {
		//console.log(page, 'page');
		this.setState({
			pageIndex: page
		});
		this.getCreditListQuery(page, this.state.pageSize);
	};

	//页数量选择
	onChangePageSize = (value) => {
		//console.log(value, 'value');
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getCreditListQuery(1, value);
	};

	//模糊查询操作
	handleSearch = (val) => {
		// console.log('模糊查询'+ val);
		this.getCreditListQuery(1, this.state.pageSize, this.state.keyWords);
		this.setState({ pageIndex: 1 });
	};

	//路由跳转到结算明细页面
	routerJump = (record, type) => {
		let id = record.id.display || record.id.value || 0;
		hashHistory.push(`/fm/creditadjustdetail?id=${id}&type=${type}`);
	};
	// 点击操作按钮执行对应的操作
	handleOperationType = (type, record, index) => {
		// console.log(operation, index, text, record);
		let reqdata = {};
		let url = '';
		let errorflag = false;
		switch (type) {
			case 'commit':
				console.log('提交');
				(url = rootURL + 'fm/creditAdjust/commit'),
					(reqdata = {
						data: {
							head: {
								pageinfo: null,
								rows: [
									{
										values: {
											tenantid: { value: record.tenantid.value },
											id: { value: record.id.value },
											ts: { value: record.ts.value }
										}
									}
								]
							}
						}
					});
				break;
			case 'uncommit':
				console.log('取消提交');
				(url = rootURL + 'fm/creditAdjust/uncommit'),
					(reqdata = {
						data: {
							head: {
								pageinfo: null,
								rows: [
									{
										values: {
											tenantid: { value: record.tenantid.value },
											id: { value: record.id.value },
											ts: { value: record.ts.value }
										}
									}
								]
							}
						}
					});
				break;
			case 'delete':
				console.log('删除');
				url = rootURL + 'fm/creditAdjust/logicDel';
				reqdata = {
					data: {
						head: {
							pageinfo: null,
							rows: [
								{
									values: {
										tenantid: { value: record.tenantid.value },
										id: { value: record.id.value },
										ts: { value: record.ts.value }
									},
									status: 3
								}
							]
						}
					}
				};
				break;
			case 'del':
				console.log('表头删除选中');
				console.log(this.state.checkedList);
				const selectData = this.state.checkedList;
				let req = [];
				selectData.map((item) => {
					if(item.vbillstatus.value != 0){
						toast({content: '单据编号['+item.vbillno.value+']的单据非待提交态，请重新选择',color: 'warning'});
						this.setState({MsgModalShow:false});
						errorflag = true;
						return;
					}
					req.push({
						values: {
							tenantid: item.tenantid,
							id: item.id,
							ts: item.ts
						},
						status: 3
					});
				});
				if (errorflag || req.length == 0 || req[0].values == null || req[0].values.id == null) {
					return;
				}
				url = rootURL + 'fm/creditAdjust/logicDel';
				reqdata = {
					data: {
						head: {
							pageinfo: null,
							rows: req
						}
					}
				};
				break;
			default:
				break;
		}
		this.reqAjax(type, url, reqdata);
	};
	// ajax请求
	reqAjax = (type, url, reqdata) => {
		if (url == null || url == '' || reqdata == null || reqdata == '') {
			return;
		}
		Ajax({
			url: url,
			data: reqdata,
			success: (res) => {
				const { data, message, success } = res;
				if (success) {
					let mess =
						type == 'commit'
							? '提交成功'
							: type == 'uncommit' ? '取消提交' : type == 'delete' ? '删除成功' : '' + '...';
					toast({ content: mess, color: 'success' });
					this.getCreditListQuery(this.state.pageIndex, this.state.pageSize, this.state.keyWords);
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};

	// 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { title: '融资交易' }, { title: '授信调整' } ];

	render() {
		let {
			dataList,
			pageSize,
			pageIndex,
			maxPage,
			totalSize,
			keyWords,
			currentRecord,
			loadingShow,
			checkedList,
			MsgModalShow,
			currentKey
		} = this.state;

		let columns = [
			{
				title: '序号',
				key: 'key',
				dataIndex: 'key',
				width: '5%',
				render: (text, record, index) => {
					return <div>{(pageIndex - 1) * pageSize + index + 1}</div>;
				}
			},
			{
				title: '组织',
				key: 'orgid',
				dataIndex: 'orgid',
				width: '15%',
				render: (text, record) => {
					return <div>{record.orgid.display || record.orgid.value}</div>;
				}
			},
			{
				title: '单据编号/授信协议',
				key: 'vbillno',
				dataIndex: 'vbillno',
				width: '15%',
				render: (text, record) => {
					let vbillno = record.vbillno.display || record.vbillno.value;
					let creditid = record.creditid.display || record.creditid.value;
					return (
						<div>
							<span
								className="contract-no"
								onClick={() => {
									this.routerJump(record, 'detail');
								}}
							>
								{vbillno}
							</span>
							<br />
							<span>{creditid}</span>
						</div>
					);
				}
			},
			{
				title: '授信协议类型/协议类别',
				key: 'credittypeid',
				dataIndex: 'credittypeid',
				width: '15%',
				render: (text, record) => {
					let credittypeid = record.credittypeid.display || record.credittypeid.value;
					let bankcretypeid = record.bankcretypeid.display || record.bankcretypeid.value;
					return (
						<div>
							<span>{credittypeid}</span>
							<br />
							<span>{bankcretypeid}</span>
						</div>
					);
				}
			},
			{
				title: '回写方向',
				key: 'writebackdir',
				dataIndex: 'writebackdir',
				width: '8%',
				render: (text, record) => {
					let dir = record.writebackdir.display || record.writebackdir.value;
					let writebackdir = dir == 1 ? '释放' : dir == 2 ? '占用' : '';
					return <div>{writebackdir}</div>;
				}
			},
			{
				title: '授信币种',
				key: 'cccurrtypeid',
				dataIndex: 'cccurrtypeid',
				width: '8%',
				render: (text, record) => {
					return <div>{record.cccurrtypeid.display || record.cccurrtypeid.value}</div>;
				}
			},
			{
				title: '占用授信额度',
				key: 'ccamount',
				dataIndex: 'ccamount',
				width: '11%',
				render: (text, record) => {
					let ccamount = record.ccamount.display || record.ccamount.value;
					return <span>{ccamount ? numFormat(parseFloat(ccamount), '') : 0.0}</span>;
				}
			},
			{
				title: '审批状态',
				key: 'vbillstatus',
				dataIndex: 'vbillstatus',
				width: '8%',
				render: (text, record) => {
					let vbillstatus = record.vbillstatus.display || record.vbillstatus.value;
					return (
						<div>
							{vbillstatus == 0 ? (
								'待提交'
							) : vbillstatus == 3 ? (
								'待审批'
							) : vbillstatus == 2 ? (
								'审批中'
							) : vbillstatus == 1 ? (
								'审批通过'
							) : (
								''
							)}
						</div>
					);
				}
			},
			{
				title: '操作',
				key: 'operation',
				width: '15%',
				render: (text, record, index) => {
					let vbillstatus = record.vbillstatus.display || record.vbillstatus.value;
					return (
						<div>
							{/*编辑*/}
							{vbillstatus === 0 && (
								<Icon
									className="iconfont icon-bianji icon-style"
									onClick={(e) => this.routerJump(record, 'edit')}
								/>
							)}
							{/* 提交 */}
							{vbillstatus === 0 && (
								<Icon
									data-tooltip="提交"
									className="uf uf-correct icon-style"
									onClick={(e) => this.handleOperationType('commit', record, index)}
								/>
							)}
							{/* 取消提交 */}
							{vbillstatus === 3 && (
								<Icon
									data-tooltip="取消提交"
									className="uf uf-close icon-style"
									onClick={(e) => this.handleOperationType('uncommit', record, index)}
								/>
							)}
							{/*删除*/}
							{vbillstatus === 0 && (
								<DeleteModal onConfirm={this.handleOperationType.bind(this, 'delete', record, index)} />
								// <Popconfirm
								// 	content="确认删除?"
								// 	onClose={this.handleOperationType.bind(this, 'delete', record, index)}
								// >
								// 	<Icon className="iconfont icon-shanchu icon-style" />
								// </Popconfirm>
							)}
						</div>
					);
				}
			}
		];

		return (
			<div className="bd-wraps fm-creditadjust">
				<BreadCrumbs items={this.breadcrumbItem} />
				<div className="bd-header">
					<span className="bd-title-1">授信调整管理</span>
					<Button
						className="btn-2 add-button"
						onClick={() => {
							hashHistory.push('/fm/creditadjustdetail?type=add');
						}}
					>
						新增
					</Button>
					<Button
						colors="primary"
						className="btn-2 btn-cancel"
						onClick={() => {
							if(checkedList != null && checkedList.length>0){
								this.setState({MsgModalShow:true});
							}else{
								toast({ content: '没有要删除的数据，请选择', color: 'warning' });
							}
						}}
					>
						删除
					</Button>
					<InputGroup simple className="search-box fr">
						<FormControl
							value={keyWords}
							onChange={(e) => {
								this.setState({
									keyWords: e.target.value
								});
							}}
							onKeyDown={(e) => {
								if (e.keyCode === 13) {
									this.handleSearch(e.target.value);
								}
							}}
							placeholder="搜索单据编号、授信协议"
						/>
						<InputGroup.Button shape="border">
							<span className="uf uf-search" onClick={this.handleSearch.bind(this, keyWords)} />
						</InputGroup.Button>
					</InputGroup>
				</div>
				<CheckTable
					bordered
					className="bd-table double"
					emptyText={NoData}
					columns={columns}
					data={dataList}
					rowKey={(record) => record.id.value}
					selectedList={(checkedList) => this.setState({ checkedList })}
				/>
				<PageJump
					pageSize={pageSize}
					activePage={pageIndex}
					maxPage={maxPage}
					totalSize={totalSize}
					onChangePageSize={this.onChangePageSize}
					onChangePageIndex={this.onChangePageIndex}
				/>
				<MsgModal
					show={MsgModalShow}
					title={'确定要删除这些信息吗？'}
					/* content={'确定要删除这些信息吗？'} */
					icon="icon-tishianniuzhuyi"
					onConfirm={() => {
							this.handleOperationType('del');
						}}
					onCancel={() => {
						this.setState({ MsgModalShow: false });
					}}
				/>
			</div>
		);
	}
}
