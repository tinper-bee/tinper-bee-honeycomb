import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Con, Row, Col, Label, FormControl, Table, Breadcrumb } from 'tinper-bee';
import Tabs, { TabPane } from 'bee-tabs';
import Button from 'bee-button';
import Select from 'bee-select';
import DatePicker from 'bee-datepicker';
import InputGroup from 'bee-input-group';
import Switch from 'bee-switch';
import Message from 'bee-message';
import Form, { FormItem } from 'bee-form';
import Refer from '../../../../containers/Refer';
import MsgModal from '../../../../containers/MsgModal';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import moment from 'moment';
import Axiox from 'axios';
import Ajax from '../../../../utils/ajax';
import { AccSub, toFixFun, toRmZero, numFormatRegExp, toast } from '../../../../utils/utils';
import ApproveDetail from 'containers/ApproveDetail';
import ApproveDetailButton from 'containers/ApproveDetailButton';
import './index.less';
import '../../../../utils/publicStyle.less';
import nodataPic from '../../../../static/images/nodata.png';

const { Option, OptGroup } = Select;
const URL = window.reqURL.fm;
const format = 'YYYY-MM-DD';
const toDay = moment().format(format);
const dateInputPlaceholder = '选择日期';
const MNYSCALE = 2;
const RATEeSCALE = 4;
const MEMONUMBER = 0; // 备注 最大数值
// 需要整理的字段默认值数组
const sortOutArray = {
	repaydate: toDay,
	currtypeid: 'rmb',
	rate: 1,
	vbillstatus: -1,
	repaymny: '',
	unrepaymny: 0,
	memo: '',
	intrstoffbyprcpl: 0,
	interestmny: '',
	paytotalintst: 0,
	billstatus: 0,
	shdpaytotlintstmny: '',
	loanbankid: '',
	loanbankid_c: '',
	vbillno: '',
	settleflag: 0
};
// 需要整理的字段display默认值
const sortOutDArray = {
	currtypeid: '人民币',
	fininstitutionid: '暂未提供相关金融机构',
	subfinstitutionid: '暂未提供相关贷款机构'
};
// 还款计划初始state默认值处理
const sortOutPlanData = {
	actrepaymny: toFixFun(0, MNYSCALE),
	shdrepaymny: toFixFun(0, MNYSCALE)
};
// 银团贷款默认值
const sortOutBankData = {
	actratio: '',
	actrepaymny: toFixFun(0, MNYSCALE),
	bankid: ''
};
// 需要非空校验的字段
const isNullData = [ 'loancode', 'repaydate', 'currtypeid', 'rate', 'repaymny' ];
// 处理数据方法
export function SortValue(resData, sortData) {
	resData.map((item, index) => {
		for (let itemData in sortData) {
			if (item.values[itemData].value === null || item.values[itemData].value === '0E-8') {
				item.values[itemData].value = sortData[itemData];
			}
			if (item.values[itemData].scale !== -1) {
				item.values[itemData].value = toFixFun(item.values[itemData].value, item.values[itemData].scale);
			}
		}
	});
	return resData;
}
// 处理数据方法
export function SortDisplay(resData, sortData) {
	resData.map((item, index) => {
		for (let itemData in sortData) {
			if (item.values[itemData].display === null || item.values[itemData].display === '0E-8') {
				item.values[itemData].display = sortData[itemData];
			}
		}
	});
	return resData;
}
// 响应数据整理
export function resDataSort(res) {
	let resHeadData, resPlanData, resBankData, resCreditData, resGrtData;
	const allData = {};
	if (res.data.head) {
		resHeadData = res.data.head.rows;
		resHeadData = SortValue(resHeadData, sortOutArray);
		resHeadData = SortDisplay(resHeadData, sortOutDArray);
		allData.headData = resHeadData;
	}
	if (res.data.plan && res.data.plan.rows.length > 0) {
		resPlanData = res.data.plan.rows;
		resPlanData = SortValue(resPlanData, sortOutPlanData);
		let everyLineData = [];
		resPlanData.map((item, index) => {
			let lineItmeData = {};
			for (let itemData in item.values) {
				lineItmeData[itemData] = item.values[itemData]['value'];
				lineItmeData['num'] = index + 1;
			}
			everyLineData.push(lineItmeData);
		});
		// 后台传过来的数据
		allData.planData = resPlanData;
		// 还款计划实时显示的数据
		allData.payPlanListData = everyLineData;
		// 还款计划列表的原始数据
		allData.payPlanOldListData = everyLineData;
	}
	if (res.data.bank && res.data.bank.rows.length > 0) {
		resBankData = res.data.bank.rows;
		resBankData = SortValue(resBankData, sortOutBankData);
		let everyLineData = [];
		resBankData.map((item, index) => {
			let lineItmeData = {};
			for (let itemData in item.values) {
				if (itemData === 'bankid') {
					lineItmeData[itemData] = item.values[itemData]['display'];
				} else {
					lineItmeData[itemData] = item.values[itemData]['value'];
				}
				lineItmeData['num'] = index + 1;
			}
			everyLineData.push(lineItmeData);
		});
		allData.payBankListData = everyLineData;
		allData.bankData = resBankData;
	}
	if (res.data.credit && res.data.credit.rows.length > 0) {
		resCreditData = res.data.credit.rows;
		// resCreditData = Sort(resCreditData,sortOutArray);
		allData.creditData = resCreditData;
	}
	if (res.data.grt && res.data.grt.rows.length > 0) {
		resGrtData = res.data.grt.rows;
		// resGrtData = Sort(resGrtData,sortOutArray);
		allData.grtData = resGrtData;
	}
	return allData;
}
// 正则校验
export function regFun({ reg = '^[0-9]+(.[0-9]{1,3})?$', regData }) {
	let regFlage = new RegExp(reg);
	let flage = regFlage.test(regData);
	return flage;
}
// 保存时数据处理
export function SaveDataSort(params) {}
// 放款计划下拉内容
let payPlanDataArray = [];
// 放款左侧表单数据
let payHead,
	// 还款计划数据
	payPlanData,
	// 银团贷款数据
	payBankData,
	// 银行授信数据
	payCreditData,
	// 担保信息数据
	payGrtData;
// 还款计划列表数据
let planList = [];
let searchTimer;
export default class RepayPrcpl extends Component {
	constructor(props) {
		super(props);
		this.state = {
			financepayid: '',
			financepayRef: {},
			contractid: '',
			headData: [],
			planData: [],
			bankData: [],
			creditData: [],
			grtData: [],
			payPlanListData: [],
			payBankListData: [],
			payCreditListData: [],
			payGrtListData: [],
			payPlanOldListData: [],
			isDisabled: true, // 不可编辑 true 不可编辑 false 可编辑
			isNew: false, // 是否是新增 false 不是新增 true 新增
			isEdit: false, // 是否编辑态 false 不可编辑 true 可编辑
			isNull: {}, // 非空
			id: this.props.location.query.id || null,
			// unrepaymnyData: 0,
			memoNum: 0, // 备注剩余字数
			billState: 0,
			modalShow: false,
			interestmnyOld: 0, //利息金额原始值
			shdpaytotlintstmnyOld: 0 // 应付累计利息原始值
		};
	}
	// 更改state的值 {ad 区域数据,index 当前字段所在下标,name 字段名,value 字段值,status 行状态}
	tosetState = ({ ad, index, name, value, vname = 'value', status = 0 }) => {
		this.state[ad][index]['values'][name][vname] = value;
		return this.state[ad];
	};
	// 获取state的值 {ad 区域数据,index 当前字段所在下标,name 字段名, vname 对应 display 或者 value}
	togetState = ({ ad, index, name, vname = 'value' }) => {
		if (this.state[ad][index] !== undefined) {
			return this.state[ad][index]['values'][name][vname];
		} else {
			return false;
		}
	};
	// 注册非空校验方法
	cheackNullFun = (item) => {
		let isNullData = this.state.isNull;
		if (Object.prototype.toString.call(item) == '[object Array]') {
			item.map((str, index) => {
				isNullData[str] = true;
			});
		} else {
			let itemData = this.togetState({
				ad: 'headData',
				index: 0,
				name: item
			});
			if (isNullData[item] !== undefined) {
				switch (typeof itemData) {
					case 'number':
						isNullData[item] = true;
						break;
					case 'string':
						if ((itemData.length > 0 && Number(itemData) === NaN) || Number(itemData) !== 0) {
							isNullData[item] = true;
						} else {
							isNullData[item] = false;
						}
						break;
					default:
						isNullData[item] = false;
						break;
				}
			}
		}
		this.setState({
			isNull: isNullData
		});
	};
	// 放款编码选择事件，响应数据为左侧表单数据
	handleSelectPayid = (value) => {
		this.setState({
			financepayRef: {
				refpk: value.id,
				refname: value.loancode
			}
		});
		const _this = this;
		if (value.id) {
			Ajax({
				url: URL + 'fm/repayprcpl/queryloanbyid',
				data: {
					financepayid: value.id
				},
				success: function(res) {
					let resData = resDataSort(res);
					resData.isDisabled = false;
					resData.financepayid = value.id;
					_this.setState(resData);
					// let mnyData = _this.togetState({
					// 	ad: 'headData',
					// 	index: 0,
					// 	name: 'unrepaymny'
					// });
					let interestmnyOld = _this.togetState({
						ad: 'headData',
						index: 0,
						name: 'interestmny'
					});
					let shdpaytotlintstmnyOld = _this.togetState({
						ad: 'headData',
						index: 0,
						name: 'shdpaytotlintstmny'
					});
					// _this.state.unrepaymnyData = Number(mnyData) - 0;
					// 设置 loancode 字段不为空
					_this.state.isNull.loancode = true;
					_this.setState({
						// unrepaymnyData: _this.state.unrepaymnyData,
						isNull: _this.state.isNull,
						interestmnyOld: interestmnyOld,
						shdpaytotlintstmnyOld: shdpaytotlintstmnyOld
					});
				}
			});
		} else {
			this.setState({
				isDisabled: true
			});
		}
	};
	// 放款编码 onBlur 事件
	handleSelectBlur = (value) => {
		this.cheackNullFun('loancode');
	};
	// 放款编码 onFocus 事件
	handleSelectFocus = (value) => {
		// 设置 loancode 字段不为空
		this.state.isNull.loancode = true;
		this.setState({
			isNull: this.state.isNull
		});
	};
	// 保存操作
	handleSaveBtnClick = () => {
		const _this = this;
		const saveData = {};
		const isNullAllData = this.state.isNull;
		let flage = false;
		for (let item in isNullAllData) {
			this.cheackNullFun(item);
			if (!isNullAllData[item]) {
				return (flage = true);
			}
		}
		if (flage) {
			return false;
		} else {
			for (let item in this.state) {
				switch (item) {
					case 'headData':
						if (this.state[item].length > 0) {
							this.state[item].map((item, index) => {
								item.status = 2;
								let itemData = item.values;
								for (let childItem in itemData) {
									let childItemData = itemData[childItem].value;
									let childItemDisplayData = itemData[childItem].display;
									if (typeof childItemData === 'string') {
										if (childItemData.length === 0) {
											item.values[childItem].value = null;
										} else if (childItemData.length > 0 && Number(childItemData) === 0) {
											if (childItem !== 'unrepaymny') {
												item.values[childItem].value = null;
											}
										}
									}
									if (
										childItemDisplayData === '暂未提供相关金融机构' ||
										childItemDisplayData === '暂未提供相关贷款机构'
									) {
										item.values[childItem].display = null;
									}
								}
							});
							saveData['head'] = {
								pageinfo: null,
								rows: this.state[item]
							};
						}
						break;
					case 'planData':
						if (this.state[item].length > 0) {
							this.state[item].map((item, index) => {
								item.status = 2;
								let itemData = item.values;
								for (let childItem in itemData) {
									let childItemData = itemData[childItem].value;
									if (typeof childItemData === 'string') {
										if (childItemData.length === 0) {
											item.values[childItem].value = null;
										}
										// else if (childItemData.length > 0 && Number(childItemData) === 0) {
										// 	item.values[childItem].value = null;
										// }
									}
								}
							});
							saveData['plan'] = {
								pageinfo: null,
								rows: this.state[item]
							};
						}
						break;
					case 'bankData':
						if (this.state[item].length > 0) {
							this.state[item].map((item, index) => {
								item.status = 2;
								let itemData = item.values;
								for (let childItem in itemData) {
									let childItemData = itemData[childItem].value;
									if (typeof childItemData === 'string') {
										if (childItemData.length === 0) {
											item.values[childItem].value = null;
										}
									}
								}
							});
							saveData['bank'] = {
								pageinfo: null,
								rows: this.state[item]
							};
						}
						break;
					case 'creditData':
						if (this.state[item].length > 0) {
							this.state[item].map((item, index) => {
								item.status = 2;
							});
							saveData['credit'] = {
								pageinfo: null,
								rows: this.state[item]
							};
						}
						break;
					case 'grtData':
						if (this.state[item].length > 0) {
							this.state[item].map((item, index) => {
								item.status = 2;
							});
							saveData['grt'] = {
								pageinfo: null,
								rows: this.state[item]
							};
						}
						break;
					default:
						break;
				}
			}
			Ajax({
				url: URL + 'fm/repayprcpl/save',
				data: {
					data: saveData
				},
				success: function(res) {
					toast({ color: 'success', content: '保存成功！' });
					let resData = resDataSort(res);
					resData.isEdit = false;
					resData.isNew = false;
					_this.setState(resData);
				}
			});
		}
	};
	// 本币汇率
	handlePlanRateChange = (e) => {
		let itemValue = e.target.value;
		if (itemValue.length > 28) {
			return false;
		}
		let flage = regFun({
			reg: `^[0-9]+(.[0-9]{1,${RATEeSCALE}})?$`,
			regData: itemValue
		});
		if (!flage && itemValue.indexOf('.') !== itemValue.length - 1) {
			return false;
		}
		if (itemValue.indexOf('0') === 0 && itemValue.indexOf('.') !== 1) {
			itemValue = Number(itemValue);
		}
		this.tosetState({
			ad: 'headData',
			index: 0,
			name: 'rate',
			value: itemValue
		});
		this.setState({
			headData: this.state.headData
		});
		// 注册事件非空校验
		this.cheackNullFun('rate');
	};
	// 编辑按钮
	handleEditBtnClick = () => {
		this.setState({
			isNew: false,
			isEdit: true,
			isDisabled: false
		});
	};
	// 删除按钮
	handleDelBtnClick = () => {
		this.setState({
			modalShow: !this.state.modalShow
		});
	};
	// 删除单据方法
	delFun = () => {
		// hashHistory.goBack();
		this.setState({
			modalShow: false
		});
		let idData = this.togetState({
			ad: 'headData',
			index: 0,
			name: 'id'
		});
		let tsData = this.togetState({
			ad: 'headData',
			index: 0,
			name: 'ts'
		});
		Ajax({
			url: URL + 'fm/repayprcpl/del',
			data: {
				data: {
					head: {
						rows: [
							{
								values: {
									id: { value: idData },
									ts: { value: tsData }
								}
							}
						]
					}
				}
			},
			success: function(res) {
				toast({ color: 'success', content: '删除成功！' });
				hashHistory.goBack();
			}
		});
	};
	// 取消按钮
	handleCancelBtnClick = () => {
		this.setState({
			isEdit: false
		});
		if (this.state.isNew) {
			hashHistory.goBack();
		} else {
			this.setState({
				isEdit: false
			});
			this.repayFormAjax();
		}
	};
	// 返回按钮
	handleGoBackBtnClick = () => {
		hashHistory.goBack();
	};
	// 备注
	handlePlanMemoChange = (e) => {
		let value = e.target.value;
		if (value.length > 200) {
			return false;
		} else {
			this.state.memoNum = MEMONUMBER + value.length;
			this.setState({
				memoNum: this.state.memoNum
			});
			this.tosetState({
				ad: 'headData',
				index: 0,
				name: 'memo',
				value: value
			});
			this.setState({
				headData: this.state.headData
			});
		}
	};
	// 利随本清
	handleIntrstoffbyprcplChange = (e) => {
		let bloo = this.togetState({
			ad: 'headData',
			index: 0,
			name: 'intrstoffbyprcpl'
		});
		if (e) {
			bloo = 1;
		} else {
			bloo = 0;
			this.tosetState({
				ad: 'headData',
				index: 0,
				name: 'interestmny',
				value: ''
			});
			this.tosetState({
				ad: 'headData',
				index: 0,
				name: 'paytotalintst',
				value: 0
			});
			this.tosetState({
				ad: 'headData',
				index: 0,
				name: 'shdpaytotlintstmny',
				value: ''
			});
		}
		this.tosetState({
			ad: 'headData',
			index: 0,
			name: 'intrstoffbyprcpl',
			value: bloo
		});
		this.setState({
			headData: this.state.headData
		});
	};
	// 付累积利息
	handlePaytotalintstChange = (e) => {
		let bloo = this.togetState({
			ad: 'headData',
			index: 0,
			name: 'paytotalintst'
		});
		if (e) {
			bloo = 1;
		} else {
			bloo = 0;
			this.tosetState({
				ad: 'headData',
				index: 0,
				name: 'interestmny',
				value: ''
			});
			this.tosetState({
				ad: 'headData',
				index: 0,
				name: 'shdpaytotlintstmny',
				value: ''
			});
		}
		this.tosetState({
			ad: 'headData',
			index: 0,
			name: 'paytotalintst',
			value: bloo
		});
		this.setState({
			headData: this.state.headData
		});
	};
	//	利息金额
	handleInterestmnyChange = (e) => {
		let itemValue = e.target.value;
		if (itemValue.length > 17) {
			return false;
		}
		let flage = regFun({
			reg: `^[0-9]+(.[0-9]{1,${MNYSCALE}})?$`,
			regData: itemValue
		});
		if (!flage && itemValue.indexOf('.') !== itemValue.length - 1) {
			return false;
		}
		if (itemValue.indexOf('0') === 0 && itemValue.indexOf('.') !== 1) {
			itemValue = Number(itemValue);
		}
		this.tosetState({
			ad: 'headData',
			index: 0,
			name: 'interestmny',
			value: itemValue
		});
		this.setState({
			headData: this.state.headData
		});
	};
	// 应付累计利息
	handleshdpaytotlintstmnyChange = (e) => {
		let itemValue = e.target.value;
		if (itemValue.length > 17) {
			return false;
		}
		let flage = regFun({
			reg: `^[0-9]+(.[0-9]{1,${MNYSCALE}})?$`,
			regData: itemValue
		});
		if (!flage && itemValue.indexOf('.') !== itemValue.length - 1) {
			return false;
		}
		if (itemValue.indexOf('0') === 0 && itemValue.indexOf('.') !== 1) {
			itemValue = Number(itemValue);
		}
		this.tosetState({
			ad: 'headData',
			index: 0,
			name: 'shdpaytotlintstmny',
			value: itemValue
		});
		this.setState({
			headData: this.state.headData
		});
	};
	// 还款日期选择
	handleRepaydateSelect = (value) => {
		this.tosetState({
			ad: 'headData',
			index: 0,
			name: 'repaydate',
			value: moment(value).format(format)
		});
		this.setState({
			headData: this.state.headData
		});
		this.cheackNullFun('repaydate');
	};
	// 还本金额
	handlePlanRepaymnyChange = (e) => {
		// 进行最大还款额限制
		let allShdrepaymny = 0;
		this.state.planData.map((item, index) => {
			allShdrepaymny += item.values['shdrepaymny'].value - 0;
		});
		// let itemValue = numFormatRegExp(e.target.value);
		let itemValue = e.target.value;
		// 输入 小数点 自动在前补零
		if (itemValue.length === 1 && itemValue.indexOf('.') === 0) {
			itemValue = itemValue.replace(/[.]$/, '0.');
			this.tosetState({
				ad: 'headData',
				index: 0,
				name: 'repaymny',
				value: itemValue
			});
			this.setState({
				headData: this.state.headData
			});
			return false;
		}
		let flage = regFun({
			reg: `^[0-9]+(.[0-9]{1,${MNYSCALE}})?$`,
			regData: itemValue
		});
		if (!flage && itemValue.indexOf('.') !== itemValue.length - 1) {
			return false;
		}
		// 计算银团贷款中的实还本金
		this.changeBankRepaymny(itemValue);
		// 输入金额超过应还金额 超出部分进行处理
		if (itemValue - 0 > allShdrepaymny) {
			return false;
		}
		if (itemValue.indexOf('0') === 0 && itemValue.indexOf('.') !== 1) {
			itemValue = Number(itemValue);
		}
		// 输入的还本金额
		let allRepaymny = itemValue - 0;
		let repaymnyAll = itemValue - 0;
		this.tosetState({
			ad: 'headData',
			index: 0,
			name: 'repaymny',
			value: itemValue
		});
		this.state.payPlanListData = [];
		// let mnyData = this.state.unrepaymnyData;
		if (allRepaymny === 0) {
			let index = 0;
			for (let item of this.state.planData) {
				if (Number(item.values['actrepaymny'].value) > 0) {
					item.values['actrepaymny'].value = toFixFun(0, MNYSCALE);
					let planOldData = this.state.payPlanOldListData[index++];
					planOldData['actrepaymny'] = toFixFun(0, MNYSCALE);
				} else {
					break;
				}
			}
			this.state.payPlanListData = this.state.payPlanOldListData;
			this.tosetState({
				ad: 'headData',
				index: 0,
				name: 'unrepaymny',
				value: toFixFun(allShdrepaymny, MNYSCALE)
			});
		} else {
			let index = 0;
			for (let item of this.state.planData) {
				let planOldData = this.state.payPlanOldListData[index++];
				// 每条计划的应还本金
				let itemShdrepaymny = Number(item.values['shdrepaymny'].value);
				this.tosetState({
					ad: 'headData',
					index: 0,
					name: 'unrepaymny',
					value: toFixFun(AccSub(allShdrepaymny, repaymnyAll, MNYSCALE), MNYSCALE)
				});
				if (itemShdrepaymny >= allRepaymny) {
					item.values['actrepaymny'].value = toFixFun(allRepaymny, MNYSCALE);
					planOldData['actrepaymny'] = toFixFun(allRepaymny, MNYSCALE);
					this.state.payPlanListData.push(planOldData);
					break;
				} else if (itemShdrepaymny < allRepaymny) {
					item.values['actrepaymny'].value = toFixFun(itemShdrepaymny, MNYSCALE);
					planOldData['actrepaymny'] = toFixFun(itemShdrepaymny, MNYSCALE);
					allRepaymny = AccSub(allRepaymny, itemShdrepaymny, MNYSCALE);
					this.state.payPlanListData.push(planOldData);
				}
			}
		}
		this.state.payPlanListData = this.setState({
			headData: this.state.headData,
			planData: this.state.planData,
			payPlanListData: this.state.payPlanListData,
			planOldData: this.state.payPlanOldListData
		});
	};
	// 根据还本金额改变银团贷款中还本金额   单据中的还本金额*银团贷款的实际比例
	changeBankRepaymny = (mny) => {
		let { payBankListData, bankData } = this.state;
		payBankListData.map((item, index) => {
			let oldData = bankData[index].values;
			item.actratio = toFixFun(item.actratio, MNYSCALE);
			oldData.actratio.value = item.actratio;
			item.actrepaymny = toFixFun(mny * (item.actratio / 100), MNYSCALE);
			oldData.actrepaymny.value = item.actrepaymny;
		});
		this.setState({
			payBankListData: this.state.payBankListData,
			bankData: this.state.bankData
		});
	};
	// 失去焦点 事件
	handleBlur = (name, scale = 8, e) => {
		let itemValue = e.target.value;
		this.tosetState({
			ad: 'headData',
			index: 0,
			name: name,
			value: toFixFun(itemValue, scale)
		});
		this.setState({
			headData: this.state.headData
		});
		// 注册事件非空校验
		this.cheackNullFun(name);
	};
	// 获取焦点 事件
	handleFocus = (name, e) => {
		let itemValue = e.target.value;
		this.tosetState({
			ad: 'headData',
			index: 0,
			name: name,
			value: toRmZero(itemValue)
		});

		if (name === 'rate' || name === 'repaymny') {
			this.state.isNull[name] = true;
		}
		this.setState({
			isNull: this.state.isNull,
			headData: this.state.headData
		});
	};
	// 还本单据请求
	repayFormAjax = (type) => {
		const _this = this;
		let billID = null;
		if (type === 'list') {
			billID = this.props.location.query.id;
		} else {
			billID = _this.togetState({
				ad: 'headData',
				index: 0,
				name: 'id'
			});
		}
		Ajax({
			url: URL + 'fm/repayprcpl/form',
			data: {
				id: billID
			},
			success: function(res) {
				let resStateData = resDataSort(res);
				_this.setState(resStateData);
				// let mnyData = _this.togetState({
				// 	ad: 'headData',
				// 	index: 0,
				// 	name: 'unrepaymny'
				// });
				let memoData = _this.togetState({
					ad: 'headData',
					index: 0,
					name: 'memo'
				});
				// _this.state.unrepaymnyData = Number(mnyData) - 0;
				_this.state.memoNum = MEMONUMBER - memoData.length;
				_this.setState({
					memoNum: _this.state.memoNum,
					// unrepaymnyData: _this.state.unrepaymnyData
				});
				// console.log(_this.state);
			}
		});
	};
	// 单据状态按钮事件 {1：提交， 2：收回，3：结算，4：下载结算状态，}
	billStateChang = (type) => {
		let stateUrl;
		switch (type) {
			// 提交
			case 1:
				stateUrl = 'fm/repayprcpl/commit';
				break;
			// 收回
			case 2:
				stateUrl = 'fm/repayprcpl/uncommit';
				break;
			// 结算
			case 3:
				stateUrl = 'fm/repayprcpl/settle';
				break;
			// 下载结算状态
			case 4:
				stateUrl = 'fm/repayprcpl/refreshsettle';
				break;
			default:
				break;
		}
		const _this = this;
		let billID = this.togetState({
			ad: 'headData',
			index: 0,
			name: 'id'
		});
		let billTS = this.togetState({
			ad: 'headData',
			index: 0,
			name: 'ts'
		});
		Ajax({
			url: URL + stateUrl,
			data: {
				data: {
					head: {
						rows: [
							{
								values: {
									id: { value: billID },
									ts: { value: billTS }
								}
							}
						]
					}
				}
			},
			success: function(res) {
				let resData = resDataSort(res);
				_this.setState(resData);
				// console.log(_this.state.headData);
			}
		});
	};
	// 金额处理
	mnyFun = (mny) => {
		if (typeof mny === 'string') {
			return Number(mny).formatMoney(MNYSCALE, '', ',', '.');
		} else if (typeof mny === 'number') {
			mny.formatMoney(MNYSCALE, '', ',', '.');
		}
	};
	componentWillMount() {
		switch (this.props.location.query.type) {
			case 'add':
				this.setState({
					isEdit: true,
					isNew: true
				});
				break;
			case 'edit':
				this.setState({
					isEdit: true,
					isNew: false,
					isDisabled: false
				});
				this.repayFormAjax('list');
				break;
			case 'detail':
				this.setState({
					isNew: false
				});
				this.repayFormAjax('list');
				break;
			default:
				// this.repayFormAjax('list');
				break;
		}
		// 注册需要非空校验的字段
		this.cheackNullFun(isNullData);
	}
	// 审批状态选择
	switchStatus1(key) {
		switch (key) {
			case 0:
				return '待提交';
			case 1:
				return '审批通过';
			case 2:
				return '审批中';
			case 3:
				return '待审批';
			default:
				return '待提交';
				break;
		}
	}
	// 结算状态选择
	switchStatus2(key) {
		switch (key) {
			case 0:
				return '待结算';
			case 1:
				return '结算中';
			case 2:
				return '结算成功';
			case 3:
				return '结算失败';
			default:
				return '待结算';
				break;
		}
	}
	// 开关显示选择
	switchDisplay(key) {
		switch (key) {
			case 1:
				return '是';
			case 0:
				return '否';
			default:
				return '';
				break;
		}
	}
	// 开关value选择
	switchValue(key) {
		switch (key) {
			case 1:
				return true;
			case 0:
				return false;
			default:
				return '';
				break;
		}
	}
	render() {
		const _this = this;
		// 还款计划列数据
		const planColumns = [
			{ title: '序号', dataIndex: 'num', key: 'a' },
			{ title: '还款计划编号', dataIndex: 'repayplancode', key: 'b' },
			{ title: '还本日期', dataIndex: 'repaydate', key: 'c' },
			{
				title: '应还本金',
				dataIndex: 'shdrepaymny',
				key: 'd',
				render(text, record, index) {
					return <div>{_this.mnyFun(text)}</div>;
				}
			},
			{
				title: '实还本金',
				dataIndex: 'actrepaymny',
				key: 'e',
				render(text, record, index) {
					return <div>{_this.mnyFun(text)}</div>;
				}
			}
		];
		// 银团贷款列数据
		const bankColums = [
			{ title: '序号', dataIndex: 'num', key: 'a' },
			{ title: '参与银行', dataIndex: 'bankid', key: 'b' },
			{ title: '实际比例%', dataIndex: 'actratio', key: 'c' },
			{
				title: '还本金',
				dataIndex: 'actrepaymny',
				key: 'd',
				render(text, record, index) {
					return <div>{_this.mnyFun(text)}</div>;
				}
			}
		];
		// 银行授信列数据
		const creditColumns = [
			{ title: '序号', dataIndex: 'num', key: 'a', width: 40 },
			{ title: '授信协议', dataIndex: 'ccprotocolid', key: 'b', width: 100 },
			{ title: '授信银行', dataIndex: 'creditbank', key: 'c', width: 180 },
			{ title: '授信类别', dataIndex: 'cctypeid', key: 'd', width: 80 },
			{ title: '释放授信额度', dataIndex: 'releasemny', key: 'e', width: 120 }
		];
		// 担保信息列数据
		const grtColumns = [
			{ title: '序号', dataIndex: 'num', key: 'a', width: 40 },
			{ title: '担保合同', dataIndex: 'grtcontractid', key: 'b', width: 100 },
			{ title: '释放担保金额', dataIndex: 'releasegrtmny', key: 'c', width: 100 },
			{ title: '担保币种', dataIndex: 'grtcurrtypeid', key: 'd', width: 50 },
			{ title: '担保比例%', dataIndex: 'grtratio', key: 'e', width: 50 },
			{ title: '合同开始日期', dataIndex: 'contractstartdate', key: 'f', width: 60 },
			{ title: '合同结束日期', dataIndex: 'contractenddate', key: 'g', width: 60 }
		];
		let headDefData = {};
		if (this.state.headData.length > 0) {
			headDefData = this.state.headData[0].values;
		}
		let {
			loancode = { value: '' },
			repaydate = { value: toDay },
			currtypeid = {
				value: {},
				display: '人民币'
			},
			rate = { value: 1 },
			vbillstatus = { value: 0 },
			repaymny = { value: '' },
			unrepaymny = { value: 0 },
			loanbankid = { value: {} },
			loanbankid_c = { value: '' },
			memo = { value: '' },
			intrstoffbyprcpl = { value: 0 },
			interestmny = { value: '' },
			paytotalintst = { value: 0 },
			shdpaytotlintstmny = { value: '' },
			vbillno = { value: '' },
			settleflag = { value: 0 },
			fininstitutionid = { display: '暂未提供相关金融机构' },
			subfinstitutionid = { display: '暂未提供相关贷款机构' }
		} = headDefData;
		let isApprove = this.props.location.pathname.indexOf('/approve') !== -1;
		let processInstanceId = this.props.location.query.processInstanceId;
		let businesskey = this.props.location.query.businesskey;
		let id = this.props.location.query.id;
		return (
			<div className='fm-repayprcpl-all'>
				<Breadcrumb>
					<Breadcrumb.Item href='#'>首页</Breadcrumb.Item>
					<Breadcrumb.Item>融资</Breadcrumb.Item>
					<Breadcrumb.Item active>还本</Breadcrumb.Item>
				</Breadcrumb>
				<div className='fm-repayprcpl-top'>
					<Row className='margin-0'>
						{isApprove && (
							<ApproveDetail
								processInstanceId={processInstanceId} //之前适配的
								billid={id} //新加的
								businesskey={businesskey} //新加的
							/>
						)}
					</Row>
				</div>
				<div className='fm-repayprcpl'>
					<Row className='fm-repayprcpl-head margin-0'>
						<Col md={4} xs={4} sm={4}>
							<h3 className='fm-repayprcpl-title'>还本</h3>
						</Col>
						{this.state.isEdit ? (
							<Col md={8} xs={8} sm={8}>
								<Button
									className='pull-right margin-left-10 margin-right-5'
									shape='border'
									onClick={this.handleCancelBtnClick}
								>
									取消
								</Button>
								<Button className='pull-right' colors='success' onClick={this.handleSaveBtnClick}>
									保存
								</Button>
							</Col>
						) : (
							<Col md={8} xs={8} sm={8}>
								{!isApprove && (
									<div>
										<Button
											className='pull-right margin-right-5 margin-left-10'
											shape='border'
											onClick={this.handleGoBackBtnClick}
										>
											返回
										</Button>
										{vbillstatus.value === 0 && (
											<Button
												className='pull-right margin-left-10'
												shape='border'
												onClick={this.handleDelBtnClick}
											>
												删除
											</Button>
										)}
										{vbillstatus.value === 0 && (
											<Button
												className='pull-right margin-left-10'
												shape='border'
												onClick={this.handleEditBtnClick}
											>
												修改
											</Button>
										)}
										{vbillstatus.value === 0 && (
											<Button
												className='pull-right margin-left-10'
												onClick={this.billStateChang.bind(this, 1)}
												shape='border'
											>
												提交
											</Button>
										)}
										{vbillstatus.value === 3 && (
											<Button
												className='pull-right margin-left-10'
												onClick={this.billStateChang.bind(this, 2)}
												colors='success'
											>
												收回
											</Button>
										)}
										{vbillstatus.value === 2 && (
											<ApproveDetailButton processInstanceId={processInstanceId} />
										)}
										{vbillstatus.value === 1 ?settleflag.value === 0|| settleflag.value === 3? (
											<Button
												className='pull-right margin-left-10'
												onClick={this.billStateChang.bind(this, 3)}
												colors='success'
											>
												结算
											</Button>):null:null
										}
										{vbillstatus.value === 1 &&
										settleflag.value !== 2 && (
											<Button
												className='pull-right margin-left-10 u-button-border'
												onClick={this.billStateChang.bind(this, 4)}
											>
												下载结算状态
											</Button>
										)}
									</div>
								)}
							</Col>
						)}
					</Row>
					<Row className='margin-0'>
						<Col md={5} xs={5} sm={5}>
							<Row className='left-content padding-top-15 padding-bottom-15'>
								<Col md={12} xs={12} sm={12}>
									<Row>
										<Col className='algin-right' md={3} xs={3} sm={3}>
											<Label className=''>还本编号:</Label>
										</Col>
										<Col md={9} xs={9} sm={9}>
											<div className='text-style'>{vbillno.value}</div>
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>
												<span className='must-edit'>*</span>放款编号:
											</Label>
										</Col>
										<Col className='margin-top-20' md={9} xs={9} sm={9}>
											{this.state.isNew ? (
												<div className='width-240'>
													<Refer
														ctx={'/uitemplate_web'}
														refModelUrl={'/fm/financepayRef/'}
														refCode={'financepayRef'}
														refName={'放款编号'}
														value={this.state.financepayRef}
														onChange={this.handleSelectPayid}
														placeholder='输入放款编号'
														multiLevelMenu={[
															{
																name: [ '放款编号', '贷款机构', '放款金额' ],
																code: [ 'loancode', 'financorgid_n', 'loanmny' ]
															}
														]}
													/>
												</div>
											) : (
												<div className='text-style'>{loancode.value}</div>
											)}
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>
												<span className='must-edit'>*</span>还款日期:
											</Label>
										</Col>
										<Col className='margin-top-20' md={9} xs={9} sm={9}>
											{this.state.isEdit ? (
												<div className='date-content'>
													<DatePicker
														format={format}
														onSelect={this.handleRepaydateSelect}
														locale={zhCN}
														showDateInput={false}
														value={moment(repaydate.value)}
														placeholder={dateInputPlaceholder}
														disabled={this.state.isDisabled}
														renderIcon={() => <i className='iconfont icon-rili' />}
														className={
															this.state.isNull.repaydate ? (
																'width-120'
															) : (
																'width-120 is-null'
															)
														}
													/>
												</div>
											) : (
												<div className='text-style'>{repaydate.value}</div>
											)}
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>
												<span className='must-edit'>*</span>币种:
											</Label>
										</Col>
										<Col className='margin-top-20' md={9} xs={9} sm={9}>
											{this.state.isEdit ? (
												<div
													className={
														this.state.isNull.currtypeid ? (
															'width-120'
														) : (
															' width-120 is-null-else'
														)
													}
												>
													<Refer
														refModelUrl={'/bd/currencyRef/'}
														refCode={'currencyRef'}
														refName={'币种'}
														ctx={'/uitemplate_web'}
														value={{
															refpk: currtypeid.value,
															refname: currtypeid.display
														}}
														disabled={this.state.isDisabled}
														onChange={(value) => {
															currtypeid.value = value.refpk || '';
															currtypeid.display = value.refname || '';
															this.setState({
																headData: this.state.headData
															});
															this.cheackNullFun('currtypeid');
														}}
														className={this.state.isNull.currtypeid ? '' : 'is-null'}
													/>
												</div>
											) : (
												<div className='text-style'>{currtypeid.display}</div>
											)}
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>
												<span className='must-edit'>*</span>本币汇率:
											</Label>
										</Col>
										<Col className='margin-top-20' md={9} xs={9} sm={9}>
											{this.state.isEdit ? (
												<div
													className={
														this.state.isNull.rate ? 'width-120' : ' width-120 is-null-else'
													}
												>
													<FormControl
														name='rate'
														value={rate.value}
														onChange={this.handlePlanRateChange}
														onBlur={this.handleBlur.bind(this, 'rate', RATEeSCALE)}
														onFocus={this.handleFocus.bind(this, 'rate')}
														disabled={this.state.isDisabled}
														ref='input'
														placeholder='请输入本币汇率'
														className={this.state.isNull.rate ? '' : 'is-null'}
													/>
												</div>
											) : (
												<div className='text-style'>{rate.value}</div>
											)}
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>审核状态:</Label>
										</Col>
										<Col className='margin-top-20' md={9} xs={9} sm={9}>
											<div className='text-style'>{this.switchStatus1(vbillstatus.value)}</div>
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>
												<span className='must-edit'>*</span>还本金额:
											</Label>
										</Col>
										<Col className='margin-top-20' md={9} xs={9} sm={9}>
											{this.state.isEdit ? (
												<div
													className={
														this.state.isNull.repaymny ? (
															'width-240'
														) : (
															' width-240 is-null-else'
														)
													}
												>
													<FormControl
														name='repaymny'
														value={repaymny.value}
														onChange={this.handlePlanRepaymnyChange}
														onBlur={this.handleBlur.bind(this, 'repaymny', MNYSCALE)}
														onFocus={this.handleFocus.bind(this, 'repaymny')}
														disabled={this.state.isDisabled}
														ref='input'
														placeholder='请输入还本金额'
														className={this.state.isNull.repaymny ? '' : 'is-null'}
													/>
												</div>
											) : (
												<div className='text-style'>{this.mnyFun(repaymny.value)}</div>
											)}
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>未还本金额:</Label>
										</Col>
										<Col className='margin-top-20' md={9} xs={9} sm={9}>
											<div className='text-style'>{this.mnyFun(unrepaymny.value)}</div>
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>金融机构:</Label>
										</Col>
										<Col className='margin-top-20' md={9} xs={9} sm={9}>
											<div className='text-style'>{fininstitutionid.display}</div>
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>贷款机构:</Label>
										</Col>
										<Col className='margin-top-20' md={9} xs={9} sm={9}>
											<div className='text-style'>{subfinstitutionid.display}</div>
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>借款单位账号:</Label>
										</Col>
										<Col className='margin-top-20' md={9} xs={9} sm={9}>
											{this.state.isEdit ? (
												<Refer
													ctx={'/uitemplate_web'}
													refModelUrl={'/bd/bankaccbasRef/'}
													refCode={'bankaccbasRef'}
													refName={'借款账户'}
													strField={[ { name: '名称', code: 'refname' } ]}
													disabled={this.state.isDisabled}
													placeholder={'请输入借款账户'}
													value={{
														refpk: loanbankid.value,
														refname: loanbankid.display,
														refcode: loanbankid_c.value
													}}
													onChange={(value) => {
														loanbankid.value = value.refpk || '';
														loanbankid.display = value.refcode || '';
														loanbankid_c.value = value.refcode || '';
														this.setState({
															headData: this.state.headData
														});
													}}
													multiLevelMenu={[
														{
															name: [ '子户编码', '子户名称' ],
															code: [ 'refcode', 'refname' ]
														}
													]}
													referFilter={{
														accounttype: 0, //01234对应活期、定期、通知、保证金、理财
														currtypeid: currtypeid.value //币种pk
														// orgid: '' //组织pk
													}}
													referClassName='width-240'
												/>
											) : (
												<div className='text-style'>{loanbankid.display}</div>
											)}
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>结算状态:</Label>
										</Col>
										<Col className='margin-top-20' md={9} xs={9} sm={9}>
											<div className='text-style'>{this.switchStatus2(settleflag.value)}</div>
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>备注:</Label>
										</Col>
										<Col className='margin-top-20' md={9} xs={9} sm={9}>
											{this.state.isEdit ? (
												<div className='text-group'>
													<textarea
														rows='3'
														cols='62'
														name='memo'
														value={memo.value}
														placeholder='请输入备注'
														disabled={this.state.isDisabled}
														maxlength='200'
														className='text-area width-240'
														onChange={this.handlePlanMemoChange}
														style={{ resize: 'none' }}
													/>
													<span className='memo-num'>{this.state.memoNum}/200</span>
												</div>
											) : (
												<div className='text-style'>{memo.value}</div>
											)}
										</Col>
										<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
											<Label className=''>利随本清:</Label>
										</Col>
										<Col className='switch-class margin-top-20' md={9} xs={9} sm={9}>
											{this.state.isEdit ? (
												<Switch
													defaultChecked={this.switchValue(intrstoffbyprcpl.value)}
													checked={this.switchValue(intrstoffbyprcpl.value)}
													onChange={this.handleIntrstoffbyprcplChange}
													checkedChildren={'是'}
													unCheckedChildren={'否'}
													disabled={this.state.isDisabled || !this.state.isEdit}
												/>
											) : (
												<div className='text-style'>
													{this.switchDisplay(intrstoffbyprcpl.value)}
												</div>
											)}
										</Col>
										{intrstoffbyprcpl.value === 1 ? (
											<div>
												<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
													<Label className=''>利息金额:</Label>
												</Col>
												<Col className='margin-top-20' md={9} xs={9} sm={9}>
													{this.state.isEdit &&
													this.state.isNew !== true ? paytotalintst.value === 0 ? (
														<FormControl
															name='interestmny'
															ref='input'
															placeholder='请输入利息金额'
															disabled={this.state.isDisabled}
															value={interestmny.value}
															onChange={this.handleInterestmnyChange}
															onBlur={this.handleBlur.bind(this, 'interestmny', MNYSCALE)}
															onFocus={this.handleFocus.bind(this, 'interestmny')}
															className='width-240'
														/>
													) : (
														<div className='text-style'>
															{this.mnyFun(interestmny.value)}
														</div>
													) : (
														<div className='text-style'>
															{this.mnyFun(interestmny.value)}
														</div>
													)}
												</Col>
												<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
													<Label className=''>付累积利息:</Label>
												</Col>
												<Col className='switch-class margin-top-20' md={9} xs={9} sm={9}>
													{this.state.isEdit ? (
														<Switch
															defaultChecked={this.switchValue(paytotalintst.value)}
															checked={this.switchValue(paytotalintst.value)}
															onChangeHandler={this.handlePaytotalintstChange}
															checkedChildren={'是'}
															unCheckedChildren={'否'}
															disabled={this.state.isDisabled || !this.state.isEdit}
														/>
													) : (
														<div className='text-style'>
															{this.switchDisplay(paytotalintst.value)}
														</div>
													)}
												</Col>
												<Col className='algin-right margin-top-20' md={3} xs={3} sm={3}>
													<Label className=''>应付累计利息:</Label>
												</Col>
												<Col className='margin-top-20' md={9} xs={9} sm={9}>
													{this.state.isEdit &&
													this.state.isNew !== true ? paytotalintst.value === 1 ? (
														<FormControl
															name='shdpaytotlintstmny'
															ref='input'
															placeholder='请输入应付累计利息金额'
															disabled={this.state.isDisabled}
															value={shdpaytotlintstmny.value}
															onChange={this.handleshdpaytotlintstmnyChange}
															onBlur={this.handleBlur.bind(
																this,
																'shdpaytotlintstmny',
																MNYSCALE
															)}
															onFocus={this.handleFocus.bind(this, 'shdpaytotlintstmny')}
															className='width-240'
														/>
													) : (
														<div className='text-style'>
															{this.mnyFun(shdpaytotlintstmny.value)}
														</div>
													) : (
														<div className='text-style'>
															{this.mnyFun(shdpaytotlintstmny.value)}
														</div>
													)}
												</Col>
											</div>
										) : null}
									</Row>
								</Col>
							</Row>
						</Col>
						<Col md={7} xs={7} sm={7} className='padding-right-40'>
							<Tabs className='tabs' defaultActiveKey='plan'>
								<TabPane tab='还款计划' key='plan'>
									<Table
										emptyText={() => (
											<div>
												<img src={nodataPic} alt='' />
											</div>
										)}
										className='bd-table'
										rowKey='num'
										columns={planColumns}
										data={this.state.payPlanListData}
										scroll={{ y: true, y: 360 }}
									/>
								</TabPane>
								{this.state.bankData.length > 0 ? (
									<TabPane tab='银团贷款' key='bank'>
										<Table
											emptyText={() => (
												<div>
													<img src={nodataPic} alt='' />
												</div>
											)}
											className='bd-table'
											columns={bankColums}
											data={this.state.payBankListData}
											scroll={{ y: true, y: 360 }}
										/>
									</TabPane>
								) : null}
								{this.state.creditData.length > 0 ? (
									<TabPane tab='银行授信' key='credit'>
										<Table
											emptyText={() => (
												<div>
													<img src={nodataPic} alt='' />
												</div>
											)}
											className='bd-table'
											columns={creditColumns}
											data={this.state.payCreditListData}
										/>
									</TabPane>
								) : null}
								{this.state.grtData.length > 0 ? (
									<TabPane tab='担保信息' key='grt'>
										<Table
											emptyText={() => (
												<div>
													<img src={nodataPic} alt='' />
												</div>
											)}
											className='bd-table'
											columns={grtColumns}
											data={this.state.payGrtListData}
										/>
									</TabPane>
								) : null}
							</Tabs>
						</Col>
					</Row>
				</div>
				<MsgModal
					onConfirm={this.delFun}
					onCancel={this.handleDelBtnClick}
					content='是否删除？'
					show={this.state.modalShow}
				/>
			</div>
		);
	}
}
