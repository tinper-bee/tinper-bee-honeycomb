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
import Dropdown from 'bee-dropdown';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import DatePicker from 'bee-datepicker';
import Loading from 'bee-loading';
import jump from 'jump.js';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import moment from 'moment';
import FormItemTab from '../FormItem';
import 'bee-slider/build/Slider.css';

//审批
import ApproveDetailButton from 'containers/ApproveDetailButton';
import ApproveDetail from 'containers/ApproveDetail';

import { CheckboxItem, RadioItem, TextAreaItem, ReferItem , SelectItem, InputItem, DateTimePickerItem} from 'containers/FormItems';
import Select from 'bee-select';
import LightTabs from '../LightTabs';
import '../index.less';
import  Form from 'bee-form';
import 'bee-form/build/Form.css';

// import DeleteModal from 'containers/DeleteModal';
import MsgModal from 'containers/MsgModal';
import { numFormat, toast, sum } from 'utils/utils';
import Ajax from 'utils/ajax';
import BreadCrumbs from '../../../../bd/containers/BreadCrumbs';

const URL= window.reqURL.fm;

var qs = require('qs');

const { TreeNode } = Tree;
const { FormItem } = Form;
const Option = Select.Option;
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
const busistatusMap= {
	'1':'未审核',
	'2':'已审核',
	'2':'在执行',
	'2':'已结束',
	'2':'已终止',
}



export default class  assureView extends Component {

 	state = {

 		//页面状态 EDIT VIEW 
 		editStatus: 'change',
 		// showModal: false,
 		//页面标题
 		title: '担保合约',
 		// 是否在请求
 		isLoading: false,
 		checkForm: false,

 		//显示更多按钮内容
 		shoreMore: true,

 		id: this.props.location.query.id,

 		//是否可以提交

 		isassureSubmitble: false,
 		isCreditSubmitble: false,


 		//表体是否显示
 		hasPayplan: false,
 		hasCreditinfo: false,
 		hasSyndicatedloan: false,
 		hasGuarantee: false,

 		//表体当前切换页码
 		tabsActiveKey: 1,
 	　
 		//表头信息  合约信息 债务信息 担保信息
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
			//审批状态
			vbillstatus:{}
		},
		//表体信息
		pledgemessage: {
			rows: [
			],
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

	 changeActive= (item)=>{
		this.setState({
			tabsActiveKey:item
		})
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


 	componentWillMount() {
 		console.log('this is id print', this.state.id);
 		// this.state.isLoading = true;
 		if (this.state.id) {
 			this.state.isLoading = true;
 			this.searchById(this.state.id);
 		}
 	}

 	componentDidMount() {}

 	searchById(id) {
		let self = this;
		axios.post(window.reqURL.fm + 'fm/guacontract/query', {
				id: id
			}).then(function(response) {
				let { data } = response;
				console.log(response, 'response');
				self.echoData(data);
			}).catch(function(error) {
				console.log(error, 'error');
				self.setState({
					isLoading: false
				});
				
			});
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





	echoData(data) {
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

 	onVisibleChange = (visible) => {

 	}
 	onSelect = () => {
 	}

 	forwardPage = (type) => {
 		let { id } = this.state;
 		if (type == 'assure_tracelog' && id) {
 			hashHistory.push(`/fm/assure_tracelog?id=${id}&type=tracelog`);
 		}
 	}

 	handleEdit = ()=> {
 		let { id } = this.state;
 		if ( id ) {
 			hashHistory.push(`/fm/assure?id=${id}&type=update`);
 		}
 	}

 	handleDelete = () => {
 		let { id } = this.state;
 		if (id) {
 			this.setState({
 				showModal: true
 			});
 		}
 	}

// 刪除行
	delRow = () => {
		let self = this;
		let { id, assureInfo } = this.state;
		Ajax({
			url: URL + 'fm/guacontract/del',
			data: {
				data:{
					head:{
						rows:[
								{
								values:{
									id:{
									 	value:assureInfo.id.value || assureInfo.id.display,
									},
									tenantid:{
										value:assureInfo.tenantid.value || assureInfo.tenantid.display,
									},
									ts:{
										value:assureInfo.ts.value
									} 
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
					hashHistory.go(-1);
				} else {
					toast({content: message.message, color: 'warning'});
					self.setState({
						isLoading: false
					});
				}
			},
			error: function(res) {
				toast({content: '后台报错,请联系管理员', color: 'danger'});
			}
		});
	}

 	handleChange = () => {
 		let { id } = this.state;
 		if ( id ) {
 			hashHistory.push(`/fm/assure?id=${id}&type=change`);
 		}
 	}

 	handleTabClick = (e, index) => {

 		jump(this['sectionEle' + index], {
			duration: 300,
			offset: -50,
			callback: undefined
		})

 	}
 
 	handleEnter = () => {
 		console.log('handleEnter!');
 	}

 	handleLeave = () => {
 		console.log('handleLeave');
 	}

	 //提交 收回

	 handleAudit = (type) => {
		let self = this;
		let  record=self.state.assureInfo;
		const data ={
			data:{
				head: {
					rows: [ {
						values:	record
					} ]
				}
			}
		};
		Ajax({
			url: window.reqURL.fm + `fm/guacontract/${type}`,
			data,
			success: function(res) {
				const {
					data,
					message,
					success
				} = res;
				if (success) {
					toast({
						content: '操作成功！',
						color: 'success'
					});
					self.echoData(res);
					// self.getApplyList(self.state.pageIndex, self.state.pageSize, self.state.contstatus);
				} else {
					toast({
						content: message.message,
						color: 'warning'
					});
					self.setState({
						isLoading: false
					});
				}
			},
			error: function(res) {
				toast({
					content: '后台报错,请联系管理员',
					color: 'danger'
				});
				self.setState({
					isLoading: false
				});
			}
		});
	}



	render() {
		//引入审批

		let isApprove = this.props.location.pathname.indexOf('/approve') !== -1;
		let processInstanceId = this.props.location.query.processInstanceId;
		let businesskey = this.props.location.query.businesskey;
        let id = this.props.location.query.id;


		let self = this;
		console.log('this.state =>', this.state);


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
				  return(<span>{record.currtypeid.display}</span>)
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
				  return(<span>{record.totalpledge.value}</span>)
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
				render: (text, record, index) => <span>{record.owner.value}</span>
			},
			{ title: '所有权属性', key: 'owner', dataIndex: 'owner.display',
				render: (text, record, index) => <span>{record.owner.value}</span>
			},
			{ title: '币种', key: 'currtypeid', dataIndex: 'currtypeid.display',
			render: (text, record, index) =>{
				return(<span>{record.currtypeid.display}</span>)
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
				render: (text, record, index) =>{
					<span>{text.value}</span>
				} 
			},{
				title: "*保证人",
				dataIndex: "ensurer",
				key: "ensurer",
				render: (text, record, index) =>{
					let value=record.warrantorin.display;
					let value2=record.warrantorou.display;
					return(
						<span>{value?value:value2}</span>
					)
				} 
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
			render: (text, record, index) => <span>{this.formatAcuracy(record.waramount)}</span>},
			{
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 100,
				render: (text, record, index) => <span>操作</span>
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



		//合约状态

		 let { assureInfo } = this.state;
		 let vbillstatus = assureInfo.vbillstatus.value;




		let moreItems = (<Menu multiple className='btn-more-dropdown' onSelect={ this.onSelect } >
						<MenuItem ><Button onClick={ () => { this.forwardPage('assure_tracelog'); } } size="sm" style={{ minWidth: 70 }}  >变更记录</Button></MenuItem>
						{ vbillstatus == '0' ? <MenuItem ><Button  onClick={() => { this.handleAudit('commit')}} size="sm" >提交</Button></MenuItem> : ''}
						{ vbillstatus == '3' ? <MenuItem ><Button 　onClick={() => { this.handleAudit('uncommit')}} size="sm" >收回</Button></MenuItem> : ''}
						<MenuItem ><ApproveDetailButton processInstanceId={processInstanceId} /></MenuItem>
						<MenuItem ><Button  size="sm" style={{ minWidth: 70 }}  >打印</Button></MenuItem>
						<MenuItem ><Button  size="sm" style={{ minWidth: 70 }}  >附件管理</Button></MenuItem>
					</Menu>);
		const breadcrumbItem = [ { href: '#', title: '资金云' }, { title: ' 担保' }, { title: '担保合约' } ];

		return  <div id="cloud-fund-assure-wrap" >
				<BreadCrumbs items={ breadcrumbItem } />
				<div className="assure-content">

				{ isApprove && <ApproveDetail 
				   processInstanceId={processInstanceId }
				   billid={id}//新加的
                  businesskey={businesskey}//新加的
				   refresh={this.searchById.bind(this, id)}//这个是传入自己的页面中查单据数据的方法，有参数这样写
				/> }

					<Row>
						<Col  md={12}   xs={12}   sm={12} >
							<Affix offsetTop={0} style={{ zIndex: 8000}} >
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

									{isApprove ? '': 
			 						<div className="tab-header-right">
			 							<Button size="sm" colors="info" 
			 									onClick={this.handleEdit} 
			 									style={{ marginRight: 5}}>修改</Button>
			 							<Button size="sm" style={{ marginRight: 5}} onClick={ this.handleDelete} >删除</Button>
			 							<Button size="sm" style={{ marginRight: 5}} onClick={ this.handleChange } >变更</Button>
			 							<Dropdown
							                    trigger={['hover']}
							                    overlay={ moreItems }
							                    animation="slide-up"
							                    onVisibleChange={ this.onVisibleChange } 
							                    >
						                    <Button size="sm" className="" >更多</Button>
						                </Dropdown>
			 						</div>}
			 					</div>
			 				</Affix> 
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
													<div className="value-display" >  {this.state.assureInfo.debtcurrencyid.display}</div>
												</Col>
											</Col>
											<Col md={6} xs={6} sm={6} >
												<Col mdOffset={2} xsOffset={2} smOffset={2} md={3} xs={3} sm={3} >
													<div className='label-display'>债务金额：</div>
												</Col>
												<Col md={6} xs={6} sm={6} >
													<div className="value-display" >{ this.formatAcuracy(this.state.assureInfo.pridebtamount)}</div>
												</Col>
											</Col>
										</Col>
										<Col md={12} xs={12} sm={12} >
											<Col md={6} xs={6} sm={6} >
												<Col mdOffset={5} xsOffset={5} smOffset={5} md={3} xs={3} sm={3} >
													<div className='label-display'>债务本币汇率：</div>
												</Col>
												<Col md={3} xs={3} sm={3} >
													<div className='value-display' >{ this.formatAcuracy(this.state.assureInfo.olcdebtrate)}</div>
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
														<div className= 'value-display' >{ this.formatAcuracy(this.state.assureInfo.guaamount)}</div>
													</Col>
												</Col>
											</Col>
											<Col md={12} xs={12} sm={12} >
												<Col md={6} xs={6} sm={6} >
													<Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
														<div className='label-display'>担保本币汇率：</div>
													</Col>
													<Col md={3} xs={3} sm={3} >
														<div className= 'value-display' >{ this.formatAcuracy(this.state.assureInfo.guaolcrate)}</div>
													</Col>
												</Col>
												<Col md={6} xs={6} sm={6} >
													<Col mdOffset={2} xsOffset={2} smOffset={2}  md={3} xs={3} sm={3} >
														<div className='label-display'>担保本币金额：</div>
													</Col>
													<Col md={3} xs={3} sm={3} >
														<div className= 'value-display' >{ this.formatAcuracy(this.state.assureInfo.gualcamount)}</div>
													</Col>
												</Col>
											</Col>
											<Col md={12} xs={12} sm={12} >
												<Col md={6} xs={6} sm={6} >
													<Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
														<div className='label-display'>已用担保金额：</div>
													</Col>
													<Col md={3} xs={3} sm={3} >
														<div className= 'value-display' >{ this.formatAcuracy(this.state.assureInfo.usedamount)}</div>
													</Col>
												</Col>
												<Col md={6} xs={6} sm={6} >
													<Col mdOffset={2} xsOffset={2} smOffset={2}  md={3} xs={3} sm={3} >
														<div className='label-display'>可用担保金额：</div>
													</Col>
													<Col md={3} xs={3} sm={3} >
														<div className= 'value-display' >{ this.formatAcuracy(this.state.assureInfo.avaamount)}</div>
													</Col>
												</Col>
											</Col>
											{this.state.assureInfo.moramount.value?<Col md={12} xs={12} sm={12} >
												<Col md={6} xs={6} sm={6} >
													<Col mdOffset={5} xsOffset={5} smOffset={5}  md={3} xs={3} sm={3} >
														<div className='label-display'>本次抵押总金额：</div>
													</Col>
													<Col md={3} xs={3} sm={3} >
														<div className= 'value-display' >{ this.formatAcuracy(this.state.assureInfo.moramount)}</div>
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
														<div className= 'value-display' >{busistatusMap[this.state.assureInfo.busistatus.value]||'' }</div>
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
			        </Row>
 					 <MsgModal show={ this.state.showModal }

					    title='是否删除合同?'
					    icon='icon-tishianniuzhuyi'
					    content={`请确定是否要删除本合约!`}

					    onCancel={() => { this.setState({
					    	showModal: false
					    });}}
					    onConfirm={this.delRow}/> 
					<Loading fullScreen showBackDrop={ true } show={ this.state.isLoading } />
	            </div>
		    </div>
	}
}