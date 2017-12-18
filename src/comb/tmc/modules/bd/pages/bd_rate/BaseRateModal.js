/**
 * 基准利率档案新增、修改模态框
 * majfd
 * 2017/11/4
 */
import React, { Component } from 'react';
import moment from 'moment';
import { Switch, Select, Tooltip, Button, Modal, FormGroup, Form, Row, Col } from 'tinper-bee';
import axios from 'axios';
import DatePicker from 'bee-datepicker';
// import Form from 'bee-form';
// const FormItem = Form.FormItem;
import Refer from '../../../../containers/Refer';
import FormControl from 'bee-form-control';
import InputNumber from 'bee-input-number';
import { inputNumberProcess, rateInputCtr } from './BdCheckUtil';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
const Option = Select.Option;
let _rate = ''; /*保存上次的值*/
const regExp = /^[1-9]\d*$/;

export default class BaseRateModal extends Component {
	constructor(props) {
		super(props);
		// 其实这里用formData来做,但是tinper-bee没有提供方案
		this.state = {
			showOverFlag: this.props.modalData.ratetype
				? this.props.modalData.ratetype.value == '1' ? true : false
				: false,
			currtypeidRef: {
				id: '',
				refcode: '',
				refname:
					this.props.modalData.currtypeid && this.props.modalData.currtypeid.display
						? this.props.modalData.currtypeid.display
						: '',
				refpk:
					this.props.modalData.currtypeid && this.props.modalData.currtypeid.value
						? this.props.modalData.currtypeid.value
						: ''
			},
			// code: '', //利率编码
			// name: '', //利率名称
			// ratedays: '360', //利率天数
			// enable: '', //启用状态
			// creator: '', //创建人
			// creationtime: null, //创建时间
			// ratetype: '', //利率类型
			// ratestartdate: null, //利率起效日期
			// currtypeid: '', //币种
			// rate: '', //利率
			// ratechangedate: null, //利率变更日期
			// version: '' //版本号
			...this.props.modalData
		};
	}
	// 获取币种档案
	getCurrType = () => {
		let options = this.setState.options;
		let provinceOptions = options.map((province) => <Option key={province}>{province}</Option>);
		return provinceOptions;
	};
	// 获取利率
	checkRate = (e) => {
		var rate = e;
		if (!rate) {
			rate = '';
			return rate;
		}
		if (isNaN(rate)) {
			rate = _rate;
			this.setState({ info: '只能输入数字!' });
			setTimeout(
				function() {
					this.setState({ info: '' });
				}.bind(this),
				1000
			);
		} else if (rate > 100 || rate < 0) {
			rate = _rate;
			this.setState({ info: '利率不能大于100或小于0!' });
			setTimeout(
				function() {
					this.setState({ info: '' });
				}.bind(this),
				1000
			);
		} else {
			if (rateInputCtr(rate, this.state.digit)) {
				_rate = rate;
			} else {
				rate = _rate;
			}
		}
		return rate;
	};
	// 利率变更
	changeYRate = (e) => {
		var rate = e;
		rate = this.checkRate(e);
		this.setState({ rate: rate });
	};
	changeAdvance = (e) => {
		var rate = e;
		rate = this.checkRate(e);
		this.setState({ advance: rate });
	};
	changeOverdue = (e) => {
		var rate = e;
		rate = this.checkRate(e);
		this.setState({ overdue: rate });
	};
	// 利率精度改变
	changeRatePrecision = (e) => {
		if (!e) {
			this.setState({ digit: '' });
			return;
		}
		var digit = inputNumberProcess(e, 8, 0);
		this.setState({
			digit: digit,
			rate: this.state.rate ? parseFloat(this.state.rate).toFixed(digit) : null,
			advance: this.state.advance ? parseFloat(this.state.advance).toFixed(digit) : null,
			overdue: this.state.overdue ? parseFloat(this.state.overdue).toFixed(digit) : null
		});
	};
	// 利率起效日期
	onratestartdateSelect = (e) => {
		var time = e.format('YYYY-MM-DD');
		console.log(time);
		this.setState({
			ratestartdate: time
		});
	};
	// 日利率天数改变
	handleDayYearChange = (e) => {
		this.setState({
			ratedays: e
		});
	};
	// 利率类型改变
	handleRateTypeChange = (e) => {
		let ratetype = parseInt(e);

		this.setState({
			ratetype: {
				value: e
			}
		});
		// 利率类型为贷款利率时，不显示逾期和提前利率
		if (ratetype == 1) {
			this.setState({
				showOverFlag: true
			});
		} else {
			this.setState({
				showOverFlag: false
			});
		}
		console.log('利率类型为' + e);
	};

	close = (type) => {
		if (this.props.onClick) {
			console.log(type);
			this.props.onClick(type);
			// 取消时不清楚清除数据
			this.setState({
				code: '', //利率编码
				name: '', //利率名称
				ratedays: '', //利率天数
				enable: '', //启用状态
				creator: '', //创建人
				creationtime: null, //创建时间
				ratetype: '', //利率类型
				ratestartdate: null, //利率起效日期
				currtypeid: '', //币种
				rate: null, //利率
				ratechangedate: null, //利率变更日期
				version: null, //版本号
				advance: null,
				overdue: null,
				digit: null
			});
		}
	};

	// componentWillReceiveProps(nextProps) {
	// 	this.setState({
	// 		code: nextProps.modalData.code,
	// 		name: nextProps.modalData.name,
	// 		ratedays: nextProps.modalData.ratedays,
	// 		creator:{
	// 			display:nextProps.modalData.creator.display,
	// 			value:nextProps.modalData.creator.value,
	// 		},
	// 		creationtime: nextProps.modalData.creationtime,
	// 		ratetype:{
	// 			display:nextProps.modalData.ratetype.display,
	// 			value:nextProps.modalData.ratetype.value,
	// 		},
	// 		// ratetype: nextProps.modalData.ratetype,
	// 		ratestartdate: nextProps.modalData.ratestartdate,
	// 		currtypeid:{
	// 			display:nextProps.modalData.currtypeid.display,
	// 			value:nextProps.modalData.currtypeid.value,
	// 		},
	// 		// currtypeid: nextProps.modalData.currtypeid,
	// 		rate: nextProps.modalData.rate,
	// 		advance: nextProps.modalData.advance,
	// 		overdue: nextProps.modalData.overdue,
	// 		digit: nextProps.modalData.digit,
	// 		ratechangedate: nextProps.modalData.ratechangedate
	// 	});
	// 	// this.setState(...this.props.modalData);
	// }

	handleSubmit = () => {
		// let {} =
		console.log('提交数据');
		console.log('币种', this.state.currtypeid);
		console.log(this.state.ratetype);
		const newData = this.props.modalData;
		newData.code = this.state.code;
		newData.name = this.state.name;
		newData.ratedays = this.state.ratedays;
		newData.creator = this.state.creator;
		newData.ratetype = this.state.ratetype.value;
		newData.ratestartdate = this.state.ratestartdate;
		newData.currtypeid = this.state.currtypeid;
		newData.rate = this.state.rate;
		newData.overdue = this.state.overdue;
		newData.advance = this.state.advance;
		newData.digit = this.state.digit;
		newData.originalid = this.state.originalid;
		newData.ts = this.state.ts;
		// newData.ratechangedate = this.state.ratechangedate;
		this.props.onSubmit(newData, this.props.opre);
	};

	render() {
		const { showModal, opre } = this.props;
		let { checked, value, showOverFlag, digit } = this.state;

		// checked = modalData && modalData.orderStatus == 1 ? true : checked
		return (
			<Modal id="baseratemodal" show={showModal} className="modal-style" onHide={this.close.bind(this, 'cancel')}>
				<Form horizontal>
					<Modal.Header closeButton>
						<Modal.Title>{opre == 'add' ? '新增' : opre == 'edit' ? '编辑' : '利率管理'}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormGroup>
							<span className="modal-label isRequire">利率编码：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入编号"
								value={this.state.code}
								onChange={(e) => this.setState({ code: e })}
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">利率名称：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入名称"
								value={this.state.name}
								onChange={(e) => this.setState({ name: e })}
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">利率天数：</span>
							<div className="modal-content modal-small">
								<Select
									showSearch
									value={this.state.ratedays ? String(this.state.ratedays) : ''}
									defaultValue={360}
									getPopupContainer = {()=> document.querySelector('#baseratemodal')}
									dropdownStyle={{ zIndex: 18000 }}
									onChange={this.handleDayYearChange.bind(this)}
								>
									<Option value="360">360</Option>
									<Option value="365">365</Option>
								</Select>
							</div>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">利率类型：</span>
							<div className="modal-content modal-small">
								<Select
									value={this.state.ratetype ? String(this.state.ratetype.value) : ''}
									dropdownStyle={{ zIndex: 18000 }}
									getPopupContainer = {()=> document.querySelector('#baseratemodal')}
									onChange={this.handleRateTypeChange.bind(this)}
								>
									<Option value="0">Libor利率</Option>
									<Option value="1">贷款利率</Option>
									<Option value="2">活期利率</Option>
									<Option value="3">定期利率</Option>
								</Select>
							</div>
						</FormGroup>

						<FormGroup className="rate-date">
							<span className="modal-label isRequire">利率起效日期：</span>
							<div className="modal-content modal-small">
								<DatePicker
									format="YYYY-MM-DD"
									locale={zhCN}
									value={
										this.state.ratestartdate ? moment(this.state.ratestartdate) : moment()
									}
									/* onSelect={(e)=>this.onSelect} */
									onChange={this.onratestartdateSelect}
									placeholder={'选择日期时间'}
								/>
							</div>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">币种：</span>
							<Refer
								refModelUrl={'/bd/currencyRef/'}
								refCode={'currencyRef'}
								refName={'币种'}
								ctx={'/uitemplate_web'}
								showLabel={false}
								value={this.state.currtypeidRef}
								//需要重算精度
								onChange={(e) => {
									console.log('------');
									console.log(e);
									this.setState({
										currtypeidRef: { ...e },
										currtypeid: {
											value: e.refpk,
											display: e.refname
										}
									});
								}}
							/>
						</FormGroup>

						<FormGroup className="modal-rate">
							<span className="modal-label isRequire">利率%：</span>
							<FormControl
								className="modal-content modal-input-small"
								type="text"
								placeholder="请输入利率%"
								value={this.state.rate ? this.state.rate : ''}
								onChange={this.changeYRate}
							/>
						</FormGroup>

						{showOverFlag && (
							<FormGroup className="modal-rate">
								<span className="modal-label">逾期利率%：</span>
								<FormControl
									className="modal-content modal-input-small"
									type="text"
									placeholder="请输入逾期利率%"
									value={this.state.overdue}
									onChange={this.changeOverdue}
								/>
							</FormGroup>
						)}
						{showOverFlag && (
							<FormGroup className="modal-rate">
								<span className="modal-label">提前利率%：</span>
								<FormControl
									className="modal-content modal-input-small"
									type="text"
									placeholder="请输入提前利率%"
									value={this.state.advance}
									onChange={this.changeAdvance}
								/>
							</FormGroup>
						)}

						<FormGroup>
							<span className="modal-label isRequire">利率精度：</span>
							<FormControl
								className="modal-content modal-input-small"
								type="text"
								placeholder="请输入利率精度"
								value={this.state.digit ? this.state.digit : ''}
								onChange={this.changeRatePrecision}
							/>
						</FormGroup>
					</Modal.Body>
					<Modal.Footer>
						<Button className="btn-2" onClick={this.handleSubmit.bind(this)} colors="primary">
							确认
						</Button>
						<Button className="btn-2 btn-cancel" onClick={this.close.bind(this, 'cancel')} shape="border">
							取消
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		);
	}
}
