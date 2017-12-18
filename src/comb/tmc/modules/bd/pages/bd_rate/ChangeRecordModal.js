/**
 * 利率变更记录模态框
 * majfd
 * 2017/11/4
 */
import React, { Component } from 'react';
import {
	Con,
	Row,
	Col,
	Dropdown,
	Button,
	Table,
	Icon,
	FormControl,
	Popconfirm,
	Pagination,
	Modal,
	Select,
	Form,
	FormGroup
} from 'tinper-bee';

export default class ChangeRecordModal extends Component {
	constructor(props) {
		super(props);
		// 其实这里用formData来做,但是tinper-bee没有提供方案
		this.state = {
			// 利率变更字段：利率起效日期、利率%、利率变更日期
			columns: [
				// { title: '序号', key: 'index', dataIndex: 'index', width: 50 },
				// { title: '利率编码', key: 'zh', dataIndex: 'zh', width: 150 },
				// { title: '利率名称', key: 'hm', dataIndex: 'hm', width: 150 },
				// { title: '利率天数', key: 'khh', dataIndex: 'khh', width: 150 },
				// { title: '利率类型', key: 'khgs', dataIndex: 'khgs', width: 150 },
				{ title: '版本号', key: 'version', dataIndex: 'version', width: 90 },
				{ title: '起效日期', key: 'ratestartdate', dataIndex: 'ratestartdate', width: 120 },
				// { title: '币种', key: 'jnw', dataIndex: 'jnw', width: 100 },
				{ title: '利率%', key: 'rate', dataIndex: 'rate', width: 70 },
				{ title: '逾期利率%', key: 'overdue', dataIndex: 'overdue', width: 100 },
				{ title: '提前利率%', key: 'advance', dataIndex: 'advance', width: 100 },
				{ title: '变更日期', key: 'revisedate', dataIndex: 'revisedate', width: 120 },
				// { title: '变更人', key: 'reviser', dataIndex: 'reviser.display', width: 100 },
				// { title: '创建人', key: 'bz', dataIndex: 'bz', width: 100 },
				// { title: '创建日期', key: 'jnw', dataIndex: 'jnw', width: 100 }
			],
			dataSource: this.props.rateDataSource
		};
	}

	close = (type) => {
		if (type !== 'cancel') {
			console.log('点击关闭变更记录');
		}

		if (this.props.onClick) {
			this.props.onClick(type);
			// 取消时不清楚清除数据
			this.setState({
				dataSource: null
			});
		}
	};
	// 父类加载模态框时，判断showModal 不需要每次子类更新都传给父类，在保存提交时传给父类
	// componentWillReceiveProps(nextProps) {
	// 	this.setState({
	// 		dataSource: nextProps.rateDataSource
	// 	});
	// }

	render() {
		const { showModal, opre } = this.props;
		let { dataSource, columns } = this.state;
		console.log(100,this.state);
		// checked = modalData && modalData.orderStatus == 1 ? true : checked
		return (
			<Modal show={showModal} className="modal-style" onHide={ this.close.bind(this, 'cancel') }>
				<Form horizontal>
					<Modal.Header closeButton>
						<FormGroup>
							<Modal.Title>{'变更记录'}</Modal.Title>
							{/* <Icon
								type="uf-close-bold"
								className="close-btn"
								onClick={this.close.bind(this, 'cancel')}
							/> */}
						</FormGroup>
					</Modal.Header>
					<Modal.Body>
						{/* <ul className="credit-modal" /> */}
						<Table bordered data={dataSource} columns={columns} rowKey={'id'}/>
					</Modal.Body>
					<Modal.Footer>
						<Button className="btn-2" onClick={this.close.bind(this, 'cancel')} colors="primary">
							确认
						</Button>
					</Modal.Footer>					
				</Form>
			</Modal>
		);
	}
}
