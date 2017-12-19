/**
 * 融资申请
 * yanggqm
 * 2017/11/20
 * 注意：
 * 		1、表单中数字 传给后台是数字 返回是字符串
 * 		2、起始日期是今日 结束日期为空
 * 		3、单位银行账户 限制条件为：组织id、币种、活期
 */

// react组件
import React, { Component } from 'react';
import {hashHistory} from 'react-router';
import {Link} from 'mirrorx'

// iuap 组件
import {
	Row,
	Col,
	Label,
	Radio,
	Icon,
	Button,
	Timeline,
	Step,
	Select,
	Popconfirm,
	Modal
} from 'tinper-bee';
import Affix from 'bee-affix';
import Form from 'bee-form';
import Switch from 'bee-switch';
import DatePicker from 'bee-datepicker';
import FormControl from 'bee-form-control';
import Table from 'bee-table';
import Loading from "bee-loading";
import zhCN from 'rc-calendar/lib/locale/zh_CN';

// 第三方公共库或者工具
import classNames from 'classnames';
import moment from 'moment';
import axios from "axios";
import jump from 'jump.js';

// 全局公共utils方法
import deepClone from '../../../../utils/deepClone.js';
import {toast} from '../../../../utils/utils';

// 自定义组件
import ReferItem from './ReferItem.js';
import Refer from '../../../../containers/Refer';
import InputItem from './InputItem.js';
import TextareaItem from './TextareaItem';
import LightTabs from './LightTabs';
import BreadCrumbs from '../../../../containers/BreadCrumbs';
import TmcUploader from '../../../../containers/TmcUploader';
import DeleteModal from '../../../../containers/DeleteModal';

// 样式类
import './index.less';
import 'bee-form/build/Form.css';

// iuap控件实例
const FormItem = Form.FormItem;
const Option = Select.Option;


// 个人项目配置
const CONFIG = {
	// 锚节点
	ANCHOR : {
		values: ['申请信息', '其他信息'], // 锚节点的引导文字
		width: 98 // 锚节点tab的宽度
	},
	// 滚动条滚动设置
	JUMP_CONFIG : {
		offset: 50, // 50为悬浮高度
		duration: 300 // 滚动duration配置
	},
	// 是否开启MySQL数据库一个汉字等于两个字节长度
	OPEN_DOUBLE : false,
	// 页面中日期插件的格式化规则
	FORMAT : 'YYYY-MM-DD',
	// 页面相关服务接口
	SERVICE : {
		save: window.reqURL.fm + 'fm/apply/save', // 后台保存 修改接口
		find: window.reqURL.fm + 'fm/apply/findByPk', // 根据id返回 查询接口
	},
	// 时间moment ---> String 开关
	DATE_HASH : {
		begindate: true,
		enddate: true
	},
	// 页面中枚举的map  默认  1、申请待提交  2、待提交
	DISPLAY_MAP: {
		contstatus: ['申请待审批', '申请已审批', '合约待审批', '合约已审批', '合约在执行', '合约已结束', '申请待提交', '合约待提交'], // 合约状态
		vbillstatus: ['待提交', '审批通过', '审批中', '待审批'] // 审批状态
	},
	// TODO 后期移除 用户所在的组织或公司名称(需要调用接口)
	DEFAULT_ORG: '用友网络科技有限公司',
	// 担保方式的枚举 value类型：String
	GUARANTEE: [
		{label: '信用', value: '1'},
		{label: '保证', value: '0'},
		{label: '保证金', value: '2'},
		{label: '抵押', value: '3'},
		{label: '质押', value: '4'},
		{label: '混合', value: '5'}
	],
	// TODO 精度一期固定为2 银团中的金额和比例精度没做单独处理
	SCALE: 2,
	// 银团贷款校验文案
	DRCHECK_INFO_MAP : {
		'0': '银行组织不能为空',
		'1': '银行组织一级名称不能相同',
		'2': '约定比例每项须为0-100数字',
		'3': '实际比例每项须为0-100数字',
		'4': '约定比例之和应为100',
		'5': '实际比例之和应为100',
		'6': '约定贷款金额之和应等于申请金额',
		'7': '实际贷款金额之和应等于申请金额',
	}
}

// 银团贷款默认一个代理行和一个参与行（初始化数据）
let apply_syndicatedinfo_values = [
	{
		"rowId": "0",
		"status": 1,
		"values": {
			"practiceratio":{
		        "display": '',
		        "scale":2,
		        "value": ''
		    },
		    "finanparticipate":{
		        "display":"",
		        "scale":2,
		        "value":""
		    },
		    "financagency":{
		        "display":"",
		        "scale":2,
		        "value":""
		    },
		    "confinancmny":{
		        "display":'',
		        "scale":2,
		        "value":""
		    },
		    "practicefinancmny":{
		        "display":'',
		        "scale":2,
		        "value":""
		    },
		    "conratio":{
		        "display":'',
		        "scale":2,
		        "value":""
		    },
		    "id":{
		        "display":null,
		        "scale":-1,
		        "value":null
		    },
		    "ts":{
		        "display":null,
		        "scale":-1,
		        "value":null
		    },
		    "dr":{
		        "display":null,
		        "scale":-1,
		        "value":0
		    }
		}
	},
	{
		"rowId": "1",
		"status": 1,
		"values": {
			"practiceratio":{
		        "display": '',
		        "scale":2,
		        "value": ''
		    },
		    "finanparticipate":{
		        "display":"",
		        "scale":2,
		        "value":""
		    },
		    "financagency":{
		        "display":"",
		        "scale":2,
		        "value":""
		    },
		    "confinancmny":{
		        "display":'',
		        "scale":2,
		        "value":""
		    },
		    "practicefinancmny":{
		        "display":'',
		        "scale":2,
		        "value":""
		    },
		    "conratio":{
		        "display":'',
		        "scale":2,
		        "value":""
		    },
		    "id":{
		        "display":null,
		        "scale":-1,
		        "value":null
		    },
		    "ts":{
		        "display":null,
		        "scale":-1,
		        "value":null
		    },
		    "dr":{
		        "display":null,
		        "scale":-1,
		        "value":0
		    }
		}
	}
]

// 银团贷款默认一个代理行和一个参与行（tab的data）
let apply_syndicatedinfo_arr = [
    {
    	key: 0,
    	id: null,
    	ts: null,
    	dr: {
    		value: 0
    	},
    	content: {
    		display: '',
    		scale: -1,
    		value: ''
    	},
    	conratio: '',
    	confinancmny: '',
    	practiceratio: '',
    	practicefinancmny: '',
    },
    {
    	key: 1,
    	id: null,
    	ts: null,
    	dr: {
    		value: 0
    	},
    	content: {
			display: '',
			scale: -1,
			value: ''
		},
    	conratio: '',
    	confinancmny: '',
    	practiceratio: '',
    	practicefinancmny: '',
    }
]

// 回显默认授信数据（初始化）
let apply_creditinfo_values = [
	{
		"rowId": "0",
		"status": 1,
		"values": {
			"bankprotocolid":{
		        "display": '',
		        "scale":-1,
		        "value": ''
		    },
		    "cccurrtypeid":{
		        "display":"",
		        "scale":-1,
		        "value":""
		    },
		    "cctypeid":{
		        "display":"",
		        "scale":-1,
		        "value":""
		    },
		    "ccamount":{
		        "display":'',
		        "scale":-1,
		        "value":""
		    },
		    "id":{
		        "display":null,
		        "scale":-1,
		        "value":null
		    },
		    "ts":{
		        "display":null,
		        "scale":-1,
		        "value":null
		    },
		    "dr":{
		        "display":null,
		        "scale":-1,
		        "value":0
		    }
		}
	}
]

// 授信协议默认数据（tab的data）
let apply_creditinfo_arr = [
	{
		key: 0,
		id: null,
		ts: null,
		dr: {
			value: 0
		},
		bankprotocolid: {
			display: '',
			value: ''
		},
		cccurrtypeid:{
	        display: '',
	        value: ''
	    },
	    cctypeid:{
	        display: '',
	        value: ''
	    },
	    ccamount: ''
	}
]

// 前后端交互统一格式框架
var dataSource = {
	"data": {
		"apply_baseinfo": {
			"pageInfo": null,
			"rows": [
				{
					"rowId": "0",
					"status": 1,
					"values": {}
				}
			]
		},
		"apply_syndicatedinfo": {
			"pageInfo": null,
			"rows": [
			]
		},
		"apply_authinfobiz": {
			"pageInfo": null,
			"rows": [
			]
		}
	},
	"message": null,
	"success": true
};


// 定义类 ApplyCard
export default class ApplyCard extends Component {
	constructor(){
    	super();

    	this.state = {
    		formId: null, // 主表id
    		ts: null, // 主表ts
    		distance: 0, // tabBar移动距离
            isClicked: false, // tab锚点点击标志位
            chooseIndex: 0, // tab锚点点击序号
            loadingShow: false,
            checkFormNow: false,
            formDataRrr: [],
            formDataObj: {
            	contractcode: {
            		value: ''
            	}, // 申请单号
            	financorg: {
            		value: CONFIG.DEFAULT_ORG
            	}, // 融资单位
            	transacttype: {}, // 交易类型
            	fininstitutionid: {}, // 金融机构
            	projectid: {}, // 项目
				fmuseway: {}, // 资金用途
				currtypeid: {
					value: ''
				}, // 币种
				applymny: {
					value: 0
				}, // 申请金额
				guaranteetype: {
					value: '1'
				}, // 担保方式
				contstatus: {
					value: 6
				}, // 合约状态
				begindate: {
					value: moment()
				}, // 起始时间
				enddate: {
					value: ''
				}, // 结束时间
				rateid: {}, // 利率
				returnmode: {}, // 还款方式
				iadate: {}, // 结息日
				bankaccbasid: {}, // 单位账户
				iscreditcc: { // true代表的是关闭授信
					value: true
				}, // 放款占用授信
				vbillstatus: {
					value: 0
				}, // 审批状态
            },
            iadate: false,
            dataRanks: deepClone(apply_syndicatedinfo_arr),
		    dataCredit: deepClone(apply_creditinfo_arr),
		    isTransacttype: false,
		    isCreditcc: false,
		    tabsActiveKey: null,
		    count: 102,
		    count2: 1000,
		    showModal: false,
            orderNum: '',
            orderTime: '',
            activeKey: "1",
            start: 0,
            otherInfo: [],
            deleteYinTuanItem: [], // 删除银团的条目，加载数据前需要清空
            deleteShouXinItem: [],
            DownTime: 5, // 倒计时
            rate: 0,
            breadcrumbItem: [
            	{ href: '#', title: '首页' },
            	{ title: '融资申请' },
            	{ title: '贷款申请' },
            	{ title: '贷款申请' }
            ],
            RanksCheckInfo: ''
    	}

	    this.columnsRank = [
	    	{
	    		title: "银行类别",
	    		dataIndex: "type",
	    		key: "type",
	    		render: (text, record, index) => {
	    			return index > 0
	    		 			? <span>参与行</span>
	    		 			: <span>代理行</span>
	    		}

	    	},
	    	{
	    		title: "银行组织",
	    		dataIndex: "content",
	    		key: "content",
	    		render: (text, record, index) => (
            		<ReferItem
            		    name='content'
            		    code="finbranchRef"
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
            		    data={text}
            		    onChange={this.handleReferChange.bind(this, 'dataRanks', index, 'content')}
            		/>
	    		)
	    	},
	    	{
	    		title: "约定比例 %",
	    		dataIndex: "conratio",
	    		key: "conratio",
	    		render: (text, record, index) => (
				    <InputItem
	            		value={text}
            	      	onChange={(val)=>{
                            this.handleInputChange('dataRanks', "conratio", val, index, 'confinancmny', 'prev')
                        }}
            		/>
	    	  	)
	    	},
	    	{
	    	  title: "约定贷款金额",
	    	  dataIndex: "confinancmny",
	    	  key: "confinancmny",
	    	  render: (text, record, index) => {
	    	    return (
			       	<InputItem
	            		value={text}
	            		used={'money'}
	            		max={+this.getNumber(this.state.formDataObj.applymny.value)}
	            		pos={'left'}
	            		onChange={(val)=>{
	            			this.handleInputChange('dataRanks', "confinancmny", val, index, 'conratio', 'next')
            	      	}}
            		/>
	    	    );
	    	  }
	    	},
	    	{
	    		title: "实际比例 %",
	    		dataIndex: "practiceratio",
	    		key: "practiceratio",
	    		render: (text, record, index) => {
	    			return (
					    <InputItem
	        				value={text}
	        				onChange={(val)=>{
	        					this.handleInputChange('dataRanks', "practiceratio", val, index, 'practicefinancmny', 'prev')
            		    	}}
            			/>
	    			);
	    		}
	    	},
	    	{
	    		title: "实际贷款金额",
	    		dataIndex: "practicefinancmny",
	    		key: "practicefinancmny",
	    		render: (text, record, index) => {
	    			return (
					  	<InputItem
	        				value={text}
	        				used={'money'}
	        				pos={'left'}
	        				max={+this.getNumber(this.state.formDataObj.applymny.value)}
	        				onChange={(val)=>{
	        					this.handleInputChange('dataRanks', "practicefinancmny", val, index, 'practiceratio', 'next')
            		    	}}
            			/>
	    			);
	    		}
	    	},
	    	{
	    		title: "操作",
	    		dataIndex: "operation",
	    		key: "operation",
	    		render: (text, record, index) => {
	    		  	return index > 1
		    		  	?  	(<DeleteModal onConfirm={this.handleDeleteItem.bind(this, text, record, index, 'dataRanks')}/>)
						: 	<span></span>
	    		}
	    	}
	    ];

	    this.columnsCredit = [
	    	{
	    		title: "授信协议",
	    		dataIndex: "bankprotocolid",
	    		key: "bankprotocolid",
	    		render: (text, record, index) => (
	    			<Refer
                		name="bankprotocolid"
			            // refCode={"creditref"}
			            // refModelUrl={'/fm/creditref/'}
			            refCode={"currencyRef"}
		    	   		refModelUrl={'/bd/currencyRef/'}
			            value={{
			                refname: text.display || '',
			              	refpk: text.value || ''
			            }}
			            multiLevelMenu={[
			            	{
			            		name: [ '编码' ], 
			            		code: [ 'refcode' ]
			            	}
			            ]}
			            onChange={this.handleReferChange.bind(this, 'dataCredit', index, 'bankprotocolid')}
                	/>
	    		)

	    	},
	    	{
	    		title: "授信币种",
	    		dataIndex: "cccurrtypeid",
	    		key: "cccurrtypeid",
	    		render: (text, record, index) => (
	    			<Refer
            		name="cccurrtypeid"
					type="customer"
		    	   		refCode={"currencyRef"}
		    	   		refModelUrl={'/bd/currencyRef/'}
		    	   		value={{
		    	   		    refname: text.display || '',
		    	   		  	refpk: text.value || ''
		    	   		}}
		    	   		onChange={this.handleReferChange.bind(this, 'dataCredit', index, 'cccurrtypeid')}
            	/>
	    		)
	    	},
	    	{
	    		title: "授信类别",
	    		dataIndex: "cctypeid",
	    		key: "cctypeid",
	    		render: (text, record, index) => {
	    			return (
	        			<Refer
	        				name="cctypeid"
							refModelUrl={'/bd/cctypeRef/'}
							refCode={'cctypeRef'}
							value={{
				                refname: text.display || '',
				              	refpk: text.value || ''
				            }}
				            onChange={this.handleReferChange.bind(this, 'dataCredit', index, 'cctypeid')}
						/>
	    			);
	    		}
	    	},
	    	{
	    		title: "占用授信金额",
	    		dataIndex: "ccamount",
	    		key: "ccamount",
	    		render: (text, record, index) => (
				    <InputItem
        				value={text}
        				used={'money'}
        				pos={'left'}
        				onChange={(val)=>{
        					this.handleInputChange('dataCredit', 'ccamount', val, index)
        		    	}}
        			/>
	    		)
	    	},
	    	{
	    		title: "操作",
	    		dataIndex: "operation",
	    		key: "operation",
	    		render: (text, record, index) => {
	    	    	return index > 0
	    	    		?  (<DeleteModal onConfirm={this.handleDeleteItem.bind(this, text, record, index, 'dataCredit')} />)
						: <span></span>
	    	  }
	    	}
	    ];

		this.countTime = null;

		this.tempRanks = [];

		this.tempCredit = [];

		this.iadateFlag = false;

		this.operType = 'add';
	}

	componentWillMount() {
		this.operType = this.props.location.query.type || 'add';
		this.state.formId = this.props.location.query.id || null;
 		if (this.state.formId && this.operType === 'edit') {
 			this.setState({
				loadingShow: true
			},() => {
				this.getFormDataById(this.state.formId);
			})
 		}else if(this.operType === 'add') {
 			this.renderTemplate(this.state.formDataObj , this.state.dataRanks, this.state.dataCredit)
 		}
 	}

	componentDidMount () {
		this.addListenerScroll()
	}

	componentWillUnmount () {
		this.clearCount();
		this.removeListenerScroll();
	}

	clearCount = () => {
		this.countTime && clearInterval(this.countTime);
		this.countTime = null;
		this.state.DownTime = 5;
	}

	closeModal = () => {
		this.clearCount();
        this.setState({
            showModal: false
        });
    }

	getFormDataById = (id) => {
		var _this = this;
	    axios.post(CONFIG.SERVICE.find, {id})
	    .then(function(res) {
	    	let {data, success} = res.data;
	    	if(success) {
	    		_this.setState({
					loadingShow: false
				},() => {
					_this.nextEdit(data) // 得到数据 进行回显
				})
	    	}else{
	    		toast({size: 'mds', color: 'danger', content: '数据获取出错！，请联系相关人员'})
	    	}
	    }).catch(function(error) {
	        toast({size: 'sms', color: 'danger', content: '服务器出错！', title: '请求提示！'})
		});
	}

	// 滚动条主动滚动事件
	scrollEvent = () => {
		let index = this.getItemIndex();
		this.setScrollBar(index)
	}

	handleAddRank = () => {
		// TODO count ++ 出错 不应该是2 修改的时候不是2 新增的时候是2
		this.state.count++;
		this.setState({
			dataRanks: [...this.state.dataRanks,
		        {
			    	key: this.state.count,
			    	id: null,
			    	ts: null,
			    	dr: {
			    		value: 0
			    	},
			    	content: {
			    		display: '',
			    		scale: -1,
			    		value: ''
			    	},
			    	conratio: '',
			    	confinancmny: '',
			    	practiceratio: '',
			    	practicefinancmny: '',
			    }
			]
		})
	}

	handleAddShouXin = () => {
		this.state.count2++;
		this.setState({
			dataCredit: [...this.state.dataCredit,
				{
					key: this.state.count2,
					id: null,
					ts: null,
					dr: {
						value: 0
					},
					bankprotocolid: {
						display: '',
						value: ''
					},
					cccurrtypeid:{
				        display: '',
				        value: ''
				    },
				    cctypeid:{
				        display: '',
				        value: ''
				    },
				    ccamount: ''
				}
			]
		})
	}

	mapTrans = (num, type) => {
		return (CONFIG.DISPLAY_MAP[type][num])
	}

	transToFiexd = (number, n) => {
		number = number.toString()
		if(number) { // number === 0 那么false 走else语法
			number = Math.round(number * Math.pow(10, n))/ Math.pow(10, n);
			if(`${number}`.indexOf(".") == -1){
				number = number + ".";
				for (let i = 1; i <= n; i++) {
					number = number + "0";
				}
			}
			let numberInt = `${number}`.split('.')[0];
			let re = /(-?\d+)(\d{3})/;
			while(re.test(numberInt)){
				numberInt = numberInt.replace(re,"$1,$2")
			}
			return `${numberInt}.${number.toString().split('.')[1]}`;
		}else {
			return 0
		}
	}

	getNumber = (num) => {
		return (num.toString().replace(/\$|\,/g,''));
	}

	formatRanks = (temp) => {
		this.tempRanks = temp.map((item, index) => {
			return {
				key: index,
				id: item.values.id.value,
				ts: item.values.ts && item.values.ts.value,
				dr: item.values.dr && item.values.dr.value || 0,
				content: item.values.financagency.value ? item.values.financagency : item.values.finanparticipate, //代理行value空 -> 参与行
				conratio: this.transToFiexd(item.values.conratio.value, CONFIG.SCALE),
	        	confinancmny: this.transToFiexd(item.values.confinancmny.value, CONFIG.SCALE),
	        	practiceratio: this.transToFiexd(item.values.practiceratio.value, CONFIG.SCALE),
	        	practicefinancmny: this.transToFiexd(item.values.practicefinancmny.value, CONFIG.SCALE)
			}
		})
	}

	formatCredit = (temp) => {
		this.tempCredit = temp.map((item, index) => {
			return {
				key: index,
				id: item.values.id.value,
				ts: item.values.ts && item.values.ts.value,
				dr: item.values.dr && item.values.dr.value,
				bankprotocolid: item.values.bankprotocolid,
	        	cccurrtypeid: item.values.cccurrtypeid,
	        	cctypeid: item.values.cctypeid,
	        	ccamount: this.transToFiexd(item.values.ccamount.value, CONFIG.SCALE)
			}
		})
	}

	nextEdit = (data) => {
		let temp = data.apply_baseinfo.rows[0].values;
		this.iadateFlag = temp.iadate.display === '暂无'
		temp.applymny.value = this.transToFiexd(temp.applymny.value, CONFIG.SCALE);
		temp.begindate.value = moment(temp.begindate.value)
		temp.enddate.value = moment(temp.enddate.value)
		let temp2 = (data.apply_syndicatedinfo && data.apply_syndicatedinfo.rows) || [...apply_syndicatedinfo_values]
		let temp3 = (data.apply_authinfobiz && data.apply_authinfobiz.rows) || [...apply_creditinfo_values]
		this.formatRanks(temp2);
		this.formatCredit(temp3);

		this.renderTemplate(temp, this.tempRanks, this.tempCredit)
	}

	renderTemplate = (temp, tempRanks, tempCredit) => {
		this.setState({
			iadate: this.iadateFlag,
			formDataObj: temp,
			formId: temp.id && temp.id.value,
			ts: temp.ts && temp.ts.value,
			dataRanks : tempRanks,
			dataCredit: tempCredit
		},() => {
			let iscreditccFlag = !temp.iscreditcc.value,
				transacttypeFlag = temp.transacttype.display &&  (temp.transacttype.display === '银团贷款');
			setTimeout(() => {
				this.tagChange('iscreditcc', iscreditccFlag)
				this.tagChange('transacttype', transacttypeFlag)
			}, 0)
		})
	}

	// 获得区域的序号
	getItemIndex = () => {
		let scrollTop = this.getScrollTop(),
			firstTop = this.refs.anchor1.offsetTop,
			fixedTop = scrollTop  + CONFIG.JUMP_CONFIG.offset;
		let [heightPrev, heightNext] = new Array(2).fill(0);
		const LEN = CONFIG.ANCHOR.values.length;

		for(let i = 0; i < LEN; i++) {
			heightPrev = this.refs[`anchor${(i + 1)}`].offsetTop;
			heightNext = (i <= LEN - 2) ? this.refs[`anchor${(i + 2)}`].offsetTop : null;

			if(fixedTop <= firstTop) {
				return 0;
			}
			if(heightPrev <= fixedTop && (heightNext && heightNext > fixedTop)) {
				return i;
			}else if(!heightNext) {
				return (LEN - 1)
			}
		}
	}

	// 获取滚动条位置
	getScrollTop = () => {
		return document.body.scrollTop || document.documentElement.scrollTop
	}

	// 监听滚动
	addListenerScroll = () => {
		window.addEventListener('scroll', this.scrollEventDo ,false)
	}

	// 取消监听滚动
	removeListenerScroll = () => {
		window.removeEventListener('scroll', this.scrollEventDo, false)
	}

	// 执行滚动事件
	scrollEventDo = () => {
		if(!this.state.isClicked) {
			this.scrollEvent()
		}
	}

	// 点击滚动到位置
	scrollToDis = (e) => {
		let text = e.target.innerHTML;
		this.state.isClicked = true;
		if(!text) {
			return;
		}
		let index = CONFIG.ANCHOR.values.findIndex(value => value == text)
		if(index >= 0){
			this.setScrollBar(index)
			this.scrollToAnchor(index)
		}
	}

    // 滚动条滚到指定区域
	scrollToAnchor = (index) => {
		let ele = this.refs[`anchor${index + 1}`]
		let _this = this;
		jump(ele, {
			duration: CONFIG.JUMP_CONFIG.duration,
			offset: - CONFIG.JUMP_CONFIG.offset,
			callback: () => {
				_this.state.isClicked = false;
			}
		})
	}

	// 设置tab中tabBar位置
	setScrollBar = (index) => {
		let distance = parseInt(index * CONFIG.ANCHOR.width);
		this.setState({
			distance,
			chooseIndex: index
		})
	}

	// 删除操作
	handleDeleteItem = (text, record, one, type) => {
		var _this = this;
		let id = record.id,
			dr = record.dr
		if(id && (dr == 0)){
			record.dr = 1
			// 把这条删除标记过的数据放到数组中
			if(type === 'dataRanks') {
				this.state.deleteYinTuanItem.push(record)
			}else if(type === 'dataCredit') {
				this.state.deleteShouXinItem.push(record)
			}
		}
		this.setState(preState => ({
			[type]: preState[type].filter((item, index) => index != one)
		}))
	}

	// 其他区域 点击tab
	changeKey = (tabsActiveKey) => {
		this.setState({
			tabsActiveKey
		})
	}

	// 字符长度校验
	checkRule = (name, val) => {
		const name_arr = [
			{
				name: 'contractcode',
				max: 40
			},{
				name: 'financorg',
				max: 36
			}]
		name_arr.forEach(item => {
			if(item.name.indexOf(name) !== -1) {
				return this.maxLenTest(val, item.max)
			}
		})
	}

	// openDouble 是否开启汉字算两个字节长度
	maxLenTest = (str, max, mix = 1, openDouble = CONFIG.OPEN_DOUBLE) => {
		str = str.toString()
		let len = openDouble ? str.length : str.replace(/[^\x00-\xff]/g, '**').length
		return (len >= mix && len <= max)
	}

	handleSave = () => {
		this.setState({
    		checkFormNow: true
    	})
	}

	submitcheckForm = (flag) => {
		this.setState({
    		checkFormNow: false
    	})
    	var ranksFlag = true;
    	let isNameSelected = this.state.otherInfo.indexOf('transacttype') !== -1;
    	if(isNameSelected) {
    		const DRCheck = {
	    		content: [],
	    		conratio: [],
	    		practiceratio: [],
	    		confinancmny: [],
	    		practicefinancmny: []
	    	};

	    	this.state.dataRanks.forEach((item, index) => {
	    		// item为每个对象  key为每个对象的键
	    		for(let key in item) {
	    			if(typeof(DRCheck[key]) === 'object') {
	    				if(key === 'content') {
	    					DRCheck[key].push(item[key].display)
	    				}else {
	    					DRCheck[key].push(+this.getNumber(item[key]))
	    				}
	    			}
	    		}
	    	})
	    	for(let key in DRCheck) {
	    		if(this._getEqual(key, 'content', DRCheck['content'], '', '0', ranksFlag)) {
	    			return;
	    		};
	    		if(key === 'content') {
	    			let contentCheckZero =  this._arrRepeat(DRCheck[key])
	    			if(contentCheckZero) {
	    				this.state.RanksCheckInfo = CONFIG.DRCHECK_INFO_MAP['1']
	    				ranksFlag = false;
	    				return;
	    			}
	    		}
	    		if(this._getEqual(key, 'conratio', DRCheck['conratio'], 0, '2', ranksFlag)) {
	    			return;
	    		};
	    		if(this._getEqual(key, 'practiceratio', DRCheck['practiceratio'], 0, '3', ranksFlag)) {
	    			return;
	    		};
	    		if(this._getPlusCon(key, 'conratio', DRCheck['conratio'], 100, '4', ranksFlag)) {
	    			return;
	    		};
	    		if(this._getPlusCon(key, 'practiceratio', DRCheck['practiceratio'], 100, '5', ranksFlag)) {
	    			return;
	    		};
	    		if(this._getPlusCon(key, 'confinancmny', DRCheck['confinancmny'], +this.getNumber(this.state.formDataObj.applymny.value), '6', ranksFlag)) {
	    			return;
	    		};
	    		if(this._getPlusCon(key, 'practicefinancmny', DRCheck['practicefinancmny'], +this.getNumber(this.state.formDataObj.applymny.value), '7', ranksFlag)) {
	    			return;
	    		};
	    		this.state.RanksCheckInfo = ''; ranksFlag = true;
	    	}
    	}

    	this.setState({},() => {
    		if(flag && ranksFlag){
	    		this.canDoSave();
	    	}
    	});
    }

    _getPlusCon = (key, name, arr, consequese, mapIndex, ranksFlag) => {
    	// console.log(key, name, arr, consequese, mapIndex, ranksFlag)
    	// 1个等于走    不等于 直接false  等于且和不等于
    	if(key === name) {
			let checkPlas = arr.reduce((prev, curr) => {
				return prev + curr
			})
			if(checkPlas != consequese) {  // 报错 应该返回true
				this.state.RanksCheckInfo = CONFIG.DRCHECK_INFO_MAP[mapIndex]
				ranksFlag = false;
				return true;
			}else {
				return false;
			}
		}
		return false;
    }

    _getEqual = (key, name, arr, consequese, mapIndex, ranksFlag) => {
    	if(key === name) {
			let checkZero = arr.some(item => {
				return item == consequese
			})
			if(checkZero) {
				this.state.RanksCheckInfo = CONFIG.DRCHECK_INFO_MAP[mapIndex]
				ranksFlag = false;
				return true;
			}else {
				return false;
			}
		}
		return false;
    }

    _arrRepeat = (arr) => {
	    var arrStr = JSON.stringify(arr);
	    for (var i = 0; i < arr.length; i++) {
	        if ((arrStr.match(new RegExp('"'+arr[i]+'"',"g")).length)>1){
	            return true;
	        }
	    };
	    return false;
	}

	// 保存功能
    canDoSave = () => {
    	let {formDataObj, dataRanks, dataCredit} = this.state;
        let formmatHeadData = this.formatDataTime(this.formatDataAllKeys(formDataObj))
        let formmatBodyData = this.formatDataYinTuan(this.pushDeleteYiTuan(dataRanks))
        let formmatFootData = this.formatDataYinTuan(this.pushDeleteShouXin(dataCredit))

        // 把头部数据 和 尾部数据 添加到dataSource中
		dataSource.data.apply_baseinfo.rows[0].values = formmatHeadData;
		dataSource.data.apply_syndicatedinfo.rows = formmatBodyData;
		dataSource.data.apply_authinfobiz.rows = formmatFootData

		if(this.state.formId) {
			dataSource.data.apply_baseinfo.rows[0].values.id = {
				display: null,
				scale: 2,
				value: this.state.formId || null,
			}
			dataSource.data.apply_baseinfo.rows[0].values.ts = {
				display: null,
				scale: 2,
				value: this.state.ts || null,
			}
		}
		this.doSave(dataSource)
    }

    // 给传入数据 补全 display 和 scale属性
    formatDataAllKeys = (obj) => {
    	let tempObj = {}
    	Object.keys(obj).map(item => {
    		var objDefault = {
    			value: '',
    			display: '',
    			scale: -1
    		}
    		tempObj[item] = Object.assign({}, objDefault, obj[item])
    	})
    	return tempObj;
    }

    // 处理时间格式
    formatDataTime = (obj) => {
    	let formDataRrr = {...obj}
    	for(var item in formDataRrr) {
    		if(CONFIG.DATE_HASH[item] && typeof(formDataRrr[item].value) != "string" && formDataRrr[item].value != ""){
				formDataRrr[item].value = formDataRrr[item].value.format(CONFIG.FORMAT)
			}
			if(item === 'applymny') {
				formDataRrr['applymny'].value = +this.getNumber(formDataRrr['applymny'].value)
			}
    	}
		return formDataRrr;
    }

    // 处理银团贷款数据 TODO 第一条是银团 当编辑时候的位置处理？？(---后台做了排序 第一条是代理行---READY)
    formatDataYinTuan = (arr) => {
    	const display_arr = ['content', 'bankprotocolid', 'cccurrtypeid', 'cctypeid'];
    	const value_arr = ['ts', 'id'];
    	return arr.map((item, index) => {
    		// item 为每个{}对象 key为{}中的每个key item[key]为value或者对象
    		let obj = {
    			rowId: '0',
    			status: 1,
    			values: {}
    		}
    		for(let key in item) {
    			let mapKey;
    			if(key === 'content' && index == 0){
    				mapKey = 'financagency'
    			}else if(key === 'content' && index >= 0) {
    				mapKey = 'finanparticipate'
    			}else {
    				mapKey = key
    			}
    			let isDisplay = display_arr.indexOf(key) > -1 ;
    			let isValue = value_arr.indexOf(key) > -1 ;
    			obj.values[mapKey] = {
    				display: isDisplay ? item[key].display : '',
	    			scale:  isDisplay ? -1 : 2,
	    			value:  isDisplay ? item[key].value
	    				: (isValue ? item[key] : + this.getNumber(item[key]))
    			}
    		}
    		return obj;
		})
    }

    // 加入删除银团的标记数据  需要对比 arr
    pushDeleteYiTuan = (arr) => {
    	if(this.state.deleteYinTuanItem.length) {
    		arr = [...arr, ...this.state.deleteYinTuanItem]
    	}
    	return arr
    }

    pushDeleteShouXin = (arr) => {
    	if(this.state.deleteShouXinItem.length) {
    		arr = [...arr, ...this.state.deleteShouXinItem]
    	}
    	return arr
    }

   	// 取消按钮点击
    handClickCancel = () => {
    	this.clearCount();
    	hashHistory.push('fm/apply');
    }

    // 授信和银团
    tagChange = (name, flag) => {
        let isNameSelected = this.state.otherInfo.indexOf(name) !== -1; // isNameSelected:true 有 false 无
        if(flag && !isNameSelected) {
        	this.state.otherInfo.push(name)
        }else if(!flag && isNameSelected){
        	this.state.otherInfo = this.state.otherInfo.filter(item => item !== name)
        }

        let theOne = this.state.otherInfo[0]
        if(!theOne) { // 都没有那么 没高亮  没表格
        	this.setState({
        		tabsActiveKey: null,
        		isTransacttype: false,
        		isCreditcc: false
        	})
        }else { // 高亮当前 当前表格
        	this.setState({
        		tabsActiveKey: theOne,
        		isTransacttype: this.state.otherInfo.indexOf('transacttype') === -1 ? false : true,
        		isCreditcc: this.state.otherInfo.indexOf('iscreditcc') === -1 ? false : true
        	})
        }
    }

    changeData = (key, text, record, index, val, e) => {
    	// console.log(key, text, record, index, val, e)
    	let value = key === 'content' ? e.refpk : e.target.value
    	this.state.dataRanks[index][key] = value
    	this.setState({
    		text: this.state.dataRanks
    	})
    }

    // 继续编辑
    doSyndicated = (arr, type) => {
    	// arr是数组
    	if(!arr) {
    		return;
    	}
    	if(type === 'syndicatedinfo') {
    		this.formatRanks(arr)
	    	this.setState({
	    		dataRanks: this.tempRanks
	    	})
    	}else {
    		this.formatCredit(arr)
	    	this.setState({
	    		dataCredit: this.tempCredit
	    	})
    	}
    }

    // 保存 发请求
    doSave = (dataSource) => {
    	let _this = this;
    	// TODO
    	axios.post(CONFIG.SERVICE.save, dataSource)
	    .then(function(res) {
	    	let {success, data} = res.data;
	    	if(success) {
	    		let baseinfo = data.apply_baseinfo.rows[0].values
		    	let syndicatedinfo = data.apply_syndicatedinfo && data.apply_syndicatedinfo.rows; // 数组 或 undefined
		    	let apply_authinfobiz = data.apply_authinfobiz && data.apply_authinfobiz.rows; // 数组 或 undefined
		  		_this.setState({
		    		showModal: true,
		    		deleteYinTuanItem: [], // 清空删除标记数组 不用触发视图更新 可以写到setState外
		    		deleteShouXinItem: [],
		    		orderNum: baseinfo.contractcode && baseinfo.contractcode.value || '无单号',
					orderTime: baseinfo.applydate && baseinfo.applydate.value,
					formId : baseinfo.id && baseinfo.id.value,
					ts: baseinfo.ts && baseinfo.ts.value
		    	},() => {
		    		_this.countTimeFn()
		    	})

		    	// 银团贷款后台数据添加id值被回显 有银团才处理
		    	syndicatedinfo && _this.doSyndicated(syndicatedinfo, 'syndicatedinfo')
		    	apply_authinfobiz && _this.doSyndicated(apply_authinfobiz, 'apply_authinfobiz')
	    	}else {
	    		toast({size: 'mds', color: 'danger', content: '数据保存出错！，请联系相关人员'})
	    	}
	    })
	    .catch(function(error) {
	       toast({size: 'sms', color: 'danger', content: '服务器出错！', title: '请求提示！'})
	    });
    }

    // input 操作
    handleInputChange = (obj, key, val, index, type, pos) => {
    	console.log(obj, key, val, index, type, pos)
    	let preFormData = this.state[obj];
    	if(index >= 0) { // 银团贷款
    		preFormData[index][key] = val;
    		if(type && pos){
    			let consquence = 0;
    			if(pos == 'prev'){
    				// 计算规则还要排除最后一项 val求和大于等于100
    				consquence = this.transToFiexd((+this.getNumber(val) * (+this.getNumber(this.state.formDataObj.applymny.value)) / 100 || 0), CONFIG.SCALE)
    			}else if(pos == 'next') {
    				consquence = +this.transToFiexd((+this.getNumber(val) / (+this.getNumber(this.state.formDataObj.applymny.value)) * 100 || 0), CONFIG.SCALE)
    			}
    			preFormData[index][type] = consquence;
    		}
    	}else {
    		if(key === 'begindate' || key === 'enddate'){
    			val = moment(val)
    		}
    		preFormData[key].value = val
    	}
    	this.setState(preState => ({
    		[obj]: preFormData
    	}),() => {
    		let hasTransacttype = this.state.otherInfo.indexOf('transacttype') > -1
    		if(key === 'applymny' && hasTransacttype) {
    			this.tempRanks.forEach((item, index) => {
    				let val_conratio = item.conratio || 0,
    					val_practiceratio  = item.practiceratio || 0;
    				this.handleInputChange('dataRanks', "conratio", val_conratio, index, 'confinancmny', 'prev')
    				this.handleInputChange('dataRanks', "practiceratio", val_practiceratio, index, 'practicefinancmny', 'prev')
    			})
    		}else {
    			return false; // 跳出递归。
    		}
    	})
    	if(key === 'iscreditcc') {
    		this.tagChange(key, !val)
    	}
    	return;
    }

    DateSelect = (val) => {
    	// 选择起始日期会清空 ---利率---  ---借款单位账户---  ---结束日期---
    	this.state.formDataObj.enddate.value = ''
		this.state.formDataObj['rateid'].value = ''
		this.state.formDataObj['rateid'].display = ''
		this.state.formDataObj['bankaccbasid'].value = ''
		this.state.formDataObj['bankaccbasid'].display = ''
    	this.setState();
    }

    handleReferChange  = (obj, index = -1, key, v) => {
    	let val = {display: v.refname, value: v.refpk};
    	let preFormData = this.state[obj];
    	// console.log(preFormData, obj, index, key, v, val)
    	if(index >= 0) { // 银团贷款 和 授信
    		preFormData[index][key].value = val.value
    		preFormData[index][key].display = val.display
    	}else {
    		// 选择币种会清空 ---利率---  ---借款单位账户---
    		if(key === 'currtypeid') {
    			preFormData['rateid'].value = ''
    			preFormData['rateid'].display = ''
    			preFormData['bankaccbasid'].value = ''
    			preFormData['bankaccbasid'].display = ''
    		}
    		if(key === 'returnmode') {
    			let {repaycosttype, repayinteresttype} = v;
    			if(repaycosttype == '6' && repayinteresttype == '6') {
    				preFormData['iadate'].value = ''
    				preFormData['iadate'].display = '暂无'
    				this.iadateFlag = true;
    			}else {
    				this.iadateFlag = false;
    			}
    		}
    		preFormData[key].value = val.value
    		preFormData[key].display = val.display
    	}
    	this.setState({
    		[obj]: preFormData,
    		iadate: this.iadateFlag
    	})
    	if(key === 'transacttype') {
    		this.tagChange(key, val.display === '银团贷款')
    	}
    }

    countDown = () => {
    	this.state.DownTime--
    	if(this.state.DownTime <= 0){
    		this.state.DownTime = 5;
    		clearInterval(this.countTime)
    		hashHistory.push('fm/apply');
    		return;
    	}
    	this.setState(preState =>({
    		DownTime: preState.DownTime
    	}))
    }

    countTimeFn = () => {
    	this.countTime = setInterval(this.countDown.bind(this), 1000)
    }

    HanlderCheckRefer = (slected) => {
    	if(this.state.formDataObj[slected.name].display) {
    		return true;
    	}
		let {value} = slected;
		return !!value.refpk;
    }

    HanlderCheckInput = (slected) => {
    	const reg=/^\d{1,28}(.\d{0,2})?$/;
      	if(slected.value.length > 0) {
			if(reg.test(this.getNumber(slected.value))){
				return true;
			}
			return false;
		}
		return false;
    }

    disabledDate = (current) => {
    	let begin = this.state.formDataObj.begindate.value
    	return current && current.valueOf() < begin.valueOf();
    }

    HanlderCheckDate = (type, slected) => {
		let {value} = slected;
    	let other,cur;
    	if(!value){
    		return false;
    	}
    	cur = this.dateTransNum(value)
    	if(type == 'begin'){
    		if(this.state.formDataObj.enddate.value == '') {
    			return true;
    		}
    		other = this.dateTransNum(this.state.formDataObj.enddate.value)
    		return cur <= other
    	}else {
    		other = this.dateTransNum(this.state.formDataObj.begindate.value)
    		return cur >= other
    	}
    }

	dateTransNum = (date) => {
		if(typeof(date) == 'string') {
			return parseInt(date.split('-').join(''), 10)
		}else if(typeof(date) == 'object'){
			return parseInt((date.format(CONFIG.FORMAT).split('-').join('')), 10)
		}
	}



	render () {
		let {
			participateRanks,
			distance,
			formdataStatus,
			orderNum,
			orderTime,
			chooseIndex,
			isTransacttype,
			dataRanks,
			isCreditcc,
			dataCredit,
			tabsActiveKey,
			formDataObj,
			DownTime,
			breadcrumbItem,
			RanksCheckInfo,
			formId
		} = this.state;

		// console.log(formDataObj.iscreditcc.value)

		const tabsOther = [
			{
				key: 'transacttype',
				isShow: isTransacttype,
				label: '银团',
				render: () => {
					return (
						<section className="ranks-head">
							<h5>
								<span className="ranks-title">银团贷款</span>
								<Button colors="info" className="add-btn u-button-border-special" onClick={this.handleAddRank} >新增</Button>
							</h5>
							<Table
		                		data={dataRanks}
		                		columns={this.columnsRank}/>
						</section>
					)
				}
			},{
				key: 'iscreditcc',
				isShow: isCreditcc,
				label: '授信',
				render: () => {
					return (
						<section className="ranks-head">
							<h5>
								<span className="ranks-title">授信信息</span>
								<Button colors="info" className="add-btn u-button-border-special" onClick={this.handleAddShouXin} >新增</Button>
							</h5>
							<Table
		                		data={dataCredit}
		                		columns={this.columnsCredit}/>
						</section>
					)
				}
			}
		];

	    const tranStyle = {
	    	transform: `translate3d(${distance}px,0,0)`,
	    	webkitTransform: `translate3d(${distance}px,0,0)`,
	    	mozTransform: `translate3d(${distance}px,0,0)`
	    }

		return (

			<div>
				<BreadCrumbs items={breadcrumbItem} />
		    	<section className="financeApp-form">
		    		<Affix>
			    		<h3 className="financeApp-title">
			    			<span className="financeApp-title-item title">贷款申请</span>
			    			<ul className="financeApp-tab cf" onClick={this.scrollToDis}>
			    				{
			    					CONFIG.ANCHOR.values.map((item, index) => {
			    						return (<li className={index == chooseIndex? 'active' : ''}>{item}</li>)
			    					})
			    				}
			    				<li className="scrollBar tabs-nav-animated" ref="navBar" style={tranStyle}></li>
			    			</ul>
			    			<div className="financeApp-title-item">
			    				<Button shape="border" colors="info" className="fr u-button-border mgr20" onClick={this.handClickCancel}>取消</Button>
			    				<Button colors="info" className="fr" onClick={ this.handleSave }>保存</Button>
			    				{ (this.operType === "edit") && <div className="fr mgr20"><TmcUploader billID = {formId}  /></div> }
			    			</div>
			    		</h3>
		    		</Affix>

		    		<section  className="financeApp-info" >
		    			<ul className="financeApp-info-section"  ref="anchor1">
		    				<li className="financeApp-info-title blockClass">申请信息</li>
			                <Form useRow={true}
			                	showSubmit={false}
			                	submitCallBack={ this.submitcheckForm }
			                	checkFormNow={this.state.checkFormNow }
			                	>
			                	<FormItem inline={true} labelMd={2} md={10}
			                		labelName="申请单号:"
			                		isRequire={true}
			                		placeholder={'长度限制为1-40个字符'}
			                		reg={/^\s*\S((.){0,38}\S)?\s*$/}
			                		errorMessage="长度限制1-40个字符" method="blur"
			                		labelClassName="require">
									<FormControl name="contractcode"
										placeholder="请输入合约编号(1-40个字符)"
										className="large"
                                        value={formDataObj.contractcode.value}
                                        onChange={(val)=>{
                                            this.handleInputChange('formDataObj', "contractcode", val, -1)
                                        }}/>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
			                    	labelName="交易类型:"
			                    	asyncCheck={this.HanlderCheckRefer}
			                    	isRequire={true} method="change"
			                    	errorMessage="不允许为空"
			                    	labelClassName="require" >
			                    	<Refer
			                    		name="transacttype"
                                        multiLevelMenu={[
											{
												name: ['交易大类'],
												code: ['refname']
											},
											{
												name: ['交易类型'],
												code: ['refname']
											},
										]}
										clientParam={{
											maincategory: '2'
										}}
										type="customer"
							            refCode={"transtypeRef"}
							            refModelUrl={'/bd/transtypeRef/'}
							            referFilter={{
											type: 'loan' //是贷款时加这个
										}}
							            value={{
							                refname: formDataObj.transacttype.display || null,
							              	refpk: formDataObj.transacttype.value || null
							            }}
							            onChange={this.handleReferChange.bind(this, 'formDataObj', -1, 'transacttype')}
			                    	/>
								</FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
			                    	labelName="借款单位:"
			                    	isRequire={true}
			                    	reg={/^\s*\S((.){0,34}\S)?\s*$/}
			                    	errorMessage="借款单位1-36个字符" method="blur"
			                    	labelClassName="require" >
			                    	<FormControl name="financorg"
										placeholder="请输入融资单位(1-36个字符)"
										className="large"
                                        value={formDataObj.financorg.value}
                                        onChange={(val)=>{
                                            this.handleInputChange('formDataObj', "financorg", val, -1)
                                        }}/>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
			                    	labelName="贷款机构:"
			                    	asyncCheck={this.HanlderCheckRefer}
			                    	isRequire={true}
			                    	errorMessage="不允许为空"
			                    	method="change"
			                    	labelClassName="require" >
                                    <Refer
			                    		name="fininstitutionid"
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
										type="customer"
							            refCode={"finbranchRef"}
							            refModelUrl={'/bd/finbranchRef/'}
							            value={{
							                refname: formDataObj.fininstitutionid.display || null,
							              	refpk: formDataObj.fininstitutionid.value || null
							            }}
							            onChange={this.handleReferChange.bind(this, 'formDataObj', -1, 'fininstitutionid')}
			                    	/>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
			                    	labelName="项目:" >
                                    <Refer
			                    		name="projectid"
										type="customer"
							            refCode={"projectRef"}
							            refModelUrl={'/bd/projectRef/'}
							            value={{
							                refname: formDataObj.projectid.display || null,
							              	refpk: formDataObj.projectid.value || null
							            }}
							            onChange={this.handleReferChange.bind(this, 'formDataObj', -1, 'projectid')}
			                    	/>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={10}
				                    labelName="资金用途:"  method="blur" >
				                    <TextareaItem
				                    	name="fmuseway"
				                    	type="customer"
				                    	value={formDataObj.fmuseway.value}
				                    	className="u-textarea-wrap"
				                    	placeholder="请输入资金用途"
				                    	count={200}
				                    	onChange={(val)=>{
                                            this.handleInputChange('formDataObj', "fmuseway", val, -1)
                                        }} />
			                    </FormItem>
			                	<FormItem inline={true} labelMd={2} md={4}
				                	labelName="币种:"
				                	errorMessage="不允许为空"
				                	asyncCheck={this.HanlderCheckRefer}
				                	isRequire={true} method="change"
				                	labelClassName="require">
                                    <Refer
                                    	referClassName="middle"
			                    		name="currtypeid"
										type="customer"
							            refCode={"currencyRef"}
							            refModelUrl={'/bd/currencyRef/'}
							            value={{
							                refname: formDataObj.currtypeid.display || null,
							              	refpk: formDataObj.currtypeid.value || null
							            }}
							            onChange={this.handleReferChange.bind(this, 'formDataObj', -1, 'currtypeid')}
			                    	/>
			                    </FormItem>
			                	<FormItem inline={true} labelMd={2} md={4}
				                	labelName="申请金额:"
				                	isRequire={true}
				                	method="change"
				                	asyncCheck={this.HanlderCheckInput}
			                    	errorMessage="金额需大于0"
				                	labelClassName="require">
									<InputItem
				                		used="money"
				                		type="customer"
				                		name="applymny"
				                		className="input-strong"
				                		value={formDataObj.applymny.value}
				                		icon={false}
				                		onChange={(val)=>{
                                            this.handleInputChange('formDataObj', "applymny", val, -1)
                                        }}
				                	/>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
				                    labelName="担保方式:"
				                    labelClassName="require">
				                    <Radio.RadioGroup
                                        name="guaranteetype"
                                        selectedValue={formDataObj.guaranteetype.value}
                                        onChange={(val) => {
                                        	this.handleInputChange('formDataObj', "guaranteetype", val, -1)
                                    	}}>
                                        { CONFIG.GUARANTEE.map((item, i) => <Radio color="info"
                                        	value={item.value}
                                        	key={i}>
                                        	{item.label}
                                        	</Radio>)
                                    	}
                                    </Radio.RadioGroup>

			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
				                    labelName="合同状态:" >
									<FormControl name="contstatus"
										className="large disable-input"
										disabled
                                        value={this.mapTrans(formDataObj.contstatus.value , 'contstatus')} />
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
			                    	labelName="起始日期:"
			                    	isRequire={true}
			                    	asyncCheck={this.HanlderCheckDate.bind(this, 'begin')}
			                    	errorMessage="不允许为空，且小于结束日期"
			                    	method="change"
			                    	labelClassName="require">
			                        <DatePicker
			                        	type="customer"
			                        	className="middle"
			                        	locale={zhCN}
                                        name="begindate"
                                        showDateInput={false}
                                        onSelect={this.DateSelect}
                                        format={CONFIG.FORMAT}
                                        value={formDataObj.begindate.value}
                                        placeholder = {'选择日期'}
                                        onChange={(v)=>{
                                            this.handleInputChange('formDataObj', 'begindate', v.format(CONFIG.FORMAT), -1)
                                        }}
                                   />
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
				                    labelName="结束日期:"
				                    isRequire={true}
				                    asyncCheck={this.HanlderCheckDate.bind(this, 'end')}
				                    errorMessage="不允许为空，且大于起始日期"
				                    method="change"
				                    labelClassName="require" >
			                        <DatePicker
			                        	type="customer"
			                        	className="middle"
			                        	locale={zhCN}
                                        name="enddate"
                                        showDateInput={false}
                                        disabledDate={this.disabledDate}
                                        format={CONFIG.FORMAT}
                                        value={formDataObj.enddate.value}
                                        placeholder = {'选择日期'}
                                        onChange={(v)=>{
                                            this.handleInputChange('formDataObj', 'enddate', v.format(CONFIG.FORMAT), -1)
                                        }}
                                    />
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
				                    labelName="利率:" method="change"
				                    isRequire={true}
				                    errorMessage="不允许为空"
				                	asyncCheck={this.HanlderCheckRefer}
				                    labelClassName="require" >
                                    <Refer
			                    		name="rateid"
										type="customer"
							            refCode={"rateRef"}
							            refModelUrl={'/bd/rateRef/'}
							            value={{
							                refname: formDataObj.rateid.display || null,
							              	refpk: formDataObj.rateid.value || null
							            }}
							            multiLevelMenu={[
											{
												name: ['名称', '利率'],
												code: ['refname', 'rate']
											}
										]}
										clientParam={{
											ratestartdate: moment(formDataObj.begindate.value).format(CONFIG.FORMAT) + ' 00:00:00' || ''
										}}
							            referFilter={{
											currtypeid: formDataObj.currtypeid.value || '', //币种pk
										}}
							            onChange={this.handleReferChange.bind(this, 'formDataObj', -1, 'rateid')}
			                    	/>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
				                    labelName="还款方式:"
				                    isRequire={true}
				                    errorMessage="不允许为空"
				                    method="change"
				                	asyncCheck={this.HanlderCheckRefer}
				                    labelClassName="require">
                                    <Refer
			                    		name="returnmode"
										type="customer"
										multiLevelMenu={[
											{
												name: ['编码','名称'],
												code: ['refcode','refname']
											}
										]}
							            refCode={"repaymentmethodRef"}
							            refModelUrl={'/bd/repaymentmethodRef/'}
							            value={{
							                refname: formDataObj.returnmode.display || null,
							              	refpk: formDataObj.returnmode.value || null
							            }}
							            onChange={this.handleReferChange.bind(this, 'formDataObj', -1, 'returnmode')}
			                    	/>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
				                    labelName="结息日:"
				                    isRequire={true}
				                    asyncCheck={this.HanlderCheckRefer}
				                    errorMessage="不允许为空"
				                    method="change"
				                    labelClassName="require" >
                                    <Refer
                                    	disabled={this.state.iadate}
			                    		name="iadate"
										type="customer"
										multiLevelMenu={[
											{
												name: ['编码','名称'],
												code: ['refcode','refname']
											}
										]}
							            refCode={"interestDayRef"}
							            refModelUrl={'/bd/interestDayRef/'}
							            value={{
							                refname: formDataObj.iadate.display || null,
							              	refpk: formDataObj.iadate.value || null
							            }}
							            onChange={this.handleReferChange.bind(this, 'formDataObj', -1, 'iadate')}
			                    	/>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
				                    labelName="借款单位账户:" >
                                    <Refer
			                    		name="bankaccbasid"
										type="customer"
							            refCode={"bankaccbasRef"}
							            refModelUrl={'/bd/bankaccbasRef/'}
							            multiLevelMenu={[
											{
												name: ['子户编码','子户名称'],
												code: ['refcode','refname']
											}
										]}
										referFilter={{
											accounttype: 0, //01234对应活期、定期、通知、保证金、理财
											currtypeid: formDataObj.currtypeid.value || '', //币种pk
											// orgid: '' //组织pk
										}}
										clientParam={{
											opentime:  moment(formDataObj.begindate.value).format(CONFIG.FORMAT) + ' 00:00:00' || ''
										}}
							            value={{
							                refname: formDataObj.bankaccbasid.display || null,
							              	refpk: formDataObj.bankaccbasid.value || null
							            }}
							            onChange={this.handleReferChange.bind(this, 'formDataObj', -1, 'bankaccbasid')}
			                    	/>
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
				                    labelName="放款占用授信:" >
			                        <Switch name="iscreditcc"
			                        	type="customer"
			                        	onChangeHandler={(val)=>{
			                        		this.handleInputChange('formDataObj', 'iscreditcc', val, -1)
			                        	}}
				                        checked={!!formDataObj.iscreditcc.value}
				                        checkedChildren={'√'} unCheckedChildren={'X'} />
			                    </FormItem>
			                    <FormItem inline={true} labelMd={2} md={4}
				                    labelName="审批状态:" >
									<FormControl name="vbillstatus"
										className="large disable-input"
										disabled
                                        value={this.mapTrans(formDataObj.vbillstatus.value , 'vbillstatus')} />
			                    </FormItem>
			                </Form>
		                </ul>
		                <ul className="financeApp-info-section"  ref="anchor2">
		                	<li className="financeApp-info-title blockClass other-info" >其他信息
		                		<span className="fr financeApp-info-wrong">{RanksCheckInfo}</span>
		                	</li>
		                		<LightTabs activeKey={ tabsActiveKey }  tabs={tabsOther} handleTypeChange={this.changeKey}/>
		                </ul>
		    		</section>
		    	</section>
			    <Modal show={this.state.showModal} >
                    <Modal.Header >
                        <Modal.Title className="modal-title"> 申请成功 </Modal.Title>
                        <div className='fr modal-title-close' onClick={this.handClickCancel} ><Icon type='uf-close-bold' /></div>
                        <div className="modal-title-count">
                        	<i>{DownTime}</i>
                        	<span>S&nbsp;后回首页</span>
                        </div>
                    </Modal.Header >
                    <Modal.Body >
                        <div className="financeApp-success">
						    <div className="financeApp-success-wrap">
						    	<section className="financeApp-success-status">
						    		<div className="financeApp-success-icon">
						    			<Icon type="uf-correct" />
						    		</div>
						    		<h2 className="financeApp-success-title">提交成功</h2>
						    	</section>
						    	<section className="financeApp-success-detail">
					    			<span>申请单号:<span>{orderNum}</span></span>
					    			<span>申请时间:<span>{orderTime}</span></span>
						    	</section>
						    </div>
					    </div>
                    </Modal.Body>
                    <Modal.Footer>
                    	<section className="financeApp-success-buttons">
				    		<Button colors="info" className="large-button" onClick={ this.closeModal }>继续申请</Button>
						    <Link to={`/fm/applycardpreview?id=${this.state.formId}`} target="_blank" className="u-button u-button-info u-button-border large-button">预览</Link>
				    	</section>
                    </Modal.Footer>
                </Modal>
                <Loading fullScreen show={this.state.loadingShow} loadingType={'line'}/>
			</div>
		);
	}
}



