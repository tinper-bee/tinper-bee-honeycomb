import React, { Component } from 'react';
import  './index.less';
import { hashHistory } from 'react-router';

export default class LightTabs extends  Component {

	state = {
		tabs: this.props.items,
		activeKey: localStorage.activeKey || "0"
		//activeKey: this.props.activeKey || '0'
	}

	changeActiveKey = (e, item) => {
		this.state.activeKey = localStorage.activeKey = item.key;
		//this.state.activeKey = item.key;
		let { onChange } = this.props;
		onChange(item.key);
		this.setState();
	}

	componentWillReceiveProps(nextProp) {
	    this.setState({
	    	tabs: nextProp.items,
	    	// activeKey: nextProp.activeKey
	    });
  	}	


	render() {
		let self = this;
		let { tabs, activeKey} = this.state;
		console.log(this.state, activeKey,'333')
		return (
			<div className="loantransaction-list">
				{
					tabs.map((item, i) => {
						if (item.isShow === true) {								
							// if (item.key === activeKey) {
							// 	return <li className="active" ><a href="javascript:;">{item.label}</a></li>;
							// } else {
							// 	return <li onClick={(e) => {self.changeActiveKey(e, item)}}><a href="javascript:;">{ item.label }</a></li>;
                            // }
                        return <div key={i}  
                                    className={item.key === activeKey ? `loantransaction-item ${item.className}` : "loantransaction-item"}
                                    //className = "loantransaction-item"
                                    onClick={(e) => {
										self.changeActiveKey(e, item);
										hashHistory.push(`fm/loantransaction?key=${item.key}`)
										console.log(item.key, item.className,'222')} }
                                >
                                	<div className="title-box">
                                		<p className='bd-title-1'>{item.title}</p>
                                		<p>{item.content}</p>
                                	</div>
                                	<div className='icon-box'></div>
                                </div>
							}
						})
						
					}
				{/* </ul> */}
				{
					tabs.map((item, i) => {
						if (item.key === activeKey) {
                            let Comp = item.component;
							return <Comp/>;
						}	
					})
				}
			</div>
		);
	}

	componentWillUnmount() {
	    this.setState({
	    	activeKey: this.props.activeKey || '0'
	    });
  	}
}


// <div  className="loantransaction-list">
// 					{ 
// 						loanDetail && loanDetail.map((item, index) => {
// 							return <div
// 								key={index} 
// 								className={item.id===index ? `loantransaction-item ${item.className}` : "loantransaction-item"}
// 								onClick={() => {
//                                     //hashHistory.push(item.path);
//                                     console.log(index,item,'123')
// 								}}
// 							>
// 								<div className="title-box">
// 									<p className='bd-title-1'>{item.title}</p>
// 									<p>{item.content}</p>
// 								</div>
// 								<div className='icon-box'></div>
// 							</div>
// 						})
//                     }
// 				</div>
//                 <div>
//                     <FinancepayManage/>
//                 </div>