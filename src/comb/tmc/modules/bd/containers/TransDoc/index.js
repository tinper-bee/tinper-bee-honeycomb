import React, { Component } from 'react';
import { Row, Panel, Col } from 'tinper-bee';
import './index.less';
import MulSelEditMenu from '../mulSelEditMenu/index';
import List from '../List/index';
import Ajax from '../../../../utils/ajax';
import { toast } from '../../../../utils/utils.js';

const rootUrl = window.reqURL.bd + 'bd/transtype/';

/*let resData1 =  [
    {
        "rowId": "0",
        "values": {
            "id": {
                "display": null,
                "scale": -1,
                "value": "2124"
            },
            "name": {
                "display": null,
                "scale": -1,
                "value": "定期存款"
            },
            "preset": {
                "display": null,
                "scale": -1,
                "value":  1
            }
        }
    },
    {
        "rowId": "1",
        "values": {
            "id": {
                "display": null,
                "scale": -1,
                "value": "2244"
            },
            "name": {
                "display": null,
                "scale": -1,
                "value": "自定义大类1"
            },
            "preset": {
                "display": null,
                "scale": -1,
                "value":  0
            }
        }
    }
]

let resData2 = [
    {
        "rowId": "0",
        "values": {
            "id": {
                "display": null,
                "scale": -1,
                "value": "224224"
            },
            "name": {
                "display": null,
                "scale": -1,
                "value": "基金"
            },
            "preset": {
                "display": null,
                "scale": -1,
                "value":  1
            }
        }
    },
    {
        "rowId": "1",
        "values": {
            "id": {
                "display": null,
                "scale": -1,
                "value": "2244"
            },
            "name": {
                "display": null,
                "scale": -1,
                "value": "自定义类型1"
            },
            "preset": {
                "display": null,
                "scale": -1,
                "value":  0
            }
        }
    }
]

let resData3 = [
    {
        "rowId": "0",
        "values": {
            "id": {
                "display": null,
                "scale": -1,
                "value": "224224"
            },
            "name": {
                "display": null,
                "scale": -1,
                "value": "费用"
            },
            "preset": {
                "display": null,
                "scale": -1,
                "value":  1
            }
        }
    },
    {
        "rowId": "1",
        "values": {
            "id": {
                "display": null,
                "scale": -1,
                "value": "2244"
            },
            "name": {
                "display": null,
                "scale": -1,
                "value": "自定义费用1"
            },
            "preset": {
                "display": null,
                "scale": -1,
                "value":  0
            }
        }
    }
]

let resData4 = [
    {
        "rowId": "0",
        "values": {
            "id": {
                "display": null,
                "scale": -1,
                "value": "224224"
            },
            "name": {
                "display": null,
                "scale": -1,
                "value": "银行交易"
            },
            "preset": {
                "display": null,
                "scale": -1,
                "value":  1
            }
        }
    },
    {
        "rowId": "1",
        "values": {
            "id": {
                "display": null,
                "scale": -1,
                "value": "2244"
            },
            "name": {
                "display": null,
                "scale": -1,
                "value": "银行类型1"
            },
            "preset": {
                "display": null,
                "scale": -1,
                "value":  0
            }
        }
    }
]*/

let i = 0;

export default class TransDoc extends Component {
	constructor(props) {
		super(props);
		this.state = {
			listData: [],
			secondData: [],
			threeDate: [],
			echo: this.props.echo,
			echoAdd1: false,
			echoAdd2: false,
			_active1: null,
			_active2: null,
			editFlag: 0,
			editFlag2: false,
			editFlag3: false
		};
	}

	referListData = () => {
		const _this = this;

		const searchParams = {
			maincategory: this.props.docIndex,
			detailcategory: '1'
		};
		Ajax({
			url: rootUrl + 'search',
			data: searchParams,
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					console.log(data);
					console.log(data.head.rows);
					_this.setState(
						{
							listData: data.head.rows
						},
						() => {
							let defListData = _this.state.listData;
							if (defListData != null && defListData.length > 0) {
								let defId = defListData[0].values.id.value;
								_this.getSecondData(defId);
								_this.handleActiveChange1(0);
							}
						}
					);
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};
	referSecondData = (id) => {
		const _this = this;
		const searchParams = {
			maincategory: this.props.docIndex,
			parentid: id,
			detailcategory: '2'
		};
		Ajax({
			url: rootUrl + 'search',
			data: searchParams,
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					console.log(data);
					console.log(data.head.rows);
					_this.setState(
						{
							secondData: data.head.rows
						},
						() => {
							let defSecondData = _this.state.secondData;
							if (defSecondData != null && defSecondData.length > 0) {
								let defSecondId = defSecondData[0].values.id.value;
								_this.getThreeData(defSecondId);
								_this.handleActiveChange2(0);
							}
						}
					);
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};
	referThreeData = (id) => {
		const _this = this;
		const searchParams = {
			maincategory: this.props.docIndex,
			parentid: id,
			detailcategory: '3'
		};
		Ajax({
			url: rootUrl + 'search',
			data: searchParams,
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					console.log(data);
					console.log(data.head.rows);
					_this.setState({
						threeDate: data.head.rows
					});
				} else {
					toast({ content: message.message, color: 'warning' });
				}
			},
			error: function(res) {
				toast({ content: res.message, color: 'danger' });
			}
		});
	};

	componentWillMount() {
		if (this.state.echo && this.props.docIndex === '1') {
			this.referListData();
		}
	}

	/* componentDidMount(){
        if(this.props.docIndex === "1") this.setState({listData:resData1});
        if(this.props.docIndex === "2") this.setState({listData:resData2});
        if(this.props.docIndex === "3") this.setState({listData:resData3});
        if(this.props.docIndex === "4") this.setState({listData:resData4});
    }*/

	getSecondData = (id) => {
		this.referSecondData(id);

		//前端数据查询模拟
		/* i++;
        let resData =  [
            {
                "rowId": "0",
                "values": {
                    "id": {
                        "display": null,
                        "scale": -1,
                        "value": "224224"
                    },
                    "name": {
                        "display": null,
                        "scale": -1,
                        "value": i +"类型1"
                    },
                    "preset": {
                        "display": null,
                        "scale": -1,
                        "value":  1
                    }
                }
            },
            {
                "rowId": "1",
                "values": {
                    "id": {
                        "display": null,
                        "scale": -1,
                        "value": "2244"
                    },
                    "name": {
                        "display": null,
                        "scale": -1,
                        "value": "类型2"
                    },
                    "preset": {
                        "display": null,
                        "scale": -1,
                        "value":  0
                    }
                }
            }
        ]
        this.setState({
            secondData: resData
        });*/
		if (this.state.secondData.length === 0) {
			this.setState({
				echoAdd1: true
			});
		}
	};
	getThreeData = (id) => {
		this.referThreeData(id);

		//前端数据查询模拟
		/*i++;
        let resData2 =  [
            {
                "rowId": "0",
                "values": {
                    "id": {
                        "display": null,
                        "scale": -1,
                        "value": "224224"
                    },
                    "name": {
                        "display": null,
                        "scale": -1,
                        "value": i +"事件1"
                    },
                    "preset": {
                        "display": null,
                        "scale": -1,
                        "value":  1
                    },
                    "selected" : {
                        "display": null,
                        "scale": -1,
                        "value": 1
                    }
                }
            },
            {
                "rowId": "1",
                "values": {
                    "id": {
                        "display": null,
                        "scale": -1,
                        "value": "2244"
                    },
                    "name": {
                        "display": null,
                        "scale": -1,
                        "value": "事件2"
                    },
                    "preset": {
                        "display": null,
                        "scale": -1,
                        "value":  0
                    },
                    "selected" : {
                        "display": null,
                        "scale": -1,
                        "value": 0
                    }
                }
            }
        ]
        this.setState({
            threeDate: resData2
        });*/

		if (this.state.threeDate.length === 0) {
			this.setState({
				echoAdd2: true
			});
		}
	};
	//点击交易大类时，清空事件的数据
	onClickFirstLi = (keyList) => {
		// 切换大类时，交易类型或者事件页签的编辑态重置为浏览态
		this.setState({
			threeDate: [],
			_active2: null,
			echoAdd2: false,
			editFlag2: false,
			editFlag3: false,
			editFlag: keyList === 1 && (!this.state.editFlag2 && !this.state.editFlag3) ? this.state.editFlag : 0
			// editFlag: 0
		});
	};
	// 点击交易类型时，清空
	onClickFirstLiFromSec = (keyList) => {
		// 切换类型时，事件页签的编辑态重置为浏览态
		let flag = 0;
		if (keyList === 2 && !this.state.editFlag3) {
			flag = this.state.editFlag;
		} else {
			flag = 0;
		}
		if (keyList === 2) {
			this.setState({
				editFlag3: false,
				editFlag: flag
			});
		}
	};

	//接收props更新
	componentWillReceiveProps(nextProps) {
		if (nextProps.echo) {
			this.referListData();
		}
		this.setState((pre) => {
			return {
				...pre,
				echo: nextProps.echo,
				docIndex: nextProps.docIndex,
				editFlag : 0
			};
		});
	}

	handleActiveChange1 = (index) => {
		this.setState({
			_active1: index
		});
	};
	handleActiveChange2 = (index) => {
		this.setState({
			_active2: index
		});
	};

	upListData = (str, index, data) => {
		const _this = this;
		if (str === 'cancel') {
			this.setState({
				listData: data
			});
		}
		if (str === 'add') {
			this.setState({
				listData: [ ...this.state.listData, data ]
			});
		}
		//删除
		if (str === 'del') {
			let old = this.state.listData;
			const id = old[index].values.id.value;
			const list = [ id ];
			Ajax({
				url: rootUrl + 'delete',
				data: { list },
				success: function(res) {
					const { data, message, success } = res;
					if (success) {
						//更新数据
						_this.referListData();
					} else {
						toast({ content: message.message, color: 'warning' });
					}
				},
				error: function(res) {
					toast({ content: res.message, color: 'danger' });
				}
			});
		}
		//保存
		if (str === 'edit') {
			let newData = {};
			//新增
			if (data.status === 2) {
				console.log('新增');
				newData.rowId = data.rowId;
				newData.status = data.status;
				newData.values = {
					name: {
						value: data.values.name.value
					},
					maincategory: {
						value: parseInt(this.props.docIndex)
					},
					detailcategory: {
						value: 1
					}
				};
			}
			if (data.status === 1) {
				console.log('修改');
				newData.rowId = data.rowId;
				newData.status = data.status;
				newData.values = {
					id: {
						value: data.values.id.value
					},
					name: {
						value: data.values.name.value
					},
					ts: {
						value: data.values.ts.value
					}
				};
			}
			let reqData = {
				data: {
					head: {
						pageInfo: null,
						rows: [ newData ]
					}
				}
			};
			console.log(reqData);
			Ajax({
				url: rootUrl + 'save',
				data: reqData,
				success: function(res) {
					const { data, message, success } = res;
					if (success) {
						//更新数据
						_this.referListData();
					} else {
						toast({ content: message.message, color: 'warning' });
					}
				},
				error: function(res) {
					toast({ content: res.message, color: 'danger' });
				}
			});
		}
	};

	upSecondData = (str, index, data) => {
		const _this = this;
		if (str === 'cancel') {
			this.setState({
				secondData: data
			});
		}
		if (str === 'add') {
			this.setState({
				secondData: [ ...this.state.secondData, data ]
			});
		}
		//删除
		if (str === 'del') {
			let old = this.state.secondData;
			const id = old[index].values.id.value;
			const list = [ id ];
			Ajax({
				url: rootUrl + 'delete',
				data: { list },
				success: function(res) {
					const { data, message, success } = res;
					if (success) {
						//更新数据
						const parentId = _this.state.listData[_this.state._active1].values.id.value;
						_this.referSecondData(parentId);
					} else {
						toast({ content: message.message, color: 'warning' });
					}
				},
				error: function(res) {
					toast({ content: res.message, color: 'danger' });
				}
			});
		}
		//保存
		if (str === 'edit') {
			let newData = {};
			if (data.status === 2) {
				console.log('新增');
				const parentId = _this.state.listData[_this.state._active1].values.id.value;
				newData.rowId = data.rowId;
				newData.status = data.status;
				newData.values = {
					name: {
						value: data.values.name.value
					},
					maincategory: {
						value: parseInt(this.props.docIndex)
					},
					detailcategory: {
						value: 2
					},
					parentid: {
						value: parentId
					}
				};
			}
			if (data.status === 1) {
				console.log('修改');
				newData.rowId = data.rowId;
				newData.status = data.status;
				newData.values = {
					id: {
						value: data.values.id.value
					},
					name: {
						value: data.values.name.value
					},
					ts: {
						value: data.values.ts.value
					}
				};
			}
			let reqData = {
				data: {
					head: {
						pageInfo: null,
						rows: [ newData ]
					}
				}
			};
			console.log(reqData);
			Ajax({
				url: rootUrl + 'save',
				data: reqData,
				success: function(res) {
					const { data, message, success } = res;
					if (success) {
						//更新数据
						const parentId = _this.state.listData[_this.state._active1].values.id.value;
						_this.referSecondData(parentId);
					} else {
						toast({ content: message.message, color: 'warning' });
					}
				},
				error: function(res) {
					toast({ content: res.message, color: 'danger' });
				}
			});
		}
	};

	upThreeData = (str, index, data) => {
		const _this = this;
		if (str === 'cancel') {
			this.setState({
				threeDate: data
			});
		}
		if (str === 'add') {
			this.setState({
				threeDate: [ ...this.state.threeDate, data ]
			});
		}
		//删除
		if (str === 'del') {
			let old = this.state.threeDate;
			const id = old[index].values.id.value;
			const list = [ id ];
			Ajax({
				url: rootUrl + 'delete',
				data: { list },
				success: function(res) {
					const { data, message, success } = res;
					if (success) {
						//更新数据
						const parentId = _this.state.secondData[_this.state._active2].values.id.value;
						_this.referThreeData(parentId);
					} else {
						toast({ content: message.message, color: 'warning' });
					}
				},
				error: function(res) {
					toast({ content: res.message, color: 'danger' });
				}
			});
		}
		//保存
		if (str === 'edit') {
			let newData = {};
			if (data.status === 2) {
				console.log('新增');
				const parentId = _this.state.secondData[_this.state._active2].values.id.value;
				newData.rowId = data.rowId;
				newData.status = data.status;
				newData.values = {
					name: {
						value: data.values.name.value
					},
					// selected: {
					// 	value: data.values.selected.value
					// },
					maincategory: {
						value: parseInt(this.props.docIndex)
					},
					detailcategory: {
						value: 3
					},
					parentid: {
						value: parentId
					}
				};
			}
			if (data.status === 1) {
				console.log('修改');
				newData.rowId = data.rowId;
				newData.status = data.status;
				newData.values = {
					id: {
						value: data.values.id.value
					},
					name: {
						value: data.values.name.value
					},
					// selected: {
					// 	value: data.values.selected.value
					// },
					ts: {
						value: data.values.ts.value
					}
				};
			}
			let reqData = {
				data: {
					head: {
						pageInfo: null,
						rows: [ newData ]
					}
				}
			};
			console.log(reqData);
			Ajax({
				url: rootUrl + 'save',
				data: reqData,
				success: function(res) {
					const { data, message, success } = res;
					if (success) {
						//更新数据
						const parentId = _this.state.secondData[_this.state._active2].values.id.value;
						_this.referThreeData(parentId);
					} else {
						toast({ content: message.message, color: 'warning' });
					}
				},
				error: function(res) {
					toast({ content: res.message, color: 'danger' });
				}
			});
		}
	};

	upEditFlag = (flag, keyList) => {
		console.log('flag', flag);
		let editnum = this.state.editFlag;
		if (keyList === 2) {
			if (flag) {
				this.setState({
					editFlag2: false
				});
			} else {
				this.setState({
					editFlag2: true
				});
			}
		}
		if (keyList === 3) {
			if (flag) {
				this.setState({
					editFlag3: false
				});
			} else {
				this.setState({
					editFlag3: true
				});
			}
		}
		if (flag) {
			this.setState({
				editFlag: 0
			});
		} else {
			this.setState({
				editFlag: editnum + 1
			});
		}
	};

	render() {
		const listData = this.state.listData;
		return this.state.echo ? (
			<div className="panels">
				<Panel
					header={
						<span style={{ color: '#fff', fontSize: 16, height: 40 }}>
							<span className="iconfont icon-jiaoyidalei card-icon" />
							<span className="card-text">交易大类</span>
						</span>
					}
					headerStyle={{
						backgroundColor: '#36ABD7'
					}}
				>
					{/*{listData.length>0?(*/}
					<List
						listData={listData}
						getData={this.getSecondData}
						onClickLi={this.onClickFirstLi}
						_active={this.state._active1}
						echoAdd={true}
						upData={this.upListData}
						upEditFlag={this.upEditFlag}
						editFlag={this.state.editFlag}
						changeActive={this.handleActiveChange1}
						key="1"
						keyList={1}
						docIndex={this.props.docIndex}
					/>
					{/* ):null}*/}
				</Panel>

				<Panel
					header={
						<span style={{ color: '#fff', fontSize: 16, height: 40 }}>
							<span className="iconfont icon-jiaoyileixing card-icon" />
							<span className="card-text">交易类型</span>
						</span>
					}
					headerStyle={{
						backgroundColor: '#4AB191'
					}}
					style={{ marginLeft: 20, marginRight: 20 }}
				>
					<List
						listData={this.state.secondData}
						getThreeData={this.getThreeData}
						onClickLi={this.onClickFirstLiFromSec}
						upData={this.upSecondData}
						upEditFlag={this.upEditFlag}
						editFlag={this.state.editFlag}
						echoAdd={this.state.echoAdd1}
						_active={this.state._active2}
						changeActive={this.handleActiveChange2}
						key="2"
						keyList={2}
						docIndex={this.props.docIndex}
					/>
				</Panel>

				<Panel
					header={
						<span style={{ color: '#fff', fontSize: 16, height: 40 }}>
							<span className="iconfont icon-shijian card-icon" />
							<span className="card-text">事件</span>
						</span>
					}
					headerStyle={{
						backgroundColor: '#9B85D7'
					}}
				>
					<List
						listData={this.state.threeDate}
						upData={this.upThreeData}
						echoAdd={this.state.echoAdd2}
						upEditFlag={this.upEditFlag}
						editFlag={this.state.editFlag}
						key="3"
						keyList={3}
						docIndex={this.props.docIndex}
					/>
					{/* <MulSelEditMenu
						dataSource={this.state.threeDate}
						upData={this.upThreeData}
						echoAdd={this.state.echoAdd2}
						upEditFlag={this.upEditFlag}
						editFlag={this.state.editFlag}
						keyList={3}
					/> */}
				</Panel>
			</div>
		) : null;
	}
}
