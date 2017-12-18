import React, { Component } from 'react';
import {
	Breadcrumb,
	Button,
	Table,
	FormControl,
	Pagination,
	Select
} from 'tinper-bee';
import './index.less';
import ajax from 'utils/ajax';
const URL = window.reqURL.bpm;

export default class ApproveSetting extends Component {
	constructor(props) {
		super(props);
		this.state = {
			activePage: 1,
			totalnums: 100,
			data: [],
			columns: [
				{
					title: '业务编码',
					dataIndex: 'busiTypeCode',
					key: 'busiTypeCode',
					width: 300
				},
				{
					title: '业务类型名称',
					dataIndex: 'busiTypeName',
					key: 'busiTypeName',
					width: 300
				},
				{
					title: '流程名称',
					dataIndex: 'flowName',
					key: 'flowName',
					width: 200
				},
				{
					title: '操作',
					dataIndex: 'operate',
					key: 'operate',
					width: 200,
					render(text, record, index) {
						return (
							<a
								className="ahover"
								href={record.flowSetUrl}
							>
								流程配置
							</a>
						);
					}
				}
			]
		};
		this.flowSet();
	}

	handleSelect(eventKey) {
		console.log(eventKey);
		this.setState({
			activePage: eventKey
		});
	}

	//改变每页显示数据的条数
	handlePageSizeSelect(e) {
		console.log(e);
	}

	flowSet = () => {
		let that = this
		ajax({
			url: URL + 'flow/set',
			data: {},
			success: function (res) {
				if (res.success) {
					that.setState({
						data: res.data
					})
				}
			}
		});
	}

	render() {
		return (
			<div id="approve-setting" className="bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item active>流程配置</Breadcrumb.Item>
				</Breadcrumb>
				<div className="bd-header">
					<div className="bd-title-1">流程配置</div>
				</div>
				<Table columns={this.state.columns} data={this.state.data} className="bd-table" rowKey='flowId' />
				<div className="bd-footer">
					<div className="page-size">
						<Select defaultValue={'10条/页'} onSelect={this.handlePageSizeSelect}>
							<Option value="10">10条/页</Option>
							<Option value="20">20条/页</Option>
							<Option value="50">50条/页</Option>
							<Option value="100">100条/页</Option>
						</Select>
						共 {this.state.totalnums} 条
					</div>
					<div className="pagination">
						<span className="toPage">
							跳至
							<FormControl className="toPage-input" value={this.state.activePage + 1} /> 页
							<Button
								className="insurebtn"
								onClick={this.handleSelect.bind(this, this.state.activePage + 1)}
							>
								确定
							</Button>
						</span>
						<Pagination
							prev
							next
							size="sm"
							gap={true}
							items={5}
							maxButtons={5}
							activePage={this.state.activePage}
							onSelect={this.handleSelect.bind(this)}
						/>
					</div>
				</div>
			</div>
		);
	}
}
