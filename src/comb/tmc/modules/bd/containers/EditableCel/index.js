import React, { Component } from 'react';
import { Icon } from 'tinper-bee';

export default class EditableCel extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isHover: '',
			editKey: '',
			itemObj: this.props.item
		};
	}

	onMouseLeave = (e) => {
		this.setState((pre) => {
			return {
				...pre,
				isHover: '',
				editKey: ''
			};
		});
	};

	onMouseEnter = (e) => {
		this.setState((pre) => {
			return {
				...pre,
				isHover: true,
				editKey: ''
			};
		});
	};

	nodeAdd = (e) => {
		this.props.openModal('ADD', this.state.itemObj);
	};

	nodeDel = (e) => {
		console.log('DEL', this.props);
		this.props.delData(this.state.itemObj);
	};

	nodeEdit = (e) => {
		this.props.openModal('EDIT', this.state.itemObj);
		console.log('EDIT', this.props);
	};

	render() {
		let getIconInfo = () => {
			return (
				<span>
					<Icon className="iconfont icon-zengjia icon-style" onClick={this.nodeAdd} />
					<Icon className="iconfont icon-shanchu icon-style" onClick={this.nodeDel} />
					<Icon className="iconfont icon-bianji icon-style" onClick={this.nodeEdit} />
				</span>
			);
		};

		const item = this.props.item;

		return (
			<span className="title-con" onMouseLeave={this.onMouseLeave} onMouseEnter={this.onMouseEnter}>
				{item.key + '  ' + item.name}
				{this.state.isHover ? getIconInfo() : ''}
			</span>
		);
	}
}
