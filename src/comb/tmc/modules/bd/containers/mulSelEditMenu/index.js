import React, { Component } from 'react';
import { Button, Checkbox, Icon, FormControl } from 'tinper-bee';
import './index.less';
import deepClone from '../../../../utils/deepClone.js'

let i = 0;
let cancelData=[];
export default class MulSelEditMenu extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: this.props.dataSource
		};
	}

	//更新事件选中
    checkChange = (b,index) => {
        let oldData = this.state.dataSource;
        oldData[index].values.selected.value=b?1:0;
        oldData[index].status=1;
        this.props.upData("edit",index,oldData[index]);
    };

    //输入时更新value
    handelValueChange = (e,index) => {
        let oldData = this.state.dataSource;
        oldData[index].values.name.value=e.target.value;
        this.setState({ dataSource: oldData });
    };

	//点击修改
    editChange = (index) => {
        //cancelData= JSON.parse(JSON.stringify(this.state.dataSource));
        cancelData=deepClone(this.state.dataSource);
        let old =  this.state.dataSource;
        old[index].edit=true;
        old[index].status=1;
        this.props.upEditFlag(false,this.props.keyList);
        this.setState({ dataSource: old });
    };


    // 取消
    handelCancel = (index) => {
        let old =  this.state.dataSource;
        this.props.upEditFlag(true,this.props.keyList);
        if ( old[index].values.name.value.length > 0) {
            old[index].edit=false;
            this.setState({ dataSource: old });
        }
        this.props.upData("cancel",null,cancelData);
    };

    // 保存
    saveCurrent = (index) => {
    	if(this.state.dataSource[index].values.name.value.length>0){
            let old =  this.state.dataSource;
            old[index].edit=false;
            this.props.upEditFlag(true,this.props.keyList);
            this.props.upData("edit",index,old[index]);
		}
    };

	// 新增
	addLi = () => {
        //cancelData= JSON.parse(JSON.stringify(this.state.dataSource));
        this.props.upEditFlag(false,this.props.keyList);
        cancelData=deepClone(this.state.dataSource);
        if(this.state.dataSource.length!=0){
            let oldData = this.state.dataSource;
            let { value } = oldData[oldData.length - 1].values.name;
            if (value.length === 0) {
                return;
            }
        }
		i++;
        const newData = {
            "rowId": "1",
            "status":2,
            "values": {
                "id": {
                    "value": i+"23214"
                },
                "name": {
                    "value": ""
                },
                "preset": {
                    "value":  0
                },
                "selected":{
                    "value":  1
				}
            },
            "edit": true
        }
        this.props.upData("add",null,newData);
	};

    // 删除
    handelDelete = (index) => {
        this.props.upData("del",index,null);
    };


    componentWillReceiveProps(nextProps) {
		this.setState({
			dataSource: nextProps.dataSource
		});
	}


	render() {
        const _this = this;
		const editnum = _this.props.editFlag;
		let editFlag = true;
		if (editnum && editnum === 1) {
			editFlag = false;
		} else {
			editFlag = true;
		}
		console.log('传入flag', editFlag);
		let menuHtml = () => {
			return this.state.dataSource.map(function(item, index) {
				const edit=item.edit?item.edit : false;
               item=item.values;
				return (
					<li className='edit-li' key={item.id.value}>
						{(item.preset.value===0)?
							(
								(!edit )? (
									<Checkbox defaultChecked={item.selected.value===1?true:false} onChange={(b)=>{
                                        _this.checkChange(b,index)
                                    }}>
										{item.name.value}
										<div className='editIcon'>
											<Icon className="iconfont icon-bianji icon-style" onClick={()=>{
                                                _this.editChange(index)
											}} />
											<Icon className="iconfont icon-shanchu icon-style" onClick={()=>{
												_this.handelDelete(index)
                                            }} />
										</div>
									</Checkbox>
								) : (
									<span className="handle">
                                    <FormControl
                                        autoFocus
										type='text'
										value={item.name.value}
										onChange={(e)=>{
                                            _this.handelValueChange(e,index);
										}}
										className='edit-li-input'
									/>
									<Icon type='iconfont icon-tishianniuchenggong' onClick={()=>{
                                        _this.saveCurrent(index)
									}} />
									<Icon type='iconfont icon-tishianniuguanbi error' onClick={()=>{
                                        _this.handelCancel(index)
                                    }} />
								</span>
								)
							) :
							(
								<Checkbox defaultChecked={item.selected.value===1?true:false} onChange={(b)=>{
                                    _this.checkChange(b,index)
                                }}>
									{item.name.value}
								</Checkbox>
							)
						}
					</li>
				);
			});
		};
		return (
			<ul>
				{menuHtml()}
                {this.props.echoAdd && editFlag ?(<li className='add_btn' onClick={this.addLi}>
                    <span>+</span>
                </li>) : (null)}

			</ul>
		);
	}
}
