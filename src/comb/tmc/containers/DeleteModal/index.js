import React, { Component } from 'react';
import { Icon } from 'tinper-bee';
import Popconfirm from 'bee-popconfirm';
import './index.less';

export default class DeleteModal extends Component {
	static defaultProps = {
		confirmText: '删除',
		cancelText: '取消',
		title: '确定要删除这条信息吗？',
		placement: 'top'
	};

	constructor(props) {
		super(props);
	}
	
	render() {
		let { title, confirmText, cancelText, placement}= this.props;
		const locale={lang: 'zh-cn', ok: confirmText, cancel: cancelText};
		const content= (
			<div className='title-box'>
				<Icon className="delete-icon iconfont icon-tishianniuzhuyi"/>
				<div className='bd-title-1'>{title}</div>
			</div>
		);
		return <Popconfirm 
			className='delete-modal'
			trigger="click" 
			placement={placement} 
			content={content} 
			rootClose={true}
			locale={locale}
			onCancel={this.props.onCancel}
			onClose={this.props.onConfirm}
		>
			<Icon className="iconfont icon-shanchu icon-style"/>	
		</Popconfirm>
	}
}
