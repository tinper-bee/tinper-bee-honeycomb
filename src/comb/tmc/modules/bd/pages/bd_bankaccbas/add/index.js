import React, { Component } from 'react';
import {
	Icon,
	Input,
	Checkbox,
	Select,
	Popconfirm,
	Menu,
	Table,
	Dropdown,
	Modal,
	Button,
	FormControl,
	Row,
	Col,
	Message,
	Form,
	FormGroup,
	Label,
	Animate,
	Radio,
	Breadcrumb,
	InputGroup
} from 'tinper-bee';
import InputRender from 'bee-table/build/render/InputRender.js';
import DateRender from 'bee-table/build/render/DateRender';
import SelectRender from 'bee-table/build/render/SelectRender';
import DatePicker from 'bee-datepicker';
import CitySelect from 'bee-city-select';
import Refer from '../../../../../containers/Refer';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import moment from 'moment';
import Ajax from '../../../../../utils/ajax';
import { numFormat, toast, sum } from '../../../../../utils/utils.js';
import './index.less';
import TextArea from '../../../../fm/pages/fm_applycard/TextareaItem';
const accounttypeList = [
	{ key: '活期', value: 0 },
	{ key: '定期', value: 1 },
	{ key: '通知', value: 2 },
	{ key: '保证金', value: 3 },
	{ key: '理财', value: 4 }
]; //编辑态表格中下拉列表用

let count = 1; //新增子表时编tempid用
export default class Add extends Component {
	constructor() {
		super();
		this.state = {
			head: {
				data: {
					id: { display: '', value: null }, // 主表的主键
					code: { display: '', value: null }, // 账户
					name: { display: '', value: null }, // 默认按开户公司显示，可改
					bankid: { display: '', value: null }, // 开户行 参照金融网点
					banktype: { display: '', value: null }, // 银行类别, 参照金融机构档案，下拉参照
					orgid: { display: '', value: null }, // 开户公司，参照组织
					opentime: { display: '', value: null }, // 开户时间
					memo: { display: '', value: null }, //备注
					net_enablestatus: { display: '否', value: 0 }, //网银开通状态
					net_code: { display: '', value: null }, //人行联行行号
					net_name: { display: '', value: null }, //人行联行名称
					net_area: { display: '', value: null }, //开户地区
					net_province: { display: '', value: null }, //省份
					net_city: { display: '', value: null }, //城市
					// 银行网点需要的隐藏字段
					// 银行网点code
					fininstitutioncode: {
						display: '',
						value: null
					},
					// // 金融机构名称
					// fininstitutionname: {
					// 	display: '',
					// 	value: null
					// },
					// // 金融机构id
					// fininstitutionid: {
					// 	display: '',
					// 	value: null
					// },
					// // 银行网点name
					// branchname: {
					// 	display: '',
					// 	value: null
					// },
					// // 银行网点id
					// branchid: {
					// 	display: '',
					// 	value: null
					// },
					// 银行网点phone
					branchphone: {
						display: '',
						value: null
					},
					// 银行网点address
					branchaddress: {
						display: '',
						value: null
					}
				}
			},
			body: {
				columns: [
					{
						title: '序号',
						key: 'id',
						dataIndex: 'key',
						width: 50
					},
					{
						title: '子户编码',
						key: 'code.display',
						dataIndex: 'code.value',
						width: 100,
						render: (text, record, index) => {
							return this.state.editable ? (
								<InputRender
									value={text}
									isclickTrigger={true}
									onChange={(e) => this.onValueChange(index, 'code', e)}
								/>
							) : (
								this.state.body.data[index].code.value || ''
							);
						}
					},
					{
						title: '子户名称',
						key: 'name',
						dataIndex: 'name.value',
						width: 100,
						render: (text, record, index) => {
							return this.state.editable ? (
								<InputRender
									value={text}
									isclickTrigger={true}
									onChange={(e) => this.onValueChange(index, 'name', e)}
								/>
							) : (
								this.state.body.data[index].name.value || ''
							);
						}
					},
					{
						title: '币种',
						key: 'currtypeid',
						dataIndex: 'currtypeid.value',
						width: 50,
						render: (text, record, index) => {
							return this.state.editable ? (
								<Refer
									ctx={'/uitemplate_web'}
									refModelUrl={'/bd/currencyRef/'}
									refCode={'currencyRef'}
									refName={'币种'}
									value={this.state.currency[index] || {}}
									onChange={(value) => this.handleRefChange(index, value)}
								/>
							) : (
								this.state.currency[index] && this.state.currency[index].refname
							);
						}
					},
					{
						title: '账户类型',
						key: 'accounttype',
						dataIndex: 'accounttype.display',
						width: 50,
						render: (text, record, index) => {
							return this.state.editable ? (
								<SelectRender
									isclickTrigger={true}
									value={text || ''}
									onChange={(value) => this.onValueChange(index, 'accounttype', value)}
									dataSource={accounttypeList}
								>
									<Option value={0}>活期</Option>
									<Option value={1}>定期</Option>
									<Option value={2}>通知</Option>
									<Option value={3}>保证金</Option>
									<Option value={4}>理财</Option>
								</SelectRender>
							) : (
								this.state.body.data[index].accounttype.display
							);
						}
					},
					{
						title: '期初余额',
						key: 'balance',
						dataIndex: 'balance.value',
						width: 100,
						render: (text, record, index) => {
							return this.state.editable ? (
								<InputRender
									value={text ? Number(text).toFixed(2) : 0.0}
									format="Currency"
									isclickTrigger={true}
									onChange={(e) => this.onValueChange(index, 'balance', e)}
								/>
							) : (
								this.state.body.data[index].balance.value
							);
						}
					}
					// {
					// 	title: '操作',
					// 	key: 'cz',
					// 	width: 50,
					// 	render: (text, record, index) => {
					// 		return this.state.editable ? (
					// 			<div>
					// 				{/* 删除 */}
					// 				<span >
					// 					<Popconfirm content="确认删除?" onClose={() => this.delRow(index)}>
					// 						<Icon className="iconfont icon-shanchu icon-style" />
					// 					</Popconfirm>
					// 				</span>
					// 			</div>
					// 		) : null;
					// 	}
					// }
				],
				data: []
			},
			editable: true,
			headId: null, //主表的id
			currency: [], //币种参照
			banktype: {}, //银行类别参照
			bankid: {}, //开户行参照
			orgid: {}, //财务组织参照
			sendFlag: true //发送数据请求时开关
		};

		// 给后台发送的数据结构及内容
		this.sendData = {
			data: {
				head: {
					rows: [
						{
							rowId: null,
							status: 1, //状态status(0 不变,1 修改,2 新增,3 删除)，
							values: {}
						}
					]
				},
				body: {
					rows: []
				}
			}
		};
	}

	componentDidMount() {
		console.log('上一页传递过来的信息', this.props.location.state); //里面存了id对象
		this.state.editable = true;
		if (this.props.location.query.type === 'edit') {
			// 如果是通过点击"修改"按钮进入的页面，把上个页面传过来的info存入到state中,然后读取state中的数据显示在页面表格中
			// info中需要有当前点击的主表的这一行，以及对应的子表
			// 获取主表的 this.props.location.state.id;//id是个对象，id.value 作为子表的parentid
			console.log('主表对应的id值', this.props.location.state.id.value);

			Ajax({
				url: window.reqURL.bd + 'bd/bankaccbas/form',
				data: {
					id: this.props.location.state.id.value
				},
				success: (res) => {
					const { data, message, success } = res;
					console.log('页面加载时请求回来的数据', data);
					if (success) {
						let headData = data.head.rows[0].values;
						let bodyData = [];
						data.body &&
							data.body.rows.forEach((item, index) => {
								item.values.key = index + 1; //增加key属性，索引+1，作为序号
								bodyData.push(item.values);
								this.state.currency[index] = {
									refname: item.values.currtypeid.display, //这里后台数据修改后改成display
									refpk: item.values.currtypeid.value
								}; // 币种参照
								if (item.values.accounttype != null && item.values.accounttype.value != null) {
									item.values.accounttype.display =
										accounttypeList[item.values.accounttype.value].key; //下拉列表账户类型display显示转换
								}
							});
						this.setState(
							{
								head: {
									...this.state.head,
									data: headData
								},
								body: {
									...this.state.body,
									data: bodyData
								},
								headId: data.head.rows[0].values.id.value,
								banktype: {
									refname: data.head.rows[0].values.banktype.display, //这里后台数据修改后改成display
									refpk: data.head.rows[0].values.banktype.value
								}, //银行类别参照
								bankid: {
									refname: data.head.rows[0].values.bankid.display, //这里后台数据修改后改成display
									refpk: data.head.rows[0].values.bankid.value
								}, //开户行参照
								orgid: {
									refname: data.head.rows[0].values.orgid.display, //这里后台数据修改后改成display
									refpk: data.head.rows[0].values.orgid.value
								} //财务组织参照
							},
							() => {
								console.log('请求数据后的state', this.state);
								// 主表有修改，this.sendData.data.head.rows[0].status变成1，数据存在state中，主表无修改，不需要给后台传了
								// this.sendData.data.head.rows[0].status = 1;
								let headData = this.state.head.data;
								// this.sendData.data.head.rows[0].values = {};
								for (var attr in headData) {
									this.sendData.data.head.rows[0].values[attr] = { value: headData[attr].value };
								}
								// 列表页点修改跳转，直接保存时报错修改，需要测试验证
								var index = 0;
								bodyData.map((itemBody) => {
									let values = {};
									for (let attr in itemBody) {
										values[attr] = itemBody[attr];
									}
									this.sendData.data.body.rows.push({
										rowId: this.state.body.data[index].id.value,
										status: 1,
										values
									});
									index++;
								});
								console.log('请求数据后的sendData', this.sendData);
							}
						);
					} else {
						toast({ content: message.message, color: 'warning' });
					}
				},
				error: (res) => {
					console.log(res);
					toast({ content: res.message, color: 'danger' });
				}
			});
		} else if (this.props.location.query.type === 'add') {
			this.addRow();
		}
	}
	// 设置开户行银行信息
	setnetbankdata(bankid) {
		const page = 0;
		const size = 10;
		const searchParams = {
			searchMap: {
				id: bankid
			}
		};
		Ajax({
			url: window.reqURL.bd + 'bd/finbranch/' + 'search',
			data: {
				page,
				size,
				searchParams
			},
			success: (res) => {
				const { data, message, success } = res;
				if (success) {
					const head = data.head;
					if (head && head.rows.length > 0) {
						const values = head.rows[0].values;

						// this.state.head.data.net_code = {
						// 	value: values.code ? values.code.value : null
						// };
						// this.state.head.data.net_name = {
						// 	value: values.name ? values.name.value : null
						// };
						this.state.head.data.net_province = {
							value: values.province ? values.province.value : null
						};
						this.state.head.data.net_area = {
							value: values.province ? values.province.value : null
						};
						this.state.head.data.net_city = {
							value: values.city ? values.city.value : null
						};
						this.setState({
							head: {
								...this.state.head,
								data: {
									...this.state.head.data
								}
							}
						});
					}
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	}
	// 修改主表
	headHandleChange = (value, key) => {
		// value 输入的值 key 修改的字段的名称
		this.setState(
			{
				head: {
					...this.state.head,
					data: {
						...this.state.head.data,
						[key]: {
							display: value,
							value
						}
					}
				}
			},
			() => {
				console.log('主表内容修改后的state', this.state);
				// 主表有修改，this.sendData.data.head.rows[0].status变成1，数据存在state中，主表无修改，不需要给后台传了
				// this.sendData.data.head.rows[0].status = 1;
				let headData = this.state.head.data;
				this.sendData.data.head.rows[0].values = {};
				for (var attr in headData) {
					if (attr === 'banktype' || attr === 'bankid' || attr === 'orgid') {
						this.sendData.data.head.rows[0].values[attr] = {
							display: headData[attr].display,
							value: headData[attr].value
						};
					} else {
						this.sendData.data.head.rows[0].values[attr] = { value: headData[attr].value };
					}
				}
				console.log('主表内容修改后的sendData', this.sendData);
			}
		);
	};

	// 选择日期
	onDateSelect = (d) => {
		// console.log(d.format('YYYY-MM-DD'));
		if (!d) return;
		this.setState(
			{
				head: {
					...this.state.head,
					data: {
						...this.state.head.data,
						opentime: { display: d.format('YYYY-MM-DD'), value: d.format('YYYY-MM-DD') }
					}
				}
			},
			() => {
				console.log('选择日期后的state', this.state);
			}
		);
		this.sendData.data.head.rows[0].values.opentime = { value: d.format('YYYY-MM-DD') };
		console.log('选择日期后的sendData', this.sendData);
	};

	// 选择子表的参照
	handleRefChange = (index, value) => {
		console.log(index, value); //index 修改的子表的索引 value 选中参照的信息对象 value: {id: "null", refcode: "null", refpk: "KRW", refname: "韩元"}
		if (!value.refpk) return;
		this.state.body.data[index].currtypeid = {
			display: value.refname,
			value: value.refpk
		};
		this.state.currency[index] = value;
		this.forceUpdate();
		// 在sendData中记录这一次的修改信息
		// 遍历sendData.body.rows中已有的项,如果rowId找到了当前编辑的子表id,只需要在原有的基础上修改，找不到这加一条记录进去
		let bodyItemData = this.state.body.data[index];
		if (this.state.body.data[index].id) {
			// 有id,表示是后台保存过的记录，本次编辑是修改原有的原有的记录而不是修改新增的记录，使用status 1表示修改
			// isExistItem 值为从要发送给后台的数据中找到的这一条记录或者undefined，表示之前是否修改过改记录还没保存
			let isExistItem = this.sendData.data.body.rows.find((item) => {
				return item.rowId == this.state.body.data[index].id.value;
			});
			let values = {};
			if (isExistItem) {
				isExistItem.values.currtypeid = {
					display: value.refname,
					value: value.refpk
				};
			} else {
				for (let attr in bodyItemData) {
					if (attr === 'currtypeid') {
						values.currtypeid = {
							display: bodyItemData.currtypeid.display,
							value: bodyItemData.currtypeid.value
						};
					} else {
						values[attr] = { value: bodyItemData[attr].value };
					}
				}
				this.sendData.data.body.rows.push({
					rowId: this.state.body.data[index].id.value,
					status: 1,
					values
				});
			}
		} else {
			// 没有id,表示是前台新增还没保存的数据，本次编辑是修改新增的记录而不是修改原有的操作，使用status 2表示新增
			let isExistItem = this.sendData.data.body.rows.find((item) => {
				// 新增的行有个tempid属性，sendData中的rowId和tempid对应
				return item.rowId == this.state.body.data[index].tempid;
			});
			isExistItem.values.currtypeid = {
				value: bodyItemData.currtypeid.value,
				display: bodyItemData.currtypeid.display
			};
		}
		console.log('币种选择后的state', this.state);
		console.log('币种选择后的sendData', this.sendData);
	};

	// 编辑子表行，编辑的这一行放到sendData中，status为1
	onValueChange = (index, key, value) => {
		// index 当前点击的子表的索引，key点击的是列表中的那个字段，value下拉选中或者文本框输入后的值
		// 编辑表格内容后，把state对应字段值修改成对应的value，如果是账户类型下拉，display和value是不同的
		// if (!value) return; //没输入内容返回，对于活期0，直接return
		if (key === 'accounttype') {
			if (typeof value !== 'number') return; //点击下拉没输入内容返回
			this.state.body.data[index][key].display = accounttypeList[value].key;
		} else {
			this.state.body.data[index][key].display = value;
		}
		this.state.body.data[index][key].value = value;
		this.forceUpdate();
		// 在sendData中记录这一次的修改信息
		// 遍历sendData.body.rows中已有的项,如果rowId找到了当前编辑的子表id,只需要在原有的基础上修改，找不到这加一条记录进去
		let bodyItemData = this.state.body.data[index];
		if (this.state.body.data[index].id) {
			// 有id,表示是后台保存过的记录，本次编辑是修改原有的原有的记录而不是修改新增的记录，使用status 1表示修改
			// isExistItem 值为从要发送给后台的数据中找到的这一条记录或者undefined，表示之前是否修改过改记录还没保存
			let isExistItem = this.sendData.data.body.rows.find((item) => {
				return item.rowId == this.state.body.data[index].id.value;
			});
			let values = {};
			if (isExistItem) {
				isExistItem.values[key] = { value: bodyItemData[key].value };
				key === 'balance' && (isExistItem.values[key].value = isExistItem.values[key].value - 0); //初期余额转换成数字
				key === 'currtypeid' && (isExistItem.values[key].display = bodyItemData[key].display); //币种还需要给后台传display的值
			} else {
				for (let attr in bodyItemData) {
					values[attr] = { value: bodyItemData[attr].value };
					attr === 'currtypeid' && (values[attr].display = bodyItemData[attr].display); //币种还需要给后台传display的值
					attr === 'balance' && (values[attr].value = values[attr].value - 0); //初期余额转换成数字
				}
				this.sendData.data.body.rows.push({
					rowId: this.state.body.data[index].id.value,
					status: 1,
					values
				});
			}
		} else {
			// 没有id,表示是前台新增还没保存的数据，本次编辑是修改新增的记录而不是修改原有的操作，使用status 2表示新增
			let isExistItem = this.sendData.data.body.rows.find((item) => {
				// 新增的行有个tempid属性，sendData中的rowId和tempid对应
				return item.rowId == this.state.body.data[index].tempid;
			});
			isExistItem.values[key] = { value: bodyItemData[key].value };
		}
		console.log('子表内容编辑后的state', this.state);
		console.log('子表内容编辑后的sendData', this.sendData);
	};

	// 增加子表行,最好的是保持sendData先不动，等编辑内容的时候再放入到sendData中
	addRow = () => {
		let newLine = {
			rowId: null,
			status: 2,
			values: {
				key: this.state.body.data.length + 1,
				code: {
					display: '',
					value: null
				},
				name: {
					display: '',
					value: null
				},
				orgid: {
					display: '',
					value: null
				},
				currtypeid: {
					display: '',
					value: null
				},
				accounttype: {
					display: '活期',
					value: '0'
				},
				balance: {
					display: '',
					value: null
				},
				ts: {
					value: null
				},
				parentid: this.state.head.data.id, //主表的id
				tempid: 'new' + count //临时id
			}
		};
		this.state.body.data.push(newLine.values);
		// 这里要修改
		let sendDataNewLine = {
			rowId: 'new' + count++,
			status: 2,
			values: {}
		};
		for (var key in newLine.values) {
			if (key === 'key') continue;
			sendDataNewLine.values[key] = { value: newLine.values[key].value };
		}
		// 新增的记录要加ts和parentid两个属性
		console.log(sendDataNewLine);
		this.sendData.data.body.rows.push(sendDataNewLine);
		console.log('新增后的state', this.state);
		console.log('新增后的sendData', this.sendData);
		this.forceUpdate();
	};
	// 删除子表行，如果之前没有这一项，sendData的body rows数组中增加一项，status为3,values中id的value为删除的子表的id，parentid的value为删除的子表的parentid,如果之前的sendData中已经有了这条记录，需要在原有的记录上修改，把status变成3即可。
	// 还需要判断是不是新增没保存的，如果是新增的，删除后不需要给后台传这一条记录了
	delRow = (index) => {
		// index 当前编辑的这条记录在state.body.data中的索引
		if (this.state.body.data[index].id) {
			// isExistItem  值为找到的这一条记录或者undefined
			let isExistItem = this.sendData.data.body.rows.find((item) => {
				return item.rowId == this.state.body.data[index].id.value;
			});
			if (isExistItem) {
				isExistItem.status = 3;
				isExistItem.values = {
					parentid: isExistItem.values.parentid,
					id: isExistItem.values.id,
					ts: isExistItem.values.ts
				};
			} else {
				// 之前的sendData数组中没有这一条记录
				this.sendData.data.body.rows.push({
					rowId: this.state.body.data[index].id.value,
					status: 3,
					values: {
						parentid: this.state.body.data[index].parentid,
						id: this.state.body.data[index].id,
						ts: this.state.body.data[index].ts
					}
				});
			}
		} else {
			// 新增记录后又删除的情况 从sendData中删除这一项即可  这里有点bug
			this.sendData.data.body.rows.forEach((item, index) => {
				if (item.rowId == this.state.body.data[index].tempid) {
					this.sendData.data.body.rows.splice(index, 1);
				}
			});
		}
		this.state.body.data.splice(index, 1);
		this.forceUpdate();
		console.log('子表内容删除后的state', this.state);
		console.log('子表内容删除后的sendData', this.sendData);
	};
	// 单选按钮组切换
	handleSelectChange = (value) => {
		let display = value ? '是' : '否';
		this.setState(
			{
				head: {
					...this.state.head,
					data: {
						...this.state.head.data,
						net_enablestatus: {
							...this.state.head.data.net_enablestatus,
							display,
							value
						}
					}
				}
			},
			() => {
				console.log('切换单选按钮后的state', this.state);
			}
		);
		if (this.props.location.query.type === 'add') return;
		this.sendData.data.head.rows[0].values.net_enablestatus = { value };
		console.log('切换单选按钮后的sendData', this.sendData);
	};
	// 保存数据到后台
	saveData = (reqData) => {
		this.setState({
			sendFlag: false
		});
		console.log('账号保存数据', reqData);
		Ajax({
			url: window.reqURL.bd + 'bd/bankaccbas/save',
			data: reqData,
			success: (res) => {
				const { data, message, success } = res;
				if (success) {
					let headValues = data.head.rows[0].values;
					let bodyValues = [];
					data.body &&
						data.body.rows.forEach((item) => {
							bodyValues.push(item.values);
						});
					this.state.head.data.id = headValues.id;
					this.state.head.data.ts = headValues.ts;
					this.state.body.data.forEach((item, index) => {
						item.id = bodyValues[index].id;
						item.ts = bodyValues[index].ts;
						item.parentid = headValues.id;
					});
					this.setState(
						{
							editable: !this.state.editable,
							headId: headValues.id.value,
							sendFlag: true
						},
						() => {
							toast({ content: '保存成功', color: 'success' });
							console.log('保存成功后的state', this.state);
						}
					);
				} else {
					toast({ content: message.message, color: 'warning' });
					this.setState({
						sendFlag: true
					});
				}
			},
			error: (res) => {
				toast({ content: res.message, color: 'danger' });
				this.setState({
					sendFlag: true
				});
			}
		});
	};

	// 点击保存按钮
	saveBtn = () => {
		// 组织页面中发送给后台的数据
		let headData = this.state.head.data,
			bodyData = this.state.body.data;
		console.log('saveBtn保存按钮sendData', this.sendData);
		console.log('saveBtn保存按钮headData', headData);
		console.log('saveBtn保存按钮bodyData', bodyData);

		let headRows = [],
			bodyRows = [];
		let options = {
			code: this.sendData.data.head.rows[0].values.code ? this.sendData.data.head.rows[0].values.code.value : '',
			name: this.sendData.data.head.rows[0].values.name ? this.sendData.data.head.rows[0].values.name.value : '',
			banktype: this.sendData.data.head.rows[0].values.banktype
				? this.sendData.data.head.rows[0].values.banktype.value
				: '',
			bankid: this.sendData.data.head.rows[0].values.bankid
				? this.sendData.data.head.rows[0].values.bankid.value
				: '',
			orgid: this.sendData.data.head.rows[0].values.orgid
				? this.sendData.data.head.rows[0].values.orgid.value
				: '',
			opentime: this.sendData.data.head.rows[0].values.opentime
				? this.sendData.data.head.rows[0].values.opentime.value
				: ''
		};
		if (options.code == '' || options.code == undefined) {
			toast({ content: '请输入账号', color: 'warning' });
			return;
		}
		if (options.name == '' || options.name == undefined) {
			toast({ content: '请输入户名', color: 'warning' });
			return;
		}
		if (options.banktype == '' || options.banktype == undefined) {
			toast({ content: '请选择银行类别', color: 'warning' });
			return;
		}
		if (options.bankid == '' || options.bankid == undefined) {
			toast({ content: '请选择开户行', color: 'warning' });
			return;
		}
		if (options.orgid == '' || options.orgid == undefined) {
			toast({ content: '请输入开户公司', color: 'warning' });
			return;
		}
		if (options.opentime == '' || options.opentime == undefined) {
			toast({ content: '请输入开户时间', color: 'warning' });
			return;
		}
		// 校验子账户信息
		if (this.sendData.data.body.rows.length == 0) {
			toast({ content: '请点击新增，录入子账户', color: 'warning' });
			return;
		}
		let errorFlag = false;
		this.sendData.data.body.rows.map((itemBody) => {
			if (!itemBody.values.code || !itemBody.values.code.value) {
				toast({ content: '请输入子账号', color: 'warning' });
				errorFlag = true;
				return;
			}
			if (!itemBody.values.name || !itemBody.values.name.value) {
				toast({ content: '请输入子户名', color: 'warning' });
				errorFlag = true;
				return;
			}
			if (!itemBody.values.currtypeid || !itemBody.values.currtypeid.value) {
				toast({ content: '请输入币种', color: 'warning' });
				errorFlag = true;
				return;
			}
		});
		if (errorFlag) {
			return;
		}
		// if (this.props.location.query.type === 'add') {
		if (!this.state.headId) {
			// 通过新增进入页面,还没有保存数据,此时的headId为null
			// 从state中提取要发送给后台的head数据
			// alert('情形一：新增保存')
			this.sendData.data.head.rows[0].status = 2;
			if (this.state.sendFlag) {
				this.saveData(this.sendData);
			}
		} else if (this.props.location.query.type === 'add') {
			// alert('情形二：新增保存后编辑保存')
			// 通过新增进入页面，保存数据后又点击编辑再次保存,此时的headId不为空
			this.sendData.data.head.rows[0].status = 1;
			if (this.state.sendFlag) {
				this.saveData(this.sendData);
			}
		} else {
			// 通过点击列表的编辑进入页面
			// alert('情形三：编辑保存')
			if (this.state.sendFlag) {
				this.saveData(this.sendData);
			}
		}
	};
	// 点击取消按钮
	cancelBtn = () => {
		this.props.router.push({
			pathname: '/bd/bankaccbas'
		});
	};
	// 点击编辑按钮,切换到编辑态,编辑时status变成2,表示修改,不是新增记录,修改时需要拿到主表的id
	editBtn = () => {
		this.setState(
			{
				editable: !this.state.editable
			},
			() => {
				console.log('点击编辑按钮后的state', this.state);
			}
		);
		// 需要先将sendData中主表的ts改成state中最新的值，子表的内容清空
		this.sendData.data.head.rows[0].values.ts = this.state.head.data.ts;
		this.sendData.data.head.rows[0].values.id = this.state.head.data.id;
		this.sendData.data.body.rows = [];
		console.log('点击编辑按钮后的sendData', this.sendData);
	};
	// 编辑态表格
	getBodyWrapper = (body) => {
		return (
			<Animate transitionName="move" component="tbody" className={body.props.className}>
				{body.props.children}
			</Animate>
		);
	};

	render() {
		let bodydata = this.state.body.data;
		let bodyColumns = this.state.body.columns;
		let type = this.props.location.query.type;
		return (
			<div className="bd-wraps bd-add-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">基础档案</Breadcrumb.Item>
					<Breadcrumb.Item active>银行账户管理</Breadcrumb.Item>
				</Breadcrumb>
				{/* 头部信息及按钮 */}
				<div className="bd-header">
					<div className="bd-title-1">{type === 'add' ? '新增' : type === 'edit' ? '修改' : null}银行账户</div>
					{this.state.editable ? (
						<span>
							<Button className="btn-2" colors="primary" type="ghost" onClick={this.saveBtn}>
								保存
							</Button>
							<Button className="btn-2 btn-cancel" shape="border" bordered onClick={this.cancelBtn}>
								取消
							</Button>
						</span>
					) : (
						<span>
							<Button className="btn-2" colors="primary" type="ghost" onClick={this.editBtn}>
								编辑
							</Button>
							<Button className="btn-2 btn-cancel" shape="border" bordered onClick={this.cancelBtn}>
								返回
							</Button>
						</span>
					)}
				</div>
				{/* 主表信息 */}
				<div className="bd-table bd-accbas">
					<Row>
						<Col lgOffset={1} lg={10} mdOffset={1} md={10} smOffset={1} sm={10} xsOffset={1} xs={10}>
							<Form horizontal className="info-form">
								<FormGroup>
									<Row className="input-line">
										<Col lg={2} md={2} sm={2} xs={2} className="text-right">
											<Label>
												<i className="required-mark">*</i>账号：
											</Label>
										</Col>
										<Col lg={3} md={3} sm={3} xs={3}>
											{this.state.editable ? (
												<FormControl
													value={this.state.head.data.code.value || ''}
													placeholder={'请输入'}
													onChange={(e) => this.headHandleChange(e.target.value, 'code')}
												/>
											) : (
												<Label>{this.state.head.data.code.value || ''}</Label>
											)}
										</Col>
										<Col lg={4} md={4} sm={4} xs={4} className="text-right">
											<Label>
												<i className="required-mark">*</i>户名：
											</Label>
										</Col>
										<Col lg={3} md={3} sm={3} xs={3}>
											{this.state.editable ? (
												<FormControl
													value={this.state.head.data.name.value || ''}
													placeholder={'请输入'}
													onChange={(e) => this.headHandleChange(e.target.value, 'name')}
												/>
											) : (
												<Label>{this.state.head.data.name.value || ''}</Label>
											)}
										</Col>
									</Row>
									<Row className="input-line">
										<Col lg={2} md={2} sm={2} xs={2} className="text-right">
											<Label>
												<i className="required-mark">*</i>银行类别：
											</Label>
										</Col>
										<Col lg={3} md={3} sm={3} xs={3}>
											{this.state.editable ? (
												<Refer
													ctx={'/uitemplate_web'}
													refModelUrl={'/bd/finbranchRef/'}
													refCode={'finbranchRef'}
													refName={'银行类别'}
													value={this.state.banktype}
													onChange={(value) => {
														console.log(value);
														if (!value.refcode) return;
														this.state.head.data.banktype = {
															display: value.refname,
															value: value.refpk
														};
														//切换银行类别时，设置开户行为空
														this.state.head.data.bankid = {
															display: '',
															value: ''
														};
														this.setState(
															{
																banktype: value,
																bankid: {
																	refpk: '',
																	refname: '',
																	id: '',
																	refcode: ''
																}
															},
															() => {
																console.log('银行类别选择后的state', this.state);
															}
														);
														this.sendData.data.head.rows[0].values.banktype = {
															value: value.refpk,
															display: value.refname
														};
														this.sendData.data.head.rows[0].values.bankid = {
															value: '',
															display: ''
														};
														console.log('银行类别选择后的sendData', this.sendData);
													}}
												/>
											) : (
												<Label>{this.state.head.data.banktype.display || ''}</Label>
											)}
										</Col>

										<Col lg={4} md={4} sm={4} xs={4} className="text-right">
											<Label>
												<i className="required-mark">*</i>开户行：
											</Label>
										</Col>
										<Col lg={3} md={3} sm={3} xs={3}>
											{this.state.editable ? (
												<Refer
													ctx={'/uitemplate_web'}
													refModelUrl={'/bd/finbranchRef/'}
													refCode={'finbranchRef'}
													refName={'金融网点'}
													showLabel={false}
													multiLevelMenu={[
														{
															name: [ '金融网点' ],
															code: [ 'refname' ]
														}
													]}
													clientParam={{
														parentid: this.state.banktype.refpk,
														typeCode: this.state.banktype.refcode
													}}
													value={this.state.bankid}
													onChange={(value) => {
														console.log(value);
														// if (!value.refcode) return; //点击按钮进行查询后没有点击列表进行选择
														this.state.head.data.bankid = {
															display: value.refname,
															value: value.refpk
														};
														//联行号、开户行信息采用iuap档案返回值
														this.state.head.data = {
															...this.state.head.data,
															fininstitutioncode: {
																value: value.refcode
															},
															branchphone: {
																value: value.phone
															},
															branchaddress: {
																value: value.address
															},
															net_code: {
																value: value.refcode
															},
															net_name: {
																value: value.refname
															}
														};
														this.setState({
															bankid: value
														});
														this.sendData.data.head.rows[0].values.bankid = {
															value: value.refpk,
															display: value.refname
														};
														this.sendData.data.head.rows[0].values = {
															...this.sendData.data.head.rows[0].values,
															fininstitutioncode: {
																value: value.refcode
															},
															branchphone: {
																value: value.phone
															},
															branchaddress: {
																value: value.address
															},
															net_code: {
																value: value.refcode
															},
															net_name: {
																value: value.refname
															}
														};
														this.setnetbankdata(value.refpk); //银行网点查询赋值开户行信息
													}}
												/>
											) : (
												<Label>{this.state.head.data.bankid.display || ''}</Label>
											)}
										</Col>
									</Row>
									<Row className="input-line">
										<Col lg={2} md={2} sm={2} xs={2} className="text-right">
											<Label>
												<i className="required-mark">*</i>开户公司：
											</Label>
										</Col>
										<Col lg={3} md={3} sm={3} xs={3}>
											{this.state.editable ? (
												<Refer
													ctx={'/uitemplate_web'}
													refModelUrl={'/bd/finorgRef/'}
													refCode={'finorgRef'}
													refName={'财务组织'}
													value={this.state.orgid}
													onChange={(value) => {
														console.log(value);
														// if (!value.refcode) return;
														this.state.head.data.orgid = {
															display: value.refname,
															value: value.refpk
														};

														this.setState(
															{
																orgid: value
															},
															() => {
																console.log('财务组织选择后的state', this.state);
															}
														);
														this.sendData.data.head.rows[0].values.orgid = {
															value: value.refpk,
															display: value.refname
														};
													}}
												/>
											) : (
												<Label>{this.state.head.data.orgid.display || ''}</Label>
											)}
										</Col>
										<Col lg={4} md={4} sm={4} xs={4} className="text-right">
											<Label>
												<i className="required-mark">*</i>开户时间：
											</Label>
										</Col>
										<Col lg={3} md={3} sm={3} xs={3}>
											{this.state.editable ? (
												<DatePicker
													onChange={this.onDateSelect}
													format={'YYYY-MM-DD'}
													locale={zhCN}
													placeholder={'请选择日期'}
													value={
														this.state.head.data.opentime.value ? (
															moment(this.state.head.data.opentime.value)
														) : null
													}
												/>
											) : (
												<Label>{this.state.head.data.opentime.value || ''}</Label>
											)}
										</Col>
									</Row>
									<Row className="input-line">
										<Col lg={2} md={2} sm={2} xs={2} className="text-right">
											<Label>备注：</Label>
										</Col>
										<Col lg={10} md={10} sm={10} xs={10}>
											{this.state.editable ? (
												<TextArea
													value={this.state.head.data.memo.value || ''}
													className="text-area"
													placeholder="输入内容最多不超过200字符"
													count={200}
													onChange={(value) => this.headHandleChange(value, 'memo')}
												/>
											) : (
												<div className="memo">{this.state.head.data.memo.value || ''}</div>
											)}
										</Col>
									</Row>
								</FormGroup>
							</Form>

							<div className="info-card">
								<Col
									lgOffset={2}
									lg={10}
									mdOffset={2}
									md={10}
									smOffset={2}
									sm={10}
									xsOffset={2}
									xs={10}
									className="bd-header-2"
								>
									<span className="bd-title-2">银行接口相关</span>
								</Col>
								<Col
									lgOffset={2}
									lg={10}
									mdOffset={2}
									md={10}
									smOffset={2}
									sm={10}
									xsOffset={2}
									xs={10}
									className="bd-body-2"
								>
									<Form horizontal>
										<FormGroup>
											<Row>
												<Col lg={2} md={2} sm={2} xs={2} className="text-right">
													<Label>网银开通状态：</Label>
												</Col>
												<Col lg={10} md={10} sm={10} xs={10}>
													{this.state.editable ? (
														<div className="bd-raido">
															<Radio.RadioGroup
																selectedValue={
																	this.state.head.data.net_enablestatus.value
																}
																onChange={this.handleSelectChange}
															>
																<Radio value={1}>是</Radio>
																<Radio value={0}>否</Radio>
															</Radio.RadioGroup>
														</div>
													) : (
														<Label>
															{this.state.head.data.net_enablestatus.value ? '是' : '否'}
														</Label>
													)}
												</Col>
											</Row>
											<Row>
												<Col lg={2} md={2} sm={2} xs={2} className="text-right">
													<Label>人行联行行号：</Label>
												</Col>
												<Col lg={4} md={4} sm={4} xs={4}>
													{this.state.editable ? (
														<FormControl
															className="bd-input"
															value={this.state.head.data.net_code.value || ''}
															placeholder={'请输入'}
															onChange={(e) =>
																this.headHandleChange(e.target.value, 'net_code')}
														/>
													) : (
														<Label>{this.state.head.data.net_code.value || ''}</Label>
													)}
												</Col>
												<Col
													lg={2}
													md={2}
													sm={2}
													xs={2}
													className="text-right"
													style={{ marginTop: 0 }}
												>
													<Label>人行联行名称：</Label>
												</Col>
												<Col lg={4} md={4} sm={4} xs={4}>
													{this.state.editable ? (
														<FormControl
															className="bd-input"
															value={this.state.head.data.net_name.value || ''}
															placeholder={'请输入'}
															onChange={(e) =>
																this.headHandleChange(e.target.value, 'net_name')}
														/>
													) : (
														<Label>{this.state.head.data.net_name.value || ''}</Label>
													)}
												</Col>
											</Row>
											<Row style={{ marginBottom: 15 }}>
												<Col lg={2} md={2} sm={2} xs={2} className="text-right">
													<Label>开户地区：</Label>
												</Col>
												<Col lg={2} md={2} sm={2} xs={2}>
													{this.state.editable ? (
														<FormControl
															className="bd-input bd-input-small"
															value={this.state.head.data.net_area.value || ''}
															placeholder={'请输入'}
															onChange={(e) =>
																this.headHandleChange(e.target.value, 'net_area')}
														/>
													) : (
														<Label>{this.state.head.data.net_area.value || ''}</Label>
													)}
												</Col>
												<Col lg={1} md={1} sm={1} xs={1} className="text-right">
													<Label>省份：</Label>
												</Col>
												<Col lg={2} md={2} sm={2} xs={2}>
													{this.state.editable ? (
														<FormControl
															className="bd-input bd-input-small"
															value={this.state.head.data.net_province.value || ''}
															placeholder={'请输入'}
															onChange={(e) =>
																this.headHandleChange(e.target.value, 'net_province')}
														/>
													) : (
														<Label>{this.state.head.data.net_province.value || ''}</Label>
													)}
												</Col>
												<Col lg={1} md={1} sm={1} xs={1} className="text-right">
													<Label>城市：</Label>
												</Col>
												<Col lg={2} md={2} sm={2} xs={2}>
													{this.state.editable ? (
														<FormControl
															value={this.state.head.data.net_city.value || ''}
															placeholder={'请输入'}
															onChange={(e) =>
																this.headHandleChange(e.target.value, 'net_city')}
															className="bd-input bd-input-small"
														/>
													) : (
														<Label>{this.state.head.data.net_city.value || ''}</Label>
													)}
												</Col>
											</Row>
										</FormGroup>
									</Form>
								</Col>
							</div>
						</Col>
					</Row>
				</div>
				{/* 子表信息及按钮 */}
				<div className="space" />
				<div className="bd-header">
					<div className="bd-title-1">子账户</div>
					{this.state.editable && (
						<Button colors="primary" type="ghost" onClick={this.addRow} className="btn-2">
							新增
						</Button>
					)}
				</div>
				<Table
					bordered
					data={bodydata}
					columns={bodyColumns}
					emptyText={() => <span>暂无记录</span>}
					getBodyWrapper={this.getBodyWrapper}
					className="bd-table bd-add-subtable"
				/>
			</div>
		);
	}
}
