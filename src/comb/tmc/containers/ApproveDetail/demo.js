import React, { Component } from 'react';
import ApproveDetail from './index.js';

export default class Demo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div>
				<ApproveDetail
					processInstanceId={this.props.location.query.processInstanceId}
					businesskey={this.props.location.query.businesskey}
					billid={this.props.location.query.billid}
				/>
			</div>
		);
	}
}
