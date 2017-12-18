import React, { Component } from 'react';
import classnames from 'classnames'

export default class LightTabs extends  Component {
	constructor(props){
    	super(props);
    }

	changeActiveKey = (item) => {
		this.props.handleTypeChange && this.props.handleTypeChange(item.key)		
	}	

	render() {
		let { tabs, activeKey} = this.props;
		var lens = 0;
		tabs.forEach(item => {			
			if(item.isShow) {
				lens ++
			}
			return lens;
		})
		let vis = {
			visibility: lens <= 1 ? 'hidden' : 'visible'
		}
		const activeClass = classnames({
	    	'text-count': tabs.length == 1, // len == 1 圆角
	    	'isCount': tabs.length == 2, // len == 2 两侧圆角 不高亮没有边框
	    });	

		return (
			<div className="light-tabs">
				<ul className="tabs-wraps">
					{
						tabs.map((item, i) => {
							if (item.isShow === true) {							
								if (item.key === activeKey) {
									return <li className="active" style={vis}><a href="javascript:;">{item.label}</a></li>;
								} else {
									return <li style={vis} onClick={this.changeActiveKey.bind(this, item)} ><a href="javascript:;">{ item.label }</a></li>;
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