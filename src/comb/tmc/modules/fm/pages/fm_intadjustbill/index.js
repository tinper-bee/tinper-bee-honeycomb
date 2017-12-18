import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import {Table, Button, FormControl, Icon, Modal, Select, InputGroup } from 'tinper-bee';
import './index.less';
import BreadCrumbs from '../../../bd/containers/BreadCrumbs';
import PageJump from '../../../../containers/PageJump';
import DeleteModal from '../../../../containers/DeleteModal';
import Refer from '../../../../containers/Refer';
import Aabill from '../../containers/fm_iabill';
import { toast } from '../../../../utils/utils.js';
import '../../../pass/containers/formatMoney.js';
import Ajax from '../../../../utils/ajax.js';
import nodataPic from '../../../../static/images/nodata.png';
const Option= Select.Option;
const URL= window.reqURL.fm;

export default class IntAdjustBill extends Component {
	constructor() {
		super();
		this.state = {
			pageIndex: 1,//当前页
			pageSize: 10,//每页显示几条
			maxPage: 1,
			totalSize: 0,
			currentRecord: {},
			currentStatus: '',
			keyWords:'',	//模糊查询关键字
			showAddModal: false,
			showBillModal: false,
			dataList: [],
			isDisable: false,
			bodyList: {},
			isEditRate: false,
			isEditGap: false
		};
	}

	componentWillMount () {
		this.getIntAdjustBill(this.state.pageIndex, this.state.pageSize);
	}

	//请求列表
	getIntAdjustBill = (page, size) => {  
		const _this = this;
		Ajax({
			url: URL + 'fm/interests/searchLx',
			data: {
				page: page-1,
				size,
				searchParams: {
					searchMap: {
						vbillno: _this.state.keyWords
					}
				}
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let dataList = data && data.head && data.head.rows && data.head.rows.map(item => item.values);
					_this.setState({
						dataList: (dataList && JSON.stringify(dataList)!== '{}') ? dataList : [],
						maxPage: (data && data.head && data.head.pageinfo) ? data.head.pageinfo.totalPages : 1,
						totalSize: (data && data.head && data.head.pageinfo) ? data.head.pageinfo.totalElements : 0
					});
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
					_this.err();
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
				_this.err();
			}
		}); 
	};

	// icon按钮操作
	setIconOperation = (path, content, record) => {
		const _this = this;
		let { pageIndex, pageSize }= this.state;
		let values= {};
		if (path=== 'delLx') {
			values= {
				id: record.id,
				ts: record.ts,
				tenantid: record.tenantid,
				vbillstatus: record.vbillstatus
			};
		} else {
			values= {
				id: record.id,
				ts: record.ts
			};
		}
		Ajax({
			url:URL + 'fm/interests/' + path,
			data:{ data: { head: { rows: [{ values }] } } },
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					toast({content: content, color: 'success'});
					_this.getIntAdjustBill(pageIndex, pageSize);
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'danger'});
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
			}
		});
	};

	// 编辑 or 增加  行
	editAddRow = (record, status) => {
		// console.log(record, JSON.stringify(record.exchangerate), 'record', status);
		const _this = this;
		let { bodyList }= this.state;
		let params= {
			data: {
				head: {
					rows: [
						{
							values: null
						}
					]
				}
			}
		};
		let url= "fm/interests/updateLx";
		if (status=== 'add') {
			if (!(record.vbillno.display || record.vbillno.value)) {
				toast({color: 'danger', content: '请输入放款编号'});
				return false;
			}
			params.data.head.rows[0].values= {
				iapayablemny: record.iapayablemny,
				exchangerate: record.exchangerate,
				adjediapayablemny: record.adjediapayablemny,
				vbillno: record.vbillno,
				dr: {display: 'null', scale: -1, value: 0},
				creator: {display: 'null', scale: -1, value: 'wangsicong'}
			};
			url= "fm/interests/insertLx";
			params.data.bodys= {
				rows: [
					{
						values: bodyList
					}
				]		
			};
		} else {
			params.data.head.rows[0].values= {
				id: record.id,
				exchangerate: record.exchangerate,
				adjustmny: record.adjustmny,
				adjediapayablemny: record.adjediapayablemny,
				ts: record.ts,
				tenantid: record.tenantid
			};
		}

		Ajax({
			url: URL + url,
			data: params,
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					toast({content: status=== 'add' ? '增加成功...' : '修改成功...', color: 'success'});
					_this.getIntAdjustBill(_this.state.pageIndex, _this.state.pageSize);
					_this.setState({
						showAddModal: false
					});
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
			}
		});
	};

	//放款编号详情
	getVbillNoDetail = billid => {
		const _this = this;
		let { currentRecord, isDisable }= this.state;
		Ajax({
			url: URL + 'fm/interests/mouseOut',
			data: {billid},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let record= data.head.rows[0].values;
					let adjediapayablemny= JSON.parse(JSON.stringify(record.iapayablemny));
					let adjustmny= JSON.parse(JSON.stringify(record.iapayablemny));
					let exchangerate= JSON.parse(JSON.stringify(record.exchangerate));
					currentRecord.adjediapayablemny= adjediapayablemny;
					currentRecord.adjustmny= adjustmny;
					currentRecord.exchangerate= exchangerate;
					currentRecord.adjustmny.display= '';
					currentRecord.adjustmny.value= '';
					currentRecord.iapayablemny= record.iapayablemny;
					isDisable= false;
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
				}
				_this.setState({
					currentRecord,
					isDisable
				});
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
				_this.setState({currentRecord});
			}
		});
	};

	//error 请求接口错误时回调
	err = () => {
		this.setState({
			dataList: [],
			maxPage: 1,
			totalSize: 0,
		});
	}

	// 页码选择
	onChangePageIndex = (page) => {
		//console.log(page, 'page');
		this.setState({
			pageIndex: page
		});
		this.getIntAdjustBill(page, this.state.pageSize);
	};

	//页数量选择 
	onChangePageSize = (value) => {
		//console.log(value, 'value');
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getIntAdjustBill(1, value);
	};

	//模糊查询操作
	handleSearch = val => {
		// console.log('模糊查询'+ val);
		this.getIntAdjustBill(1, this.state.pageSize);
		this.setState({pageIndex: 1});
	}

	// 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { title: '融资交易' }, { title: '利息调整' } ];

	render() {
		let {dataList, pageSize, pageIndex, maxPage, totalSize, showAddModal, showBillModal, keyWords, currentRecord, currentStatus, isDisable, bodyList, isEditRate, isEditGap} = this.state;
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
				title: '放款编号', 
				key: 'vbillno', 
				dataIndex: 'vbillno', 
				width: '18%',
				render: (text, record) => {
					return (
						<div>{record.vbillno.display || record.vbillno.value || '—'}</div>
					);
				} 
			},
			{ 
				title: '本币汇率', 
				key: 'exchangerate', 
				dataIndex: 'exchangerate', 
				width: '15%',
				render: (text, record) => {
					let value= record.exchangerate.display || record.exchangerate.value;
					return (
						<div>{value ? parseFloat(value).toFixed(4) : '—'}</div>
					);
				}  
			},
			{ 
				title: '系统应付利息', 
				key: 'iapayablemny', 
				dataIndex: 'iapayablemny', 
				width: '20%',
				render: (text, record) => {
					let value= record.iapayablemny.display || record.iapayablemny.value;
					let scale= record.iapayablemny.scale || -1;
					return (
						<div>{value ? Number(value).formatMoney(scale > 0 ? scale : 2, '') : '—'}</div>
					);
				} 
			},
			{ 
				title: '调整后应付利息', 
				key: 'adjediapayablemny', 
				dataIndex: 'adjediapayablemny', 
				width: '20%',
				render: (text, record) => {
					let value= record.adjediapayablemny.display || record.adjediapayablemny.value;
					let scale= record.adjediapayablemny.scale || -1;
					return (
						<div>{value ? Number(value).formatMoney(scale > 0 ? scale : 2, '') : '—'}</div>
					);
				}  
			},
			{ 
				title: '审批状态', 
				key: 'vbillstatus', 
				dataIndex: 'vbillstatus', 
				width: '10%',
				render: (text, record) => {
					let vbillstatus= record.vbillstatus.display || record.vbillstatus.value;
					let vbillName= vbillstatus== 0 ? '待提交' : (vbillstatus== 3 ? '待审批' : (vbillstatus== 2 ? '审批中' : '审批通过'));
					return (
						<div>{vbillName}</div>
					);
				}  
			},
			{
				title: '操作',
				key: 'operation',
				width: '12%',
				render: (text, record, index) => {
					let vbillstatus= record.vbillstatus.display || record.vbillstatus.value;
					return (
						<div>
							<span
								onClick={() => {
									this.setState({
										showBillModal: true,
										currentRecord: record
									});
								}}
							>
								<Icon className="icon-style lixiqindan iconfont icon-liancha"/>
							</span>
							{vbillstatus== 0 &&
								[ <span
									onClick={() => {
										this.setState({
											showAddModal: true,
											currentRecord: JSON.parse(JSON.stringify(record)),
											currentStatus: 'edit',
											isEditRate: false,
											isEditGap: false
										});
									}}
								>
									<Icon className="icon-style iconfont icon-bianji" />
								</span>,
								<span>
									<DeleteModal
										onConfirm= {() => {this.setIconOperation('delLx', '删除成功', record);}}
									/>	
								</span>,
								<span
									onClick={() => {
										this.setIconOperation('adjustCommit', '提交成功', record);
									}}
								>
									<Icon className="icon-style iconfont icon-tijiao"/>
								</span> ]
							}
							{vbillstatus== 3 &&
								<span
									onClick={() => {
										this.setIconOperation('adjustUncommit', '收回成功', record);
									}}
								>
									<Icon className="icon-style iconfont icon-shouhui"/>
								</span>
							}
						</div>
					);
				}
			}
		];
		
		return (
			<div className= "fm-intadjustbill bd-wraps">
				<BreadCrumbs items={this.breadcrumbItem} />
				<div className="bd-header">
					<div className='credit-title'>
						<span className="bd-title-1">利息调整</span>	
						<Button 
							className="btn-2 add-button"
							onClick={() => {
								this.setState({
									showAddModal: true,
									currentRecord: {},
									currentStatus: 'add',
									isDisable: true
								});
							}}
						>新增</Button>
					</div>
					<div className="search-box fr">
						<FormControl
							className='input-box'
							value = {keyWords}
                            onChange = {(e) => {								
                                this.setState({
                                    keyWords: e.target.value
                                });
                            }}
                            onKeyDown = {(e) => {
								if(e.keyCode === 13) {
                                    this.handleSearch(e.target.value);
                                }
                            }}
                            placeholder = "搜索放款编号" 
						/>
						<Icon className="iconfont icon-icon-sousuo" onClick={this.handleSearch.bind(this, keyWords)}/>
					</div>
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
				
				<Modal
					className="intadjust-bill-modal"
					show={ showAddModal } 
					backdrop="static"
					animation={false}
					onHide={() => {
						this.setState({
							showAddModal: false,
							isDisable: false
						});
					}}
				>
					<div className='modal-header'>
						<span className='modal-title'>利息调整</span>
						<span 
							className='modal-close iconfont icon-guanbi'
							onClick={() => {
								this.setState({
									showAddModal: false,
									isDisable: false
								});
							}}
						></span>
					</div>
					<div className='modal-body'>
						<ul className='modal-list'>
							<li className='modal-item item-refer'>
								<span className='label-title isRequire'>放款编号:</span>
								<Refer
									ctx={'/uitemplate_web'}
									className='theme-title'
									refModelUrl={'/fm/financepayRef/'}
									refCode={'financepayRef'}
									refName={'放款编号'}
									value={{refpk: 111, refname: currentRecord.vbillno ? currentRecord.vbillno.display || currentRecord.vbillno.value : ''}}
									onChange={item => {
										let isEmpty= JSON.stringify(item)=== '{}';
										let isDisable= false;
										currentRecord.vbillno= currentRecord.vbillno || {scale: -1};
										currentRecord.vbillno.value= isEmpty ? '' : item.loancode;
										currentRecord.vbillno.display= isEmpty ? '' : item.loancode;
										if (!isEmpty && item.id) {
											this.getVbillNoDetail(item.id);
										} else {
											isDisable= true;
											currentRecord.exchangerate= currentRecord.exchangerate || {scale: -1};
											currentRecord.iapayablemny= currentRecord.iapayablemny || {scale: -1};
											currentRecord.adjustmny= currentRecord.adjustmny || {scale: -1};
											currentRecord.adjediapayablemny= currentRecord.adjediapayablemny || {scale: -1};
											currentRecord.exchangerate.display= '';
											currentRecord.exchangerate.value= '';
											currentRecord.iapayablemny.display= '';
											currentRecord.iapayablemny.value= '';
											currentRecord.adjustmny.display= '';
											currentRecord.adjustmny.value= '';
											currentRecord.adjediapayablemny.display= '';
											currentRecord.adjediapayablemny.value= '';
										}
										this.setState({currentRecord, isDisable});
									}}
									multiLevelMenu={[
										{
											name: ['放款编号', '贷款机构', '放款金额'],
											code: ['loancode', 'financorgid_n', 'loanmny']
										}
									]}
								/>
							</li>
							<li className='modal-item'>
								<span className='label-title isRequire'>本币汇率:</span>
								<FormControl 
									disabled={isDisable}
									type="text" 
									value = {
										currentRecord.exchangerate ? (isEditRate ? currentRecord.exchangerate.display || currentRecord.exchangerate.value : Number(currentRecord.exchangerate.display || currentRecord.exchangerate.value).toFixed(4)) : null
									}
									size = 'sm'
									className= 'modal-input input-box theme-title'
									onBlur= {e => {
										let val= e.target.value;
										if (val) {
											currentRecord.exchangerate.display= Number(val).toFixed(4);
											currentRecord.exchangerate.value= Number(val).toFixed(4);
											this.setState({
												currentRecord,
												isEditRate: false
											});
										}
									}} 
									onFocus={() => {this.setState({isEditRate: true});}}
									onChange= { e => {
										let val= e.target.value;
										let reg= /^[0-9]*\.?[0-9]*$/;
										if (val && !reg.test(val)) {
											toast({content: '本币汇率格式错误，只能输入数字', color: 'warning'});
											return ;
										}
										currentRecord.exchangerate.display= val;
										currentRecord.exchangerate.value= val;
										this.setState({currentRecord});
									}}
								/>
							</li>
							<li className='modal-item'>
								<span className='label-title'>系统应付利息:</span>
								<span className='theme-title'>
									{currentRecord.iapayablemny ? 
										Number(currentRecord.iapayablemny.display || currentRecord.iapayablemny.value || 0).formatMoney(2, '') : '0.00'}
								</span>
							</li>
							<li className='modal-item'>
								<span className='label-title'>调整差额:</span>
								<FormControl 
									type="text"
									disabled={isDisable} 
									value = {currentRecord.adjustmny ? (isEditGap ? currentRecord.adjustmny.display || currentRecord.adjustmny.value || 0 : Number(currentRecord.adjustmny.display || currentRecord.adjustmny.value || 0).toFixed(2)) : 0}
									size = 'sm'
									className= 'modal-input input-box theme-title'
									onBlur={() => {
										this.setState({isEditGap: false});
									}}
									onFocus={() => {
										this.setState({isEditGap: true});
									}}
									onChange= {e => {
										let val= e.target.value;
										let reg= /^[-]?[0-9]*\.?[0-9]*$/;
										if (val && !reg.test(val)) {
											toast({content: '调整差额格式错误，只能输入数字', color: 'warning'});
											return ;
										}
										let iapayablemny= currentRecord.iapayablemny.display || currentRecord.iapayablemny.value;
										currentRecord.adjustmny.display= val;
										currentRecord.adjustmny.value= val;
										currentRecord.adjediapayablemny.display= iapayablemny- val;
										currentRecord.adjediapayablemny.value= iapayablemny-val;
										this.setState({
											currentRecord
										});
									}}
								/>
							</li>
						</ul>
					</div>
					<div className='modal-footer'>
						<div>
							<span className='label-title'>调整后应付利息:</span>
							<span className='modal-highlight'>{currentRecord.adjediapayablemny ? Number(currentRecord.adjediapayablemny.display || currentRecord.adjediapayablemny.value || 0).formatMoney(2, '') : '0.00'}</span>		
						</div>
						<div className='btn-group'>
							<Button 
								className= "btn-2"	
								onClick={() => {
									if (JSON.stringify(currentRecord)=== '{}') {
										toast({color: 'danger', content: '请输入放款编号...'});
										return;
									}
									this.editAddRow(currentRecord, currentStatus);
								}}
							>保存</Button>
							<Button 
								className= "btn-2 btn-cancel"		
								onClick={() => {
									this.setState({
										showAddModal: false,
										isDisable: false
									});
								}}
							>取消</Button>
						</div>
					</div>
				</Modal>
				{
					showBillModal && 
					<Aabill 
						showModal={showBillModal} 
						overdue={true} 
						needmainTable={false}
						iabillKey={currentRecord.id.value || currentRecord.id.display}
						parenttype='3'
						upClick={() => {
							this.setState({
								showBillModal: false
							});
						}}
					/>
				}
			</div>
		);
	}
}
