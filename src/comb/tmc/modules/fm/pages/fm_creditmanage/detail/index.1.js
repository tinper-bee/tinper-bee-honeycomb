/* 授信协议详情页 */
import React, { Component } from 'react';
import {
	Breadcrumb,
	Button,
	Table,
	FormGroup,
	InputGroup,
	ButtonGroup,
	Icon,
	Checkbox,
	Row,
	Col,
	Label,
	Select,
	Modal,
	Dropdown
} from 'tinper-bee';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import Form from 'bee-form';
import Affix from 'bee-affix';
import FormControl from 'bee-form-control';
// import FormControl from '../../../../../containers/FormItems/InputItem';
import DatePicker from 'bee-datepicker';
import moment from 'moment';
import InputRender from 'bee-table/build/render/InputRender.js';
import DateRender from 'bee-table/build/render/DateRender';
import SelectRender from 'bee-table/build/render/SelectRender';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import Refer from '../../../../../containers/Refer';
import TextArea from '../../fm_applycard/TextareaItem';
import ModifyRecordModal from '../ModifyRecord';

import NoData from '../../../../../containers/NoData';
import * as enumData from '../enumData';
import Ajax from '../../../../../utils/ajax.js';
import { numFormat, toast } from '../../../../../utils/utils.js';
import './index.less';

const { RangePicker } = DatePicker;
const FormItem = Form.FormItem;
const Option = Select.Option;
const rootURL = window.reqURL.fm + 'fm/';

let operationType = ''; // 通过何种操作进入页面  是新增还是修改还是变更
let count = 1; //新增行生成key时用

export default class CreditDetail extends Component {
	constructor() {
		super();
		this.state = {
			guaranteeGroup: [
				{
					title: '授信种类',
					columns: [
						{
							title: '编码',
							key: 'bm',
							dataIndex: 'code.display',
							width: 200,
							render: (text, record, index) =>
								this.state.editable && !this.state.disabled ? (
									<InputRender
										value={text}
										isclickTrigger={true}
										onChange={(value) => this.onRowChange(0, index, 'code', value)}
									/>
								) : (
									record.code.value || '-'
								)
						},
						{
							title: '类型',
							key: 'lx',
							dataIndex: 'type.display',
							width: 150,
							render: (text, record, index) =>
								this.state.editable && !this.state.disabled ? (
									// <SelectRender
									// 	isclickTrigger={true}
									// 	value={text}
									// 	onChange={(value) => this.onRowChange(0, index, 'type', value)}
									// 	dataSource={enumData.creditTypeAry}
									// >
									// 	<Option value="1">票据承兑</Option>
									// 	<Option value="2">票据贴现</Option>
									// 	<Option value="3">进口押汇</Option>
									// 	<Option value="4">保函</Option>
									// 	<Option value="5">信用证</Option>
									// 	<Option value="6">流动资金贷款</Option>
									// 	<Option value="7">项目贷款</Option>
									// 	<Option value="8">发债</Option>
									// 	<Option value="9">其他</Option>
									// </SelectRender>
									<Refer
										ctx={'/uitemplate_web'}
										refModelUrl={'/bd/cctypeRef/'}
										refCode={'cctypeRef'}
										refName={'授信类别'}
										value={this.state.typeRef[index] || {}}
										onChange={(value) => {
											this.state.typeRef[index] = value;
											this.onTableReferChange(0, index, 'type', value);
										}}
									/>
								) : (
									// this.enumMapping(record.type.value, enumData.creditTypeAry)
									text || '-'
								)
						},
						{
							title: '币种',
							key: 'bz',
							dataIndex: 'currenyid.display',
							width: 150,
							render: (text, record, index) => {
								return this.state.editable && !this.state.disabled ? (
									<Refer
										ctx={'/uitemplate_web'}
										refModelUrl={'/bd/currencyRef/'}
										refCode={'currencyRef'}
										refName={'币种'}
										value={this.state.currtypeidRefTab0[index] || {}}
										onChange={(value) => {
											this.state.currtypeidRefTab0[index] = value;
											this.onTableReferChange(0, index, 'currenyid', value);
										}}
									/>
								) : (
									text || '-'
								);
							}
						},
						{
							title: '金额',
							key: 'je',
							dataIndex: 'money.value',
							width: 150,
							render: (text, record, index) =>
								this.state.editable && !this.state.disabled ? (
									<InputRender
										value={text}
										isclickTrigger={true}
										format="Currency"
										onChange={(value) => this.onRowChange(0, index, 'money', value)}
									/>
								) : isNaN(numFormat(record.money.value, '')) ? (
									'-'
								) : (
									numFormat(record.money.value, '')
								)
						}
					],
					data: [],
					showTab: true
				},
				{
					title: '授信明细',
					columns: [
						{
							title: '授信使用单位',
							key: 'sxsydw',
							dataIndex: 'credituseunit.value',
							width: 200,
							render: (text, record, index) =>
								this.state.creditagree.agreetype.value === 'group' &&
								this.state.editable &&
								!this.state.disabled ? (
									<Refer
										ctx={'/uitemplate_web'}
										refModelUrl={'/bd/cctypeRef/'}
										refCode={'cctypeRef'}
										refName={'授信类别'}
										value={this.state.credittypeRef[index] || {}}
										onChange={(value) => {
											this.state.credittypeRef[index] = value;
											this.onTableReferChange(1, index, 'credittype', value);
										}}
									/>
								) : (
									text || '-'
								)
						},
						{
							title: '授信类别',
							key: 'sxlb',
							dataIndex: 'credittype.display',
							width: 130,
							render: (text, record, index) =>
								this.state.editable && !this.state.disabled ? (
									<SelectRender
										isclickTrigger={true}
										value={text}
										onChange={(value) => this.onRowChange(1, index, 'credittype', value)}
										dataSource={[
											{ key: '票据承兑', value: '1' },
											{ key: '票据贴现', value: '2' },
											{ key: '进口押汇', value: '3' },
											{ key: '保函', value: '4' },
											{ key: '信用证', value: '5' },
											{ key: '流动资金贷款', value: '6' },
											{ key: '项目贷款', value: '7' },
											{ key: '发债', value: '8' },
											{ key: '其他', value: '9' }
										]}
									>
										<Option value={'1'}>票据承兑</Option>
										<Option value={'2'}>票据贴现</Option>
										<Option value={'3'}>进口押汇</Option>
										<Option value={'4'}>保函</Option>
										<Option value={'5'}>信用证</Option>
										<Option value={'6'}>流动资金贷款</Option>
										<Option value={'7'}>项目贷款</Option>
										<Option value={'8'}>发债</Option>
										<Option value={'9'}>其他</Option>
									</SelectRender>
								) : (
									// <Refer
									// 	ctx={'/uitemplate_web'}
									// 	refModelUrl={'/bd/cctypeRef/'}
									// 	refCode={'cctypeRef'}
									// 	refName={'授信类别'}
									// 	value={this.state.credittypeRef[index] || {}}
									// 	onChange={(value) => {
									// 		this.state.credittypeRef[index] = value;
									// 		this.onTableReferChange(1, index, 'credittype', value);
									// 	}}
									// />
									// this.enumMapping(record.credittype.value, enumData.creditTypeAry)
									text || '-'
								)
						},
						{
							title: '控制方式',
							key: 'kzfs',
							dataIndex: 'controltype.display',
							width: 130,
							render: (text, record, index) =>
								this.state.editable && !this.state.disabled ? (
									<SelectRender
										isclickTrigger={true}
										value={text}
										onChange={(value) => this.onRowChange(1, index, 'controltype', value)}
										dataSource={enumData.controlTypeAry}
									>
										<Option value={'prompt'}>提示</Option>
										<Option value={'control'}>控制</Option>
										<Option value={'uncontrol'}>不控制</Option>
									</SelectRender>
								) : (
									this.enumMapping(record.controltype.value, enumData.controlTypeAry)
								)
						},
						{
							title: '币种',
							key: 'bz',
							dataIndex: 'currtypeid.display',
							width: 130,
							render: (text, record, index) =>
								this.state.editable && !this.state.disabled ? (
									<Refer
										ctx={'/uitemplate_web'}
										refModelUrl={'/bd/currencyRef/'}
										refCode={'currencyRef'}
										refName={'币种'}
										value={this.state.currtypeidRefTab1[index] || {}}
										onChange={(value) => {
											this.state.currtypeidRefTab1[index] = value;
											this.onTableReferChange(1, index, 'currtypeid', value);
										}}
									/>
								) : (
									record.currtypeid.display || '-'
								)
						},
						{
							title: '原币金额',
							key: 'ybje',
							dataIndex: 'money.value',
							width: 130,
							render: (text, record, index) =>
								this.state.editable && !this.state.disabled ? (
									<InputRender
										value={text}
										format="Currency"
										isclickTrigger={true}
										onChange={(value) => this.onRowChange(1, index, 'money', value)}
									/>
								) : isNaN(numFormat(record.money.value, '')) ? (
									'-'
								) : (
									numFormat(record.money.value, '')
								)
						},
						{
							title: '贷款银行',
							key: 'khyh',
							dataIndex: 'loanbankid.display',
							width: 180,
							render: (text, record, index) =>
								this.state.editable && !this.state.disabled ? (
									<Refer
										ctx={'/uitemplate_web'}
										refModelUrl={'/bd/finbranchRef/'}
										refCode={'finbranchRef'}
										refName={'金融网点'}
										value={this.state.loanbankidRef[index]}
										onChange={(value) => {
											this.state.loanbankidRef[index] = value;
											this.onTableReferChange(1, index, 'loanbankid', value);
										}}
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
									/>
								) : (
									record.loanbankid.display || '-'
								)
						}
					],
					data: [],
					showTab: true
				},
				{
					title: '担保合同',
					columns: [
						{
							title: '担保合同',
							key: 'dbht',
							dataIndex: 'guarantee.display',
							width: 200,
							render: (text, record, index) =>
								this.state.editable ? (
									// 请改正 参照来源未知
									<Refer
										ctx={'/uitemplate_web'}
										refModelUrl={'/fm/contractref/'}
										refCode={'contractcode'}
										refName={'合同'}
										value={this.state.guaranteeRef[index]}
										onChange={(value) => {
											this.state.guaranteeRef[index] = value;
											this.onTableReferChange(2, index, 'guarantee', value);
										}}
									/>
								) : (
									record.guarantee.display || ''
								)
						},
						{
							title: '担保币种',
							key: 'dbbz',
							dataIndex: 'currtypeid.display',
							width: 150,
							render: (text, record, index) =>
								this.state.editable ? (
									<Refer
										ctx={'/uitemplate_web'}
										refModelUrl={'/bd/currencyRef/'}
										refCode={'currencyRef'}
										refName={'币种'}
										value={this.state.currtypeidRefTab2[index] || {}}
										onChange={(value) => {
											this.state.currtypeidRefTab2[index] = value;
											this.onTableReferChange(2, index, 'currtypeid', value);
										}}
									/>
								) : (
									record.currtypeid.display || ''
								)
						},
						{
							title: '占用授信担保额度',
							key: 'zysxdbed',
							dataIndex: 'occquota.display',
							width: 150,
							render: (text, record, index) =>
								this.state.editable ? (
									<InputRender
										value={record.occquota.value}
										format="Currency"
										isclickTrigger={true}
										onChange={(value) => this.onRowChange(2, index, 'occquota', value)}
									/>
								) : (
									record.occquota.value || ''
								)
						}
					],
					data: [],
					showTab: true
				}
			], // 授信担保信息表格
			creditagree: {
				orgid: { display: '', value: null }, // 组织id  受信人 授信使用单位
				agreestatus: { display: '-', value: '0' }, // 协议状态
				vbillstatus: { display: '-', value: '0' }, // 审批状态
				agreebankid: { display: '', value: null }, // 授信银行
				currenyid: { display: '', value: null }, // 币种
				creditorgid: { display: '', value: null },
				inheritagree: { display: '', value: null }, // 继承授信协议
				agreecode: { display: '', value: null }, // 协议编码
				money: { display: '', value: null }, // 原币额度
				agreetype: { display: '', value: null }, // 协议类型
				isinherited: { display: null, value: false }, // 被继承
				version: { display: '-', value: '-' }, // 版本号
				controltype: { display: '', value: null }, // 控制方式
				actualenddate: { display: '', value: null }, // 实际结束日期
				creditcontroltype: { display: '', value: null }, // 授信控制方式
				memo: { display: '', value: null }, // 备注

				creditperiod: { display: '', value: null }, // 授信期间
				periodunit: { display: '', value: null }, // 期间单位
				begindate: { display: '', value: null }, // 起始日期
				enddate: { display: '', value: null }, // 结束日期
				guaranteetype: { display: '', value: null }, // 担保方式
				contract: { display: '', value: null }, //担保合同
				credittypecontral: { display: null, value: true }, //分授信类别控制

				code: { display: '', value: null }, // 编码
				type: { display: 'null', value: null }, // 类型
				money: { display: null, value: null }, // 金额

				creator: { display: '-', value: null }, // 创建人
				approver: { display: '-', value: null }, // 审批人
				creationtime: { display: '', value: null }, // 录入时间
				approvedate: { display: '', value: null } // 审批时间
			}, // 表头卡片
			id: null, //主表主键
			ts: null,
			orgidRef: {}, //组织参照
			agreebankidRef: {}, // 授信银行参照
			currenyidRef: {}, //币种参照
			inheritagreeRef: {}, // 继承授信协议参照
			typeRef: [], // 授信种类下的类型参照
			credituseunitRef: [], // 授信使用单位参照
			credittypeRef: [], // 授信明细上的授信类别参照
			loanbankidRef: [], //贷款银行参照
			guaranteeRef: [], //担保合同参照
			currtypeidRefTab0: [], //授信种类上的币种参照
			currtypeidRefTab1: [], //授信明细上的币种参照
			currtypeidRefTab2: [], //担保合同上的币种参照
			modifyRecordData: [], // 变更记录数据
			activeTab: 0, // 顶部锚点跳转tab
			active_table_tab: 0, // 表格tab
			checkFormNow: false, // 临时试验用，可删除
			editable: true, // 编辑态和浏览态切换
			disabled: false, // 变更态和浏览态切换 变更操作 允许变更的字段: 控制方式  原币额度 担保方式
			arrow: false, // 更多按钮是下拉是否展开
			showModal: false, // 变更记录模态框
			deletedRowTab0: { rows: [] }, //授信种类删除的行
			deletedRowTab1: { rows: [] }, //授信明细删除的行
			deletedRowTab2: { rows: [] }, //担保合同删除的行
			isReady: true // 能否发送数据的开关
		};
		this.operation = {
			title: '操作',
			key: 'cz',
			width: 150,
			render: (text, record, index) =>
				this.state.editable ? (
					<div>
						{/* 删除 */}
						<Icon
							className="iconfont icon-shanchu icon-style"
							onClick={() => this.onRowDel(this.state.active_table_tab, index, text, record)}
						/>
					</div>
				) : null
		};
	}

	// 组件挂载前给表格加操作列，并且只加一次
	componentWillMount() {
		let hasPushedOperation = this.state.guaranteeGroup[0].columns.some((item) => item.title === '操作');
		if (hasPushedOperation) return;
		this.state.guaranteeGroup.forEach((item) => {
			item.columns.push(this.operation);
		});
	}

	componentDidMount() {
		const { type } = this.props.location.query;
		if (type == 'add') return;
		const { agreestatus, id } = this.props.location.state;
		console.log('上一页传递过来的信息', type, this.props.location.state); //里面存了id的值
		if (type === 'edit') {
			// 修改
			operationType = 'edit';
			this.setState({
				creditagree: {
					...this.state.creditagree,
					agreestatus
				}
			});
		} else if (type === 'view') {
			// 查看
			operationType = 'view';
			this.setState({
				editable: false,
				creditagree: {
					...this.state.creditagree,
					agreestatus
				}
			});
		} else if (type === 'modify') {
			// 变更
			operationType = 'modify';
			this.setState({
				disabled: true,
				creditagree: {
					...this.state.creditagree,
					agreestatus
				}
			});
		}
		this.setState({ id }, this.selectById);
	}

	componentDidUnmount() {
		operationType = '';
	}

	// 滚动到锚点位置
	scrollToAnchor = (anchorName, activeTab) => {
		if (anchorName) {
			let anchorElement = document.getElementById(anchorName);
			if (anchorElement) {
				anchorElement.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
					inline: 'nearest'
				});
			}
		}
		this.setState({ activeTab });
	};

	// 取消按钮
	cancelBtn = () => {
		this.props.router.push({
			pathname: '/fm/creditmanage'
		});
	};

	// 保存按钮  新增保存,修改保存,变更保存
	saveBtn = () => {
		if (this.state.isReady) {
			this.state.isReady = false;
			let path = operationType == 'modify' ? 'change' : 'save'; // 新增和修改保存都使用save接口,变更保存使用change接口
			let data = {};
			let { creditagree, guaranteeGroup } = this.state;
			let { creditagreeid, controltype, money, guaranteetype, memo } = creditagree;
			let sendValues = {};
			for (let attr in creditagree) {
				sendValues[attr] = {
					display: creditagree[attr].display,
					value: creditagree[attr].value
				};
			}

			let credittype = { rows: [] };
			let creditdetail = { rows: [] };
			let creditguarantee = { rows: [] };
			guaranteeGroup[0].data.forEach((item, index) => {
				credittype.rows.push({
					status: item.myStatus,
					values: {
						code: { value: item.code.value },
						type: { display: item.type.display, value: item.type.value },
						currenyid: item.currenyid,
						money: { value: item.money.value },
						id: { value: item.id.value },
						creditagreeid: { value: item.creditagreeid.value },
						tenantid: { value: item.tenantid.value },
						sysid: { value: item.sysid.value },
						ts: { value: item.ts.value },
						dr: { value: item.dr.value }
					}
				});
			});
			guaranteeGroup[1].data.forEach((item, index) => {
				creditdetail.rows.push({
					status: item.myStatus,
					values: {
						credituseunit: {
							display: item.credituseunit.display,
							value: item.credituseunit.value
						},
						credittype: { display: item.credittype.display, value: item.credittype.value },
						controltype: { value: item.controltype.value },
						currtypeid: {
							display: item.currtypeid.display,
							value: item.currtypeid.value
						},
						money: { value: item.money.value },
						loanbankid: {
							display: item.loanbankid.display,
							value: item.loanbankid.value
						},
						id: { value: item.id.value },
						creditagreeid: { value: item.creditagreeid.value },
						tenantid: { value: item.tenantid.value },
						sysid: { value: item.sysid.value },
						ts: { value: item.ts.value },
						dr: { value: item.dr.value }
					}
				});
			});
			guaranteeGroup[2].data.forEach((item, index) => {
				creditguarantee.rows.push({
					status: item.myStatus,
					values: {
						guarantee: {
							display: item.guarantee.display,
							value: item.guarantee.value
						},
						currtypeid: {
							display: item.currtypeid.display,
							value: item.currtypeid.value
						},
						occquota: { value: item.occquota.value },
						creditagreeid: { value: item.creditagreeid.value },
						id: { value: item.id.value },
						tenantid: { value: item.tenantid.value },
						sysid: { value: item.sysid.value },
						ts: { value: item.ts.value },
						dr: { value: item.dr.value }
					}
				});
			});
			// 新增的行拼接上删除的行
			credittype.rows = credittype.rows.concat(this.state.deletedRowTab0.rows);
			creditdetail.rows = creditdetail.rows.concat(this.state.deletedRowTab1.rows);
			creditguarantee.rows = creditguarantee.rows.concat(this.state.deletedRowTab2.rows);
			data = {
				creditagree: {
					rows: [ { values: sendValues } ]
				},
				credittype,
				creditdetail,
				creditguarantee
			};
			Ajax({
				url: rootURL + `creditagree/${path}`,
				data: { data },
				success: (res) => {
					let { data, message, success } = res;
					if (success) {
						operationType = '';
						toast({ content: '保存成功!' });
						this.setState(
							{
								editable: false,
								id: data.creditagree.rows[0].values.id.value
							},
							this.selectById
						);
					}
					this.state.isReady = true;
				},
				error: (res) => {
					if (res === '') {
						return;
					} else {
						toast({ content: res.message, color: 'danger' });
						this.setState({
							data: []
						});
					}
					this.state.isReady = true;
				}
			});
		}
	};

	// 操作按钮
	handleOperationType = (operation) => {
		// 十一种按钮: 提交 收回 修改 删除版本 变更 变更记录 结束 取消结束 保存 返回 更多
		// 涉及editable的操作   修改,变更时editable变成true,保存时editable变成false
		// 涉及disabled的操作 变更时disabled变成true,保存时disabled变成false
		// 涉及showModal的操作  变更记录时showModal变成true
		// 剩下的提交,收回,删除版本,结束,取消结束 弹窗提醒
		// 返回跳到上一页,更多展开按钮列表
		let { id, ts } = this.state.creditagree;
		switch (operation) {
			case 'edit':
				console.log('修改');
				this.setState((preState) => ({
					editable: true,
					creditagree: preState.creditagree
				}));
				this.forceUpdate();
				operationType = 'edit';
				break;
			case 'modify':
				console.log('变更');
				operationType = 'modify';
				this.setState({
					active_table_tab: 2,
					editable: true,
					disabled: true
				});
				break;
			case 'modifyrecord':
				console.log('变更记录');
				this.setState({
					showModal: true
				});
				this.getModifyRecordData();
				break;
			case 'commit':
				console.log('提交');
				this.newRequest('commit', id, ts);
				break;
			case 'unCommit':
				console.log('收回');
				this.newRequest('unCommit', id, ts);
				break;
			case 'end':
				console.log('结束');
				this.newRequest('end', id, ts);
				break;
			case 'unend':
				console.log('取消结束');
				this.newRequest('unend', id, ts);
				break;
			case 'delversion':
				console.log('删除');
				this.newRequest('delversion', id, ts);
				break;
			default:
				break;
		}
	};

	// 删除,提交,取消提交,结束,取消结束 接口
	newRequest = (path, id, ts) => {
		if (this.state.isReady) {
			this.state.isReady = false;
			const pathMatching = [
				{ path: 'commit', type: '提交' },
				{ path: 'unCommit', type: '收回' },
				{ path: 'end', type: '结束' },
				{ path: 'unend', type: '取消结束' },
				{ path: 'delversion', type: '版本删除' }
			];
			let matched = pathMatching.find((item) => item.path == path);
			let data = {
				creditagree: {
					rows: [ { values: { id, ts } } ]
				}
			};

			Ajax({
				url: rootURL + `creditagree/${path}`,
				data: { data },
				success: (res) => {
					let { data, message, success } = res;
					if (success) {
						toast({ content: `${matched.type}成功！` });
						let id = data.creditagree.rows[0].values.id.value;
						this.setState({ id }, this.selectById);
					}
					this.state.isReady = true;
				},
				error: (res) => {
					if (res === '') {
						return;
					} else {
						toast({ content: res.message, color: 'danger' });
					}
					this.state.isReady = true;
				}
			});
		}
	};

	// 卡片的文本框，下拉框，文本域内容改变时
	handleInputChange = (key, value) => {
		// key 对应的字段
		// value 要传给后台的value
		let display;
		if (typeof value === 'object') {
			display = value.label;
			value = value.key;
		} else {
			display = value;
		}
		if (key === 'guaranteetype' && value == 1) {
			// 担保方式为信用时不显示担保合同表格
			this.state.guaranteeGroup[2].showTab = false;
		} else if (key === 'guaranteetype' && value != 1) {
			this.state.guaranteeGroup[2].showTab = true;
		}
		if (key === 'credittypecontral' && value == false) {
			// 不勾选分授信类别控制时不显示授信类别表格
			this.state.guaranteeGroup[0].showTab = false;
		} else if (key === 'credittypecontral' && value != false) {
			this.state.guaranteeGroup[0].showTab = true;
		}
		this.setState(
			{
				creditagree: {
					...this.state.creditagree,
					[key]: {
						...this.state.creditagree[key],
						display,
						value
					}
				}
			},
			() => {
				console.log('表格相关的state', this.state.guaranteeGroup);
			}
		);
	};

	// 卡片的参照内容改变时
	handleRefChange = (key, value) => {
		console.log(key, value);
		if (!value.refpk) {
			value.refpk = null;
			value.name = null;
		}
		this.setState({
			creditagree: {
				...this.state.creditagree,
				[key]: {
					...this.state.creditagree[key],
					display: value.refname,
					value: value.refpk
				}
			}
		});
	};

	// 获取详情页面数据
	selectById = () => {
		Ajax({
			url: rootURL + `creditagree/selectById`,
			data: {
				id: this.state.id //主表主键
			},
			success: (res) => {
				let { data, message, success } = res;
				console.log('请求回来的数据', res.data);
				if (success) {
					if (!data) return;
					let { creditagree, credittype, creditdetail, creditguarantee } = data;

					// 参照显示处理
					let refMappingAry = [
						{
							section: 'creditagree',
							from: 'agreebankid',
							to: 'agreebankidRef'
						},
						{ section: 'creditagree', from: 'currenyid', to: 'currenyidRef' },
						{
							section: 'creditagree',
							from: 'inheritagree',
							to: 'inheritagreeRef'
						},
						{
							section: 'credittype',
							from: 'currenyid',
							to: 'currtypeidRefTab0'
						},
						{
							section: 'creditdetail',
							from: 'credituseunit',
							to: 'credituseunitRef'
						},
						{
							section: 'creditdetail',
							from: 'loanbankid',
							to: 'loanbankidRef'
						},
						{
							section: 'creditdetail',
							from: 'currtypeid',
							to: 'currtypeidRefTab1'
						},
						{
							section: 'creditguarantee',
							from: 'currtypeid',
							to: 'currtypeidRefTab2'
						},
						{
							section: 'creditguarantee',
							from: 'guarantee',
							to: 'guaranteeRef'
						}
					];

					refMappingAry.forEach((item) => {
						if (item.section == 'creditagree') {
							this.state[item.to].refname = data[item.section].rows[0].values[item.from].display;
							this.state[item.to].refpk = data[item.section].rows[0].values[item.from].value;
						} else {
							this.state[item.to] = [];
							data[item.section] &&
								data[item.section].rows.forEach((cur) => {
									this.state[item.to].push({
										refname: cur.values[item.from].display,
										refpk: cur.values[item.from].value
									});
								});
						}
					});

					let dataSource0 = credittype ? this.formatData(credittype.rows) : [];
					let dataSource1 = creditdetail ? this.formatData(creditdetail.rows) : [];
					let dataSource2 = creditguarantee ? this.formatData(creditguarantee.rows) : [];

					this.state.guaranteeGroup[0].data = dataSource0;
					this.state.guaranteeGroup[1].data = dataSource1;
					this.state.guaranteeGroup[2].data = dataSource2;
					this.setState({
						creditagree: creditagree.rows[0].values
					});
				} else {
					toast({ content: message, color: 'warning' });
					this.err();
				}
			},
			error: (res) => {
				if (res === '') {
					return;
				} else {
					console.log('danger', res.message);
					toast({ content: res.message, color: 'danger' });
					this.setState({
						data: []
					});
				}
			}
		});
	};

	// 处理后台返回的数据
	formatData = (data) => {
		let result = [];
		data &&
			data.forEach((item, index) => {
				item.values.key = index;
				item.values.myStatus = 0; //增加一个myStatus属性,后面增删改的时候修改传给后台的status时使用
				result.push(item.values);
			});
		return result;
	};

	// 下拉列表枚举值映射
	enumMapping = (value, ary) => {
		let result = ary.find((item, index) => item.value == value);
		if (!result) return '-';
		return result.key;
	};

	disabledDate = (current) => {
		let begin = moment(this.state.creditagree.begindate.value);
		return current && current.valueOf() < begin.valueOf();
	};

	// 获取变更记录表格数据
	getModifyRecordData = () => {
		let { id } = this.state;
		Ajax({
			url: rootURL + `creditagree/recordchange`,
			data: { id },
			success: (res) => {
				let { data, message, success } = res;
				this.setState({
					modifyRecordData: this.formatData(res.data.creditagree.rows)
				});
			},
			error: (res) => {
				if (res === '') {
					return;
				} else {
					console.log('danger', res.message);
					toast({ content: res.message, color: 'danger' });
					this.setState({
						data: []
					});
				}
			}
		});
	};

	// 点击授信担保信息子表顶部的标签
	tableTabClick = (index) => {
		this.setState({
			active_table_tab: index
		});
	};

	// 点击表格的新增按钮
	onRowAdd = () => {
		let { active_table_tab, guaranteeGroup } = this.state;
		console.log('第', active_table_tab + 1, '个表格新增行');
		let valueObj = {
			display: null,
			value: null,
			scale: -1
		};

		let newRow0 = {
			myStatus: 2,
			key: 'new' + count,
			tempid: 'new' + count,
			id: JSON.parse(JSON.stringify(valueObj)),
			code: JSON.parse(JSON.stringify(valueObj)),
			currenyid: JSON.parse(JSON.stringify(valueObj)),
			type: JSON.parse(JSON.stringify(valueObj)),
			money: JSON.parse(JSON.stringify(valueObj)),
			creditagreeid: JSON.parse(JSON.stringify(valueObj)),
			tenantid: JSON.parse(JSON.stringify(valueObj)),
			sysid: JSON.parse(JSON.stringify(valueObj)),
			ts: JSON.parse(JSON.stringify(valueObj)),
			dr: {
				display: null,
				value: 0,
				scale: -1
			}
		};

		let newRow1 = {
			myStatus: 2,
			key: 'new' + count,
			tempid: 'new' + count,
			id: JSON.parse(JSON.stringify(valueObj)),
			credituseunit: JSON.parse(JSON.stringify(valueObj)),
			credittype: JSON.parse(JSON.stringify(valueObj)),
			controltype: JSON.parse(JSON.stringify(valueObj)),
			currtypeid: JSON.parse(JSON.stringify(valueObj)),
			money: JSON.parse(JSON.stringify(valueObj)),
			loanbankid: JSON.parse(JSON.stringify(valueObj)),
			creditagreeid: JSON.parse(JSON.stringify(valueObj)),
			tenantid: JSON.parse(JSON.stringify(valueObj)),
			sysid: JSON.parse(JSON.stringify(valueObj)),
			ts: JSON.parse(JSON.stringify(valueObj)),
			dr: {
				display: null,
				value: 0,
				scale: -1
			}
		};

		let newRow2 = {
			myStatus: 2,
			key: 'new' + count++,
			tempid: 'new' + count,
			id: JSON.parse(JSON.stringify(valueObj)),
			guarantee: JSON.parse(JSON.stringify(valueObj)),
			currtypeid: JSON.parse(JSON.stringify(valueObj)),
			occquota: JSON.parse(JSON.stringify(valueObj)),
			creditagreeid: JSON.parse(JSON.stringify(valueObj)),
			tenantid: JSON.parse(JSON.stringify(valueObj)),
			sysid: JSON.parse(JSON.stringify(valueObj)),
			ts: JSON.parse(JSON.stringify(valueObj)),
			dr: {
				display: null,
				value: 0,
				scale: -1
			}
		};
		active_table_tab === 0 && guaranteeGroup[0].data.push(newRow0);
		active_table_tab === 1 && guaranteeGroup[1].data.push(newRow1);
		active_table_tab === 2 && guaranteeGroup[2].data.push(newRow2);
		console.log(guaranteeGroup[active_table_tab].data);
		this.forceUpdate();
	};

	onRowDel = (tabIndex, index, text, record) => {
		// tabIndex=>点击的列表卡片的索引  index=>在对应表格中行的索引
		console.log(tabIndex, index, text, record);
		console.log('删除第' + (tabIndex + 1) + '个表格中的第' + (index + 1) + '行');
		// id值为true,说明是存在的,否则为新增的,如果是新增的,直接在deleted数组中删除这一项 通过tempid来找到这叫记录然后删除,如果是之前存在的,在deletedRow数组中增加一项
		if (record.id.value) {
			this.state['deletedRowTab' + tabIndex].rows.push({
				status: 3,
				values: { id: record.id, ts: record.ts, tenantid: record.tenantid }
			});
		}
		this.state.guaranteeGroup[tabIndex].data.splice(index, 1);

		// 还要删掉参照数组中的对应项
		switch (tabIndex) {
			case 0:
				this.state.currtypeidRefTab0.splice(index, 1);
				this.forceUpdate();
				break;
			case 1:
				this.state.credituseunitRef.splice(index, 1);
				this.state.currtypeidRefTab1.splice(index, 1);
				this.state.loanbankidRef.splice(index, 1);
				this.forceUpdate();
				break;
			case 2:
				this.state.guaranteeRef.splice(index, 1);
				this.state.currtypeidRefTab2.splice(index, 1);
				this.forceUpdate();
				break;
			default:
				break;
		}
		this.state.Ref;
		console.log('deletedRowTab0', this.state.deletedRowTab0);
		console.log('deletedRowTab1', this.state.deletedRowTab1);
		console.log('deletedRowTab2', this.state.deletedRowTab2);

		this.forceUpdate();
	};
	// 表格输入框和下拉内容改变时
	onRowChange = (tabIndex, index, key, value) => {
		// console.log(tabIndex, index, key, value); // tabIndex 3个列表卡片的索引 index 点击的行在表格中的索引 key 字段名称，value 输入后的值
		console.log(value);
		if (!value) return;
		let record = this.state.guaranteeGroup[tabIndex].data[index];
		console.log('编辑表格前的state中的字段', key, record[key]);
		if (record.id.value) {
			// 说明是在编辑之前就存在的记录而不是新增的记录,把myStatus改成1
			record.myStatus = 1;
		}
		record[key].display = value;
		record[key].value = value;
		console.log(record, 79797);
		console.log('编辑表格后的state中的字段', key, record[key]);
		this.forceUpdate();
	};

	// 表格的参照数据改变时
	onTableReferChange = (tabIndex, index, key, value) => {
		// tabIndex 表格在guaranteeGroup中的索引 ,index 修改的记录在表格guaranteeGroup[tabIndex]中的索引,key 字段 value 参照对象
		let record = this.state.guaranteeGroup[tabIndex].data[index];
		console.log('选择表格参照前的state中的字段', key, record[key]);
		if (record.id.value) {
			// 说明是在编辑之前就存在的记录而不是新增的记录,本次操作属于修改操作,要把myStatus改成1
			record.myStatus = 1;
		}
		record[key] = {
			display: value.refname,
			value: value.refpk
		};
		console.log('选择表格参照后的state中的字段', key, record[key]);
		this.forceUpdate();
	};
	// ===============FormItem试验==============//

	checkForm = (flag, obj, num) => {
		console.log('第' + num + '个');
		console.log(flag);
		console.log(obj);
	};

	handClick = () => {
		this.setState({
			checkFormNow: true
		});
	};

	// =================================//
	tabsAry = [
		{
			target: 'agreement-section',
			text: '协议信息'
		},
		{
			target: 'basic-section',
			text: '基本信息'
		},
		{
			target: 'guarantee-section',
			text: '授信担保信息'
		},
		{
			target: 'character-section',
			text: '人员信息'
		}
	];

	btnAry = [
		{ type: 'edit', text: '修改', matchingAgreeStatus: 0 },
		{ type: 'commit', text: '提交', matchingAgreeStatus: 0 },
		{ type: 'unCommit', text: '收回', matchingAgreeStatus: 3 },
		{ type: 'modify', text: '变更', matchingAgreeStatus: 4 },
		{ type: 'modifyrecord', text: '变更记录', matchingAgreeStatus: 4 },
		{ type: 'end', text: '结束', matchingAgreeStatus: 5 },
		{ type: 'unend', text: '取消结束', matchingAgreeStatus: 6 },
		{ type: 'delversion', text: '删除版本', matchingAgreeStatus: 0 }
	];
	render() {
		let { activeTab, guaranteeGroup, active_table_tab, editable, disabled, creditagree, showModal } = this.state;
		let { agreestatus } = creditagree;
		return (
			<div className="bd-wraps" id="credit_detail">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">授信</Breadcrumb.Item>
					<Breadcrumb.Item href="#/fm/creditdetail" active>
						授信协议管理
					</Breadcrumb.Item>
				</Breadcrumb>
				<Affix>
					<div className="bd-header">
						<div className="bd-title-1">银行授信协议</div>
						<ul id="nav-header" className="contstatus-group">
							{this.tabsAry.map((item, index) => (
								<li
									key={index}
									className={activeTab === index ? 'active' : ''}
									onClick={() => this.scrollToAnchor(item.target, index)}
								>
									{item.text}
									<span className="bottom-border" />
								</li>
							))}
						</ul>
						{editable ? (
							<span className="btn-group">
								<Button className="btn-2" colors="primary" type="ghost" onClick={this.saveBtn}>
									保存
								</Button>
								<Button className="btn-2 btn-cancel" shape="border" bordered onClick={this.cancelBtn}>
									取消
								</Button>
							</span>
						) : (
							<span className="btn-group">
								{/* agreestatus	协议状态 -1、待提交；0、待审批；1、审批中；2、未执行；3、在执行；4、已结束 */}

								{/* 待提交 -1 修改 提交 删除
									待审批 0 收回
									审批中 1 无
									未执行 2 无
									在执行 3 变更 变更记录 结束
									已结束 4 取消结束
								*/}
								{/* <Button
									className="btn-2"
									colors="primary"
									type="ghost"
									onClick={() => this.handleOperationType('modifyrecord')}
								>
									变更记录
								</Button> */}

								{/* {agreestatus.value == -1 && (
									<Button
										className="btn-2"
										colors="primary"
										type="ghost"
										onClick={() => this.handleOperationType('commit')}
									>
										提交
									</Button>
								)}
								{agreestatus.value == -1 && (
									<Button
										className="btn-2"
										colors="primary"
										type="ghost"
										onClick={() => this.handleOperationType('edit')}
									>
										修改
									</Button>
								)}
								{agreestatus.value == -1 && (
									<Button
										className="btn-2"
										colors="primary"
										type="ghost"
										onClick={() => this.handleOperationType('delete')}
									>
										删除
									</Button>
								)}
								{agreestatus.value == 0 && (
									<Button
										className="btn-2"
										colors="primary"
										type="ghost"
										onClick={() => this.handleOperationType('uncommit')}
									>
										收回
									</Button>
								)}
								{agreestatus.value == 3 && (
									<Button
										className="btn-2"
										colors="primary"
										type="ghost"
										onClick={() => this.handleOperationType('modify')}
									>
										变更
									</Button>
								)}
								{agreestatus.value == 3 && (
									<Button
										className="btn-2"
										colors="primary"
										type="ghost"
										onClick={() => this.handleOperationType('modifyrecord')}
									>
										变更记录
									</Button>
								)}
								{agreestatus.value == 3 && (
									<Button
										className="btn-2"
										colors="primary"
										type="ghost"
										onClick={() => this.handleOperationType('end')}
									>
										结束
									</Button>
								)}
								{agreestatus.value == 4 && (
									<Button
										className="btn-2"
										colors="primary"
										type="ghost"
										onClick={() => this.handleOperationType('unend')}
									>
										取消结束
									</Button>
								)}*/}
								<Button className="btn-2 btn-cancel" shape="border" bordered onClick={this.cancelBtn}>
									返回
								</Button>
								<Dropdown
									overlayClassName="dorpdown-menu"
									trigger={[ 'click' ]}
									animation="slide-up"
									getPopupContainer={() => document.getElementsByClassName('btn-group')[0]}
									overlay={
										<Menu>
											{this.btnAry.map((item, index) => {
												if (agreestatus.value === item.matchingAgreeStatus) {
													if (item.type === 'delversion') {
														if (creditagree.version.value - 1 > 0) {
															return (
																<MenuItem key={index}>
																	<span
																		onClick={() =>
																			this.handleOperationType(item.type)}
																	>
																		{item.text}
																	</span>
																</MenuItem>
															);
														}
													} else {
														return (
															<MenuItem key={index}>
																<span
																	onClick={() => this.handleOperationType(item.type)}
																>
																	{item.text}
																</span>
															</MenuItem>
														);
													}
												}
											})}
										</Menu>
									}
								>
									<Button
										className="btn-2 btn-cancel btn-more"
										onClick={() => {
											this.setState({ arrow: !this.state.arrow });
										}}
									>
										更多<i className={this.state.arrow ? 'arrow-open' : 'arrow-close'} />
									</Button>
								</Dropdown>
							</span>
						)}
					</div>
				</Affix>
				<section className="bd-table section-wrap" id="agreement-section">
					<div className="card-title">
						<span className="color-block" />协议信息
					</div>

					<Form
						useRow={true}
						showSubmit={false}
						submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
						checkFormNow={this.state.checkFormNow}
						className="info-form"
					>
						<FormItem
							showMast={true}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'协议编码：'}
							isRequire={true}
							errorMessage={'协议编码不能为空'}
							method="change" /* reg={item.reg}*/
						>
							{editable ? (
								<FormControl
									disabled={disabled}
									type="customer"
									placeholder={'请输入协议编码'}
									className="big-input"
									value={creditagree.agreecode.value}
									onChange={(value) => this.handleInputChange('agreecode', value)}
								/>
							) : (
								<Label>{creditagree.agreecode.value}</Label>
							)}
						</FormItem>
						<Col lg={2} md={2} sm={2} xs={2} className="text-right">
							<Label>协议状态：</Label>
						</Col>
						<Col lg={4} md={4} sm={4} xs={4}>
							{this.enumMapping(creditagree.agreestatus.value, enumData.agreeStatusAry)}
							<Label style={{ marginLeft: 55 }}>审批状态：</Label>
							{this.enumMapping(creditagree.vbillstatus.value, enumData.vbillStatusAry)}
						</Col>
						<FormItem
							showMast={true}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'授信银行：'}
							isRequire={true}
							errorMessage={'授信银行不能为空'}
							method="change" /* reg={item.reg}*/
						>
							{editable ? (
								<Refer
									ctx={'/uitemplate_web'}
									refModelUrl={'/bd/finbranchRef/'}
									refCode={'finbranchRef'}
									refName={'金融网点'}
									value={this.state.agreebankidRef}
									onChange={(value) => {
										this.handleRefChange('agreebankid', value);
										this.setState({ agreebankidRef: value });
									}}
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
								/>
							) : (
								<Label>{creditagree.agreebankid.display || '-'}</Label>
							)}
						</FormItem>
						<FormItem
							showMast={false}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'受信人：'}
							isRequire={true}
							errorMessage={'受信人不能为空'}
							method="change" /* reg={item.reg}*/
						>
							<Label>
								{creditagree.orgid.display ? creditagree.orgid.display : creditagree.orgid.value}
							</Label>
						</FormItem>
						<FormItem
							showMast={true}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'原币额度：'}
							isRequire={true}
							errorMessage={'原币额度格式错误'}
							method="change"
							reg={/^\d*\.{0,1}\d*$/}
						>
							{editable ? (
								<FormControl
									placeholder={'请输入数字'}
									className="small-input"
									value={creditagree.money.value}
									onChange={(value) => this.handleInputChange('money', value)}
								/>
							) : (
								<Label>
									{numFormat(creditagree.money.value, '') == 'NaN' ? (
										0
									) : (
										numFormat(creditagree.money.value, '')
									)}
								</Label>
							)}
						</FormItem>
						<FormItem
							showMast={false}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'币种：'}
							isRequire={true}
							errorMessage={'币种不能为空'}
							method="change" /* reg={item.reg}*/
						>
							{editable ? (
								<Refer
									disabled={disabled}
									ctx={'/uitemplate_web'}
									refModelUrl={'/bd/currencyRef/'}
									refCode={'currencyRef'}
									refName={'币种'}
									value={this.state.currenyidRef}
									onChange={(value) => {
										this.state.currenyidRef = value;
										this.handleRefChange('currenyid', value);
									}}
								/>
							) : (
								<Label>{creditagree.currenyid.display || '-'}</Label>
							)}
						</FormItem>
						<FormItem
							showMast={false}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'协议类型：'}
							isRequire={true}
							errorMessage={'协议类型不能为空'}
							method="change" /* reg={item.reg}*/
						>
							{editable ? (
								<Select
									disabled={disabled}
									labelInValue
									value={{ key: creditagree.agreetype.value }}
									onChange={(value) => this.handleInputChange('agreetype', value)}
								>
									<Option value="group">集团授信</Option>
									<Option value="org">企业授信</Option>
								</Select>
							) : (
								<Label>{this.enumMapping(creditagree.agreetype.value, enumData.agreeTypeAry)}</Label>
							)}
						</FormItem>
						<FormItem
							showMast={false}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'控制方式：'}
							isRequire={false}
							errorMessage={'控制方式不能为空'}
							method="change" /* reg={item.reg}*/
						>
							{editable ? (
								<Select
									labelInValue
									value={{ key: creditagree.controltype.value }}
									onChange={(value) => this.handleInputChange('controltype', value)}
								>
									<Option value={'prompt'}>提示</Option>
									<Option value={'control'}>控制</Option>
									<Option value={'uncontrol'}>不控制</Option>
								</Select>
							) : (
								<Label>
									{this.enumMapping(creditagree.controltype.value, enumData.controlTypeAry, '控制方式')}
								</Label>
							)}
						</FormItem>
						<FormItem
							showMast={false}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'授信占用方式：'}
							isRequire={true}
							errorMessage={'授信占用方式不能为空'}
							method="change" /* reg={item.reg}*/
						>
							{editable ? (
								<Select
									disabled={disabled}
									labelInValue
									value={{ key: creditagree.creditcontroltype.value }}
									onChange={(value) => this.handleInputChange('creditcontroltype', value)}
								>
									<Option value="total">总额控制</Option>
									<Option value="balance">余额控制</Option>
								</Select>
							) : (
								<Label>
									{this.enumMapping(
										creditagree.creditcontroltype.value,
										enumData.creditControlTypeAry
									)}
								</Label>
							)}
						</FormItem>
						<FormItem
							showMast={false}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'继承授信协议：'}
							isRequire={true}
							errorMessage={'继承授信协议不能为空'}
							method="change" /* reg={item.reg}*/
						>
							{editable ? (
								<Refer
									disabled={disabled}
									ctx={'/uitemplate_web'}
									refModelUrl={'/fm/creditref/'}
									refCode={'creditref'}
									refName={'授信协议'}
									multiLevelMenu={[
										{
											name: [ '编码' ],
											code: [ 'refcode' ]
										}
									]}
									showLabel={false}
									value={this.state.inheritagreeRef}
									onChange={(value) => this.handleRefChange('inheritagree', value)}
								/>
							) : (
								<Label>{creditagree.inheritagree.display || '-'}</Label>
							)}
						</FormItem>

						<Col lg={2} md={2} sm={2} xs={2} className="text-right">
							<Label>版本号：</Label>
						</Col>
						<Col lg={4} md={4} sm={4} xs={4}>
							<Label style={{ marginRight: 40 }}>
								{creditagree.version.value == '-' ? '-' : 'v' + creditagree.version.value + '.0'}
							</Label>
							<Checkbox
								checked={creditagree.isinherited.value}
								disabled={true}
								onChange={() => this.handleInputChange('isinherited', !creditagree.isinherited.value)}
							/>
							<Label style={{ marginLeft: 8 }}>被继承</Label>
						</Col>
						<FormItem
							showMast={false}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'实际结束日期：'}
							isRequire={true}
							errorMessage={'实际结束日期不能为空'}
							method="change" /* reg={item.reg}*/
						>
							<Label>{creditagree.actualenddate.value ? creditagree.actualenddate.value : '-'}</Label>
						</FormItem>

						<Col lg={2} md={2} sm={2} xs={2} className="text-right">
							<Label>备注：</Label>
						</Col>
						<Col lg={9} md={9} sm={9} xs={9}>
							{editable ? (
								<TextArea
									className="text-area"
									count={200}
									value={creditagree.memo.value}
									placeholder={'备注内容不超过200字'}
									onChange={(value) => this.handleInputChange('memo', value)}
								/>
							) : (
								<Label>{creditagree.memo.value || ''}</Label>
							)}
						</Col>
					</Form>
				</section>

				<section className="bd-table section-wrap" id="basic-section">
					<div className="card-title">
						<span className="color-block" />基本信息
					</div>
					<Form
						useRow={true}
						showSubmit={false}
						submitCallBack={(flag, obj) => this.checkForm(flag, obj, 1)}
						checkFormNow={this.state.checkFormNow}
						className="info-form"
					>
						<FormItem
							showMast={false}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'授信期间：'}
							isRequire={true}
							errorMessage={'授信期间格式错误'}
							method="change"
							reg={/^\d*\.{0,1}\d{0,1}$/}
						>
							{editable ? (
								<FormControl
									disabled={disabled}
									placeholder={'请输入数字'}
									className="small-input"
									value={creditagree.creditperiod.value}
									onChange={(value) => this.handleInputChange('creditperiod', value)}
								/>
							) : (
								<Label>{creditagree.creditperiod.value || ''}</Label>
							)}
						</FormItem>

						<FormItem
							showMast={false}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'期间单位：'}
							isRequire={true}
							errorMessage={'期间单位不能为空'}
							method="change" /* reg={item.reg}*/
						>
							{editable ? (
								<Select
									disabled={disabled}
									labelInValue
									value={{ key: creditagree.periodunit.value }}
									onChange={(value) => this.handleInputChange('periodunit', value)}
								>
									<Option value="YEAR">年</Option>
									<Option value="QUARTER">季度</Option>
									<Option value="MONTH">月</Option>
									<Option value="DAY">日</Option>
								</Select>
							) : (
								<Label>{this.enumMapping(creditagree.periodunit.value, enumData.periodUnitAry)}</Label>
							)}
						</FormItem>

						<FormItem
							showMast={true}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'起始日期：'}
							isRequire={true}
							errorMessage={'起始日期不能为空'}
							method="change" /* reg={item.reg}*/
						>
							{editable ? (
								<DatePicker
									disabled={disabled}
									onChange={(d) => this.handleInputChange('begindate', d.format('YYYY-MM-DD'))}
									format={'YYYY-MM-DD'}
									locale={zhCN}
									placeholder={'请选择日期'}
									onChange={(d) => this.handleInputChange('begindate', d.format('YYYY-MM-DD'))}
									value={creditagree.begindate.value ? moment(creditagree.begindate.value) : null}
								/>
							) : (
								<Label>{creditagree.begindate.value || ''}</Label>
							)}
						</FormItem>

						<FormItem
							showMast={true}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'结束日期：'}
							isRequire={true}
							errorMessage={'结束日期不能为空'}
							method="change" /* reg={item.reg}*/
						>
							{editable ? (
								<DatePicker
									disabled={disabled}
									format={'YYYY-MM-DD'}
									locale={zhCN}
									placeholder={'请选择日期'}
									disabledDate={this.disabledDate}
									value={creditagree.enddate.value}
									onChange={(d) => this.handleInputChange('enddate', d.format('YYYY-MM-DD'))}
								/>
							) : (
								<Label>{creditagree.enddate.value || ''}</Label>
							)}
						</FormItem>

						<FormItem
							showMast={false}
							inline={true}
							labelClassName="float-right"
							labelSm={2}
							labelMd={2}
							labelLg={2}
							lg={4}
							md={4}
							sm={4}
							xs={4}
							labelName={'担保方式：'}
							isRequire={true}
							errorMessage={'担保方式不能为空'}
							method="change" /* reg={item.reg}*/
						>
							{editable ? (
								<Select
									labelInValue
									value={{ key: creditagree.guaranteetype.value }}
									onChange={(value) => this.handleInputChange('guaranteetype', value)}
								>
									<Option value="1">信用</Option>
									<Option value="2">保证</Option>
									<Option value="3">质押</Option>
									<Option value="4">抵押</Option>
									<Option value="5">保证金</Option>
									<Option value="6">混合</Option>
								</Select>
							) : (
								<Label>
									{this.enumMapping(creditagree.guaranteetype.value, enumData.guaranteeTypeAry)}
								</Label>
							)}
						</FormItem>

						<Col lgOffset={2} mdOffset={2} smOffset={2} xsOffset={2} lg={4} md={4} sm={4} xs={4}>
							<Checkbox
								checked={creditagree.credittypecontral.value}
								disabled={!editable}
								onChange={() =>
									this.handleInputChange('credittypecontral', !creditagree.credittypecontral.value)}
							/>
							<Label style={{ marginLeft: 8 }}>分授信类别控制</Label>
						</Col>
					</Form>
				</section>

				<section id="guarantee-section">
					<div className="bd-header card-header">
						<div className="card-title">
							<span className="color-block" />授信担保信息
						</div>
						<div className="btn-group">
							<ButtonGroup>
								{guaranteeGroup.map(
									(item, index) =>
										item.showTab && (
											<Button
												className={active_table_tab === index ? 'tabActive' : 'tab'}
												onClick={() => {
													this.tableTabClick(index);
												}}
											>
												{item.title}
											</Button>
										)
								)}
							</ButtonGroup>
						</div>
					</div>
					<div className="card-body">
						<div className="bd-header" id="subtable-header">
							<span className="bd-title-sub">{guaranteeGroup[active_table_tab].title}</span>
							{((editable && disabled && active_table_tab === 2) || (editable && !disabled)) && (
								<Button className="btn-2 btn-cancel" onClick={this.onRowAdd}>
									新增
								</Button>
							)}
						</div>
						<Table
							className="bd-table card-subtable"
							columns={guaranteeGroup[active_table_tab].columns}
							data={guaranteeGroup[active_table_tab].data}
							emptyText={() => <span>暂无记录</span>}
						/>
					</div>
				</section>

				<section className="bd-table section-wrap" id="character-section">
					<div className="card-title">
						<span className="color-block" />人员信息
					</div>
					<Row>
						{[
							{ label: '创建人', key: 'creator' },
							{ label: '录入时间', key: 'creationtime' },
							{ label: '审批人', key: 'approver' },
							{ label: '审批时间', key: 'approvedate' }
						].map((item, index) => [
							<Col lg={2} md={2} sm={2} xs={2} className="text-right">
								<Label>{item.label}：</Label>
							</Col>,
							<Col lg={4} md={4} sm={4} xs={4}>
								<Label>{(creditagree[item.key] && creditagree[item.key].value) || '-'}</Label>
							</Col>
						])}
					</Row>
				</section>

				<ModifyRecordModal
					showModal={this.state.showModal}
					modalData={this.state.modifyRecordData}
					enumMapping={this.enumMapping}
					close={() => {
						this.setState({ showModal: false });
					}}
				/>
			</div>
		);
	}
}
