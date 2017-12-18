import React, { Component } from 'react';
import { Switch, Tooltip, Button, FormControl, Modal, Form, FormGroup, Row, Col } from 'tinper-bee';
import './index.less';
import '../../../../utils/publicStyle.less';
import Select from 'bee-select';
import DatePicker from 'bee-datepicker';
import moment from 'moment';
const Option = Select.Option;
const OptGroup = Select.OptGroup;
const format = 'YYYY-MM-DD HH:mm:ss';
const dateInputPlaceholder = '选择日期';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import enUS from 'rc-calendar/lib/locale/en_US';
import { inputNumberProcess } from '../../pages/bd_rate/BdCheckUtil';
//  项目类型编码： code
//  还款方式名称：repayment
//  还本方式：repaycosttype
//  付息方式：repayinteresttype
//	还本期间：repaycostperiod             
//  付息期间：repayinterestperiod
//	还本开始日期: repaycostbegindate
//  付息开始日期：repayinterestbegindate
//  创建人: creator
//  创建日期:creationtime
//  备注：remarks
export default class Formrepaymentmethod extends Component {
	constructor(props) {
		super(props);
		// 其实这里用formData来做,但是tinper-bee没有提供方案
		// 动态加入字段
		this.state = {
			code: '',
			name: '',
			repaycosttype: '',
			repayinteresttype: '',
			repaycostperiod: '',
			repayinterestperiod: '',
			repaycostbegindate: '',
			repayinterestbegindate: '',
			creator: '',
			creationtime: '',
			originalid: '',
			ts: '',
			repayCostShow: false,
			repayInterShow: false
		};
	}
	//点击取消关闭模态框
	close = (type) => {
		if (this.props.onClick) {
			this.props.onClick(type);
			// 清除数据
			this.setState({
				code: '',
				name: '',
				repaycosttype: '',
				repayinteresttype: '',
				repaycostperiod: '',
				repayinterestperiod: '',
				repaycostbegindate: '',
				repayinterestbegindate: '',
				creator: '',
				creationtime: '',
				originalid: '',
				ts: '',
				repayCostShow: false,
				repayInterShow: false
			});
		}
	};

	componentWillReceiveProps(nextProps) {
		// 还本期间、付息期间显示控制
		if(nextProps.modalData.repaycosttype =='6'){
			this.setState({
				repayCostShow : true
			});
		}else{
			this.setState({
				repayCostShow : false
			});
		}
		if(nextProps.modalData.repayinteresttype =='6' || nextProps.modalData.repayinteresttype =='7'){
			this.setState({
				repayInterShow : true
			});
		}else{
			this.setState({
				repayInterShow : false
			});
		}
		this.setState({
			code: nextProps.modalData.code,
			name: nextProps.modalData.name,
			repaycosttype: nextProps.modalData.repaycosttype,
			repayinteresttype: nextProps.modalData.repayinteresttype,
			repaycostperiod: nextProps.modalData.repaycostperiod,
			repayinterestperiod: nextProps.modalData.repayinterestperiod,
			repaycostbegindate: nextProps.modalData.repaycostbegindate,
			repayinterestbegindate: nextProps.modalData.repayinterestbegindate,
			creator: nextProps.modalData.creator,
			creationtime: nextProps.modalData.creationtime,
			originalid: nextProps.modalData.originalid,
			ts: nextProps.modalData.ts,
		});
	}

	//保存数据
	handleSubmit = () => {
		const newData = this.props.modalData;
		newData.code = this.state.code;
		newData.name = this.state.name;
		newData.repaycosttype = this.state.repaycosttype;
		newData.repayinteresttype = this.state.repayinteresttype;
		newData.repaycostperiod = this.state.repaycostperiod;
		newData.repayinterestperiod = this.state.repayinterestperiod;
		newData.repaycostbegindate = this.state.repaycostbegindate;
		newData.repayinterestbegindate = this.state.repayinterestbegindate;
		newData.creator = this.state.creator;
		newData.creationtime = this.state.creationtime;
		newData.originalid = this.state.originalid;
		newData.ts = this.state.ts;
		console.log(newData.repaycostbegindate);
		this.props.onSubmit(newData, this.props.opre);
	};
	onchangese = (velue) => {
		console.log(velue);
		console.log(`selected ${velue}`);
		this.setState();
		// this.props.children=eee;
	};
	// 还本方式改变
	handleRepayCostperiodChange = (e) => {
		let repayCost = e.target.value;
		repayCost = inputNumberProcess(repayCost, null, 1);
		this.setState({
			repaycostperiod: repayCost
		});
	};
	// 付息方式改变
	handleRepayInterestiodChange = (e) => {
		let repayInter = e.target.value;
		repayInter = inputNumberProcess(repayInter, null, 1);
		this.setState({
			repayinterestperiod: repayInter
		});
	};

	render() {
		const { showModal, opre } = this.props;
		const { repaycosttype, repayinteresttype } = this.state;
		return (
			<Modal id="formrepaymentmethod" show={showModal} className="modal-style" onHide={this.close}>
				<Form horizontal>
					<Modal.Header closeButton>
						<Modal.Title>
							{opre == 'add' ? (
								'新增'
							) : opre == 'edit' ? (
								'编辑'
							) : opre == 'change' ? (
								'变更'
							) : (
								'还款方式'
							)}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{opre !== 'change' && (
							<FormGroup>
								<span className="modal-label isRequire">编码：</span>
								<FormControl
									className="modal-content"
									type="text"
									placeholder="请输入还款方式编码"
									value={this.state.code}
									onChange={(e) => this.setState({ code: e.target.value })}
								/>
							</FormGroup>
						)}
						{opre !== 'change' && (
							<FormGroup>
								<span className="modal-label isRequire">名称：</span>
								<FormControl
									className="modal-content"
									type="text"
									placeholder="请输入还款方式名称"
									value={this.state.name}
									onChange={(e) => this.setState({ name: e.target.value })}
								/>
							</FormGroup>
						)}
						<FormGroup>
							<span className="modal-label isRequire">还本方式：</span>
							<Select
								className="modal-content modal-small"
								defaultValue={String(this.state.repaycosttype ? this.state.repaycosttype : '')}
								style={{ width: 200, marginRight: 6 }}
								getPopupContainer = {()=> document.querySelector('#formrepaymentmethod')}
								dropdownStyle={{ zIndex: 18000 }}
								dropdownClassName="modal-small-option"
								onChange={(value) =>
									this.setState({
										repaycosttype: value,
										repayCostShow: value && value == '6' ? true : false,
										repaycostperiod: value && value == '6' ? '' : this.state.repaycostperiod
									})}
							>
								<Option value="1">日</Option>
								<Option value="2">月</Option>
								<Option value="3">季度</Option>
								<Option value="4">半年</Option>
								<Option value="5">年</Option>
								<Option value="6">到期一次还本</Option>
							</Select>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">付息方式：</span>
							<Select
								className="modal-content modal-small"
								defaultValue={String(this.state.repayinteresttype ? this.state.repayinteresttype : '')}
								style={{ width: 200, marginRight: 6 }}
								getPopupContainer = {()=> document.querySelector('#formrepaymentmethod')}
								dropdownStyle={{ zIndex: 18000 }}
								dropdownClassName="modal-small-option"
								onChange={(value) =>
									this.setState({
										repayinteresttype: value,
										repayInterShow: value && (value == '6' || value == '7') ? true : false,
										repayinterestperiod: value && (value == '6' || value == '7') ? '' : this.state.repayinterestperiod
									})}
							>
								<Option value="1">日</Option>
								<Option value="2">月</Option>
								<Option value="3">季度</Option>
								<Option value="4">半年</Option>
								<Option value="5">年</Option>
								<Option value="6">到期一次付息</Option>
								{/* <Option value="7">利随本清</Option> */}
							</Select>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">还本期间：</span>
							<FormControl
								className="modal-content modal-small"
								type="text"
								placeholder="请输入还本期间"
								value={this.state.repaycostperiod}
								disabled={this.state.repayCostShow}
								onChange={this.handleRepayCostperiodChange}
								/* onChange={(e) => this.setState({ repaycostperiod: e.target.value })} */
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">付息期间：</span>
							<FormControl
								className="modal-content modal-small"
								type="text"
								placeholder="请输入付息期间"
								value={this.state.repayinterestperiod}
								disabled={this.state.repayInterShow}
								onChange={this.handleRepayInterestiodChange}
								/* onChange={(e) => this.setState({ repayinterestperiod: e.target.value })} */
							/>
						</FormGroup>

						{/* <li>
                                
                            <span className='finance-modal-title fl'>还本开始日期:</span>
                                <DatePicker
                                    format={format}
                                    onSelect={this.onSelect}
                                    onChange={(d) => {
                                         this.setState({ repaycostbegindate: d.format("YYYY-MM-DD HH:mm:ss")})
                                    }}
                                    locale={zhCN}
                                    value={moment(this.state.repaycostbegindate)}
                                    placeholder={dateInputPlaceholder}
                                />
                               
                            </li>
                            <li>
                            <span className='finance-modal-title fl'>付息开始日期:</span>
                                <DatePicker
                                    format={format}
                                    onSelect={this.onSelect}
                                    onChange={(d) => {
                                         this.setState({ repayinterestbegindate : d.format("YYYY-MM-DD HH:mm:ss")})
                                    }}
                                    locale={zhCN}
                                    defaultValue={moment()}
                                    placeholder={dateInputPlaceholder}
                                />
                            </li>
                           
							<li>
								<FormGroup>
									<span>创建人：</span>
									<FormControl
										
										type="text"
										placeholder="请填写创建人"
										value={this.state.creator}
										onChange={(e) => this.setState({ creator: e.target.value })}
									/>
								</FormGroup>
							</li>
							<li>
								<span>创建时间：</span>
								<DatePicker
									format={format}
									onSelect={this.onSelect}
									onChange={(d) => {
										this.setState({ creationtime: d.format('YYYY-MM-DD HH:mm:ss') });
									}}
									locale={zhCN}
									defaultValue={moment()}
									placeholder={dateInputPlaceholder}
								/>
							</li> */}
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
