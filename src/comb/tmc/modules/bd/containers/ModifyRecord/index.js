import React, { Component } from 'react';
import { Modal, Table, Button } from 'tinper-bee';

// 变更记录模态框
export default class ModifyRecord extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showChange: false,
			columns: [
				{ title: '版本', dataIndex: 'version', key: 'version', width: 20 },
				{ title: '编码', dataIndex: 'code', key: 'code', width: 20 },
				{ title: '还本方式', dataIndex: 'repaycosttype', key: 'repaycosttype', width: 60 },
				{ title: '付息方式', dataIndex: 'repayinteresttype', key: 'repayinteresttype', width: 60 },
				{ title: '还本期间', dataIndex: 'repaycostperiod', key: 'repaycostperiod', width: 60 },
				{ title: '付息期间', dataIndex: 'repayinterestperiod', key: 'repayinterestperiod', width: 60 },
				// { title: '创建人', dataIndex: 'creator', key: 'creator', width: 20 },
				// { title: '创建时间', dataIndex: 'creationtime', key: 'creationtime', width: 20 },
				{ title: '变更时间', dataIndex: 'revisedate', key: 'revisedate', width: 60 },
				{ title: '变更人', dataIndex: 'reviser', key: 'reviser', width: 20 }
			]
		};
		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
		this.changeSize = this.changeSize.bind(this);
	}
	close() {
		this.setState({
			showChange: false
		});
	}
	open() {
		this.setState({
			showChange: true
		});
	}
	changeSize(size) {
		this.setState({
			modalSize: size
		});
	}

	render() {
		// console.log(this.props.dataSource);
		let { columns } = this.state;
		// console.log(this.state.modalSize);
		return (
			//revisedata  变更时期
			//reviser    变更人
			<div>
				<Modal size={'lg'} show={this.props.showChange} onHide={this.props.closeChange} className="modal-style">
					<Modal.Header closeButton>
						<Modal.Title>变更记录</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Table bordered data={this.props.dataSource} columns={columns} />
					</Modal.Body>
					<Modal.Footer>
						<Button className="btn-2" onClick={this.props.closeChange} shape="border">
							确认
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		);
	}
}
