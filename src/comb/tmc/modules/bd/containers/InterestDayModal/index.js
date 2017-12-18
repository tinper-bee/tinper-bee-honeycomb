/**
 * 结息日新增、修改modal
 */

import React, { Component } from 'react';
import moment from 'moment';
import { Switch, Select, Tooltip, Button, FormControl, Modal, Form, FormGroup } from 'tinper-bee';
import DatePicker from 'bee-datepicker';
import { inputNumberProcess, rateInputCtr } from '../../pages/bd_rate/BdCheckUtil';

const Option = Select.Option;
const interestdayOp = [];
const MAX_INT = 9007199254740992;
for (var index = 1; index < 32; index++) {
	interestdayOp.push(
		<Option key={index} value={index}>
			{index}
		</Option>
	);
}

export default class InterestDayModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// id: '',
			// code: '',
			// name: '',
			// type: null,
			// cycle: null,
			// unit: null,
			// interestday: null,
			// memo: '',
			// ts: ''
			...this.props.modalData
		};
	}

	close = (type) => {
		if (this.props.onClick) {
			console.log(type);
			this.props.onClick(type);
			// 取消时不清楚清除数据
			this.setState({
				code: '',
				name: '',
				type: null,
				cycle: null,
				unit: null,
				interestday: null,
				memo: '',
				ts: ''
			});
		}
	};
	// 设置结息周期和结息单位
	setInterestType = (e) => {
		if (e === '3') {
			this.setState({
				type: {
					value: e
				},
				unit: { value: '1' },
				cycle: 1
			});
		}else if(e === '1'){
			this.setState({
				type: {
					value: e
				},
				unit: { value: '1' },
				cycle: 6
			});
		}else{
			this.setState({
				type: {
					value: e
				},
				unit: { value: e },
				cycle: 1
			});
		}
	};

	// componentWillReceiveProps(nextProps) {
	// 	this.setState({
	// 		...nextProps.modalData
	// 	});
	// }

	handleSubmit = () => {
		const newData = this.props.modalData;
		newData.id = this.state.id;
		newData.code = this.state.code;
		newData.name = this.state.name;
		newData.type = this.state.type ? this.state.type.value : null;
		newData.cycle = this.state.cycle;
		newData.unit = this.state.unit ? this.state.unit.value : null;
		newData.interestday = this.state.interestday;
		newData.memo = this.state.memo;
		newData.ts = this.state.ts;
		this.props.onSubmit(newData, this.props.opre);
	};

	render() {
		const { showModal, opre } = this.props;
		let { value } = this.state;
		const opreflag = opre == 'edit'? true : false;
		// checked = modalData && modalData.orderStatus == 1 ? true : checked
		console.log(this.state);
		return (
			<Modal id="interestdaymodal" show={showModal} className="modal-style" onHide={this.close}>
				<Form horizontal>
					<Modal.Header closeButton>
						<Modal.Title>{opre == 'add' ? '新增' : opre == 'edit' ? '编辑' : '结息日'}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormGroup>
							<span className="modal-label isRequire">编码：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入编码"
								value={this.state.code}
								onChange={(e) => this.setState({ code: e.target.value })}
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">名称：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入名称"
								value={this.state.name}
								onChange={(e) => this.setState({ name: e.target.value })}
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">结息方式：</span>
							<Select
								className="modal-content modal-small"
								value={this.state.type ? String(this.state.type.value) : null}
								disabled={opreflag}
								showSearch
								getPopupContainer = {()=> document.querySelector('#interestdaymodal')}
								style={{ width: 100 }}
								dropdownClassName="modal-small-option"
								dropdownStyle={{ zIndex: 18000 }}
								onChange={this.setInterestType}
							>
								<Option value="0">按年</Option>
								<Option value="1">按半年</Option>
								<Option value="2">按季度</Option>
								<Option value="3">按月</Option>
							</Select>
						</FormGroup>

						<FormGroup>
							<span className="modal-label">结息周期：</span>
							<FormControl
								className="modal-content modal-input-small"
								placeholder="请输入结息周期"
								disabled
								value={this.state.cycle}
								onChange={(e) =>
									this.setState({ cycle: inputNumberProcess(e.target.value, MAX_INT, 0) })}
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label">结息单位：</span>

							<Select
								className="modal-content modal-small"
								value={this.state.unit ? String(this.state.unit.value) : null}
								style={{ width: 100 }}
								disabled
								getPopupContainer = {()=> document.querySelector('#interestdaymodal')}
								dropdownClassName="modal-small-option"
								dropdownStyle={{ zIndex: 18000 }}
								onChange={(e) =>
									this.setState({
										unit: {
											value: e
										}
									})}
							>
								<Option value="0">年</Option>
								<Option value="2">季度</Option>
								<Option value="1">月</Option>
								<Option value="3">日</Option>
							</Select>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">结息日：</span>

							<Select
								className="modal-content modal-small"
								value={this.state.interestday}
								getPopupContainer = {()=> document.querySelector('#interestdaymodal')}
								style={{ width: 100 }}
								disabled={opreflag}
								placeholder="请输入结息日"
								dropdownClassName="modal-small-option"
								dropdownStyle={{ zIndex: 18000 }}
								onChange={(e) =>
									this.setState({
										interestday: e
									})}
							>
								{interestdayOp}
							</Select>
						</FormGroup>

						<FormGroup>
							<span className="modal-label">备注：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入备注"
								value={this.state.memo}
								onChange={(e) => this.setState({ memo: e.target.value })}
							/>
						</FormGroup>
					</Modal.Body>
					<Modal.Footer>
						<Button className="btn-2" onClick={this.handleSubmit.bind(this)}>
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
