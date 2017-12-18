import React, { Component } from 'react';
import { Breadcrumb } from 'tinper-bee';

export default class PobdocList extends Component {
	render() {
		let len = this.props.items.length;
		return (
			<Breadcrumb>
				{this.props.items.map((item, index) => {
					return (
						<Breadcrumb.Item href={item.href} active={index == len}>
							{item.title}
						</Breadcrumb.Item>
					);
				})}
			</Breadcrumb>
		);
	}
}
