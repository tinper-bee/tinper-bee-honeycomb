import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import {Table, Button, FormControl, Icon, Modal, Select } from 'tinper-bee';
import './index.less';
import {Ajax, PageJump, MsgModal, CheckTable, CheckBox, Refer, BreadCrumbs, DatePickerSelect, zhCN, URL, format, moment, detailOpertion} from '../index';
import MoreQuery from '../MoreQuery';
import ChangeRecord from '../ChangeRecord';
import RealBalance from '../RealBalance';
import MsgContentModal from '../MsgContentModal';
import { toast } from '../../../../utils/utils.js';
import nodataPic from '../../../../static/images/nodata.png';
import image from '../../../../static/images/realbalance.png';
import '../../containers/formatMoney.js';
const Option= Select.Option;
const detailsUrl= 'pass/settlement/';

export default class Settle extends Component {
	static defaultProps = {
		settleType: 'normal',
		breadcrumbItem: [{href: '#', title: '首页'}, {title: '结算平台'}, {title: '结算服务'}]
	};
	
	constructor() {
		super();
		this.state = {
			checkedList: [],
			pageIndex: 1,//当前页
			pageSize: 10,//每页显示几条
			maxPage: 1,
			totalSize: 0,
			currentRecord: {},
			currentKey: 0,
			searchMap: {},	//模糊查询关键字
			dataList: [],
			moreQueryShow: false,
			settlestatus: [		//结算状态
				{content: '待结算', val: 0},
				{content: '结算中', val: 1},
				{content: '结算成功', val: 3}
			],
			unNormalGroup: ['结算失败', '结算作废'],
			unNormalStatus: 0,
			timeBalance: '',
			MsgModalShow: false,
			isChangeRecordShow: false,
			batchList: [],
			moreQueryNum: 0,	//更多查询显示数量
			isClearQuery: false, 	//是否清空更多查询
			referCode: 111, 		//参照替代
			isBalanceShow: [],
			balanceMoney: 0,		//实时余额
			isWait: false,			//点击查看实时余额鼠标要等待
			activeKey: '',			//当前项的及时余额
			msgContentShow: false,
			onpayContent: '',
			detailArr: [0, 0, 0, 0, 0, 0],
			scanDetail: false,
			queryToTop: 0
		};
	}

	componentWillMount () {
		let { searchMap }= this.state;
		let { status }= this.props;
		searchMap.settlestatus= Number(status);
		if (this.props.settleType=== 'normal') {
			searchMap.vbillstatus= 1;
		} 
		this.setState({searchMap});
		this.getSettlementList(this.state.pageIndex, this.state.pageSize, searchMap);
	}
	
	componentDidMount() {
		document.body.addEventListener('click', this.queryHidden);
		let queryToTop= document.getElementsByClassName('zijinyun-search')[0].offsetTop;
		this.setState({
			queryToTop: queryToTop + 45
		});
	}
	
	//获取列表数据
	getSettlementList = (page, size, searchMap= this.state.searchMap) => {
		const _this = this;
		let searchMaps= JSON.parse(JSON.stringify(searchMap));
		if (searchMaps.eventdatebeg) {
			searchMaps.eventdatebeg= moment(searchMaps.eventdatebeg).format(format) + ' 00:00:00';
		}
		if (searchMaps.eventdateend) {
			searchMaps.eventdateend= moment(searchMaps.eventdateend).format(format) + ' 23:59:59';
		}
		Ajax({
			url: URL + 'pass/settlement/list',
			data: {
				page: page-1,
				size,  
				searchParams: {
					searchMap: searchMaps
				}
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let dataList = data && data.head && data.head.rows && data.head.rows.map(item => item.values);
					let pageinfo= (data && data.head) ? data.head.pageinfo || {} : {};
					_this.setState({
						dataList: (dataList && JSON.stringify(dataList)!== '{}') ? dataList : [],
						maxPage: pageinfo.totalPages || 1,
						totalSize: pageinfo.totalElements || 0,
					});
					_this.getSettleListDetail(dataList || []);
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

	//icon后台交互
	setIconOperation = (path, content, batchList) => {
		const _this= this;
		let {isBalanceShow}= this.state;
		Ajax({
			url: URL + detailsUrl + path,
			data:{ data: { head: { rows: batchList } } },
			success: function(res) {
				if (res.success) {
					if (path=== 'upbalance') {
						let balance = res.data && res.data.head && res.data.head.rows[0] && res.data.head.rows[0]['values'] && res.data.head.rows[0]['values']['balance'];
						let money= balance.display || balance.value || 0;
						isBalanceShow[content]= true;
						_this.setState({
							isBalanceShow,
							balanceMoney: Number(money).formatMoney((balance.scale || -1) > 0 ? balance.scale : 2, ''),
							isWait: false
						});
					} else if (path=== 'onpay') {
						_this.setState({
							MsgModalShow: true,
							onpayContent: res.message ? res.message.message : '是否确认网上支付?',
							currentKey: 5
						});
					} else {
						toast({content: content, color: 'success'});
						_this.setState({
							checkedList: [],
							MsgModalShow: false,
							msgContentShow: false
						});
						_this.getSettlementList(_this.state.pageIndex, _this.state.pageSize);
					}
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
					_this.setState({isWait: false});
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
				_this.setState({isWait: false});
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
		this.getSettlementList(page, this.state.pageSize);
	};

	//页数量选择 
	onChangePageSize = (value) => {
		//console.log(value, 'value');
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getSettlementList(1, value);
	};

	//关闭更多查询, 变更记录
	queryHidden = e => {
		let {moreQueryNum, moreQueryShow, activeKey, isBalanceShow}= this.state;
		if (moreQueryShow) {//更多查询
			let target= document.getElementsByClassName('more-query')[0];
			let targetBtn= document.getElementsByClassName('more-query-search')[0];
			let refer= document.getElementsByClassName('refer-cascading-list');
			let select= document.getElementsByClassName('u-select-dropdown');
			let slideUp= true;
			let selectUp=true;
			let len= e.path.findIndex((item) => item=== target);
			let length= e.path.findIndex((item) => item=== targetBtn);
			for (let val of refer) {
				if (e.path.findIndex((item) => item=== val)> 0) {
					slideUp= false;
				}
			}
			for (let val of select) {
				if (e.path.findIndex((item) => item=== val)> 0) {
					selectUp= false;
				}
			}
			if (len < 0 && length< 0 && slideUp && selectUp) {
				this.setState({
					moreQueryShow: false,
					isClearQuery: moreQueryNum> 0 ? false : true
				});
			}
		}
		if (isBalanceShow[activeKey]) {//即时余额查询
			let target= document.getElementById(`view-money${activeKey}`);
			let len= e.path.findIndex((item) => item=== target);
			if (len < 0) {
				isBalanceShow[activeKey]= false;
				this.setState({isBalanceShow});
			}
		}
	};

	//路由跳转到结算明细页面
	routerJump = (record, type) => {
		let id= record.id.display || record.id.value || 0;
		hashHistory.push(`/pass/settlement/settledetail?id=${id}&type=${type}`);
	};

	//批量手工结算
	batchSettlement = () => {
		let len= 0;
		let batchList= [];
		let {checkedList}= this.state;
		if (checkedList.length=== 0) {
			toast({color: 'warning', content: '请勾选手工结算项！'});
			return;
		}
		for (let key in checkedList) {
			let isnetbank= checkedList[key].isnetbank.display || checkedList[key].isnetbank.value;
			let settlestatus= checkedList[key].settlestatus.display || checkedList[key].settlestatus.value;
			if (isnetbank== 1 && settlestatus== 0) {
				++len;
			}
			batchList[key]= {};
			batchList[key].values= checkedList[key];
		}
		if (len < checkedList.length) {
			toast({color: 'warning', content: '只有处于待结算状态的手工结算才可以批量！'});
			return;
		}
		this.setState({
			MsgModalShow: true,
			batchList,
			currentKey: 4
		});
	};

	//根据当前状态判断图标显示情况
	detailIcon= record => {
		let isnetbank= record.isnetbank.display || record.isnetbank.value || 0;
		let settlestatus= record.settlestatus.display || record.settlestatus.value || 0;
		let version= record.version.display || record.version.value;
		let vbillstatus= record.vbillstatus ? record.vbillstatus.display || record.vbillstatus.value : 0; 
		return [
			{content: '修改', show: settlestatus== 0 && vbillstatus== 0, jump: true, icon: 'icon-bianji'},
			{content: '提交', show: settlestatus== 0 && vbillstatus== 0, path: 'commit', icon: 'icon-tijiao'},
			{content: '收回', show: settlestatus== 0 && vbillstatus== 3, path: 'uncommit', icon: 'icon-shouhui'},
			{content: '手工结算', show: isnetbank== 1 && settlestatus== 0 && vbillstatus== 1, isMsgModal: true, key: 0, icon: 'icon-shougongjiesuan'},
			{content: '网银支付', show: isnetbank== 0 && settlestatus== 0 && vbillstatus== 1, isSetIcon: true, key: 1, icon: 'icon-wangyinzhifu'},
			{content: '手工确认', show: isnetbank== 0 && settlestatus== 1, isMsgContent: true, key: 2, icon: 'icon-shougongqueren'},
			{content: '作废', show: (isnetbank== 0 && settlestatus== 2) || (isnetbank== 1 && settlestatus== 0 && vbillstatus== 0), isMsgContent: true, key: 3, icon: 'icon-zuofei'},
			{content: '变更', show: isnetbank== 0 && settlestatus== 2, jump: true, icon: 'icon-biangeng'},
			{content: '变更记录', show: version> 0, change: true, icon: 'icon-biangengjilu'}
		];
	};

	//更多查询数据处理
	queryProcess = (searchMaps, moreQueryNum, type) => {
		let {searchMap}= this.state;
		delete searchMap.srcsystem;
		delete searchMap.eventno;
		delete searchMap.srctradetypename;
		delete searchMap.srctradebigtype;
		delete searchMap.currtypename;
		delete searchMap.moneybeg;
		delete searchMap.moneyend;
		delete searchMap.payaccnum;
		delete searchMap.recaccnum;
		delete searchMap.recaccname;
		delete searchMap.memo;
		delete searchMap.nusage;
		if (type) {
			for (let key in searchMaps) {
				searchMap[key]= searchMaps[key];
			}
		} 
		this.setState({
			moreQueryShow: type ? false : true,
			moreQueryNum,
			searchMap
		});
	};

	//获取当前列表支付明细
	getSettleListDetail = list => {
		let detailArr= [0, 0, 0, 0, 0, 0];
		for (let item of list) {
			let type= item.transtype.display || item.transtype.value || 0;
			if (type== 0) {
				detailArr[0]++;
				detailArr[1]+= Number(item.money.display || item.money.value || 0);
			} else if (type== 1) {
				detailArr[2]++;
				detailArr[3]+= Number(item.money.display || item.money.value || 0);
			} else {
				detailArr[4]++;
				detailArr[5]+= Number(item.money.display || item.money.value || 0);
			}
		}
		this.setState({detailArr});
	};
	
	render() {
		let { queryToTop, dataList, pageSize, pageIndex, maxPage, totalSize, searchMap, currentRecord, moreQueryShow, settlestatus, unNormalGroup, unNormalStatus, checkedList, MsgModalShow, currentKey, isChangeRecordShow, batchList, moreQueryNum, isClearQuery, referCode, isBalanceShow, balanceMoney, isWait, msgContentShow, onpayContent, scanDetail, detailArr } = this.state;
		let {settleType, breadcrumbItem}= this.props;
		
		let columns= [
			{ 
				title: '事件/事件号', 
				key: 'srctranevent', 
				dataIndex: 'srctranevent', 
				width: '8%',
				render: (text, record) => {
					return (
						<div
							className='table-jump' 
							onClick={() =>{this.routerJump(record, 'view');}}
						>
							<span title={record.srctranevent.display || record.srctranevent.value}>{record.srctranevent.display || record.srctranevent.value || '—'}</span>
							<br/>
							<span title={record.eventno.display || record.eventno.value}>{record.eventno.display || record.eventno.value || '—'}</span>
						</div>
					);
				} 
			},
			{ 
				title: '类型/交易号', 
				key: 'eventdate', 
				dataIndex: 'eventdate', 
				width: '8%',
				render: (text, record) => {
					return (
						<div>
							<span>{record.srctradetypename.display || record.srctradetypename.value || '—'}</span>
							<br/>
							<span>{record.tradenum.display || record.tradenum.value || '—'}</span>
						</div>
					);
				}  
			},
			{ 
				title: '本方账户/户名', 
				key: 'recaccname', 
				dataIndex: 'recaccname', 
				width: '15%',
				render: (text, record, index) => {
					let type= record.transtype.display || record.transtype.value || 0;
					let name= type== 0 ? (record.recaccname.display || record.recaccname.value) : (record.payaccname.display || record.payaccname.value);
					let num= type== 0 ? (record.recaccnum.display || record.recaccnum.value) : (record.payaccnum.display || record.payaccnum.value);
					
					return (
						<div className={isWait ? 'realtime-balance-box wait' : 'realtime-balance-box'}>
							<RealBalance
								id={index + ''}
								btnContent={num}
								content={`即时余额: ${balanceMoney}`}
								isShow={isBalanceShow[index]}
								onSelect={() => {
									this.setState({
										isBalanceShow: [],
										isWait: true,
										activeKey: index
									});
									setTimeout(() => {
										this.setIconOperation('upbalance', index, [{values: record}]);
									}, 0);
								}}
							/>
							<br/>
							<span>{name || '—'}</span>
						</div>
					);
				}  
			},
			{ 
				title: '收付/币种/金额', 
				key: 'currtypename', 
				dataIndex: 'currtypename', 
				width: '15%',
				render: (text, record) => {
					let type= record.transtype.display || record.transtype.value || 0;
					let currtypename= record.currtypename.display || record.currtypename.value;
					let signal= type== 0 ? '收款' : type== 1 ? '支付' : '转账';
					let money= record.money.display || record.money.value;
					let scale= record.money.scale || -1;
					return (
						<div>{signal}{currtypename}{money ? Number(money).formatMoney(scale> 0 ? scale : 2, ''): '—'}</div>
					);
				} 
			},
			{ 
				title: '对方单位', 
				key: 'oppunitname', 
				dataIndex: 'oppunitname', 
				width: '15%',
				render: (text, record) => {
					return (
						<div>{record.oppunitname ? record.oppunitname.display || record.oppunitname.value || '—' : '—'}</div>
					);
				} 
			},
			{ 
				title: '结算方式', 
				key: 'balatypename', 
				dataIndex: 'balatypename', 
				width: '8%',
				render: (text, record) => {
					return (
						<div>{record.balatypename.display || record.balatypename.value || '—'}</div>
					);
				}  
			},
			{ 
				title: '审批/结算状态', 
				key: 'settlestatus', 
				dataIndex: 'settlestatus', 
				width: '8%',
				render: (text, record) => {
					let settlestatus= record.settlestatus.display || record.settlestatus.value;
					let vbillstatus= record.vbillstatus ? record.vbillstatus.display || record.vbillstatus.value : 0;
					return (
						<div>
							<span>{vbillstatus== 0 ? '待提交' : (vbillstatus== 3 ? '待审批' : (vbillstatus== 2 ? '审批中' : '审批通过'))}</span>
							<br/>
							<span>{settlestatus== 0 ? '待结算' : (settlestatus== 1 ? '结算中' : (settlestatus== 2 ? '结算失败' : (settlestatus== 3 ? '结算成功' : (settlestatus== 4 ? '作废' : '待结算'))))}</span>
						</div>
					);
				}  
			},
			{ 
				title: '是否网银', 
				key: 'isnetbank', 
				dataIndex: 'isnetbank', 
				width: '8%',
				render: (text, record) => {
					let type= record.isnetbank.display || record.isnetbank.value || 0;
					return (
						<span>{type== 0 ? '是' : '否'}</span>
					);
				}  
			},
			{
				title: '操作',
				key: 'operation',
				width: '15%',
				render: (text, record, index) => {
					let isnetbank= record.isnetbank.display || record.isnetbank.value;
					let settlestatus= record.settlestatus.display || record.settlestatus.value;
					let groupIcon= this.detailIcon(record);
					return (
						<div>
							{
								groupIcon.map((item, key) => {
									if (item.show) {
										return (
											<span 
												onClick={() =>{
													if (item.path) {//提交, 收回
														this.setIconOperation(item.path, item.content+ '成功', [{values: record}]);
														return;
													} else if (item.change) {//变更记录
														this.setState({
															currentRecord: record,
															isChangeRecordShow: true
														});
														return;
													} else if (item.isSetIcon) {//网银支付
														this.setIconOperation('onpay', '网银支付成功', [{values: record}]);
													} else if (item.isMsgContent) {//手工确认、作废
														this.setState({
															msgContentShow: true,
														});
													} else if (item.isMsgModal) {//手工结算
														this.setState({
															MsgModalShow: true
														});
													} else if (item.jump) {//修改、变更
														this.routerJump(record, 'edit');
													} 
													this.setState({
														currentRecord: record,
														currentKey: item.key
													});
												}}
											>
												<Icon className={`iconfont icon-style ${item.icon}`}/>
											</span>
										);
									}
								})
							}
						</div>
					);
				}
			}
		];
		
		return (
			<div className= "pass-settlement bd-wraps">
				<BreadCrumbs items={breadcrumbItem} />
				<div className='pop-modal'>
					<ChangeRecord  
						details={currentRecord} 
						show={isChangeRecordShow}
						hidden={() => {this.setState({isChangeRecordShow: false});}}
					/>
				</div> 
				<div className="bd-header">
					{
						settleType=== 'normal' ?
							<div className='credit-title'>
								<span className="bd-title-1">结算服务</span>
								<Button 
									className="btn-2 add-button"
									onClick={() => {
										this.batchSettlement();
									}}
								>手工结算</Button>
								<span className="scandetail-btn">
									<Icon 
										className='iconfont icon-jisuanqi'
										onMouseOver={() => {this.setState({scanDetail: true});}}
										onMouseOut={() => {this.setState({scanDetail: false});}}
									/>
								</span>
								{scanDetail &&
									<ul className='settle-list-detail'>
										<li><span>收款数量: {detailArr[0]}</span><span>收款金额合计: {Number(detailArr[1]).toFixed(2)}</span></li>
										<li><span>支付数量: {detailArr[2]}</span><span>支付金额合计: {Number(detailArr[3]).toFixed(2)}</span></li>
										<li><span>转账数量: {detailArr[4]}</span><span>转账金额合计: {Number(detailArr[5]).toFixed(2)}</span></li>
									</ul>
								}
								<span
									className="unnormal-settlement"
									onClick={() => {hashHistory.push('/pass/unsettlement');}}
								>异常结算</span>
							</div>
						:
						<div className='credit-title'>
							<span className="bd-title-1">异常结算处理</span>
							<Button 
								className="btn-2 add-button"
								style={{width: 110}}
								onClick={() => {hashHistory.push('/pass/settlement');}}
							>返回结算服务</Button>
						</div>
					}
				</div>
				<div className="zijinyun-search">
					<Refer
						placeholder="事件"
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/transtypeRef/'}
						refCode={'transtypeRef'}
						refName={'事件'}
						clientParam={{
							maincategory: 1 //1234对应投资品种、融资品种、费用项目、银行交易项目
						}}
						multiLevelMenu={[
							{
								name: ['交易大类'],
								code: ['refname']
							},
							{
								name: ['交易类型'],
								code: ['refname']
							},
							{
								name: ['事件'],
								code: ['refname']
							}
						]}
						value={{refpk: referCode, refname: searchMap.srctranevent}}      
						onChange={item => {
							let isEmpty= JSON.stringify(item)=== '{}';
							searchMap.srctranevent= isEmpty ? '' : item.refname;
							this.setState({searchMap, referCode: 111});
						}}
					/>
					<DatePickerSelect  
						placeholder='事件开始日期'
						value= {searchMap.eventdatebeg}
						onChange= {(date) => {
							searchMap.eventdatebeg= date;
							if (searchMap.eventdateend && (new Date(date)).getTime()> (new Date(searchMap.eventdateend)).getTime()) {
								delete searchMap.eventdateend;
							}
							this.setState({searchMap});
						}}
					/>
					<DatePickerSelect  
						placeholder='事件截止日期'
						value= {searchMap.eventdateend}
						onChange= {(date) => {
							searchMap.eventdateend= date;
							this.setState({searchMap});
						}}
						disabledDate={current => searchMap.eventdatebeg ? current && current.valueOf() < moment(searchMap.eventdatebeg) : null}
					/>
					<Select 
						placeholder= "收支属性"
						value={searchMap.transtype}
						onChange= {val => {
							searchMap.transtype= val;
							this.setState({searchMap});
						}}
					>
						<Option value={0}>收款</Option>
						<Option value={1}>支付</Option>
						<Option value={2}>转账</Option>
					</Select>
					{
						settleType=== 'normal' && 
							[<Select 
								placeholder= "结算状态"
								value={searchMap.settlestatus}
								onChange= {val => {
									searchMap.settlestatus= val;
									this.setState({searchMap});
								}}
							>
								{
									settlestatus.map(item => {
										return <Option key={item.val} value={item.val}>{item.content}</Option>
									})
								}
							</Select>,
							<Select 
								placeholder= "审批状态"
								value={searchMap.vbillstatus}
								onChange= {val => {
									searchMap.vbillstatus= val;
									this.setState({searchMap});
								}}
							>
								<Option value={0}>待提交</Option>
								<Option value={1}>审批通过</Option>
								<Option value={2}>审批中</Option>
								<Option value={3}>待审批</Option>
							</Select>,
							<Select 
								placeholder= "是否网银"
								value={searchMap.isnetbank}
								onChange= {val => {
									searchMap.isnetbank= val;
									this.setState({searchMap});
								}}
							>
								<Option value={0}>网银</Option>
								<Option value={1}>非网银</Option>
							</Select>]
					}
					<Button 
						className='btn-2 btn-cancel more-query-search'
						onClick={() => {
							this.setState({
								moreQueryShow: !moreQueryShow,
								isClearQuery: false
							});
						}}
					>
						更多查询
						{moreQueryNum> 0 &&
							[
								<span> (</span>,
								<span className='more-query-sum'>{moreQueryNum}</span>,
								<span>)</span>
							]
						}
						<Icon className={`iconfont ${moreQueryShow ? 'icon-icon-jiantoushang' : 'icon-icon-jiantouxia'}`}/>
					</Button>		
					<Button 
						className="search-btn"
						onClick={() => {
							this.getSettlementList(1, pageSize, searchMap);
							this.setState({pageIndex: 1});
						}}
					>查询</Button>
					<span
						className='zijinyun-reset'
						onClick= {() => {
							this.setState({
								searchMap: {
									settlestatus: this.props.settleType=== 'normal' ? 0 : 2,
									vbillstatus: 1
								},
								moreQueryNum: 0,
								isClearQuery: true,
								referCode: ''
							});
						}}
					>重置</span>
				</div>
				
				<MoreQuery
					toTop={queryToTop}
					isShow={moreQueryShow}
					isClearQuery={isClearQuery}
					closeQuery={(searchMaps, moreQueryNum, type) => {this.queryProcess(searchMaps, moreQueryNum, type);}}
				/>
				{settleType=== 'unnormal' &&
					<div className="bd-header">
						<ul className="contstatus-group">
							{
								unNormalGroup.map((item, index) => {
									return (
										<li 
											key={index}
											className={searchMap.settlestatus=== (index + 1) * 2 ?'active' : ''}
											onClick={() => {
												searchMap.settlestatus= (index + 1) * 2;
												this.setState({searchMap});
												this.getSettlementList(pageIndex, pageSize, searchMap);
											}}
										>
											{item}
											<span className='bottom-border'></span>
										</li>
									)
								})
							}
						</ul>
					</div>
				}
				<CheckTable
					bordered 
					className="bd-table double"
					emptyText={() => <div>
							<img src={nodataPic} alt="" />
						</div>
					} 
					columns={columns} 
					data={dataList} 
					rowKey={record => record.id.value}
					selectedList={checkedList => {
						this.setState({checkedList});
						this.getSettleListDetail(checkedList.length ? checkedList : (dataList|| []));
					}}
				/>
                <PageJump
					pageSize = {pageSize}
					activePage = {pageIndex}
					maxPage = {maxPage}
					totalSize = {totalSize}
					onChangePageSize = {this.onChangePageSize}
					onChangePageIndex = {this.onChangePageIndex}
				/>
				<MsgModal
					show={MsgModalShow}
					title={detailOpertion[currentKey].title}
					content={detailOpertion[currentKey].content || onpayContent}
					icon='icon-tishianniutixing'
					onConfirm={() => {
						this.setIconOperation(detailOpertion[currentKey].path, detailOpertion[currentKey].msg, currentKey=== 4 ? batchList : [{values: currentRecord}]);
					}}
					onCancel={() => {
						this.setState({MsgModalShow: false});
					}}
				/>
				<MsgContentModal 
					show={msgContentShow}
					title={currentKey=== 2 ? '手工确认' : '作废'}
					maxLength={100}
					labelName={currentKey=== 2 ? '确认意见' : '作废意见'}
					placeholder= {currentKey=== 2 ? '请输入确认意见' : '请输入作废意见'}
					confirmText={currentKey=== 2 ? '结算成功' : '确定'}
					cancelText={currentKey=== 2 ? '结算失败' : '取消'}
					onConfirm={(val) => {
						if (!val) {
							toast({color: 'danger', content: currentKey=== 2 ? '请输入结算成功意见' : '请输入作废意见'});
							return;
						}
						if (currentKey=== 2) {
							currentRecord.settlestatus.display= 3;
							currentRecord.settlestatus.value= 3;
							currentRecord.confirinfo.display= val;
							currentRecord.confirinfo.value= val;
							this.setIconOperation('handconfirm', '手工确认完成', [{values: currentRecord}]);
						} else {
							currentRecord.disablereason.display= val;
							currentRecord.disablereason.value= val;
							this.setIconOperation('disable', '作废成功', [{values: currentRecord}]);
						}
					}}
					onCancel={(bool, val) =>{
						if (!bool && currentKey=== 2) {
							if (!val) {
								toast({color: 'danger', content: '请输入结算失败意见'});
								return;
							}
							currentRecord.settlestatus.display= 2;
							currentRecord.settlestatus.value= 2;
							currentRecord.confirinfo.display= val;
							currentRecord.confirinfo.value= val;
							this.setIconOperation('handconfirm', '手工确认完成', [{values: currentRecord}]);
						} else {
							this.setState({
								msgContentShow: false
							});
						}
					}}
				/>
			</div>
		);
	}
}
