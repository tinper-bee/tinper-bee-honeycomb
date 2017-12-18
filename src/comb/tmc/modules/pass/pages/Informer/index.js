import React, { Component } from 'react';
import {Table, Button, FormControl, Icon, Modal, Select } from 'tinper-bee';
import Checkbox from 'bee-checkbox';
import {Ajax, CheckTable, CheckBox, CheckBoxs, Radios, Refer, BreadCrumbs, DatePickerSelect, zhCN, URL, format, moment, nodataPic} from '../../containers';
import Dimension from '../../containers/Dimension';
import HistoryInput from '../../containers/HistoryInput';
import './index.less';
import { toast, sum, dateAdd } from '../../../../utils/utils.js';
import '../../containers/formatMoney.js';
import reconciliationRules from '../../../../static/images/reconciliation_rules.png';
const Option= Select.Option;
const RadiosGroup= Radios.RadiosGroup;
const CheckBoxsGroup= CheckBoxs.CheckBoxsGroup;

export default class Informer extends Component {
	constructor() {
		super();
		this.state = {
			currentRecord: {},
			searchMap: {
				begindate: moment(dateAdd(new Date().getTime() - 1000*3600*24, 0, '-') + ' 00:00:00'),
				enddate: moment(new Date()),
				checkflag: 2		//是否勾选是否对账, 0是1否2全部
			},	//模糊查询关键字
			bankList: [],		//银行数据
			companyList: [],	//公司数据
			bankSelect: [],		//选中的银行数据
			bankBool: [],		//选中的银行状态
			companySelect: [],	//选中的公司数据
			companyBool: [],	//选中的公司状态
			blendingList: [
				{name: '对账查询'},
				{name: '自动对账'},
				{name: '手工对账'},
				{name: '取消对账'}
			],
			blendingStatus: 0,
			direction: [false, false, false, false],	//银行还是公司
			dimensionData: [],		//所选维度数据
			dimensionShow: false,	//选择维度下拉框是否显示
			columnsPercent: [
				['8%', '18%', '18%', '18%'],
				['16%', '28%', '28%', '28%'],
				['16%', '28%', '28%', '28%'],
				['8%', '18%', '18%', '18%']
			],
			referCode: '',
			isBalance: true,	//对账是否平衡
			companyMoney: 0, 		//公司对账金额
			bankMoney: 0, 			//银行对账金额
			companyNum: 0, 			//公司对账笔数
			bankNum: 0,				//银行对账笔数
			scanRules: false,		//查看对账规则
			passBoxHeight: 0,		//pass-box高度 
			tableContentHeight: 0,	//pass-box列表区域高度 
		};
	}

	componentWillMount () {
		this.getInformerList();
	}

	componentDidMount() {
		let screenHeight= screen.availHeight;
		let passToTop= document.getElementsByClassName('pass-table-box')[0].offsetTop;
		let passBoxHeight= screenHeight- passToTop + 57;
		this.setState({
			passBoxHeight,
			tableContentHeight: passBoxHeight -180
		});
	}
	
	//获取列表数据
	getInformerList = (searchMap= this.state.searchMap, blendingStatus= this.state.blendingStatus) => {
		const _this = this;
		let searchMaps= JSON.parse(JSON.stringify(searchMap));
		if (searchMaps.begindate) {
			searchMaps.begindate= moment(searchMaps.begindate).format(format) + ' 00:00:00';
		}
		if (searchMaps.enddate) {
			searchMaps.enddate= moment(searchMaps.enddate).format(format) + ' 23:59:59';
		}
		Ajax({
			url: URL + 'pass/reconciliation/'+ (blendingStatus=== 1 ? 'reconcheck' : 'list'),
			data: {
				page: 1,
				size: 10,
				searchParams: {
					searchMap: searchMaps
				}
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let companyList = data && data.head && data.head.rows && data.head.rows.map(item => item.values);
					let bankList = data && data.body && data.body.rows && data.body.rows.map(item => item.values);
					_this.setState({
						companyList: companyList || [],
						bankList: bankList || [],
						isBalance: true,
						companyMoney: 0, 		
						bankMoney: 0, 			
						companyNum: 0, 			
						bankNum: 0
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

	//手工对账，取消对账
	getBlending = (url, content) => {
		const _this = this;
		let {bankSelect, companySelect}= this.state;
		let bankArr= [];
		let companyArr= [];
		for (let item of bankSelect) {
			bankArr.push({values: item});
		}
		for (let item of companySelect) {
			companyArr.push({values: item});
		}
		Ajax({
			url: URL + 'pass/reconciliation/' + url,
			data: {
				data: {
					body: {
						rows: bankArr
					},
					head: {
						rows: companyArr
					}
				}
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					toast({content: content+ '对账成功', color: 'success'});
					_this.getInformerList();
					_this.setState({isBalance: true});

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
		let {blendingStatus}= this.state;
		this.setState({
			companyList: [],
			bankList: [],
			isBalance: blendingStatus=== 1 ? false : true,
			companyMoney: 0, 		
			bankMoney: 0, 			
			companyNum: 0, 			
			bankNum: 0
		});
	}
    
    //TableTitle
	tableTitle= (key, type) => {
		let {companyMoney, bankMoney, companyNum, bankNum, direction}= this.state;
		let allMoney= type=== 1 ? companyMoney : bankMoney;
		let length= type=== 1 ? companyNum : bankNum;
		let title= type=== 1 ? '交易记录' : '银行对账单';
		return (
			<div className='pass-table-title'>
				<span>{title}</span>
				<span className='money-num'>笔数 : {length}</span>
				<span>金额 : {Number(allMoney).formatMoney(2, '')}</span>
				<span
					className='cela-icon'
					onClick={() => {
						let {direction}= this.state;
						if (key< 2) {
							direction[0]= !direction[0];
						} else if (key> 1) {
							direction[3]= !direction[3];
						}
						this.setState({direction});
					}}
				>
					<Icon className={`iconfont ${key%2=== 1 ? 'icon-celazuo' : 'icon-cela'}`}/>
				</span>
			</div>
		);
	};

	//whichColumns
	whichColumns= key => {
		let {columnsPercent}= this.state;
		if (key< 2) {
			return [
				{ 
					title: '是否已对账', 
					key: 'checkflag', 
					dataIndex: 'checkflag', 
					width: columnsPercent[key][0],
					render: (text, record) => {
						let checkflag= record.checkflag.display || record.checkflag.value;
						return (
							<div>{checkflag== 0 ? '是' : '否'}</div>
						);
					} 
				},
				{ 
					title: '交易日期/银行流水', 
					key: 'tradedate', 
					dataIndex: 'tradedate', 
					width: columnsPercent[key][1],
					render: (text, record) => {
						return (
							<div>
								<span>{record.tradedate.display || record.tradedate.value || '—'}</span>
								<br/>
								<span>{record.bankserialnum.display || record.bankserialnum.value || '—'}</span>
							</div>
						);
					} 
				},
				{ 
					title: '对方账户/户名', 
					key: 'recaccnum', 
					dataIndex: 'recaccnum', 
					width: columnsPercent[key][2],
					render: (text, record) => {
						return (
							<div>
								<span>{record.recaccnum.display || record.recaccnum.value || '—'}</span>
								<br/>
								<span>{record.recaccname.display || record.recaccname.value || '—'}</span>
							</div>
						);
					}  
				},
				{ 
					title: '收付款/币种/金额', 
					key: 'receorpay', 
					dataIndex: 'receorpay', 
					width: columnsPercent[key][3],
					render: (text, record) => {
						let receorpay= record.receorpay.display || record.receorpay.value;
						let trademny= record.trademny.display || record.trademny.value;
						let scale= record.trademny.scale || -1;
						return (
							<div>
								{receorpay== 0 ? '收款' : (receorpay== 1 ? '支付' : '转账')}
								{record.currtypename.display || record.currtypename.value || '—'}
								{Number(trademny).formatMoney(scale> 0 ? scale : 2, '')}
							</div>
						);
					} 
				}
			];
		} else {
			return [
				{ 
					title: '是否已对账', 
					key: 'checkflag', 
					dataIndex: 'checkflag', 
					width: columnsPercent[key][0],
					render: (text, record) => {
						let checkflag= record.checkflag.display || record.checkflag.value;
						return (
							<div>{checkflag== 0 ? '是' : '否'}</div>
						);
					} 
				},
				{ 
					title: '交易日期/事件', 
					key: 'settledate', 
					dataIndex: 'settledate', 
					width: columnsPercent[key][1],
					render: (text, record) => {
						return (
							<div>
								<span>{record.settledate.display || record.settledate.value || '—'}</span>
								<br/>
								<span>{record.tranevent ? record.tranevent.display || record.tranevent.value || '—' : '—'}</span>
							</div>
						);
					} 
				},
				{ 
					title: '对方账户/户名', 
					key: 'payaccnum', 
					dataIndex: 'payaccnum', 
					width: columnsPercent[key][2],
					render: (text, record) => {
						return (
							<div>
								<span>{record.payaccnum.display || record.payaccnum.value || '—'}</span>
								<br/>
								<span>{record.payaccname.display || record.payaccname.value || '—'}</span>
							</div>
						);
					}  
				},
				{ 
					title: '收付款/币种/金额', 
					key: 'transtype', 
					dataIndex: 'transtype', 
					width: columnsPercent[key][3],
					render: (text, record) => {
						let transtype= record.transtype.display || record.transtype.value;
						let money= record.money.display || record.money.value || 0;
						let scale= record.money.scale || -1;
						return (
							<div>
								{transtype== 0 ? '收款' : (transtype== 1 ? '支付' : '转账')}
								{record.currtypename.display || record.currtypename.value}
								{Number(money).formatMoney(scale> 0 ? scale : 2, '')}
							</div>
						);
					} 
				}
			];
		}
	}

	//判断对账是否平衡
	checkBalance = (type, arr, boolArr) => {
		let {companyMoney, bankMoney, companyNum, bankNum, bankSelect, companySelect, blendingStatus}= this.state;
		let isBalance= false;
		let property= type=== 1 ? 'money' : 'trademny';
		if (type=== 1) {//公司
			companyMoney= Number(sum(arr.map(item => item[property].display || item[property].value))).toFixed(4);
			bankMoney= Number(sum(bankSelect.map(item => item['trademny'].display || item['trademny'].value))).toFixed(4);
			companyNum=arr.length;
			bankNum= bankSelect.length;
			this.setState({
				companySelect: arr,
				companyBool: boolArr
			});
		} else {//银行
			companyMoney= Number(sum(companySelect.map(item => item['money'].display || item['money'].value))).toFixed(4);
			bankMoney= Number(sum(arr.map(item => item[property].display || item[property].value))).toFixed(4);
			companyNum=companySelect.length;
			bankNum= arr.length;
			this.setState({
				bankSelect: arr,
				bankBool: boolArr
			});
		}
		let isNumReg= bankNum=== 1 && companyNum> 0;
		let isMoneyREg= companyMoney=== bankMoney;
		//公司和银行金额相等，公司大于等于一笔记录，银行必须一笔记录才可对账
		if ((isMoneyREg && isNumReg && blendingStatus> 1) || (isMoneyREg && companyMoney==0 && bankNum==0 && companyNum== 0))  {
			isBalance= true;
		}
		this.setState({
			isBalance,
			companyMoney, 
			bankMoney, 
			companyNum, 
			bankNum
		});
	};

	//面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { title: '结算平台' }, { title: '集合对账' } ];

	render() {
		let { passBoxHeight, tableContentHeight, bankList, bankBool, companyList, companyBool, bankSelect, companySelect, searchMap, currentRecord, blendingList, blendingStatus, direction, dimensionData, dimensionShow, columnsPercent, isBalance, referCode, companyMoney, scanRules} = this.state;
		let bankColumns= [
			{ 
				title: '结算方式', 
				key: 'balatypename', 
				dataIndex: 'balatypename', 
				width: '8%',
				render: (text, record) => {
					return (
						<div>—</div>
					);
				}  
			},
			{ 
				title: '摘要', 
				key: 'memo', 
				dataIndex: 'memo', 
				width: '15%',
				render: (text, record) => {
					return (
						<div>{record.memo.display || record.memo.value || '—'}</div>
					);
				}  
			},
			{ 
				title: '用途', 
				key: 'nusage', 
				dataIndex: 'nusage', 
				width: '15%',
				render: (text, record) => {
					return (
						<div>{record.nusage.display || record.nusage.value || '—'}</div>
					);
				}  
			}
		];
		let companyColums= [
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
				title: '银行流水号', 
				key: 'bankserialnum', 
				dataIndex: 'bankserialnum', 
				width: '15%',
				render: (text, record) => {
					return (
						<div>{record.bankserialnum.display || record.bankserialnum.value || '—'}</div>
					);
				}  
			},
			{ 
				title: '用途', 
				key: 'nusage', 
				dataIndex: 'nusage', 
				width: '15%',
				render: (text, record) => {
					return (
						<div>{record.nusage.display || record.nusage.value || '—'}</div>
					);
				}  
			}
		];
		
		return (
			<div className= "pass-informer bd-wraps pass-settlement">
				<BreadCrumbs items={this.breadcrumbItem} />
				<div className="bd-header select-right"> 
					<div className='credit-title'>
						<span className="bd-title-1">集合对账</span>
						{
							blendingList.map((item, key) => {
								return <Button
									key={item.name} 
									className={blendingStatus=== key ? "btn-2 blending-btn active" : "btn-2 btn-cancel blending-btn"}
									onClick={() => {
										let searchMaps= {};
										if (key=== 0) {
											searchMaps.checkflag= 2;
										} else if (key=== 3) {
											searchMaps.checkflag= 0;
										} else {
											searchMaps.checkflag= 1;
										}
										searchMaps.begindate= moment(dateAdd(new Date().getTime() - 1000*3600*24, 0, '-') + ' 00:00:00');
										searchMaps.enddate= moment(new Date());
										if (key!= 1) {
											this.getInformerList(searchMaps, key);
										} else {
											bankList= [];
											companyList= [];
										}
										this.setState({
											blendingStatus: key,
											searchMap: searchMaps,
											bankList,
											companyList,
											companySelect: [],
											bankSelect: [],
											isBalance: key> 1 ? true : false,
											companyMoney: 0, 		
											bankMoney: 0, 			
											companyNum: 0, 			
											bankNum: 0,	
											referCode: '',
											direction: [false, false, false, false],
											dimensionShow: false,
											dimensionData: []
										});
									}}
								>{item.name}</Button>
							})
						}
					</div>
					
					{blendingStatus!== 0 && 
						<div className='select-box'>
							{
								blendingStatus=== 1 && dimensionData.map(item => {
									return <span className='dimension-item'>{item.content}</span>
								})
							}
							{blendingStatus=== 1 &&
								<div className='select-dimension'>
									<Button 
										className="btn-2 btn-cancel select-dimension-btn"
										style={{marginLeft: 20}}
										onClick={() => {
											this.setState({dimensionShow: !dimensionShow});
										}}
									>
										选择维度
										{dimensionData.length> 0 &&
											[
												<span> (</span>,
												<span style={{color: '#000'}}>{dimensionData.length}</span>,
												<span>)</span>
											]
										}
										<Icon className={`iconfont icon-icon-jiantouxia ${dimensionShow ? 'down' : ''}`}/>
									</Button>
									<Dimension 
										isShow={dimensionShow}
										saveData={dimensionData.length> 0 ? true : false}
										onConfirm={(dimensionData, arr) => {
											let keys= ['checkdatedif', 'checkrecaccnum', 'checkmemo', 'checknusage'];
											delete searchMap.checkdatedif;
											delete searchMap.checkrecaccnum;
											delete searchMap.checkmemo;
											delete searchMap.checknusage;
											for (let item in arr) {
												if (arr[item]) {
													searchMap[keys[item]]= arr[item];
													if (item== 0) {
														dimensionData[0]['content']= '日期相差' + arr[0] + '天';
													}
												} 
											}
											this.setState({
												dimensionShow: false,
												dimensionData,
												searchMap
											});
										}}
									/>
								</div>
							}
						</div>
					}
				</div>
				<div className="bd-select zijinyun-search">
					<DatePickerSelect  
						placeholder='开始日期'
						value= {searchMap.begindate}
						onChange= {(date) => {
							searchMap.begindate= date;
							if (searchMap.enddate && (new Date(date)).getTime()> (new Date(searchMap.enddate)).getTime()) {
								delete searchMap.enddate;
							}
							this.setState({searchMap});
						}}
					/>
					<DatePickerSelect  
						placeholder='结束日期'
						value= {searchMap.enddate}
						onChange= {(date) => {
							searchMap.enddate= date;
							this.setState({searchMap});
						}}
						disabledDate={current => searchMap.begindate ? current && current.valueOf() < moment(searchMap.begindate) : null}
					/>
					<Refer
						placeholder="结算方式"
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/balatypeRef/'}
						refCode={'balatypeRef'}
						refName={'结算方式'}
						value={searchMap.balatypename ? {refpk: referCode, refname: searchMap.balatypename} : {}}   
						onChange={item => {
							let isEmpty= JSON.stringify(item)=== '{}';
							searchMap.balatypename= isEmpty ? '' : item.refname;
							this.setState({searchMap, referCode: 111});
						}}
					/>
					<Refer 
						placeholder="本方账户"
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/bankaccbasRef/'}
						refCode={'bankaccbasRef'}
						refName={'银行账户'}
						multiLevelMenu={[
							{
								name: ['子户编码', '子户名称'],
								code: ['refcode', 'refname']
							}
						]}
						referFilter={{
							accounttype: 0, 
							orgid: '111' //组织pk
						}}
						value={
							searchMap.accountNum ?
							{refpk: referCode, refname: searchMap.accountNum ? searchMap.accountNum : ''}
							: {}
						}   
						onChange={item => {
							let isEmpty= JSON.stringify(item)=== '{}';
							searchMap.accountNum= isEmpty ? '' : item.refcode;
							this.setState({searchMap, referCode: 111});
						}}
					/>
					<HistoryInput
						localType='recaccNum'
						placeholder='对方账号'
						value={searchMap.recaccnum ? searchMap.recaccnum : ''}
						onChange={e => {
							searchMap.recaccnum= e.target.value;
							this.setState({searchMap});
						}}
						onSelect= {val => {
							searchMap.recaccnum= val;
							this.setState({searchMap});
						}}
					/>
					<Refer
						placeholder="事件"
						ctx={'/uitemplate_web'}
						refModelUrl={'/bd/transtypeRef/'}
						refCode={'transtypeRef'}
						refName={'事件'}
						value={searchMap.tranevent ? {refpk: referCode, refname: searchMap.tranevent} : {}}   
						onChange={item => {
							let isEmpty= JSON.stringify(item)=== '{}';
							searchMap.tranevent= isEmpty ? '' : item.refname;
							this.setState({searchMap, referCode: 111});
						}}
					/>
					{blendingStatus=== 0 &&
						<Select 
							placeholder= "是否对账"
							value={searchMap.checkflag== 2 ? undefined : searchMap.checkflag}
							onChange= {val => {
								searchMap.checkflag= val;
								this.setState({searchMap});
							}}
						>
							<Option value={0}>已对账</Option>
							<Option value={1}>未对账</Option>
						</Select>
					}
					{blendingStatus!== 0 &&
						<CheckBox 
							checked={searchMap.checkflag=== 0}
							disabled={true}
							onSelect={bool => {
								searchMap.checkflag= bool ? 0 : 1;
								this.setState({searchMap});
							}}
						>是否对账</CheckBox>
					}
					<Button 
						className="search-btn"
						onClick={() => {this.getInformerList();}}
					>{blendingStatus=== 1 ? '自动对账' : '查询'}</Button>
					<span
						className='zijinyun-reset'
						onClick= {() => {
							let checkflag= 1;
							if (blendingStatus=== 0) {
								checkflag= 2;
							} else if (blendingStatus=== 3) {
								checkflag= 0;
							}
							this.setState({
								searchMap: {checkflag},
								referCode: ''
							});
						}}
					>重置</span>
				</div>
				<div className='pass-table-box' style={{maxHeight: passBoxHeight}}>
					{blendingStatus > 1 &&
						<div className='blending-balance-box'>
							<div 
								className='reconciliation-rules'
								onMouseOver={() => {this.setState({scanRules: true});}}
								onMouseOut={() => {this.setState({scanRules: false});}}
							>
								<Icon className='iconfont icon-duizhang'/>
								<span>对账规则</span>
								<div className={`reconciliation-rules-detail ${scanRules ? 'show' : ''}`}>
									<img src={reconciliationRules} alt=""/>
								</div>
							</div>
							{
								isBalance ?
									<div className='blending-balance yes'>
										<Icon className='iconfont icon-tishianniuchenggong'/>
										<span style={{fontSize: 24}}>对账平衡</span>
									</div>
								:
									<div className='blending-balance no'>
										<Icon className='iconfont icon-tishianniuguanbi'/>
										<span style={{fontSize: 24}}>对账不平衡</span>
									</div>
							}
							{isBalance && companyMoney > 0 &&
								<Button 
									className='btn-2 blending-btn'
									onClick= {() => {
										this.getBlending(blendingStatus=== 2 ? 'handconfirm' : 'cancelcheck', blendingStatus=== 2 ? '手工' : '取消');
									}}
								>
									{blendingStatus=== 2 ? '确认对账' : '取消对账'}
								</Button>
							}
						</div>
					}
					{
						blendingStatus=== 1 && isBalance &&
						<div className='blending-balance-box'>
							<div className={blendingStatus=== 1 ? 'blending-balance yes auto' : 'blending-balance yes'}>
								<Icon className='iconfont icon-tishianniuchenggong'/>
								<span style={{fontSize: 24}}>自动对账完成</span>
							</div>
						</div>
					}
					{
						(blendingStatus== 0 || (blendingStatus== 1 && !isBalance)) &&
						<div className='blending-balance-box' style={{textAlign: 'center', lineHeight: '50px'}}>
							<span style={{fontSize: 24, color: '#333'}}>
								{blendingStatus== 0 ? '对账查询' : '自动对账'}
							</span>
						</div>
					}
					<CheckTable 
						bordered 
						className={direction[3] ? "bd-table all all-left active double table-scroll" : "bd-table all all-left double table-scroll"}
						emptyText={() => <div>
								<img src={nodataPic} alt="" />
							</div>
						} 
						columns={this.whichColumns(3).concat(companyColums)} 
						data={companyList} 
						rowKey={record => record.id.value}
						title={() => this.tableTitle(3, 1)}
						selectedList={(companySelect, companyBool) => {this.checkBalance(1, companySelect, companyBool);}}
						selectedBool= {companyBool}
						scroll={{y: tableContentHeight}}
					/>
					<CheckTable 
						bordered 
						className="bd-table half half-left double table-scroll"
						emptyText={() => <div>
								<img src={nodataPic} alt="" />
							</div>
						} 
						columns={this.whichColumns(2)} 
						data={companyList} 
						rowKey={record => record.id.value}
						title={() => this.tableTitle(2, 1)}
						selectedList={(companySelect, companyBool) => {this.checkBalance(1, companySelect, companyBool);}}
						selectedBool= {companyBool}
						scroll={{y: tableContentHeight}}
					/>
					<CheckTable 
						bordered 
						className="bd-table half half-right double table-scroll"
						emptyText={() => <div>
								<img src={nodataPic} alt="" />
							</div>
						} 
						columns={this.whichColumns(1)} 
						data={bankList} 
						rowKey={record => record.id.value}
						title={() => this.tableTitle(1, 2)}
						selectedList={(bankSelect, bankBool) => {this.checkBalance(2, bankSelect, bankBool);}}
						selectedBool= {bankBool}
						scroll={{y: tableContentHeight}}
					/>
					<CheckTable 
						bordered 
						className={direction[0] ? "bd-table all all-right active double table-scroll" : "bd-table all all-right double table-scroll"}
						emptyText={() => <div>
								<img src={nodataPic} alt="" />
							</div>
						} 
						columns={this.whichColumns(0).concat(bankColumns)} 
						data={bankList} 
						rowKey={record => record.id.value}
						title={() => this.tableTitle(0, 2)}
						selectedList={(bankSelect, bankBool) => {this.checkBalance(2, bankSelect, bankBool);}}
						selectedBool= {bankBool}
						scroll={{y: tableContentHeight}}
					/>
				</div>
			</div>
		);
	}
}
