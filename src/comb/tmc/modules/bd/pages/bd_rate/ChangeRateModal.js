/**
 * 基准利率档案变更模态框
 * majfd
 * 2017/11/4
 */
import React, { Component } from 'react';
import moment from 'moment';
import { Switch, Select, Tooltip, Button, FormControl, Modal, Form, FormGroup } from 'tinper-bee';
import InputNumber from 'bee-input-number';
import DatePicker from 'bee-datepicker';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import { inputNumberProcess, rateInputCtr } from './BdCheckUtil';
import { numFormat, toast, sum } from '../../../../utils/utils.js';
import './index.less'
const Option = Select.Option;
const Children = [];
let _rate = ''; /*保存上次的值*/

/**
 * 变更模态框
 */
export default class ChangeRateModal extends Component {
	constructor(props) {
		super(props);
		// 其实这里用formData来做,但是tinper-bee没有提供方案
		this.state = {
			showRateFlag: false,
			// code: '', //利率编码
			// name: '', //利率名称
			// ratedays: '', //利率天数
			// enable: '', //启用状态
			// creator: '', //创建人
			// creationtime: null, //创建时间
			// ratetype: '', //利率类型
			// ratestartdate: null, //利率起效日期
			// // currtypeid: '', //币种
			// rate: '', //利率
			// ratechangedate: null, //利率变更日期
			// version: '' //版本号
			// checked: false,
			// options: [ '人民币', '美元', '英镑', '港币', '日元', '瑞士法郎' ],
			// info: ''
			...this.props.modalData
		};
	}
	// 获取利率
	checkRate = (e) => {
		var rate = e.target.value;
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
		var rate = e.target.value;
		rate = this.checkRate(e);
		this.setState({ rate: rate });
	};
	changeAdvance = (e) => {
		var rate = e.target.value;
		rate = this.checkRate(e);
		this.setState({ advance: rate });
	};
	changeOverdue = (e) => {
		var rate = e.target.value;
		rate = this.checkRate(e);
		this.setState({ overdue: rate });
	};

	ratestartdateDisabled = (curr)=>{
		return curr && curr.valueOf()<moment(this.state.ratestartdate);
	}
	// 利率起效日期
	onratestartdateSelect = (e) => {
		var time = e.format('YYYY-MM-DD');
		var oldtime = moment(this.props.modalData.ratestartdate).format('YYYY-MM-DD');
		if (oldtime && time) {
			if (moment(time).isBefore(moment(oldtime))) {
				toast({ content: '利率起效日期必须大于上一次起效日期', color: 'warning' });
				this.setState({
					ratestartdate: oldtime
				});
			}else{
				this.setState({
					ratestartdate: time
				});
			}
		}
	};

	close = (type) => {
		if (this.props.onClick) {
			this.props.onClick(type);
			// 取消时不清楚清除数据
			this.setState({
				rate: '',
				advance: '',
				overdue: '',
				checked: false,
				ratestartdate: null
			});
		}
	};
	// 父类使用showChange判断
	// componentWillReceiveProps(nextProps) {
	// 	this.setState({
	// 		ratestartdate: nextProps.modalData.ratestartdate,
	// 		rate: nextProps.modalData.rate,
	// 		ratechangedate: nextProps.modalData.ratechangedate,
	// 		version: nextProps.modalData.version
	// 	});
	// }

	handleSubmit = () => {
		const newData = this.props.modalData;
		newData.ratestartdate = this.state.ratestartdate;
		newData.rate = this.state.rate;
		newData.advance = this.state.advance;
		newData.overdue = this.state.overdue;
		newData.ts = this.state.ts;
		this.props.onSubmit(newData, this.props.opre);
	};

	render() {
		const { showModal, opre } = this.props;
		let { showRateFlag, precision } = this.state;
		if (!precision) {
			precision = 2;
		}
		showRateFlag = this.state.ratetype && parseInt(this.state.ratetype.value) == 1 ? true : showRateFlag;
		return (
			<Modal show={showModal} className="modal-style" onHide={ this.close.bind(this, 'cancel')}>
				<Form horizontal>
					<Modal.Header closeButton >
						<Modal.Title>{'利率变更'}</Modal.Title>
					</Modal.Header>
					<Modal.Body style={{marginLeft:110}}>
					    {/*需求变更，起效日期不可变更修改*/}
						<FormGroup className="rate-date">
							<span className="modal-label">利率起效日期：</span>
							<DatePicker
								className="modal-content modal-small date-picker"
								format="YYYY-MM-DD"
								disabled
								disabledDate={this.ratestartdateDisabled}
								locale={zhCN}
								onChange={this.onratestartdateSelect}
								/* {showToday} */
								defaultValue={this.state.ratestartdate ? moment(this.state.ratestartdate) : moment()}
								placeholder={'选择日期时间'}
							/>
						</FormGroup>

						<FormGroup>
							<span className="modal-label isRequire">利率%：</span>
							<FormControl
								className="modal-content modal-input-small"
								type="text"
								placeholder="请输入变更利率%"
								value={this.state.rate ? this.state.rate : ''}
								onChange={this.changeYRate}
							/>
						</FormGroup>

						{showRateFlag && (
							<FormGroup>
								<span className="modal-label">逾期利率%：</span>
								<FormControl
									className="modal-content modal-input-small"
									type="text"
									placeholder="请输入逾期变更利率%"
									value={this.state.overdue}
									onChange={this.changeOverdue}
								/>
							</FormGroup>
						)}
						{showRateFlag && (
							<FormGroup>
								<span className="modal-label">提前利率%：</span>
								<FormControl
									className="modal-content modal-input-small"
									type="text"
									placeholder="请输入提前变更利率%"
									value={this.state.advance}
									onChange={this.changeAdvance}
								/>
							</FormGroup>
						)}
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
