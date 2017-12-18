/**
 * 金融网点模态框
 */
import React, { Component } from 'react';
import moment from 'moment';
import { Switch, Select, Tooltip, Button, FormControl, Modal, Form, FormGroup } from 'tinper-bee';
import DatePicker from 'bee-datepicker';
import Refer from '../../../../containers/Refer';

const Option = Select.Option;
export default class FinBankModal extends Component {
	constructor(props) {
		super(props);
		// 其实这里用formData来做,但是tinper-bee没有提供方案
		this.state = {
			// fininstitutionname: this.props.modalData.fininstitutionname, //金融网点ID
			// branchnumber: '', //联行行号
			// finbankname: '', //网点名称
			// swiftcode: '', //Swift代码
			// province: '', // 省
			// city: '', //市
			// phone: '', //电话
			// address: '' //地址
			...this.props.modalData
		};
	}
	// 省份改变
	handleProvinceChange = (e) => {
		var firstcity = this.props.getProvince(e).city[0].name;
		console.log(e + '省市默认的城市是' + firstcity);
		this.setState({
			city: firstcity
		});
		this.setState({
			province: e
		});
		this.props.getProvince(e);
		// this.props.provinceChange(e);
	};
	handleCityChange = (e) => {
		this.setState({
			city: e
		});
	};
	// 电话
	phoneChange = (e) => {
		var phone = e.target.value;
		var length = phone.length;
		if (isNaN(phone)) {
			phone = _phone;
			this.setState({ info: '只能输入数字!' });
			setTimeout(
				function() {
					this.setState({ info: '' });
				}.bind(this),
				1000
			);
		} else if (length > 11) {
			phone = _phone;
			this.setState({ info: '电话不能大于11位!' });
			setTimeout(
				function() {
					this.setState({ info: '' });
				}.bind(this),
				1000
			);
		} else {
			_phone = phone;
		}
		this.setState({ phone: phone });
	};

	close = (type) => {
		if (this.props.onClick) {
			console.log(type);
			this.props.onClick(type);
			// 取消时不清楚清除数据
			this.setState({
				name: '',
				fininstitutionname: '',
				branchnumber: '',
				swiftcode: '',
				province: '',
				city: '',
				phone: '',
				address: '',
				ts: ''
			});
		}
	};

	// componentWillReceiveProps(nextProps) {
	// 	this.setState({
	// 		fininstitutionname: nextProps.modalData.fininstitutionname,
	// 		branchnumber: nextProps.modalData.branchnumber,
	// 		finbankname: nextProps.modalData.finbankname,
	// 		swiftcode: nextProps.modalData.swiftcode,
	// 		province: nextProps.modalData.province,
	// 		city: nextProps.modalData.city,
	// 		phone: nextProps.modalData.phone,
	// 		address: nextProps.modalData.address
	// 	});
	// }

	handleSubmit = () => {
		const newData = this.props.modalData;
		newData.fininstitutionname = this.state.fininstitutionname;
		newData.branchnumber = this.state.branchnumber;
		newData.code = this.state.code;
		newData.name = this.state.name;
		newData.swiftcode = this.state.swiftcode;
		newData.province = this.state.province;
		newData.city = this.state.city;
		newData.phone = this.state.phone;
		newData.address = this.state.address;
		newData.ts = this.state.ts;
		this.props.onSubmit(newData, this.props.opre);
	};

	render() {
		const { showModal, opre } = this.props;
		let { checked, value } = this.state;
		// checked = modalData && modalData.orderStatus == 1 ? true : checked
		console.log(this.state);
		return (
			<Modal id="finbankmodal" show={showModal} className="modal-style">
				<Form horizontal>
					<Modal.Header closeButton onHide={this.close}>
						<Modal.Title>{'编辑 银行网点'}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormGroup>
							<span className="modal-label">联行行号：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入联行行号"
								value={this.state.branchnumber}
								onChange={(e) => this.setState({ branchnumber: e.target.value })}
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label">Swift代码：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入Swift代码"
								value={this.state.swiftcode}
								onChange={(e) => this.setState({ swiftcode: e.target.value })}
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label">省份：</span>
							<Select
								className="modal-content modal-small"
								dropdownClassName="modal-small-option"
								getPopupContainer = {()=> document.querySelector('#finbankmodal')}								
								value={this.state.province}
								showSearch
								dropdownStyle={{ zIndex: 18000 }}
								onChange={this.handleProvinceChange.bind(this)}
							>
								{this.props.provinceOption()}
							</Select>
						</FormGroup>

						<FormGroup>
							<span className="modal-label">城市：</span>
							<Select
								className="modal-content modal-small"
								dropdownClassName="modal-small-option"
								getPopupContainer = {()=> document.querySelector('#finbankmodal')}
								value={this.state.city}
								dropdownStyle={{ zIndex: 18000 }}
								onChange={this.handleCityChange.bind(this)}
							>
								{this.props.cityOption(this.state.province)}
							</Select>
						</FormGroup>

						<FormGroup>
							<span className="modal-label">电话：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入电话"
								value={this.state.phone}
								onChange={this.phoneChange.bind(this)}
								/* onChange={(e) => this.setState({ phone: e.target.value })} */
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label">地址：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入地址"
								value={this.state.address}
								onChange={(e) => this.setState({ address: e.target.value })}
							/>
						</FormGroup>
					</Modal.Body>
					<Modal.Footer>
						<Button onClick={this.handleSubmit.bind(this)} colors="primary" className="btn-2">
							确认
						</Button>
						<Button onClick={this.close.bind(this, 'cancel')} shape="border" className="btn-2 btn-cancel">
							取消
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		);
	}
}
