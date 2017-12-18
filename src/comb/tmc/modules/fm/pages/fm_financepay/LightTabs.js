import React, { Component } from 'react';


export default class LightTabs extends  Component {

	state = {
		tabs: this.props.items,
		activeKey: this.props.activeKey
	}

	changeActiveKey = (e, item) => {
		this.state.activeKey = item.key;
		this.setState();
	}

	componentWillReceiveProps(nextProp) {
		let active;
		if(nextProp.activeKey===3){
            active=nextProp.activeKey;
		}else{
			active=this.state.activeKey;
		}

	    this.setState({
	    	tabs: nextProp.items,
	    	//activeKey: nextProp.activeKey
			activeKey: this.state.activeKey
			//activeKey:active
	    });
  	}	


	render() {

		let self = this;
		let { tabs, activeKey} = this.state;
		return (
			<div className="light-tabs">
				<ul>
					{
						tabs.map((item, i) => {
							if (item.isShow === true) {
								
								if (item.key === activeKey) {
									return <li className="active" ><a href="javascript:;">{item.label}</a></li>;
								} else {
									return <li onClick={(e) => {self.changeActiveKey(e, item)}}><a href="javascript:;">{ item.label }</a></li>;
								}
							}
						})
						
					}
				</ul>
				{
					tabs.map((item, i) => {
						if (item.key === activeKey) {
							return item.render();
						}	
					})
				}
			</div>
		);
	}
}