import React, { Component } from 'react';


export default class LightTabs extends  Component {

	state = {
		tabs: this.props.items,
		activeKey: this.props.activeKey
	}

	changeActiveKey = (e, item) => {
		this.setState({
			activeKey: item.key
		});
		this.props.onChangeActive(item.key);
	}

	componentWillReceiveProps(nextProp) {

	    this.setState({
			tabs: nextProp.items,
			activeKey: nextProp.activeKey
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
									return <li className="active" key={i} ><a href="javascript:;">{item.label}</a></li>;
								} else {
									return <li key={i} onClick={(e) => {self.changeActiveKey(e, item)}}><a href="javascript:;">{ item.label }</a></li>;
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