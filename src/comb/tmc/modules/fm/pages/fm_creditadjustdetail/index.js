/**
 * 授信调整卡片页
 * songxt7
 */
import React, { Component, isValidElement } from 'react';
import { Breadcrumb, Button, FormControl, Label } from 'tinper-bee';
import DatePicker from 'bee-datepicker';
import moment from 'moment';
import { hashHistory } from 'react-router';
import Tabs, { TabPane } from 'bee-tabs';
import { Con, Row, Col } from 'bee-layout';
import Select from 'bee-select';
import { numFormat, toast } from '../../../../utils/utils.js';
import Refer from '../../../../containers/Refer';
import axios from 'axios';
import ajax from 'utils/ajax';
import ApproveDetail from 'containers/ApproveDetail';
import ApproveDetailButton from 'containers/ApproveDetailButton';
import './index.less';

const URL = window.reqURL.fm;
const Option = Select.Option;
const format = 'YYYY-MM-DD HH:mm:ss';
const format_ymd = 'YYYY-MM-DD';
const dateInputPlaceholder = '选择日期';
const defaultHead = {
	pageinfo: {
		number: 0,
		numberOfElements: 1,
		size: 0,
		totalElements: 1,
		totalPages: 1
	},
	rows: [
		{
			rowId: null,
			values: {
				orgid: {
					//公司名id
					display: null,
					scale: -1,
					value: null
				},
				vbillstatus: {
					//审批状态
					display: null,
					scale: 2,
					value: 0
				},
				vbillno: {
					//单据编号
					display: null,
					scale: -1,
					value: '-'
				},
				creditid: {
					//授信协议id
					display: null,
					scale: -1,
					value: ''
				},
				cccurrtypeid: {
					//授信币种
					display: '',
					scale: -1,
					value: ''
				},
				credittypeid: {
					//授信协议类型id
					display: null,
					scale: -1,
					value: ''
				},
				bankcretypeid: {
					//授信协议类别id
					display: null,
					scale: -1,
					value: ''
				},
				writebackdir: {
					//回写方向
					display: null,
					scale: 2,
					value: 2
				},
				ccamount: {
					//占用授信金额
					display: null,
					scale: 2,
					value: ''
				},
				remarks: {
					//备注
					display: null,
					scale: -1,
					value: ''
				},
				creator: {
					//创建人id
					display: null,
					scale: -1,
					value: null
				},
				creationtime: {
					//创建时间------录入时间
					display: null,
					scale: -1,
					value: null
				},
				approver: {
					//审批人id
					display: null,
					scale: -1,
					value: null
				},
				approvedate: {
					//审批日期
					display: null,
					scale: -1,
					value: null
				}
			}
		}
	]
};

function onSelect() {}
export default class CreditAdjustDetail extends Component {
	constructor(props) {
		super(props);
		let type;
		const a = JSON.parse(JSON.stringify(defaultHead));
		if (this.props.location.query.type === 'edit') {
			type = 'edit';
		} else if (this.props.location.query.type === 'detail') {
			type = 'detail';
		} else {
			type = 'add';
		}
		this.state = {
			head: a,
			type: type,
			checkRequired: false,
			finorgRef: {
				id: '',
				refname: '',
				refpk: ''
			},
			creditidRef: {
				id: '',
				refcode: '',
				refpk: '',
				refname: ''
			},
			bankcretypeidRef: {
				id: '',
				refname: '',
				refpk: ''
			}
		};
	}
	componentWillMount() {
		let type;
		if (this.props.location.query.type === 'edit') {
			type = 'edit';
		} else if (this.props.location.query.type === 'detail') {
			type = 'detail';
		} else {
			type = 'add';
		}

		if (type !== 'add') {
			this._getFormData(this.props.location.query.id);
			this.setState({
				type
			});
		} else {
			let a = JSON.parse(JSON.stringify(defaultHead));
			this.setState({
				type,
				head: a
			});
		}
	}
	componentWillReceiveProps(nextProps) {
		let type;
		if (nextProps.location.query.type === 'edit') {
			type = 'edit';
		} else if (nextProps.location.query.type === 'detail') {
			type = 'detail';
		} else {
			type = 'add';
		}
		if (this.state.type !== type) {
			if (type !== 'add') {
				this._getFormData(nextProps.location.query.id);
				this.setState({
					type
				});
			} else {
				let a = JSON.parse(JSON.stringify(defaultHead));
				this.setState({
					type,
					head: a
				});
			}
		}
	}
	cancel = () => {
		window.history.back();
	};
	// 取消按钮
	comeBackBtn = () => {
		hashHistory.push(`/fm/creditadjust`);
	};

	valueToState = (res) => {
		let head = res.data.head;
		head.rows[0].values = { ...this.state.head.rows[0].values, ...head.rows[0].values };
		let { ccamount } = head.rows[0].values;
		if (ccamount.value == '0E-8') {
			ccamount.value = 0;
		}
		ccamount.value = Number(ccamount.value).toFixed(2);
		//参照显示处理
		let { orgid, creditid, bankcretypeid } = head.rows[0].values;

		this.setState({
			head,
			finorgRef: {
				refpk: orgid.value,
				refname: orgid.display,
				id: orgid.value
			},
			creditidRef: {
				refpk: creditid.value,
				refname: creditid.display,
				refcode: creditid.display,
				id: creditid.value
			},
			bankcretypeidRef: {
				refpk: bankcretypeid.value,
				refname: bankcretypeid.display,
				id: bankcretypeid.value
			}
		});
	};

	_getFormData = (id) => {
		let _valueToState = this.valueToState;
		ajax({
			url: URL + 'fm/creditAdjust/queryById',
			data: { id },
			success: function(res) {
				_valueToState(res);
			}
		});
	};
	//正数校验函数
	numCheck = (num, scale) => {
		let reg = new RegExp(`^\\d+\\.?\\d{0,${scale === -1 || !scale ? this.scale : scale}}$`, 'g');
		let flag = reg.test(num);
		return flag || num === '';
	};
	// approve = (status) => {
	// 	let id = this.state.head.rows[0] && this.state.head.rows[0].values.id.value;
	// 	let ts = this.state.head.rows[0] && this.state.head.rows[0].values.ts.value;
	// 	ajax({
	// 		url: `${URL}fm/repayinterest/${status}`,
	// 		data: { id, ts },
	// 		success: function(res) {}
	// 	});
	// };
	// 点击操作按钮执行对应的操作
	handleOperationType = (type) => {
		// console.log(operation, index, text, record);
		if (!this.state.head || !this.state.head.rows[0]) {
			return;
		}
		let id = this.state.head.rows[0].values.id.value;
		let tenantid = this.state.head.rows[0].values.tenantid.value;
		let ts = this.state.head.rows[0].values.ts.value;
		let reqdata = {};
		let url = '';
		switch (type) {
			case 'commit':
				console.log('提交');
				(url = URL + 'fm/creditAdjust/commit'),
					(reqdata = {
						data: {
							head: {
								pageinfo: null,
								rows: [
									{
										values: {
											tenantid: { value: tenantid },
											id: { value: id },
											ts: { value: ts }
										}
									}
								]
							}
						}
					});
				break;
			case 'uncommit':
				console.log('取消提交');
				(url = URL + 'fm/creditAdjust/uncommit'),
					(reqdata = {
						data: {
							head: {
								pageinfo: null,
								rows: [
									{
										values: {
											tenantid: { value: tenantid },
											id: { value: id },
											ts: { value: ts }
										}
									}
								]
							}
						}
					});
				break;
			default:
				break;
		}
		this.reqAjax(type, url, reqdata);
	};
	// ajax请求
	reqAjax = (type, url, reqdata) => {
		if (url == null || url == '' || reqdata == null || reqdata == '') {
			return;
		}
		ajax({
			url: url,
			data: reqdata,
			success: (res) => {
				const { data, message, success } = res;
				if (success) {
					let mess =
						type == 'commit'
							? '提交成功'
							: type == 'uncommit' ? '取消提交' : type == 'delete' ? '删除成功' : '' + '...';
					toast({ content: mess, color: 'success' });
					let id = res.data.head.rows[0].values.id.value;
					this._getFormData(id);
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};

	handleInputOnChange = (key, e) => {
		let eValue = e.target.value;
		if (key == 'ccamount') {
			let flag = this.numCheck(eValue, 2);
			if (!flag) {
				return false;
			}
			if (eValue[0] === '0' && eValue[1] !== '.') {
				eValue = String(Number(eValue));
			}
		}
		this.state.head.rows[0].values[key].value = eValue;
		this.setState({
			head: this.state.head
		});
	};
	handleInputOnChange_n = (key, e) => {
		//改变ID和name
		let eValue = e.target.value;
		this.state.head.rows[0].values[key].value = eValue;
		this.state.head.rows[0].values[key].display = eValue;
		this.setState({
			head: this.state.head
		});
	};
	handleInputOnChange_ref = (key, e) => {
		//改变ID和name
		let eValue = e;
		console.log('eValue', eValue);
		if (key == 'orgid') {
			this.state.head.rows[0].values[key].value = eValue.id;
			this.state.head.rows[0].values[key].display = eValue.refname;
			this.setState({
				head: this.state.head,
				finorgRef: {
					...eValue
				}
			});
		} else if (key == 'bankcretypeid') {
			this.state.head.rows[0].values[key].value = eValue.refpk;
			this.state.head.rows[0].values[key].display = eValue.refname;
			this.setState({
				head: this.state.head,
				bankcretypeidRef: {
					...eValue
				}
			});
		} else if (key == 'creditid') {
			this.state.head.rows[0].values[key].value = eValue.refpk;
			this.state.head.rows[0].values[key].display = eValue.refcode;
			//自动赋值授信币种、协议类型
			this.state.head.rows[0].values.cccurrtypeid.value = eValue.currenyid ? eValue.currenyid : '';
			this.state.head.rows[0].values.cccurrtypeid.display = eValue.currenyid_n ? eValue.currenyid_n : '';
			this.state.head.rows[0].values.credittypeid.value = eValue.agreetype ? eValue.agreetype : '';
			this.state.head.rows[0].values.credittypeid.display =
				eValue.agreetype == 'org' ? '企业授信' : eValue.agreetype == 'group' ? '集团授信' : '';
			this.setState(
				{
					head: this.state.head,
					creditidRef: {
						refpk: eValue.refpk,
						id: eValue.refpk,
						refname: eValue.refcode,
						refcode: eValue.refcode
					}
				},
				() => {
					console.log('creditidRef', this.state.creditidRef);
				}
			);
		}
	};

	handleDeleteData = () => {
		let { tenantid, ts } = this.state.head.rows[0].values;
		let id = this.props.location.query.id;
		let param = {
			head: {
				pageinfo: null,
				rows: [
					{
						rowId: null,
						values: {
							tenantid: {
								display: null,
								scale: -1,
								value: tenantid.value
							},
							id: {
								display: null,
								scale: -1,
								value: id
							},
							ts: {
								display: null,
								scale: -1,
								value: ts.value
							}
						},
						status: 3
					}
				]
			}
		};
		let _href = '/#/fm/creditadjust';
		ajax({
			url: URL + 'fm/creditAdjust/logicDel',
			data: { data: param },
			success: function(res) {
				toast({ content: '删除成功' });
				window.location.href = _href;
			}
		});
	};
	handleButtonSave = () => {
		let {
			orgid,
			vbillno,
			creditid,
			ccamount,
			credittypeid,
			bankcretypeid,
			cccurrtypeid,
			creator,
			writebackdir
		} = this.state.head.rows[0].values;
		if (!orgid.value) {
			toast({content:'公司名不能为空！',color:'warning'});
			this.setState({
				checkRequired: true
			});
			return false;
		} else if (!creditid.value) {
			toast({content:'授信协议名称不能为空！',color:'warning'});
			this.setState({
				checkRequired: true
			});
			return false;
		} else if (!cccurrtypeid.value) {
			toast({content:'授信币种不能为空！',color:'warning'});
			this.setState({
				checkRequired: true
			});
			return false;
		} else if (!credittypeid.value) {
			toast({content:'授信协议类型不能为空！',color:'warning'});
			this.setState({
				checkRequired: true
			});
			return false;
		} else if (!bankcretypeid.value) {
			toast({content:'银行授信协议类别不能为空！',color:'warning'});
			this.setState({
				checkRequired: true
			});
			return false;
		} else if (!ccamount.value) {
			toast({content:'占用授信金额不能为空！',color:'warning'});
			this.setState({
				checkRequired: true
			});
			return false;
		}
		let status; //2-新增 1-修改 3-删除 0-未更改
		switch (this.state.type) {
			case 'add':
				status = 2;
				break;
			case 'edit':
				status = 1;
				break;
			case 'delete':
				status = 3;
				break;
			default:
				status = 0;
		}
		//添加status
		this.state.head.rows[0].status = status;
		if (!ccamount.value) {
			ccamount.value = 0.0;
		}
		ccamount.value = parseFloat(ccamount.value).toFixed(2);
		this.state.head.rows[0].values.writebackdir.value = parseInt(this.state.head.rows[0].values.writebackdir.value);
		let head = this.state.head;
		let param = { head: head };
		let preHref = this.props.location.pathname;
		// console.log({data:param})
		ajax({
			url: URL + 'fm/creditAdjust/save',
			data: { data: param },
			success: (res) => {
				// this.valueToState(res);
				let id = res.data.head.rows[0].values.id.value;
				let _href = `/#${preHref}?type=detail&id=${id}`;
				window.location.href = _href;
				toast({ content: '保存成功' });
			}
		});
	};
	handleButtonUpdata = () => {
		let preHref = this.props.location.pathname;
		let id = this.props.location.query.id;
		let _href = `/#${preHref}?type=edit&id=${id}`;
		window.location.href = _href;
	};
	handleDatePickerOnChange = (d, key) => {
		let eValue = d.format(format);
		this.state.head.rows[0].values[key].value = eValue;
		this.setState({
			head: this.state.head
		});
	};
	render() {
		let isApprove = this.props.location.pathname.indexOf('/approve') !== -1;
		let processInstanceId = this.props.location.query.processInstanceId;
		let businesskey = this.props.location.query.businesskey;
		let id = this.props.location.query.id;
		console.log('审批流',id);
		let {
			orgid,
			vbillstatus,
			vbillno,
			creditid,
			credittypeid,
			bankcretypeid,
			writebackdir,
			cccurrtypeid,
			remarks,
			ccamount,
			creator,
			creationtime,
			approver,
			approvedate
		} = this.state.head.rows[0].values;
		let { checkRequired } = this.state;
		return (
			<div id="cradit-adjust-detail" className="bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">融资交易</Breadcrumb.Item>
					<Breadcrumb.Item active>授信</Breadcrumb.Item>
				</Breadcrumb>
				{isApprove && (
					<ApproveDetail
						processInstanceId={processInstanceId}
						billid={id}
						businesskey={businesskey}
						refresh={this._getFormData.bind(this, id)}
					/>
				)}
				<div className="cradit-adjust-detail">
					<div className="main-header">
						<h6 className="main-title">授信协议调整明细</h6>

						{this.state.type !== 'detail' && (
							<div className="sum-buttons">
								<Button className="btn-2" onClick={this.handleButtonSave.bind(this)}>
									保存
								</Button>
								<Button className="btn-2 btn-cancel" onClick={this.cancel}>
									取消
								</Button>
							</div>
						)}
						{this.state.type === 'detail' && (
							<div className="sum-buttons">
								{vbillstatus.value == 0 && (
									<Button className="btn-2" onClick={this.handleButtonUpdata.bind(this)}>
										编辑
									</Button>
								)}
								{vbillstatus.value == 0 && (
									<Button
										className="btn-2 btn-cancel"
										onClick={this.handleOperationType.bind(this, 'commit')}
									>
										提交
									</Button>
								)}
								{vbillstatus.value == 3 && (
									<Button
										className="btn-2 btn-cancel"
										onClick={this.handleOperationType.bind(this, 'uncommit')}
									>
										收回
									</Button>
								)}

								{vbillstatus.value == 0 && (
									<Button className="btn-2 btn-cancel" onClick={this.handleDeleteData.bind(this)}>
										删除
									</Button>
								)}
								{(vbillstatus.value == 1 || vbillstatus.value == 2) && (
									<ApproveDetailButton processInstanceId={processInstanceId} />
								)}
								<Button
									className="btn-2 btn-cancel"
									shape="border"
									bordered
									onClick={this.comeBackBtn.bind(this)}
								>
									返回
								</Button>
							</div>
						)}
						<div className="main-content">
							<Tabs defaultActiveKey="1" className="tabs">
								<TabPane tab="协议调整信息" key="1">
									<div xs={12} className="section">
										<div className="section-title">协议调整信息</div>
										<Row>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title isRequire">公司：</div>
													<div className="label-content">
														{this.state.type !== 'detail' ? (
															<Refer
																placeholder={checkRequired ? '公司名不能为空' : ''}
																ctx={'/uitemplate_web'}
																refModelUrl={'/bd/finorgRef/'}
																refCode={'finorgRef'}
																refName={'财务组织'}
																showLabel={false}
																value={this.state.finorgRef}
																onChange={(e) => {
																	this.handleInputOnChange_ref('orgid', e);
																}}
															/>
														) : (
															<span className="label-view-8px">{orgid.display || ''}</span>
														)}
													</div>
												</div>
											</Col>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title">审批状态：</div>
													<div className="label-content">
														<span className="label-view-8px">
															{[ '待提交', '审批通过', '审批中', '待审批' ][
																Number(vbillstatus.value)
															] || ''}
														</span>
													</div>
												</div>
											</Col>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title">单据编号：</div>
													<div className="label-content">
														<span className="label-view-8px">{vbillno.value}</span>
													</div>
												</div>
											</Col>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title isRequire">授信协议：</div>
													<div className="label-content">
														{this.state.type !== 'detail' ? (
															<Refer
																placeholder={checkRequired ? '授信协议不能为空' : ''}
																ctx={'/uitemplate_web'}
																refModelUrl={'/fm/creditref/'}
																refCode={'creditref'}
																refName={'授信协议'}
																showLabel={false}
																value={this.state.creditidRef}
																multiLevelMenu={[
																	{
																		name: [ '编码' ],
																		code: [ 'refcode' ]
																	}
																]}
																onChange={(e) => {
																	this.handleInputOnChange_ref('creditid', e);
																}}
															/>
														) : (
															<span className="label-view-8px">{creditid.display || ''}</span>
														)}
													</div>
												</div>
											</Col>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title isRequire">授信协议类型：</div>
													<div className="label-content">
														{this.state.type !== 'detail' ? (
															<FormControl
																type="text"
																disabled
																value={credittypeid.display}
																placeholder={checkRequired ? '授信协议类型不能为空' : ''}
																onChange={this.handleInputOnChange_n.bind(
																	this,
																	'credittypeid'
																)}
															/>
														) : (
															<span className="label-view-8px">{credittypeid.display || ''}</span>
														)}
													</div>
												</div>
											</Col>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title isRequire">授信类别：</div>
													<div className="label-content">
														{this.state.type !== 'detail' ? (
															<Refer
																/* disabled={disabled} */
																placeholder={checkRequired ? '授信类别不能为空' : ''}
																ctx={'/uitemplate_web'}
																refModelUrl={'/bd/cctypeRef/'}
																refCode={'cctypeRef'}
																refName={'授信类别'}
																showLabel={false}
																value={this.state.bankcretypeidRef}
																onChange={(e) => {
																	this.handleInputOnChange_ref('bankcretypeid', e);
																}}
															/>
														) : (
															<span className="label-view-8px">{bankcretypeid.display || ''}</span>
														)}
													</div>
												</div>
											</Col>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title isRequire">回写方向：</div>
													<div className="label-content label-narrow">
														{this.state.type !== 'detail' ? (
															<Select
																value={String(writebackdir.value)}
																onChange={(value) => {
																	writebackdir.value = value;
																	this.setState({
																		head: this.state.head
																	});
																}}
															>
																<Option value="1">释放</Option>
																<Option value="2">占用</Option>
															</Select>
														) : writebackdir.value == 1 ? (
															<span className="label-view-8px">{'释放'}</span>
															
														) : (
															<span className="label-view-8px">{'占用' || ''}</span>
														)}
													</div>
												</div>
											</Col>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title isRequire">授信币种：</div>
													<div className="label-content label-narrow">
														{/* <FormControl type="text" value="人民币"/> */}
														{this.state.type !== 'detail' ? (
															<FormControl
																value={cccurrtypeid.display}
																disabled
																placeholder={checkRequired ? '授信币种不能为空' : ''}
																onChange={this.handleInputOnChange_n.bind(
																	this,
																	'cccurrtypeid'
																)}
																type="text"
															/>
														) : (
															<span className="label-view-8px">{cccurrtypeid.display || ''}</span>
														)}
													</div>
												</div>
											</Col>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title">备注：</div>
													<div className="label-content">
														{this.state.type !== 'detail' ? (
															<FormControl
																value={remarks.value}
																onChange={this.handleInputOnChange.bind(
																	this,
																	'remarks'
																)}
																type="text"
															/>
														) : (
															<span className="label-view-8px">{remarks.value || ''}</span>
														)}
													</div>
												</div>
											</Col>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title isRequire">占用授信金额：</div>
													<div className="label-content">
														{this.state.type !== 'detail' ? (
															<FormControl
																value={ccamount.value}
																placeholder={checkRequired ? '占用授信金额不能为空' : ''}
																onChange={this.handleInputOnChange.bind(
																	this,
																	'ccamount'
																)}
																type="text"
															/>
														) : ccamount.value ? (
															<span className="label-view-8px">{numFormat(ccamount.value, '')}</span>
														) : (
															<span className="label-view-8px">{0.0 || ''}</span>
														)}
													</div>
												</div>
											</Col>
										</Row>
									</div>
								</TabPane>
								<TabPane tab="人员信息" key="2">
									<div xs={12} className="section">
										<div className="section-title">人员信息</div>
										<Row>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title">创建人：</div>
													<div className="label-content">
														{/*{this.state.type !== 'detail' ? (
															<FormControl
																value={creator.display}
																disabled
																placeholder={checkRequired ? '创建人不能为空' : ''}
																onChange={this.handleInputOnChange_n.bind(
																	this,
																	'creator'
																)}
																type="text"
															/>
														) : (
															creator.display || ''
														)} */}
														<span className="label-view-8px">{creator.display || creator.value || ''}</span>
													</div>
												</div>
											</Col>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title">录入日期：</div>
													<div className="label-content">
														{/* <DatePicker
															format={format_ymd}
															disabled={true}
															onSelect={onSelect}
															onChange={(value) =>
																this.handleDatePickerOnChange(value, 'creationtime')}
															defaultValue={
																moment(creationtime.value).isValid() ? (
																	moment(creationtime.value)
																) : null
															}
														/> */}
														<span className="label-view-8px">
															{moment(creationtime.value).isValid() ? (
																moment(creationtime.value).format(format_ymd)
															) : (
																''
															)}
														</span>
													</div>
												</div>
											</Col>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title ">审批人：</div>
													<div className="label-content">
														{/* {this.state.type !== 'detail' ? (
															<FormControl
																value={approver.display}
																disabled
																onChange={this.handleInputOnChange_n.bind(
																	this,
																	'approver'
																)}
																type="text"
															/>
														) : (
															approver.display || ''
														)} */}
														<span className="label-view-8px">{approver.display || approver.value || ''}</span>
													</div>
												</div>
											</Col>
											<Col md={6} xs={6} sm={6}>
												<div className="label">
													<div className="label-title ">审批日期：</div>
													<div className="label-content">
														{/* <DatePicker
															format={format_ymd}
															disabled
															onSelect={onSelect}
															onChange={(value) =>
																this.handleDatePickerOnChange(value, 'approvedate')}
															defaultValue={
																moment(approvedate.value).isValid() ? (
																	moment(approvedate.value)
																) : null
															}
														/> */}
														<span className="label-view-8px">
															{moment(approvedate.value).isValid() ? (
																moment(approvedate.value).format(format_ymd)
															) : null}
														</span>
													</div>
												</div>
											</Col>
										</Row>
									</div>
								</TabPane>
							</Tabs>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
