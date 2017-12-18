import React, { Component } from 'react';
import moment from 'moment';
import { Switch, Tooltip, Button, FormControl, Modal, Form, FormGroup } from 'tinper-bee';
import axios from 'axios';
import DatePicker from 'bee-datepicker';

export default class CreditModal extends Component {
	constructor(props) {
		super(props);
		// 其实这里用formData来做,但是tinper-bee没有提供方案
		this.state = {
			code: '',
			purchaseName: '',
			createName: '',
			checked: false,
			orderTime: 1509429402642
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

	opreTableDate = (id, code, purchaseName, createName, orderStatus, orderTime) => {
		let _this = this;
		let url = id ? '/api/creditUpdateItem' : '/api/creditCreateItem';
		console.log(url, id, code, purchaseName, createName, orderStatus, orderTime);
		axios
			.post(url, {
				id,
				code,
				purchaseName,
				createName,
				orderStatus,
				orderTime
			})
			.then(function(res) {
				if (res.data.statusCode == 200) {
					_this.props.onRefresh && _this.props.onRefresh();
				}
			})
			.catch(function(error) {
				console.log(error);
			});
	};

	close = (type) => {
		if (type !== 'cancel') {
			if (type === 'add') {
				var { id, code, purchaseName, createName, checked: orderStatus, orderTime } = this.state;
			} else if (type === 'edit') {
				var { id, code, purchaseName, createName, checked: orderStatus, orderTime } = Object.assign(
					{},
					this.props.modalData,
					this.state
				);
			}
			orderStatus = orderStatus ? 1 : 0;
			this.opreTableDate(id, code, purchaseName, createName, orderStatus, orderTime);
		}

		if (this.props.onClick) {
			this.props.onClick(type);
			// 清除数据
			this.setState({
				code: '',
				purchaseName: '',
				createName: '',
				checked: false,
				orderTime: null
			});
		}
	};

	componentWillReceiveProps(nextProps) {
		this.setState({
			code: nextProps.modalData.code,
			purchaseName: nextProps.modalData.purchaseName,
			createName: nextProps.modalData.createName,
			checked: nextProps.modalData.checked,
			orderTime: nextProps.modalData.orderTime
		});
	}

	render() {
		const { showModal, opre } = this.props;
		let { checked, value } = this.state;
		// checked = modalData && modalData.orderStatus == 1 ? true : checked
		return (
			<Modal show={showModal} className='modal-style' onHide={ this.close }>
				<Form horizontal>
					<Modal.Header closeButton>
						<Modal.Title>{opre == 'add' ? '新增' : opre == 'edit' ? '编辑' : '授信类别'}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<ul className='credit-modal'>
							<li>
								<FormGroup>
									<span className='credit-modal-title fl isRequire'>编 码：</span>
									<FormControl
										className='fl'
										type='text'
										placeholder='请输入编号'
										value={this.state.code}
										onChange={(e) => this.setState({ code: e.target.value })}
									/>
								</FormGroup>
							</li>
							<li>
								<FormGroup>
									<span className='credit-modal-title fl isRequire'>名 称：</span>
									<FormControl
										className='fl'
										type='text'
										placeholder='请输入名称'
										value={this.state.purchaseName}
										onChange={(e) => this.setState({ purchaseName: e.target.value })}
									/>
								</FormGroup>
							</li>
							<li>
								<FormGroup>
									<span className='credit-modal-title fl'>启用状态：</span>
									<span className='fl'>
										<Switch
											value={this.state.checked == 1 ? true : false}
											onChangeHandler={this.changeHandle}
											checkedChildren={'开'}
											unCheckedChildren={'关'}
										/>
										<Tooltip
											placement='right'
											className='credit-tooltip'
											style={{ visibility: checked ? 'visible' : 'hidden' }}
										>
											开启成功
										</Tooltip>
									</span>
								</FormGroup>
							</li>
							<li>
								<FormGroup>
									<span className='credit-modal-title fl'>创 建 人：</span>
									<span className='fl'>
										<FormControl
											type='text'
											className='credit-modal-datePicker'
											placeholder='请输入姓名'
											value={this.state.createName}
											onChange={(e) => this.setState({ createName: e.target.value })}
										/>
									</span>
								</FormGroup>
							</li>
							<li>
								<FormGroup>
									<span className='credit-modal-title fl'>开户时间：</span>
									<span className='fl'>
										<DatePicker
											className='credit-modal-datePicker'
											format='YYYY-MM-DD HH:mm:ss'
											onSelect={this.onDateSelect}
											value={moment(this.state.orderTime)}
											placeholder={'选择日期时间'}
										/>
									</span>
								</FormGroup>
							</li>
						</ul>
					</Modal.Body>
					<Modal.Footer>
						<Button className='btn-2' onClick={this.close.bind(this, opre)}>
							确认
						</Button>
						<Button className='btn-2 btn-cancel'  onClick={this.close.bind(this, 'cancel')} shape='border'>
							取消
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		);
	}
}
