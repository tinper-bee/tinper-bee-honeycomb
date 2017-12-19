import React, { Component } from 'react';
import moment from 'moment';
import {Row,Col, Switch, Tooltip,Button, FormGroup, Modal } from 'tinper-bee';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import axios from 'axios';
import Select from 'bee-select';
import Refer from "../../../../containers/Refer";
import InputGroup from 'bee-input-group';
import Form from 'bee-form';
import FormControl from 'bee-form-control';
import Label from 'bee-label';
import { CheckboxItem, RadioItem, TextAreaItem, ReferItem , InputItem} from '../../../../containers/FormItems';
const FormItem=Form.FormItem;
import "./index.less";
export default class InputForm extends Component {
	constructor(props) {
		super(props);
		// 其实这里用formData来做,但是tinper-bee没有提供方案
		//动态加入字段
		this.state = {
			checkFormNow:false,
			data:this.props.modalData||{
				change:'',
				changeIn:'',
				passWord:''
			}
		};
	}

	close = (type) => {
		if (this.props.onClose) {
			this.props.onClose(type);
		}
	};

	componentWillReceiveProps(nextProps) {
		this.setState({
			data: nextProps.modalData||{
				change:'',
				changeIn:'',
				passWord:''
			}
		});
	}

	handleSubmit = () => {
		const newData = this.state.data;
		this.props.onSubmit(newData, this.props.opre);
		this.setState({
			checkFormNow:true
		})
	}

	handleChange = (opre,e) => {
		let data = this.state.data;
		if(opre == "inType"){
			data.changeIn = e.target.value;
		}else if(opre == "outType"){
			console.log(e)
			data = e.target.value;
		}
		this.setState({data: data});
	}

	checkForm = (flag,obj) => {
        console.log(flag);
		console.log(obj);
		let edit=obj
		this.props.onSubmit(edit, this.props.opre);
		this.setState({
			checkFormNow:false
		})
    }

	//忘记密码操作
	forgetMessage = (e) =>{
		alert(e)
		console.log(e)
	}

	//全部转出
	pullOut = (e) =>{
		alert(e)
	}

	//全部赎回
	callback = (e) =>{
		alert(e)
	}

	loadRows = (opre,columns) => {
		let  {data,checkFormNow}=this.state;
		if(opre=='inType'){
			return(
				<ul id="modalForm">
					<li>
						<Row>
						<Col componentClass="span"  xs={1}>
						</Col>
						<Col xs={11} md={11} lg={11}>
								{/* <Refer
									ctx={'/uitemplate_web'}
									refModelUrl={'/bd/bankaccbasRef/'}
									refCode={'bankaccbasRef'}
									refName={'银行账户'}
									strField={[{ name: '名称', code: 'refname' }]}
									value={this.state.currency1}
									onChange={value => {
										console.log(value);
										this.setState({
											currency1: value
										});
									}}
								/> */}
							从:<span style={{marginLeft:40}}>{columns.acctbank}</span>
						</Col>
						<Col componentClass="span"  xs={1}>
						</Col>
						<Col componentClass="span"  xs={8} style={{marginTop:20}}>
							转入:<span style={{marginLeft:25}}>{columns.eacctno}</span>
						</Col>
						</Row>
					</li>
					<li className="formbody">
						 <Form submitCallBack={this.checkForm} showSubmit={false}  checkFormNow={checkFormNow}>
							<FormItem
								labelName="转入金额"
								isRequire={true} reg={/^[0-9]+$/}
								errorMessage="金额格式错误"
								inputAfter={<span>本次最多可转入100,000.00</span>}
								method="blur"
								inline={true}>
								<FormControl name="amount" placeholder="建议100元以上" />
							</FormItem>
							{/* <FormItem labelName="支付密码"
								inputAfter={<span onClick={this.forgetMessage}>忘记密码？</span>}
								isRequire={true}
								method="blur"
								errorMessage="密码格式错误"
								htmlType="password"
								inline={true}>
								<FormControl name="age" ref="input"  placeholder="请输入支付密码" />
							</FormItem> */}
						</Form>
					</li>
				</ul>
			)
		}else if(opre=='outType'){
			return(
				<ul id="modalForm">
					<li>
						<Row>
						<Col componentClass="label" className="label" xs={12}>
									<Col  xs={4} className='banklogo'>
									</Col>
									<Col componentClass="span" className="title" xs={2}>
										账号：
									</Col>
									<Col xs={5} componentClass="span" className="content">
										{columns.acctbank}
									</Col>
							</Col>
						</Row>
					</li>
					<li className="formbody">
						 <Form submitCallBack={this.checkForm} showSubmit={false}  checkFormNow={checkFormNow}>
							<FormItem
							labelName="转出金额"
							isRequire={true}
							reg={/^[0-9]+$/}
							errorMessage="金额格式错误"
							 method="blur"
							// inputAfter={<span onClick={this.pullOut}>全部转出</span>}
							 inline={true}>
								<FormControl name="name" placeholder="建议100元以上" />
							</FormItem>
							{/* <FormItem labelName="支付密码"
								inputAfter={<span onClick={this.forgetMessage}>忘记密码？</span>}
								isRequire={true}
								method="blur"
								errorMessage="密码格式错误"
								htmlType="password"
								inline={true}>
								<FormControl name="age" ref="input"  placeholder="请输入支付密码" />
							</FormItem> */}
						</Form>
					</li>
				</ul>
			)
		}else if(opre=='assetback'){
			return(
				<ul id="modalForm">
					<li>
						<Row>
							<Col componentClass="label" className="label" xs={12}>
									<Col componentClass="span" className="title" xs={4}>
										账户余额：
									</Col>
									<Col xs={3} componentClass="span" className="content">
										{columns.accountbalance}
									</Col>
									<Col  xs={4} className='banklogo'>
									</Col>
							</Col>
							<Col componentClass="label" className="label" xs={12}>
									<Col componentClass="span" className="title" xs={4}>
										赎回产品：
									</Col>
									<Col xs={3} componentClass="span" className="content">
										{columns.eacctname}
									</Col>
							</Col>
						</Row>
					</li>
					<li className="formbody">
						 <Form submitCallBack={this.checkForm} showSubmit={false}  checkFormNow={checkFormNow}>
							<FormItem
								labelName="赎回金额"
								isRequire={true}
								reg={/^[0-9]+$/}
								errorMessage="金额格式错误"
								method="blur"
								//inputAfter={<span onClick={this.callback}>全部赎回</span>}
								inline={true}>
								<FormControl name="amount" placeholder="建议100元以上" />
							</FormItem>
							<FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4}
		                    	labelName="赎回方式："  isRequire={true}
		                    	errorMessage="放款计划格式错误" >
		                    	<RadioItem
		                    		name="type"
		                    		items= {
		                    			() => {
		                    				return [{
		                    					label: '普通赎回T+1',
		                    					value: 'T1'
		                    				}, {
		                    					label: '快速赎回T+0',
		                    					value: 'T0'
		                    				}]
		                    			}
		                    		}
		                    	/>
		                    </FormItem>
							{/* <FormItem
							    labelName="支付密码"
								isRequire={true} method="blur"
								errorMessage="密码格式错误"
								htmlType="password"
								inputAfter={<span onClick={this.forgetMessage}>忘记密码？</span>}
								inline={true}>
								<FormControl name="age" ref="input"  placeholder="请输入支付密码" />
							</FormItem> */}
						</Form>
					</li>
				</ul>
			)
		}
	}

	render() {
		const { showModal, opre, modalData,columns } = this.props;
		let { checked, value } = this.state;
		return (
			<Modal show={showModal} onHide={ this.close } id='modalTag'>
					<Modal.Header closeButton>
						<Modal.Title className='modaltitle'>{opre == 'inType' ? '转入' : opre == 'outType' ? '转出至' : opre == 'assetback' ? '赎回产品' :''}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{this.loadRows(opre,columns)}
					</Modal.Body>
					<Modal.Footer>
						{opre == 'inType' ? <Button onClick={this.handleSubmit.bind(this)} className="turnBtn" style={{ marginRight: 20 }}>
								确认转入
						</Button> : opre == 'outType' ? <Button onClick={this.handleSubmit.bind(this)} className="turnBtn" style={{ marginRight: 20 }}>
								确认转出
						</Button> : opre == 'assetback' ? <Button onClick={this.handleSubmit.bind(this)} className="turnBtn" style={{ marginRight: 20 }}>
								确认赎回
						</Button>:''}

						{/* <Button onClick={this.close.bind(this, 'cancel')} shape='border'>
							取消
						</Button> */}
					</Modal.Footer>
			</Modal>
		);
	}
}
