import React, { Component } from 'react';
import moment from 'moment';
import { Switch, Tooltip, Button, FormControl, Modal, Form, FormGroup } from 'tinper-bee';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import axios from 'axios';
import Select from 'bee-select';
import './index.less'

export default class BalaTypeForm extends Component {
	constructor(props) {
		super(props);
		// 其实这里用formData来做,但是tinper-bee没有提供方案
		//动态加入字段

		this.state = {
			code: '',
			name: '',
			attr: '',
			ts: ''
		};
	}

	close = (type) => {
		if (type !== 'cancel') {
			if (type === 'add') {
				var { id, code, name, attr } = this.state;
			} else if (type === 'edit') {
				var { id, code, name, attr,ts } = Object.assign({}, this.props.modalData, this.state);
			}
		}

		if (this.props.onClick) {
			this.props.onClick(type);
			// 清除数据
			this.setState({
				code: '',
				name: '',
				attr: '',
				ts: ''
			});
		}
	};

	componentWillReceiveProps(nextProps) {
		this.setState({
			code: nextProps.modalData.code,
			name: nextProps.modalData.name,
			attr: nextProps.modalData.attr,
			ts: nextProps.modalData.ts
		});
	}

	handleSubmit = () => {
		const newData = this.props.modalData;
		newData.code = this.state.code;
		newData.name = this.state.name;
		newData.attr = this.state.attr;
		newData.ts = this.state.ts;
		this.props.onSubmit(newData, this.props.opre);
	};

	ModalRow = (modalData) => {
		return (
			<ul>
				{modalData.map((data) => {
					const key = data.key;
					alert(this.state[key]);
					return (
						<li>
							<FormGroup>
								<span>{data.title}：</span>
								<FormControl
									
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
			<Modal id="balatypeform" show={showModal} className='modal-style' onHide={ this.close }>
				<Form horizontal>
					<Modal.Header closeButton>
						<Modal.Title>{opre == 'add' ? '新增' : opre == 'edit' ? '编辑' : '授信类别'}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<ul>
							<li>
								<FormGroup>
									<span className='modal-label isRequire'>编码：</span>
									<FormControl
										type="text"
										placeholder="请输入编码"
										value={this.state.code}
										className="modal-content"
										onChange={(e) => this.setState({ code: e.target.value })}
									/>
								</FormGroup>
							</li>
							<li>
								<FormGroup>
									<span className='modal-label isRequire' >名称：</span>
									<FormControl
										type="text"
										placeholder="请输入名称"
										className="modal-content"
										value={this.state.name}
										onChange={(e) => this.setState({ name: e.target.value })}
									/>
								</FormGroup>
							</li>
							<li>
								<FormGroup>
									<span className='modal-label'>属性：</span>
									<Select
										defaultValue={this.state.attr}
										getPopupContainer = {()=> document.querySelector('#balatypeform')}
										style={{ width: 200, marginRight: 6 }}
										dropdownStyle={{ zIndex: 18000 }}
										className="modal-content modal-input-small"
										onChange={(value) => this.setState({ attr: value })}
									>   
										<Option value="2"></Option>
										<Option value="0">银企联云</Option>
										<Option value="1">银企直联</Option>
									</Select>
								</FormGroup>
							</li>
						</ul>
					</Modal.Body>
					<Modal.Footer>
						<Button className='btn-2' onClick={this.handleSubmit.bind(this)}>
							确认
						</Button>
						<Button className='btn-2 btn-cancel' onClick={this.close.bind(this, 'cancel')}>
							取消
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		);
	}
}
