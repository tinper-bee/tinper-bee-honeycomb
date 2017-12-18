import React, { Component } from 'react';
import Settle from '../../containers/Settle';

export default class Settlement extends Component {
	constructor() {
		super();
		this.state= {
			status: 0
		}
	}

	componentWillMount () {
		let status= this.props.location.query.status;
		if (status) {
			this.setState({status});
		}
	};

	// 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { title: '结算平台' }, { title: '结算服务' } ];

	render() {
		return (
			<Settle
				status={this.state.status}
			/>
		);
	}
}
