import React, { Component } from 'react';
import { hashHistory  } from 'react-router';
import axios from 'axios';
import { Panel, FormGroup, Navbar, Timeline, Label, Button, FormControl, Radio, InputGroup, Breadcrumb, PanelGroup, Con, Row, Col, Tree, Message,Switch, Icon, Table, Pagination } from 'tinper-bee';
import Affix from 'bee-affix';
import 'bee-affix/build/Affix.css';
import Tabs , { TabPane } from 'bee-tabs';
import TabBar from 'bee-tabs/build/TabBar';
import TabContent from 'bee-tabs/build/TabContent';
import Slider from 'bee-slider';
import DatePicker from 'bee-datepicker';
import Loading from 'bee-loading';
import FormItemTab from '../FormItem';
import jump from 'jump.js';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import moment from 'moment';
import 'bee-slider/build/Slider.css';
import { toast } from 'utils/utils';

import { CheckboxItem, RadioItem, TextAreaItem, ReferItem , InputItem} from 'containers/FormItems';

import Select from 'bee-select';
import LightTabs from '../LightTabs';
import '../index.less';
import  Form from 'bee-form';
import 'bee-form/build/Form.css';
import BreadCrumbs from '../../../../bd/containers/BreadCrumbs';

var qs = require('qs');

const { TreeNode } = Tree;
const { FormItem } = Form;
const Option = Select.Option;
// const format = 'YYYY-MM-DD HH:mm:ss';
const format = 'YYYY-MM-DD';
const dateInputPlaceholder = '选择日期';
const guaranteetypeMap = {
	'0': '保证',
	'1': '抵押',
	'2': '质押',
	'3': '混合'
};

const contracttypeMap = {
	'0': '担保合同',
	'1': '反担保合同'
};

const creditortypeMap= {
	'0':'金融机构',
	'1':'合作伙伴',
	'2':'内部单位'
}
const debtortypeMap= {
	'0':'合作伙伴',
	'1':'企业本身',
	'2':'内部单位'
}
const warrantorintypeMap= {
	'0':'合作伙伴',
	'1':'企业本身',
	'2':'内部单位'
}
const warliabilityMap= {
	'0':'一般保证',
	'1':'连带责任保证'
}
export default class ContractTracelog extends Component {


 	state = {

 		//页面状态 EDIT VIEW 
 		editStatus: 'VIEW',
 		//页面标题
 		title: '变更记录',
 		// 是否在请求
 		isLoading: false,
 		checkForm: false,
 		id: this.props.location.query.id,


		 tabActive: 1,
		 
		//变更记录列表
		loglist: [],
		
 		//当前变更记录
 		curVersion:1,


 		//是否可以提交

 		isContractSubmitble: false,
 		isCreditSubmitble: false,


 		//表体是否显示
 		hasPayplan: true,
 		hasCreditinfo: true,
 		hasSyndicatedloan: true,
 		hasGuarantee: true,

 		//表体当前切换页码
		 tabsActiveKey: 1,
		 
 	

		//表头信息 合约信息 债务信息 担保信息
		assureInfo: {
			contracttype: {},
			contractno: {},
			vbillno: {},
			creditortype: {},
			creditor: {},
			debtortype: {},
			debtor: {},
			warrantorintype: {},
			warrantorin: {},
			guarantor: {},
			guatype: {},
			
			//债务信息
			debttype: {},
			debtnote: {},
			startdate: {},
			enddate:{},
			debtcurrencyid: {},
			pridebtamount:{},
			olcdebtrate: {},

			//担保信息
			guastartdate:{},//担保起始日期
			guaenddate:{},
			guacurrtypeid:{},
			guaamount:{},
			guaolcrate:{},
			gualcamount:{},//担保本币金额
			usedamount:{
				value:'0'
			},//已用担保金额
			avaamount:{
				value:'0'
			},//可用担保金额
			waramount:{},
			pleamount:{},
			moramount:{},
			billmaker:{},
			billmaketime:{},
			warliability:{},//保证责任
			busistatus:{
				value:'3'
			},//合约状态

		},

		//表体信息
		pledgemessage: {
			rows: [],
			index: 0,
			newLine: {
				isEdit: true,
				childform:[
					{
					   usinglcamount:{//实际质押权本币
							value: '',
							display: '',
							scale: -1
						},
						dealer:{
							value: '',
							display: '',
							scale: -1
						},
						makedate:{
							value: '',
							display: '',
							scale: -1
						},
						pledgepno:{
							value: '',
							display: '',
							scale: -1
						},
						p_quality:{
							value: '',
							display: '',
							scale: -1
						},
						p_count:{
							value: '',
							display: '',
							scale: -1
						},
						p_unit:{
							value: '',
							display: '',
							scale: -1
						},
						p_price:{
							value: '',
							display: '',
							scale: -1
						},
						p_specno:{
							value: '',
							display: '',
							scale: -1
						},
						p_status:{
							value: '',
							display: '',
							scale: -1
						},
						p_location:{
							value: '',
							display: '',
							scale: -1
						},
						maxpledge:{
							value: '',
							display: '',
							scale: -1
						}
					}
				],//子表信息
				guapropertyid: {//质押物
					value: null,
					display: ''
				},
				owner:{//所有权属性
					value: null,
				},
				currtypeid:{//人民币
					value: null,
				},
				usingamount:{//实际质押价值
					value: '0',
				},
				totalpledge:{//累计质押价值
					value: '0',
				},
				restpledge:{//剩余质押价值
					value: '1',
				}
			}
		},
		//抵押信息
		mortgagemessage: {
			rows: [],
			index: 0,
			newLine: {
				isEdit: true,
				guapropertyid: {//抵押物
					value: null,
					display: '',
				},
				owner:{//所有权属性
					value: null,
				},
				currtypeid:{//人民币
					value: null,
				},
				usingamount:{//实际抵押价值
					value: '0',
				},
				totlemortgage:{//累计抵押价值
					value: '0',
				},
				restpledge:{//剩余抵押价值
					value: '1',
				}
			}
		},
		//保证信息
		ensuremessage: {
			rows: [],
			index: 0,
			newLine: {
				isEdit: true,
				warrantortype: {//保证人类型
					value: ''
				},
				ensurer: {//保证人
					value: '',
					display: ''
				},
				warrantorname: {//保证人名称
					value: null
				},
				warratio: {//保证比例
					value: null
				},
				waramount: {//保证金额
					value: '1'
				}
			}
		},
		//反担保信息
 		unguaranteemessage: {
 			rows: [],
 			index: 1,
 			newLine: {
				isEdit: true,
				ungaranumber: {//反担保合同号
					value: '',
					display: '',
					scale: -1
				},
				debtee: {//债权人
					value: null,
					display: '',
					scale: -1
				},
				debtor: {//债务人
					value: null,
					display: '',
					scale: -1
				},
				assurergar: {//担保人
					value: null,
					display: '',
					scale: -1
				},
				unassurergar: {//反担保人
					value: null,
					display: '',
					scale: -1
				},
				moneytype: {//币种
					value: null,
					display: '',
					scale: -1
				}
			}
 		}
 	}

	 	  //主子表信息
	getData=(expanded, record)=>{
		console.log(record)
	}

	expandedRowRender = (record) => {
		console.log(record)
		console.log(this.state.pledgemessage)
		return (
			<FormItemTab tabs={this.state.pledgemessage.rows[record.key-1].childform[0]} />
		)
	}


 	handleTabClick = (e, index) => {

 		jump(this['sectionEle' + index], {
			duration: 300,
			offset: -50,
			callback: undefined
		})

 	}

 	componentWillMount() {
		let { id } = this.state;
		if (id) {
			this.searchLogById(id);
		}
 	}

	 searchLogById(id) {
		let self = this;
		axios.post(window.reqURL.fm + 'fm/guacontract/reviseList', {
			id: id
		}).then(function(response) {
			debugger
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

	//金额校验
	formatAcuracy(value) {
		if (value.value && value.scale && value.scale != '-1') {
			let indexOfDot = value.value.indexOf('.');
			let formatVal = value.value.substring(0, indexOfDot + value.scale + 1);
			return formatVal;
		} else {
			return value.value;
		}
	}

	initLoglist(data) {
		console.log('initLoglist', data);
		let { rows } = data.headLeft
		let loglist = [];
		let indexId = null;

		rows.forEach(function(v, i, a) {
			let obj = {};
			let { values } = v;
			obj.id = values.id.value;
			obj.version = values.versionno.value;
			if (i === 0) {
				indexId = obj.id;
			}
			loglist.push(obj);
		});

		this.state.loglist = loglist;

		if (indexId) {
			this.searchById(indexId,rows[0].values.versionno.value);
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

	changeTab = (item) => {
		this.setState({
			curVersion: item.version,
			isLoading: true
		});
		this.searchById(item.id,item.version);
	}


	searchById(id,item) {
		let self = this;
		axios.post(window.reqURL.fm + 'fm/guacontract/reviseQuery', {
				id: id,
				versionno:item
			}).then(function(response) {
				const { data, message, success } = response.data;
				console.log( data, message, success);
				if (success) {
					self.echoData(response.data);
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
	
	 echoData(data) {
		 debugger
		let self = this;
		let { syndicatedloanData } = this.state;

		if (data.data && data.success) {
			console.log('data.data', data.data);
			let { head, guarantyinfo, pledgeinfo,warrantyinfo } = data.data;
			let headValues = head.rows[0].values;
			for (let p in headValues) {
				self.state.assureInfo[p] = headValues[p];
			}

			//根据担保方式控制显示页签信息
			if(self.state.assureInfo.guatype.value=='0'){
				self.setState({
				   hasSyndicatedloan: true,//保证信息
				   hasCreditinfo: false,//抵押信息
				   hasPayplan: false,//质押信息
				   tabsActiveKey:3
				})
			}else if(self.state.assureInfo.guatype.value=='1'){
			   self.setState({
				   hasCreditinfo: true,//抵押信息
				   hasSyndicatedloan: false,//保证信息
				   hasPayplan: false,//质押信息
				   tabsActiveKey:2
				})
			   
			}else if(self.state.assureInfo.guatype.value=='2'){
			   self.setState({
				   hasPayplan: true,//质押信息
				   hasSyndicatedloan: false,//保证信息
				   hasCreditinfo: false,//抵押信息
				   tabsActiveKey:1
				})
			}else{
			   self.setState({
				   hasSyndicatedloan: true,//保证信息
				   hasCreditinfo: true,//抵押信息
				   hasPayplan: true,//质押信息
				   tabsActiveKey:1
				}) 
			}


			if (pledgeinfo) {
				pledgeinfo.rows.forEach(function(v, i, a) {
					let item = {};
					let childform=[{}];
					let formdata=self.state.pledgemessage.newLine.childform[0];
					let { values } = v;
					self.state.pledgemessage.index++;
					for (let index in formdata) {
					   if(values.hasOwnProperty(index)) {
						   childform[0][index]=values[index]
					   }
				   }
					item = {...values,childform,key:i+1,isEdit:false}
					self.state.pledgemessage.rows.push(item);
				});
			}
			if (guarantyinfo) {
				guarantyinfo.rows.forEach(function(v, i, a) {
					let item = {};
					let { values } = v;
					self.state.mortgagemessage.index++;
					item.isEdit = false;
					item.key = i + 1;
					for (let p in values) {
						item[p] = values[p];
					}
					self.state.mortgagemessage.rows.push(item);
				});
			}
			if (warrantyinfo) {
				warrantyinfo.rows.forEach(function(v, i, a) {
					let item = {};
					let { values } = v;
					self.state.ensuremessage.index++;
					item.isEdit = false;
					item.key = i + 1;
					for (let p in values) {
						item[p] = values[p];
					}
					self.state.ensuremessage.rows.push(item);
				});
			}
		}
		console.log('this state', this.state);
		this.setState({
			isLoading: false
		});
	}



	render() {
		let self = this;

		let pledgeColums = [
			{
				title: "序号",
				dataIndex: "key",
				key: "key"
			},{
				title: "质押物",
				dataIndex: "guapropertyid",
				key: "guapropertyid",
				render: (text, record, index) => {
					<span>{record.guapropertyid.value}</span>
				}
			},
			{ title: '所有权属性',
			  key: 'owner',
			  dataIndex: 'owner',
			  render: (text, record, index) => {
				return(<span>{text.value}</span>)
			  }
			},
			{ 
			  title: '币种',
			  key: 'currtypeid', 
			  dataIndex: 'currtypeid.display',
			  render: (text, record, index) =>{
				  return(<span>{record.currtypeid.value}</span>)
			  } 
			},
			{
				title: "*实际可质押价值",
				dataIndex: "usingamount",
				key: "usingamount",
				render: (text, record, index) =>{
					return(<span>{text.value}</span>)
				} 
			},
			{ title: '累计已质押价值',
			 key: 'totalpledge',
			  dataIndex: 'totalpledge.display',
			  render: (text, record, index) =>{
				  return(<span>{text.value}</span>)
			  } 
			},
			{ title: '剩余质押价值', key: 'restpledge', dataIndex: 'restpledge.display'},
		   	{
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 100,
				render: (text, record, index) => <span>操作</span>
			}
		];

		let mortgageColumns = [
			{
				title: "序号",
				dataIndex: "key",
				key: "key"
			}, {
				title: "抵押物",
				dataIndex: "guapropertyid",
				key: "guapropertyid",
				render: (text, record, index) => <span>{text.value}</span>
			},
			{ title: '所有权属性', key: 'owner', dataIndex: 'owner.display',
				render: (text, record, index) => <span>{record.owner.value}</span>
			},
			{ title: '币种', key: 'currtypeid', dataIndex: 'currtypeid.display',
			render: (text, record, index) =>{
				debugger
				return(<span>{record.currtypeid.value}</span>)
			}},
			{
				title: "*实际可抵押价值",
				dataIndex: "usingamount",
				key: "usingamount",
				render: (text, record, index) => <span>{text.value}</span>
			},
			{ title: '累计已质押价值', key: 'totlemortgage', dataIndex: 'totlemortgage.display',
				render: (text, record, index) =>{
				debugger
				return(<span>{record.currtypeid.value}</span>)
			}},
			{ title: '剩余质押价值', key: 'restpledge', dataIndex: 'restpledge.display',
			render: (text, record, index) => <span>{record.restpledge.value}</span>},
			{
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 100,
				render: (text, record, index) => <span>操作</span>	
			}
		];

		let ensureColumns = [
			{
				title: "序号",
				dataIndex: "key",
				key: "key"
			},{
				title: "*保证人类型",
				dataIndex: "warrantortype",
				key: "warrantortype",
				render: (text, record, index) => <span>{text.value}</span>
			},{
				title: "*保证人",
				dataIndex: "ensurer",
				key: "ensurer",
				render: (text, record, index) => <span>{}</span>
			},
			{ title: '保证人名称', key: 'warrantorname', dataIndex: 'warrantorname.display',
			render: (text, record, index) => <span>{record.warrantorname.value}</span>
			},
			{
				title: "*保证比例",
				dataIndex: "warratio",
				key: "warratio",
				render: (text, record, index) => <span>{text.value}</span>
			},
			{ title: '保证金额', key: 'waramount', dataIndex: 'waramount.display',
			render: (text, record, index) => <span>{record.waramount.value}</span>},
			{
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 100,
				render: (text, record, index) => <span>{text.value}</span>
			}
		];


		let guaranteeColumns = [
			{
				title: "序号",
				dataIndex: "key",
				key: "key"
			},{
				title: "反担保合同号",
				dataIndex: "ungaranumber",
				key: "ungaranumber",
				render: (text, record, index) => <span>{text.value}</span>
			},
			{ title: '债权人', key: 'debtee', dataIndex: 'debtee.display',
			render: (text, record, index) => <span>{text.value}</span>},
			{ title: '债务人', key: 'debtor', dataIndex: 'debtor.display',
			render: (text, record, index) => <span>{text.value}</span>},
			{ title: '担保人', key: 'assurergar', dataIndex: 'assurergar.display',
			render: (text, record, index) => <span>{text.value}</span>},
			{ title: '反担保人', key: 'unassurergar', dataIndex: 'unassurergar.display',
			render: (text, record, index) => <span>{text.value}</span>},
			{ title: '币种', key: 'moneytype', dataIndex: 'moneytype.display',
			render: (text, record, index) => <span>{text.display}</span>},
		   	{
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 100,
				render: (text, record, index) => <span>操作</span>
			}
		];

		let tabs = [
			{
				key: 1,
				isShow: this.state.hasPayplan,
				label: '质押信息',
				render: () =><Table key='1'
				 onExpand={this.getData}
       			 expandedRowRender={this.expandedRowRender} 
				 columns={pledgeColums} 
				 data={this.state.pledgemessage.rows} />
			},{ 
				key: 2,
				isShow: this.state.hasCreditinfo,
				label: '抵押信息',
				render: () => <Table  key='2'  columns={mortgageColumns} data={this.state.mortgagemessage.rows} />
			},{
				key: 3,
				label: '保证信息',
				isShow: this.state.hasSyndicatedloan,
				render: () => <Table key='3'  columns={ensureColumns} data={this.state.ensuremessage.rows} /> 
			},{
				key: 4,
				label: '反担保信息',
				isShow: this.state.hasGuarantee,
				render: () => <Table key='4' columns={guaranteeColumns} data={this.state.unguaranteemessage.rows} /> 
			}
		];


		let { loglist} = this.state;

	const breadcrumbItem = [ { href: '#', title: '资金云' }, { title: '担保' }, { title: '担保合约' } ];

		return<div className="cloud-fund-contract-wrap" >
				<BreadCrumbs items={ breadcrumbItem } />
				<div className="contract-content">
					<Row>
						<Col  md={12}   xs={12}   sm={12} >
							<Affix offsetTop={0} style={{ zIndex: 8000}} >
								<Col  md={12}   xs={12}   sm={12} >
				 					<div className="tab-header " style={{ zIndex: 8000}} >
				 						<div className="tab-header-left">{ this.state.title }</div>
											<div className="tab-header-mid">
												<ul>
													<li onClick={(e) => { self.handleTabClick(e, 0); }} >
														<a href="javascript:;">合约信息</a>
													</li>
													<li onClick={(e) => { self.handleTabClick(e, 1); }} >
														<a href="javascript:;">债务信息</a>
													</li>
													<li onClick={(e) => { self.handleTabClick(e, 2); }} >
														<a href="javascript:;">担保信息</a>
													</li>
													<li onClick={(e) => { self.handleTabClick(e, 3); }} >
														<a href="javascript:;">其他信息</a>
													</li>
												</ul>
											</div>
				 					</div>
			 					</Col>
			 				</Affix>
			 				<Col md={2}   xs={2}   sm={2} >
			 					 {/* <Tabs
				                    tabBarPosition="left"
				                    tabBarStyle="trapezoid"
				                    defaultActiveKey="1"
				                    onChange={ (index) => { 
				                    	self.state.tabActive = index;
				                    	self.setState();
				                    	console.log(index)
				                    	 } }
				                    style={{ height: 300, backgroudColor:'#fff'}}
				                	>
				                    <TabPane tab="V1.01" key="1">
									</TabPane>
				                    <TabPane tab="V1.02" key="2"></TabPane>
				                    <TabPane tab="V1.03" key="3"></TabPane>
				                    <TabPane tab="V1.04" key="4"></TabPane>
				                </Tabs> */}
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
										 
			 				</Col> 
			 				<Col md={10}   xs={10}   sm={10} >
							 <div className="section-container" >
							 <section  ref={(ele) => { this.sectionEle0 = ele; }} >
								 <Panel >
									 <div className="section-title">合约信息</div>
										  <Row>
											 <Col md={12} xs={12} sm={12} >
												 <Col md={6} xs={6} sm={6} >
													 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
														 <div className='label-display'>合同类型：</div>
													 </Col>
													 <Col md={3} xs={3} sm={3} >
														 <div className="value-display" >{contracttypeMap[this.state.assureInfo.contracttype.value]||''}</div>
													 </Col>
												 </Col>
												 <Col md={6} xs={6} sm={6} >
													 <Col  mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
														 <div className='label-display'>担保/反担保合约号：</div>
													 </Col>
													 <Col md={6} xs={6} sm={6} >
														 <div className= 'value-display' >{ this.state.assureInfo.contractno.value }</div>
													 </Col>
												 </Col>
											 </Col>
											 <Col md={12} xs={12} sm={12} >
												 <Col md={6} xs={6} sm={6} >
													 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
														 <div className='label-display'>合同编号：</div>
													 </Col>
													 <Col md={3} xs={3} sm={3} >
														 <div className= 'value-display' >{ this.state.assureInfo.vbillno.display }</div>
													 </Col>
												 </Col>
												 <Col md={6} xs={6} sm={6} >
													 <Col  mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
														 <div className='label-display'>债权人类型：</div>
													 </Col>
													 <Col md={6} xs={6} sm={6} >
														 <div className= 'value-display' >{creditortypeMap[this.state.assureInfo.creditortype.value]||'' }</div>
													 </Col>
												 </Col>
											 </Col>
											 <Col md={12} xs={12} sm={12} >
												 <Col md={6} xs={6} sm={6} >
													 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
														 <div className='label-display'>债权人：</div>
													 </Col>
													 <Col md={3} xs={3} sm={3} >
														 <div className="value-display" >{ this.state.assureInfo.creditor.display }</div>
													 </Col>
												 </Col>
												 <Col md={6} xs={6} sm={6} >
													 <Col  mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
														 <div className='label-display'>债务人类型：</div>
													 </Col>
													 <Col md={6} xs={6} sm={6} >
														 <div className="value-display" >{debtortypeMap[this.state.assureInfo.debtortype.display]||''}</div>
													 </Col>
												 </Col>
											 </Col>
											 <Col md={12} xs={12} sm={12} >
												 <Col md={6} xs={6} sm={6} >
													 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
														 <div className='label-display'>债务人：</div>
													 </Col>
													 <Col md={3} xs={3} sm={3} >
														 <div className= 'value-display' >{ this.state.assureInfo.debtor.value }</div>
													 </Col>
												 </Col>
												 <Col md={6} xs={6} sm={6} >
													 <Col  mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
														 <div className='label-display'>反担保人类型：</div>
													 </Col>
													 <Col md={6} xs={6} sm={6} >
														 <div className= 'value-display' >{warrantorintypeMap[this.state.assureInfo.warrantorintype.value]||'' }</div>
													 </Col>
												 </Col>
											 </Col>
											 <Col md={12} xs={12} sm={12} >
												 <Col md={6} xs={6} sm={6} >
													 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
														 <div className='label-display'>反担保人：</div>
													 </Col>
													 <Col md={3} xs={3} sm={3} >
														 <div className="value-display" >{ this.state.assureInfo.warrantorin.display }</div>
													 </Col>
												 </Col>
												 <Col md={6} xs={6} sm={6} >
													 <Col  mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
														 <div className='label-display'>担保人：</div>
													 </Col>
													 <Col md={6} xs={6} sm={6} >
														 <div className="value-display" >{ this.state.assureInfo.guarantor.value }</div>
													 </Col>
												 </Col>
											 </Col>
											 <Col md={12} xs={12} sm={12} >
												 <Col md={6} xs={6} sm={6} >
													 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
														 <div className='label-display'>担保方式：</div>
													 </Col>
													 <Col md={3} xs={3} sm={3} >
														 <div className="value-display" >{ guaranteetypeMap[this.state.assureInfo.guatype.value]|| '' }</div>
													 </Col>
												 </Col>
											 </Col>
										 </Row>
								 </Panel>
							 </section>


							 <section  ref={(ele) => { this.sectionEle1 = ele; }} >
							 <Panel >
								 <div className="section-title"> 债务信息</div>
								 <Row>
									 <Col md={12} xs={12} sm={12} >
										 <Col md={6} xs={6} sm={6} >
											 <Col mdOffset={5} xsOffset={5} smOffset={5} md={3} xs={3} sm={3} >
												 <div className='label-display'>债务种类：</div>
											 </Col>
											 <Col md={3} xs={3} sm={3} >
												 <div className="value-display" >{this.state.assureInfo.debttype.display}</div>
											 </Col>
										 </Col>
										 <Col md={6} xs={6} sm={6} >
											 <Col mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
												 <div className='label-display'>担保债务描述：</div>
											 </Col>
											 <Col md={6} xs={6} sm={6} >
												 <div className="value-display" >{this.state.assureInfo.debtnote.display}</div>
											 </Col>
										 </Col>
									 </Col>
									 <Col md={12} xs={12} sm={12} >
										 <Col md={6} xs={6} sm={6} >
											 <Col mdOffset={5} xsOffset={5} smOffset={5} md={3} xs={3} sm={3} >
												 <div className='label-display'>债务起始时间：</div>
											 </Col>
											 <Col md={3} xs={3} sm={3} >
												 <div className="value-display" >{this.state.assureInfo.startdate.value}</div>
											 </Col>
										 </Col>
										 <Col md={6} xs={6} sm={6} >
											 <Col mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
												 <div className='label-display'>债务结束时间：</div>
											 </Col>
											 <Col md={6} xs={6} sm={6} >
												 <div className="value-display" >{this.state.assureInfo.enddate.value}</div>
											 </Col>
										 </Col>
									 </Col>
									 <Col md={12} xs={12} sm={12} >
										 <Col md={6} xs={6} sm={6} >
											 <Col mdOffset={5} xsOffset={5} smOffset={5} md={3} xs={3} sm={3} >
												 <div className='label-display'>债务币种：</div>
											 </Col>
											 <Col md={3} xs={3} sm={3} >
												 <div className="value-display" >{this.state.assureInfo.debtcurrencyid.display}</div>
											 </Col>
										 </Col>
										 <Col md={6} xs={6} sm={6} >
											 <Col mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
												 <div className='label-display'>债务金额：</div>
											 </Col>
											 <Col md={6} xs={6} sm={6} >
												 <div className="value-display" >{this.state.assureInfo.pridebtamount.value}</div>
											 </Col>
										 </Col>
									 </Col>
									 <Col md={12} xs={12} sm={12} >
										 <Col md={6} xs={6} sm={6} >
											 <Col mdOffset={5} xsOffset={5} smOffset={5} md={3} xs={3} sm={3} >
												 <div className='label-display'>债务本币汇率：</div>
											 </Col>
											 <Col md={3} xs={3} sm={3} >
												 <div className='value-display' >{this.state.assureInfo.olcdebtrate.display}</div>
											 </Col>
										 </Col>
									 </Col>
								 </Row>
							 </Panel>
							 </section>
							 <section  ref={(ele) => { this.sectionEle2 = ele; }} >
								 <Panel >
									 <div className="section-title"> 担保信息</div>
									 <Row>
										 <Col md={12} xs={12} sm={12} >
											 <Col md={6} xs={6} sm={6} >
												 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
													 <div className='label-display'>担保起始时间：</div>
												 </Col>
												 <Col md={3} xs={3} sm={3} >
													 <div className= 'value-display' >{ this.state.assureInfo.guastartdate.value }</div>
												 </Col>
											 </Col>
											 <Col md={6} xs={6} sm={6} >
												 <Col  mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
													 <div className='label-display'>担保结束时间：</div>
												 </Col>
												 <Col md={6} xs={6} sm={6} >
													 <div className= 'value-display' >{ this.state.assureInfo.guaenddate.value }</div>
												 </Col>
											 </Col>
										 </Col>
										 <Col md={12} xs={12} sm={12} >
											 <Col md={6} xs={6} sm={6} >
												 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
													 <div className='label-display'>担保币种：</div>
												 </Col>
												 <Col md={3} xs={3} sm={3} >
													 <div className= 'value-display' >{ this.state.assureInfo.guacurrtypeid.value }</div>
												 </Col>
											 </Col>
											 <Col md={6} xs={6} sm={6} >
												 <Col  mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
													 <div className='label-display'>担保金额：</div>
												 </Col>
												 <Col md={6} xs={6} sm={6} >
													 <div className= 'value-display' >{ this.state.assureInfo.guaamount.value }</div>
												 </Col>
											 </Col>
										 </Col>
										 <Col md={12} xs={12} sm={12} >
											 <Col md={6} xs={6} sm={6} >
												 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
													 <div className='label-display'>担保本币汇率：</div>
												 </Col>
												 <Col md={3} xs={3} sm={3} >
													 <div className= 'value-display' >{ this.state.assureInfo.guaolcrate.value }</div>
												 </Col>
											 </Col>
										 </Col>
										 <Col md={12} xs={12} sm={12} >
											 <Col md={6} xs={6} sm={6} >
												 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
													 <div className='label-display'>担保本币金额：</div>
												 </Col>
												 <Col md={3} xs={3} sm={3} >
													 <div className= 'value-display' >{ this.state.assureInfo.gualcamount.value }</div>
												 </Col>
											 </Col>
										 </Col>
										 <Col md={12} xs={12} sm={12} >
											 <Col md={6} xs={6} sm={6} >
												 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
													 <div className='label-display'>已用担保金额：</div>
												 </Col>
												 <Col md={3} xs={3} sm={3} >
													 <div className= 'value-display' >{ this.state.assureInfo.usedamount.value }</div>
												 </Col>
											 </Col>
										 </Col>
										 <Col md={12} xs={12} sm={12} >
											 <Col md={6} xs={6} sm={6} >
												 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
													 <div className='label-display'>可用担保金额：</div>
												 </Col>
												 <Col md={3} xs={3} sm={3} >
													 <div className= 'value-display' >{ this.state.assureInfo.avaamount.value }</div>
												 </Col>
											 </Col>
										 </Col>
										 
										 {this.state.assureInfo.moramount.value?<Col md={12} xs={12} sm={12} >
											 <Col md={6} xs={6} sm={6} >
												 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
													 <div className='label-display'>本次抵押总金额：</div>
												 </Col>
												 <Col md={3} xs={3} sm={3} >
													 <div className= 'value-display' >{ this.state.assureInfo.moramount.value }</div>
												 </Col>
											 </Col>
										 </Col>:''}
										 <Col md={12} xs={12} sm={12} >
											 <Col md={6} xs={6} sm={6} >
												 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
													 <div className='label-display'>保证责任：</div>
												 </Col>
												 <Col md={3} xs={3} sm={3} >
													 <div className= 'value-display' >{warliabilityMap[this.state.assureInfo.warliability.value]||'' }</div>
												 </Col>
											 </Col>
										 </Col>
										 <Col md={12} xs={12} sm={12} >
											 <Col md={6} xs={6} sm={6} >
												 <Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
													 <div className='label-display'>合约状态：</div>
												 </Col>
												 <Col md={3} xs={3} sm={3} >
													 <div className= 'value-display' >{ this.state.assureInfo.busistatus.value }</div>
												 </Col>
											 </Col>
										 </Col>
									 </Row>
								 </Panel>
							 </section>



							 <section ref={(ele) => { this.sectionEle2 = ele; }} >
								 <Panel >
									 <div className="section-title">其他信息</div>
									 <LightTabs activeKey={ this.state.tabsActiveKey }  items={tabs}  onChangeActive={this.changeActive} />
								 </Panel>
							 </section>
						 </div>
							</Col>
						</Col>
			        </Row>
					<Loading fullScreen showBackDrop={ true } show={ this.state.isLoading } />
	            </div>
		    </div>
	}
}