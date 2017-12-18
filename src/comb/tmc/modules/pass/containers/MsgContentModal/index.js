import React, { Component } from 'react';
import { Modal, Button, Icon, FormControl } from 'tinper-bee';
import './index.less';

export default class MsgContentModal extends Component {
	static defaultProps = {
		confirmText: '确定',
		cancelText: '取消',
		show: false,
		title: '',
		closeButton: false,
		isButtonWhite: true,
		maxLength: 200,
		labelName: '哈哈哈',
		placeholder: 'hahha'
	};

	constructor(props) {
		super(props);
		this.state= {
			textVal: '',
			currentLength: 0,
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.show) {
			this.setState({textVal: ''});
		}
	}
	
	render() {
		let { show, title, confirmText, cancelText, closeButton, isButtonWhite, maxLength, labelName, placeholder}= this.props;
		let {textVal, currentLength} = this.state;
		
		return <Modal
			className="msg-content-modal"
			show={ show } 
			backdrop="static"
		>
			<Modal.Header closeButton= {closeButton}>
				<Modal.Title>
					<span className='content-title'>{title}</span>
					<span>
						<Icon 
							className='close-icon iconfont icon-guanbi'
							onClick={() => {this.props.onCancel(true, textVal);}}
						/>
					</span>
				</Modal.Title>
			</Modal.Header >
			<Modal.Body>
				<span className='msg-content-label'>{labelName}:</span>
				<div className='msg-content-box'>
					<textarea
						type='textarea'
						value={textVal}
						className='msg-content-textarea u-form-control text-area'
						placeholder={placeholder}
						onChange={e => {
							if (e.target.value.length<= maxLength) {
								this.setState({
									textVal: e.target.value,
									currentLength: e.target.value.length
								});}
						}}
					/>
					<span className='current-length'>{currentLength}/{maxLength}</span>
				</div>
			</Modal.Body> 
			<Modal.Footer>
				<Button 
					className= {`btn-2 ${isButtonWhite ? '' : 'btn-cancel'}`}	
					onClick={() => {this.props.onConfirm(textVal);}}
				>{confirmText}</Button>
				<Button 
					className= 'btn-2 btn-cancel'
					onClick={() => {this.props.onCancel(false, textVal);}}
				>{cancelText}</Button>
			</Modal.Footer>
		</Modal>;
	}
}
