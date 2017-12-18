import React, { Component } from 'react';
import { Breadcrumb, Row, Col, Table, Button, FormControl, Icon, Modal, Select, Popconfirm } from 'tinper-bee';
import axios from 'axios';
import Ajax from '../../../../utils/ajax.js';
import {Link} from 'react-router';
import './index.less';
import PageJump from '../../../../containers/PageJump';
import { hashHistory } from 'react-router';
import DeleteModal from '../../../../containers/DeleteModal';
import Loading from 'bee-loading';
import Menu, { Item as MenuItem } from 'bee-menus';
import DatePickerSelect from '../../../pass/containers/DatePickerSelect';
import moment from 'moment';
import Refer from '../../../../containers/Refer';
import '../../../pass/containers/formatMoney.js';
import Dropdown from 'bee-dropdown';
import 'bee-loading-state/build/Loadingstate.css';
import { numFormat, sum, toast } from '../../../../utils/utils.js';
import nodataPic from '../../../../static/images/nodata.png';

const SubMenu = Menu.SubMenu;
const URL= window.reqURL.fm;
const Option= Select.Option;
const format = 'YYYY-MM-DD';

function onVisibleChange(visible) {
	//console.log(visible);
}

export default class FinancepayManage extends Component {
	constructor() {
		super();
		this.state = {
			pageIndex: 1,//当前页
			pageSize: 10,//每页显示几条
			maxPage: 1,//总页数
			totalSize: 0,//总数
			currentRecord: {},
			currentIndex: 0,
			currentStatus: '',
			keyWords:'',	//模糊查询关键字
			contstatus: -1,
			contstatusGroup: [
				{content: '全部', key: -1},  
				{content: '待结算', key: 0}, 
				{content: '结算中', key: 1},  
				{content: '结算成功', key: 2},  
				{content: '结算失败', key: 3}, 
			],
			statuslNum: [0, 0, 0, 0, 0],
			loadingShow: false,
			dataList: [],
			showDeleteModal: false,
			rowKey: 0,
			searchMap: {},
			referCode: '',
			loancode:'',//放款编号
			loanmny:''
		};
    }

    componentWillMount () {
		this.getFinancepayManage(this.state.pageIndex, this.state.pageSize);
	}

	//error 请求接口错误时回调
	err = () => {
		this.setState({
			dataList: [],
			maxPage: 1,
			totalSize: 0,
			loadingShow: false
		});
	}

	//请求列表
	getFinancepayManage = (page, size, contstatus=-1) => {
		const _this = this;
		let {searchMap}= this.state;
		let searchMaps= JSON.parse(JSON.stringify(searchMap));
		console.log(this.state,'finance')
		searchMaps.contstatus= contstatus;
		if (searchMaps.loandate) {
			searchMaps.loandate= moment(searchMaps.loandate).format(format);
		}
		Ajax({
			url: URL + 'fm/loan/setflaglist',
			data: {
				page: page-1,
				size,
				searchParams: {searchMap: searchMaps}
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let dataList = data && data.head && data.head.rows.map(item => item.values);
					let { statuslNum }= _this.state;
					let pageinfo= (data && data.head) ? data.head || {} : {};
					if (data && data.head && data.sumSettleVo.rows[0]) {
						let values= data && data.head && data.sumSettleVo.rows[0].values;
 
						statuslNum= [
							values.allNum.value || 0,
							values.waitSettlement.value || 0,
							values.settlementing.value || 0,
							values.settlementSuccess.value || 0,
							values.settlementFail.value || 0
						];
						//statuslNum[0]= sum(statuslNum);

					}
					_this.setState({
						statuslNum,
						dataList: (dataList && JSON.stringify(dataList)!== '{}') ? dataList : [],
						maxPage: (data && data.head && data.head.pageinfo) ? data.head.pageinfo.totalPages : 1,
						totalSize: (data && data.head && data.head.pageinfo) ? data.head.pageinfo.totalElements : 0,
						loadingShow: false
					});
					
				} else {
					//toast({content: message, color: 'warning'});
					_this.err();
				}
			},
			error: function(res) {
				if(res===''){
					return 
				}else{
					//toast({content: res.message, color: 'danger'});
					_this.setState({
						dataList: [],
						maxPage: 1,
						totalSize: 0,
						loadingShow: false
					});
				}
			}
		})
	};

	// 刪除行
	delRow = (currentRecord) => {
		const _this = this;
		let { dataList, pageIndex, pageSize }= this.state;
		const data ={
			data:{
				head: {
					rows: [
							{
							values:	{
									id: { value: currentRecord.id.value},
									ts: { value: currentRecord.ts.value}
								}
							}
						]
					}
				}
			}
            
		Ajax({
			url: URL + 'fm/loan/del',
			data: data,
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					toast({content: '删除成功...', color: 'success'});
					if (dataList.length=== 1 && pageIndex> 1) {
						pageIndex--;
					} else if (dataList.length=== 1 && pageIndex=== 1) {
						return;
					}
					_this.getFinancepayManage(pageIndex, pageSize);
				} else {
					//toast({content: JSON.stringify(message), color: 'warning'});
				}
			},
			error: function(res) {
				//toast({content: res.message, color: 'danger'});
			}
		})
	};


    // 页码选择
	onChangePageIndex = (page) => {
		//console.log(page, 'page');
		this.setState({
			pageIndex: page
		});
		this.getFinancepayManage(page, this.state.pageSize, this.state.contstatus);
	};

    //页数量选择 
	onChangePageSize = (value) => {
		//console.log(value, 'value');
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		console.log(this.state.pageSize,'pagesiez')
		this.getFinancepayManage(1, value, this.state.contstatus);
	};

	//点击不同状态
	getContStatus = (page, size, contstatus) => {
		this.setState({
			contstatus,
			loadingShow: false,
			pageIndex: page
		});
		this.getFinancepayManage(page, size, contstatus);
	};

	//模糊查询操作
	handleSearch = val => {
		// console.log('模糊查询'+ val);
		this.getFinancepayManage(1, this.state.pageSize);
		this.setState({pageIndex: 1});
	}

	//下拉按钮
	handleChange = value => {
		console.log(`selected ${value}`);
	};

	//更多操作按钮相关跳转
	onSelect(key, index, text, record, e) {
		const _this = this;
		setTimeout(()=>{
			switch(e.key){
				case 'loanmny':
					return Ajax({
						url: URL + 'fm/loan/settle',
						data: {
							data:{
								head: {
									rows: [
										{
											values:	{
													id: { value: record.id.value},
													ts: { value: record.ts.value}
													}
											}
										]
									}
								}
							},
						header: {"Content-Type": "application/json"},
						success: function(res) {
							const { data, message, success } = res;
								console.log(res.data,'999');
								if (success) {
									toast({content: '结算成功...', color: 'success'});
									_this.getFinancepayManage(pageIndex, pageSize);
									//console.log(res, 'res');
								} else {
									toast({content: '', color: 'warning'});
								}
							},
						error: function(error) {
							console.log(error, 'error');
							//toast({content: error, color: 'danger'});
						}
					});
				// case 'cancelloanmny':
				// 	return Ajax({
				// 		url: URL + 'fm/loan/cancelloanmny',
				// 		data: {
				// 			data:{
				// 				head: {
				// 					rows: [
				// 						{
				// 							values:	{
				// 									id: { value: record.id.value}
				// 										//"ts": { "value": currentRecord.ts.value}
				// 									}
				// 							}
				// 						]
				// 					}
				// 				}
				// 			},
				// 		header: {"Content-Type": "application/json"},
				// 		success: function(res) {
				// 			const { data, message, success } = res;
				// 				if (success) {
				// 					toast({content: '取消放款成功...', color: 'success'});
				// 					_this.getFinancepayManage(pageIndex, pageSize);
				// 					//console.log(res, 'res');
				// 				} else {
				// 					toast({content: '', color: 'warning'});
				// 				}
				// 			},
				// 		error: function(error) {
				// 			//console.log(error, 'error');
				// 			toast({content: error, color: 'danger'});
				// 		}
				// 	});
				case 'change':
					return hashHistory.push(`fm/financepay/change?id=${record.id ? (record.id.display || record.id.value) : ''}`);
				case 'changeRecord':
					return hashHistory.push(`fm/financepayChangeRecord/${record.id ? (record.id.display || record.id.value) : ''}`);
				case 'ext':
					return hashHistory.push(`fm/financepay/ext?id=${record.id ? (record.id.display || record.id.value) : ''}`);
				case 'termination': 
					return Ajax({
						url: URL + 'fm/loan/termination',
						data: {
							data:{
								head: {
									rows: [
										{
											values:	{
													id: { value: record.id.value}
														//"ts": { "value": currentRecord.ts.value}
													}
											}
										]
									}
								}
							},
						header: {"Content-Type": "application/json"},
						success: function(res) {
							const { data, message, success } = res;
								if (success) {
									toast({content: '终止成功...', color: 'success'});
									_this.getFinancepayManage(pageIndex, pageSize);
									//console.log(res, 'res');
								} else {
									//toast({content: '', color: 'warning'});
								}
							},
						error: function(error) {
							//console.log(error, 'error');
							//toast({content: error, color: 'danger'});
						}
					});
				case 'cancelTermination':
					return Ajax({
						url: URL + 'fm/loan/cancelTermination',
						data: {
							data:{
								head: {
									rows: [
										{
											values:	{
													id: { value: record.id.value}
														//"ts": { "value": currentRecord.ts.value}
													}
											}
										]
									}
								}
							},
						header: {"Content-Type": "application/json"},
						success: function(res) {
							const { data, message, success } = res;
								if (success) {
									toast({content: '取消终止成功...', color: 'success'});
									_this.getFinancepayManage(pageIndex, pageSize);
									//console.log(res, 'res');
								} else {
									//toast({content: '', color: 'warning'});
								}
							},
						error: function(error) {
							//console.log(error, 'error');
							//toast({content: error, color: 'danger'});
						}
					});
				default:
					return;
			}
		},0);		
	}
   
    render(){
		let { 
			dataList, 
			pageSize, 
			pageIndex, 
			maxPage, 
			totalSize,
			showBillModal, 
			keyWords, 
			currentIndex, 
			currentRecord, 
			rowKey,
			searchMap, 
			referCode,
			currentStatus, 
			loadingShow, 
			showDeleteModal, 
			contstatus, 
			contstatusGroup, 
			statuslNum,
			loancode 
		} = this.state;
        const columns= [
			{ 
				title: '序号', 
				key: 'key', 
				dataIndex: 'key', 
				width: '4%',
				render: (text, record, index) => {
					return (
						<div>{pageSize* (pageIndex - 1) + index + 1}</div>
					);
				} 
            },
            {
				title: '交易类型',
				key: 'trantypeid', 
				dataIndex: 'trantypeid.value',
				width: '6%',
				render: (text, record, index) => {
					return (
						<div>{record.trantypeid ? ( record.trantypeid.display || record.trantypeid.value ) : '——'}</div>
					);
				}
            },
			{ 
				title: '放款编号', 
				key: 'loancode', 
				dataIndex: 'loancode', 
				width: '10%',
				render: (text, record) => {
					return (
						<div 
							style={{color:'#0073DA', cursor:'pointer'}}
							onClick = {() => {
								hashHistory.push(`fm/financepay/detail?id=${record.id ? (record.id.display || record.id.value) : ''}`);
							}}
						>{record.loancode ? (record.loancode.display || record.loancode.value) : '——'}</div>
					);
				} 
            },
            {
				title: '贷款单位',
				key: 'financecorpid', 
				dataIndex: 'financecorpid.value',
				width: '10%',
				render(text, record, index) {
					return (
						<div>
							{record.financecorpid ? (record.financecorpid.display || record.financecorpid.value) : '——'}
						</div>
					)
				}
            },
            {
				title: '贷款机构',
				key: 'creditbankid', 
				dataIndex: 'creditbankid.value',
				width: '10%',
				render(text, record, index) {
					return (
						<div>
							{ record.creditbankid ? (record.creditbankid.display || record.creditbankid.value)  : '——'}
						</div>
					)
				}
            },
            {
				title: '放款日期',
				key: 'loandate', 
				dataIndex: 'loandate.value',
				width: '10%',
				render(text, record, index) {
					return (
						<div>
							{ record.loandate ? (record.loandate.display || record.loandate.value)  : '——'}
						</div>
					)
				}
            },
			{
				title: '结束日期',
				key: 'contenddate', 
				dataIndex: 'contenddate.value',
				width: '10%',
				render(text, record, index) {
					return (
						<div>
							{ record.contenddate ? (record.contenddate.display || record.contenddate.value)  : '——'}
						</div>
					)
				}
            },
            {
				title: '币种',
				key: 'currtypeid', 
				dataIndex: 'currtypeid.value',
				width: '10%',
				render(text, record, index) {
					return (
						<div>
							{ record.currtypeid ? (record.currtypeid.display || record.currtypeid.value)  : '——'}
						</div>
					)
				}
            },
            {
				title: '放款金额',
				key: 'loanmny', 
				dataIndex: 'loanmny.value',
				width: '10%',
				render(text, record, index) {
					let value= record.loanmny.display || record.loanmny.value;
					let scale= record.loanmny.scale || -1;
					return (
						<div>{value ? Number(value).formatMoney(scale > 0 ? scale : 2, '') : '——'}</div>
					);
				}
            },
            { 
				title: '审批状态', 
				dataIndex: 'vbillstatus.value', 
				key: 'vbillstatus', 
				width: '4%' ,
				render(text, record, index) {
					let vbillstatus= record.vbillstatus.display || record.vbillstatus.value;
					let vbillName= vbillstatus== 0 ? '待提交' : (vbillstatus== 3 ? '待审批' : (vbillstatus== 2 ? '审批中' : '已审批'));
					return (
						<div>
							<span>{ vbillName }</span>
						</div>
					)
				}
			},
			{
				title: '操作',
				key: 'operation',
				width: '10%',
				render: (text, record, index) => {
					let menu = (
						<Menu style={{ cursor: 'pointer' }} multiple onSelect={this.onSelect.bind(this, 'change', index, text, record)}>
							<MenuItem key="loanmny">结算</MenuItem>
							{/* <MenuItem key="cancelloanmny">取消放款</MenuItem> */}
							<MenuItem key="change">变更</MenuItem>
							<MenuItem key="changeRecord">变更记录</MenuItem>
							<MenuItem key="ext" >展期</MenuItem>
							<MenuItem key="termination">终止</MenuItem>
							<MenuItem key="cancelTermination">取消终止</MenuItem>
						</Menu>
					);
					let vbillstatus= record.vbillstatus.display || record.vbillstatus.value;
					if(vbillstatus==0){
						return (
							<div className="fm_paymanage">
								<span
									style={{ cursor: 'pointer' }}
									onClick={() => {
										hashHistory.push(`/fm/financepay/edit?id=${record.id ? (record.id.display || record.id.value) : ''}`);
									}}
								>
									<Icon data-tooltip='编辑' className="icon-style iconfont icon-bianji" />
								</span>
								<span 
									style={{ marginLeft: '10px', cursor: 'pointer' }}
									onClick={() => {
										this.setState({
											currentRecord: JSON.parse(JSON.stringify(record))
										});
									}}
								>
									<DeleteModal
										onConfirm= {() => {this.delRow(currentRecord);}}
									/>	
								</span>
								<Dropdown
									trigger={['hover']}
									overlay={menu}
									animation="slide-up"
									onVisibleChange={onVisibleChange}>
									<span
										style={{ marginLeft: '10px', cursor: 'pointer' }}
										onClick={() => {
											this.setState({
												currentRecord: record
											});
										}}
									>
										<Icon data-tooltip='联查' className="iconfont icon-liancha icon-style"/>
									</span>
								</Dropdown>
							</div>
						);
					} else {
						return (
							<div>
								<Dropdown
									trigger={['hover']}
									overlay={menu}
									animation="slide-up"
									onVisibleChange={onVisibleChange}>
									<span
										style={{ marginLeft: 'px', cursor: 'pointer' }}
										onClick={() => {
											this.setState({
												currentRecord: record
											});
										}}
									>
										<Icon data-tooltip='联查' className="iconfont icon-liancha icon-style"/>
									</span>
								</Dropdown>
							</div>
						)
					}
				} 
			}
		];
        return (
            <div className= "fm-financepaymanage bd-wrap">
				<div className="bd-header" style={{ marginBottom : '15px' , borderBottom : 'solid 1px #E3E7ED' }}>
					<div className='credit-title'>
						<span className="bd-title-1">放款管理</span>	
						<Button
							className="btn-2 add-button"
							onClick={() => {
								this.setState({
									currentStatus: 'add'
								});
								hashHistory.push(`/fm/financepay/add?id=${currentRecord.id ? (currentRecord.id.display || currentRecord.id.value) : ''}`);	
							}}
						>新增</Button>
						<Button 
							className="intadjustbill-button "
							onClick={() => {
								hashHistory.push(`/fm/intadjustbill`);	
							}}
						>利息调整</Button>
					</div>
					{/* <div className='credit-search'>
						<FormControl 
							value = {keyWords}
							className="search-input"
							onChange = {(e) => {
								this.setState({
									keyWords: e.target.value
								});
							}}
							onKeyDown = {(e) => {
								if(e.keyCode=== 13) {
									this.handleSearch(e.target.value);
								}
							}}
							placeholder = "按放款编号、名称搜索" 
						/>
						<Icon className="iconfont icon-icon-sousuo" onClick = {this.handleSearch.bind(this, keyWords)} />
					</div> */}
				</div>
				<div className='bd-header fm-select'>
					<div className='select-code' style={{display:'inline-block', marginBottom:'-8px'}}>
						<Refer 
							placeholder="放款编号"
							ctx={'/uitemplate_web'}
							refModelUrl={'/fm/financepayRef/'}
							refCode={'financepayRef'}
							refName={'放款编号'}
							value={{refpk: referCode, refname: loancode ? loancode : ''}}     
							onChange={item => {
								searchMap.loancode= item.loancode;
								console.log(item.loancode);
								this.setState({
									searchMap, 
									referCode: 111, 
									loancode: item.loancode
								});
							}}
							multiLevelMenu={[
								{
									name: ['放款编号'],
									code: ['loancode']
								}
							]}
						/>
					</div>
					

					{/* <Select
						showSearch
						//style={{ width: 240 }}
						placeholder="放款编号"
						className='select-code'
						onChange={this.handleChange.bind(this)}
					>
					</Select> */}

					<Select
						showSearch
						className='select-mny'
						placeholder="放款金额"
						value={searchMap.loanmny}
						onChange= {val => {
							searchMap.loanmny= val;
							console.log(val,'status')
							this.setState({searchMap});
						}}
					>
						<Option value={1}>0-1万</Option>
						<Option value={2}>1万-2万</Option>
						<Option value={3}>2万-3万</Option>
						<Option value={4}>一百万~一千万</Option>	
					</Select>

					{/* <Select
						showSearch
						className='select-type'
						placeholder="业务类型"
						optionFilterProp="children"
						onChange={this.handleChange.bind(this)}
					>
						<Option value="jack">Jack</Option>
						<Option value="lucy">Lucy</Option>
						<Option value="tom">Tom</Option>
					</Select> */}

					<div className="select-date">
						{/* <Icon className='iconfont icon-rili'/> */}
						<DatePickerSelect 
							placeholder = '业务日期'
							value= {searchMap.loandate}
							onChange= {(date) => {
								searchMap.loandate= date;
								this.setState({searchMap});
							}}
						/>
						{/* <Icon className='iconfont icon-rili select-rili'></Icon> */}
					</div>

					<Select
						className='select-state'
						placeholder= "审批状态"
						value={searchMap.vbillstatus}
						onChange= {val => {
							searchMap.vbillstatus= val;
							this.setState({searchMap});
						}}
					>
						<Option value={0}>待提交</Option>
						<Option value={3}>待审批</Option>
						<Option value={2}>审批中</Option>
						<Option value={1}>已审批</Option>
					</Select>

					<Button 
						className="btn-select"
						onClick={() => {
							this.getFinancepayManage(1, pageSize, contstatus);
							this.setState({pageIndex: 1});
						}}
					>
						查询
					</Button>

					<span className="btn-reset"
						onClick= {() => {
							this.setState({
								searchMap: {}
							});
						}}
					>
						重置
					</span>
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
					columns={columns} 
					data={dataList} 
					emptyText={() => (
						<div>
							<img src={nodataPic} alt="" />
						</div>
					)}
					className='bd-table'
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
        ) 
    }
}