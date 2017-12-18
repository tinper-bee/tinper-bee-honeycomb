import React, { Component } from 'react';
import { Link } from 'react-router';
import { Breadcrumb, Tree, Button, Icon, Table, Pagination, Row, Col, Select } from 'tinper-bee';
import EditableCel from '../../containers/EditableCel/index';
import EditForm from '../../containers/EditForm/index';

// import "./index.less";

const { TreeNode } = Tree;
const { Option } = Select;
// Row, Col

const data4 = [
	{
		key: 1,
		name: '现金流量',
		age: 60,
		type: '现金流入',
		address: 'New York No. 1 Lake Park',
		children: [
			{
				key: 11,
				type: '现金流出',
				name: '现金流量内容',
				age: 42,
				address: 'New York No. 2 Lake Park'
			},
			{
				key: 12,
				name: '流量现金内容',
				age: 30,
				type: '现金流入',
				address: 'New York No. 3 Lake Park',
				children: [
					{
						key: 121,
						name: 'Jimmy Brown',
						type: '现金流入',
						age: 16,
						address: 'New York No. 3 Lake Park'
					}
				]
			},
			{
				key: 13,
				name: 'Jim Green sr.',
				age: 72,
				type: '现金流出',
				address: 'London No. 1 Lake Park',
				children: [
					{
						key: 131,
						name: 'Jim Green',
						age: 42,
						type: '现金流入',
						address: 'London No. 2 Lake Park',
						children: [
							{
								key: 1311,
								name: 'Jim Green jr.',
								age: 25,
								type: '现金流入',
								address: 'London No. 3 Lake Park'
							},
							{
								key: 1312,
								name: 'Jimmy Green sr.',
								age: 18,
								type: '现金流入',
								address: 'London No. 4 Lake Park'
							}
						]
					}
				]
			}
		]
	},
	{
		key: 2,
		name: 'Joe Black',
		age: 32,
		type: '现金流出',
		address: 'Sidney No. 1 Lake Park',
		children: [
			{
				key: 33,
				name: '张飞',
				type: '现金流入',
				age: 42,
				address: 'New York No. 2 Lake Park'
			}
		]
	},
	{
		key: 34,
		name: 'Joe Black',
		age: 32,
		type: '现金流出',
		address: 'Sidney No. 1 Lake Park',
		children: [
			{
				key: 35,
				name: '张飞',
				type: '现金流入',
				age: 42,
				address: 'New York No. 2 Lake Park'
			}
		]
	},
	{
		key: 36,
		name: 'Joe Black',
		age: 32,
		type: '现金流出',
		address: 'Sidney No. 1 Lake Park',
		children: [
			{
				key: 37,
				name: '张飞',
				type: '现金流入',
				age: 42,
				address: 'New York No. 2 Lake Park'
			}
		]
	},
	{
		key: 38,
		name: 'Joe Black',
		age: 32,
		type: '现金流出',
		address: 'Sidney No. 1 Lake Park',
		children: [
			{
				key: 39,
				name: '张飞',
				type: '现金流入',
				age: 42,
				address: 'New York No. 2 Lake Park'
			}
		]
	},
	{
		key: 40,
		name: 'Joe Black',
		age: 32,
		type: '现金流出',
		address: 'Sidney No. 1 Lake Park',
		children: [
			{
				key: 41,
				name: '张飞',
				type: '现金流入',
				age: 42,
				address: 'New York No. 2 Lake Park'
			}
		]
	},
	{
		key: 42,
		name: 'Joe Black',
		age: 32,
		type: '现金流出',
		address: 'Sidney No. 1 Lake Park',
		children: [
			{
				key: 43,
				name: '张飞',
				type: '现金流入',
				age: 42,
				address: 'New York No. 2 Lake Park'
			}
		]
	},
	{
		key: 44,
		name: 'Joe Black',
		age: 32,
		type: '现金流出',
		address: 'Sidney No. 1 Lake Park',
		children: [
			{
				key: 45,
				name: '张飞',
				type: '现金流入',
				age: 42,
				address: 'New York No. 2 Lake Park'
			}
		]
	},
	{
		key: 46,
		name: 'Joe Black',
		age: 32,
		type: '现金流出',
		address: 'Sidney No. 1 Lake Park',
		children: [
			{
				key: 47,
				name: '张飞',
				type: '现金流入',
				age: 42,
				address: 'New York No. 2 Lake Park'
			}
		]
	},
	{
		key: 48,
		name: 'Joe Black',
		age: 32,
		type: '现金流出',
		address: 'Sidney No. 1 Lake Park',
		children: [
			{
				key: 49,
				name: '张飞',
				type: '现金流入',
				age: 42,
				address: 'New York No. 2 Lake Park'
			}
		]
	}
];

export default class TreeTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			curItemObj: {},
			dataList: data4,
			activePage: 1,
			isHover: '',
			editKey: '',
			indexNum: 49
		};
	}

	close = (e) => {
		this.setState((pre) => {
			return {
				...pre,
				showModal: false
			};
		});
	};

	openModal = (type, itemObj) => {
		this.setState((pre) => {
			return {
				...pre,
				showModal: true,
				curItemObj: itemObj,
				editType: type
			};
		});
	};

	delData = (itemObj) => {
		console.log('itemObjjjjj', itemObj);
		this.commonApi('DEL', itemObj);
		// this.setState();
	};

	commonApi = (type) => {
		this.close(type);
		console.log('commonApi!', type);
		if (type === 'ADD') {
			this.state.indexNum++;
		}

		if (type === 'DEL') {
			//TODO
			console.log('TODO DEL');
		}
		this.setState();
	};

	componentDidMount = () => {
		console.log('componentDidMount', arguments);
	};

	handleSelect(eventKey) {
		this.setState((pre) => {
			return {
				...pre,
				data: data4,
				activePage: eventKey
			};
		});
	}

	render() {
		let self = this;
		// console.log(this.state.curItemObj, 'curItemObj', this.state.dataList.length);
		const columns4 = [
			{
				title: '编码名称',
				dataIndex: 'name',
				key: 'name',
				width: '40%',
				render(name, dataObj) {
					return <EditableCel item={dataObj} openModal={self.openModal} delData={self.delData} />;
				}
			},
			{
				title: '项目类型',
				dataIndex: 'type',
				key: 'type',
				width: '30%',
				render(name, dataObj) {
					return name;
				}
			},
			{
				title: '时间',
				dataIndex: 'address',
				key: 'address'
			},
			{
				title: '操作',
				dataIndex: 'operation',
				key: 'operation',
				render(name, dataObj) {
					let iconAdd = <Icon  className="iconfont icon-zengjia icon-style" />;
					let iconEdit = <Icon className="iconfont icon-bianji icon-style"/>;
					let iconDel = <Icon className="iconfont icon-shanchu icon-style" />;
					return (
						<span className="title-con">
							{name}
							{iconAdd}
							{iconEdit}
							{iconDel}
						</span>
					);
				}
			}
		];

		return (
			<div className="bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">主页</Breadcrumb.Item>
					<Breadcrumb.Item href="#">基础档案</Breadcrumb.Item>
					<Breadcrumb.Item active>现金流量项目</Breadcrumb.Item>
				</Breadcrumb>
				<div className="bd-header">
					<div className="bd-title-1">现金流量项目</div>
				</div>
				<Table columns={columns4} data={this.state.dataList.slice(0, 3)} className="bd-table" />
				<div className="bd-footer">
					<div className="page-size">
						<Select defaultValue={'10条/页'} onChange={this.handleChangePageSize}>
							<Option value="10">10条/页</Option>
							<Option value="20">20条/页</Option>
							<Option value="50">50条/页</Option>
							<Option value="100">100条/页</Option>
						</Select>
						共 20 条
					</div>
					<div className="pagination">
						<Pagination
							prev
							next
							gap
							boundaryLinks
							items={Math.ceil(this.state.dataList.length / 2)}
							maxButtons={5}
							activePage={this.state.activePage}
							onSelect={this.handleSelect.bind(this)}
						/>
					</div>
				</div>

				<EditForm
					showModal={this.state.showModal}
					close={this.close}
					commonApi={this.commonApi}
					itemObj={this.state.curItemObj}
					editType={this.state.editType}
					indexNum={this.state.indexNum}
				/>
			</div>
		);
	}
}
