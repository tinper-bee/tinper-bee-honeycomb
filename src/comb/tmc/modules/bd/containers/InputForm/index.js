import React, { Component } from 'react';
import moment from 'moment';
import { Switch, Tooltip, Button, FormControl, Modal, Form, FormGroup } from 'tinper-bee';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import axios from 'axios';
import Select from 'bee-select';
import Refer from '../../../../containers/Refer';

export default class InputForm extends Component {
	constructor(props) {
		super(props);
		// 其实这里用formData来做,但是tinper-bee没有提供方案
		//动态加入字段

		this.state = {
			data: {}
		};
	}

	close = (type) => {
		if (this.props.onClick) {
			this.props.onClick(type);
		}
	};

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: nextProps.modalData
		});
	}

	handleSubmit = () => {
		const newData = this.state.data;
		this.props.onSubmit(newData, this.props.opre);
	};

	handleChange = (row, e) => {
		const key = row.key;
		const type = row.type;
		let data = this.state.data;
		if (type == 'string') {
			data[key] = e.target.value;
		} else if (type == 'ref' || type == 'drop-down') {
			data[key] = e;
		}
		this.setState({ data: data });
	};

	loadRows = (columns) => {
		return (
			<div>
				{columns.map((row) => {
					const key = row.key;
					const data = this.state.data;
					let classLayout = '';
					if(row.nullable =='Y'){
						classLayout = 'modal-label isRequire';
					}else{
						classLayout = 'modal-label';
					}
					if (row.type == 'string') {
						return (
							<FormGroup>
								<span className={classLayout}>{row.title}：</span>
								<FormControl
									className="modal-content"
									type="text"
									placeholder={'请输入' + row.title}
									value={data[key]}
									onChange={this.handleChange.bind(this, row)}
								/>
							</FormGroup>
						);
					} else if (row.type == 'drop-down') {
						return (
							<FormGroup>
								<span className={classLayout}>{row.title}：</span>
								<Select
									className="modal-content"
									defaultValue={data[key]}
									dropdownStyle={{ zIndex: 18000 }}
									onChange={this.handleChange.bind(this, row)}
								>
									{row.items.map((option) => {
										return <Option value={option.value}>{option.name}</Option>;
									})}
								</Select>
							</FormGroup>
						);
					} else if (row.type == 'ref') {
						const ref = row.ref;
						return (
							<FormGroup>
								<span className={classLayout}>{ref.refName}：</span>
								<Refer
									refModelUrl={ref.refModelUrl}
									refCode={ref.refCode}
									ctx={ref.ctx}
									value={data[key]}
									onChange={this.handleChange.bind(this, row)}
									strFieldName={ref.strFieldName}
									isMultiSelectedEnabled={ref.isMultiSelectedEnabled}
									rootName={ref.rootName}
									pk_val={ref.pk_val}
									condition={ref.condition}
									isReturnCode={ref.isReturnCode}
									multiLevelMenuName={ref.multiLevelMenuName}
									hotDataSize={ref.hotDataSize}
								/>
							</FormGroup>
						);
					}
				})}
			</div>
		);
	};

	render() {
		const { showModal, opre, modalData } = this.props;
		let { checked, value } = this.state;
		return (
			<Modal show={showModal} className="modal-style" onHide={ this.close }>
				<Form horizontal>
					<Modal.Header closeButton>
						<Modal.Title>{opre == 'add' ? '新增' : opre == 'edit' ? '编辑' : '授信类别'}</Modal.Title>
					</Modal.Header>
					<Modal.Body>{this.loadRows(this.props.columns)}</Modal.Body>
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
