import React, { Component } from 'react';
import { Switch, Tooltip, Button, FormControl, Modal, Form, FormGroup, Col, Label, Select } from 'tinper-bee';
import './index.less';
import Refer from '../../../../containers/Refer';
import '../../../../containers/Refer/index.less';

let hashType = {
	'0': '银行',
	'1': '证券',
	'2': '信托公司',
	'3': '保理公司',
	'4': '融资租赁公司',
	'5': '基金公司',
	'6': '财务公司',
	'7': '担保公司',
	'8': '小额信贷公司',
	'9': 'P2P',
	'10': '第三方支付',
	'11': '保险公司'
};
const Option = Select.Option;

export default class FinanceForm extends Component {
	constructor(props) {
		super(props);
		// 其实这里用formData来做,但是tinper-bee没有提供方案
		//动态加入字段

		this.state = {
			code: '',
			name: '',
			type: '',
			ts: ''
		};
	}

	//点击取消关闭模态框
	close = (op) => {
		if (this.props.onClick) {
			this.props.onClick(op);
			// 清除数据
			this.setState({
				code: '',
				name: '',
				type: '',
				ts: ''
			});
		}
	};

	componentWillReceiveProps(nextProps) {
		this.setState({
			code: nextProps.modalData.code,
			name: nextProps.modalData.name,
			type: nextProps.modalData.type,
			ts: nextProps.modalData.ts
		});
	}

	//保存数据
	handleSubmit = () => {
		const newData = this.props.modalData;
		newData.code = this.state.code;
		newData.name = this.state.name;
		newData.type = this.state.type;
		newData.ts = this.state.ts;
		this.props.onSubmit(newData, this.props.opre);
	};

	render() {
		const { showModal, opre } = this.props;
		return (
			<Modal id="financeformmodal" show={showModal} className="modal-style" onHide={ this.close }>
				<Form horizontal>
					<Modal.Header closeButton>
						<Modal.Title>{opre == 'add' ? '新增' : opre == 'edit' ? '编辑' : '金融机构'}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormGroup>
							<span className="modal-label isRequire">金融机构编码：</span>

							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入金融机构编码"
								value={this.state.code}
								onChange={(e) => this.setState({ code: e.target.value })}
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">金融机构名称：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入金融机构名称"
								value={this.state.name}
								onChange={(e) => this.setState({ name: e.target.value })}
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">类型：</span>
							<Select
								value={this.state.type ? String(this.state.type) : ''}
								className="modal-content modal-input-small"
								getPopupContainer = {()=> document.querySelector('#financeformmodal')}
								dropdownStyle={{ zIndex: 18000 }}
								onChange={(e) => {
									this.setState({ type: e });
								}}
							>
								<Option value="0">银行</Option>
								<Option value="1">证券</Option>
								<Option value="2">信托公司</Option>
								<Option value="3">保理公司</Option>
								<Option value="4">融资租赁公司</Option>
								<Option value="5">基金公司</Option>
								<Option value="6">财务公司</Option>
								<Option value="7">担保公司</Option>
								<Option value="8">小额信贷公司</Option>
								<Option value="9">P2P</Option>
								<Option value="10">第三方支付</Option>
								<Option value="11">保险公司</Option>
							</Select>
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
