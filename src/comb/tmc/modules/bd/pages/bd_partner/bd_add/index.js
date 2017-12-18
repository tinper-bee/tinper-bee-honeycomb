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
	Row,
	Col,
	Message,
	FormGroup,
	Label,
	Animate,
	Radio,
	Breadcrumb
} from 'tinper-bee';
import Form from 'bee-form';
import FormControl from 'bee-form-control';
import InputRender from 'bee-table/build/render/InputRender.js';
import DateRender from 'bee-table/build/render/DateRender';
import SelectRender from 'bee-table/build/render/SelectRender';
import Refer from '../../../../../containers/Refer';
import TextArea from '../../../../fm/pages/fm_applycard/TextareaItem';
import Ajax from '../../../../../utils/ajax';
import { numFormat, toast, sum } from '../../../../../utils/utils.js';

const format = 'YYYY-MM-DD';
const dateInputPlaceholder = '选择日期';
const dateInputPlaceholder2 = '选择年月';

const rootUrl = window.reqURL.bd + 'bd/partner/';
let count = 1; //新增子表时编tempid用
export default class Add extends Component {
	constructor() {
		super();
		this.state = {
			head: {
				data: {
					id: { display: '', value: null }, // 主表的主键
					code: {
						display: '',
						value: null
					},
					name: {
						display: '',
						value: null
					},
					memo: {
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
						title: '账号',
						key: 'code',
						dataIndex: 'code.value',
						width: 100,
						render: (text, record, index) => {
							return this.state.editable ? (
								<InputRender
									value={text}
									isclickTrigger={true}
									onChange={(e) => this.onInputChange(index, 'code', e, record)}
								/>
							) : (
								this.state.body.data[index].code.value || ''
							);
						}
					},
					{
						title: '户名',
						key: 'name',
						dataIndex: 'name.value',
						width: 100,
						render: (text, record, index) => {
							return this.state.editable ? (
								<InputRender
									value={text}
									isclickTrigger={true}
									onChange={(e) => this.onInputChange(index, 'name', e, record)}
								/>
							) : (
								this.state.body.data[index].name.value || ''
							);
						}
					},
					{
						title: '币种',
						key: 'currtypeid',
						dataIndex: 'currtypeid.display',
						width: 100,
						render: (text, record, index) => {
							return this.state.editable ? (
								<Refer
									refModelUrl={'/bd/currencyRef/'}
									refCode={'currencyRef'}
									refName={'币种'}
									ctx={'/uitemplate_web'}
									value={this.state.currtypeid[index]}
									onChange={(value) => this.handleRefChange(index, 'currtypeid', value)}
								/>
							) : (
								this.state.body.data[index].currtypeid.display || ''
							);
						}
					},
					{
						title: '银行类别',
						key: 'banktype',
						dataIndex: ' banktype.display',
						width: 100,
						render: (text, record, index) => {
							return this.state.editable ? (
								<Refer
									ctx={'/uitemplate_web'}
									refModelUrl={'/bd/finbranchRef/'}
									refCode={'finbranchRef'}
									refName={'银行类别'}
									value={this.state.banktype[index]}
									onChange={(value) => this.handleRefChange(index, 'banktype', value)}
								/>
							) : (
								this.state.body.data[index].banktype.display || ''
							);
						}
					},
					{
						title: '开户行',
						key: 'bankid',
						dataIndex: 'bankid.display',
						width: 100,
						render: (text, record, index) => {
							return this.state.editable ? (
								<Refer
									ctx={'/uitemplate_web'}
									refModelUrl={'/bd/finbranchRef/'}
									refCode={'finbranchRef'}
									refName={'金融网点'}
									showLabel={false}
									multiLevelMenu={[
										{
											name: [ '金融机构' ],
											code: [ 'refname' ]
										},
										{
											name: [ '金融网点' ],
											code: [ 'refname' ]
										}
									]}
									value={this.state.bankid[index]}
									onChange={(value) => this.handleRefChange(index, 'bankid', value)}
								/>
							) : (
								this.state.body.data[index].bankid.display || ''
							);
						}
					},
					{
						title: '备注',
						key: 'memo',
						dataIndex: 'memo.value',
						width: 150,
						render: (text, record, index) => {
							return this.state.editable ? (
								<InputRender
									value={text}
									isclickTrigger={true}
									onChange={(e) => this.onInputChange(index, 'memo', e, record)}
								/>
							) : (
								this.state.body.data[index].memo.value || ''
							);
						}
					},
					{
						title: '创建人',
						key: 'creator',
						dataIndex: 'creator.display',
						width: 60
					},
					{
						title: '创建时间',
						key: 'creationtime',
						dataIndex: 'creationtime.display',
						width: 60
					},
					{
						title: '复核人',
						key: 'reviewer',
						dataIndex: 'reviewer.display',
						width: 60
					},
					{
						title: '复核时间',
						key: 'reviewtime',
						dataIndex: 'reviewtime.display',
						width: 60
					}
					// {
					// 	title: '操作',
					// 	key: 'cz',
					// 	width: 60,
					// 	render: (text, record, index) => {
					// 		return (
					// 			<div>
					// 				{/* 增加 */}
					// 				{/* <Link
					// 					to={{ pathname: '/bd/hf_add', query: { type: 'add' }, state: '' }}
					// 					style={{ cursor: 'pointer', color: '#349EEB' }}
					// 				>
					// 					<Icon type="uf-plus" />
					// 				</Link> */}
					// 				{/* 修改 */}
					// 				{/* <span
					// 					onClick={(e) => this.editDone('edit', index, text, record, e)}
					//
					// 				>
					// 					<Icon type="uf-pencil" />
					// 				</span> */}
					// 				{/* 删除 */}
					// 				{this.state.editable ? (
					// 					<span style={{ cursor: 'pointer', color: '#349EEB' }}>
					// 						<Popconfirm content="确认删除?" placement="left" onClose={() => this.delRow(record, index)}>
					// 							<Icon className="iconfont icon-shanchu icon-style" />
					// 						</Popconfirm>
					// 					</span>
					// 				) : null}
					// 				{/* 更多 */}
					// 				{/* <Dropdown trigger={[ 'hover' ]} overlay={menu} animation="slide-up">
					// 					<Icon
					//
					// 						type="uf-3dot-h"
					// 						className="row-operations-item"
					// 					/>
					// 				</Dropdown> */}
					// 			</div>
					// 		);
					// 	}
					// }
				],
				data: []
			},
			// currtypeid: '',
			// banktype: {},
			// bankid: {},
			// editable: true,
			// type: true,
			// isSave: false,

			editable: true,
			headId: null, //主表的id
			currtypeid: [], //币种参照
			banktype: [], //银行类别参照
			bankid: [] //开户行参照
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
				url: rootUrl + 'form',
				data: {
					id: this.props.location.state.id.value
				},
				success: (res) => {
					const { data, message, success } = res;
					if (success) {
						let headData = data.head.rows[0].values;
						let bodyData = [];
						data.body &&
							data.body.rows.forEach((item, index) => {
								item.values.key = index + 1; //增加key属性，索引+1，作为序号
								bodyData.push(item.values);
								this.state.currtypeid[index] = {
									refname: item.values.currtypeid.display,
									refpk: item.values.currtypeid.value
								}; // 币种参照
								this.state.banktype[index] = {
									refname: item.values.banktype.display,
									refpk: item.values.banktype.value
								}; // 银行类别参照
								this.state.bankid[index] = {
									refname: item.values.bankid.display,
									refpk: item.values.bankid.value
								}; // 开户行参照
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
								headId: data.head.rows[0].values.id.value
							},
							() => {
								console.log('请求数据后的state', this.state);
								// 主表有修改，this.sendData.data.head.rows[0].status变成1，数据存在state中，主表无修改，不需要给后台传了
								// this.sendData.data.head.rows[0].status = 1;
								let headData = this.state.head.data;
								// this.sendData.data.head.rows[0].values = {};
								for (let key in headData) {
									this.sendData.data.head.rows[0].values[key] = { value: headData[key].value };
								}
								console.log('请求数据后的sendData', this.sendData);
							}
						);
					} else {
						toast({ content: message.message, color: 'warning' });
					}
				},
				error: function(res) {
					toast({ content: res.message, color: 'danger' });
				}
			});
		}
	}

	// 修改主表
	headHandleChange = (value, key) => {
		console.log(value, key);
		// let value=e.target.value;
		// key：修改的字段   value: 使用Form组件后，FormContrl输入的值，对于普通的文本框 value实际是事件对象e
		this.setState(
			{
				head: {
					...this.state.head,
					data: {
						...this.state.head.data,
						[key]: {
							display: value,
							value: value,
							scale: -1
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
				for (let attr in headData) {
					if (attr === 'banktype' || attr === 'bankid') {
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

	// 选择子表的参照
	handleRefChange = (index, key, value) => {
		// currtypeid: [], //币种参照
		// banktype: [], //银行类别参照
		// bankid: [] //开户行参照
		console.log(index, key, value); //index 修改的子表的索引 key 修改的哪个字段 value 选中参照的信息对象 value: {id: "null", refcode: "null", refpk: "KRW", refname: "韩元"}
		if (!value.refpk) return;
		this.state.body.data[index][key] = {
			display: value.refname,
			value: value.refpk
		};
		this.state[key][index] = value;
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
				isExistItem.values[key] = {
					display: value.refname,
					value: value.refpk
				};
			} else {
				for (let attr in bodyItemData) {
					if (attr === 'currtypeid' || attr === 'bankid' || attr === 'banktype') {
						values[attr] = {
							value: bodyItemData[attr].value,
							display: bodyItemData[attr].display
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
			isExistItem.values[key] = {
				value: bodyItemData[key].value,
				display: bodyItemData[key].display
			};
		}
		console.log(key, '选择后的state:', this.state);
		console.log(key, '选择后的sendData:', this.sendData);
	};

	// 编辑子表行，编辑的这一行放到sendData中，status为1
	onInputChange = (index, key, value) => {
		console.log(index, key, value);
		// index 当前点击的子表的索引，key点击的是列表中的那个字段，value下拉选中或者文本框输入后的值
		// 编辑表格内容后，把state对应字段值修改成对应的value
		if (!value) return;
		this.state.body.data[index][key].display = value;
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
				(key === 'currtypeid' || 'bankid' || 'banktype') &&
					(isExistItem.values[key].display = bodyItemData[key].display); //参照还需要给后台传display的值
			} else {
				for (let attr in bodyItemData) {
					//参照还需要给后台传display的值
					if (attr === 'currtypeid' || attr === 'bankid' || attr === 'banktype') {
						values[attr] = {
							display: bodyItemData[attr].display,
							value: bodyItemData[attr].value
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
					scale: -1,
					value: null
				},
				name: {
					display: '',
					scale: -1,
					value: null
				},
				currtypeid: {
					display: '',
					scale: -1,
					value: null
				},
				banktype: {
					display: '',
					scale: -1,
					value: null
				},
				bankid: {
					display: '',
					scale: -1,
					value: null
				},
				memo: {
					display: '',
					scale: -1,
					value: null
				},
				creator: {
					display: '',
					scale: -1,
					value: null
				},
				creationtime: {
					display: '',
					scale: -1,
					value: null
				},
				reviewer: {
					display: '',
					scale: -1,
					value: null
				},
				reviewtime: {
					display: '',
					scale: -1,
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
		let sendDataNewLine = {
			rowId: 'new' + count++,
			status: 2,
			values: {}
		};
		for (let attr in newLine.values) {
			if (attr === 'key') continue;
			console.log(attr);
			sendDataNewLine.values[attr] = { value: newLine.values[attr].value };
		}
		// 新增的记录要加ts和parentid两个属性
		this.sendData.data.body.rows.push(sendDataNewLine);
		console.log('新增后的state', this.state);
		console.log('新增后的sendData', this.sendData);
		this.forceUpdate();
	};

	// 处理后台返回的数据
	dataFormat = (data) => {
		let result = [];
		data.map((item, index) => {
			item.values.key = index + 1;
			result.push(item.values);
		});
		return result;
	};

	delRow = (record, index) => {
		console.log('主表主键', record.id.value);
		Ajax({
			url: rootUrl + 'del',
			data: {
				ids: [ record.id.value ]
			},
			success: (res) => {
				const { data, message, success } = res;
				if (success) {
					this.state.body.data.splice(index, 1);
					this.forceUpdate();
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};

	// 保存数据到后台
	saveData = (data) => {
		Ajax({
			url: rootUrl + 'save',
			data: data,
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
					this.setState({ editable: !this.state.editable }, () => {
						toast({ content: '保存成功', color: 'success' });
						console.log('保存时的state', this.state);
					});
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: (res) => {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};

	// 点击保存按钮
	saveBtn = () => {
		// 整理请求数据
		let headData = this.state.head.data,
			bodyData = this.state.body.data;
		let headRows = [],
			bodyRows = [];
		let options = {
			code: this.sendData.data.head.rows[0].values.code ? this.sendData.data.head.rows[0].values.code.value : '',
			name: this.sendData.data.head.rows[0].values.name ? this.sendData.data.head.rows[0].values.name.value : ''
		};
		if (options.code == '' || options.code == undefined) {
			toast({ content: '请输入合作伙伴代码', color: 'danger' });
			return;
		}
		if (options.name == '' || options.name == undefined) {
			toast({ content: '请输入合作伙伴名称', color: 'danger' });
			return;
		}
		if (!this.state.headId) {
			// 通过新增进入页面,还没有保存数据,此时的headId为null
			// 从state中提取要发送给后台的head数据
			// alert('情形一：新增保存')
			this.sendData.data.head.rows[0].status = 2;
			this.saveData(this.sendData);
		} else if (this.props.location.query.type === 'add') {
			// alert('情形二：新增保存后编辑保存')
			// 通过新增进入页面，保存数据后又点击编辑再次保存,此时的headId不为空
			this.sendData.data.head.rows[0].status = 1;
			this.saveData(this.sendData);
		} else {
			// 通过点击列表的编辑进入页面
			// alert('情形三：编辑保存');
			this.saveData(this.sendData);
		}
	};
	// 点击取消按钮
	cancelBtn = () => {
		this.props.router.push({
			pathname: '/bd/bankpartner'
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

	// 表单校验
	checkForm = (flag, obj) => {
		console.log('checkForm flag', flag);
		console.log(obj);
	};
	render() {
		let { head, body } = this.state;
		let headColumns = head.columns,
			headData = head.data;
		let bodyColumns = body.columns,
			bodyData = body.data;
		let type = this.props.location.query.type;
		let editable = this.state.editable;
		return (
			<div className="bd-wraps bd-add-wraps bd-partner-add">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">基础档案</Breadcrumb.Item>
					<Breadcrumb.Item active>合作伙伴</Breadcrumb.Item>
				</Breadcrumb>
				{/* 头部信息及按钮 */}
				<div className="bd-header">
					<div className="bd-title-1">{type === 'add' ? '新增' : type === 'edit' ? '修改' : null}合作伙伴</div>
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

				<div className="bd-table bd-accbas">
					{/* 主表信息 */}
					<Row>
						<Col lgOffset={1} lg={10} mdOffset={1} md={10} smOffset={1} sm={10} xsOffset={1} xs={10}>
							<Form showSubmit={false} horizontal>
								<FormGroup>
									<Row className="input-line">
										<Col lg={2} md={2} sm={2} xs={2} className="text-right">
											<Label>
												<i className="required-mark">*</i>合作伙伴代码：
											</Label>
										</Col>
										<Col lg={3} md={3} sm={3} xs={3}>
											{editable ? (
												<FormControl
													value={this.state.head.data.code.value || ''}
													placeholder={'请输入'}
													onChange={(value) => this.headHandleChange(value, 'code')}
												/>
											) : (
												<Label>{this.state.head.data.code.value || ''}</Label>
											)}
										</Col>
										<Col lg={4} md={4} sm={4} xs={4} className="text-right">
											<Label>
												<i className="required-mark">*</i>合作伙伴名称：
											</Label>
										</Col>
										<Col lg={3} md={3} sm={3} xs={3}>
											{editable ? (
												<FormControl
													value={this.state.head.data.name.value || ''}
													placeholder={'请输入'}
													onChange={(value) => this.headHandleChange(value, 'name')}
												/>
											) : (
												<Label>{this.state.head.data.name.value || ''}</Label>
											)}
										</Col>
									</Row>
									<Row className="input-line">
										<Col lg={2} md={2} sm={2} xs={2} className="text-right">
											<Label>备注：</Label>
										</Col>
										<Col lg={10} md={10} sm={10} xs={10}>
											{editable ? (
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
						</Col>
					</Row>
					{/* {!editable ? (
						<Label>{this.state.head.data[item.key].value || ''}</Label>
					) : item.type === 'textarea' ? (
						<TextAreaItem
							// name="fmuseway"
							value={this.state.head.data[item.key].display}
							className="text-area text-area-size"
							placeholder="请输入"
							count={200}
							onChange={(value) => {
								this.headHandleChange(item.type, item.key, value);
							}}
						/>
					) : (
						<FormControl
							// name=""
							placeholder={item.placeholder}
							value={this.state.head.data[item.key].display}
							onChange={(value) => this.headHandleChange(item.type, item.key, value)}
						/>
					)}: } */}
				</div>
				{/* 子表信息及按钮 */}
				<div className="space" />
				<div className="bd-header">
					<div className="bd-title-1">银行账户</div>
					{this.state.editable && (
						<Button className="btn-2" colors="primary" type="ghost" onClick={this.addRow}>
							新增
						</Button>
					)}
				</div>

				<Table
					bordered
					data={bodyData}
					columns={bodyColumns}
					emptyText={() => <span>暂无记录</span>}
					getBodyWrapper={this.getBodyWrapper}
					className="bd-table bd-add-subtable"
				/>
			</div>
		);
	}
}
