import React, { Component } from 'react';
import { hashHistory  } from 'react-router';
import axios from 'axios';
import { Panel, Button, Con, Row, Col, Icon, Table } from 'tinper-bee';
import Affix from 'bee-affix';
import 'bee-affix/build/Affix.css';
import Loading from 'bee-loading';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import moment from 'moment';
import LightTabs from '../LightTabs';
import '../index.less';
import  Form from 'bee-form';
import 'bee-form/build/Form.css';

//上传附件
import TmcUploader from 'containers/TmcUploader';

import { Element as ScrollElement, Link as ScrollLink} from 'react-scroll';

import { toast } from 'utils/utils';

import BreadCrumbs from '../../../../bd/containers/BreadCrumbs';

// const format = 'YYYY-MM-DD HH:mm:ss';
const format = 'YYYY-MM-DD';
const dateInputPlaceholder = '选择日期';

const contstatusMap = {
	'0': '申请待审批',
	'1': '申请已审批',
	'2': '合约待审批',
	'3': '合约已审批',
	'4': '合约在执行',
	'5': '合约已结束',
	'6': '申请待提交',
	'7': '合约待提交'
};

const vbillstatusMap = {
	'0': '待提交',
	'1': '审批通过',
	'2': '审批中',
	'3': '待审批'
};

const periodunitMap = {
	'YEAR': '年',
	'QUARTER': '季',
	'MONTH': '月',
	'DAY': '日'
};

const periodloanMap = {
	'short': '短期',
	'metaphase': '中期',
	'long': '长期'
}

const booleanMap = {
	'1': '是',
	'0': '否'	
};


const guaranteetypeMap = {
	'0': '保证',
	'1': '信用',
	'2': '保证金',
	'3': '抵押',
	'4': '质押',
	'5': '混合'
};


export default class ContractTracelog extends Component {


 	state = {

 		//页面状态 EDIT VIEW 
 		editStatus: 'VIEW',
 		//页面标题
 		title: '变更记录',
 		// 是否在请求
 		isLoading: false,
 		id: this.props.location.query.id,


 		tabActive: 1,

 		//表体是否显示
 		hasPayplan: true,
 		hasCreditinfo: true,
 		hasSyndicatedloan: true,
 		hasGuarantee: true,

 		//表体当前切换页码
 		tabsActiveKey: 1,


 		//变更记录列表

 		loglist: [],

 		//当前变更记录
 		curVersion:0,

 		//表体是否显示
 		//放款计划
 		hasPayplan: true,
 		//授信
 		hasCreditinfo: false,
 		//银团
 		hasSyndicatedloan: false,
 		//担保
 		hasGuarantee: false,

 		//表体当前切换页码
 		tabsActiveKey: 1,

 		//表头信息  合约信息  保证金信息
 		contractInfoData: {
 			contractcode: {},
 			applyno: {},
 			financorg: {},
 			applydate: {},
 			financorganization: {},
 			currtypeid: {},
 			financamount:{},
 			olcrate: {},
 			begindate: {},
 			enddate: {},
 			isfixedintrate: {},
 			transactclass: {},
 			transacttype: {},
 			vbillstatus: {},
 			guaranteetype: {},
 			periodcount: {},
 			periodunit: {},
 			periodloan: {},
 			contstatus: {},
 			rateid: {},
 			iadate: {},
 			returnmode: {},
 			projectid: {},
 			isprinrelease: {},

			// creditplan: {},
 			versiondate: {},
 			signdate: {},
 			memo: {},
 			iscreditcc: {
 				display: '',
 				value: true,
 				scale: -1
 			}
 		},
 		depositinfoData: {},

		//表体信息  放款计划  银行贷款
		payplanData: {
			rows: [],
			index: 0,
			newLine: {
				isEdit: true,
				payplancode: {
					value: null,
					display: '',
					scale: -1
				},
				guaranteemny: {
					value: null,
					display: '',
					scale: -1
				},
				creditdate: {
					value: null,
					display: '',
					scale: -1
				},
				contractid: {
					value: null,
					display: '',
					scale: -1
				},
				tenantid: {
					value: null,
					display: '',
					scale: -1
				},
				sysid: {
					value: null,
					display: '',
					scale: -1
				}

				// ts
				// dr
			}
		},
		//授信
		creditinfoData: {
			rows:[],
			index: 0,
			newLine: {
				isEdit: true,
				// id: {
				// 	value: null,
				// 	display: '',
				// 	scale: -1
				// },
				bankprotocolid: {
					value: null,
					display: '',
					scale: -1
				},
				cccurrtypeid: {
					value: null,
					display: '',
					scale: -1
				},
				cctypeid: {
					value: null,
					display: '',
					scale: -1
				},
				creditcc: {
					value: null,
					display: '',
					scale: -1
				},
				ccamount: {
					value: null,
					display: '',
					scale: -1
				}
			}
		},

		syndicatedloanData: {
			rows: [],
			index: 0,
			newLine: {
				isEdit: true,
				financagency: {
					value: null,
					display: '',
					scale: -1
				},
				finanparticipate: {
					value: null,
					display: '',
					scale: -1
				},
				conratio: {
					value: null,
					display: '',
					scale: -1
				},
				practiceratio: {
					value: null,
					display: '',
					scale: -1
				},
				confinancmny: {
					value: null,
					display: '',
					scale: -1
				},
				practicefinancmny: {
					value: null,
					display: '',
					scale: -1
				},
				applyid: {
					value: null,
					display: '',
					scale: -1
				},
				contractid: {
					value: null,
					display: '',
					scale: -1
				},
				tenantid: {
					value: null,
					display: '',
					scale: -1
				},
				sysid: {
					value: null,
					display: '',
					scale: -1
				}
				// ,
				// ts: {
				// 	value: null,
				// 	display: '',
				// 	scale: -1
				// },
				// dr: {
				// 	value: null,
				// 	display: '',
				// 	scale: -1
				// }
			}
		},
 		guaranteeData: {
 			rows: [],
 			index: 0,
 			newLine: {
 				// id: {
 				// 	value: null,
 				// 	display: '',
 				// 	scale: -1
 				// },
 				guaranteetype: {
 					value: null,
 					display: '',
 					scale: -1
 				},
 				guaranteeid: {
 					value: null,
 					display: '',
 					scale: -1
 				},
 				guaranteemny: {
 					value: null,
 					display:'',
 					scale: -1
 				},
 				gecurrtypeid: {
 					value: null,
 					display: '',
 					scale: -1
 				},
 				guaproportion: {
 					value: null,
 					display:'',
 					scale: -1
 				},
 				contractenddate: {
 					value: null,
 					display:'',
 					scale: -1
 				},
 				contractbegindate: {
 					value: null,
 					display:'',
 					scale: -1
 				},
 				contractid: {
 					value: null,
 					display:'',
 					scale: -1
 				},
 				tenantid: {
 					value: null,
 					display:'',
 					scale: -1
 				}

				// contractenddate
				// contractbegindate
				// contractid
				// tenantid
				// sysid
				// ts
				// dr


 			}
 		}
 	}

 	changeTab = (item) => {
 		this.setState({
 			curVersion: item.version,
 			isLoading: true
 		});
 		this.searchById(item.id);
 	}

 	componentWillMount() {
 		console.log('this is id print', this.state.id);

 		let { id } = this.state;
 		if (id) {
 			this.searchLogById(id);
 		}
 		
 	}


	searchLogById(id) {
		let self = this;
		axios.post(window.reqURL.fm + 'fm/contract/changercord', {
			id: id
		}).then(function(response) {

			let { data, message, success } = response.data;


			if (success) {
				self.initLoglist(data);
			} else {

				toast({
					content: message.message,
					color: 'warning'
				});

				self.setState({
					isLoading: false
				});
			}
			// self.echoData(data);
		}).catch(function(error) {
			console.log(error, 'error');
			toast({content: '后台报错,请联系管理员', color: 'danger'});
			// self.state.isLoading = false;
			self.setState({
				isLoading: false
			});
		});

		this.setState({
			isLoading: true
		});
	}

	filterBodyListBydr(v, i, a) {
		// dr = 1 表示删除

		if (!v.dr) {
			return true;
		}

		return v.dr.value != 1;
	}

	formatAcuracy (value, len) {
 		// return this.toThousands(formatVal);
 		if (value.value === null || value.value === undefined) {
 			return value.value;
 		}
 		return this.commafy(this.formatDot(value, len));
 	}

 	formatDot(value, len) {
		let formatVal, dotSplit, val;

		val = (value.value || 0).toString();

		dotSplit = val.split('.');

		if (dotSplit.length > 2 || !value.value) {
			return value.value
		}

		if (value.scale && value.scale != '-1') {
			len = value.scale;
		}

		len = len || 2;

		if (val.indexOf('.') > -1) {
			formatVal = val.substring(0, val.indexOf('.') + len + 1);
		} else {
			formatVal = val;
		}

		return formatVal;
 	}



 	//数字转换成千分位 格式
	commafy(num) {
		let pointIndex, intPart, pointPart;

		if (isNaN(num)) {
			return "";
		}

		num = num + "";
		if (/^.*\..*$/.test(num)) {
			pointIndex = num.lastIndexOf(".");
			intPart = num.substring(0, pointIndex);
			pointPart = num.substring(pointIndex + 1, num.length);
			intPart = intPart + "";
			let re = /(-?\d+)(\d{3})/
			while (re.test(intPart)) {
				intPart = intPart.replace(re, "$1,$2")
			}
			num = intPart + "." + pointPart;
		} else {
			num = num + "";
			let re = /(-?\d+)(\d{3})/
			while (re.test(num)) {
				num = num.replace(re, "$1,$2")
			}
		}
		return num;
	}
 	removeThousands(val) {
 		return val ? val.toString().replace(/\,/gi, '') : val;
 	}


	initLoglist(data) {
		console.log('initLoglist', data);
		let { rows } = data.contractInfo
		let loglist = [];
		let indexId = null;

		rows.forEach(function(v, i, a) {
			let obj = {};
			let { values } = v;
			obj.id = values.id.value;
			obj.version = values.version.value;
			if (i === 0) {
				indexId = obj.id;
			}
			loglist.push(obj);
		});

		this.state.loglist = loglist;

		if (indexId) {
			this.searchById(indexId);
		} else {

			this.setState({
				isLoading: false
			});

			toast({
				content: '首条数据的id为空',
				color: 'warning'
			});
		}



	}




 	searchById(id) {
		let self = this;

		axios.post(window.reqURL.fm + 'fm/contract/selectById', {
				id: id
			}).then(function(response) {
				const { data, message, success } = response.data;
				console.log( data, message, success);

				if (success) {
					self.echoData(data, response.data);
				} else {

					toast({content: message.message, color: 'warning'});
					self.setState({
						isLoading: false
					});
				}

			}).catch(function(error) {
				toast({content: '后台报错,请联系管理员', color: 'danger'});
				self.setState({
					isLoading: false
				});
			});
 	}

 	cleanState() {
 		let { payplanData, creditinfoData, guaranteeData, syndicatedloanData, contractInfoData} = this.state;
 		payplanData.index = 0;
 		payplanData.rows = [];
 		syndicatedloanData.index = 0;
 		syndicatedloanData.rows = [];
 		creditinfoData.index = 0;
 		creditinfoData.rows = [];
 		guaranteeData.index = 0;
 		guaranteeData.rows = [];

 		for(let p in contractInfoData) {
 			p = {};
 		}

 	}
	echoData(data, response) {

 		let self = this;
 		let hasGuaranteeArr = ['0', '3', '4', '5'];
 		this.cleanState();
 		let {
			syndicatedloanData,
			contractInfoData,
			payplanData,
			creditinfoData,
			guaranteeData,

			hasSyndicatedloan,
			hasCreditinfo,
			hasGuarantee
		} = this.state;


		let { contractInfo, bankLoadInfo, payplanInfo, guaranteeInfo, creditinfo} = data;
 
		let contractInfoValues = contractInfo.rows[0].values;


		for(let p in contractInfoValues) {
			contractInfoData[p] = contractInfoValues[p];
			if (p ==  'transacttype' && contractInfoData[p]['display'] == '银团贷款') {
				hasSyndicatedloan = true;
			}

			if (p == 'iscreditcc' && !contractInfoData[p]['value']) {
				hasCreditinfo = true;
			}

			if (p == 'guaranteetype' && hasGuaranteeArr.indexOf(contractInfoData[p]['value']) > -1) {
				hasGuarantee = true;
			}
		}


		//放款计划
		if (payplanInfo) {
			payplanInfo.rows.forEach(function(v, i, a) {
				let item = {};
				let { values } = v;

				item.isEdit = true;
				// item.key = i + 1;
				item.key = ++payplanData.index;
				for (let p in values) {
					item[p] = values[p];
				}

				payplanData.rows.push(item);
			});
		}

		//银团贷款
		if (bankLoadInfo) {
			bankLoadInfo.rows.forEach(function(v, i, a) {
				let item = {};
				let { values } = v;
				// syndicatedloanData.index++;

				item.isEdit = true;
				// item.key = i + 1;
				item.key = ++syndicatedloanData.index;

				//更换代理行参与行信息
				if (item.key == '1' && values.financagency.value) {
					values.finanparticipate = values.financagency;
					delete values['financagency'];
				}


				if (item.key != '1' && values.financagency.value) {
					syndicatedloanData.rows[0].key = item.key;
					item.key = '1';
					values.finanparticipate = values.financagency;
					delete values['financagency'];
				}


				for (let p in values) {
					item[p] = values[p];
				}

				if (item.key == '1') {
					syndicatedloanData.rows.unshift(item);
				} else {
					syndicatedloanData.rows.push(item);
				}
			});

		}

		//授信表体
		if(creditinfo) {
			creditinfo.rows.forEach((v, i, a) => {
				let item = {};
				let { values } = v;

				item.isEdit = true;
				item.key = ++creditinfoData.index;

				for (let p in values) {
					item[p] = values[p];
				}

				creditinfoData.rows.push(item);

			});
		}

		//担保表体
		if(guaranteeInfo) {
			guaranteeInfo.rows.forEach((v, i, a) => {
				let item = {};
				let { values } = v;

				item.isEdit = true;
				item.key = ++guaranteeData.index;

				for (let p in values) {
					item[p] = values[p];
				}

				guaranteeData.rows.push(item);
			});
		}

			//  else {
			// 	// if (bankLoadInfo.rows.length < 1) {
			// 	syndicatedloanData.index++;
			// 	let newLine = Object.assign({}, syndicatedloanData.newLine, {
			// 		key: syndicatedloanData.index,
			// 		isEdit: true
			// 	});
			// 	syndicatedloanData.rows.push(newLine);
			// 	// }
			// }


		// }


 		// self.state.isLoading = false;
		this.setState({
			isLoading: false,
			cacheData: response,
			contractInfoData: contractInfoData,
			syndicatedloanData: syndicatedloanData,
			creditinfoData: creditinfoData,
			guaranteeData: guaranteeData,
			payplanData: payplanData,
			hasSyndicatedloan,
			hasCreditinfo,
			hasGuarantee
		});
 	}


	render() {


		console.log('render====>', this.state);
		let self = this;

		let { loglist, contractInfoData } = this.state;
		let payplanTitle = () => (<div className="fr"><Button onClick={()=> {this.handleAddNewline('payplanData', 1) }} >新增</Button></div>);

		let payplanColums = [
			{
				title: "放款编号",
				dataIndex: "key",
				key: "key"
			},{
				title: "放款日期",
				dataIndex: "creditdate",
				key: "creditdate",
				render: (text, record, index) =>  <span>{text.value}</span>
			},{
				title: "放款金额",
				dataIndex: "guaranteemny",
				key: "guaranteemny",
				render: (text, record, index) =>  <span>{this.formatAcuracy(text)}</span> 
			},{
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 100,
				render: (text, record, index) => <span>操作</span>
			}
		];

		let creditinfoColumns = [
			{
				title: "授信协议",
				dataIndex: "bankprotocolid",
				key: "bankprotocolid",
				render: (text, record, index) =>  <span>{text.display}</span> 
			},{
				title: "授信币种",
				dataIndex: "cccurrtypeid",
				key: "cccurrtypeid",
				render: (text, record, index) =>  <span>{text.display}</span> 
			},{
				title: "授信类别",
				dataIndex: "cctypeid",
				key: "cctypeid",
				render: (text, record, index) => <span>{text.display}</span> 
			},
			// {
			// 	title: "放款占用授信",
			// 	dataIndex: "guaranteemny",
			// 	key: "guaranteemny",
			// 	render: (text, record, index) =>  <span>{text}</span> 
			// },
			{
				title: "占用授信金额",
				dataIndex: "ccamount",
				key: "ccamount",
				render: (text, record, index) =>  <span>{this.formatAcuracy(text)}</span> 
			}
		];

		let syndicatedloanTitle = () => (<div className="fr"><Button onClick={()=> {this.handleAddNewline('syndicatedloanData', 3) }} >新增</Button></div>);


		let syndicatedloanColumns = [
			{
				title: "银行类别",
				dataIndex: "bankType",
				width: 100,
				key: "bankType",
				render: (text, record, index) => ((record.key == '1' ) ?  '  代理行  ' : '  参与行  ')
			},{
				title: "银行组织",
				dataIndex: "finanparticipate",
				key: "finanparticipate",
				render: (text, record, index) =>  <span>{text.display}</span>
			},
			// {
			// 	title: "融资参与行",
			// 	dataIndex: "finanparticipate",
			// 	key: "finanparticipate",
			// 	render: (text, record, index) =>  <span>{text}</span> 
			// },
			{
				title: "约定比例%",
				dataIndex: "conratio",
				key: "conratio",
				render: (text, record, index) =>  <span>{`${this.formatAcuracy(text) || ''}%`}</span>
			},{
				title: "约定贷款金额",
				dataIndex: "confinancmny",
				key: "confinancmny",
				render: (text, record, index) => <span>{this.formatAcuracy(text)}</span>  
			},{
				title: "实际比例%",
				dataIndex: "practiceratio",
				key: "practiceratio",
				render: (text, record, index) =>  <span>{`${this.formatAcuracy(text) || ''}%`}</span>
			},{
				title: "实际贷款金额",
				dataIndex: "practicefinancmny",
				key: "practicefinancmny",
				render: (text, record, index) =>  <span>{this.formatAcuracy(text)}</span>  
			} 
		];

		let guaranteeColumns = [
			{
				title: "担保方式",
				dataIndex: "guaranteetype",
				key: "guaranteetype",
				render: (text, record, index) =><span>{text.value}</span>
			},{
				title: "担保合同",
				dataIndex: "guaranteeid",
				key: "guaranteeid",
				render: (text, record, index) =>  <span>{text.display}</span> 
			},{
				title: "占用担保金额",
				dataIndex: "占用担保金额",
				key: "占用担保金额",
				render: (text, record, index) =>  <span>{this.formatAcuracy(text)}</span> 
			},{
				title: "担保币种",
				dataIndex: "gecurrtypeid",
				key: "gecurrtypeid",
				render: (text, record, index) =>  <span>{text.display}</span> 
			},{
				title: "担保比例%",
				dataIndex: "guaproportion",
				key: "guaproportion",
				render: (text, record, index) =>  <span>{`${this.formatAcuracy(text) || ''}%`}</span>
			},{
				title: "合约开始日期",
				dataIndex: "contractbegindate",
				key: "contractbegindate",
				render: (text, record, index) =><span>{text.value}</span> 
			},{
				title: "合约开始日期",
				dataIndex: "contractenddate",
				key: "contractenddate",
				render: (text, record, index) => <span>{text.value}</span>
			}
		];



		let payplanRows = this.state.payplanData.rows.filter(this.filterBodyListBydr);
		let syndicatedloanRows = this.state.syndicatedloanData.rows.filter(this.filterBodyListBydr);
		let creditinfoRows = this.state.creditinfoData.rows.filter(this.filterBodyListBydr);
		let guaranteeRows = this.state.guaranteeData.rows.filter(this.filterBodyListBydr)

		let tabs = [
			{
				key: 1,
				isShow: this.state.hasPayplan,
				label: '放款',
				render: () =><Table   columns={payplanColums} data={ payplanRows } />
			},{ 
				key: 2,
				isShow: this.state.hasCreditinfo,
				label: '授信',
				render: () => <Table columns={creditinfoColumns} data={ creditinfoRows } />
			},{
				key: 3,
				label: '银团',
				isShow: this.state.hasSyndicatedloan,
				render: () => <Table columns={syndicatedloanColumns} data={ syndicatedloanRows } /> 
			},{
				key: 4,
				label: '担保',
				isShow: this.state.hasGuarantee,
				render: () => <Table columns={guaranteeColumns} data={ guaranteeRows } /> 
			}
		];

		const breadcrumbItem = [ { href: '#', title: '首页' }, { title: '融资申请' }, { title: '贷款申请' }, { title: '变更记录' } ];

		return<div className="cloud-fund-contract-wrap" >
				<BreadCrumbs items={ breadcrumbItem } />
				<div className="contract-content">
					<Row>
						<Col  md={12}   xs={12}   sm={12} >
							<div  className="cf">
							<Affix offsetTop={0}  style={{ zIndex: 8000 }} >
			 					<div className="tab-header " style={{ zIndex: 8000}} >
			 						<div className="tab-header-left">{ this.state.title }</div>
			 						<div className="tab-header-mid">
			 							<ul>
			 								<ScrollLink to="contractinfo" spy={true} smooth={true} duration={500} offset={-50}>
												<li><a href="javascript:;">合同信息</a></li>
								 			</ScrollLink>
											{/*  } >
								 				<a href="javascript:;">保证金信息</a>
								 			</li>*/}
								 			<ScrollLink to="otherinfo" spy={true} smooth={true} duration={500} offset={-50}>
												<li><a href="javascript:;">其他信息</a></li>
									 		</ScrollLink>
			 							</ul>
			 						</div>
			 					</div>
			 				</Affix>
			 				</div>
			 				{/*<Row> tab-side-active */}
			 				<div className="tab-side-container ">
			 					<ul className="tab-side-ul">
			 						{
			 							loglist.length > 0 ? (
			 							loglist.map((v, i, a) => {

			 								if ( v.version == self.state.curVersion ) {
			 									return <li className='tab-side-li tab-side-active'
						 								onClick={(e) => {
						 									self.changeTab(v);
						 								}} ><span className="version-text">{`V${v.version}`}</span></li> 
			 								} else {
			 									return <li className='tab-side-li '
						 								onClick={(e) => {
						 									self.changeTab(v);
						 								}} ><span className="version-text">{`V${v.version}`}</span></li> 
			 								}
			 							})) : (<li className='tab-side-li' ><span className="version-text">无记录</span></li>)
			 						}
			 					</ul>
			 				</div>

			 				<div className="section-container tacelog-conatainer" style={{float: 'left', width: 1040, display: 'inline-block'}} >
			 					<ScrollElement name="contractinfo">
									<section  >
										<Panel style={{borderTop: 'none'}} >
											<div className="section-title">合约信息</div>
		 										<Row>
													<Col md={6} xs={6} sm={6} >
														<Col mdOffset={2} xsOffset={2} smOffset={2}  md={4} xs={4} sm={4} >
															<div className='label-display'>合约编号：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ contractInfoData.contractcode.value }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>申请单号：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ contractInfoData.applyno.value }</div>
														</Col>
													</Col>

													<Col md={6} xs={6} sm={6} >
														<Col mdOffset={2} xsOffset={2} smOffset={2}  md={4} xs={4} sm={4} >
															<div className='label-display'>贷款单位：</div>
														</Col>
														<Col md={3} xs={3} sm={3} >
															<div className= 'value-display' >{ contractInfoData.financorg.display }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>申请日期：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ contractInfoData.applydate.value }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col mdOffset={2} xsOffset={2} smOffset={2}  md={4} xs={4} sm={4} >
															<div className='label-display'>贷款机构：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ contractInfoData.financorganization.display }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col mdOffset={2} xsOffset={2} smOffset={2}  md={4} xs={4} sm={4} >
															<div className='label-display'>交易大类：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ contractInfoData.transactclass.display }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>交易类型：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ contractInfoData.transacttype.display }</div>
														</Col>
													</Col>

													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>币种：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ contractInfoData.currtypeid.display }</div>
														</Col>
													</Col>

													<Col md={6} xs={6} sm={6} >
														<Col mdOffset={2} xsOffset={2} smOffset={2}  md={4} xs={4} sm={4} >
															<div className='label-display'>贷款金额：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ this.formatAcuracy(contractInfoData.financamount) }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>本币汇率：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ this.formatAcuracy(contractInfoData.olcrate) }</div>
														</Col>
													</Col>

													<Col md={6} xs={6} sm={6} >
														<Col mdOffset={2} xsOffset={2} smOffset={2}  md={4} xs={4} sm={4} >
															<div className='label-display'>起始日期：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ contractInfoData.begindate.value }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col mdOffset={2} xsOffset={2} smOffset={2}  md={4} xs={4} sm={4} >
															<div className='label-display'>期间：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ contractInfoData.periodcount.value }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>期间单位：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ periodunitMap[contractInfoData.periodunit.value] || '' }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>结束日期：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ contractInfoData.enddate.value }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col mdOffset={2} xsOffset={2} smOffset={2}  md={4} xs={4} sm={4} >
															<div className='label-display'>利率：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ contractInfoData.rateid.display }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>担保方式：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ guaranteetypeMap[contractInfoData.guaranteetype.value] || '' }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col mdOffset={2} xsOffset={2} smOffset={2}  md={4} xs={4} sm={4} >
															<div className='label-display'>固定利率：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ booleanMap[contractInfoData.isfixedintrate.value] || ''}</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>借贷期间：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className="value-display" >{ periodloanMap[contractInfoData.periodloan.value] || '' }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col mdOffset={2} xsOffset={2} smOffset={2}  md={4} xs={4} sm={4} >
															<div className='label-display'>结息日：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ contractInfoData.iadate.display }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>还款方式：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ contractInfoData.returnmode.display }</div>
														</Col>
													</Col>

													<Col md={6} xs={6} sm={6} >
														<Col mdOffset={2} xsOffset={2} smOffset={2}  md={4} xs={4} sm={4} >
															<div className='label-display'>审批状态：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ vbillstatusMap[contractInfoData.vbillstatus.value] || '' }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>合约状态：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ contstatusMap[contractInfoData.contstatus.value] || '' }</div>
														</Col>
													</Col>

													<Col md={6} xs={6} sm={6} >
														<Col mdOffset={2} xsOffset={2} smOffset={2}  md={4} xs={4} sm={4} >
															<div className='label-display'>合约版本日期：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ contractInfoData.versiondate.value }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>合约签定日期：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ contractInfoData.signdate.value }</div>
														</Col>
													</Col>
													<Col md={12} xs={12} sm={12} >
														<Col  mdOffset={1} xsOffset={1} smOffset={1} md={2} xs={2} sm={2} >
															<div className='label-display'>资金用途：</div>
														</Col>
														<Col md={8} xs={8} sm={8} >
															<div className= 'value-display' >{ contractInfoData.memo.value }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>放款占用授信：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ contractInfoData.iscreditcc.value ? '是': '否' }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>项目：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ contractInfoData.projectid.display }</div>
														</Col>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<Col  mdOffset={2} xsOffset={2} smOffset={2} md={4} xs={4} sm={4} >
															<div className='label-display'>还本释放担保：</div>
														</Col>
														<Col md={6} xs={6} sm={6} >
															<div className= 'value-display' >{ contractInfoData.isprinrelease.value ? '是': '否' }</div>
														</Col>
													</Col>

												</Row>
										</Panel>
									</section>
								</ScrollElement>
								{/*	 <section  ref={(ele) => { this.sectionEle1 = ele; }} >
									<Panel >
										<div className="section-title"> 保证金信息</div>

										<Row>
											<Col md={12} xs={12} sm={12} >
												<Col md={6} xs={6} sm={6} >
													<Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
														<div className='label-display'>编号：</div>
													</Col>
													<Col md={3} xs={3} sm={3} >
														<div className= 'value-display' >{ this.state.creditinfo.depositno.value }</div>
													</Col>
												</Col>
												<Col md={6} xs={6} sm={6} >
													<Col  mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
														<div className='label-display'>使用金额：</div>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<div className= 'value-display' >{ this.state.creditinfo.depositmny.value }</div>
													</Col>
												</Col>
											</Col>
											<Col md={12} xs={12} sm={12} >
												<Col md={6} xs={6} sm={6} >
													<Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
														<div className='label-display'>占贷款比例%：</div>
													</Col>
													<Col md={3} xs={3} sm={3} >
														<div className= 'value-display' >{ this.state.creditinfo.depositratio.value }</div>
													</Col>
												</Col>
												<Col md={6} xs={6} sm={6} >
													<Col  mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
														<div className='label-display'>币种：</div>
													</Col>
													<Col md={6} xs={6} sm={6} >
														<div className= 'value-display' >{ this.state.creditinfo.dptcurrtypeid.value }</div>
													</Col>
												</Col>
											</Col>
											<Col md={12} xs={12} sm={12} >
												<Col md={6} xs={6} sm={6} >
													<Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
														<div className='label-display'>存款收益：</div>
													</Col>
													<Col md={3} xs={3} sm={3} >
														<div className= 'value-display' >{ this.state.creditinfo.depositprofit.value }</div>
													</Col>
												</Col>
											</Col>
										</Row>
									</Panel>
								</section>*/}
								<ScrollElement name="otherinfo">
								<section >
									<Panel >
										<div className="section-title">其他信息</div>
										<LightTabs activeKey={ this.state.tabsActiveKey }  items={tabs} />
									</Panel>
								</section>
								</ScrollElement>
							</div>
							{/*</Row>*/}
						</Col>
			        </Row>
					<Loading fullScreen showBackDrop={ true } show={ this.state.isLoading } />
	            </div>
		    </div>
	}
}