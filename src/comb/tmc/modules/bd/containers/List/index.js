import React, { Component } from 'react';
import { Con, Row, Col } from 'bee-layout';
import { FormControl, Button } from 'tinper-bee';
import { Panel, PanelGroup } from 'bee-panel';
import './index.less';
import deepClone from '../../../../utils/deepClone.js';
/* 
	参数：
		obj : {
			title:"XXX",  --- 标题头
			data: []	 --- 列表数据
		}
*/
let i = 1;
let cancelData = [];
class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			initData: this.props.listData || []
		};
	}
	//点击新增
	handleAddClick = () => {
		//cancelData= JSON.parse(JSON.stringify(this.state.initData));
		this.props.upEditFlag(false,this.props.keyList);
		cancelData = deepClone(this.state.initData);
		if (this.state.initData.length != 0) {
			let oldData = this.state.initData;
			let { value } = oldData[oldData.length - 1].values.name;
			if (value.length === 0) {
				return;
			}
		}
		i++;
		const newData = {
			rowId: '1',
			status: 2,
			values: {
				id: {
					value: i + '1324'
				},
				name: {
					value: ''
				},
				preset: {
					value: 0
				}
			},
			edit: true
		};
		this.props.upData('add', null, newData);
	};

	handleLiClick = (e, id, index) => {
		if (e.target.tagName === 'INPUT') return;
		if (e.target.tagName === 'SPAN') return;

		//获取子级数据
		if (this.props.getData) {
			this.props.getData(id);
		}
		//获取孙级数据
		if (this.props.getThreeData) {
			this.props.getThreeData(id);
		}

		if (this.props.changeActive) {
			this.props.changeActive(index);
		}

		if (this.props.onClickLi) {
			this.props.onClickLi(this.props.keyList);
		}
	};

	//数据改变
	onChange = (e, index) => {
		let oldData = this.state.initData;
		oldData[index].values.name.value = e.target.value;
		this.setState({ initData: oldData });
	};

	//点击保存
	handleSaveClick = (index) => {
		if (this.state.initData[index].values.name.value.length > 0) {
			let old = this.state.initData;
			old[index].edit = false;
			this.props.upEditFlag(true,this.props.keyList);
			this.props.upData('edit', index, old[index]);
		}
	};

	//点击取消
	handleCancelClick = (index) => {
		let old = this.state.initData;
		this.props.upEditFlag(true,this.props.keyList);
		if (old[index].values.name.value.length > 0) {
			old[index].edit = false;
			this.setState({ initData: old });
		}
		this.props.upData('cancel', null, cancelData);
	};

	//点击修改按钮
	handleEditClick = (index) => {
		//cancelData= JSON.parse(JSON.stringify(this.state.initData));
		cancelData = deepClone(this.state.initData);
		let old = this.state.initData;
		old[index].status = 1;
		old[index].edit = true;
		this.props.upEditFlag(false,this.props.keyList);
		this.setState({ initData: old });
	};

	//点击删除数据
	handleDelClick = (index) => {
		this.props.upData('del', index, null);
	};

	componentWillReceiveProps(nextProps) {
		this.setState({
			initData: nextProps.listData || []
		});
	}

	componentDidMount() {
		let listData = this.state.initData;
		// 整理数据
		listData = listData.map((item, index) => {
			if (!item.values.preset.value) {
				item.edit = false;
			}
			return item;
		});
		if (listData) {
			this.setState({
				initData: listData
			});
		} else {
			console.error('DataError: "listData" is undefined.');
		}
	}

	render() {
		const _this = this;
		const editnum = _this.props.editFlag;
		console.log('props=',_this.props);
		const keyList = _this.props.keyList;
		let editFlag = true;
		if (editnum && editnum === 1) {
			editFlag = false;
		} else {
			editFlag = true;
		}
		console.log('传入flag', editFlag);
		return (
			<div>
				<ul className="list_parent">
					{this.state.initData.map((item, index) => {
						const edit = item.edit ? item.edit : false;
						item = item.values;
						return (
							<li
								className={index === this.props._active ? 'list_li_active' : 'list_li'}
								key={item.id.value}
								onClick={(e) => {
									_this.handleLiClick(e, item.id.value, index);
								}}
							>
								<div>
									{(item.preset ? (
										item.preset.value
									) : (
										0
									)) ? edit ? (
										<div className="list_item edit_mode">
											<div className="item_content">
												<FormControl
													autoFocus
													value={item.name.value}
													onChange={(e) => {
														this.onChange(e, index);
													}}
													size="sm"
												/>
											</div>
											<div className="operation_module ">
												<span
													className="iconfont icon-tishianniuchenggong"
													onClick={() => {
														_this.handleSaveClick(index);
													}}
												>
												</span>
												<span
													className="iconfont icon-tishianniuguanbi error"
													onClick={() => {
														this.handleCancelClick(index);
													}}
												>
												</span>
											</div>
										</div>
									) : (
										<div className="list_item browse_mode">
											<div className="item_content">
												{item.name.value}
											</div>
											 {/*需求变更,所有预制事件不可修改*/}
											{/*{keyList!==3 && editFlag && (
												<div className="operation_module">
													<span
														className="iconfont icon-bianji icon-style"
														onClick={() => {
															_this.handleEditClick(index);
														}}
													/>
												</div>
											)}*/}
										</div>
									) : edit ? (
										<div className="list_item edit_mode">
											<div className="item_content">
												<FormControl
												  autoFocus
													value={item.name.value}
													onChange={(e) => {
														this.onChange(e, index);
													}}
													size="sm"
												/>
											</div>
											<div className="operation_module ">
												<span
													className="iconfont icon-tishianniuchenggong"
													onClick={() => {
														_this.handleSaveClick(index);
													}}
												>
												</span>
												<span
													className="iconfont icon-tishianniuguanbi error"
													onClick={() => {
														this.handleCancelClick(index);
													}}
												>
												</span>
											</div>
										</div>
									) : (
										<div className="list_item browse_mode">
											<div className="item_content">{item.name.value}</div>
											 {/*需求变更,所有数据不可修改*/}
											{/*<div className="operation_module">
												{editFlag && (
													<i
														className="iconfont icon-bianji icon-style"
														onClick={() => {
															_this.handleEditClick(index);
														}}
														style={{ marginRight: 17 }}
													/>
												)}
												{/* <i className="iconfont  icon-jianshao" onClick={()=>{
                                                    _this.handleDelClick(index)
												}}/> */}
											{/*</div>*/}
										</div>
									)}
								</div>
							</li>
						);
					})}
				</ul>
				{/* 需求变更 (this.props.docIndex =='2' || this.props.docIndex =='4')*/}
				{this.props.echoAdd && editFlag ? (
					<div className="add_btn" onClick={this.handleAddClick}>
						<span>+</span> 
					</div>
				) : null}
			</div>
		);
	}
}

export default List;
