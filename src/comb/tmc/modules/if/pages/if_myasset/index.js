import React, { Component } from 'react';
import {
	Breadcrumb,
	Con,
	Row,
	Col,
	Dropdown,
	Button,
	Table,
	Icon,
	FormControl,
	Popconfirm,
	Pagination,
	Modal,
	Select,
	Tile
} from 'tinper-bee';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import Alert from 'bee-alert';
import { Link } from 'react-router';
import DatePicker from 'bee-datepicker';
import moment from 'moment';
import Ajax from '../../../../utils/ajax.js';
import Tabs, { TabPane } from 'bee-tabs';
import { toast } from '../../../../utils/utils.js';
import InputForm from '../../containers/modalForm';
import Myassetmodal from '../../containers/myassetmodal/index';
import Lookmodal from '../../containers/Lookmodal/index';
import Writemodal from '../../containers/Writemodal/index';
import PageJump from '../../../../containers/PageJump';
import SideModal from 'containers/SideModal';
import AssetModal from '../../containers/AssetModal';
import './index.less';
//const bank = ["全部", "广发银行", "上海银行", "浦发银行", "工商银行"];

const balance = 0;
const yestProfit = 465.0;
const rank = 3;

//请求路劲
const rootURL = window.reqURL.fm + 'fm/';
//切换页签接口
const taburl = [
	{ title: 'accountcenter', url: rootURL + 'subscribe/searchAppendAcc', name: '账户中心' },
	{ title: 'accountmessage', url: rootURL + 'transtype/search', name: '账户信息' },  //不请求数据，直接引用账户中心的账户列表即可
	{ title: 'assetstate', url: rootURL + 'subscribe/search', name: '申赎状态' },
	{ title: 'holdasset', url: rootURL + 'subscribe/search1', name: '持有资产' },
	// { title: 'historyasset', url: rootURL + 'subscribe/search2', name: '历史资产' },
	{ title: 'recordout', url: rootURL + 'transferacc/findTransferDetailAll', name: '转出状态' },
	{ title: 'expend', url: rootURL + 'interests/queryInvestAccs', name: '激活状态' },
	{ title: 'totleincome', url: rootURL + 'subscribe/searchSubscribeDetail', name: '申购状态' },
	{ title: 'profit', url: rootURL + 'redemption/search', name: '赎回状态' },
	{ title: 'recordcenter', url: rootURL + 'transferacc/findTransferDetailAll', name: '转入状态' },
	{ title: 'redeem', url: rootURL + 'redemption/search', name: '赎回状态' }
];

const modalColumns = [
	{ title: '转入金额', key: 'code', type: 'inchange' },
	{ title: '转出金额', key: 'name', type: 'outchange' }
	// { title: "项目类型", key: "classifyid", type: "ref",
	//   ref: {refModelUrl: "/bd/projectRef", refCode: "/bd/project", refName: "项目类型"} },
	// { title: "备注", key: "remark", type: "string" },
	//下拉框示例：
	//{ title: "属性", key: "attr", type: "drop-down", items: [{value: 0, name: "银企联云"}, {value: 1, name: "银企直联"}] }
];

//账户信息数据
const accountMessage = [
	{ card: '3360 2419 3005 1006', balance: '￥123,1231,456', bank: '建设分行', class: 'bgone' },
	{ card: '3360 2419 3005 1006', balance: '￥123,1231,456', bank: '建设分行', class: 'bgtwo' }
];
export default class Myasset extends Component {
	//按照返回数据重新定义state数据
	constructor() {
		super();
		this.state = {
			childEacctno: '',  //明细查询传递给子的参数
			assetstatus: '',
			assetId: '', //赎回传入ID
			activeKey: 'accountcenter', //竖直tabs默认显示页签
			defaultTab: 'expend',  //状态查询显示tab
			newUrl: '', //最近请求路劲
			accentData: '', //最近渲染表格
			start: 0,
			showModal: false,
			showModal1: false,
			showModal2: false,
			showModal3: false,
			hotProvoder: '上海银行提供',
			yestDayIncome: [],
			totleIncome: [],
			banks: [],
			accountMessage: [], //账户信息银行卡数据
			keyWords: '', //模糊搜索关键字
			selBank: 0,
			balance: balance,
			yestProfit: yestProfit,
			isEyeOpen: false,
			rank: rank,
			shiftStatus: '', //分页时根据此状态值传不同的参数
			turnindata: [],
			turnout: [],
			modallook: [],
			defaultSelectValue:'',
			eacctnameshow:'',
			lastincometimeshow:'',
			resdata: {}, //向下一个页面传递的值
			modalColumns: {
				//父子组件数据传递中间件
				accountbalance: '1',
				moneyaccpunt: '123456484654', //理财账户跳转传过来
				assetproduct: '天猫',
				account: '',
				accountbalance: '',
				eacctno: '',
				eacctname: '',
				acctbank: ''
			},
			modalColumnsToChild: {
				//父子组件数据传递中间件
				accountbalance: '1',
				moneyaccpunt: '123456484654', //理财账户跳转传过来
				assetproduct: '天猫',
				account: '',
				accountbalance: '',
				eacctno: '',
				eacctname: '',
				acctbank: ''
			},
			pageinfo: {
				number: 0, //当前第几页
				numberOfElements: 0, //当页多少条数据
				size: 10, //每页数据的数量
				totalElements: 0, //总记录条数
				totalPages: 1 //总页数
			},

			assetModalShow: false, //查看按钮 的弹出层
			assetModalData: null, //查看按钮 的弹出层的数据
			operation: '', //弹出层类型
			//账户中心
			accountcenter: {
				accountcentercolumns: [
					{
						title: '名称/代码',
						key: 'prdcode',
						dataIndex: 'prdcode.display',
						width: 150,
						render: (text, record, index) => {
							return (
								<div>
									<span
										onClick={e => this.editDone('edit', index, text, record, e)}
										style={{ cursor: 'pointer' }}
									>
										{text}
									</span>
								</div>
							);
						}
					},
					{ title: '名称', key: 'prdname', dataIndex: 'values.prdname.display', width: 150, },
					{ title: '投资金额(元)', key: 'amtmoney', dataIndex: 'values.amtmoney.display', width: 150 },
					{ title: '累计收益(元)', key: 'incomeamt', dataIndex: 'values.incomeamt.display', width: 150 },
					{ title: '已赎回金额', key: 'redemptionedamt', dataIndex: 'values.redemptionedamt.display', width: 150 },
					{ title: '银行名称', key: 'accpay_name', dataIndex: 'values.accpay_name.display', width: 150 },
					{ title: '状态', key: 'subscribestatus', dataIndex: 'values.subscribestatus.display', width: 100 },
					{
						title: '操作',
						key: 'cz',
						width: 150,
						render: (text, record, index) => {
							return (
								<div className="u-btntree">
									<Button className="callback" onClick={e => this.assetBack(index, text, record)}>
										赎回
									</Button>
									<Button className="callback" onClick={e => this.handlelinktodetail(index, text, record)}>
										申购
									</Button>
									<Button className="callback" onClick={this.handlelook.bind(this, record)}>
										查看
									</Button>
								</div>
							);
						}
					}
				],
				accountcenterdata: []
			},
			historyasset: {
				historycolumns: [
					{ title: '序号', key: 'index', dataIndex: 'key', width: 70 },
					{
						title: '代码',
						key: 'prdcode',
						dataIndex: 'prdcode.display',
						width: 100,
						render: (text, record, index) => {
							return (
								<div>
									<span
										onClick={e => this.editDone('edit', index, text, record, e)}
										style={{ cursor: 'pointer' }}
									>
										{text}
									</span>
								</div>
							);
						}
					},
					{ title: '名称', key: 'prdname', dataIndex: 'prdname.display', width: 100 },
					{ title: '投资金额(元)', key: 'amtmoney', dataIndex: 'amtmoney.display', width: 150 },
					{ title: '累计收益(元)', key: 'subscriber', dataIndex: 'subscriber.display', width: 300 },
					{ title: '已赎回金额', key: 'redemptionedamt', dataIndex: 'redemptionedamt.display', width: 300 },
					{ title: '银行名称', key: 'accpay_name', dataIndex: 'accpay_name.display', width: 300 },
					{ title: '状态', key: 'subscribestatus', dataIndex: 'subscribestatus.display', width: 300 }
				],
				historyassetdata: []
			},
			//记录中心转入
			recordcenter: {
				recordcolumns: [
					{ title: '转入账户名／账户', key: 'payaccname', dataIndex: 'payaccname', width: 100 },
					{
						title: '转出理财户名／账户',
						key: 'recaccname',
						dataIndex: 'recaccname',
						width: 200,
						render: (text, record, index) => {
							return (
								<div>
									<span
										onClick={e => this.editDone('edit', index, text, record, e)}
										style={{ cursor: 'pointer' }}
									>
										{text}
									</span>
								</div>
							);
						}
					},
					{ title: '转入金额', key: 'money', dataIndex: 'money', width: 100 },
					{ title: '转入时间', key: 'eventdate', dataIndex: 'eventdate', width: 200 },
					{ title: '结算状态', key: 'settlestatus', dataIndex: 'settlestatus', width: 100 }
				],
				recordcenterdata: []
			},
			//记录中心转出
			recordout: {
				recordcenter_outcolumns: [
					{ title: '转出理财户名／账户', key: 'recaccname', dataIndex: 'recaccname', width: 100 },
					{
						title: '转入账户名／账户',
						key: 'payaccname',
						dataIndex: 'payaccname',
						width: 200,
						render: (text, record, index) => {
							return (
								<div>
									<span
										onClick={e => this.editDone('edit', index, text, record, e)}
										style={{ cursor: 'pointer' }}
									>
										{text}
									</span>
								</div>
							);
						}
					},
					{ title: '转出金额', key: 'money', dataIndex: 'money', width: 100 },
					{ title: '转出时间', key: 'eventdate', dataIndex: 'eventdate', width: 200 },
					{ title: '结算状态', key: 'settlestatus', dataIndex: 'settlestatus', width: 100 }
				],
				recordoutdata: []
			},
			//激活状态
			expend: {
				expendcolumns: [
					{ title: '理财账户名', key: 'eacctname', dataIndex: 'eacctname.value', width: 100 },
					{
						title: '理财账户',
						key: 'eacctno',
						dataIndex: 'eacctno.value',
						width: 100,
						render: (text, record, index) => {
							return (
								<div>
									<span
										onClick={e => this.editDone('edit', index, text, record, e)}
										style={{ cursor: 'pointer' }}
									>
										{text}
									</span>
								</div>
							);
						}
					},
					{ title: '激活时间', key: 'creationtime', dataIndex: 'creationtime.value', width: 100 },
					{ title: '激活状态', key: 'accstatus', dataIndex: 'accstatus.value', width: 200 }
				],
				expenddata: []
			},
			//申购状态
			totleincome: {
				totleincomecolumns: [
					{ title: '名称/代码', key: 'index', dataIndex: 'key', width: 100 },
					{
						title: '年化利率',
						key: 'rate',
						dataIndex: 'rate.display',
						width: 150,
						render: (text, record, index) => {
							return (
								<div>
									<span
										onClick={e => this.editDone('edit', index, text, record, e)}
										style={{ cursor: 'pointer' }}
									>
										{text}
									</span>
								</div>
							);
						}
					},
					{ title: '投资金额(元）', key: 'amtmoney', dataIndex: 'amtmoney.value', width: 150 },
					{ title: '投资账户/投资账号', key: 'accpay_name', dataIndex: 'accpay_name.value', width: 200 },
					{ title: '操作人', key: 'banktype', dataIndex: 'irated.value', width: 150 },
					{ title: '申购时间', key: 'subscribetime', dataIndex: 'subscribetime.value', width: 200 },
					{ title: '审核状态', key: 'subscribestatus', dataIndex: 'subscribestatus.value', width: 200 }
					// { title: '转入时间', key: 'orgid', dataIndex: 'orgid.display', width: 200 }
				],
				totleincomedata: []
			},
			//赎回状态
			profit: {
				profitcolumns: [
					{ title: '名称/代码', key: 'index', dataIndex: 'key', width: 100 },
					{
						title: '赎回账户名',
						key: 'code',
						dataIndex: 'code.display',
						width: 100,
						render: (text, record, index) => {
							return (
								<div>
									<span
										onClick={e => this.editDone('edit', index, text, record, e)}
										style={{ cursor: 'pointer' }}
									>
										{text}
									</span>
								</div>
							);
						}
					},
					{ title: '赎回账户', key: 'name', dataIndex: 'name.display', width: 150 },
					{ title: '赎回金额', key: 'memo', dataIndex: 'memo.display', width: 150 },
					{ title: '赎回时间', key: 'banktype', dataIndex: 'banktype.display', width: 150 },
					{ title: '审核状态', key: 'bankid', dataIndex: 'bankid.display', width: 150 }
					// { title: '币种', key: 'orgid', dataIndex: 'orgid.display', width: 200 },
					// { title: '转入时间', key: 'orgid', dataIndex: 'orgid.display', width: 200 }
				],
				profitdata: []
			},
			// 激活状态
			activation: {
				activationcolumns: [
					{ title: '理财账户名', key: 'index', dataIndex: 'key', width: 100 },
					{ title: '理财账户', key: 'prdcode', dataIndex: 'prdcode.display', width: 150 },
					{ title: '激活时间', key: 'activationdate', dataIndex: 'activationdate.display', width: 200 },
					{ title: '激活状态', key: 'activationtype', dataIndex: 'activationtype.display', width: 100 }
				]
			},
			//申赎状态
			assetstate: {
				assetstatecolumns: [
					{ title: '序号', key: 'index', dataIndex: 'key', width: 100 },
					{ title: '产品编码', key: 'prdcode', dataIndex: 'prdcode.display', width: 150 },
					{
						title: '产品名称',
						key: 'prdname',
						dataIndex: 'prdname.display',
						width: 150,
						render: (text, record, index) => {
							return (
								<div>
									<span
										onClick={e => this.editDone('edit', index, text, record, e)}
										style={{ cursor: 'pointer' }}
									>
										{text}
									</span>
								</div>
							);
						}
					},
					{ title: '投资金额(元)', key: 'amtmoney', dataIndex: 'amtmoney.display', width: 100 },
					{ title: '投资账号', key: 'accpay_code', dataIndex: 'accpay_code.display', width: 200 },
					{ title: '操作人', key: 'subscriber', dataIndex: 'subscriber.display', width: 100 },
					// { title: '申购信息', key: 'bankid', dataIndex: 'bankid.display', width: 300 },
					{ title: '审核信息', key: 'subscribestatus', dataIndex: 'subscribestatus.display', width: 200 }
				],
				assetstatedata: []
			},
			//赎回状态
			redeem: {
				redeemcolumns: [
					{ title: '序号', key: 'index', dataIndex: 'key', width: 50 },
					{
						title: '产品名称',
						key: 'prdname',
						dataIndex: 'prdname.display',
						width: 150,
						render: (text, record, index) => {
							return (
								<div>
									<span
										onClick={e => this.editDone('edit', index, text, record, e)}
										style={{ cursor: 'pointer' }}
									>
										{text}
									</span>
								</div>
							);
						}
					},
					{ title: '产品编码', key: 'prdcode', dataIndex: 'prdcode.display', width: 100 },
					{ title: '赎回金额(元)', key: 'redemptionamt', dataIndex: 'redemptionamt.display', width: 150 },
					{ title: '累计收益(元)', key: 'memo', dataIndex: 'memo.display', width: 100 },
					{ title: '赎回时间', key: 'redemptiontime', dataIndex: 'redemptiontime.display', width: 200 },
					{ title: '赎回状态', key: 'redemptstatus', dataIndex: 'redemptstatus.display', width: 200 }
				],
				redeemdata: []
			}
		};
		// this.that=this;
	}

	//模糊查询操作Enter
	handleSearchChange = e => {
		this.setState({
			keyWords: event.target.value
		});
		if (e.keyCode == 13) {
			this.serchTable();
		}
	};
	//根据不同状态筛选表格数据
	handleSearchClick = e => {
		this.serchTable();
	};
	//账户中心点击申购按钮
	handlelinktodetail = (text, record, index) => {
		this.props.router.push({
			pathname: '/if/detail',
			state: {
				detailName: record.values.prdname.value,
				detailCode: record.values.prdcode.value,
				custcode: this.state.modalColumns.custcode,
				eacctno: this.state.modalColumns.eacctno ? this.state.modalColumns.eacctno : this.state.modalColumnsToChild.eacctno,
				eacctname: this.state.modalColumns.eacctname ? this.state.modalColumns.eacctname : this.state.modalColumnsToChild.eacctname
			}
		});
	};
	serchTable = () => {
		let that = this;
		let updateUrl = rootURL + 'subscribe/searchByAcc'
		//模糊查询数据
		Ajax({
			url: updateUrl,
			data: {
				pageIndex: 0,
				pageSize: 10,
				eacctno: this.state.modalColumns.eacctno,
				keyWords: this.state.keyWords
			},
			success: res => {
				const { data, message, success } = res;
				if (success) {
					if (!res.data) {
						toast({ content: '您所查询的数据不存在，请重新输入', color: 'success' });
						return;
					}
					let assetData = res.data.head.rows;
					assetData.forEach((item, index) => {
						item.key = index;
					});
					that.setState(
						{
							accountcenter: {
								//columns: headColumns,
								accountcenterdata: assetData
							},
							pageinfo: res.data.head.pageinfo
						},
						() => {
							// console.log('state', that.state);
						}
					);
					toast({ content: '查询成功...', color: 'success' });
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};

	// 处理后台返回的数据
	dataFormat = data => {
		let result = [];
		data.map((item, index) => {
			item.values.key = index + 1;
			result.push(item.values);
		});

		return result;
	};
	// 处理后台返回的数据
	dataFormatMore = data => {
		let result = [];
		if (!data) {  //后端返回数据跟其他不一样，前端处理
			return [];
		}
		data.map((item, index) => {
			item.key = index + 1;
			result.push(item);
		});
		return result;
	};
	//数据求和
	addNumber = (data, listtype) => {
		if (data.length != 0) {
			let totleIncome = 0;
			data.map(item => {
				for (let key in item.values) {
					if (key === listtype) {
						totleIncome += parseFloat(item.values[key].display);
					}
				}
			});
			return totleIncome;
		}
	};

	//针对申赎状态特殊处理
	dataFormatasset = data => {
		let result = [];
		data.map((item, index) => {
			// item.values.key = index + 1;
			for (let key in item.values) {
				if (key === 'subscribestatus') {
					let display = ''; //状态信息
					switch (item.values[key].display) {
						case '0':
							display = '申购提交';
							break;
						case '1':
							display = '申购成功';
							break;
						case '2':
							display = '申购失败';
							break;
						case '3':
							display = '完全赎回';
							break;
					}
					item.values[key].display = display;
				}
			}

			result.push(item.values);
		});

		return result;
	};
	//针对赎回状态数据解析
	dataFormatback = data => {
		let result = [];
		data.map((item, index) => {
			item.values.key = index + 1;
			for (let key in item.values) {
				if (key == 'redemptstatus') {
					let display = ''; //状态信息
					switch (item.values[key].display) {
						case '0':
							display = '赎回提交';
							break;
						case '1':
							display = '赎回成功';
							break;
						case '2':
							display = '赎回失败';
							break;
					}
					item.values[key].display = display;
				}
			}
			result.push(item.values);
		});

		return result;
	};

	//转入转出赎回按钮控制
	changeIn = (eacctno) => {
		if (eacctno != '' && eacctno != undefined) {
			let modalColumns  = this.state.banks;
			for (let i = 0; i < modalColumns.length; i++) {
				if (eacctno == modalColumns[i].eacctno) {
					this.setState({
						showModal: true,
						operation: 'inType',
						modalColumnsToChild: {
							//父子组件数据传递中间件
							accountbalance: modalColumns[i].balance,
							eacctno: modalColumns[i].eacctno,
							eacctname: modalColumns[i].eacctname,
							acctbank: modalColumns[i].acctbank,
							account: modalColumns[i].account,
							moneyaccpunt: '123456484654', //理财账户跳转传过来
							assetproduct: '天猫',
							custcode: modalColumns[i].custcode,
						},
					})
					return;
				}
			}
		} else {
			let defaultModalColumns = this.state.modalColumns;
			this.setState({
				showModal: true,
				operation: 'inType',
				modalColumnsToChild: {
					//父子组件数据传递中间件
					accountbalance: defaultModalColumns.balance,
					eacctno: defaultModalColumns.eacctno,
					eacctname: defaultModalColumns.eacctname,
					acctbank: defaultModalColumns.acctbank,
					account: defaultModalColumns.account,
					moneyaccpunt: '123456484654', //理财账户跳转传过来
					assetproduct: '天猫',
					custcode: defaultModalColumns.custcode,
				},
			});
		}
	};

	changeOut = (eacctno) => {
		if (eacctno != '' && eacctno != undefined) {  //账户信息转入转出
			let modalColumns  = this.state.banks;
			for (let i = 0; i < modalColumns.length; i++) {
				if (eacctno == modalColumns[i].eacctno) {
					this.setState({
						showModal: true,
						operation: 'outType',
						modalColumnsToChild: {
							//父子组件数据传递中间件
							accountbalance: modalColumns[i].balance,
							eacctno: modalColumns[i].eacctno,
							eacctname: modalColumns[i].eacctname,
							acctbank: modalColumns[i].acctbank,
							account: modalColumns[i].account,
							moneyaccpunt: '123456484654', //理财账户跳转传过来
							assetproduct: '天猫',
							custcode: modalColumns[i].custcode,
						},
					})
					return;
				}
			}
		} else {  //账户中心转入转出
			let defaultModalColumns = this.state.modalColumns;
			this.setState({
				showModal: true,
				operation: 'outType',
				modalColumnsToChild: {
					//父子组件数据传递中间件
					accountbalance: defaultModalColumns.balance,
					eacctno: defaultModalColumns.eacctno,
					eacctname: defaultModalColumns.eacctname,
					acctbank: defaultModalColumns.acctbank,
					account: defaultModalColumns.account,
					moneyaccpunt: '123456484654', //理财账户跳转传过来
					assetproduct: '天猫',
					custcode: defaultModalColumns.custcode,
				},
			});
		}
	};
	changeDetailed = (e) => {
		Ajax({
			url: rootURL + 'transferacc/findTransferDetailAll',
			data: {
				page: '0',
				size: '10',
				"searchParams": {
					"searchMap": {
						"bankaccount": e.eacctno,
						"direct":"0"
					} 
				} 
			},
			success: res => {
				this.setState(
					{
						turnindata: res.data.data,
						childEacctno: e.eacctno
					},
					() => {
					}
				);
			},
			error: res => {
			}
		});
		this.setState({
			showModal1: true
		});
	};
	//赎回请求数据传入模态框显示
	assetBack = (text, record, index) => {
		let assetId = record.values.id.value;
		this.setState({
			showModal: true,
			operation: 'assetback',
			assetId: assetId,
			modalColumnsToChild: {
				//父子组件数据传递中间件
				eacctname: record.values.prdname.value,
				accountbalance: this.state.balance,
			},
		});
	};

	//对用户提交数据处理
	submitMessage = (newData, opre) => {
		if (Array.isArray(newData) && newData.length != 0) {
			let data;
			let url;
			if (opre == 'assetback') {
				data = {
					subscribeid: this.state.assetId,
					amount: '',
					type: ''
				};
				newData.map(item => {
					if (item.name == 'amount') {
						data.amount = item.value;
					} else if (item.name == 'type') {
						data.type = item.value;
					}
				});
				url = rootURL + 'redemption/volSubmit';
			} else if (opre == 'inType') {
				let toChildren = this.state.modalColumnsToChild;
				data = {
					recaccnumid: toChildren.eacctno, //(收款账户id)
					recaccname: toChildren.eacctname, //(收款账户名称)
					payaccnumid: toChildren.account, //(付款账户id)
					payaccname: toChildren.acctbank, //(付款账户名称)
					money: newData[0].value, //（金额）
					custcode: toChildren.eacctno
				};
				url = rootURL + 'transferacc/transfer';
			} else {
				let toChildren = this.state.modalColumnsToChild;
				data = {
					recaccnumid: toChildren.eacctno, //(收款账户id)
					recaccname: toChildren.eacctname, //(收款账户名称)
					payaccnumid: toChildren.account, //(付款账户id)
					payaccname: toChildren.acctbank, //(付款账户名称)
					money: newData[0].value, //（金额）
					custcode: toChildren.custcode
				};
				url = rootURL + 'transferacc/transfer';
			}
			Ajax({
				url: url,
				data,
				success: function(res) {
					if (res.success) {
						toast({ color: 'success', content: res.data.message });
					} else {
						toast({ color: 'warning', content: res.message.message });
					}
				}
			});
		}
	};

	//点击确定按钮拿到用户输入的信息发送到后台
	handleSubmit = (newData, opre) => {
		//接受子组建数据发送请求到后台
		this.submitMessage(newData, opre);
		//确认后关闭窗口
		this.setState({
			showModal: false
		});
	};
	//点击取消按钮
	close = type => {
		this.state.operation = type;
		this.setState({
			showModal: false
		});
	};
	handleSubmit1 = () => {
		// Ajax({
		//     url:rootURL+'transferacc/findTransferDetail',
		//     data:'0',
		//     success:(res)=>{
		//         console.log(res)
		//         this.setState({
		//         })
		//     },
		//     error:(res)=>{
		//         console.log(res)
		//     }
		// })
	};
	handleSubmit2 = () => {};
	close1 = () => {
		this.setState({
			showModal1: false
		});
	};
	close2 = () => {
		this.setState({
			showModal2: false
		});
	};
	close3 = () => {
		this.setState({
			showModal3: false
		});
	};
	close4 = () => {};
	getAssetData = (eacctno) => {
		let that = this;
		let pageIndex = 0;
		let pageSize = 10;
		// 请求主表信息
		Ajax({
			url: rootURL + 'subscribe/searchByAcc',
			data: {
				pageIndex,
				pageSize,
				eacctno: eacctno,
			},
			success: function(res) {
				if (!res.data) {
					that.setState({
						accountcenter: {
							accountcenterdata: []
						},
						balance: 0,
						yestDayIncome: [],
						pageinfo:  {  //后端返回数据跟其他不一样，前端处理
							number: 0, //当前第几页
							numberOfElements: 0, //当页多少条数据
							size: 10, //每页数据的数量
							totalElements: 0, //总记录条数
							totalPages: 1 //总页数
						}
					})
					return;
				};
				let assetData = res.data.head.rows;
				let accountdata=[]
				assetData.forEach((item, index) => {
					item.key = index;
					accountdata.push(item.values)
					return accountdata
				});
				that.setState(
					{
						resdata: res,       
						yestDayIncome: assetData, //累计收益数额
						totleIncome: assetData,
						accountcenter: {
							//...that.state.accountcenter,
							accountcenterdata: assetData
						},
						pageinfo: res.data.head.pageinfo,
						//初始化请求路劲和资源跟新最新分页信息
						 newUrl: rootURL + 'subscribe/searchByAcc',
						 accentData: 'accountcenter'
					},
					() => {
						console.log('错误')
					}
				);
			}
		});
	};
	componentWillMount() {
		let pageIndex = this.state.pageinfo.number;
		let pageSize = this.state.pageinfo.size;
		Ajax({
			url:rootURL+'subscribe/searchAppendAcc',
			data:{
				pageIndex,
				pageSize
			},
			success:(res)=>{
				//默认显示第一个
				let accmessage = res.data;
				let lastincome=accmessage[0].lastincome;
				let lastincometime=accmessage[0].lastincometime;
				let banktype_name=accmessage[0].banktype_name;
				let balance = accmessage[0].balance;
				let custcode = accmessage[0].custcode; //客户编码
				let eacctname = accmessage[0].eacctname; //理财账号名称
				let eacctno = accmessage[0].eacctno; //理财账号
				let account = accmessage[0].account; //对公活期账号
				let acctbank = accmessage[0].acctbank; //对公活期账户名称
				this.getAssetData(eacctno);  //table列表数据请求
				this.setState({
					lastincometimeshow:lastincometime,
					lastincome:lastincome,
					banks:accmessage,
					balance: balance, //跟新账户余额
					defaultSelectValue: banktype_name,
					eacctnameshow:eacctname,
					modalColumns: {
						//父子组件数据传递中间件
						accountbalance: balance,
						eacctno: eacctno,
						eacctname: eacctname,
						acctbank: acctbank,
						account: account,
						moneyaccpunt: '123456484654', //理财账户跳转传过来
						assetproduct: '天猫',
						custcode: custcode
					},
				},()=>{
					//console.log(this.state.selectvalue)
				})
			}
		});
	}
	componentDidMount() {
		//点击查询跳转查看申述状态
		if (this.props.location.state) {
			//跳转后请求对应页签的数据
			let activeKey = 'assetstate';
			let urltitle = rootURL + '/subscribe/search';
			let pageIndex = this.state.pageinfo.number;
			let pageSize = this.state.pageinfo.size;
			var datasource = {
				pageIndex,
				pageSize
			};
			this.updatepage(activeKey, urltitle, datasource);
			//页面跳转交互
			this.setState({
				...this.state,
				activeKey: 'assetstate'
			});
		}
	}
	//切换银行请求账户余额,同时跟新传入账户值
	handleBankChange = e => {
		let prices = this.state.banks;
		for (var value of prices) {
			if (value.eacctno == e) {
				//根据此字段判断选择的哪一个账户，如用其他字段，改变即可
				this.getAssetData(value.eacctno);
				this.setState({
					...this.state,
					balance: value.balance,
					eacctnameshow: value.eacctname,
					lastincometimeshow:value.lastincometime,
					defaultSelectValue: value.banktype_name+" "+value.eacctname,
					modalColumns: {
						//父子组件数据传递中间件
						accountbalance: value.balance,
						eacctno: value.eacctno,
						eacctname: value.eacctname,
						acctbank: value.acctbank,
						account: value.account,
						moneyaccpunt: '123456484654', //理财账户跳转传过来
						custcode: value.custcode
					}
				});
				return;
			}
		}
		//每次请求还是一次返回，前台处理后续商量
		// this.setState({selBank: e,balance:balance});
	};

	handleEye = () => {
		this.setState(preState => ({ isEyeOpen: !preState.isEyeOpen }));
	};

	//切换页签请求数据更新页面
	updatepage = (e, urltitle, datasource) => {
		//存储请求路径为分页提供请求路径
		this.setState({
			newUrl: urltitle,
			accentData: e
		});
		let that = this;
		if (e == 'accountmessage') {  //不请求，直接引用账户中心里的账户信息
			return;
		}
		if (e == 'expend' && e != this.state.defaultTab)  {  //判断进入的状态查询是哪一个，如不为第一个则重新赋值
			e = this.state.defaultTab
		}
		Ajax({
			url: urltitle,
			data: datasource,
			success: function(res) {
				if (urltitle.indexOf('findTransferDetailAll') > 0) {
					if (!res.data.data) {
						that.setState({
							[e]: {
								...that.state[e],
								[e + 'data']: []
							},
							pageinfo:  {  //后端返回数据跟其他不一样，前端处理
								number: 0, //当前第几页
								numberOfElements: 0, //当页多少条数据
								size: 10, //每页数据的数量
								totalElements: 0, //总记录条数
								totalPages: 1 //总页数
							}
						})
						return;
					};
					let DetailData = res.data.data;
					that.setState(
						{
							[e]: {
								...that.state[e],
								[e + 'data']: DetailData
							},
							pageinfo:  {  //后端返回数据跟其他不一样，前端处理
								number: Number(res.data.number) ? Number(res.data.number) : 0, //当前第几页
								numberOfElements: Number(res.data.numberOfElements) ? Number(res.data.numberOfElements) : 0, //当页多少条数据
								size: Number(res.data.size) ? Number(res.data.size) : 10, //每页数据的数量
								totalElements: Number(res.data.totalElements) ? Number(res.data.totalElements) : 0, //总记录条数
								totalPages: Number(res.data.totalPages) ? Number(res.data.totalPages) : 1 //总页数
							}
						},
						() => {
							console.log('state', that.state);
						}
					);
				} else {
					if (!res.data) {
						that.setState({
							[e]: {
								...that.state[e],
								[e + 'data']: []
							},
							pageinfo:  {
								number: 0, //当前第几页
								numberOfElements: 0, //当页多少条数据
								size: 10, //每页数据的数量
								totalElements: 0, //总记录条数
								totalPages: 1 //总页数
							}
						})
						return;
					};
					let asset = res.data.head;  //判断一下是否有rows，如果没有则跳过，否则会报错
					if (!asset) {
						return;
					}
					let assetData = asset.rows;
					assetData.forEach((item, index) => {
						item.key = index;
					});

					that.setState(
						{
							[e]: {
								...that.state[e],
								[e + 'data']: assetData
							},
							pageinfo: res.data.head.pageinfo
						},
						() => {
							console.log('state', that.state);
						}
					);
				}
			}
		});
		if (urltitle.indexOf('searchAppendAcc') > 0 && this.state.modalColumns.eacctno != '') {  //切换到账户中心请求列表数据
			this.getAssetData(this.state.modalColumns.eacctno);
		}
	};
	//竖直Tabs
	onChange = activeKey => {
		let defaultTab = this.state.defaultTab;
		let urltitle;
				
		// 根据不同页签请求不同数据
		let pageIndex = this.state.pageinfo.number;
		let pageSize = this.state.pageinfo.size;
		let page = this.state.pageinfo.number;
		let size = this.state.pageinfo.size;
		var datasource = {};
		
		if (activeKey == 'expend' && defaultTab != activeKey) {  //判断进入哪一个状态查询，请求哪一个数据
			for (var index of taburl) {
				if (index.title == defaultTab) {
					urltitle = index.url;
					break;
				}
			}
			if (defaultTab == 'recordout' || defaultTab == 'recordcenter') {  //判断转入转入，传参不同
				let direct;
				direct = defaultTab == 'recordout' ? direct = 1 : direct = 0;
				datasource = {
					page,
					size,
					searchParams: {
						searchMap: {
							bankaccount: this.state.modalColumns.eacctno, //暂时写死，后续更改为 this.state.modalColumns.eacctno
							direct: direct
						}
					}
				};
			} else {
				datasource = {
					pageIndex,
					pageSize
				};
			}
		} else {
			for (var index of taburl) {
				if (index.title == activeKey) {
					urltitle = index.url;
					break;
				}
			}
			datasource = {
				pageIndex,
				pageSize
			};
		}
		this.updatepage(activeKey, urltitle, datasource);
		this.setState({
			activeKey,
			shiftStatus: activeKey
		});
	};

	onTabClick = key => {
		if (key === this.state.activeKey) {
			this.setState({
				activeKey: ''
			});
		}
	};

	//横向tab页签切换请求数据渲染页面
	callback = e => {
		let urltitle;
		for (var index of taburl) {
			if (index.title == e) {
				urltitle = index.url;
			}
		}
		this.setState({
			//传入分页不同tab的参数
			shiftStatus: e,
			defaultTab: e
		});
		// 根据不同页签请求不同数据
		let pageIndex = 0;
		let pageSize = 10;
		let status = this.state.assetstatus;
		let page = 0;
		let size = 10;
		let datasource = {};
		if (e == 'redeem') {
			datasource = {
				pageIndex,
				pageSize,
				status
			};
		} else {
			if (e == 'recordout') {
				datasource = {
					page,
					size,
					searchParams: {
						searchMap: {
							bankaccount: this.state.modalColumns.eacctno, //暂时写死，后续更改为 this.state.modalColumns.eacctno
							direct: '1'
						}
					}
				};
			} else if (e == 'recordcenter') {
				datasource = {
					page,
					size,
					searchParams: {
						searchMap: {
							bankaccount: this.state.modalColumns.eacctno, //暂时写死，后续更改为 this.state.modalColumns.eacctno
							direct: '0'
						}
					}
				};
			} else {
				datasource = {
					pageIndex,
					pageSize
				};
			}
		}
		this.updatepage(e, urltitle, datasource)
	};
	//分页操作
	getHeadData = () => {
		let url = this.state.newUrl;
		let that = this;
		let updateData = this.state.accentData;
		//分页判断是哪一个的tab，因转入转出传参不同
		let pageIndex = this.state.newUrl.indexOf('findTransferDetailAll') == -1 ? 'pageIndex' : 'page';
		let pageSize = this.state.newUrl.indexOf('findTransferDetailAll') == -1 ? 'pageSize' : 'size';
		let directStatus =
			this.state.shiftStatus == 'recordout' ? '1' : this.state.shiftStatus == 'recordcenter' ? '0' : '';
		let searchParams = {};
		searchParams.searchMap = {
			bankaccount: this.state.modalColumns.eacctno, //暂时写死，后续更改为  this.state.modalColumns.eacctno
			direct: directStatus
		};
		if (directStatus == '') {
			Ajax({
				//url: URL + 'fm/contract/delete',
				url: url,
				data: {
					[pageIndex]: this.state.pageinfo.number,
					[pageSize]: this.state.pageinfo.size
				},
				success: function(res) {
					//console.log(res.data.data.data.head);
					let assetData = res.data.head.rows;
					// let bodysData = res.data.data.data.bodys['银行贷款信息'].rows;
					assetData.forEach((item, index) => {
						item.key = index;
						//item.values[id].display=index;
					});
					that.setState(
						{
							[updateData]: {
								//columns: headColumns,
								...that.state[updateData],
								[updateData + 'data']: assetData
							},
							pageinfo: res.data.head.pageinfo
						},
						() => {
							console.log('state', that.state);
						}
					);
				},
				error: function(res) {}
			});
		} else {
			Ajax({
				//url: URL + 'fm/contract/delete',
				url: url,
				data: {
					[pageIndex]: this.state.pageinfo.number,
					[pageSize]: this.state.pageinfo.size,
					searchParams
				},
				success: function(res) {
					let DetailData = res.data.data;
					that.setState(
						{
							[updateData]: {
								//columns: headColumns,
								...that.state[updateData],
								[updateData + 'data']: DetailData
							},
							pageinfo:  {  //后端返回数据跟其他不一样，前端处理
								number: Number(res.data.number) ? Number(res.data.number) : 0, //当前第几页
								numberOfElements: Number(res.data.numberOfElements) ? Number(res.data.numberOfElements) : 0, //当页多少条数据
								size: Number(res.data.size) ? Number(res.data.size) : 10, //每页数据的数量
								totalElements: Number(res.data.totalElements) ? Number(res.data.totalElements) : 0, //总记录条数
								totalPages: Number(res.data.totalPages) ? Number(res.data.totalPages) : 1 //总页数
							}
						},
						() => {
							console.log('state', that.state);
						}
					);
				},
				error: function(res) {}
			});
		}
	};

	// 改变分页大小
	//不同表分页请求不同url
	// handlePageSizeSelect = (value, pageClass, e) => {
	//     console.log(value)
	//     console.log(pageClass)
	//     console.log(e)
	//     this.setState(
	//         {
	//             pageinfo: {
	//                 ...this.state.pageinfo,
	//                 size: pageClass - 0,
	//                 number: 0
	//             }
	//         },
	//         this.getHeadData
	//     );
	// };
	// 改变分页大小
	handlePageSizeSelect = pageSize => {
		this.setState(
			{
				pageinfo: {
					...this.state.pageinfo,
					size: pageSize - 0,
					number: 0
				}
			},
			this.getHeadData
		);
	};

	handlePageSelect = index => {
		this.setState(
			{
				pageinfo: {
					...this.state.pageinfo,
					number: index - 1
					//size: this.state.pageinfo.size
				}
			},
			this.getHeadData
		);
	};
	//查看申购赎回记录
	handlelook = (data) => {
		this.setState({
			assetModalShow: true,
			assetModalData: data
		});
	};

	//账户录入
	handleidmodal = () => {
		this.setState({
			showModal3: true
		});
	};
	render() {
		let {
			modalColumns,
			showModal,
			hotProvoder,
			yestDayIncome,
			totleIncome,
			banks,
			balance,
			yestProfit,
			rank,
			isEyeOpen,
			defaultSelectValue,
			eacctnameshow,
			lastincometimeshow,
			modalColumnsToChild,
			defaultTab
		} = this.state;
		let { accountcentercolumns, accountcenterdata } = this.state.accountcenter; //账户中心
		let { historycolumns, historyassetdata } = this.state.historyasset; //历史资产
		let { recordcolumns, recordcenterdata } = this.state.recordcenter; //记录中心
		let { assetstatecolumns, assetstatedata } = this.state.assetstate; //申赎状态
		let { recordcenter_outcolumns, recordoutdata } = this.state.recordout; //转出
		let { expendcolumns, expenddata } = this.state.expend; //转出
		let { totleincomecolumns, totleincomedata } = this.state.totleincome; //收入
		let { profitcolumns, profitdata } = this.state.profit; //收入
		let { redeemcolumns, redeemdata } = this.state.redeem; //赎回状态
		return (
			<div style={{ margin: 10 }} id="ifmyasset">
				<Col md={12} xs={12} sm={12}>
					{/* <BreadCrumbs items={breads} /> */}
					<Breadcrumb>
						<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
						<Breadcrumb.Item href="#">投资理财</Breadcrumb.Item>
						<Breadcrumb.Item active>我的资产</Breadcrumb.Item>
					</Breadcrumb>
				</Col>
				<Tabs
					activeKey={this.state.activeKey}
					tabBarPosition="left"
					defaultActiveKey="accountcenter"
					onChange={this.onChange}
					style={{ height: 580 }}
				>
					<TabPane
						tab={
							<span>
								<Icon className="iconfont icon-zhanghuzhongxin iconfont-left" />账户中心
							</span>
						}
						key="accountcenter"
						className="tablogo"
					>
						<Row id="tophead">
							<Col md={4} xs={4} sm={4}>
								<Row className="welcome">
									<Col componentClass="label" className="label" xs={12}>
										<Col componentClass="span" className="title welcomeshow" xs={10}>
											欢迎,{eacctnameshow}！
										</Col>
										<Col xs={2} style={{ height: 5 }}>
											{isEyeOpen ? (
												<Icon
													className="iconfont icon-chakan"
													onClick={this.handleEye.bind(this)}
												/>
											) : (
												<Icon
													className="iconfont icon-guanbi1"
													onClick={this.handleEye.bind(this)}
												/>
											)}
										</Col>
									</Col>
									<Row>
										<Col md={6} xs={6} sm={6} >
											<Select
												value={defaultSelectValue}
												onChange={this.handleBankChange}
												className="banks"
											>
												{banks.map((bank, index) => {
													return (
														<Option  className='banschild' key={index} value={bank.eacctno}>
															{bank.banktype_name}{bank.eacctno}
														</Option>
													);
												})}
											</Select>
										</Col>
										<Col
											md={5}
											xs={5}
											sm={5}
											xsOffset={0}
											smOffset={0}
											className="nomargin"
											style={{ marginTop: 5 }}
										>
											余额：<span className="coin">
												￥{isEyeOpen ? balance : '*********'}
											</span>
										</Col>
										<Col md={11} xs={11} sm={11}>
											<Col md={2} xs={2} sm={2}>
												<Button
													shape="round"
													size="mg"
													className="cturnin"
													onClick={() => this.changeIn('')}
												>
													转入
												</Button>
											</Col>
											<Col md={2} xs={2} sm={2}>
												<Button
													shape="round"
													size="mg"
													className="cturnout"
													onClick={() => this.changeOut('')}
												>
													转出
												</Button>
											</Col>
										</Col>
									</Row>
								</Row>
							</Col>
							<Col md={4} xs={4} sm={4}>
								<Row className="yesterdayincome">
									<Col componentClass="label" className="label" xs={12}>
										<Col componentClass="span" className="title" xs={5}>
											上次收益(元)									
										</Col>
										<Col componentClass="span" className="title" xs={5}>
											上次收益时间
										</Col>
									</Col>
									<Col componentClass="label" className="labelnubmer" xs={12}>
										<Col componentClass="span" className="title" xs={4}>
											{this.addNumber(banks, 'lastincome')}
										</Col>
										<Col componentClass="span" className="title" xs={5}>
											{lastincometimeshow}
										</Col>
									</Col>
									<Col componentClass="label" className="incometotle" xs={12}>
										{/* <Col componentClass="span" className="title titlebody" xs={4}>
										</Col> */}
										{/* <Col xs={8} componentClass="span" className="content">
											{this.addNumber(totleIncome, 'redemptionedamt')}
										</Col> */}
									</Col>
								</Row>
							</Col>
							<Col md={4} xs={4} sm={4}>
								<Row className="totleinvest">
									<Col componentClass="label" className="label" xs={12}>
										<Col componentClass="span" className="title" xs={5}>
											投资总金额(元)
										</Col>
									</Col>
									<Col componentClass="label" className="labelnubmer" xs={12}>
										<Col componentClass="span" className="title" xs={5} xsOffset={1}>
											{this.addNumber(yestDayIncome, 'amtmoney')}
										</Col>
									</Col>
									<Col componentClass="label" className="incometotle" xs={12}>
										{/* <Col componentClass="span" className="title" xs={4}>
											待定
										</Col>
										<Col xs={8} componentClass="span" className="content">
											{this.addNumber(totleIncome, 'redemptionedamt')}
										</Col> */}
									</Col>
								</Row>
							</Col>
						</Row>
						<Row>
							<Col md={3} xs={3} xsPush={9} className="searchInput">
								<FormControl
									value={this.state.keyWords}
									onChange={this.handleSearchChange.bind(this)}
									onKeyUp={this.handleSearchChange.bind(this)}
									placeholder="搜索产品关键词"
								/>
								<Icon type="uf-search" onClick={this.handleSearchClick.bind(this)} />
							</Col>
						</Row>
						<Row style={{ paddingLeft: 15 }}>
							<Tabs
								defaultActiveKey="holdasset"
								onChange={this.callback}
								tabBarStyle="upborder"
								className="demo-tabs"
							>
								<TabPane tab="投资台账" key="holdasset">
									<Table
										columns={accountcentercolumns}
										data={accountcenterdata}
										style={{ height: 338 }}
									/>
									{this.state.assetModalShow && (
										<SideModal
											showModal={true}
											close={() => {
												this.setState({
													assetModalShow: false
												});
											}}
											title={"投资明细"}
										>
                                            <AssetModal 
                                                data={this.state.assetModalData} 
                                                customercode={this.state.modalColumns.custcode}
                                            />
										</SideModal>
									)}
								</TabPane>
							</Tabs>
						</Row>
						<PageJump
							onChangePageSize={this.handlePageSizeSelect}
							onChangePageIndex={this.handlePageSelect}
							totalSize={this.state.pageinfo.totalElements}
							activePage={this.state.pageinfo.number + 1}
							maxPage={this.state.pageinfo.totalPages}
							pageSize={this.state.pageinfo.size}
						/>
					</TabPane>
					<TabPane
						tab={
							<span>
								<Icon className="iconfont iconfont-left icon-zhanghuxinxi" />账户信息
							</span>
						}
						key="accountmessage"
					>
						<ul>
							<li className="titleName">
								账户信息
								<Button className="btnwirtein" onClick={this.handleidmodal}>
									账户录入
								</Button>
								<span className="wirteinicon iconfont icon-tishianniutixing" />
								<span className="wirteinspan">如果你开户后中断，可以在这里进行补录账户信息</span>
							</li>
							<li className="bodycontainer">
								<Row>
									{banks.map((e, list) => {
										let addclass = e.class;
										return (
											<Col xs={6} md={6} lg={6} className='bodycontainerchild'>
												<Col componentClass="label" className="" xs={12}>
													<Col componentClass="span" className="" xs={3} />
													<Col componentClass="span" className="cardname" xs={5}>
														卡号
													</Col>
												</Col>
												<Col componentClass="span" className="" xs={12}>
													<Col componentClass="span" className="" xs={3} />
													<Col className="cardnumber" xs={8}>
														{e.eacctno}
													</Col>
												</Col>
												<Col componentClass="span" className="" xs={3} />
												<Col style={{ marginTop: 10 }} className="cardname" xs={4}>
													<Col componentClass="span" xs={12}>
														余额
													</Col>
													<Col componentClass="span" style={{ marginTop: 10 }} xs={12}>
														{e.balance}
													</Col>
												</Col>
												<Col style={{ marginTop: 10 }} className="cardname" xs={4}>
													<Col componentClass="span" xs={12}>
														开户行
													</Col>
													<Col componentClass="span" style={{ marginTop: 10 }} xs={12}>
														{e.banktype_name}
													</Col>
												</Col>{' '}
												<Col componentClass="span" className="" xs={3} />
												<Col style={{ marginTop: -5 }} className="bdcardbank" xs={9}>
													{e.acctbank}
												</Col>
												<Col
													md={11}
													xs={11}
													sm={11}
													xsOffset={3}
													sm={3}
													smOffset={3}
													style={{ marginTop: 15 }}
												>
													<Col>
														<Button
															shape="round"
															size="mg"
															className="turnin btnleft"
															onClick={() => this.changeIn(e.eacctno)}
														>
															转入
														</Button>
														<Button
															shape="round"
															size="mg"
															className="turnout btnleft"
															onClick={() => this.changeOut(e.eacctno)}
														>
															转出
														</Button>
														<Button
															shape="round"
															size="mg"
															className="turnout btnleft"
															onClick={() => this.changeDetailed(e)}
														>
															明细
														</Button>
													</Col>
												</Col>
											</Col>
										);
									})}
									{/* <Col xs={12} md={12} lg={12}>
                                        <Col md={5} xs={5} sm={5} xsPush={4} >
                                            <Button shape="round" size="mg" colors="primary" onClick={(this.changeIn.bind(this))}>转入</Button>
                                        </Col>
                                        <Col md={3} xs={3} sm={3} xsPush={3}>
                                            <Button shape="round" size="mg" colors="primary" onClick={(this.changeOut.bind(this))}>转出</Button>
                                        </Col>
                                    </Col> */}
								</Row>
							</li>
						</ul>
					</TabPane>
					<TabPane
						tab={
							<span>
								<Icon className="iconfont iconfont-left icon-jiluzhongxin" />状态查询
							</span>
						}
						key="expend"
						className="tablogo"
					>
						<ul>
							<li className="titleName">状态查询</li>
							<li>
								<Tabs
									activeKey={defaultTab}
									onChange={this.callback}
									tabBarStyle="upborder"
									className="demo-tabs"
								>
									<TabPane tab="激活状态" key="expend">
										<Table
											columns={expendcolumns}
											data={this.dataFormat(expenddata)}
											style={{ height: 360 }}
										/>
									</TabPane>
									<TabPane tab="申购状态" key="totleincome">
										<Table
											columns={totleincomecolumns}
											data={this.dataFormat(totleincomedata)}
											style={{ height: 360 }}
										/>
									</TabPane>
									<TabPane tab="赎回状态" key="profit">
										<Table
											columns={profitcolumns}
											data={this.dataFormat(profitdata)}
											style={{ height: 360 }}
										/>
									</TabPane>
									<TabPane tab="转入状态" key="recordcenter">
										<Table
											columns={recordcolumns}
											data={this.dataFormatMore(recordcenterdata)}
											style={{ height: 360 }}
										/>
									</TabPane>
									<TabPane tab="转出状态" key="recordout">
										<Table
											columns={recordcenter_outcolumns}
											data={this.dataFormatMore(recordoutdata)}
											style={{ height: 360 }}
										/>
									</TabPane>
								</Tabs>
							</li>
							<li>
								<PageJump
									onChangePageSize={this.handlePageSizeSelect}
									onChangePageIndex={this.handlePageSelect}
									totalSize={this.state.pageinfo.totalElements}
									activePage={this.state.pageinfo.number + 1}
									maxPage={this.state.pageinfo.totalPages}
									pageSize={this.state.pageinfo.size}
								/>
							</li>
						</ul>
					</TabPane>
				</Tabs>

				<InputForm
					columns={modalColumnsToChild}
					showModal={showModal}
					opre={this.state.operation}
					// modalData={{}}
					onClose={this.close}
					// onRefresh={this.refresh}
					onSubmit={this.handleSubmit}
				/>
				<Myassetmodal
					showModal={this.state.showModal1}
					opre={this.state.operation1}
					// modalData={{}}
					onClose={this.close1}
					// onRefresh={this.refresh}
					onSubmit={this.handleSubmit1}
					turnindata={this.state.turnindata}
					eacctno={this.state.childEacctno}
					onClose4={this.close4}
				/>
				{/* <Lookmodal
                showModal={this.state.showModal2}
                opre={this.state.operation2}
                onClose={this.close2}
                onSubmit={this.handleSubmit2}
                modallook={this.state.modallook}
                /> */}
				<Writemodal showModal={this.state.showModal3} onClose={this.close3} />
			</div>
		);
	}
}
