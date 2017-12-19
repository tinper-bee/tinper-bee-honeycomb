import React, { Component } from 'react';
import { hashHistory , Redirect, Link } from 'react-router';
import axios from 'axios';
import { Panel, Label, Button, Switch, FormControl, Radio, Con, Row, Col, Icon, Table } from 'tinper-bee';
import { Element as ScrollElement, Link as ScrollLink} from 'react-scroll';
import Affix from 'bee-affix';
import 'bee-affix/build/Affix.css';
import DatePicker from 'bee-datepicker';
import Loading from 'bee-loading';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import moment from 'moment';
import Refer from '../../../../containers/Refer';
import { CheckboxItem, RadioItem, TextAreaItem, ReferItem , SelectItem, InputItem, DateTimePickerItem, SwitchItem} from '../../../../containers/FormItems';
import Select from 'bee-select';
import LightTabs from './LightTabs';
import './index.less';
import  Form from 'bee-form';
import 'bee-form/build/Form.css';
import Modal from 'bee-modal';
import BreadCrumbs from '../../../bd/containers/BreadCrumbs';

//上传附件
import TmcUploader from '../../../../containers/TmcUploader';

const deepClone = require('../../../../utils/deepClone');
import { toast } from '../../../../utils/utils';

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
	'YEAR': {
		step: 'years',
		count: 1
	},
	'QUARTER': {
		step: 'months',
		count: 3
	},
	'MONTH': {
		step: 'months',
		count: 1
	},
	'DAY': {
		step: 'days',
		count: 1
	}
};

const urlsMap = {
	'new': 'fm/contract/save',
	'update': 'fm/contract/update',
	'change': 'fm/contract/change'
};

const disablediadateMap = ['到期一次付息', '到期一次还本'];

export default class Contract extends Component {

 	state = {

 		//页面状态 EDIT VIEW
 		editStatus: 'new',
 		//页面标题
 		title: '贷款合同',
 		reset: false,

 		//是否显示成功按钮
 		showModal: false,
 		// 是否在请求
 		isLoading: false,
 		checkForm: false,

 		//是否含有融资编号
 		id: this.props.location.query.id,
 		// type: 'change',
 		type: this.props.location.query.type,

 		//是否可以提交

 		isContractSubmitble: false,

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

 		//结息日是否禁用
 		isIadateActive: false,

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
 			begindate: {
 				value: moment().format(format),
 				display: '',
 				scale: -1
 			},
 			enddate: {},
 			isfixedintrate: {},
 			transactclass: {},
 			transacttype: {},
 			vbillstatus: {},
 			guaranteetype: {
 				value: '1',
 				display: '',
 				scale: -1
 			},
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
 			versiondate: {
 				value:  moment().format(format),
 				display: '',
 				scale: -1
 			},
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
				controltype: {
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
 			index: 1,
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

 	handleSubmitSave = () => {
 		this.setState({
 			checkForm: true
 		});
 	}

 	componentWillMount() {
 		let { type, id} = this.state;

 		console.log('this is id print',  id);

 		if ( type ) {
 			this.state.editStatus = type;
 		}


 		//银团贷款默认需要代理行和参与行
 		if (this.state.editStatus == 'new') {
 			this.addNewLine('syndicatedloanData', 3);
 			this.addNewLine('syndicatedloanData', 3);

 			this.addNewLine('payplanData', 1);
 		}


 		// this.state.isLoading = true;
 		if ( id ) {
 			this.state.isLoading = true;
 			this.searchById( id );
 		} else {
 			this.resetState = deepClone(this.state);
 		}

 	}

	isString(str) {
		return (typeof str == 'string') && str.constructor == String;
	}

 	componentDidMount() {}

 	searchById(id) {
		let self = this;

		axios.post(window.reqURL.fm + 'fm/contract/selectById', {
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
				toast({content: '后台报错,请联系管理员', color: 'danger'});
				self.setState({
					isLoading: false
				});
			});
 	}

 	getCode(template, raw) {
 		let str = raw + '';
 		return template.substring(0, template.length - str.length) + str;
 	}


 	echoData(data) {
 		let self = this;
 		let hasGuaranteeArr = ['0', '3', '4', '5'];
		let {
			syndicatedloanData,
			contractInfoData,
			payplanData,
			creditinfoData,
			guaranteeData,
			isIadateActive,
			editStatus,

			hasSyndicatedloan,
			hasCreditinfo,
			hasGuarantee
		} = this.state;

		// if (data.data && data.success) {
		// let isChange = (editStatus === 'change');
		let { contractInfo, bankLoadInfo, payplanInfo, guaranteeInfo, creditinfo} = data;

		let contractInfoValues = contractInfo.rows[0].values;
		for(let p in contractInfoValues) {

			if (p == 'versiondate' && editStatus == 'change') {
				//变更时 合同版本日期 用当天时间


			} else {
				contractInfoData[p] = contractInfoValues[p];
			}

			if (p ==  'transacttype' && contractInfoData[p]['display'] == '银团贷款') {
				hasSyndicatedloan = true;
			}

			if (p == 'iscreditcc' && !contractInfoData[p]['value']) {
				hasCreditinfo = true;
			}

			if (p == 'guaranteetype' && hasGuaranteeArr.indexOf(contractInfoData[p]['value']) > -1) {
				hasGuarantee = true;
			}

			if (p == 'iadate' && !contractInfoData[p]['value']) {
				isIadateActive = true;
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


		self.setState({
			isLoading : false,
			contractInfoData: contractInfoData,
			syndicatedloanData: syndicatedloanData,
			creditinfoData: creditinfoData,
			guaranteeData: guaranteeData,
			payplanData: payplanData,
			isIadateActive: isIadateActive,
			hasSyndicatedloan,
			hasCreditinfo,
			hasGuarantee
		});
 	}

 	//放款占用授信 控制授信表体
 	handleIscreditcc = (value) => {
 		let {hasCreditinfo, contractInfoData} = this.state;

 		contractInfoData.iscreditcc = {
 			value: value,
 			display: '',
 			scale: -1
 		};
 		this.setState({
 			contractInfoData: contractInfoData,
 			hasCreditinfo: !value
 		});
 	}

 	//合同结束日期 根据开始日期 期间 期间单位 联动处理
 	handleEndDateChange = (value, type)=> {
 		let { contractInfoData } = this.state;
 		// let { periodcount, begindate, periodunit, enddate } = contractInfoData;

 		if ( type == 'begindate') {
 			contractInfoData.begindate = {
 				display: '',
 				value: value.format(format),
 				scale: -1
 			};
 		}

 		if ( type == 'periodcount' ) {

			if (!contractInfoData.begindate.value) {
				contractInfoData.begindate = {
					display: '',
					value: moment().format(format),
					scale: -1
				}
			}

 			contractInfoData.periodcount = {
 				display: '',
 				value: value,
 				scale: -1
 			};
 		}

 		if ( type == 'periodunit') {

			if (!contractInfoData.begindate.value) {
				contractInfoData.begindate = {
					display: '',
					value: moment().format(format),
					scale: -1
				}
			}
 			contractInfoData.periodunit = {
 				display: '',
 				value: value,
 				scale: -1
 			};
 		}


 		let { periodcount, begindate, periodunit, enddate } = contractInfoData;

 		if ( begindate.value && periodcount.value && periodunit.value ) {

 			let enddateVal = moment(begindate.value).add( periodcount.value * periodunitMap[periodunit.value]['count'], periodunitMap[periodunit.value]['step']).format(format);
 			contractInfoData.enddate = {
 				value: enddateVal,
 				display: '',
 				scale: -1
 			};
 		}


 		this.setState({
 			contractInfoData: contractInfoData
 		});
 	}

 	//贷款金额值实时写入state
 	handleFinancamount = (value) => {
 		let { contractInfoData } = this.state;

 		// 去除逗号 格式化小数点后面位数

 		value = this.formatDot({value: this.removeThousands(value)});

 		contractInfoData.financamount = {
 			value: value,
 			display: '',
 			scale: -1
 		};
 		this.setState({
 			contractInfoData: contractInfoData
 		});
 	}

 	handleOlcrate = (value) => {
 		let { contractInfoData } = this.state;
 		value = this.formatDot({value: this.removeThousands(value)}, 4);
 		contractInfoData.olcrate = {
 			value: value,
 			display: '',
 			scale: -1
 		};
 		this.setState({
 			contractInfoData: contractInfoData
 		});

 	}

 	//担保方式控制担保表体
 	handleGTypeChange = (value , e) => {
 		let { hasGuarantee, contractInfoData, tabsActiveKey} = this.state;
 		let hasArr = ['0', '3', '4', '5'];

 		contractInfoData.guaranteetype.value = value;

 		if (hasArr.indexOf(value) > -1) {
 			hasGuarantee = true;
 		} else {
 			if (tabsActiveKey == '4') {
 				tabsActiveKey = 1;
 			}
 			hasGuarantee = false;
 		}

 		this.setState({
 			hasGuarantee: hasGuarantee,
 			contractInfoData: contractInfoData,
 			tabsActiveKey: tabsActiveKey
 		});
 	}


 	//交易类型控制银团表体
 	handletransacttype = (value, e) => {
 		let { hasSyndicatedloan, contractInfoData } = this.state;

 		contractInfoData.transacttype = {
 			value: value.refpk,
 			display: value.refname,
 			scale: -1
 		};

 		if (value.refname == '银团贷款') {
 			hasSyndicatedloan = true;
 		} else {
 			hasSyndicatedloan = false;
 		}

 		this.setState({
 			hasSyndicatedloan: hasSyndicatedloan,
 			contractInfoData: contractInfoData
 		});

 	}
 	//还款方式参照选择变更
	handleReturnmode　= (value) => {
		let { contractInfoData, isIadateActive } = this.state;
		if (value.repaycosttype == '6' && value.repayinteresttype == '6') {
			isIadateActive = true;
		} else {
			isIadateActive = false;
		}
		// if (disablediadateMap.indexOf(value.refname) > -1) {
		contractInfoData.iadate = {};
		// }

		contractInfoData.returnmode = {
			value: value.refpk,
			display: value.refname,
			scale: -1
		};

		this.setState({
			contractInfoData: contractInfoData,
			isIadateActive: isIadateActive
		});
	}

	handleIadate = (value) => {

		let { contractInfoData } = this.state;

		contractInfoData.iadate = {
			value: value.refpk,
			display: value.refname,
			scale: -1
		};

		this.setState({
			contractInfoData: contractInfoData
		});
	}

	handleCurrtypeid = (value) => {
		let { contractInfoData } = this.state;

		contractInfoData.currtypeid = {
			value: value.refpk,
			display: value.refname,
			scale: -1
		}

		this.setState({
			contractInfoData : contractInfoData
		});
	}


 	//交易大类控制交易类型过滤
 	handleTransactclass = (value) => {
 		let { contractInfoData, hasSyndicatedloan } = this.state;

 		if (contractInfoData.transactclass != value.refpk ) {

	 		contractInfoData.transactclass = {
	 			value: value.refpk,
	 			display: value.refname,
	 			scale: -1
	 		};

	 		contractInfoData.transacttype = {};
 		}

 		this.setState({
 			contractInfoData: contractInfoData,
 			hasSyndicatedloan: false
 		});
 	}

 	contractFormCallback = (isCheck, values, others) => {
 		let self = this;
 		let isListBodyValid = this.checkListBody();
 		console.log('contractFormCallback', isListBodyValid, isCheck, values, others);
 		if ( isListBodyValid　&&　isCheck  ) {
 			this.state.isContractSubmitble = true;
 			let { contractInfoData } = this.state;
 			let dates = ['applydate', 'begindate','signdate'];
 			let refs = ['financorg', 'projectid', 'rateid', 'financorganization',　'transactclass', 'currtypeid', 'transacttype', 'returnmode' ,'iadate'];
 		    let status = ['contstatus', 'vbillstatus'];
 		    let constants = ['financamount', 'olcrate'];

 			values.forEach(function(v, i, a) {
 				let ele = contractInfoData[v.name];
 				let { value } = v;
 				if ( ele ) {
 					if ( self.isEmptyObject(value) ) {

 						ele = {
 							value: null,
 							display: '',
 							scale: -1
 						};

 					} else {

 						if (status.indexOf(v.name) > -1 || constants.indexOf(v.name) > -1) {
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
			 					ele.display = value.display || '';

	 						}

	 						ele.scale = -1;
 						}

 					}
 				}
 			});



 			this.executeSubmit();
 		// 	this.setState({
			// 	isContractSubmitble: false,
			// 	contractInfoData: contractInfoData,
			// 	checkForm: false
			// });
 		} else {
 			this.setState({
				isContractSubmitble: false,
				checkForm: false
			});
 		}
 	}

	filterBodyListBydr(v, i, a) {
		// dr = 1 表示删除

		if (!v.dr) {
			return true;
		}

		return v.dr.value != 1;
	}

 	//表体校验
 	checkListBody() {
 		//表体提交时校验
 		let isValid = true;
		let {

			//合同信息
			contractInfoData,

			//表体数据
			payplanData,
			creditinfoData,
			syndicatedloanData,
			guaranteeData,

			//表体是否显示
			hasCreditinfo,
			hasSyndicatedloan,
			hasGuarantee,
			hasPayplan
		} = this.state;

 		//放款计划  表体校验
 		if (hasPayplan) {
	 		payplanData.rows.forEach((v, i, a) => {
	 			// guaranteemny creditdate
	 			if (v.dr != 1) {
		 			if (!v.guaranteemny.value || !v.creditdate.value) {
		 				isValid = false;
		 			}

					if (v.isEscCheck) {
						delete v['isEscCheck'];
					}
	 			}
	 		});
	 		if (!payplanData.rows.length) {
	 			isValid = false;
	 		}
 		}

 		//授信表体 校验
 		if (hasCreditinfo) {
 			creditinfoData.rows.forEach((v, i, a) => {
 				if (v.dr != 1) {
					if (!v.bankprotocolid.value || !v.cccurrtypeid.value || !v.cctypeid.value || !v.ccamount.value) {
						isValid = false;
					}

					// bankprotocolid
					// cccurrtypeid
					// cctypeid
					// ccamount

					if (v.isEscCheck) {
						delete v['isEscCheck'];
					}

 				}
 			})
 		}


 		//银团贷款 表体校验
 		// finanparticipate
 		if (hasSyndicatedloan) {

			let financamount = contractInfoData.financamount.value,
				conratioSum = 0, //约定比例
				practiceratioSum = 0, //实际比例
				confinancmnySum = 0, //实际金额
				practicefinancmnySum = 0; //约定金额
			let synCheckSum = {
				value: false,
				display: '',
				scale: -1
			};

	 		syndicatedloanData.rows.forEach((v, i, a) => {
	 			if (v.dr != 1) {
					if (!v.finanparticipate.value) {
						isValid = false;
					}

		 			if (v.isEscCheck) {
		 				delete v['isEscCheck'];
		 			}

		 			v.checkSum = synCheckSum

		 			conratioSum += Number(v.conratio.value);
		 			practiceratioSum += Number(v.practiceratio.value);
		 			confinancmnySum += Number(v.confinancmny.value);
		 			practicefinancmnySum += Number(v.practicefinancmny.value);
	 			}
	 		});

			console.log(conratioSum, practiceratioSum, confinancmnySum, practicefinancmnySum);

	 		if (conratioSum != 100 || practiceratioSum !=100 || confinancmnySum != financamount || practicefinancmnySum != financamount) {
	 			isValid = false;
	 			synCheckSum.value = true;
	 		}

 		}

 		//担保表体校验
 		if (hasGuarantee) {

 			guaranteeData.rows.forEach((v, i, a)=> {
 				if (v.dr != 1) {
 					if (!v.guaranteetype.value || !v.guaranteeid.value || !v.guaranteemny.value || !v.gecurrtypeid.value ) {
 						isValid = false;
 					}

 					if (!v.guaproportion.value || !v.contractenddate.value || !v.contractbegindate.value) {
 						isValid = false;
 					}

					if (v.isEscCheck) {
						delete v['isEscCheck'];
					}

 				}
 			});
 		}

 		console.log('checkListBody');
 		if (!isValid) {
 			toast({content: '表体有字段未填写正确，请检查　！', color: 'warning'});
 		}

 		return isValid;

 	}


 	checkRefer = (obj) => {
 		let { value } = obj;
 		// console.log( value, obj, 'valuevvvv1111');
 		if (value.willNotCheck) {
 			return value.willNotCheck;
 		}
 		return !!value.refname && !!value.refpk;
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

    toThousands(num) {
    	let ns = num.toString().split('.');
    	let head = ns[0];
    	let tail = ns[1] || '';
    	if (tail) {
    		tail = `.${tail}`;
    	}
		return (head || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/gi, '$1,') + tail;
 	}

 	// function thousandBitSeparator(num) {
	 //    return num && (num.toString().indexOf('.') != -1 ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function($0, $1) {
	 //        return $1 + ",";
	 //     }) : num.toString().replace(/(\d)(?=(\d{3}))/g, function($0, $1) {
	 //         return $1 + ",";
	 //     }));
 	// }
 	removeThousands(val) {
 		return val ? val.toString().replace(/\,/gi, '') : val;
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

	submitBusiness = (isCheck, values, others) => {
		// debugger;
		console.log('submitBusiness', isCheck, values, others);
		if (this.state.isContractSubmitble && isCheck ) {
			let { creditinfo } = this.state;

			values.forEach(function(v, i, a) {
				let ele = creditinfo[v.name];
				let { value } = v;
				if (ele) {
 					if ( self.isEmptyObject(value) ) {
 						ele = {
 							value: null,
 							display: '',
 							scale: -1
 						};
 					} else {
	 					ele.value = value.value || value ;
	 					ele.display = value.display || '';
	 					ele.scale = -1;
 					}
				}

			});
			// this.state.creditinfo = values;
			this.executeSubmit();
		} else {
			this.setState({
				isContractSubmitble: false,
				checkForm: false
			});
		}
	}

	setNull(obj) {
		for(var p in obj) {
			let e = obj[p];
			if (e.value === undefined || e.value === '') {
				e.value = null;
			}
		}
	}

	formatNull(row, obj) {

		for (let p in obj) {
			row[p] = Object.assign({
				display: '',
				value: null,
				scale: -1
			}, obj[p]);
		}
	}

	formatSingleNull(obj) {
		for (let p in obj) {
			obj[p] = Object.assign({
				display: '',
				value: null,
				scale: -1
			}, obj[p]);
		}
	}

	executeSubmit() {
		console.log(this.state, 'executeSubmit');
		// return false;
		let self = this;

		let data = {
			contractInfo: {
				pageinfo: null,
				rows: [],
				status: 0
			},
			// depositratioInfo: {
			// 	pageinfo: null,
			// 	rows: [],
			// 	status: 0
			// },
			bankLoadInfo: {
				pageinfo: null,
				rows: [],
				status: 0
			},
			guaranteeInfo: {
				pageinfo: null,
				rows: [],
				status: 0
			},
			creditinfo: {
				pageinfo: null,
				rows: [],
				status: 0
			},
			payplanInfo: {
				pageinfo: null,
				rows: [],
				status: 0
			}

		};

		let {
			contractInfoData,
			creditinfoData,
			payplanData,
			guaranteeData,
			syndicatedloanData,

			hasSyndicatedloan,
			hasGuarantee,
			hasCreditinfo
		} = this.state;

		// const contractMap = new Map(Object.entries(contractInfoData));

		//融资合同信息
		let contractValues = Object.assign({}, contractInfoData);

		// contractInfo.forEach(function(v, i, a) {
		// 	contractValues[v.name] = {
		// 		display: null,
		//         scale: -1,
		//         value: v.value
		// 	}
		// });

		this.setNull(contractValues);
		this.formatSingleNull(contractValues);

		data.contractInfo.rows.push({
			rowId: null,
			values: contractValues
		});



		// TODO 保证金信息 depositinfoData

		// let creditValues = Object.assign({}, creditinfoData);

		// creditinfo.forEach(function(v, i, a) {
		// 	creditValues[v.name] = {
		// 		display: null,
		// 		scale: -1,
		// 		value: v.value
		// 	}
		// });

		// this.setNull(creditValues);
		// this.formatSingleNull(creditValues);

		// data.guaranteeInfo.rows.push({
		// 	rowId: null,
		// 	values: creditValues
		// });

		//放款计划表体
		payplanData.rows.forEach(function(v, i, a) {
			let row = {};
			let obj = Object.assign({}, v);
			delete obj['key'];
			delete obj['isEdit'];
			self.formatNull(row, obj);
			self.setNull(row);
			data.payplanInfo.rows.push({
				rowId: i,
				values: row
			});
		});

		//授信信息 creditinfoData
		if (hasCreditinfo) {
			creditinfoData.rows.forEach(function(v, i, a) {
				let row = {};
				let obj = Object.assign({}, v);
				delete obj['key'];
				delete obj['isEdit'];
				self.formatNull(row, obj);
				self.setNull(row);
				data.creditinfo.rows.push({
					rowId: i,
					values: row
				});
			});

		}

		//担保
		if (hasGuarantee) {
			guaranteeData.rows.forEach(function(v, i, a) {
				let row = {};
				let obj = Object.assign({}, v);
				delete obj['key'];
				delete obj['isEdit'];
				self.formatNull(row, obj);
				self.setNull(row);
				data.guaranteeInfo.rows.push({
					rowId: i,
					values: row
				});
			});
		}


		//银团表体
		if (hasSyndicatedloan) {
			syndicatedloanData.rows.forEach(function(v, i, a) {
				let row = {};
				let obj = Object.assign({}, v);

				//更换代理行参与行信息
				if (obj.key == '1') {
					obj.financagency = obj.finanparticipate;
					delete obj['finanparticipate'];
				} else {
					delete obj['financagency'];
				}

				delete obj['key'];
				delete obj['isEdit'];
				self.formatNull(row, obj);
				self.setNull(row);
				data.bankLoadInfo.rows.push({
					rowId: i,
					values:row
				});
			});
		}


		console.log('++++++++++++++', data, this.state);

		// return false;
		let url =  urlsMap[this.state.editStatus];
		axios.post(window.reqURL.fm + url, {
				'data': data,
				'message': null,
				'success': true
			})
			.then(function(response) {

				self.setState({
					isLoading: false
				});

				if (response.data.success) {
					self.data = response.data.data;
					self.setState({showModal: true,
						id: self.data.contractInfo.rows[0]['values']['id']['value'],
						date: self.data.contractInfo.rows[0]['values']['applydate']['value']
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
			isContractSubmitble: false,
			isLoading: true
		});
	}

	handleCancel = ()=> {
		// hashHistory.push('/fm/apply');
		let { id } = this.state;
		if ( id ) {
			hashHistory.push(`/fm/contract_view?id=${id}&type=view`)
		} else {
			hashHistory.go(-1);
		}
	}
	//上传阿牛事件回调
	handleUpload = () => {
		console.log('handleUpload');
	}

	addNewLine(tableTag, tabIndex) {

		let tableData = this.state[tableTag];
		// this.state.tabsActiveKey = tabIndex;
		tableData.index++;

		let newLine = Object.assign({}, tableData.newLine, {
			key: tableData.index,
			isEscCheck: true,
			isEdit: true
		});

		if (tableTag === 'payplanData') {
			newLine.payplancode = {
				display: null,
				value: this.getCode('000', tableData.index),
				scale: -1
			}
		}

		tableData.rows.push(newLine);
	}

	findByKey (key, rows) {
		let rt = null;
		rows.forEach(function(v, i, a) {
			if ( v.key == key) {
				rt = v;
			}
		});
		return rt;
	}


 	handleAddNewline = (tableTag, tabIndex) => {
 		this.addNewLine(tableTag, tabIndex);
 		let tableData = this.state[tableTag];
 		this.setState({
 			[tableTag]:tableData
 		});
 	}

	render() {
		let self = this;
		let { editStatus } = this.state;
		console.log('render=>=>', this.state);

		let isChange = (editStatus === 'change');


	    let payplanTitle = ()=>(<div style={{ position: 'absolute', top: 4}} >
	    							<span className="table_title">放款计划</span>
	    							<Button size="sm" className="contract-new"
	    									onClick={()=> {this.handleAddNewline('payplanData', 1); }} >新增</Button>
	    						</div>);

		let payplanColums = [
			{
				title: "放款编号",
				dataIndex: "payplancode",
				key: "payplancode",
				width: 150,
				render: (text, record, index) => <span>{text.value}</span>
			},{
				title: "放款日期",
				dataIndex: "creditdate",
				key: "creditdate",
				width: 150,
				render: (text, record, index) => {

					let errorMsg , errorBorder ;
					if (!text.value && !record.isEscCheck) {
						errorBorder= {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请输入放款日期!</span>
					}

					let defaultValue = null;
					if (text.value) {
					    defaultValue = moment(text.value);
					}

					return (record.isEdit ? (<div > <DateTimePickerItem  {...errorBorder}   defaultValue = { defaultValue }
						format={ format } locale={ zhCN } placeholder={ dateInputPlaceholder }
						onChange = {

							(v) => {

								let { rows } = this.state.payplanData;
								let originData = this.findByKey(record.key, rows);
								console.log(v, rows, originData);

								if (originData) {
									originData.creditdate = {
										display: null,
										value: v,
										scale: -1
									}

									if (originData.isEscCheck) {
										delete originData['isEscCheck'];
									}
								}

								this.setState({
									payplanData: this.state.payplanData
								});

							}

						}/>{errorMsg}</div>) : (<span>{text}</span>)
					       );

				}
			},{
				title: "放款金额",
				dataIndex: "guaranteemny",
				key: "guaranteemny",
				width: 200,
				render: (text, record, index) => {

					let errorMsg, errorBorder;

					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请输入放款金额</span>
					}

					return (record.isEdit ? (<div> <FormControl  {...errorBorder}  value={ this.formatAcuracy(text) }
						onChange = { (e) => {
								let v = e.target.value;

								// if (v) {
								// 	v = v.toString().replace(/\,/g, '');
								// }
								console.log(v, 'guaranteemny before ====>');
								//去除逗号
								v = this.removeThousands(v);

								console.log(v, 'guaranteemny after =====>')

								let { rows } = this.state.payplanData;
								let originData = this.findByKey(record.key, rows);


								if (originData) {
									originData.guaranteemny = {
										display: null,
										value: this.formatDot({
											value: v
										}),
										scale: -1
									}
									if ( originData.isEscCheck) {
										delete originData['isEscCheck'];
									}
								}

								this.setState({
									payplanData: this.state.payplanData
								});
							}}
						/>{ errorMsg }</div>) : (<span>{ text }</span>))
				}
			},{
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 400,
				render: (text, record, index) => (
					<span href="javascript:;" onClick={ () => {


							let { rows } = this.state.payplanData;
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

									this.state.payplanData.rows = rows;
								}
							}

							this.setState({
								payplanData: this.state.payplanData
							});

						}} ><Icon className="iconfont icon-shanchu icon-style" /></span>

				)
			}
		];

		let creditinfoTitle = ()=>(<div style={{ position: 'absolute', top: 4}} >
								<span className="table_title">授信信息</span>
								<Button size="sm" className="contract-new"
								        onClick={()=> {this.handleAddNewline('creditinfoData', 1); }} >新增</Button>
								</div>);

		let creditinfoColumns = [
			{
				title: "授信协议",
				dataIndex: "bankprotocolid",
				key: "bankprotocolid",
				render: (text, record, index) => {
					let errorMsg, errorBorder;
					console.log(!text.value && !record.isEscCheck, '!text.value && !record.isEscCheck');
					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请选择合适的授信协议</span>
					}

					let defaultValue = {};
					if (text.value !== null) {
						defaultValue = {
							refCode: text.display,
							refname: text.display,
							refpk: text.value
						};

					}

					return (record.isEdit ? (<div><Refer name="bankprotocolid"
                                            value={ defaultValue }
                                            {...errorBorder}
 											ctx={'/uitemplate_web'}
                                            refModelUrl={'/fm/creditref/'}
                                            refCode={'creditref'}
                                            refName={'授信协议'}
											showLabel={false}

											multiLevelMenu={[
                                                {
                                                    name: [ '编码' ],
                                                    code: [ 'refcode' ]
                                                }
                                            ]}

                                            onChange={(v)=>{
                                            	let { rows } = this.state.creditinfoData;
												let originData = this.findByKey(record.key, rows);
												if (originData) {
													originData.bankprotocolid = {
	                                            		display: v.refcode,
	                                            		value: v.refpk,
	                                            		scale: -1
                                            		};
													originData.cccurrtypeid = {
	                                            		display: v.currenyid_n,
	                                            		value: v.currenyid,
	                                            		scale: -1
                                            		};

                                            		originData.controltype = {
                                            			display: '',
                                            			value: v.controltype,
                                            			scale: -1
                                            		};

                                            		if ( originData.isEscCheck) {
														delete originData['isEscCheck'];
													}
												}

												this.setState({
													creditinfoData: this.state.creditinfoData
												});

                                            }}

                     />{errorMsg}</div>) : (<span>{text}</span> )
					)
				}
			},{
				title: "授信币种",
				dataIndex: "cccurrtypeid",
				key: "cccurrtypeid",
				render: (text, record, index) => {

					let errorMsg, errorBorder;

					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请选择合适的币种</span>
					}

					let defaultValue = {};
					if (text.value !== null) {
						defaultValue = {refname: text.display, refpk: text.value };

					}

					return (record.isEdit ? (<div><Refer name="cccurrtypeid"
                                            value={ defaultValue }
                                            {...errorBorder}
											refCode="currencyRef"
											refModelUrl="/bd/currencyRef/"
                                            onChange={(v)=>{
                                            	let { rows } = this.state.creditinfoData;
												let originData = this.findByKey(record.key, rows);
												if (originData) {
													originData.cccurrtypeid = {
	                                            		display: v.refname,
	                                            		value: v.refpk,
	                                            		scale: -1
                                            		};
                                            		if ( originData.isEscCheck) {
														delete originData['isEscCheck'];
													}
												}

												this.setState({
													creditinfoData: this.state.creditinfoData
												});

                                            }}

                     />{errorMsg}</div>) : (<span>{text}</span> )
					)
				}
			},{
				title: "授信类别",
				dataIndex: "cctypeid",
				key: "cctypeid",
				render: (text, record, index) => {

					let errorMsg, errorBorder;

					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请选择合适的币种</span>
					}

					let defaultValue = {};
					if (text.value !== null) {
						defaultValue = {refname: text.display, refpk: text.value };

					}

					return (record.isEdit ? (<div><Refer name="cctypeid"

                                            value={ defaultValue }
                                            {...errorBorder}

											ctx={'/uitemplate_web'}
											refModelUrl={'/bd/cctypeRef/'}
											refCode={'cctypeRef'}
											refName={'授信类别'}

                                            onChange={(v)=>{
                                            	let { rows } = this.state.creditinfoData;
												let originData = this.findByKey(record.key, rows);
												if (originData) {
													originData.cctypeid = {
	                                            		display: v.refname,
	                                            		value: v.refpk,
	                                            		scale: -1
                                            		};
                                            		if ( originData.isEscCheck) {
														delete originData['isEscCheck'];
													}
												}

												this.setState({
													creditinfoData: this.state.creditinfoData
												});

                                            }}

                     />{errorMsg}</div>) : (<span>{text}</span> )
					)

				}
			}, {
				title: "占用授信金额",
				dataIndex: "ccamount",
				key: "ccamount",
				render: (text, record, index) => {


					let errorMsg, errorBorder;

					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请输入正确金额</span>
					}

					return ( record.isEdit ? (<div><InputItem defaultValue={ this.formatAcuracy(text) }
							{...errorBorder}

							processChange = {
								(state, v) => {
									return this.formatDot({value:v});
								}
							}

							onChange = {
								(v) => {

									let { rows } = this.state.creditinfoData;
									let originData = this.findByKey(record.key, rows);

									v = this.removeThousands(v);

									if (originData) {

										originData.ccamount = {
											display: null,
											value: this.formatDot({
												value: v
											}),
											scale: -1
										}

										if (originData.isEscCheck) {
											delete originData['isEscCheck'];
										}
									}


									this.setState({
										creditinfoData: this.state.creditinfoData
									});
								}
						}/>{errorMsg}</div>) : (<span>{text}</span>)
					)
				}
			},{
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 100,
				render: (text, record, index) => (
						<span href="javascript:;" onClick={ () => {


							let { rows } = this.state.creditinfoData;
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

									this.state.creditinfoData.rows = rows;
								}

							}

							this.setState({
								creditinfoData: this.state.creditinfoData
							});
						}} ><Icon className="iconfont icon-shanchu icon-style" /></span>

				)
			}
		];

		let syndicatedloanTitle = ()=>( <div style={{ position: 'absolute', top: 4}}>
											<span className="table_title">银团贷款</span>
											<Button size="sm" className="contract-new"
											onClick={()=> {this.handleAddNewline('syndicatedloanData', 3) }} >新增</Button>
										</div>);


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
				width: 300,
				render: (text, record, index) => {
					let errorMsg, errorBorder;

					console.log(!text.value && !record.isEscCheck, '!text.value && !record.isEscCheck');

					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请选择合适的银行组织</span>
					}

					let defaultValue = {};
					if (text.value !== null) {
						defaultValue = {refname: text.display, refpk: text.value };

					}

					return (!isChange ? (<div><Refer name="finanparticipate"
                                            value={ defaultValue }
                                            {...errorBorder}
                                            ctx={'/uitemplate_web'}
											refModelUrl={'/bd/finbranchRef/'}
											refCode={'finbranchRef'}
											refName={'金融网点'}
											strField={[{ name: '名称', code: 'refname' }]}
											showLabel={false}
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
                                            onChange={(v)=>{
                                            	let { rows } = this.state.syndicatedloanData;
												let originData = this.findByKey(record.key, rows);
												if (originData) {
													originData.finanparticipate = {
	                                            		display: v.refname,
	                                            		value: v.refpk,
	                                            		scale: -1
                                            		};
                                            		if ( originData.isEscCheck) {
														delete originData['isEscCheck'];
													}
												}

												this.setState({
													syndicatedloanData: this.state.syndicatedloanData
												});

                                            }}

                     />{errorMsg}</div>) : (<span>{text.display}</span> )
					)
				}
			},{
				title: "约定比例%",
				dataIndex: "conratio",
				width: 150,
				key: "conratio",
				render: (text, record, index) => {
					let errorMsg, errorBorder, conratioSum;
					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请输入合法的约定比例</span>
					}

					if (text.value && record.checkSum &&record.checkSum.value) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">约定比例之和不等于100%</span>
					}

					return ( !isChange ? (<div><InputItem defaultValue = { this.formatAcuracy(text) }
						placeholder="约定比例"
						{...errorBorder}
						onChange = {
							(v) => {

								let { rows } = this.state.syndicatedloanData;
								let {　financamount　} = this.state.contractInfoData;
								let reg = /^[1-9]\d*(\.\d{1,10})?$/i;
								let originData = this.findByKey(record.key, rows);
								if (originData) {
									originData.conratio = {
										display: null,
										value: v,
										scale: -1
									};
									if (　financamount.value　&& reg.test(financamount.value) && reg.test(v)　) {
										originData.confinancmny = {
											display: null,
											value: Number(v) * 0.01 * Number(financamount.value),
											scale: -1
										}
									}

									if (originData.isEscCheck) {
										delete originData['isEscCheck'];
									}

									if ( originData.checkSum && originData.checkSum.value ) {
										originData.checkSum.value = false;
									}

								}

								this.setState({
									syndicatedloanData: this.state.syndicatedloanData
								});

							}
						} />{errorMsg}</div>) : (<span>{this.formatAcuracy(text)}</span> )
				)}
			},{
				title: "约定贷款金额",
				dataIndex: "confinancmny",
				width: 150,
				key: "confinancmny",
				render: (text, record, index) => {
					let errorMsg, errorBorder;

					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请输入合法的约定贷款金额</span>
					}

					if (text.value && record.checkSum &&record.checkSum.value) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">约定比例之和不等于100%</span>
					}


					return ( !isChange ? (<div> <InputItem defaultValue = { this.formatAcuracy(text) }
						{...errorBorder}
						placeholder="请输入"
						onChange = {
							(v) => {

								v = this.removeThousands(v);

								let { rows } = this.state.syndicatedloanData;
								let originData = this.findByKey(record.key, rows);
								let reg = /^[1-9]\d*(\.\d{1,10})?$/i;
								let {　financamount　} = this.state.contractInfoData;
								if (originData) {
									originData.confinancmny = {
										display: null,
										value: v,
										scale: -1
									};

									if (　financamount.value　&& reg.test(financamount.value) && reg.test(v)　) {
										originData.conratio = {
											display: null,
											value: v * 100 / financamount.value,
											scale: -1
										}

									}

                            		if ( originData.isEscCheck) {
										delete originData['isEscCheck'];
									}

									if ( originData.checkSum && originData.checkSum.value ) {
										originData.checkSum.value = false;
									}

								}

								this.setState({
									syndicatedloanData: this.state.syndicatedloanData
								});

							}
						}
						/>{errorMsg}</div>) : (<span>{this.formatAcuracy(text)}</span> )
				)}
			},{
				title: "实际比例%",
				dataIndex: "practiceratio",
				width: 150,
				key: "practiceratio",
				render: (text, record, index) => {
					let errorMsg, errorBorder;
					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请输入合法的实际比例</span>
					}

					if (text.value && record.checkSum && record.checkSum.value) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">约定比例之和不等于100%</span>
					}

					return ( !isChange ? (<div><InputItem defaultValue = { this.formatAcuracy(text) }
						placeholder="实际比例"
						{...errorBorder }
						onChange = {
							(v) => {

								let { rows } = this.state.syndicatedloanData;
								let {　financamount　} = this.state.contractInfoData;
								let reg = /^[1-9]\d*(\.\d{1,10})?$/i;
								let originData = this.findByKey(record.key, rows);
								if (originData) {
									originData.practiceratio = {
										display: null,
										value: v,
										scale: -1
									};

									if (　financamount.value　&& reg.test(financamount.value) && reg.test(v)　) {
										originData.practicefinancmny = {
											display: null,
											value: Number(v) * 0.01 * Number(　financamount.value),
											scale: -1
										}
									}

									if (originData.isEscCheck) {
										delete originData['isEscCheck'];
									}

									if ( originData.checkSum && originData.checkSum.value ) {
										originData.checkSum.value = false;
									}
								}

								this.setState({
									syndicatedloanData: this.state.syndicatedloanData
								});
							}
						}
						/>{errorMsg}</div>) : (<span>{this.formatAcuracy(text)}</span> )
				)}
			},{
				title: "实际贷款金额",
				dataIndex: "practicefinancmny",
				width: 150,
				key: "practicefinancmny",
				render: (text, record, index) => {
					let errorMsg, errorBorder;

					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请输入合法的实际贷款金额</span>
					}

					if (text.value && record.checkSum && record.checkSum.value)  {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">约定比例之和不等于100%</span>
					}

					return ( !isChange ? (<div><InputItem defaultValue = { this.formatAcuracy(text) }
						{...errorBorder}
						placeholder="请输入"
						onChange = {
							(v) => {

								let { rows } = this.state.syndicatedloanData;
								let originData = this.findByKey(record.key, rows);
								let {　financamount　} = this.state.contractInfoData;
								let reg = /^[1-9]\d*(\.\d{1,10})?$/i;
								v = this.removeThousands(v);
								if (originData) {
									originData.practicefinancmny = {
										display: null,
										value: v,
										scale: -1
									};

									if (　financamount.value　&& reg.test(financamount.value) && reg.test(v)　) {
										originData.practiceratio = {
											display: null,
											value: v * 100 / financamount.value,
											scale: -1
										}

									}

									if (originData.isEscCheck) {
										delete originData['isEscCheck'];
									}

									if ( originData.checkSum && originData.checkSum.value ) {
										originData.checkSum.value = false;
									}

								}

								this.setState({
									syndicatedloanData: this.state.syndicatedloanData
								});
							}
						} />{errorMsg}</div>) : (<span>{this.formatAcuracy(text)}</span> )
				)}
			}, {
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 100,
				render: (text, record, index) => (
					index > 1 ?
						<span href="javascript:;" onClick={ () => {


							let { rows } = this.state.syndicatedloanData;
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

									this.state.syndicatedloanData.rows = rows;
								}

							}

							this.setState({
								syndicatedloanData: this.state.syndicatedloanData
							});

							// record.isEdit = false;
							// // this.state.tabsActiveKey = 3;
							// let { syndicatedloanData } = this.state;
							// let rows = syndicatedloanData.rows.filter(function(v, i, a) {
							// 	return v.key !== record.key;
							// });
							// syndicatedloanData.rows = rows;
							// this.setState();
						}} ><Icon className="iconfont icon-shanchu icon-style" /></span> : ''
							/*record.isEdit ? (<a href="javascript:;" onClick={ () => {
								record.isEdit = false;
								this.state.tabsActiveKey = 3;
								this.setState();
							}} >保存</a>) : (<a href="javascript:;" onClick={ () => {
								record.isEdit = true;
								this.tabsActiveKey = 3;
								this.setState();
							}}>编辑</a>)*/
				)
			}
		];

		let guaranteeTitle = ()=>(  <div style={{ position: 'absolute', top: 4}}>
										<span className="table_title">担保信息</span>
										<Button size="sm" className="contract-new"
										onClick={()=> {this.handleAddNewline('guaranteeData', 3) }} >新增</Button>
									</div>);


		let guaranteeColumns = [
			{
				title: "担保方式",
				dataIndex: "guaranteetype",
				key: "guaranteetype",
				width:100,
				render: (text, record, index) => {

					let errorMsg, errorBorder;
					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请选择正确的担保方式</span>
					}

					return (record.isEdit ? (<div><SelectItem name="guaranteetype"
								{...errorBorder}
								defaultValue={text.value}
			 					items= { () => [{
	                    					label: '保证',
	                    					value: '0'
	                    				},{
	                    					label: '抵押',
	                    					value: '3'
	                    				}, {
	                    					label: '质押',
	                    					value: '4'
	                    				}, {
	                    					label: '混合',
	                    					value: '5'
	                    				}] }

		                    	onChange = {

									(v) => {

										let { rows } = this.state.guaranteeData;
										let originData = this.findByKey(record.key, rows);
										if (originData) {
											originData.guaranteetype = {
												display: null,
												value: v,
												scale: -1
											};

											if (originData.isEscCheck) {
												delete originData['isEscCheck'];
											}
										}


										this.setState({
											guaranteeData: this.state.guaranteeData
										});
										// this.changeData("guaranteemny", v, index, "1");
									} } />{ errorMsg}</div> ) : (<span>{text}</span> )
					)
				}
			},{
				title: "担保合同",
				dataIndex: "guaranteeid",
				key: "guaranteeid",
				width: 100,
				render: (text, record, index) =>{
					let errorMsg, errorBorder;
					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请选择正确的担保合同</span>
					}

					let defaultValue = {};
					if (text.value !== null) {
						defaultValue = {
							applyno: text.display,
							id: text.value,
							refname: text.display,
							refpk: text.value
						};
						console.log('defaultValue', defaultValue);

					}


					return (record.isEdit ? (<div>
								<Refer name="gecurrtypeid"
		                            value={ defaultValue }
		                            {...errorBorder}
									refCode="guacontractRef"
									refModelUrl="/fm/guacontractRef/"
									multiLevelMenu={[
                                        {
                                            name: [ '合同编号' ],
                                            code: [ 'ractno' ]
                                        }
                                    ]}
		                            onChange={(v)=>{
		                            	let { rows } = this.state.guaranteeData;
										let originData = this.findByKey(record.key, rows);

										if (originData) {

											originData.guaranteeid = {
		                                		display: v.ractno,
		                                		value: v.id,
		                                		scale: -1
		                            		};

											originData.gecurrtypeid = {
		                                		display: v.guacutyid_n,
		                                		value: v.guacutyid,
		                                		scale: -1
		                            		};

											originData.contractbegindate = {
		                                		display: '',
		                                		value: v.guastate,
		                                		scale: -1
		                            		};

											originData.contractenddate = {
		                                		display: '',
		                                		value: v.guaedate,
		                                		scale: -1
		                            		};

		                            		if ( originData.isEscCheck) {
												delete originData['isEscCheck'];
											}
										}

										this.setState({
											guaranteeData: this.state.guaranteeData
										});

		                            }} />{errorMsg}</div>) : (<span>{text.value}</span> )
					)

				}
			},{
				title: "占用担保金额",
				dataIndex: "guaranteemny",
				key: "guaranteemny",
				width: 100,
				render: (text, record, index) => {

					let errorMsg, errorBorder;
					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请选择正确的占用担保金额</span>
					}


					return (record.isEdit ? (<div><InputItem defaultValue={ this.formatAcuracy(text) }
						{ ...errorBorder }

						onChange = {
							(v) => {
								let { rows } = this.state.guaranteeData;
								let originData = this.findByKey(record.key, rows);
								v = this.removeThousands(v);
								if (originData) {
									originData.guaranteemny = {
										display: null,
										value: v,
										scale: -1
									};

									if (originData.isEscCheck) {
										delete originData['isEscCheck'];
									}
								}

								this.setState({
									guaranteeData: this.state.guaranteeData
								});
							}
						} />{ errorMsg }</div>) : (<span>{text}</span> )
					)
				}
			},{
				title: "担保币种",
				dataIndex: "gecurrtypeid",
				key: "gecurrtypeid",
				width: 100,
				render: (text, record, index) => {
					let errorMsg, errorBorder;

					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请选择合适的币种</span>
					}

					let defaultValue = {};
					if (text.value !== null) {
						defaultValue = {refname: text.display, refpk: text.value };

					}


					return ( record.isEdit ? (<div>
								<Refer name="gecurrtypeid"
		                            value={ defaultValue }
		                            {...errorBorder}
									refCode="currencyRef"
									refModelUrl="/bd/currencyRef/"
		                            onChange={(v)=>{
		                            	let { rows } = this.state.guaranteeData;
										let originData = this.findByKey(record.key, rows);
										if (originData) {
											originData.gecurrtypeid = {
		                                		display: v.refname,
		                                		value: v.refpk,
		                                		scale: -1
		                            		};
		                            		if ( originData.isEscCheck) {
												delete originData['isEscCheck'];
											}
										}

										this.setState({
											guaranteeData: this.state.guaranteeData
										});

		                            }} />{errorMsg}</div>) : (<span>{text.value}</span> )
					)
				}
			},{
				title: "担保比例%",
				dataIndex: "guaproportion",
				key: "guaproportion",
				width: 100,
				render: (text, record, index) => {
					let errorMsg, errorBorder;
					if (!text.value && !record.isEscCheck) {
						errorBorder = {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">请输入正确的担保比例</span>
					}

					return ( record.isEdit ? (<div> <InputItem defaultValue={ this.formatAcuracy(text) }
						{...errorBorder}
						onChange = {
							(v) => {
								let { rows } = this.state.guaranteeData;
								let originData = this.findByKey(record.key, rows);
								if (originData) {
									originData.guaproportion = {
										display: null,
										value: v,
										scale: -1
									};

									if (originData.isEscCheck) {
										delete originData['isEscCheck'];
									}

								}

								this.setState({
									guaranteeData: this.state.guaranteeData
								});
							}
						}
						/>{errorMsg}</div>) : (<span>{text}</span> )
					)
				}
			},{
				title: "合约开始日期",
				dataIndex: "contractbegindate",
				key: "contractbegindate",
				width: 100,
				render: (text, record, index) => {

					let errorMsg , errorBorder ;
					if (!text.value && !record.isEscCheck) {
						errorBorder= {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">合约开始日期不能为空</span>
					}

					let defaultValue = null;
					if (text.value) {
					    defaultValue = moment(text.value);
					}

					return (record.isEdit ? (<div > <DateTimePickerItem  {...errorBorder}   defaultValue = { defaultValue }
						format={ format } locale={ zhCN } placeholder={ dateInputPlaceholder }
						onChange = {

							(v) => {

								let { rows } = this.state.guaranteeData;
								let originData = this.findByKey(record.key, rows);

								if (originData) {
									originData.contractbegindate = {
										display: null,
										value: v,
										scale: -1
									}

									if (originData.isEscCheck) {
										delete originData['isEscCheck'];
									}
								}

								this.setState({
									guaranteeData: this.state.guaranteeData
								});
							}

						}/>{errorMsg}</div>) : (<span>{text}</span>)　);
				}
			},{
				title: "合约结束日期",
				dataIndex: "contractenddate",
				key: "contractenddate",
				width: 100,
				render: (text, record, index) => {

					let errorMsg , errorBorder ;
					if (!text.value && !record.isEscCheck) {
						errorBorder= {
							className: 'validate-error'
						}

						errorMsg = <span className="validate-error-text">合约开始日期不能为空</span>
					}

					let defaultValue = null;
					if (text.value) {
					    defaultValue = moment(text.value);
					}

					return (record.isEdit ? (<div > <DateTimePickerItem  {...errorBorder}
							defaultValue = { defaultValue }
							format={ format } locale={ zhCN }
							placeholder={ dateInputPlaceholder }
							onChange = {

								(v) => {

									let { rows } = this.state.guaranteeData;
									let originData = this.findByKey(record.key, rows);

									if (originData) {
										originData.contractenddate = {
											display: null,
											value: v,
											scale: -1
										}

										if (originData.isEscCheck) {
											delete originData['isEscCheck'];
										}
									}

									this.setState({
										guaranteeData: this.state.guaranteeData
									});
								} }/>{errorMsg}</div>) : (<span>{text}</span>)　);

				}
			},{
				title: "操作",
				dataIndex: "oper",
				key: "oper",
				width: 100,
				render: (text, record, index) => (
						<span href="javascript:;" onClick={ () => {

							let { rows } = this.state.guaranteeData;
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

									this.state.guaranteeData.rows = rows;
								}

							}

							this.setState({
								guaranteeData: this.state.guaranteeData
							});

						}} ><Icon className="iconfont icon-shanchu icon-style" /></span>
				)
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
				render: () =><Table key='1' title={ payplanTitle }  columns={payplanColums} data={payplanRows} />
			},{
				key: 2,
				isShow: this.state.hasCreditinfo,
				label: '授信',
				render: () => <Table  key='2' title={ creditinfoTitle } columns={creditinfoColumns} data={ creditinfoRows } />
			},{
				key: 3,
				label: '银团',
				isShow: this.state.hasSyndicatedloan,
				render: () => <Table key='3' title={ syndicatedloanTitle } columns={syndicatedloanColumns} data={ syndicatedloanRows } />
			},{
				key: 4,
				label: '担保',
				isShow: this.state.hasGuarantee,
				render: () => <Table key='4' title={ guaranteeTitle } columns={guaranteeColumns} data={guaranteeRows} />
			}
		];

		const breadcrumbItem = [ { href: '#', title: '首页' }, { title: '融资申请' }, { title: '贷款申请' }, { title: '贷款合同' } ];
		let { contractInfoData, isIadateActive } = this.state;
		let { returnmode } = contractInfoData;

		console.log('isIadateActive', isIadateActive);

		return (

			<div className="cloud-fund-contract-wrap" >
				<BreadCrumbs items={ breadcrumbItem } />
				<div className="contract-content">
					<Row>
						<Col  md={12}   xs={12}   sm={12} style={{position: 'relative'}}>
							<Affix offsetTop={0} style={{ zIndex: 8000}} >
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
			 						<div className="tab-header-right">
				 							{this.state.id ?
				 							<span style={{marginRight:5}} >
					 							<TmcUploader
							                    	billID={this.state.id }
						                            upload={this.handleUpload}
						                            isEdit={false}
						                            showUploadBtn={false}
						                            data={{ billId: '00000001', group: 'fm' }}
						                            />
					                        </span> : ''}
				 							<Button size="sm" className="contract-info"
				 									onClick={this.handleSubmitSave}
				 									style={{ marginRight: 8}}>保存</Button>
				 							<Button size="sm"  onClick={ this.handleCancel } >取消</Button>
				 					</div>
			 					</div>
			 				</Affix>
			 				<div className="section-container" >
			 					<ScrollElement name="contractinfo">
									<section  ref={(ele) => { this.sectionEle0 = ele; }} >
										<Panel style={{borderTop: 'none'}} >
											<div className="section-title">合同信息</div>
											<Form   showSubmit={false} checkFormNow={ this.state.checkForm }
													useRow={true}  submitCallBack={this.contractFormCallback}　>
												<FormItem inline={ true } showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
													labelName="合同编号：" asyncCheck={this.asyncChec}   isRequire={true}  errorMessage="请输入合同编号"  method="blur"   >
													<InputItem  name="contractcode"
																type="customer"
																disabled={isChange}
																autocomplete="off"
																defaultValue={ contractInfoData.contractcode.value }
																placeholder="请输入合同编号" />
							                    </FormItem>
												<FormItem inline={ true } showMast={false} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
													labelName="申请单号："     errorMessage="请输入申请单号" >
													<InputItem  disabled name="applyno"
																type="customer"
																defaultValue={ contractInfoData.applyno.value }  />
							                    </FormItem>
												<FormItem inline={ true } showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
													labelName="借款单位：" className="form-item-short"  asyncCheck={this.checkRefer}　 method="change"    errorMessage="请输入贷款单位" >
													<ReferItem  name="financorg"　refCode="finorgRef"　refModelUrl="/bd/finorgRef/"
																type="customer"
																disabled={isChange}
																defaultValue={{
																	refname: contractInfoData.financorg.display,
																	refpk: contractInfoData.financorg.value
																}}
																refName = "借款单位"
																/>
							                    </FormItem>
							                    <FormItem inline={ true } showMast={false} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
						                    		labelName="申请日期：" isRequire={ false }  errorMessage="请输入申请日期" >
								                    <InputItem  disabled name="applydate"
																type="customer"
																defaultValue={ contractInfoData.applydate.value }  />
 							                	</FormItem>
							                    <FormItem inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="贷款机构：" asyncCheck={this.checkRefer} method="change"  errorMessage="贷款机构格式错误"  >
							                    	<ReferItem  name="financorganization"
							                    				defaultValue={{
																		refname: contractInfoData.financorganization.display,
																		refpk: contractInfoData.financorganization.value
																	}}
																disabled={isChange}
																type="customer"
							                    				refCode="finorgRef"
							                    				refModelUrl="/bd/finorgRef/"
							                    				ctx={'/uitemplate_web'}
																refModelUrl={'/bd/finbranchRef/'}
																refCode={'finbranchRef'}
																refName={'金融网点'}
																strField={[{ name: '名称', code: 'refname' }]}
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
							                    		/>
							                    </FormItem>
							                     <FormItem inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="交易大类：" asyncCheck={this.checkRefer}  errorMessage="交易大类格式错误"
							                    	method="change" change={this.handleTransactclass}  >
							                    	<ReferItem disabled={isChange}  name="transactclass" type="customer"
							                    		defaultValue={{
															refname: contractInfoData.transactclass.display,
															refpk: contractInfoData.transactclass.value
														}}
														type="customer"
														ctx={'/uitemplate_web'}
														refModelUrl={'/bd/transtypeRef/'}
														refCode={'transtypeRef'}
														refName={'交易大类'}
														clientParam={{
															maincategory: '2' //1234对应投资品种、融资品种、费用项目、银行交易项目
														}}
														referFilter={{
															type: 'loan' //是贷款时加这个
														}}

														strField={[{ name: '名称', code: 'refname' }]}
														multiLevelMenu={[
															{
																name: ['交易大类'],
																code: ['refname']
															}
														]}
														 />
							                    </FormItem>
							                    <FormItem inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="交易类型：" 	change={this.handletransacttype}   asyncCheck={this.checkRefer}  errorMessage="交易类型格式错误"  method="change"  >
							                    	<ReferItem  name="transacttype"
							                    				refModelUrl="/bd/transtypeRef/"
							                    				defaultValue={{
																		refname: contractInfoData.transacttype.display,
																		refpk: contractInfoData.transacttype.value
																	}}
																disabled={isChange}
																type="customer"
																ctx={'/uitemplate_web'}
																refModelUrl={'/bd/transtypeRef/'}
																showHistory={ false }
																refCode={'transtypeRef'}
																refName={'交易类型'}
																strField={[{ name: '名称', code: 'refname' }]}
																showLabel={false}
																isTreeCanSelect={true}

																clientParam={{
																	parentid: contractInfoData.transactclass.value,
																	detailcategory: '2',
																	maincategory: 2 //1234对应投资品种、融资品种、费用项目、银行交易项目
																}}
																multiLevelMenu={[
																	// {
																	// 	name: ['交易大类'],
																	// 	code: ['refname']
																	// },
																	{
																		name: ['交易类型'],
																		code: ['refname']
																	}
																	// ,
																	// {
																	// 	name: '事件',
																	// 	code: 'refname'
																	// }
																]}
																	/>
							                    </FormItem>
							                    <FormItem inline={true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="币种："  change={ this.handleCurrtypeid }  asyncCheck={this.checkRefer} method="change"  errorMessage="币种格式错误"  >
							                    	<ReferItem name="currtypeid"  refCode="currencyRef"	 refModelUrl="/bd/currencyRef/"
							                    		type="customer"
							                    		disabled={isChange}
							                    		defaultValue={{
																		refname: contractInfoData.currtypeid.display,
																		refpk: contractInfoData.currtypeid.value
																	}} />
							                    </FormItem>
							                    <FormItem inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="贷款金额："  reg={/^[1-9][0-9|,]*(\.\d{1,2})?$/i} method="blur" change={this.handleFinancamount} isRequire={true}
							                    	errorMessage="格式错误，最多两位小数"  >
							                    	<InputItem name="financamount"
							                    			type="customer"
							                    			processChange = {
																(state, v) => {
																	return this.formatDot({value:v});
																}
															}
							                    			disabled={isChange}
							                    			defaultValue={this.formatAcuracy(contractInfoData.financamount)}
							                    			placeholder="请输入贷款金额" />
							                    </FormItem>
							                    <FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="本币汇率："    method="blur" inputAlfer="%"　　reg={/^[1-9][0-9|,]*(\.\d{1,4})?$/i}
							                    	errorMessage="格式错误，最多四位小数" change={this.handleOlcrate}  >
							                    	<InputItem  name="olcrate"
							                    				type="customer"
							                    				disabled={isChange}
							                    				processChange = {
																	(state, v) => {
																		return this.formatDot({value:v}, 4);
																	}
																}
									                    		defaultValue={this.formatAcuracy(contractInfoData.olcrate, 4)}
									                    		placeholder="请输入本币汇率" />
							                    </FormItem>
							                    <FormItem inline={ true}  showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="起始日期："  change={ (value) => { this.handleEndDateChange(value, 'begindate') }}   isRequire={true}  method="change"
							                    	errorMessage="起始日期格式错误"    >
							                        <DatePicker name="begindate" disabled={isChange}  type="customer" format={ format } locale={ zhCN }
								                       defaultValue={ moment( contractInfoData.begindate.value) } placeholder={ dateInputPlaceholder } />
							                    </FormItem>
							                    <FormItem inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="期间："  isRequire={true} change={ (value) => { this.handleEndDateChange(value, 'periodcount') }}  errorMessage="期间格式错误"
							                    	method="blur"  reg={/^[0-9]+$/}  >
							                    	<InputItem name="periodcount" disabled={isChange} type="customer" defaultValue={ contractInfoData.periodcount.value } placeholder="请输入使用期间格式" />
							                    </FormItem>
							                    <FormItem inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="期间单位：" method="change" change={ (value) => { this.handleEndDateChange(value, 'periodunit') }}  isRequire={true} >
									 				<SelectItem name="periodunit" disabled={isChange}  defaultValue={contractInfoData.periodunit.value}
									 					items= {
							                    			() => {
							                    				return [{
							                    					label: '年',
							                    					value: 'YEAR'
							                    				},
							                    				{
							                    					label: '季',
							                    					value: 'QUARTER'
							                    				}, {
							                    					label: '月',
							                    					value: 'MONTH'
							                    				}, {
							                    					label: '日',
							                    					value: 'DAY'
							                    				}];
							                    			}
							                    		}
							                    		type="customer"
									 				 />
							                    </FormItem>
							                    <FormItem inline={ true} showMast={true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="结束日期：" isRequire={true}  errorMessage="结束日期格式错误"
							                    	method="change"  >
							                    	<InputItem  name="enddate"  type="customer"  disabled defaultValue={ contractInfoData.enddate.value }  />
							                        {/*<DatePicker name="enddate"  type="customer" format={ format } locale={ zhCN }
								                       defaultValue={ moment( contractInfoData.enddate.value ) } placeholder={ dateInputPlaceholder } />*/}
							                    </FormItem>
							                    <FormItem inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="利率："  asyncCheck={this.checkRefer} isRequire={true}  errorMessage="利率格式错误"
							                    	method="change"  >
							                    	<ReferItem  name="rateid" type="customer"
							                    			    defaultValue={{
																		refname: contractInfoData.rateid.display,
																		refpk: contractInfoData.rateid.value
																	}}
							                    			    placeholder="请输入使用利率"
							                    			    ctx={'/uitemplate_web'}
																refModelUrl={'/bd/rateRef/'}
																refCode={'rateRef'}
																refName={'利率管理'}
																multiLevelMenu={[
																	{
																		name: ['名称', '利率'],
																		code: ['refname', 'rate']
																	}
																]}
																clientParam = {{
																	ratestartdate: contractInfoData.begindate.value
																}}

																referFilter={{
																	currtypeid: contractInfoData.currtypeid.value
																}}
																strField={[{ name: '名称', code: 'refname' }]}
																showLabel={false}
							                    			    />
							                    </FormItem>
							                    <FormItem inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="担保方式：" isRequire={true}  method="change" change={self.handleGTypeChange}  >
									                <RadioItem  name="guaranteetype" disabled={isChange} type="customer" defaultValue={ contractInfoData.guaranteetype.value }
							                    		items= {
							                    			() => {
							                    				return [
							                    				{
							                    					label: '信用',
							                    					value: '1'
							                    				}, {
							                    					label: '保证',
							                    					value: '0'
							                    				}, {
							                    					label: '保证金',
							                    					value: '2'
							                    				}, {
							                    					label: '抵押',
							                    					value: '3'
							                    				}, {
							                    					label: '质押',
							                    					value: '4'
							                    				}, {
							                    					label: '混合',
							                    					value: '5'
							                    				}];
							                    			}
							                    		}
							                    	/>
							                    </FormItem>
							                    <FormItem inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="借贷期间：" method="change"  isRequire={true} >
													<SelectItem name="periodloan" disabled={isChange}  defaultValue={contractInfoData.periodloan.value}
																items = {
																	() => {
																		return [{
																			label: '短期',
																			value: 'short'
																		}, {
																			label: '中期',
																			value: 'metaphase'
																		}, {
																			label: '长期',
																			value: 'long'
																		}];
																	}
																}  type="customer"

									 				 />
							                    </FormItem>
												<FormItem inline={ true} showMast={false} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="固定利率：" method="change"   errorMessage="固定利率格式错误" >
							                    	<RadioItem
							                    		name="isfixedintrate"
							                    		defaultValue={ contractInfoData.isfixedintrate.value}
							                    		disabled={isChange}
							                    		items= {
							                    			() => {
							                    				return [{
							                    					label: '是',
							                    					value: 1
							                    				}, {
							                    					label: '否',
							                    					value: 0
							                    				}];
							                    			}
							                    		}
							                    		type="customer"
							                    	/>
							                    </FormItem>
						                    	<FormItem inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="还款方式："  asyncCheck={this.checkRefer}  errorMessage="还款方式格式错误"
							                    	method="change"  change={this.handleReturnmode} >
							                    	<ReferItem name="returnmode"  refCode="repaymentmethodRef"
							                    			    refModelUrl="/bd/repaymentmethodRef/"
																multiLevelMenu={[
																	{
																		name: ['编码', '名称'],
																		code: ['refcode', 'refname']
																	}
																]}
							                    			    type="customer"
							                    			    defaultValue={{
																		refname: contractInfoData.returnmode.display,
																		refpk: contractInfoData.returnmode.value
																	}}  />
							                    </FormItem>
							                    <FormItem inline={true} showMast={!isIadateActive} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="结息日："  change={ this.handleIadate }  asyncCheck={this.checkRefer}  errorMessage="结息日格式错误"
							                    	method="change"   >
							                    	<ReferItem name="iadate"  refCode="interestDayRef"
							                    		disabled={isIadateActive}
							                    		refModelUrl="/bd/interestDayRef/"
							                    		type="customer"
							                    		multiLevelMenu={[
															{
																name: ['编码', '名称'],
																code: ['refcode', 'refname']
															}
														]}
							                    		defaultValue={{
																refname: contractInfoData.iadate.display,
																refpk: contractInfoData.iadate.value,
																willNotCheck: isIadateActive
														 }}  />
							                    </FormItem>
							                    <FormItem inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="合同版本日期："  isRequire={true}  errorMessage="合约版本日期格式错误"
							                    	method="blur"  >
							                    	<InputItem  name="versiondate"  type="customer"  disabled defaultValue={ contractInfoData.versiondate.value }  />
							                    	{/*<DatePicker disabled={true} name="versiondate"  type="customer"  format={ format } locale={ zhCN }
								                       defaultValue={ moment( contractInfoData.versiondate.value ) } placeholder={ dateInputPlaceholder } />*/}
							                    </FormItem>
							                    <FormItem inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="合同签定日期："  isRequire={true}  errorMessage="合约签定日期格式错误"
							                    	method="blur"  >
							                    	<DatePicker name="signdate" disabled={isChange}  type="customer"  format={ format } locale={ zhCN }
								                       defaultValue={ moment( contractInfoData.signdate.value ) } placeholder={ dateInputPlaceholder } />
							                    </FormItem>
							                    <FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="合约状态：" errorMessage="合约状态格式错误"  >
							                    	<InputItem  name="contstatus" isViewMode  type="customer"
							                    			    defaultValue={contstatusMap[contractInfoData.contstatus.value || '7']} />
							                    </FormItem>
							                    <FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="审批状态："　errorMessage="审批状态格式错误"   >
							                    	<InputItem  name="vbillstatus"  type="customer" isViewMode
							                    			    defaultValue={vbillstatusMap[contractInfoData.vbillstatus.value || '-1']}  />
							                    </FormItem>

							                    <FormItem  inline={ false}  labelXs={2}  labelSm={2} labelMd={2} xs={10} md={10} sm={10}
							                    	labelName="资金用途："      method="change"
							                    	errorMessage="备注格式错误"  >
												    <TextAreaItem  type="customer"  style={{ width:869, height: 64}}
												    		defaultValue={ contractInfoData.memo.value }
												    		placeholder="请输入"
												    		wrap="off"
												    		count={ 200 } name="memo" />
												</FormItem>

												<FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="放款占用授信："　errorMessage="放款占用授信格式错误" change={this.handleIscreditcc}   >
							                    	<SwitchItem  name="iscreditcc" disabled={isChange}  type="customer" size="sm"
							                    			    defaultValue={ contractInfoData.iscreditcc.value }  />
							                    </FormItem>
												<FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="项目："　  errorMessage="请选择项目参照"  >
							                    	<ReferItem
						                    			name='projectid'
						                    			type='customer'
						                    			disabled={isChange}
						                    			defaultValue={{
																	refname: contractInfoData.projectid.display,
																	refpk: contractInfoData.projectid.value
																}}
														ctx={'/uitemplate_web'}
														refModelUrl={'/bd/projectRef/'}
														refCode={'projectRef'}
														refName={'项目'}
													/>
							                    </FormItem>
							                   	<FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
							                    	labelName="还本释放担保："　errorMessage="还本释放担保格式错误" >
							                    	<SwitchItem disabled={isChange}  name="isprinrelease"  type="customer" size="sm"
							                    			    defaultValue={ contractInfoData.isprinrelease.value }  />
							                    </FormItem>

								            </Form>
										</Panel>
									</section>
								</ScrollElement>
							{/* <section  ref={(ele) => { this.sectionEle1 = ele; }} >
									<Panel >
										<div className="section-title"> 保证金信息</div>
										<Form   useRow={true}
												submitAreaClassName='classArea'
												showSubmit={false}
												checkFormNow={ self.state.checkForm }
												submitCallBack={ self.submitBusiness }　>
											<FormItem  inline={ true} showMast={true} labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
						                    	labelName="保证金编号："  method="change"   errorMessage="保证金编号格式错误" >
						                    	 <ReferItem name="depositno"
						                    	 	defaultValue={{
																	refname: 'refname',
																	refpk: 'refpk'
																}} />
											</FormItem>
											<FormItem inline={ true } showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="使用保证金金额："   isRequire={true}  errorMessage="请输入使用保证金金额"
												method="change"  reg={/^[0-9]+$/}  >
												<InputItem name="depositmny" defaultValue="1111232" placeholder="请输入使用保证金金额" />
						                    </FormItem>
											<FormItem inline={ true } showMast={true} labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="保证金占贷款比例%："   isRequire={true} errorMessage="请输入保证金占贷款比例%"
												method="blur"  >
												<InputItem name="depositratio" defaultValue="11" placeholder="请输入保证金占贷款比例%" />
						                    </FormItem>
											<FormItem inline={ true} showMast={true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="保证金币种："  method="change"    errorMessage="保证金币种格式错误"  >
												<ReferItem name="dptcurrtypeid"
													defaultValue={{
																refname: 'refname',
																refpk: 'refpk'
																}} />
											</FormItem>
											<FormItem inline={ true } showMast={true}  labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}
												labelName="保证金存款收益："  isRequire={true}  errorMessage="请输入保证金存款收益"
												method="blur"  >
												<InputItem name="depositprofit" defaultValue="1111232" placeholder="请输入保证金存款收益" />
						                    </FormItem>
				                    	</Form>
									</Panel>
								</section>*/}
								<ScrollElement name="otherinfo">
									<section >
										<Panel >
											<div className="section-title" style={{float: 'left'}} >其他信息</div>
											<LightTabs activeKey={ this.state.tabsActiveKey }  items={tabs} />
										</Panel>
									</section>
								</ScrollElement>
							</div>
						</Col>
			        </Row>

				   	<Modal  style={{ top: 200, width: 520, height: 303, fontSize: 13 }} show={ this.state.showModal } >
			        	<Modal.Header>
	                		<Modal.Title>
	                    		<span>合同保存</span>
	                    		<span style={{ fontSize: 10, color: '#ccc', float: 'right'}} className='close-icon iconfont iconfont-title-contract icon-guanbi'
	                    				  onClick={()=> { hashHistory.go(-1); }} >
								</span>
							</Modal.Title>
		                </Modal.Header>

		                <Modal.Body>
		                	<span style={{fontSize: 40, display: 'block',marginLeft: 200}} className={ 'title-icon iconfont  icon-tishianniuchenggong' }></span>
		                	<span style={{fontSize: 20, display: 'block',marginLeft: 180}} >保存成功</span>

		                    <div style={{textAlign: 'center'}}>{`合同编号： ${contractInfoData.contractcode.value}　申请日期： ${this.state.date}`}</div>
		                </Modal.Body>

		                <Modal.Footer>
		                    <Button size="sm" style={{borderRadius: 2,width: 80, height: 30, marginRight: 8, backgroundColor: '#00B39E'}}>
		                    	<a style={{ color: '#ffffff', fontSize: 14}} href="#/fm/apply/">继续新增</a>
		                    </Button>
		                    <Button onClick={() => {
		                    	hashHistory.go(-1);
		                    }} size="sm" style={{ borderRadius: 2, color: 'rgba(102,102,102,1)' ,width: 80, height: 30, fontSize: 14}}  >关闭</Button>
		                </Modal.Footer>
	            	</Modal>

					<Loading fullScreen showBackDrop={ true } show={ this.state.isLoading } />
	            </div>
		    </div>
		);
	}
}
