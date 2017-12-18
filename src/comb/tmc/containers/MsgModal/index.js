import React, { Component } from 'react';
import { Modal, Button, Icon } from 'tinper-bee';
import './index.less';

export default class MsgModal extends Component {
	static defaultProps = {
		confirmText: '确定',
		cancelText: '取消',
		show: false,
		title: '',
		content: '',
		closeButton: false,
		icon: 'icon-tishianniuchenggong',
		isButtonWhite: true,
		isButtonShow: true
	};

	constructor(props) {
		super(props);
	}
	
	render() {
		let { show, title, content, confirmText, cancelText, closeButton, icon, isButtonWhite, isButtonShow}= this.props;
		
		return <Modal
			className={isButtonShow ? 'msg-modal' : 'msg-modal footer-hidden'}
			show={ show } 
			backdrop="static"
		>
			<Modal.Header closeButton= {closeButton}>
				<Modal.Title>
					<span className={`title-icon iconfont ${icon}`}></span>
					<span className='bd-title-1'>{title}</span>
					<span>
						<Icon 
							className='close-icon iconfont icon-guanbi'
							onClick={() => {this.props.onCancel(true);}}
						/>
					</span>
				</Modal.Title>
			</Modal.Header >
			<Modal.Body 
				dangerouslySetInnerHTML={{
					__html: content
				}}
			/> 
			{isButtonShow &&
				<Modal.Footer>
					<Button 
						className= {`btn-2 ${isButtonWhite ? '' : 'btn-cancel'}`}	
						onClick={this.props.onConfirm}
					>{confirmText}</Button>
					<Button 
						className= 'btn-2 btn-cancel'
						onClick={() => {this.props.onCancel(false);}}
					>{cancelText}</Button>
				</Modal.Footer>
			}
		</Modal>;
	}
}
