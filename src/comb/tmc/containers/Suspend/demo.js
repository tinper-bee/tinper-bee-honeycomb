import React, { Component } from 'react';
import Suspend from './index.js';

export default class Demo extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		let anchor = [
			{
				status: 'success',
				name: '基本信息',
				anchorId: 'anchor1'
			},
			{
				status: 'warn',
				name: '融资信息',
				anchorId: 'anchor2'
			},
			{
				status: 'success',
				name: '授信信息',
				anchorId: 'anchor3'
			}
		];
		return (
			<div>
				<Suspend anchor={anchor} title={'融资合同信息核对'}>
					<div id="anchor1" style={{ height: '400px', border: '1px solid #000' }}>
						基本信息
					</div>
					<div id="anchor2" style={{ height: '400px', border: '1px solid #000' }}>
						融资信息
					</div>
					<div id="anchor3" style={{ height: '400px', border: '1px solid #000' }}>
						授信信息
					</div>
				</Suspend>
			</div>
		);
	}
}
