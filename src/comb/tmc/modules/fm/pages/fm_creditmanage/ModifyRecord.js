import React, { Component } from 'react';
import { Modal, Table, Button, Form } from 'tinper-bee';
import NoData from '../../../../containers/NoData';
import * as enumData from './enumData';
import {numFormat} from '../../../../utils/utils';
export default class ModifyRecord extends Component {
	static defaultProps = {
		show: false,
		title: '变更记录',
		columns: [
			{
				title: '版本号',
				key: 'version',
				dataIndex: 'version.display',
				width: 200
			},
			{
				title: '控制方式',
				key: 'controltype',
				dataIndex: 'controltype.display',
				width: 200
			},
			{
				title: '原币额度',
				key: 'money',
				dataIndex: 'money.display',
				width: 200
			},
			{
				title: '担保方式',
				key: 'guaranteetype',
				dataIndex: 'guaranteetype.display',
				width: 200
			},
			{
				title: '审批状态',
				key: 'vbillstatus',
				dataIndex: 'vbillstatus.display',
				width: 200
			}
		],
		modalData: []
	};

	// display显示处理
	displayProcess = (modalData) => {
        modalData.forEach(item => {
            item.version.display = 'v' + item.version.value + '.0';
            item.money.display=numFormat(item.money.value,"");
            item.controltype.display = this.props.enumMapping(item.controltype.value, enumData.controlTypeAry);
            item.guaranteetype.display = this.props.enumMapping(item.guaranteetype.value, enumData.guaranteeTypeAry);
            item.vbillstatus.display = this.props.enumMapping(item.vbillstatus.value, enumData.vbillStatusAry);
        });
        return modalData
	};

	render() {
		return (
			<Modal show={this.props.showModal} size="lg" className="modal-style" onHide={this.props.close}>
				<Form horizontal>
					<Modal.Header closeButton>
						<Modal.Title>{this.props.title}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Table
							className="bd-table modify-record-table"
							columns={this.props.columns}
							data={this.displayProcess(this.props.modalData)}
							emptyText={NoData}
						/>
					</Modal.Body>
					<Modal.Footer>
						<Button className="btn-2" onClick={this.props.close}>
							确认
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		);
	}
}
