import React, { Component } from 'react';
import Settle from '../../containers/Settle';

export default class Settlement extends Component {
	constructor() {
		super();
	}

	// 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { title: '结算平台' }, { title: '异常结算' } ];

	render() {
		return (
			<Settle
				breadcrumbItem={this.breadcrumbItem}
				settleType='unnormal'
				status={2}
			/>
		);
	}
}
