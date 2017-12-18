import React, { Component } from 'react';
import { hashHistory , Redirect, Link } from 'react-router';
import axios from 'axios';
import { Panel,   Label, Button, FormControl, Radio,  Breadcrumb, Con, Row, Col, Tree, Message, Icon, Table } from 'tinper-bee';
import Affix from 'bee-affix';
import 'bee-affix/build/Affix.css';
import DatePicker from 'bee-datepicker';
import Loading from 'bee-loading';
import jump from 'jump.js';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import moment from 'moment';
import Refer from 'containers/Refer';
import { CheckboxItem, RadioItem, TextAreaItem, ReferItem , SelectItem, InputItem, DateTimePickerItem} from 'containers/FormItems';
import Select from 'bee-select';
import LightTabs from './LightTabs';
import FormItemTab from './FormItem';
import './index.less';
import  Form from 'bee-form';
import 'bee-form/build/Form.css';
import Modal from 'bee-modal';
import BreadCrumbs from '../../../bd/containers/BreadCrumbs';
import TmcUploader from '../../../../containers/TmcUploader';
const deepClone = require('utils/deepClone');
import { toast } from 'utils/utils';

const { FormItem } = Form;
// const format = 'YYYY-MM-DD HH:mm:ss';
const format = 'YYYY-MM-DD';
const dateInputPlaceholder = '选择日期';

const contstatusMap = {
	'0': '申请待审批',
	'1': '申请已审批',
	'2': '合约待审批',
	'3': '合约已审批',
	'4': '合约在执行',
	'5': '合约已结束'
};

const vbillstatusMap = {
	'0': '审批未通过',
	'1': '审批通过',
	'2': '审批进行中',
	'3': '提交',
	'-1': '自由'
};

const urlsMap = {
	'new': 'fm/guacontract/save',
	'update': 'fm/guacontract/save',
	'change': 'fm/guacontract/revise'//变更
};

// const { Option } = Select;
export default class Assure extends Component {

 	state = {
		
 		//页面状态 EDIT VIEW 
 		editStatus: 'new',
 		//页面标题
 		title: '担保合约',
 		reset: false,
		//页面状态
		 status:'2',

 		//是否显示成功按钮
		 showModal: false,
		 ts:'',//时间戳
 		// 是否在请求
 		isLoading: false,
 		checkForm: false,

 		//是否含有融资编号
 		id: this.props.location.query.id,
 		// type: 'change',
 		type: this.props.location.query.type,

 		//校验合约信息是否可以提交
		 isassureSubmitble: false,
		 //校验债务信息是否可以提交
		 isdebtSubmitble: false,
		//枚举反担保人类型控制可用
		onwarrantorintype:[{
			label: '合作伙伴',
			value: '1',
			disabled:true
		},
		{
			label: '企业本身',
			value: '2',
			disabled:true
		}, {
			label: '内部单位',
			value: '3',
			disabled:true
		}],


 		//表体是否显示
 		hasPayplan: false,//质押信息
 		hasCreditinfo: false,//抵押信息
 		hasSyndicatedloan: false,//保证信息
 		hasGuarantee: false,//反担保信息

 		//表体当前切换页码
 		tabsActiveKey: 3,
		//反担保人参照控制
		 holdwarrantorin:{
			value:true
		},

		 //表头信息 
		 // 合约信息 
 		assureInfo: {
			 contracttype: {
				 value:'0'
			 },//合同类型
			 contractno: {},//担保合约号
			 ctrycontractno: {},//反担保合约号
 			 vbillno: {
				value:''
			 },//合同编号
			creditortype:{
				value:'1'
			},//债权人类型
			//债权人
			creditor:{
				value:''
			},
			debtortype:{
				value:'2'
			},//债务人类型
			debtor:{//债务人
				value:''
			},
			warrantorintype:{//反担保人类型
				value:''
			},
			warrantorin:{},//反担保人

			guarantor:{},//担保人
			guatype: {//担保方式
				value:"1"
			},
			debttype:{},//债务种类
			debtnote:{},//担保债务描述
			startdate:{},//债务起始时间
			enddate:{},//债务终止时间
			debtcurrencyid:{},//债务币种
			pridebtamount:{},//债务金额
			olcdebtrate:{},//债务汇率

				//担保信息
			guastartdate:{},//担保起始日期
			guaenddate:{},//担保终止日期
			guacurrtypeid:{},//担保币种
			guaamount:{},//担保金额
			guaolcrate:{},//担保本币汇率
			gualcamount:{},//担保本币金额
			usedamount:{
					value:'15'
			},//已用担保金额
			avaamount:{
					value:'0'
			},//可用担保金额
			warliability:{},//保证责任
			busistatus:{
				value:'在执行'
			},//合约状态
			// vbillstatus: {},
 			//contstatus: {},
 		},
		//表体信息 其他信息
		//质押信息
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
						dealer:{//经办人
							value: '',
							display: '',
							scale: -1
						},
						makedate:{//日期
							value: '',
							display: '',
							scale: -1
						},
						pledgepno:{//质押协议号
							value: '',
							display: '',
							scale: -1
						},
						p_quality:{//质量
							value: '',
							display: '',
							scale: -1
						},
						p_count:{//数量
							value: '',
							display: '',
							scale: -1
						},
						p_unit:{//单位
							value: '',
							display: '',
							scale: -1
						},
						p_price:{//单价
							value: '',
							display: '',
							scale: -1
						},
						p_specno:{//规格型号
							value: '',
							display: '',
							scale: -1
						},
						p_status:{//状况
							value: '',
							display: '',
							scale: -1
						},
						p_location:{//所在地
							value: '',
							display: '',
							scale: -1
						},
						maxpledge:{//可质押价值
							value: '',
							display: '',
							scale: -1
						},
					

					}
				],//子表信息
				guapropertyid: {//质押物
					value: null,
					display: ''
				},
				owner:{//所有权属性
					value: null,
				},
				currtypeid:{//币种
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
				ensurer:{
					value:'',
					display:''
				},
				warrantorin: {//保证人内部单位
					value: '',
					display: ''
				},
				warrantorou: {//保证人合作伙伴
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
				creditor: {//债权人
					value: null,
					display: '',
					scale: -1
				},
				debtor: {//债务人
					value: null,
					display: '',
					scale: -1
				},
				guarantor: {//担保人
					value: null,
					display: '',
					scale: -1
				},
				unassurergar: {//反担保人
					value: null,
					display: '',
					scale: -1
				},
				guacurrtypeid: {//担保币种
					value: null,
					display: '',
					scale: -1
				},
				debtcurrencyid: {//债务币种
					value: null,
					display: '',
					scale: -1
				}
			}
 		}
 	}

 	handleSave = () => {
 		this.setState({
 			checkForm: true
 		});
 	}

	 //上传附件
	 	
	  handleUpload = (fun) => {
		  let uploadFun;
		  if (typeof fun === 'function') {
			  uploadFun = fun;
		  } else {
			  // 文件上传之前需要处理的方法

			  uploadFun();
		  }
	  };


 	componentWillMount() {
 		let { type, id} = this.state;

 		console.log('this is id print',  id);

 		if ( type ) {
 			this.state.editStatus = type;
 		}


 		//保证信息默认显示数据
 		if (this.state.editStatus == 'new') {
 		//	this.addNewLine('ensuremessage', 3);
 		//	this.addNewLine('pledgemessage', 1);
 		}


 		// this.state.isLoading = true;
 		if ( id ) {
			 this.state.isLoading = true;
			 //修改太状态修改
			 this.state.status='1';
 			this.searchById( id );
 		} else {
 			this.resetState = deepClone(this.state);//why
 		}

 	}

	
	isString(str) {
		return (typeof str == 'string') && str.constructor == String;
	}

 	componentDidMount() {
		 //根据返回数据控制表格Tabs显示
		 let self=this
		 if(self.state.assureInfo.guatype.value=='1'&&self.state.editStatus=='new'){
			 self.setState({
				hasSyndicatedloan: true,//保证信息
			 })
		 }
	 }

 	searchById(id) {
		let self = this;
		let url = window.reqURL.fm + 'fm/guacontract/query';
		axios.post(url, {
				id: id
			}).then(function(response) {
				const { data, message, success } = response.data;
				console.log( data, message, success);

				if (success) {
					self.echoData(data);
				} else {

					toast({content: message.message, color: 'warning'});
					self.setState({
						isLoading: false
					});
				}

			}).catch(function(error) {
				debugger
				toast({content: '后台报错,请联系管理员', color: 'danger'});
			});
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



	 formatAcuracy (value, len) {
		// return this.toThousands(formatVal);
		if (value.value === null || value.value === undefined) {
			return value.value;
		}
		return this.commafy(this.formatDot(value, len));
	}

	 removeThousands(val) {
		return val ? val.toString().replace(/\,/gi, '') : val;
	}
	//贷款金额值实时写入state
	 handleFinancamount = (name,value) => {
			let { assureInfo } = this.state;
   
			// 去除逗号 格式化小数点后面位数
   
			value = this.formatDot({value: this.removeThousands(value)});
		console.log(value)
			assureInfo[name] = {
				value: value,
				display: '',
				scale: -1
			};
			this.setState({
				assureInfo:assureInfo
			});

			console.log(this.state.assureInfo)
		}




//修改页面数据加载渲染
 	echoData(data) {
		 let self = this;
			let {assureInfo, hasSyndicatedloan, hasCreditinfo, hasPayplan,
				 tabsActiveKey, pledgemessage, mortgagemessage, ensuremessage} = self.state;
			let { head, guarantyinfo, pledgeinfo,warrantyinfo } = data;
			let headValues = head.rows[0].values;
			for (let p in assureInfo) {
				if(headValues.hasOwnProperty(p)){
					if(typeof(headValues[p].value)=='number'){
						headValues[p].value=String(headValues[p].value);
						console.log(headValues[p].value)
					}
					assureInfo[p] = headValues[p];
				}
				assureInfo.id=headValues.id;
				assureInfo.ts=headValues.ts;
				assureInfo.tenantid=headValues.tenantid;
			}
			//根据担保方式控制显示页签信息
			
			if(self.state.assureInfo.guatype.value=='1'){
				tabsActiveKey = 3;
				hasSyndicatedloan =  true; //保证信息
			
			}else if(self.state.assureInfo.guatype.value=='2'){
				   hasCreditinfo = true;//抵押信息
				   tabsActiveKey = 2;
			   
			}else if(self.state.assureInfo.guatype.value=='3'){
				   hasPayplan =  true;//质押信息
				   tabsActiveKey = 1;
			}else{
				   hasSyndicatedloan =  true;//保证信息
				   hasCreditinfo = true;//抵押信息
				   hasPayplan = true;//质押信息
				   tabsActiveKey = 1;
			}


			if (pledgeinfo) {
				pledgeinfo.rows.forEach(function(v, i, a) {
					debugger
					let item = {};
					let childform=[{}];
					let formdata= pledgemessage.newLine.childform[0];
					let { values } = v;
					pledgemessage.index++;
					for (let index in formdata) {
					   if(values.hasOwnProperty(index)) {
						   childform[0][index]=values[index]
					   }
				   }
					item = {...values,childform,key:i+1,isEdit:true}
					pledgemessage.rows.push(item);
					// pledgemessage.newLine.id=values.id;
					// pledgemessage.newLine.ts=values.ts;
					// pledgemessage.newLine.tenantid=values.tenantid;

				});
			}
			if (guarantyinfo) {
				guarantyinfo.rows.forEach(function(v, i, a) {
					let item = {};
					let { values } = v;
					mortgagemessage.index++;
					item.isEdit = true;
					item.key = i + 1;
					for (let p in values) {
						item[p] = values[p];
					}
					mortgagemessage.rows.push(item);
					// mortgagemessage.newLine.id=values.id;
					// mortgagemessage.newLine.ts=values.ts;
					// mortgagemessage.newLine.tenantid=values.tenantid;
				});
			}
			if (warrantyinfo) {
				warrantyinfo.rows.forEach(function(v, i, a) {
					let item = {};
					let { values } = v;
					ensuremessage.index++;
					item.isEdit = true;
					item.key = i + 1;
					for (let p in values) {
						item[p] = values[p];
					}
					ensuremessage.rows.push(item);
					// ensuremessage.newLine.id=values.id;
					// ensuremessage.newLine.ts=values.ts;
					// ensuremessage.newLine.tenantid=values.tenantid;
				});
			}
		this.setState({
			isLoading : false,
			assureInfo,hasSyndicatedloan, 
			hasCreditinfo, hasPayplan, tabsActiveKey,
			pledgemessage, mortgagemessage, ensuremessage
		});
 	}

	 //枚举控制
 	handleGTypeChange = (type , value) => {
		let assureInfo=this.state.assureInfo;
		let onwarrantorintype=this.state.onwarrantorintype;
		let creditortype=this.state.assureInfo.creditortype;
		let debtortype=this.state.assureInfo.debtortype;
		for(let index in assureInfo){
			if(index==type){
				this.state.assureInfo[index].value=value
			}
			
		}
 		//this.state.assureInfo.guatype.value = value;
		console.log(this.state)
		//表体数据显示
		if(type=='guatype'){
				//表体是否显示
				//质押信息hasPayplan: false,
				//抵押信息hasCreditinfo: false,
				//保证信息hasSyndicatedloan: false,
				//反担保信息hasGuarantee: false,
			let { hasPayplan, hasCreditinfo,hasSyndicatedloan,hasGuarantee,tabsActiveKey} = this.state;
			assureInfo.guatype.value = value;
			let self=this
			if(self.state.assureInfo.guatype.value=='1'){
				self.setState({
				   hasSyndicatedloan: true,//保证信息
				   hasCreditinfo: false,//抵押信息
				   hasPayplan: false,//质押信息
				   tabsActiveKey:3
				})
			}else if(self.state.assureInfo.guatype.value=='2'){
			   self.setState({
				   hasCreditinfo: true,//抵押信息
				   hasSyndicatedloan: false,//保证信息
				   hasPayplan: false,//质押信息
				   tabsActiveKey:2
				})
			   
			}else if(self.state.assureInfo.guatype.value=='3'){
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
			console.log(this.state)
		}
		//控制反担保人类型可用与否
		if(creditortype.value&&(debtortype.value=='1'||debtortype.value=='3')){
			onwarrantorintype.map((item)=>{
				item.disabled=false;
			})
			this.state.holdwarrantorin.value=false;//反担保人参照控制
			this.state.hasGuarantee = true; //控制反担保信息显示
		}else{
			onwarrantorintype.map((item)=>{
				item.disabled=true;
			})
			this.state.holdwarrantorin.value=true;
			this.state.hasGuarantee = false;
		}
 		this.setState();
 	}

 	handleTabClick = (e, index) => {

 		jump(this['sectionEle' + index], {
			duration: 300,
			offset: -50,
			callback: undefined
		});

 	}


	 checkNumber = (values,dates,refs,status,assureInfo)=>{
		let self=this;
		values.forEach(function(v, i, a) {
			let ele = assureInfo[v.name];
			let { value } = v;
			if(typeof value=='string'&&value.indexOf(',')!=-1){
				value=self.removeThousands(value);
			 }
			if ( ele ) {
				if ( self.isEmptyObject(value) ) {

					ele = {
						value: null,
						display: '',
						scale: -1
					};

				} else {

					if (status.indexOf(v.name) > -1) {
						//状态字段不作修改
					} else {
						if (refs.indexOf(v.name) > -1) {
							ele.value = value.refpk;
							ele.display = value.refname;
						} else {
							ele.value = value.value || value ;
							
							if (dates.indexOf(v.name) > -1) {
								if (self.isString(ele.value)) {
									return ele.value;
								} else {
									ele.value = ele.value.format( format );
								}
							}
						//	ele.display = value.display || '';
							
						}
						//ele.scale = -1;
					}

				}
			}
		});
	 }



	 //合约提交数据解析
 	assureFormCallback = (isCheck, values, others) => {
 		let self = this;
 		console.log('assureFormCallback', isCheck, values, others);
 		if ( isCheck ) {
			self.state.isassureSubmitble = true;
 			let { assureInfo } = self.state;
 			let dates = ['startdate', 'begindate'];
 			let refs = ['creditor','debtor','warrantorin'];
 		    let status = ['contstatus', 'vbillstatus'];
			 self.checkNumber(values,dates,refs,status,assureInfo);
 		}
	 }
	 	//债务提交数据解析
		 submitBusinessdebt = (isCheck, values, others) => {
			let self=this;
			if(isCheck){
			   self.state.isdebtSubmitble = true;
			   //解析数据
			   let { assureInfo } = self.state;
			   let dates = ['startdate','enddate'];
			   let refs = ['debtcurrencyid','debttype'];
			   let status = ['contstatus', 'vbillstatus'];
			   self.checkNumber(values,dates,refs,status,assureInfo);
			}
		}
	 //担保提交数据解析
	submitBusiness = (isCheck, values, others) => {
		// debugger;
		let self = this;
		console.log('submitBusiness', isCheck, values, others);
		if (self.state.isassureSubmitble && isCheck && self.state.isdebtSubmitble ) {
			let { assureInfo } = self.state;
			let dates = ['guastartdate', 'guaenddate'];
			let refs = ['guacurrtypeid'];
			let status = ['contstatus', 'vbillstatus'];
			self.checkNumber(values,dates,refs,status,assureInfo);
			console.log(self.state.assureInfo)
			self.executeSubmit();
		} else {
			self.setState({
				isassureSubmitble: false,
				isdebtSubmitble:false,
				checkForm: false
			});
		}
	}
	 
	 //什么意思
 	checkRefer = (obj,a) => {
 		let { value } = obj;
 		console.log( value, obj,a , 'valuevvvv1111');
 		console.log( a , 'valuevvvv');

 		return !!value.refname && !!value.refpk;
 	}

 	asyncChec = (obj) => {
		let {value} = obj;
		console.log('fsdafsa', obj);
		return !!value;
	} 

	isEmptyObject(obj) {　　
		for (var key in obj) {　　　　
			return false; //返回false，不为空对象
		}　　　　
		return true; //返回true，为空对象
	}


	setNull(obj) {
		for(var p in obj) {
			let e = obj[p];
			if(typeof(e)=='object'){
				if (e.value === undefined || e.value === '') {
					e.value = null; 
				}
			}
		}
	}

	formatNull(row, obj) {
		for (let p in obj) {
				row[p] = Object.assign({
					value: null,
				}, obj[p]);
		}
	}

	formatSingleNull(obj) {
		for (let p in obj) {
			obj[p] = Object.assign({
				value: null,
			}, obj[p]);
		}
	}

	executeSubmit() {
		console.log(this.state, 'executeSubmit');
		let self = this;
		//点击保存数据解析发送至后台
		let data = {
			//表头信息
			head:{
				rows:[]
			},
			//质押信息
			pledgeinfo:{
				rows: []
			},
			//保证信息
			warrantyinfo:{
				rows: []
			},
			//抵押信息
			guarantyinfo:{
				rows: []
			},
			//反担保信息
			// ungaranteeInfo:{
			// 	pageinfo: null,
			// 	rows: [],
			// 	status: 0
			// }
		};
		let {assureInfo,pledgemessage, ensuremessage,mortgagemessage ,unguaranteemessage} = this.state;
		let assureValues = Object.assign({},assureInfo);
		this.setNull(assureValues);
		this.formatSingleNull(assureValues);
		console.log(assureValues)
		if(!assureValues.status){
			assureValues.status={
				value:self.state.status
			}
		}
		 if(assureValues.busistatus.value=='在执行'){
		 	assureValues.busistatus.value='3'
		 }
		data.head.rows.push({
			//rowId: null,
			values: assureValues,
		});
		console.log(pledgemessage)
		//质押数据结构解析....
		pledgemessage.rows.forEach(function(v, i, a) {
			let row = {};
			let obj = Object.assign({}, v);
			delete obj['key'];
			delete obj['isEdit'];
			delete obj['childform'];
			self.formatNull(row, obj);
			self.setNull(row);
			if(self.state.editStatus=="new"||row.status=='2'){
				delete row.id
			}
			if(!row.status){
				row.status={
					value:'1'
				}
			}
			data.pledgeinfo.rows.push({
				values: row
			});
		});
		//抵押数据结构解析
		mortgagemessage.rows.forEach(function(v, i, a) {
			let row = {};
			let obj = Object.assign({}, v);
			delete obj['key'];
			delete obj['isEdit'];
			self.formatNull(row, obj);
			self.setNull(row);
			console.log(row)
			if(self.state.editStatus=="new"||row.status=='2'){
				delete row.id
			}
			if(!row.status){
				row.status={
					value:'1'
				}
			}
			data.guarantyinfo.rows.push({
				values: row
			});
		});
		//保证信息数据解析
		ensuremessage.rows.forEach(function(v, i, a) {
			let row = {};
			let obj = Object.assign({}, v);
			delete obj['key'];
			delete obj['isEdit'];
			self.formatNull(row, obj);
			self.setNull(row);
			if(self.state.editStatus=="new"||row.status=='2'){
				delete row.id
			}
			if(!row.status){
				row.status={
					value:'1'
				}
			}
			if(row.warrantorintype=="1"){
				row.warrantorin=row.ensurer;
			}else{
				row.warrantorou=row.ensurer;
			}
			delete row.ensurer
			data.warrantyinfo.rows.push({
				values:row
			});
		});


		console.log('++++++++++++++', data, this.state);



		// return false;
		let url =  urlsMap[this.state.editStatus];
		if(this.state.editStatus=='change'){
			delete data.head.rows[0].status
		}
		console.log(data)
		axios.post(window.reqURL.fm + url, {
				'data': data
			})
			.then(function(response) {

				self.setState({
					isLoading: false
				});

				if (response.data.success) {
					self.data = response.data.data;
					self.setState({showModal: true,
						id: self.data.head.rows[0]['values']['id']['value'],
						ts: self.data.head.rows[0]['values']['ts']['value']
					});
					console.log(response, 'response');
				} else {
					toast({content: response.data.message.message, color: 'warning'});
					//
				}
				// console.log(response, 'response');
				// if (response.data.)
				// hashHistory.push('/fm/apply');
				// self.setState();
			})
			.catch(function(error) {
				toast({content: '后台报错,请联系管理员', color: 'danger'});
				console.log(error, 'error');
			});
		this.setState({
			checkForm:false,
			isassureSubmitble: false,
			isLoading: true
		});
	}

	handleCancel = ()=> {
		// hashHistory.push('/fm/apply');
		let { id } = this.state;
		if ( id ) {
			hashHistory.push(`/fm/assure_view?id=${id}&type=view`)
		} else {
			hashHistory.go(-1);
			// window.location.reload();
			// console.log(this.resetState, 'this.state', this.resetState == this.state);
			// hashHistory.push({
			// 	pathname: '/fm/assure',
			// 	state: this.resetState
			// });
			// this.setState()
			// this.setState({
			// 	reset: true
			// });
		}
	}

	handleInputChange= (obj,type,val,parent) =>{
		let formdata=this.state[parent];
		if(type === 'begindate' || type === 'enddate'){
			val = moment(val)
		}
		formdata[obj].value = val;
	}
	//日期控制
     disabledDate =(obj,current)=> {
		let begin
		if(obj=='enddate'){
			 begin = this.state.assureInfo.startdate.value;
			return current && current.valueOf() < begin.valueOf();
		}else if(obj=='guastartdate'){
			 begin = this.state.assureInfo.enddate.value;
			return current && current.valueOf() < begin.valueOf();
		}else{
			 begin = this.state.assureInfo.guastartdate.value;
			return current && current.valueOf() < begin.valueOf();
		}
		
	  }

	filterBodyListBydr(v, i, a) { 
		// statis = 3 表示删除
		if (!v.status) {
			return true;
		}
		return v.status.value != 3;
	}

	addNewLine(tableTag, tabIndex) {
		let tableData = this.state[tableTag];
		// this.state.tabsActiveKey = tabIndex;
		tableData.index++;
		//深拷贝浅拷贝
		let cloneNewLine = deepClone(tableData.newLine);
		let newLine = Object.assign({}, cloneNewLine, {
			key: tableData.index,
			isEdit: true,
			status:{
				value:'2'
			}
		});
		tableData.rows.push(newLine);
	}

	findByKey (key, rows) {
		let rt = null;
		let self=this;
		rows.forEach(function(v, i, a) {
			if ( v.key == key) {
				rt = v;
			}
		});
		if(!rt.status){
			rt.status={
				value:self.state.status,
			}
		}
		return rt;
	}


 	handleAddNewline = (tableTag, tabIndex) => {
 		this.addNewLine(tableTag, tabIndex);
 		this.setState();
 	}

	 //主子表信息
	 getData=(expanded, record)=>{
		 console.log(record)
	 }

	 expandedRowRender = (record) => {
		 return (
			<FormItemTab tabs={this.state.pledgemessage.rows[record.key-1].childform[0]} />
		 )
	 }

	 //表体数据接口解析
	 loaddata= (originData,pk,message,url)=>{
		 console.log(originData)
		 let self=this;
		axios.post(url, {
			id: pk
			})
			.then(function (response) {
				if (response.data.success) {
					console.log(originData)
					let newdata = response.data.data.head.rows[0].values;
					if(originData.childform){
						let childform=originData.childform[0];
						for(let index in childform){
							if(newdata.hasOwnProperty(index)){
								childform[index]=newdata[index]
							}
						}
					}
					for(let key in originData){
						if(newdata[key]){
							originData[key]={
								display:newdata[key].display,
								value:newdata[key].value
							}
						}
					}
					self.setState({
						[message]: self.state[message]
					});
				}
			})
	 }

	 //表体修改active
	 changeActive= (item)=>{
		this.setState({
			tabsActiveKey: item
		})
	 }

	render() {

		console.log("++++++++++",this.state.assureInfo)
		let self = this;

		let { editStatus } = this.state;
		let isChange = (editStatus === 'change');
		console.log(this.state.pledgemessage) 
		//质押信息
	    let pledgeTitle = ()=>(<div style={{ position: 'absolute', top: 4}} ><Button size="sm" colors="info"   onClick={()=> {this.handleAddNewline('pledgemessage', 1); }} >新增</Button></div>);
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
					let defaultValue = {};
					if (text.value !== null) {
						defaultValue = {refname: text.display, refpk: text.value };

					}
					return (record.isEdit ? (<Refer name="guapropertyid" 
                                            refModelUrl={'/fm/guapopRef/'} 
                                            value={ defaultValue }
											refCode={'guapopRef'}
                                           // ctx={'/uitemplate_web'}                    
                                            onChange={(v)=>{
                                            	let { rows } = this.state.pledgemessage;
												let originData = this.findByKey(record.key, rows);
												if (originData) {
													originData.guapropertyid = {
	                                            		display: v.refname,
	                                            		value: v.refpk,
	                                            		scale: -1
													};
													//根据参照请求详情显示到表格信息
												    this.loaddata(originData,v.refpk,'pledgemessage',window.reqURL.fm + 'fm/guaproperty/query');
												}
												this.setState({
													pledgemessage: this.state.pledgemessage
												});
                                            }}
                     />) : (<span>{text.value}</span> )
					)
				}
			},
			{ title: '所有权属性', key: 'owner', dataIndex: 'owner.display'},
			{ title: '币种', key: 'currtypeid', dataIndex: 'currtypeid.display'},
			{
				title: "*实际可质押价值",
				dataIndex: "usingamount",
				key: "usingamount",
				render: (text, record, index) => (
					record.isEdit ? ( <InputItem defaultValue = { text.value }
						onChange = {
								(v) => {
									let { rows } = this.state.pledgemessage;
									let originData = this.findByKey(record.key, rows);
									if (originData) {
										originData.usingamount = {
											value: v,
										}
									}
		
									this.setState({
										pledgemessage: this.state.pledgemessage
									});
							}
						}/>) : (<span>{record.usingamount.value}</span>)
					)
			},
			{ title: '累计已质押价值', key: 'totalpledge', dataIndex: 'totalpledge.display'},
			{ title: '剩余质押价值', key: 'restpledge', dataIndex: 'restpledge.display'},
		   	{
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 100,
				render: (text, record, index) => (
					<a href="javascript:;" onClick={ () => {


							let { rows } = this.state.pledgemessage;
							let originData = this.findByKey(record.key, rows);
							if (originData) {

								if (originData.status.value=='1') {
									originData.status = {
										value: "3",
									};
								} else {
									rows = rows.filter(function(v, i, a) {
										return v.key != originData.key;
									});

									this.state.pledgemessage.rows = rows;
								}
							}

							this.setState({
								pledgemessage: this.state.pledgemessage
							});
						}} ><Icon className="iconfont icon-shanchu edit-icon" /></a> 
				)
			}
		];
//抵押信息
       let mortgageTitle = ()=>(<div style={{ position: 'absolute', top: 4}} ><Button size="sm" colors="info"   onClick={()=> {this.handleAddNewline('mortgagemessage', 2); }} >新增</Button></div>);
	   let mortgageColumns = [
		   {
			   title: "序号",
			   dataIndex: "key",
			   key: "key"
		   }, {
			   title: "抵押物",
			   dataIndex: "guapropertyid",
			   key: "guapropertyid",
			   render: (text, record, index) => {
				   let defaultValue = {};
				   if (text.value !== null) {
					   defaultValue = { refname: text.display, refpk: text.value };

				   }
				   return (record.isEdit ? (<Refer name="guapropertyid"
					   refModelUrl={'/fm/guapopRef/'}
					   value={defaultValue}
					   refCode={'guapopRef'}
					   ctx={'/uitemplate_web'}
					   onChange={(v) => {
						   let { rows } = this.state.mortgagemessage;
						   let originData = this.findByKey(record.key, rows);
						   if (originData) {
							   originData.guapropertyid = {
								   display: v.refname,
								   value: v.refpk,
							   };
							   this.loaddata(originData,v.refpk,'mortgagemessage',window.reqURL.fm + 'fm/guaproperty/query');
						   }
						   this.setState({
							mortgagemessage: this.state.mortgagemessage
						   });

					   }}

				   />) : (<span>{text.value}</span>)
				   )
			   }
		   },
		   { title: '所有权属性', key: 'owner', dataIndex: 'owner.display' },
		   { title: '人民币', key: 'money', dataIndex: 'money.display' },
		   {
			   title: "*实际可抵押价值",
			   dataIndex: "usingamount",
			   key: "usingamount",
			   render: (text, record, index) => (
				   record.isEdit ? (<InputItem defaultValue={text.value}
					   onChange={
						   (v) => {
							   let { rows } = this.state.mortgagemessage;
							   let originData = this.findByKey(record.key, rows);
							   if (originData) {
								   originData.usingamount = {
									   value: v,
								   }
							   }

							   this.setState({
								   mortgagemessage: this.state.mortgagemessage
							   });
						   }
					   } />) : (<span>{text}</span>)
			   )
		   },
		   { title: '累计已质押价值', key: 'totlemortgage', dataIndex: 'totlemortgage.display' },
		   { title: '剩余质押价值', key: 'restpledge', dataIndex: 'restpledge.display' },
		   {
			   title: "操作",
			   dataIndex: "oper",
			   key: "oper",
			   width: 100,
			   render: (text, record, index) => (
				   <a href="javascript:;" onClick={() => {


					   let { rows } = this.state.mortgagemessage;
					   let originData = this.findByKey(record.key, rows);
					   if (originData) {

						if (originData.status.value=='1') {
							originData.status = {
								value: "3",
							};
						} else {
							rows = rows.filter(function(v, i, a) {
								return v.key != originData.key;
							});

							   this.state.mortgagemessage.rows = rows;
						   }
					   }

					   this.setState({
						mortgagemessage: this.state.mortgagemessage
					   });
				   }} ><Icon className="iconfont icon-shanchu edit-icon" /></a>
			   )
		   }
	   ];
//保证信息
		let ensureTitle = ()=>(<div style={{ position: 'absolute', top: 4}}><Button size="sm" colors="info"  onClick={()=> {this.handleAddNewline('ensuremessage', 3) }} >新增</Button></div>);
		let ensureColumns = [
			{
				title: "序号",
				dataIndex: "key",
				key: "key"
			},{
				title: "*保证人类型",
				dataIndex: "warrantortype",
				key: "warrantortype",
				render:(text,record,index) =>{
					self.state.ensuremessage.rows[index].warrantortype={
						value: String(text.value)
					}
					return (
						<Radio.RadioGroup
							name="warrantortype"
							selectedValue={self.state.ensuremessage.rows[index].warrantortype.value}
							onChange={(v)=>{
								  let { rows } = this.state.ensuremessage;
								  let originData = this.findByKey(record.key, rows);
								  if (originData) {
									  originData.warrantortype = {
										  value: v,
									  };
								  }
								  this.setState({
									ensuremessage: this.state.ensuremessage
								  });
							}}>
							<Radio value="1" >合作伙伴</Radio>
							<Radio value="2" >内部单位</Radio>
						</Radio.RadioGroup>
						)
				}
			},{
				title: "*保证人",
				dataIndex: "ensurer",
				key: "ensurer",
				render: (text, record, index) => {
					 let defaultValue = {};
					if (String(record.warrantortype.value)=='2') {
						defaultValue = { refname:text?(text.display):record.warrantorin.display, refpk: text?(text.value):record.warrantorin.value };
					}else if(String(record.warrantortype.value)=='1'){
						defaultValue = { refname:text?(text.display):record.warrantorou.display, refpk: text?(text.value):record.warrantorou.value };
					}else{
						if (text.value !== null) {
							defaultValue = { refname: text.display, refpk: text.value };
						}
					}
					return (record.isEdit ? (<Refer 
						name="ensurer"
						refModelUrl={'/bd/finbranchRef/'}
						value={defaultValue}
						refCode={'finbranchRef'}
						ctx={'/uitemplate_web'}
						onChange={(v) => {
							let { rows } = this.state.ensuremessage;
							let originData = this.findByKey(record.key, rows);
							if (originData) {
								originData.ensurer = {
									display: v.refcode,
									value: v.refcode,
								};
								originData.warrantorname = {
									value: v.refname
								};
							}
							this.setState({
							  ensuremessage: this.state.ensuremessage
							});
 
						}}
 
					/>) : (<span>{text}</span>)
					)
				}
			},
			{ title: '保证人名称', key: 'warrantorname', dataIndex: 'warrantorname.value' },
			{
				title: "*保证比例",
				dataIndex: "warratio",
				key: "warratio",
				render: (text, record, index) => (
					record.isEdit ? (<InputItem defaultValue={text.value}
						onChange={
								(v) => {
									let { rows } = this.state.ensuremessage;
									let originData = this.findByKey(record.key, rows);
									if (originData) {
										originData.warratio = {
											value: v,
										}
									}
		
									this.setState({
										ensuremessage: this.state.ensuremessage
									});
							}
						} />) : (<span>{text.value}</span>)
				)
			},
			{ title: '保证金额', key: 'waramount', dataIndex: 'waramount.value',
			  render: (text, record, index) => {
				     let { rows } = this.state.ensuremessage;
					 let val=this.state.assureInfo.guaamount.value;
					 let originData = this.findByKey(record.key, rows);
					 let rate=originData.warratio.value;
					 let finalNumber=val*rate;
				 return(
					record.isEdit?(<span>{finalNumber}</span>):(<span>{text.value}</span>)
				 )
			    }
			},
			{
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 100,
				render: (text, record, index) => (
					<a href="javascript:;" onClick={() => {
 
 
						let { rows } = this.state.ensuremessage;
						let originData = this.findByKey(record.key, rows);
						if (originData) {
 
							if (originData.status.value=='1') {
								originData.status = {
									value: "3",
								};
							} else {
								rows = rows.filter(function(v, i, a) {
									return v.key != originData.key;
								});
								this.state.ensuremessage.rows = rows;
							}
						}
 
						this.setState({
							ensuremessage: this.state.ensuremessage
						});
					}} ><Icon className="iconfont icon-shanchu edit-icon" /></a>
				)
			}
		];

//反担保信息
       let  unguaranteeTitle= ()=>(<div style={{ position: 'absolute', top: 4}}><Button size="sm" colors="info"  onClick={()=> {this.handleAddNewline('unguaranteemessage', 3) }} >新增</Button></div>);
	   let guaranteeColumns = [
			{
				title: "序号",
				dataIndex: "key",
				key: "key"
			},{
				title: "反担保合同号",
				dataIndex: "ungaranumber",
				key: "ungaranumber",
				render: (text, record, index) => {
					debugger
					let defaultValue = {};
					if (text.value !== null) {
						defaultValue = {refname: text.display, refpk: text.value };

					}
					return (record.isEdit ? (<Refer name="ungaranumber" 
                                            refModelUrl={'/fm/guacontractRef/'} 
                                            value={ defaultValue }
                                            refCode={'guacontractRef'}
											referFilter={{contracttype:2}}
											multiLevelMenu={[
												{
													name: ['合同号'],
													code: ['ractno']
												}
											]}
                                            onChange={(v)=>{
                                            	let { rows } = this.state.unguaranteemessage;
												let originData = this.findByKey(record.key, rows);
												debugger
												if (originData) {
													originData.ungaranumber = {
	                                            		display: v.ractno,
	                                            		value: v.refpk,
	                                            		scale: -1
													};
													this.loaddata(originData,v.refpk,'unguaranteemessage',window.reqURL.fm + 'fm/guacontract/queryCtrycontract');
												}
												this.setState({
													unguaranteemessage: this.state.unguaranteemessage
												});

                                            }}
                                                                                   
                     />) : (<span>{text}</span> )
					)
				}
			},
			{ title: '债权人', key: 'creditor', dataIndex: 'creditor.display'},
			{ title: '债务人', key: 'debtor', dataIndex: 'debtor.display'},
			{ title: '担保人', key: 'guarantor', dataIndex: 'guarantor.value'},
			{ title: '反担保人', key: 'warrantorin', dataIndex: 'unassurergar.display'},
			{ title: '担保币种', key: 'guacurrtypeid', dataIndex: 'guacurrtypeid.display'},
			{ title: '债务币种', key: 'debtcurrencyid', dataIndex: 'debtcurrencyid.display'},
		   	{
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 100,
				render: (text, record, index) => (
					<a href="javascript:;" onClick={ () => {
							let { rows } = this.state.unguaranteemessage;
							let originData = this.findByKey(record.key, rows);
							if (originData) {
								if (originData.dr) {
									originData.dr = {
										display: null,
										value: 1,
										scale: -1
									};
								} else {

									rows = rows.filter(function(v, i, a) {
										return v.key != originData.key;
									});

									this.state.unguaranteemessage.rows = rows;
								}
							}
							this.setState({
								unguaranteemessage: this.state.unguaranteemessage
							});
						}} ><Icon className="iconfont icon-shanchu edit-icon" /></a> 
				)
			}
		];
    //table数据过滤
		let pledgeRows = this.state.pledgemessage.rows.filter(this.filterBodyListBydr);
		//抵押信息
		let mortgageRows = this.state.mortgagemessage.rows.filter(this.filterBodyListBydr);
		//保证信息
		let ensureRows = this.state.ensuremessage.rows.filter(this.filterBodyListBydr);
		//反担保信息
		let ungaranteeRows = this.state.unguaranteemessage.rows.filter(this.filterBodyListBydr);

		let tabs = [
			{
				key: 1,
				isShow: this.state.hasPayplan,
				label: '质押信息',
				render: () =><Table key='1'
				 title={ pledgeTitle }
				 onExpand={this.getData}
       			 expandedRowRender={this.expandedRowRender} 
				 columns={pledgeColums} 
				 data={pledgeRows} />
			},{ 
				key: 2,
				isShow: this.state.hasCreditinfo,
				label: '抵押信息',
				render: () => <Table  key='2' title={ mortgageTitle }  columns={mortgageColumns} data={mortgageRows} />
			},{
				key: 3,
				label: '保证信息',
				isShow: this.state.hasSyndicatedloan,
				render: () => <Table key='3' title={ ensureTitle } columns={ensureColumns} data={ ensureRows } /> 
			},{
				key: 4,
				label: '反担保信息',
				isShow: this.state.hasGuarantee,
				render: () => <Table key='4' title={unguaranteeTitle} columns={guaranteeColumns} data={ungaranteeRows} /> 
			}
		];

		console.log('render=> this.state', this.state);

		const breadcrumbItem = [ { href: '#', title: '资金云' }, { title: ' 担保' }, { title: '担保合约' } ];
		return (
			<div id="cloud-fund-assure-wrap"  >
				<BreadCrumbs items={ breadcrumbItem } />
				<div className="assure-content"  id='fm_assure'>
					<Row>
						<Col  md={12}   xs={12}   sm={12} >
							<Affix offsetTop={0} style={{ zIndex: 8000}} >
			 					<div className="tab-header " style={{ zIndex: 8000}} >
			 						<div className="tab-header-left">{ this.state.title }</div>
			 						<div className="tab-header-mid">
			 							<ul>
											<li onClick={ (e)=>{ self.handleTabClick(e, 0); } } >
								 				<a href="javascript:;">合约信息</a>
								 			</li>
											<li onClick={ (e)=>{ self.handleTabClick(e, 1); } } >
								 				<a href="javascript:;">债务信息</a>
								 			</li>
											 <li onClick={ (e)=>{ self.handleTabClick(e, 2); } } >
								 				<a href="javascript:;">担保信息</a>
								 			</li>
											<li onClick={ (e)=>{ self.handleTabClick(e, 3); } } >
								 				<a href="javascript:;">其他信息</a>
								 			</li>
			 							</ul>
			 						</div>
			 						<div className="tab-header-right">
			 							<Button size="sm" colors="info" 
			 									onClick={this.handleSave} 
			 									style={{ marginRight: 8}}>保存</Button>
			 							<Button size="sm" onClick={ this.handleCancel } >取消</Button>
			 						</div>

			 					</div>
			 				</Affix> 
			 				<div className="section-container" >
								<section  ref={(ele) => { this.sectionEle0 = ele; }} >
									<Panel >
										<div className="section-title">合约信息</div>
										<Form   showSubmit={false} checkFormNow={ this.state.checkForm }
												useRow={true}  submitCallBack={this.assureFormCallback}　>
											<FormItem inline={true} 
											     showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={10} md={10} sm={10}
												labelName="合同类型：" 
												isRequire={true} method="change" change={self.handleGTypeChange.bind(this,'contracttype')}  >
												<RadioItem  disabled={isChange} name="contracttype" type="customer" defaultValue={this.state.assureInfo.contracttype.value}
													items={
														() => {
															return [{
																label: '担保合同',
																value: '0'
															},
															{
																label: '反担保合同',
																value: '1'
															}];
														}
													}
												/>
						                    </FormItem>
											<FormItem inline={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="担保/反担保合约号：" 
												method="blur" inputAlfer="%"
												reg={/^[0-9]*$/}
												errorMessage="输入格式错误">
												{self.state.assureInfo.contracttype.value=='0'?(<InputItem name="contractno"
													type="customer"
													disabled={isChange}
													defaultValue={this.state.assureInfo.contractno.value}
													placeholder="请输入担保合约号" />):(<InputItem name="ctrycontractno"
													type="customer"
													disabled={isChange}
													defaultValue={this.state.assureInfo.ctrycontractno.value}
													placeholder="请输入反担保合约号" />)}
											</FormItem>
											 <FormItem inline={true} 
											 showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="合同编号："
												method="blur" inputAlfer="%"
												errorMessage="输入格式错误">
												<InputItem  name="vbillno" 
												 type="customer"
												 disabled={true}
												defaultValue={this.state.assureInfo.vbillno.value}  
												/>
											</FormItem>
											<FormItem inline={true} showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="债权人类型：" isRequire={true} method="change" change={self.handleGTypeChange.bind(this,'creditortype')}  >
												<RadioItem name="creditortype" type="customer" defaultValue={this.state.assureInfo.creditortype.value}
													items={
														() => {
															return [{
																label: '金融机构',
																value: '1'
															},
															{
																label: '合作伙伴',
																value: '2'
															},{
																label: '内部单位',
																value: '3'
															}];
														}
													}
												/>
						                    </FormItem>
											<FormItem inline={ true } showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
												labelName="债权人：" asyncCheck={this.checkRefer}　 method="change"    errorMessage="请输入贷款单位" >
												{self.state.assureInfo.creditortype.value == '1' ? (<ReferItem  name="creditor"　refCode="finbranchRef"　refModelUrl="/bd/finbranchRef/"
															type="customer"
															defaultValue={{
																	refname: this.state.assureInfo.creditor.display,
																	refpk: this.state.assureInfo.creditor.value
															}}  refName = "金融机构" />) 
																: self.state.assureInfo.creditortype.value == '2' ? (<ReferItem  name="creditor"　refCode="partnerRef"　refModelUrl="/bd/partnerRef/"
																type="customer"
																defaultValue={{
																		refname: this.state.assureInfo.creditor.display,
																		refpk: this.state.assureInfo.creditor.value
																}}  refName = "合作伙伴" /> )
																	: self.state.assureInfo.creditortype.value == '3' ? (<ReferItem  name="creditor"　refCode="finorgRef"　refModelUrl="/bd/finorgRef/"
																	type="customer"
																	defaultValue={{
																			refname: this.state.assureInfo.creditor.display,
																			refpk: this.state.assureInfo.creditor.value
																	}}  refName = "内部单位" /> ):''}
											</FormItem>


											<FormItem inline={true} showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="债务人类型：" isRequire={true} method="change" change={self.handleGTypeChange.bind(this,'debtortype')}  >
												<RadioItem  name="debtortype" type="customer" defaultValue={this.state.assureInfo.debtortype.value}
													items={
														() => {
															return [{
																label: '合作伙伴',
																value: '1'
															},
															{
																label: '企业本身',
																value: '2'
															}, {
																label: '内部单位',
																value: '3'
															}];
														}
													}
												/>
											</FormItem>
											<FormItem inline={ true } showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
												labelName="债务人：" asyncCheck={this.checkRefer}　 method="change"    errorMessage="请输入债务人" >
												{self.state.assureInfo.debtortype.value == '1' ? (<ReferItem name="debtor" 　refCode="partnerRef" 　refModelUrl="/bd/partnerRef/"
													type="customer"
													defaultValue={{
														refname: this.state.assureInfo.debtor.display,
														refpk: this.state.assureInfo.debtor.value
													}} refName="合作伙伴" />)
													: self.state.assureInfo.debtortype.value == '2' ? (<ReferItem name="debtor" 　refCode="finorgRef" 　refModelUrl="/bd/finorgRef/"
														type="customer"
														defaultValue={{
															refname: this.state.assureInfo.debtor.display,
															refpk: this.state.assureInfo.debtor.value
														}} refName="企业本身" />)
														: self.state.assureInfo.debtortype.value == '3' ? (<ReferItem name="debtor" 　refCode="finorgRef" 　refModelUrl="/bd/finorgRef/"
															type="customer"
															defaultValue={{
																refname: this.state.assureInfo.debtor.display,
																refpk: this.state.assureInfo.debtor.value
															}} refName="内部单位" />) : ''}
											</FormItem>
											<FormItem inline={true} showMast={false} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="反担保人类型：" isRequire={false} method="change" change={self.handleGTypeChange.bind(this,'warrantorintype')}  >
												<RadioItem  name="warrantorintype" type="customer" defaultValue={this.state.assureInfo.warrantorintype.value}
													items={
														() => {
															return (this.state.onwarrantorintype);
														}
													}
												/>
											</FormItem>
											<FormItem inline={ true } showMast={false} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
												labelName="反担保人："   method="change"    >
												{self.state.assureInfo.warrantorintype.value == '1' ? (<ReferItem name="warrantorin" 　refCode="partnerRef" 　refModelUrl="/bd/partnerRef/"
												type="customer"
												disabled={this.state.holdwarrantorin.value}
												defaultValue={{
													refname: this.state.assureInfo.warrantorin.display,
													refpk: this.state.assureInfo.warrantorin.value
												}} refName="合作伙伴" />)
												: self.state.assureInfo.warrantorintype.value == '2' ? (<ReferItem name="warrantorin" 　refCode="finorgRef" 　refModelUrl="/bd/finorgRef/"
													type="customer"
													disabled={this.state.holdwarrantorin.value}
													defaultValue={{
														refname: this.state.assureInfo.warrantorin.display,
														refpk: this.state.assureInfo.warrantorin.value
													}} refName="企业本身" />)
													: self.state.assureInfo.warrantorintype.value == '3' ? (<ReferItem name="warrantorin" 　refCode="finorgRef" 　refModelUrl="/bd/finorgRef/"
														type="customer"
														disabled={this.state.holdwarrantorin.value}
														defaultValue={{
															refname: this.state.assureInfo.warrantorin.display,
															refpk: this.state.assureInfo.warrantorin.value
														}} refName="内部单位" />) : (<ReferItem name="warrantorin" 　refCode="partnerRef" 　refModelUrl="/bd/partnerRef/"
														type="customer"
														disabled={this.state.holdwarrantorin.value}
														defaultValue={{
															refname: this.state.assureInfo.warrantorin.display,
															refpk: this.state.assureInfo.warrantorin.value
														}} refName="合作伙伴" />)}
											</FormItem>

											<FormItem inline={true} showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="担保人：" isRequire={true} method="blur" inputAlfer="%"
												errorMessage="格式错误"  
												htmlType="chinese"
												 >
												<InputItem name="guarantor"
													type="customer"
													disabled={isChange}
													defaultValue={this.state.assureInfo.guarantor.value}
													placeholder="张三" />
											</FormItem>
											
											 <FormItem inline={true} showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="担保方式："   isRequire={true}  method="change" change={self.handleGTypeChange.bind(this,'guatype')}
											   >
													<RadioItem  name="guatype" type="customer" defaultValue={ this.state.assureInfo.guatype.value }
						                    		items= {
						                    			() => {
						                    				return [{
						                    					label: '保证',
						                    					value: '1'
						                    				}, 
						                    			    {
						                    					label: '抵押',
						                    					value: '2'
						                    				}, {
						                    					label: '质押',
						                    					value: '3'
						                    				}, {
						                    					label: '混合',
						                    					value: '4'
						                    				}];
						                    			}
						                    		}
						                    	/>
											</FormItem>
							            </Form>
									</Panel>
								</section>


								<section  ref={(ele) => { this.sectionEle1 = ele; }} >
									<Panel >
										<div className="section-title"> 债务信息</div>
										<Form   useRow={true}
												submitAreaClassName='classArea' 
												showSubmit={false}
												checkFormNow={ self.state.checkForm }
												submitCallBack={ self.submitBusinessdebt }　>

											<FormItem inline={ true } 
											    showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
												labelName="债务种类："
												isRequire={true} 
												method="change">
													<ReferItem name="debttype" refCode="transtypeRef"
													refModelUrl="/bd/transtypeRef/"
													type="customer"
													clientParam={{
														maincategory:2,
														detailcategory:1
													}}
													referFilter={
														{type:'contract'}
													}
													disabled={isChange}
													defaultValue={{
														refname: this.state.assureInfo.debttype.display,
														refpk: this.state.assureInfo.debttype.value
													}} />
						                    </FormItem>
											<FormItem inline={ true }  labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
												labelName="担保债务描述：" 
												method="blur"  >
												<InputItem name="debtnote" 	type="customer" defaultValue={this.state.assureInfo.debtnote.value} placeholder="请输入描述信息" />
						                    </FormItem>

											<FormItem inline={ true}  showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
						                    	labelName="债务起始时间：" 
												 method="blur"  
												 isRequire={true} 
						                    	errorMessage="请输入起始日期">
						                        <DatePicker 
												    name="startdate" 
													type="customer" 
													isRequire={true}
													format={format}
													disabled={isChange}
													locale={ zhCN }
													onChange={(v)=>{
                                           			 this.handleInputChange("startdate",'begindate', v.format(format),'assureInfo')
                                        			}}
							                        defaultValue={this.state.editStatus=='new'?'': moment(this.state.assureInfo.startdate.value) } 
												    placeholder={ dateInputPlaceholder } />
						                    </FormItem>
						                    <FormItem inline={ true} showMast={true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
						                    	labelName="债务结束时间：" isRequire={true}  errorMessage="请输入结束日期" 
						                    	method="blur"  >
						                        <DatePicker name="enddate"  
												   type="customer" format={ format } locale={ zhCN }
												   disabledDate={ this.disabledDate.bind(this,'enddate') } 
							                       defaultValue={this.state.editStatus=='new'?'': moment( this.state.assureInfo.enddate.value ) } 
												  onChange={(v)=>{
                                           			 this.handleInputChange("enddate",'enddate', v.format(format),'assureInfo')
                                        			}}
												   placeholder={ dateInputPlaceholder } />
						                    </FormItem>

											<FormItem inline={true} showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="债务币种：" asyncCheck={this.checkRefer}
												method="change"  >
												<ReferItem name="debtcurrencyid" refCode="currencyRef"
													refModelUrl="/bd/currencyRef/"
													type="customer"
													disabled={isChange}
													defaultValue={{
														refname: this.state.assureInfo.debtcurrencyid.display,
														refpk: this.state.assureInfo.debtcurrencyid.value
													}} />
											</FormItem>
											<FormItem inline={ true } showMast={true}  labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
												labelName="债务金额："   
												 isRequire={true} 
												 reg={/^[1-9][0-9|,]*(\.\d{1,4})?$/i}
												 change={this.handleFinancamount.bind(this,'pridebtamount')}
												errorMessage="格式错误,最多两位小数" 
												method="blur"  >
												<InputItem name="pridebtamount" 
												type="customer"
												processChange = {
																(state, v) => {
																	return this.formatDot({value:v});
																}
															}
												defaultValue={this.formatAcuracy(this.state.assureInfo.pridebtamount)}
												placeholder="请输入金额" />
						                    </FormItem>
											<FormItem inline={ true } showMast={true}  labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
												labelName="债务本币汇率："  
												isRequire={true}    
												 errorMessage="格式错误" 
												 reg={/^[1-9][0-9|,]*(\.\d{1,4})?$/i} 
												 change={this.handleFinancamount.bind(this,'olcdebtrate')}
												method="blur"  >
												<InputItem type="customer" 
												 disabled={isChange} name="olcdebtrate"
												 processChange = {
																(state, v) => {
																	return this.formatDot({value:v});
																}
															}
													defaultValue={this.formatAcuracy(this.state.assureInfo.olcdebtrate)}
												   placeholder="请输入汇率" />
						                    </FormItem>
				                    	</Form>
									</Panel>
								</section>



								<section  ref={(ele) => { this.sectionEle2 = ele; }} >
									<Panel >
										<div className="section-title"> 担保信息</div>
										<Form   useRow={true}
												submitAreaClassName='classArea' 
												showSubmit={false}
												checkFormNow={ self.state.checkForm }
												submitCallBack={ self.submitBusiness }　>

												<FormItem inline={ true}  showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
						                    	labelName="担保起始时间：" 
												 isRequire={true}  
												 method="blur"
												 disabled={isChange}  
						                    	errorMessage="请输入起始日期"    >
						                        <DatePicker name="guastartdate" type="customer" 
													format={ format } 
													locale={ zhCN }
													disabledDate={ this.disabledDate.bind(this,'guastartdate') } 
													onChange={(v)=>{
                                           			 this.handleInputChange("guastartdate",'begindate', v.format(format),'assureInfo')
                                        			}}
							                       defaultValue={this.state.editStatus=='new'?'': moment( this.state.assureInfo.guastartdate.value) }
												    placeholder={ dateInputPlaceholder } />
						                    </FormItem>
						                    <FormItem 
												inline={ true} 
											    showMast={true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
						                    	labelName="担保结束时间：" 
												isRequire={true} 
												 errorMessage="请输入结束日期" 
						                    	method="blur"  >
						                        <DatePicker name="guaenddate"  type="customer" 
													format={ format } 
													locale={ zhCN }
													disabledDate={ this.disabledDate.bind(this,'guaenddate') } 
													onChange={(v)=>{
                                           			 this.handleInputChange("guaenddate",'enddate', v.format(format),'assureInfo')
                                        			}}
							                       defaultValue={this.state.editStatus=='new'?'': moment( this.state.assureInfo.guaenddate.value ) }
												    placeholder={ dateInputPlaceholder } />
						                    </FormItem>

											<FormItem inline={true} showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="担保币种：" asyncCheck={this.checkRefer}
												method="change"  >
												<ReferItem name="guacurrtypeid" refCode="currencyRef"
													refModelUrl="/bd/currencyRef/"
													type="customer"
													disabled={isChange}
													defaultValue={{
														refname: this.state.assureInfo.guacurrtypeid.display,
														refpk: this.state.assureInfo.guacurrtypeid.value
													}} />
											</FormItem>
											<FormItem inline={true} showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="担保金额："
												isRequire={true}
												errorMessage="格式错误"
												reg={/^[1-9][0-9|,]*(\.\d{1,4})?$/i}
												change={this.handleFinancamount.bind(this, 'guaamount')}
												method="blur"  >
												<InputItem type="customer"
													disabled={isChange} name="guaamount"
													processChange={
														(state, v) => {
															return this.formatDot({ value: v });
														}
													}
													defaultValue={this.formatAcuracy(this.state.assureInfo.guaamount)}
													placeholder="请输入担保金额" />
											</FormItem>
											<FormItem inline={true} showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="担保本币汇率："
												isRequire={true}
												errorMessage="格式错误"
												reg={/^[1-9][0-9|,]*(\.\d{1,4})?$/i}
												change={this.handleFinancamount.bind(this, 'guaolcrate')}
												method="blur"  >
												<InputItem type="customer"
													disabled={isChange} name="guaolcrate"
													processChange={
														(state, v) => {
															return this.formatDot({ value: v });
														}
													}
													defaultValue={this.formatAcuracy(this.state.assureInfo.guaolcrate)}
													placeholder="请输入担保本币汇率" />
											</FormItem>
											<FormItem inline={true} showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="担保本币金额："
												isRequire={true}
												errorMessage="格式错误"
												reg={/^[1-9][0-9|,]*(\.\d{1,4})?$/i}
												change={this.handleFinancamount.bind(this, 'gualcamount')}
												method="blur"  >
												<InputItem type="customer"
													disabled={isChange} name="gualcamount"
													processChange={
														(state, v) => {
															return this.formatDot({ value: v });
														}
													}
													onChange={(v)=>{
													   let usedValue=this.state.assureInfo.usedamount.value;
													   let {assureInfo}=this.state
													   if(parseInt(v)>=parseInt(usedValue)){
														   console.log(parseInt(v)>=parseInt(usedValue))
														   this.setState({
															   assureInfo:{
																   ...assureInfo,
																   avaamount:{
																	   value:parseInt(v)-parseInt(usedValue)
																   }
															   }
														   })
													   }
                                        			}}
													defaultValue={this.formatAcuracy(this.state.assureInfo.gualcamount)}
													placeholder="请输入担保本币金额" />
											</FormItem>
											<FormItem inline={ true } showMast={true}  labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
												labelName="已用担保金额："  isRequire={false} 
												method="blur"  >
												<InputItem isViewMode name="usedamount" type="customer"   defaultValue={this.formatAcuracy(this.state.assureInfo.usedamount) }/>
						                    </FormItem>
											<FormItem inline={ true } showMast={true}  labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
												labelName="可用担保金额："   isRequire={false} 
												method="blur"  >
												<InputItem isViewMode 
												 type="customer"  
												 name="avaamount" 
												 defaultValue={this.formatAcuracy(this.state.assureInfo.avaamount)}/>
						                    </FormItem>
											<FormItem inline={true} showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="保证责任：" isRequire={true} method="change" change={self.handleGTypeChange.bind(this,'warliability')}  >
												<RadioItem name="warliability" type="customer" defaultValue={this.state.assureInfo.warliability.value}
													items={
														() => {
															return [{
																label: '一般保证',
																value: '1'
															},
															{
																label: '连带责任保证',
																value: '2'
															}];
														}
													}
												/>
						                    </FormItem>

											<FormItem 
												inline={ true } 
												showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
												labelName="合约状态：" 
												method="change"   >
												<InputItem name="busistatus"
														type="customer"
														isViewMode
														defaultValue={this.state.assureInfo.busistatus.value}
													/>
						                    </FormItem>
											{/* <FormItem inline={ true } showMast={false} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
												labelName="上传附件："   isRequire={false} errorMessage="请上传附件" 
												method="blur"  >
												{self.state.id ?
													<span style={{ marginRight: 5 }} >
														<TmcUploader
														name="busistatus"
															billID={this.state.id}
															upload={this.handleUpload}
															isEdit={false}
															showUploadBtn={false}
															data={{ billId: '00000001', group: 'fm' }}
														/>
													</span> : <InputItem name="busistatus"
														type="customer"
														isViewMode
													/>}
												  <TmcUploader
												    billID = 'code'
													upload={this.handleUpload}
													isEdit={false}
													showUploadBtn={false}
													data={{ billId: '00000001', group: 'fm' }}
												/> 
						                    </FormItem> */}
				                    	</Form>
									</Panel>
								</section>

								<section ref={(ele) => { this.sectionEle3 = ele; }} >
									<Panel >
										<div className="section-title" style={{float: 'left'}} >其他信息</div>
										<LightTabs activeKey={ this.state.tabsActiveKey }  items={tabs} onChangeActive={this.changeActive} />
									</Panel>
								</section>
							</div>
						</Col>
			        </Row>

			        <Modal  style={{ top: 200, width: 520, height: 303, fontSize: 13 }} show={ this.state.showModal } >
			        	<Modal.Header>
                    		<Modal.Title>
	                    		<span>合同保存</span>
	                    		<span style={{ fontSize: 10, color: '#ccc', float: 'right'}} className='close-icon iconfont icon-title-assure icon-guanbi' 
	                    				  onClick={()=> { hashHistory.go(-1); }} >
								</span>
							</Modal.Title>
		                </Modal.Header>

		                <Modal.Body>
		                	<span style={{fontSize: 40, display: 'block',marginLeft: 200}} className={ 'title-icon iconfont  icon-tishianniuchenggong' }></span>
		                	<span style={{fontSize: 20, display: 'block',marginLeft: 180}} >提交成功</span>

		                    <div style={{textAlign: 'center'}}>{`合同编号： ${this.state.id}　申请日期： ${this.state.ts}`}</div>
		                </Modal.Body>

		                <Modal.Footer>
		                    <Button size="sm" colors="info" style={{borderRadius: 2, marginRight: 8}}><a style={{ color: '#ffffff'}} href="#/fm/assure/">继续新增</a> </Button>
		                    <Button onClick={() => {
		                    	hashHistory.go(-1);
		                    }} size="sm" style={{ borderRadius: 2}}  >关闭</Button>
		                </Modal.Footer>
                	</Modal>

					<Loading fullScreen showBackDrop={ true } show={ this.state.isLoading } />
	            </div>
		    </div>
		);
	}
}
