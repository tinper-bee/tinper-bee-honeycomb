import React, { Component } from 'react';
import { Button, Breadcrumb } from 'tinper-bee';
import './index.less';
import ajax from 'utils/ajax';
import { toast } from 'utils/utils.js';
const URL = window.reqURL.bpm;

export default class ApproveDetail extends Component {
	static defaultProps = {
		processInstanceId: '',
		type: 'edit'
	};
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			content: '',
			status: ''
		};
		this.querybillinfo();
	}

	querybillinfo = () => {
		let that = this;
		ajax({
			url: URL + 'bpm/querybillinfo',
			// data: { processInstanceId: '915da5ef-d438-11e7-a7a2-0242ac581f07' },
			data: { processInstanceId: this.props.processInstanceId },
			success: function(res) {
				let data = res.data,
					status = '';
				if (data.length && data[data.length - 1].activityType === 'endEvent') {
					status = 'endEvent';
				}
				that.setState({
					data,
					status
				});
			}
		});
	};

	approvebill = (action) => {
		let that = this;
		ajax({
			url: URL + 'bpm/' + action,
			data: {
				data: [
					{
						businesskey: that.props.businesskey,
						billid: that.props.billid,
						content: that.state.content
					}
				]
			},
			success: function(res) {
				if (res.success) {
					switch (action) {
						case 'approvebills':
							toast({ content: '审批成功' });
							that.querybillinfo();
							that.props.refresh && that.props.refresh();
							break;
						case 'rejectbills':
							toast({ content: '驳回成功' });
							window.history.back();
							break;
						default:
							break;
					}
				}
			}
		});
	};

	render() {
		let { data, status } = this.state;
		let { type } = this.props;
		return (
			<div id="approve-detail">
				<div className="approve-detail">
					{type !== 'detail' && (
						<div className="approve-header">
							<textarea
								className="u-form-control"
								placeholder="请输入审批意见"
								value={this.state.content}
								onChange={(e) => {
									this.setState({ content: e.target.value });
								}}
							/>
							<Button
								className="btn-2"
								style={{ marginLeft: '15px' }}
								onClick={this.approvebill.bind(this, 'approvebills')}
							>
								审批通过
							</Button>
							<Button
								className="btn-2 btn-cancel"
								style={{ marginLeft: '10px' }}
								onClick={this.approvebill.bind(this, 'rejectbills')}
							>
								驳回
							</Button>
						</div>
					)}
					<div className="approve-process clearfix">
						{data.map((e, i) => {
							return (
								<div
									className={`process active ${status ? '' : 'doing'} ${e.activityType === 'endEvent'
										? 'end-event'
										: ''}`}
								>
									<p className="approve-time">{e.startTime.split('.')[0].replace('T', ' ')}</p>
									<p>
										<span className="approve-action">
											{e.activityName || (e.activityType === 'endEvent' ? '审批完成' : '提交')}
										</span>
										<span className="approve-person">{e.assignee}</span>
									</p>
									<i className="approve-point" />
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}
