import React, { Component } from 'react';
import { Breadcrumb, Row, Col, Table, Button, FormControl, Icon, Modal, Select, Popconfirm } from 'tinper-bee';
import Ajax from '../../../../utils/ajax.js';
import './index.less';
//import BreadCrumbs from '../../../bd/containers/BreadCrumbs';
import PageJump from '../../../../containers/PageJump';
import Loading from 'bee-loading';
import DeleteModal from '../../../../containers/DeleteModal';
import Menu, { Item as MenuItem } from 'bee-menus';
import { hashHistory } from 'react-router';
import Dropdown from 'bee-dropdown';
import DatePickerSelect from '../../../pass/containers/DatePickerSelect';
import moment from 'moment';
import '../../../pass/containers/formatMoney.js';
import 'bee-loading-state/build/Loadingstate.css';
import { numFormat, sum, toast } from '../../../../utils/utils.js';
import nodataPic from '../../../../static/images/nodata.png';

const URL= window.reqURL.fm;
const format = 'YYYY-MM-DD';
 
function onVisibleChange(visible) {
	console.log(visible);
}

export default class RepayInterestManage extends Component {
	constructor() {
		super();
		this.state = {
			pageIndex: 1,//当前页
			pageSize: 10,//每页显示几条
			maxPage: 1,
			totalSize: 0,
			currentRecord: {},
			currentIndex: 0,
			currentStatus: '',
			keyWords:'',	//模糊查询关键字
			contstatus: '',
			contstatusGroup: [
				{content: '全部', key: ''},  
				{content: '待结算', key: 0}, 
				{content: '结算中', key: 1},  
				{content: '结算成功', key: 2},  
				{content: '结算失败', key: 3}, 
			],
			statuslNum: [0, 0, 0, 0, 0],
			loadingShow: false,
			dataList: [],
			showDeleteModal: false,
			searchMap:{}
		};
	}
	
	componentWillMount () {
		this.getRepayInterestManage(this.state.pageIndex, this.state.pageSize);
	}

	

	//请求列表
	getRepayInterestManage = (page, size, contstatus='') => {
		const _this = this;
		let {searchMap}= this.state;
		let searchMaps= JSON.parse(JSON.stringify(searchMap));
		searchMaps.contstatus= contstatus;
		if (searchMaps.repaydate) {
			searchMaps.repaydate= moment(searchMaps.repaydate).format(format);
		}
		Ajax({
			url: URL + 'fm/repayinterest/list',
			data: {
				page: page-1,
				size,
				searchParams: {searchMap: searchMaps}
			},
			success: function(res) {
				// console.log(res);
				const { data, message, success } = res;
				if (success) {
					const { data, message, success } = res;
					let pageinfo= (data && data.head) ? data.head || {} : {};
					if (success) {
						let dataList = data && data.head && data.head.rows.map(item => item.values);
						_this.setState({
							dataList: (dataList && JSON.stringify(dataList)!== '{}') ? dataList : [],
							maxPage: (data && data.head && data.head.pageinfo) ? data.head.pageinfo.totalPages : 1,
							totalSize: (data && data.head && data.head.pageinfo) ? data.head.pageinfo.totalElements : 0,
							loadingShow: false
						});

						Ajax({
							url: URL + 'fm/repayinterest/selectAllCount',
							data: {
								page: page-1,
								size,
								searchParams: {
									searchParams: {searchMap: searchMaps}
								}
							},
							success: function(res) {
								const { data, message, success } = res;
								let newStatuts;
								if (success) {
									const { data, message, success } = res;
									const {
										unsettle,
										settling,
										settled,
										settlefail
									} = data;
									newStatuts = [
										_this.state.totalSize,
										unsettle,
										settling,
										settled,
										settlefail
									]
									_this.setState({
										statuslNum: newStatuts,
									});	
										} else {
											//toast({content: message.message, color: 'warning'});
											_this.setState({
												dataList: [],
												maxPage: 1,
												totalSize: 0,
												loadingShow: false
											});
										}
									},
							})


						
					} else {
						//toast({content: message, color: 'warning'});
						_this.err();
					}
				} else {
					//toast({content: message.message, color: 'warning'});
					_this.setState({
						dataList: [],
						maxPage: 1,
						totalSize: 0,
						loadingShow: false
					});
				}
			},
			error: function(res) {
				//console.log(error);
				//toast({content: res.message, color: 'danger'});
				_this.setState({
					dataList: [],
					maxPage: 1,
					totalSize: 0,
					loadingShow: false
				});
			}
		})
	};

	

	// 刪除行
	delRow = (currentRecord) => {
		const _this = this;
		let { dataList, pageIndex, pageSize }= this.state;
		Ajax({
			url: URL + 'fm/repayinterest/del',
			data: {
				"data": {
					"head": {
						"rows": [
									{
										"values":	{
											"id": { "value": currentRecord.id.value},
											"ts": { "value": currentRecord.ts.value}
										}
									}
								]
							}
						}
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					toast({content: '删除成功...', color: 'success'});
					if (dataList.length=== 1 && pageIndex> 1) {
						pageIndex--;
					} else if (dataList.length=== 1 && pageIndex=== 1) {
						return;
					}
					_this.getRepayInterestManage(pageIndex, pageSize);
				} else {
					//toast({content: JSON.stringify(message), color: 'warning'});
				}
			},
			error: function(error) {
				// console.log(error, 'error');
				//toast({content: '后台报错,请联系管理员', color: 'danger'});
			}
		})
	};

    // 页码选择
	onChangePageIndex = (page) => {
		//console.log(page, 'page');
		this.setState({
			pageIndex: page
		});
		this.getRepayInterestManage(page, this.state.pageSize);
	};

    //页数量选择 
	onChangePageSize = (value) => {
		//console.log(value, 'value');
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getRepayInterestManage(1, value);
	};

	//点击不同状态
	getContStatus = (page, size, contstatus) => {
		this.setState({
			contstatus,
			loadingShow: false,
			pageIndex: page
		});
		console.log('getRepayInterestManage=>', page, size, contstatus)
		this.getRepayInterestManage(page, size, contstatus);
	};

	//模糊查询操作
	handleSearch = val => {
		// console.log('模糊查询'+ val);
		this.getRepayInterestManage(1, this.state.pageSize);
		this.setState({pageIndex: 1});
	}

	//更多操作按钮相关跳转
	onSelect(key, index, text, record, e) {
		const _this = this;
		const rootUrl = window.reqURL.fm;		
	}

	//下拉按钮
	handleChange = value => {
		console.log(`selected ${value}`);
	};

    // 面包屑数据
    // breadcrumbItem = [ { href: '#', title: '首页' }, { title: '融资交易' }, { title: '付息' } ];
    
    render(){
		let { 
			dataList, 
			pageSize, 
			pageIndex, 
			maxPage, 
			totalSize, 
			keyWords, 
			currentIndex, 
			currentRecord, 
			currentStatus, 
			searchMap,
			loadingShow, 
			showDeleteModal, 
			contstatus, 
			contstatusGroup, 
			statuslNum
		} = this.state;
			//console.log(dataList);
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
				title: '付息编号',
				key: 'vbillno', 
				dataIndex: 'vbillno.value',
				width: '10%',
				render: (text, record, index) => {
					return (
						<div style={{color:'#0073DA'}}
							onClick = {() => {
								hashHistory.push(`fm/repayinterest?type=detail&id=${record.id ? (record.id.display || record.id.value) : '——'}`);
						}}
						>
							{record.vbillno ? (record.vbillno.display || record.vbillno.value) : '——'}
						</div>
					);
				}
            },
			{ 
				title: '放款编号',
				key: 'loancode', 
				dataIndex: 'loancode.value', 
				width: '10%',
				render: (text, record, index) => {
					return (
						<div>{record.loancode ? ( record.loancode.display || record.loancode.value ) : '——'}</div>
					);
				}
            },
            {
				title: '付息日期',
				key: 'repaydate', 
				dataIndex: 'repaydate.value',
				width: '10%',
				render: (text, record, index) => {
					return (
						<div>{record.repaydate ? ( record.repaydate.display || record.repaydate.value ) : '——'}</div>
					);
				}
            },
            {
				title: '币种',
				key: 'currtypeid', 
				dataIndex: 'currtypeid.value',
				width: '5%',
				render: (text, record, index) => {
					return (
						<div>{record.currtypeid ? ( record.currtypeid.display || record.currtypeid.value ) : '——'}</div>
					);
				}
            },
            {
				title: '付息金额',
				key: 'repaymny', 
				dataIndex: 'repaymny.value',
				width: '10%',
				render: (text, record, index) => {
					let value= record.repaymny.display || record.repaymny.value;
					let scale= record.repaymny.scale || -1;
					return (
						<div>{value ? Number(value).formatMoney(scale > 0 ? scale : 2, '') : '——'}</div>
					);
				}
            },
            {
				title: '借款单位账户',
				key: 'loanbankid', 
				dataIndex: 'loanbankid.value',
				width: '10%',
				render: (text, record, index) => {
					return (
						<div>{record.loanbankid ? ( record.loanbankid.display || record.loanbankid.value ) : '——'}</div>
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
				width: '10%',
				key: 'operation',
				dataIndex: 'operation',
				render: (text, record, index) => {
					let vbillstatus= record.vbillstatus.display || record.vbillstatus.value;
					if(vbillstatus==0){
						return (
							<div>
								<span
									style={{ cursor: 'pointer' }}
									onClick={() => {
										hashHistory.push(`/fm/repayinterest?type=edit&id=${record.id ? (record.id.display || record.id.value) : '——'}`);
									}}
								>
									<Icon data-tooltip='编辑' className="iconfont icon-bianji icon-style" />
								</span>
								<span 
									style={{ marginLeft: '10px', cursor: 'pointer' }}
									onClick={() => {
										this.setState({
											//showDeleteModal: true,
											currentRecord: JSON.parse(JSON.stringify(record))
										});
									}}
								>
									<DeleteModal
										onConfirm= {() => {this.delRow(currentRecord);}}
									/>
								</span>
							</div>
						)
					} else {
						return '————'
					}
				}
			}
		];
		console.log(dataList,'yggijgh')
        return (
            <div className= "fm-repayinterestmanage">
				<div className="bd-header" style={{ marginBottom : '15px' , borderBottom : 'solid 1px #E3E7ED' }}>
					<div className='credit-title'>
						<span className='bd-title-1'>付息管理</span>
						<Button 
							className="btn-2 add-button"
							onClick={() => {
								hashHistory.push('/fm/repayinterest?type=add')}
							}
						>新增</Button>
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
							placeholder = "按付息编号搜索" 
						/>
						<Icon className="iconfont icon-icon-sousuo" onClick = {this.handleSearch.bind(this, keyWords)} />
					</div> */}
				</div>
				<div className='bd-header fm-select'>
				<Select
						showSearch
						style={{ width: 240 }}
						placeholder="付息编号"
						className='select-code'
						onChange= {val => {
							searchMap.vbillno= val;
							console.log(val);
							this.setState({searchMap});
						}}
					>
						{
							this.state.dataList.map((item,key)=>{
								return (
									<Option value={key}>{item.vbillno.value}</Option>
								)
							})
						}
					</Select>

					<Select
						showSearch
						className='select-mny'
						placeholder="付息金额"
						onChange= {val => {
							searchMap.repaymny= val;
							console.log(val);
							this.setState({searchMap});
						}}
					>
						{
							this.state.dataList.map((item,key)=>{
								return (
									<Option value={key}>{item.repaymny.value}</Option>
								)
							})
						}
					</Select>

					<div className="select-date">
						{/* <Icon className='iconfont icon-rili'/> */}
						<DatePickerSelect 
							placeholder = '付息日期'
							value= {searchMap.repaydate}
							onChange= {(date) => {
								searchMap.repaydate= date;
								this.setState({searchMap});
							}}
						/>
					</div>

					<Select
						className='select-state'
						placeholder= "审批状态"
						value={searchMap.vbillstatus}
						onChange= {val => {
							searchMap.vbillstatus= val;
							console.log(val);
							this.setState({searchMap});
						}}
					>
						<Option value={0}>待提交</Option>
						<Option value={3}>待审批</Option>
						<Option value={2}>审批中</Option>
						<Option value={1}>已审批</Option>
					</Select>

					<Select
						showSearch
						className='select-type'
						placeholder="放款编号"
						onChange= {val => {
							searchMap.loancode= val;
							console.log(val);
							this.setState({searchMap});
						}}
					>
						{
							this.state.dataList.map((item,key)=>{
								return (
									<Option value={key}>{item.loancode.value}</Option>
								)
							})
						}
					</Select>

					<Button className="btn-select"
						onClick={() => {
							this.getRepayInterestManage(1, pageSize);
							this.setState({pageIndex: 1});
						}}
					>
						查询
					</Button>

					<span className="btn-reset"
						style={{cursor:'pointer'}}
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