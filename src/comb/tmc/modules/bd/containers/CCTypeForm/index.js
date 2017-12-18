import React, { Component } from 'react';
import moment from 'moment';
import { Switch, Tooltip, Button, FormControl, Modal, Form, FormGroup } from 'tinper-bee';
import axios from 'axios';
import DatePicker from 'bee-datepicker';

export default class CCTypeForm extends Component {
	constructor(props) {
		super(props);
		// 其实这里用formData来做,但是tinper-bee没有提供方案
		//动态加入字段

		this.state = {
			code: '',
			name: '',
			createName: '',
			checked: false,
			orderTime: null,
			ts: ''
		};
	}

	changeHandle = (e) => {
		this.setState({
			checked: !this.state.checked
		});
	};

	onDateSelect = (e) => {
		var time = e.format('YYYY-MM-DD HH:mm:ss');
		this.setState({
			orderTime: time
		});
	};

	close = (type) => {
		if (type !== 'cancel') {
			if (type === 'add') {
				var { id, code, name, createName, checked: orderStatus, orderTime } = this.state;
			} else if (type === 'edit') {
				var { id, code, name, createName, checked: orderStatus, orderTime } = Object.assign(
					{},
					this.props.modalData,
					this.state
				);
			}
			orderStatus = orderStatus ? 1 : 0;
			this.opreTableDate(id, code, name, createName, orderStatus, orderTime);
		}

		if (this.props.onClick) {
			this.props.onClick(type);
			// 清除数据
			this.setState({
				code: '',
				name: '',
				createName: '',
				checked: false,
				orderTime: null,
				ts: ''
			});
		}
	};

	componentWillReceiveProps(nextProps) {
		this.setState({
			code: nextProps.modalData.code,
			name: nextProps.modalData.name,
			createName: nextProps.modalData.createName,
			checked: nextProps.modalData.checked,
			orderTime: nextProps.modalData.orderTime,
			ts: nextProps.modalData.ts
		});
	}

	handleSubmit = () => {
		const newData = this.props.modalData;
		newData.code = this.state.code;
		newData.name = this.state.name;
		newData.ts = this.state.ts;
		this.props.onSubmit(newData, this.props.opre);
	};

	ModalRow = (modalData) => {
		return (
			<ul className="credit-modal">
				{modalData.map((data) => {
					const key = data.key;
					alert(this.state[key]);
					return (
						<li>
							<FormGroup>
								<span className="modal-label">{data.title}:</span>
								<FormControl
									className="modal-content"
									type="text"
									placeholder={'请输入' + data.title}
									value={this.state[key]}
									onChange={(e) => this.setState({ code: e.target.value })}
								/>
							</FormGroup>
						</li>
					);
				})}
			</ul>
		);
	};

	render() {
		const { showModal, opre, modalData } = this.props;
		let { checked, value } = this.state;
		// checked = modalData && modalData.orderStatus == 1 ? true : checked
		return (
			<Modal show={showModal} className="modal-style" onHide={ this.close.bind(this, 'cancel') }>
				<Form horizontal>
					<Modal.Header closeButton>
						<Modal.Title>{opre == 'add' ? '新增' : opre == 'edit' ? '编辑' : '授信类别'}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormGroup>
							<span className="modal-label isRequire">编码:</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入编码"
								value={this.state.code}
								onChange={(e) => this.setState({ code: e.target.value })}
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">名称:</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入名称"
								value={this.state.name}
								onChange={(e) => this.setState({ name: e.target.value })}
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
