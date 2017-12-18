import React, { Component } from 'react';
import { hashHistory  } from 'react-router';
import {Table, Button, FormControl, Icon, Modal, Select} from 'tinper-bee';
import './index.less';
import BreadCrumbs from '../../../bd/containers/BreadCrumbs';
import PageJump from '../../../../containers/PageJump';
import DeleteModal from '../../../../containers/DeleteModal';
import Refer from '../../../../containers/Refer';
import DatePickerSelect from '../../../pass/containers/DatePickerSelect';
import Menu from 'bee-menus';
import moment from 'moment';
import Dropdown from 'bee-dropdown';
import { toast, sum } from '../../../../utils/utils.js';
import Ajax from '../../../../utils/ajax.js';
import nodataPic from '../../../../static/images/nodata.png';
import '../../../pass/containers/formatMoney.js';
const MenuItem= Menu.Item;
const URL= window.reqURL.fm;
const format = 'YYYY-MM-DD';

export default class Apply extends Component {
	constructor() {
		super();
		this.state = {
			pageIndex: 1,//当前页
			pageSize: 10,//每页显示几条
			maxPage: 1,
			totalSize: 0,
			currentRecord: {},
			dataList: [],
			contstatus: -1,
			contstatusGroup: [
				{content: '全部', key: -1}, 
				{content: '申请待提交', key: 6}, 
				{content: '申请待审批', key: 0}, 
				{content: '申请已审批', key: 1}, 
				{content: '合同待提交', key: 7}, 
				{content: '合同待审批', key: 2}, 
				{content: '合同已审批', key: 3}, 
				{content: '合同在执行', key: 4}, 
				{content: '合同已结束', key: 5}
			],
			statuslNum: [0, 0, 0, 0, 0, 0, 0, 0, 0],
			loanDetail: [
				{
					title: '发起贷款申请',
					content: '申请流程简洁，快速响应',
					path: '/fm/applycard?type=add'
				},
				{
					title: '发起贷款合同',
					content: '便捷操作，一步到位',
					path: '/fm/contract?type=new'
				}
			],
			searchMap: {},
			referCode: 111,
			financorganization: '', 
			transacttype: ''
		};
	}

	componentWillMount () {
		this.getApplyList(this.state.pageIndex, this.state.pageSize, this.state.contstatus);
	}

	//请求列表
	getApplyList = (page, size, contstatus= -1) => {
		const _this = this;
		let {searchMap}= this.state;
		let searchMaps= JSON.parse(JSON.stringify(searchMap));
		searchMaps.contstatus= contstatus;
		if (searchMaps.applydate) {
			searchMaps.applydate= moment(searchMaps.applydate).format(format);
		}
		Ajax({
			url: URL + 'fm/contract/list',
			data: {
				page: page - 1,
				size: size,
				searchParams: {searchMap: searchMaps}
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let dataList = data && data.contractInfo && data.contractInfo.rows.map(item => item.values);
					let { statuslNum }= _this.state;
					let pageinfo= (data && data.contractInfo) ? data.contractInfo.pageinfo || {} : {};
					if (data && data.contractInfo && data.sumcontstatus.rows[0]) {
						let values= data && data.contractInfo && data.sumcontstatus.rows[0].values;
 
						statuslNum= [
							0,
							values.applysubmit.value || 0,
							values.applynoapp.value || 0,
							values.applyapped.value || 0,
							values.contsubmit.value || 0,
							values.contnoapp.value || 0,
							values.contapped.value || 0,
							values.contdoing.value || 0,
							values.contend.value || 0,
						];
						statuslNum[0]= sum(statuslNum);

					}
					_this.setState({
						statuslNum,
						dataList: (dataList && JSON.stringify(dataList)!== '{}') ? dataList : [],
						maxPage: pageinfo.totalPages || 1,
						totalSize: pageinfo.totalElements || 0
					});
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
					_this.err();
				}
			},
			error: function(res) {
				toast({content: res.message || '系统错误,请稍后重试', color: 'warning'});
				_this.err();
			},
		});
	};

	// 按钮操作
	setIconOperation = (path, content, record) => {
		const _this = this;
		let data= {};
		if (path=== 'fm/contract/delete') {//申请删除、合同删除
			data= {
				id: record.id.value || record.id.display,
				billtype: record.billtype.value || record.billtype.display,
				ts: record.ts.value || record.ts.display
			};
		} else if (path=== 'fm/apply/commit' || path=== 'fm/apply/uncommit') {//申请提交、申请收回
			data= { data: { apply_baseinfo: { 
				pageinfo: null,
				rows: [ {
					values: {
						id: record.id,
						ts: record.ts,
						tenantid: record.tenantid
					}
				} ] 
			} } };
		} else if (path=== 'fm/contract/commit' || path=== 'fm/contract/uncommit') {//合同提交、合同收回
			data= { data: { contractInfo: { rows: [ {
				values: {
					id: record.id,
					ts: record.ts
				}
			} ] } } };
		} else if (path=== 'fm/contract/returnContract') {//合同退回
			data= {
				id: record.id.value || record.id.display,
				ts: record.ts.value || record.ts.display
			};
		}
		Ajax({
			url: URL + path,
			data,
			success: function(res) {
				const { message, success } = res;
				if (success) {
					toast({content: content, color: 'success'});
					_this.getApplyList(_this.state.pageIndex, _this.state.pageSize, _this.state.contstatus);
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
			}
		});
	};
	
	//error 请求接口错误时回调
	err = () => {
		this.setState({
			dataList: [],
			maxPage: 1,
			totalSize: 0
		});
	}

	// 页码选择
	onChangePageIndex = (page) => {
		// console.log(page, 'page');
		this.setState({
			pageIndex: page,
		});
		this.getApplyList(page, this.state.pageSize, this.state.contstatus);
	};

	//页数量选择 
	onChangePageSize = (value) => {
		// console.log(typeof value, 'value');
		this.setState({
			pageSize: value,
			pageIndex: 1,
		});
		this.getApplyList(1, value, this.state.contstatus);
	};

	//点击不同状态
	getContStatus = (page, size, contstatus) => {
		this.setState({
			contstatus,
			pageIndex: page
		});
		this.getApplyList(page, size, contstatus);
	};

	//不同状态按钮明细
	operationDetail = (status, applyno) => {
		return [
			{content: '编辑', show: status> 5, icon: 'icon-bianji'},
			{content: '删除', msg: '删除成功', path: 'fm/contract/delete', show: status>5, icon: 'icon-shanchu'},
			{content: '提交', msg: '提交成功', path: status== 6 ? 'fm/apply/commit' : 'fm/contract/commit', show: status> 5, icon: 'icon-tijiao'},
			{content: '收回', msg: '收回成功', path: status== 0 ? 'fm/apply/uncommit' : 'fm/contract/uncommit', show: status== 0 || status== 2, icon: 'icon-shouhui'},
			{content: '退回', msg: '退回成功', path: 'fm/contract/returnContract', show: status== 7 && applyno, icon: 'icon-tuihui'},
			{content: '变更', show: status== 4, icon: 'icon-biangeng'},
			{content: '变更记录', show: status== 4, icon: 'icon-biangengjilu'}
		];
	}

	// 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { title: ' 融资申请' }, { title: '贷款申请' } ];
	render() {
		let { pageSize, pageIndex, maxPage, totalSize, contstatus, contstatusGroup, statuslNum, currentRecord, dataList, loanDetail, searchMap, referCode, financorganization, transacttype } = this.state;
		const menu = (dropArr, key, record) => {
			let id= record.id.display || record.id.value;
			return <Menu
				className='apply-dropdown'
				onClick={items => {
					let item= dropArr[items.key];
					setTimeout(() => {
						if (item.icon=== 'icon-biangengjilu') {//变更记录
							hashHistory.push(`/fm/contract_tracelog?id=${id}&type=log`);
						} else if (item.icon=== 'icon-biangeng') {//变更
							hashHistory.push(`/fm/contract?id=${id}&type=change`);
						} else {//提交，收回, 退回
							this.setIconOperation(item.path, item.msg, record);
						}
					}, 0)
				}}
			>
				{
					dropArr.map((item, index) => {
						return <MenuItem key={index}>{item.content}</MenuItem>
					})	
				}
			</Menu>
		};
		const columns= [
			{ 
				title: '序号', 
				key: 'key', 
				dataIndex: 'key', 
				width: '5%',
				render: (text, record, index) => {
					return (
						<div>{pageSize* (pageIndex - 1) + index + 1}</div>
					);
				} 
			},
			{ 
				title: '交易类型', 
				key: 'transacttype', 
				dataIndex: 'transacttype', 
				width: '10%',
				render: (text, record) => {
					return (
						<div>{record.transacttype.display || record.transacttype.value || '—'}</div>
					);
				} 
			},
			{ 
				title: '合同编号', 
				key: 'contractcode', 
				dataIndex: 'contractcode', 
				width: '15%',
				render: (text, record) => {
					return (
						<div
							className='table-jump' 
							onClick={() =>{
								let contstatus= Number(record.contstatus.value || record.contstatus.display) || 0;
								let id= record.id ? (record.id.display || record.id.value) : ''
								if (contstatus=== 0 || contstatus=== 1 || contstatus=== 6) {
									hashHistory.push(`/fm/applycardpreview?id=${id}`);
								} else {
									hashHistory.push(`/fm/contract_view?id=${id}&type=view`);
								}
							}}		
						>
							{record.contractcode.display || record.contractcode.value || '—'}
						</div>
					);
				} 
			},
			{ 
				title: '贷款机构', 
				key: 'financorganization', 
				dataIndex: 'financorganization', 
				width: '15%',
				render: (text, record) => {
					let financorganization= record.financorganization.display || record.financorganization.value;		//合同
					let fininstitutionid= record.fininstitutionid.display || record.fininstitutionid.value;		//申请
					let contstatus= record.contstatus.display || record.contstatus.value;
					let value= (contstatus== 0 || contstatus== 1 || contstatus== 6) ? fininstitutionid : financorganization;
					return (
						<div>{value || '—'}</div>
					);
				}  
			},
			{ 
				title: '币种', 
				key: 'currtypeid', 
				dataIndex: 'currtypeid', 
				width: '8%',
				render: (text, record) => {
					return (
						<div>{record.currtypeid.display || record.currtypeid.value || '—'}</div>
					);
				}  
			},
			{ 
				title: '贷款金额', 
				key: 'financamount', 
				dataIndex: 'financamount', 
				width: '15%',
				render: (text, record) => {
					let mount= record.financamount.display || record.financamount.value;		//合同
					let scaleMount= record.financamount.scale || -1;	//合同
					let applymny= record.applymny.display || record.applymny.value;		//申请
					let scaleMny= record.applymny.scale || -1;		//申请
					let contstatus= record.contstatus.display || record.contstatus.value;
					let value= (contstatus== 0 || contstatus== 1 || contstatus== 6) ? applymny : mount;
					let scale= (contstatus== 0 || contstatus== 1 || contstatus== 6) ? scaleMny : scaleMount;
					return (
						<div>{value ? Number(value).formatMoney(scale> 0 ? scale : 2, '') : '—'}</div>
					);
				}  
			},
			{ 
				title: '开始日期', 
				key: 'begindate', 
				dataIndex: 'begindate', 
				width: '10%',
				render: (text, record) => {
					return (
						<div>{record.begindate.display || record.begindate.value || '—'}</div>
					);
				} 
			},
			{ 
				title: '结束日期', 
				key: 'enddate', 
				dataIndex: 'enddate', 
				width: '10%',
				render: (text, record) => {
					return (
						<div>{record.enddate.display || record.enddate.value || '—'}</div>
					);
				}  
			},
			{
				title: '操作',
				key: 'operation',
				width: '12%',
				render: (text, record) => {
					let contstatus= Number(record.contstatus.value || record.contstatus.display) || 0;
					let applyno= record.applyno.value || record.applyno.display;
					let billtype= record.billtype.display || record.billtype.value;
					let id= record.id ? (record.id.display || record.id.value) : '';
					let iconArr= [];
					this.operationDetail(contstatus, applyno).map(item => {
						if (item.show) {
							iconArr.push(item);
						}
					});
					
					let showArr= iconArr;
					let dropArr= [];
					if (iconArr.length> 3) {
						showArr= iconArr.slice(0, 2);
						dropArr= iconArr.slice(2);
					}
					return (
						<div>
							{
								showArr.map((item, index) => {
									return (
										<span
											onClick={() => {
												if (item.icon=== 'icon-bianji') {//编辑
													hashHistory.push(`/fm/${billtype=== 'fm0001' ? 'applycard?type=edit' : 'contract?type=update'}&id=${id}`);
												} else if (item.icon=== 'icon-biangeng') {//变更
													hashHistory.push(`/fm/contract?id=${id}&type=change`);
												} else if (item.icon=== 'icon-biangengjilu') {//变更记录
													hashHistory.push(`/fm/contract_tracelog?id=${id}&type=log`);
												} else if (item.icon!== 'icon-shanchu') {//提交, 收回, 退回
													this.setIconOperation(item.path, item.msg, record);
												}
											}}
										>
											{
												item.icon=== 'icon-shanchu' ?
													<DeleteModal
														onConfirm= {() => {this.setIconOperation(item.path, item.msg, record);}}
													/>	
												:
													<Icon className={`iconfont icon-style ${item.icon}`} />
											}
										</span>
									)
								})
							}
							{iconArr.length> 3 &&
								<Dropdown
									trigger={['hover']}
									overlay={menu(dropArr, contstatus, record)}
									animation="slide-up"
								>
									<span>
										<Icon className="iconfont icon-gengduo"/>	
									</span>		
								</Dropdown>
							}
						</div>
					);
				}
			}
		];
		
		return (
			<div className= "fm-apply bd-wraps">
				<BreadCrumbs items={this.breadcrumbItem} />
				<div  className="apply-list">
					{ 
						loanDetail && loanDetail.map((item, index) => {
							return <div
								key={index} 
								className="apply-item"
								onClick={() => {
									hashHistory.push(item.path);
								}}
							>
								<div className="title-box">
									<p className='bd-title-1'>{item.title}</p>
									<p>{item.content}</p>
								</div>
								<div className='icon-box'></div>
							</div>
						})
					}
				</div>	
				<div className="zijinyun-search">
					<FormControl 
						value = {searchMap.contractcode ? searchMap.contractcode : ''}
						className="input-box"
						onChange = {(e) => {
							searchMap.contractcode= e.target.value;
							this.setState({searchMap});
						}}
						placeholder = "按照编号搜索" 
					/>
					<DatePickerSelect  
						placeholder='交易日期'
						value= {searchMap.applydate}
						onChange= {(date) => {
							searchMap.applydate= date;
							this.setState({searchMap});
						}}
					/>
					<Refer 
						placeholder="交易类型"
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/transtypeRef/'}
						refCode={'transtypeRef'}
						refName={'交易类型'}
						value={{refpk: referCode, refname: transacttype ? transacttype : ''}}     
						onChange={item => {
							searchMap.transacttype= item.id;
							this.setState({
								searchMap, 
								referCode: 111, 
								transacttype: item.refname
							});
						}}
						multiLevelMenu={[
							{
								name: ['交易大类'],
								code: ['refname']
							},
							{
								name: ['交易类型'],
								code: ['refname']
							}
						]}
					/>
					<Select 
						className='query-input w124' 
						placeholder='担保方式'
						value={searchMap.guaranteetype}
						onChange= {val => {
							searchMap.guaranteetype= val;
							this.setState({searchMap});
						}}
					>
						<Option value={1}>信用</Option>	
						<Option value={2}>保证</Option>
						<Option value={3}>质押</Option>	
						<Option value={4}>抵押</Option>	
						<Option value={5}>保证金</Option>
						<Option value={6}>混合</Option>
					</Select>
					<Refer 
						placeholder="贷款机构"
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/finbranchRef/'}
						refCode={'finbranchRef'}
						refName={'金融网点'}
						value={{refpk: referCode, refname: financorganization ? financorganization : ''}}     
						onChange={item => {
							searchMap.financorganization= item.id;
							this.setState({
								searchMap, 
								referCode: 111, 
								financorganization: item.refname
							});
						}}
						strField={[{ name: '名称', code: 'refname' }]}
						multiLevelMenu={[
							{
								name: ['金融机构'],
								code: ['refname']
							},
							{
								name: ['金融网点'],
								code: ['refname']
							}
						]}
					/>
					<Button 
						className="search-btn"
						onClick={() => {
							this.getApplyList(1, pageSize, contstatus);
							this.setState({pageIndex: 1});
						}}
					>查询</Button>
					<span
						className='zijinyun-reset'
						onClick= {() => {
							this.setState({
								searchMap: {},
								financorganization: '', 
								transacttype: ''
							});
						}}
					>重置</span>
				</div>
				<div className="item-credit bd-header">
					<ul className="contstatus-group">
						{
							contstatusGroup.map((item, index) => {
								return <li 
									className= {contstatus=== item.key ? 'active' : ''}
									onClick= {this.getContStatus.bind(this, 1, pageSize, item.key)}
								>
									{item.content}
									<span className={statuslNum[index] > 0 ? 'active' : ''}>
										{statuslNum[index]}
									</span>
									<span className='bottom-border'></span>
								</li>
							})
						}
					</ul>
				</div>
				<Table 
					bordered
					className="bd-table"
					emptyText={() => <div>
							<img src={nodataPic} alt="" />
						</div>
					} 
					columns={columns} 
					data={dataList}
					rowKey={record => record.id.value}
				/>
				<PageJump
					pageSize = {pageSize}
					activePage = {pageIndex}
					maxPage = {maxPage}
					totalSize = {totalSize}
					onChangePageSize = {this.onChangePageSize}
					onChangePageIndex = {this.onChangePageIndex}
				/>
			</div>
		);
	}
}
