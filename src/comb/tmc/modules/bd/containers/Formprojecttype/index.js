import React, { Component } from 'react';
import { Switch, Tooltip, Button, FormControl, Modal, Form, FormGroup } from 'tinper-bee';
import './index.less';
import Select from 'bee-select';
const Option = Select.Option;
const OptGroup = Select.OptGroup;
export default class Formprojecttype extends Component {
	constructor(props) {
		super(props);
		// 其实这里用formData来做,但是tinper-bee没有提供方案
		//动态加入字段
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			code: '',
			name: '',
			ftype: '',
			description: '',
			ts: ''
		};
	}
	handleChange(value) {
		// debugger;
		// console.log(`selected ${value}`);
	}

	//点击取消关闭模态框
	close = (type) => {
		if (this.props.onClick) {
			this.props.onClick(type);
			// 清除数据
			this.setState({
				code: '',
				name: '',
				ftype: '',
				description: ''
			});
		}
	};

	componentWillReceiveProps(nextProps) {
		this.setState({
			code: nextProps.modalData.code,
			name: nextProps.modalData.name,
			ftype: nextProps.modalData.ftype,
			description: nextProps.modalData.description,
			ts: nextProps.modalData.ts
		});
	}

	//保存数据
	handleSubmit = () => {
		const newData = this.props.modalData;
		newData.code = this.state.code;
		newData.name = this.state.name;
		newData.ftype = this.state.ftype;
		newData.description = this.state.description;
		newData.ts = this.state.ts;
		this.props.onSubmit(newData, this.props.opre);
	};
	onchangese = (item) => {
		for (var key in item) {
			if (item.hasOwnProperty(key)) {
				if (key === 'accounttype') {
					let value = 1;
					switch (item[key].value) {
						case '流动资金':
							value = 1;
							break;
						case '专项资金':
							value = 2;
							break;
						case '项目资金':
							value = 3;
							break;
						case '在建工程':
							value = 4;
							break;
					}
					bodyRowItem.values[key] = { value };
				} else {
					bodyRowItem.values[key] = { value: item[key].value };
				}
			}
		}

		console.log(velue);
		console.log(`selected ${velue}`);
		this.setState();
		// this.props.children=eee;
	};
	render() {
		const { showModal, opre } = this.props;
		return (
			<Modal show={showModal} className="modal-style" onHide={ this.close }>
				<Form horizontal>
					<Modal.Header closeButton>
						<Modal.Title>{opre == 'add' ? '新增' : opre == 'edit' ? '编辑' : '项目类型'}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormGroup>
							<span className="modal-label isRequire">项目类型编码：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入项目类型编码"
								value={this.state.code}
								onChange={(e) => this.setState({ code: e.target.value })}
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">项目类型：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请输入项目类型名称"
								value={this.state.name}
								onChange={(e) => this.setState({ name: e.target.value })}
							/>
							{/*<Select
								className="modal-content"
								defaultValue={this.state.name}
								dropdownStyle={{ zIndex: 18000 }}
								onChange={(value) => this.setState({ name: value })}
							>
								<Option value="流动资金">流动资金</Option>
								<Option value="专项资金">专项资金</Option>
								<Option value="项目资金">项目资金</Option>
								<Option value="在建工程">在建工程</Option>
							</Select>*/}
						</FormGroup>

						<FormGroup>
							<span className="modal-label">备注：</span>
							<FormControl
								className="modal-content"
								type="text"
								placeholder="请填写备注"
								value={this.state.description}
								onChange={(e) => this.setState({ description: e.target.value })}
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
