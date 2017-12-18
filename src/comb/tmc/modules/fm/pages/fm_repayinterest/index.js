import React, { Component } from 'react';
import { Row, FormControl, InputGroup, Breadcrumb } from 'tinper-bee';
import DatePicker from 'bee-datepicker';
import Select from 'bee-select';
import Refer from 'containers/Refer';
import Button from 'bee-button';
import Tabs, { TabPane } from 'bee-tabs';
import Table from 'bee-table';
import './index.less';
import Form, { FormItem } from 'bee-form';
import moment from 'moment';
import Radio from 'bee-radio';
import axios from 'axios';
import ajax from 'utils/ajax';
import ApproveDetail from 'containers/ApproveDetail';
import ApproveDetailButton from 'containers/ApproveDetailButton';
import { toast, numFormat } from 'utils/utils.js';
import nodataPic from '../../../../static/images/nodata.png';
import { hashHistory } from 'react-router';
const URL = window.reqURL.fm;
const { Option, OptGroup } = Select;
// const URL = '/';

const defaultHead = {
	rows: [
		{
			values: {
				vbillno: { display: '', value: '' }, //付息编号
				repaycode: { display: '', value: '' }, //付息编号
				loancode: { display: '', value: '' }, //放款编号
				loandate: { display: '', value: '' }, //放款日期
				financepayid: { display: '', value: '' }, //放款编号id
				repaydate: { display: '', value: '' }, //还款日期
				currtypeid: { display: '', value: '' }, //币种
				rate: { display: '', value: '' }, //本币汇率
				repaymny: { display: '', value: '' }, //付息金额
				vbillstatus: { display: '', value: '0' }, //审核状态
				paytotalintstmny: { display: '', value: '' }, //付累计利息金额
				unrepaymny: { display: '', value: '' }, //未付利息金额
				subfinstitutionid_n: { display: '', value: '' }, //贷款机构名称
				memo: { display: '', value: '' }, //备注
				settleflag: { display: '', value: '0' }, //结算状态
				loanbankid: { display: '', value: '' }, //借款单位账户
				loanbankid_n: { display: '', value: '' }, //借款单位账户名称
				loanbankid_c: { display: '', value: '' } //借款单位账户账号
			}
		}
	]
};

const defaultBody = {
	rows: []
};

export default class RepayInterest extends Component {
	constructor(props) {
		super(props);
		let type;
		if (this.props.location.query.type === 'edit') {
			type = 'edit';
		} else if (this.props.location.query.type === 'detail') {
			type = 'detail';
		} else {
			type = 'add';
		}
		this.state = {
			loancodeList: [],
			head: defaultHead,
			plan: defaultBody,
			bank: defaultBody,
			type: type,
			isRequired: {},
			checkRequired: false,
			show: false
		};
		this.scale = 2;
		this.interval = 0;
		this.loading = true;
	}

	componentDidMount() {
		let type = this.state.type;
		if (type !== 'add') {
			this.form(this.props.location.query.id);
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
				this.form(nextProps.location.query.id);
				this.setState({
					type
				});
			} else {
				this.setState({
					type,
					head: defaultHead,
					plan: defaultBody,
					bank: defaultBody
				});
			}
		}
	}

	//校验函数
	check = ({ isRequire, reg }, e) => {
		if (isRequire) {
			console.log(e.target.value);
		}
	};

	//正数校验函数
	numCheck = (num, scale) => {
		let reg = new RegExp(`^\\d+\\.?\\d{0,${scale === -1 || !scale ? this.scale : scale}}$`, 'g');
		let flag = reg.test(num);
		return flag || num === '';
	};

	sumbank = (repaymny) => {
		let bank = this.state.bank;
		//计算银团贷款
		bank.rows = bank.rows.map((e, i) => {
			e.values.actrepaymny.value = (repaymny * Number(e.values.actratio.value) / 100).toFixed(
				e.values.actrepaymny.scale === -1 ? this.scale : e.values.actrepaymny.scale
			);
			return e;
		});
		this.setState({
			bank
		});
	};

	sumplan = (repaymny) => {
		// repaymny本次还
		let plan = this.state.plan;
		plan.rows = plan.rows.map((e, i) => {
			//计算还款计划列表
			let actshdrepaymny = Number(e.values.actshdrepaymny.value || 0); //未还
			if (repaymny - actshdrepaymny >= 0) {
				repaymny -= actshdrepaymny;
				e.values.actrepaymny.value = actshdrepaymny.toFixed(
					e.values.actrepaymny.scale === -1 ? this.scale : e.values.actrepaymny.scale
				);
			} else {
				e.values.actrepaymny.value = repaymny.toFixed(
					e.values.actrepaymny.scale === -1 ? this.scale : e.values.actrepaymny.scale
				);
				repaymny = 0;
			}
			return e;
		});
		this.setState({
			plan
		});
	};

	sumhead = (repaymny) => {
		let unrepaymny = Number(this.state.head.rows[0].values.unrepaymny.value);
		let _repaymny = Number(this.state.head.rows[0].values.repaymny.value);
		this.state.head.rows[0].values.unrepaymny.value = ((Math.round(_repaymny * Math.pow(10, this.scale)) +
			Math.round(unrepaymny * Math.pow(10, this.scale)) -
			Math.round(repaymny * Math.pow(10, this.scale))) /
			Math.pow(10, this.scale)).toFixed(2);
	};

	sum = (repaymny) => {
		repaymny = Number(repaymny);
		this.sumbank(repaymny);
		this.sumplan(repaymny);
		this.sumhead(repaymny);
	};

	loanplanHandleBlur = (index, e) => {
		let value = e.target.value || '0';
		this.state.body.plan[index].actrepaymny = Number(value);
		this.setState({
			body: this.state.body
		});
	};

	//搜索放款编号
	queryfinancepaybyloancode = (searchContent) => {
		let { loancodeList } = this.state;
		let that = this;
		ajax({
			loading: this.loading,
			url: URL + 'fm/repayinterest/queryfinancepaybyloancode',
			data: { loancode: searchContent },
			success: function(res) {
				loancodeList = res.data.head
					? res.data.head.rows.map((e, i) => {
							return {
								financepayid: e.values.financepayid.value,
								// loancode: `${e.values.loancode.value}/111/222`
								loancode: `${e.values.loancode.value}/${e.values.subfinstitutionid.display}/${e.values
									.unrepaymny.value}`
							};
						})
					: [];
				that.setState({
					loancodeList
				});
			}
		});
	};

	// 查询表头信息
	queryloanbyid = () => {
		let that = this;
		ajax({
			loading: this.loading,
			url: URL + 'fm/repayinterest/queryloanbyid',
			data: { id: that.state.head.rows[0].values.financepayid.value },
			success: function(res) {
				that.valueToState(res);
			},
			error: function(err) {
				toast({ color: 'danger', content: err.message });
				that.setState({
					head: defaultHead,
					plan: defaultBody,
					bank: defaultBody
				});
			}
		});
	};

	save = () => {
		let { head, plan, bank } = this.state,
			that = this;
		let { financepayid, repaydate, currtypeid, rate, repaymny } = head.rows[0].values;
		// 必输项校验
		if (!financepayid.value) {
			toast({ content: '放款编号不能为空！', color: 'danger' });
			this.setState({
				checkRequired: true
			});
			return false;
		} else if (!repaydate.value) {
			toast({ content: '付息日期不能为空！', color: 'danger' });
			this.setState({
				checkRequired: true
			});
			return false;
		} else if (!currtypeid.value) {
			toast({ content: '币种不能为空！', color: 'danger' });
			this.setState({
				checkRequired: true
			});
			return false;
		} else if (!repaymny.value) {
			toast({ content: '付息金额不能为空！', color: 'danger' });
			this.setState({
				checkRequired: true
			});
			return false;
		}
		let status;
		switch (this.state.type) {
			case 'add':
				status = 2;
				break;
			case 'edit':
				status = 1;
				break;
			default:
				status = 0;
		}
		//添加status
		head.rows[0].status = status;
		plan.rows = plan.rows.map((e, i) => {
			e.status = status;
			return e;
		});
		bank.rows = bank.rows.map((e, i) => {
			e.status = status;
			return e;
		});
		let param = {
			head,
			bank,
			plan
		};
		ajax({
			loading: this.loading,
			url: URL + 'fm/repayinterest/save',
			data: { data: param },
			success: function(res) {
				toast({ content: '保存成功' });
				let id = res.data.head.rows[0].values.id.value;
				hashHistory.push({
					pathname: that.props.location.pathname,
					query: { ...that.props.location.query, id, type: 'detail' }
				});
			}
		});
	};

	form = (id) => {
		let { head, body } = this.state;
		let that = this;
		ajax({
			loading: this.loading,
			url: URL + 'fm/repayinterest/form',
			data: { id },
			success: function(res) {
				that.valueToState(res);
			}
		});
	};

	approve = (action) => {
		let id = this.state.head.rows[0].values.id.value;
		let ts = this.state.head.rows[0].values.ts.value;
		let that = this;
		ajax({
			loading: this.loading,
			url: `${URL}fm/repayinterest/${action}`,
			data: {
				data: {
					head: {
						rows: [
							{
								values: {
									id: { value: id },
									ts: { value: ts }
								}
							}
						]
					}
				}
			},
			success: function(res) {
				that.valueToState(res);
				switch (action) {
					case 'commit':
						toast({ color: 'success', content: '提交成功！' });
						break;
					case 'uncommit':
						toast({ color: 'success', content: '收回成功！' });
						break;
					case 'settle':
						toast({ color: 'success', content: '结算成功！' });
						break;
					case 'refreshsettle':
						toast({ color: 'success', content: '刷新成功！' });
						break;
					case 'del':
						toast({ color: 'success', content: '删除成功！' });
						hashHistory.push({
							pathname: '/fm/loantransaction',
							query: {
								key: 3
							}
						});
						break;
					default:
						break;
				}
			}
		});
	};

	valueToScale = (value, scale) => {
		if (value === '0E-8' || !value) {
			value = 0;
		}
		value = Number(value).toFixed(scale || this.scale);
		return value;
	};

	valueToState = (res) => {
		let head = res.data.head;
		head.rows[0].values = { ...this.state.head.rows[0].values, ...head.rows[0].values };
		let plan = res.data.plan || {
			rows: []
		};
		if (!head.rows[0].values.repaydate.value) {
			head.rows[0].values.repaydate.value = moment().format('YYYY-MM-DD');
		}
		//精度处理
		head.rows[0].values.rate.value = this.valueToScale(head.rows[0].values.rate.value, 4);
		head.rows[0].values.unrepaymny.value = this.valueToScale(head.rows[0].values.unrepaymny.value);
		head.rows[0].values.repaymny.value = this.valueToScale(head.rows[0].values.repaymny.value);
		head.rows[0].values.paytotalintstmny.value = this.valueToScale(head.rows[0].values.paytotalintstmny.value);
		plan.rows = plan.rows.map((e, i) => {
			//精度处理
			e.values.actshdrepaymny.value = this.valueToScale(e.values.actshdrepaymny.value);
			e.values.shdrepaymny.value = this.valueToScale(e.values.shdrepaymny.value);
			e.values.actrepaymny.value = this.valueToScale(e.values.actrepaymny.value);
			e.key = i;
			return e;
		});
		let bank = res.data.bank || {
			rows: []
		};
		bank.rows = bank.rows.map((e, i) => {
			e.values.actratio.value = this.valueToScale(e.values.actratio.value);
			e.values.actrepaymny.value = this.valueToScale(e.values.actrepaymny.value);
			e.key = i;
			return e;
		});
		this.setState({
			head,
			plan,
			bank
		});
	};

	cancel = () => {
		hashHistory.goBack();
	};

	edit = () => {
		let id = this.props.location.query.id;
		hashHistory.push({
			pathname: this.props.location.pathname,
			query: { ...this.props.location.query, type: 'edit' }
		});
	};

	render() {
		let { head, plan, bank, loancodeList, type, checkRequired } = this.state;
		let {
			vbillno,
			repaycode,
			loancode,
			loandate,
			repaydate,
			currtypeid,
			rate,
			vbillstatus,
			paytotalintstmny,
			unrepaymny,
			memo,
			settleflag,
			loanbankid,
			loanbankid_c,
			loanbankid_n,
			repaymny,
			financepayid,
			subfinstitutionid_n
		} = head.rows[0].values;
		repaydate = moment(repaydate.value);
		loandate = moment(loandate.value);
		const columns1 = [
			{ title: '还款计划编号', key: 'repayplancode', dataIndex: 'values.repayplancode.value', width: 100 },
			{ title: '付息日期', key: 'repaydate', dataIndex: 'values.repaydate.value', width: 90 },
			{
				title: '预计应付利息',
				key: 'shdrepaymny',
				dataIndex: 'values.shdrepaymny.value',
				render: (text, record, index) => {
					return <p>{numFormat(record.values.shdrepaymny.value, '')}</p>;
				},
				width: 150
			},
			{
				title: '实际应付利息',
				key: 'actshdrepaymny',
				dataIndex: 'values.actshdrepaymny.value',
				render: (text, record, index) => {
					return <p>{numFormat(record.values.actshdrepaymny.value, '')}</p>;
				},
				width: 150
			},
			{
				title: '实付利息',
				key: 'actrepaymny',
				dataIndex: 'values.actrepaymny.value',
				render: (text, record, index) => {
					return <p>{numFormat(record.values.actrepaymny.value, '')}</p>;
				},
				width: 150
			}
		];
		const columns2 = [
			{
				title: '序号',
				key: 'index',
				render: (text, record, index) => {
					return index + 1;
				}
			},
			{ title: '参与银行', key: 'bankid', dataIndex: 'values.bankid.value' },
			{
				title: '实际比例%',
				key: 'actratio',
				dataIndex: 'values.actratio.value',
				render: (text, record, index) => {
					return <p>{numFormat(record.values.actratio.value, '')}</p>;
				}
			},
			{
				title: '实付利息',
				key: 'actrepaymny',
				dataIndex: 'values.actrepaymny.value',
				render: (text, record, index) => {
					return <p>{numFormat(record.values.actrepaymny.value, '')}</p>;
				}
			}
		];
		let isApprove = this.props.location.pathname.indexOf('/approve') !== -1;
		let processInstanceId = this.props.location.query.processInstanceId;
		let businesskey = this.props.location.query.businesskey;
		let id = this.props.location.query.id;

		if (isApprove) {
			type = 'detail';
		}

		return (
			<div id="repay-interest" className="bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">融资</Breadcrumb.Item>
					<Breadcrumb.Item active>付息</Breadcrumb.Item>
				</Breadcrumb>
				{isApprove && (
					<ApproveDetail processInstanceId={processInstanceId} billid={id} businesskey={businesskey} />
				)}
				<div className="repay-interest">
					<Row componentClass="div" className="footer">
						<div xs={12} className="clearfix">
							<h6 className="main-title">付息</h6>
							{!isApprove &&
							(type === 'add' || type === undefined) && (
								<div className="sum-buttons">
									<Button className="btn-2" onClick={this.save}>
										保存
									</Button>
									<Button
										className="btn-2 btn-cancel"
										style={{ marginLeft: '8px', marginRight: '20px' }}
										onClick={this.cancel}
									>
										取消
									</Button>
								</div>
							)}
							{!isApprove &&
							type === 'edit' && (
								<div className="sum-buttons">
									<Button className="btn-2" onClick={this.save}>
										保存
									</Button>
									<Button
										className="btn-2 btn-cancel"
										style={{ marginLeft: '8px', marginRight: '20px' }}
										onClick={this.cancel}
									>
										取消
									</Button>
								</div>
							)}
							{!isApprove &&
							type === 'detail' && (
								<div className="sum-buttons">
									{settleflag.value == 0 &&
									vbillstatus.value == 0 && (
										<Button
											className="btn-2"
											style={{ marginRight: '20px' }}
											onClick={this.approve.bind(this, 'commit')}
										>
											提交
										</Button>
									)}
									{settleflag.value == 0 &&
									vbillstatus.value == 3 && (
										<Button
											className="btn-2"
											style={{ marginRight: '20px' }}
											onClick={this.approve.bind(this, 'uncommit')}
										>
											收回
										</Button>
									)}
									{((settleflag.value == 0 && vbillstatus.value === 1) ||
										settleflag.value == 1 ||
										settleflag.value == 3) && (
										<Button
											className="pull-right margin-left-10"
											onClick={this.approve.bind(this, 'settle')}
										>
											结算
										</Button>
									)}
									{settleflag.value == 1 ||
										(settleflag.value == 3 && (
											<Button
												className="pull-right margin-left-10"
												onClick={this.approve.bind(this, 'refreshsettle')}
											>
												下载结算状态
											</Button>
										))}
									{settleflag.value == 0 &&
									vbillstatus.value == 0 && (
										<Button
											className="btn-2 btn-cancel"
											style={{ marginRight: '20px' }}
											onClick={this.edit}
										>
											修改
										</Button>
									)}
									{settleflag.value == 0 &&
									vbillstatus.value == 0 && (
										<Button
											className="btn-2 btn-cancel"
											style={{ marginRight: '20px' }}
											onClick={this.approve.bind(this, 'del')}
										>
											删除
										</Button>
									)}
									{settleflag.value == 0 &&
									vbillstatus.value === 1 && (
										<ApproveDetailButton
											style={{ marginRight: '20px' }}
											processInstanceId={processInstanceId}
										/>
									)}
								</div>
							)}
						</div>
					</Row>
					<Row
						componentClass="div"
						className="clearfix"
						style={{ margin: 0, paddingTop: '20px', paddingBottom: '50px' }}
					>
						<div className="clearfix left">
							<div className="label">
								<div className="title">付息编号：</div>
								<div className="content">{vbillno.value}</div>
							</div>
							<div className="label">
								<div className="title required">放款编号：</div>
								<div className={`content ${checkRequired && 'required'}`}>
									{type === 'add' ? (
										<Refer
											ctx={'/uitemplate_web'}
											placeholder={checkRequired ? '放款编号不能为空' : '搜索放款编号'}
											refModelUrl={'/fm/financepayRef/'}
											refCode={'financepayRef'}
											refName={'放款编号'}
											value={{ refname: loancode.value, refpk: financepayid.value }}
											onChange={(value) => {
												head.rows[0].values.loancode.value = value.loancode;
												head.rows[0].values.financepayid.value = value.refpk;
												this.setState({ head });
												value.refpk && this.queryloanbyid();
											}}
											multiLevelMenu={[
												{
													name: [ '放款编号', '贷款机构', '放款金额' ],
													code: [ 'loancode', 'financorgid_n', 'loanmny' ]
												}
											]}
										/>
									) : (
										loancode.value || ''
									)}
								</div>
							</div>
							<div className="label">
								<div className="title required">付息日期：</div>
								<div className={`content ${checkRequired && 'required'}`}>
									{type !== 'detail' ? (
										<DatePicker
											placeholder={checkRequired ? '付息日期不能为空' : ''}
											style={{ width: '238px' }}
											disabled={financepayid.value ? false : true}
											value={repaydate.isValid() ? repaydate : null}
											format={'YYYY-MM-DD'}
											showToday={false}
											showTime={false}
											onSelect={(v) => {
												head.rows[0].values.repaydate.value = v.format('YYYY-MM-DD');
												this.setState({
													head
												});
											}}
											disabledDate={(current, b) => {
												// if (moment(loandate.value, 'YYYY-MM-DD').isValid()) {
												// 	console.log(true);
												// return current < moment(loandate.value, 'YYYY-MM-DD');
												return current > b;
												// }
												// return true;
											}}
											disabledDate={(current) => {
												if (loandate.isValid()) {
													return current < loandate;
												} else {
													return false;
												}
											}}
										/>
									) : repaydate.isValid() ? (
										repaydate.format('YYYY-MM-DD')
									) : (
										''
									)}
								</div>
							</div>
							<div className="label">
								<div className="title required">币种：</div>
								<div className={`content small ${checkRequired && 'required'}`}>
									{currtypeid.display || currtypeid.value}
								</div>
							</div>
							<div className="label">
								<div className="title required">本币汇率：</div>
								<div className={`content small ${checkRequired && 'required'}`}>
									{type !== 'detail' ? (
										<FormControl
											placeholder={checkRequired ? '本币汇率不能为空' : ''}
											disabled={financepayid.value ? false : true}
											value={rate.value || ''}
											onChange={(e) => {
												let value = e.target.value;
												let flag = this.numCheck(value, 4);
												if (!flag) {
													return false;
												}
												if (value[0] === '0' && value[1] !== '.') {
													value = String(Number(value));
												}
												head.rows[0].values.rate.value = value;
												this.setState({
													head
												});
											}}
											onBlur={(e) => {
												head.rows[0].values.rate.value = this.valueToScale(e.target.value, 4);
												this.setState({
													head
												});
											}}
										/>
									) : rate.value ? (
										numFormat(rate.value, '')
									) : (
										''
									)}
								</div>
							</div>
							<div className="label">
								<div className="title required">付息金额：</div>
								<div className={`content ${checkRequired && 'required'}`}>
									{type !== 'detail' ? (
										<FormControl
											placeholder={checkRequired ? '付息金额不能为空' : ''}
											disabled={financepayid.value ? false : true}
											value={repaymny.value || ''}
											onChange={(e) => {
												let value = e.target.value,
													that = this;
												let flag = this.numCheck(value, repaymny.scale);
												if (!flag) {
													return false;
												}
												let total = plan.rows
													.map((e) => e.values.actshdrepaymny.value)
													.reduce((a, b) => {
														return (
															(Number(a) * Math.pow(10, that.scale) +
																Number(b) * Math.pow(10, that.scale)) /
															Math.pow(10, that.scale)
														);
													});
												// let total =
												// 	(Number(unrepaymny.value) * Math.pow(10, this.scale) +
												// 		Number(repaymny.value) * Math.pow(10, this.scale)) /
												// 	Math.pow(10, this.scale);
												if (Number(value) > Number(total)) {
													value = Number(total).toFixed(2);
												}
												this.sum(Number(value));
												if (value[0] === '0' && value[1] !== '.') {
													value = String(Number(value));
												}
												head.rows[0].values.repaymny.value = value;
												this.setState({ head });
											}}
											onBlur={(e) => {
												head.rows[0].values.repaymny.value = this.valueToScale(e.target.value);
												this.setState({
													head
												});
											}}
										/>
									) : repaymny.value ? (
										numFormat(repaymny.value, '')
									) : (
										''
									)}
								</div>
							</div>
							<div className="label">
								<div className="title">未付利息金额：</div>
								<div className="content">{unrepaymny.value ? numFormat(unrepaymny.value, '') : ''}</div>
							</div>
							<div className="label">
								<div className="title">审核状态：</div>
								<div className="content">
									{[ '待提交', '审批通过', '审批中', '待审批' ][Number(vbillstatus.value)]}
								</div>
							</div>
							<div className="label">
								<div className="title">付累计利息金额：</div>
								<div className="content">
									{paytotalintstmny.value ? numFormat(paytotalintstmny.value, '') : ''}
								</div>
							</div>
							<div className="label">
								<div className="title">结算状态：</div>
								<div className="content">
									{[ '待结算', '结算中', '结算成功', '结算失败' ][Number(settleflag.value)]}
								</div>
							</div>
							<div className="label">
								<div className="title">贷款机构：</div>
								<div className="content">{subfinstitutionid_n.value}</div>
							</div>
							<div className="label">
								<div className="title">借款单位账户：</div>
								<div className="content">
									{type !== 'detail' ? (
										<Refer
											disabled={financepayid.value ? false : true}
											ctx={'/uitemplate_web'}
											refModelUrl={'/bd/bankaccbasRef/'}
											refCode={'bankaccbasRef'}
											multiLevelMenu={[
												{
													name: [ '子户编码', '子户名称' ],
													code: [ 'refcode', 'refname' ]
												}
											]}
											referFilter={{
												accounttype: 0, //01234对应活期、定期、通知、保证金、理财
												currtypeid: currtypeid.value, //币种pk
												orgid: '' //组织pk
											}}
											value={{
												refpk: loanbankid.value,
												refname: loanbankid.display
											}}
											onChange={(value) => {
												head.rows[0].values.loanbankid.value = value.refpk;
												// head.rows[0].values.loanbankid_n.value = value.refname;
												// head.rows[0].values.loanbankid_c.value = value.refcode;
												head.rows[0].values.loanbankid.display = value.refname;
												this.setState({ head });
											}}
										/>
									) : (
										loanbankid.value
									)}
								</div>
							</div>
							<div className="label">
								<div className="title">备注：</div>
								{type !== 'detail' ? (
									<div className="content" style={{ height: 'auto' }}>
										<textarea
											className="textarea u-form-control"
											rows="3"
											disabled={financepayid.value ? false : true}
											value={memo.value || ''}
											onChange={(e) => {
												head.rows[0].values.memo.value = e.target.value;
												this.setState({ head });
											}}
										/>
										<span className="memo-num">{memo.value ? memo.value.length : 0}/200</span>
									</div>
								) : (
									<div className="content">{memo.value || ''}</div>
								)}
							</div>
						</div>
						<div className="right">
							<div>
								<Tabs defaultActiveKey="1" tabBarStyle="simple" className="tabs">
									<TabPane tab="还款计划" key="1">
										<div xs={12}>
											<Table
												emptyText={() => (
													<div>
														<img src={nodataPic} alt="" />
													</div>
												)}
												className="bd-table"
												columns={columns1}
												data={plan.rows.filter((e, i) => {
													return type !== 'detail' || Number(e.values.actrepaymny.value) > 0;
												})}
												rowKey="key"
												scroll={{ y: 400 }}
											/>
										</div>
									</TabPane>
									<TabPane tab="银团贷款" key="2">
										<div xs={12}>
											<Table
												emptyText={() => (
													<div>
														<img src={nodataPic} alt="" />
													</div>
												)}
												className="bd-table"
												columns={columns2}
												data={bank.rows}
											/>
										</div>
									</TabPane>
								</Tabs>
							</div>
						</div>
					</Row>
				</div>
			</div>
		);
	}
}
