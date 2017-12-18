import React, { Component } from 'react';
import { hashHistory  } from 'react-router';
import { Button, Icon, FormControl } from 'tinper-bee';
import {Ajax, Refer, BreadCrumbs, URL, MsgModal, detailOpertion} from '../index';
import ChangeRecord from '../ChangeRecord';
import MsgContentModal from '../MsgContentModal';
import './index.less';
import { toast } from '../../../../utils/utils.js';
import '../formatMoney.js';
import ApproveDetail from 'containers/ApproveDetail';
import ApproveDetailButton from 'containers/ApproveDetailButton';
import TmcUploader from '../../../../containers/TmcUploader';
import image from '../../../../static/images/settlerollin.png';
const detailsUrl= 'pass/settlement/';

export default class SettlementDetail extends Component {
	static defaultProps = {
	};

	constructor(props) {
		super(props);
		this.state = {
			isnetbank: '',	//结算类型
			settlestatus: 0,	//结算状态
			details: {},	//明细数据
			type: '',		//view or edit
			transtype: '',	//收支属性
			vbillstatus: '',	//审批状态 
			id: '',       	//当前项id
			version: 0,		//当前变更版本, 0代表为变更过
			isChangeRecordShow: false,
			referCode: 111,
			imgShow: false,
			msgContentShow: false,
			MsgModalShow: false,
			currentKey: 0,
			onpayContent: ''
		};
	}

	componentWillMount () {
		let { type, id }= this.props.location.query;
		this.setState({type, id});
		this.getSettleDetails(id);
	};

	componentDidMount() {
		this.setState({imgShow: true});
	}

	//查看当前选中项详情
	getSettleDetails = id => {
		const _this = this;
		Ajax({
			url: URL + 'pass/settlement/cardinfo',
			data: {id},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let details= data && data.head && data.head.rows[0] && data.head.rows[0].values;
					_this.setState({
						details: details || {},
						isnetbank: (details && details.isnetbank) ? details.isnetbank.display || details.isnetbank.value : '',
						settlestatus: (details && details.settlestatus) ? details.settlestatus.display || details.settlestatus.value || 0 : 0,
						transtype: (details && details.transtype) ? details.transtype.display || details.transtype.value : '',
						vbillstatus: (details && details.vbillstatus) ? details.vbillstatus.display || details.vbillstatus.value : '',
						version: (details && details.version) ? details.version.display || details.version.value : '',
					});
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
			}
		}); 
	};

	//按钮交互
	setButtonsOperation = (path, content) => {
		const _this= this;
		let details= this.state.details;
		Ajax({
			url: URL + detailsUrl + path,
			data:{ data: { head: { rows: [ { values: details } ] } } },
			success: function(res) {
				if (res.success) {
					if (path=== 'onpay') {//网银支付
						_this.setState({
							MsgModalShow: true,
							onpayContent: res.message ? res.message.message : '是否确认网上支付?',
							currentKey: 5
						});
					} else {
						toast({content: content, color: 'success'});
						let details= res.data && res.data.head && res.data.head.rows[0] && res.data.head.rows[0].values;
						let id= (details && details.id) ? details.id.display || details.id.value : '';
						if (id) {
							_this.getSettleDetails(id);
							_this.setState({id, type: 'view'});
						}
						_this.setState({
							msgContentShow: false,
							MsgModalShow: false
						});
					}
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
			}
		}); 
	};

	//改变属性值
	changeVal = (property1, val1, property2, val2) => {
		let { details }= this.state;
		details[property1]['display']= val1;
		details[property1]['value']= val1;
		if (property2) {
			details[property2]['display']= val2;
			details[property2]['value']= val2;
		}
		this.setState({
			details,
			referCode: 111
		});
	};
	
	// 面包屑数据
	breadcrumbItem = () => {
		return [ { href: '#', title: '首页' }, { title: '结算平台' }, { title: '结算服务' }
		//, { title: this.state.isnetbank=== 0 ? '网银支付' : '手工结算' } 
		]
	};

	//显示按钮详情
	detailButtons= type => {
		let {isnetbank, settlestatus, version, vbillstatus}= this.state;
		if (type=== 'view') {
			return [
				{content: '提交', path: 'commit', show: settlestatus== 0 && vbillstatus== 0, isMain: true},
				{content: '取消提交', path: 'uncommit', show: settlestatus== 0 && vbillstatus== 3, isMain: true},
				{content: '修改', btnChange: true, show: vbillstatus== 0 && settlestatus== 0, isMain: true},
				{content: '手工结算', show: isnetbank=== 1 && settlestatus== 0 && vbillstatus== 1, isMain: true, isMsgModal: true, key: 0},
				{content: '网银支付', path: 'onpay', show: isnetbank=== 0 && settlestatus== 0 && vbillstatus== 1, isMain: true},
				{content: '手工确认', show: isnetbank=== 0 && settlestatus== 1, isMain: true, isMsgContent: true, key: 2},
				{content: '作废', show: (isnetbank=== 0 && settlestatus== 2) || (isnetbank== 1 && settlestatus== 0 && vbillstatus== 0), isMain: true, isMsgContent: true, key: 3},
				{content: '变更', btnChange: true, show: isnetbank=== 0 && settlestatus== 2, isMain: true},
				{content: '变更记录', show: version> 0, change: true},
				{isApproval: true, show: vbillstatus> 0},//审批流程
				// {content: '打印', path: 'print', show: settlestatus!= 1},
				// {content: '附件', path: 'upfile', show: settlestatus!= 1},
				{content: '返回', show: true, reback: (settlestatus== 2 || settlestatus== 4) ? '/pass/unsettlement' : '/pass/settlement'}
			];
		} else if (type=== 'scan') {
			return [];
		} else {
			return [
				{content: '保存', path: settlestatus== 0 ? 'modify' : 'change', show: true, isMain: true, isSave:true},
				{content: '取消', show: true, cancel: true},
				{content: '返回', show: true, reback: (settlestatus== 2 || settlestatus== 4) ? '/pass/unsettlement' : '/pass/settlement'}
			];
		}
	};
	
	render() {
		let isApprove = this.props.location.pathname.indexOf('/approve') !== -1;
		let { processInstanceId, businesskey }= this.props.location.query;
		let { isnetbank, settlestatus, details, type, transtype, vbillstatus, version, isChangeRecordShow, referCode, imgShow, msgContentShow, MsgModalShow, currentKey, onpayContent, id }= this.state;
		let buttonGroup= this.detailButtons(type);
		let statusName= settlestatus== 0 ? '待结算' : (settlestatus== 1 ? '结算中' : (settlestatus== 2 ? '结算失败' : (settlestatus== 3 ? '结算成功' : '作废')));
		let vbillstatusName= vbillstatus== 0 ? '待提交' : (vbillstatus== 3 ? '待审批' : (vbillstatus== 2 ? '审批中' : '审批通过'));
		let srcsystem= details.srcsystem ? details.srcsystem.display || details.srcsystem.value : '';
		let srcsystemName= srcsystem== 0 ? '第三方系统' : (srcsystem== 1 ? '资金' : '到账'); 
		
		return (
			<div className= "pass-settlement-detail bd-wraps">
				<BreadCrumbs items={this.breadcrumbItem()} />
				{ isApprove && 
                    <ApproveDetail 
                        processInstanceId={processInstanceId} 
                        billid={id}
                        businesskey={businesskey}
						refresh={() => {this.getSettleDetails(id)}} 
                    /> 
                }
				<div className='pop-modal'>
					<ChangeRecord  
						details={details} 
						show={isChangeRecordShow}
						hidden={() => {this.setState({isChangeRecordShow: false});}}
					/>
				</div>
				<div className="settle-detail-search">
					<div className='credit-title'>
						<span className="bd-title-1">
							{details.srctranevent ? details.srctranevent.display || details.srctranevent.value : ''}{details.eventno ? details.eventno.display || details.eventno.value : ''}
						</span>
					</div>
					<div className='settle-detail-btn'>
						{settlestatus!= 1 && id && (type!== 'scan') &&
							<TmcUploader billID={id}/>
						}
						{
							buttonGroup && buttonGroup.map((item, key) => {
								if (item.isApproval) {
									return <ApproveDetailButton 
										processInstanceId={processInstanceId} 
										className='settle-detail-approve'
										style={{display: item.show ? 'inline-block' : 'none'}}
									/>
								} else {
									return (
										<Button
											id={item.change ? 'settle-change-btn' : ''}
											style={{display: item.show ? 'inline-block' : 'none'}} 
											className={item.isMain ? 'btn-cancel detail-btn active' : 'btn-cancel detail-btn'}
											onClick={() => {
												if (item.btnChange) {//修改、变更按钮
													this.setState({
														type: 'edit'
													});
												} else if (item.path) {//提交, 取消提交, 网银支付, 保存按钮
													let bankNum= transtype== 0 ? (details.recaccnum ? details.recaccnum.display || details.recaccnum.value : '') : (details.payaccnum ? details.payaccnum.display || details.payaccnum.value : '');
													let balatypename= details.balatypename ? details.balatypename.display || details.balatypename.value : '';
												if (!balatypename && (isnetbank== 0)) {
													toast({color: 'danger', content: '结算方式不能为空'});
													return;
												} else if (!bankNum && (isnetbank== 0)) {
													toast({color: 'danger', content: '本方账户和户名不能为空'});
													return;
												}
													this.setButtonsOperation(item.path, item.content);
												} else if (item.isMsgContent) {//手工确认, 作废按钮
													this.setState({
														msgContentShow: true,
														currentKey: item.key
													});
												} else if (item.isMsgModal) {//手工结算按钮
													this.setState({
														MsgModalShow: true,
														currentKey: item.key
													});
												} else if (item.reback) {//返回
													hashHistory.push(item.reback);
												} else if (item.cancel) {//取消
													this.setState({type: 'view'});
												} else if (item.change) {//变更记录
													this.setState({isChangeRecordShow: !isChangeRecordShow});
												}
											}}
										>{item.content}</Button>
									);
								}
							})
						}
					</div>
				</div>
				<div className='settle-detail-box'>
					<div className='settle-setail-tittle'>
						<img className={imgShow ? 'show' : ''} src={image}/>
					</div>
					<ul className='settle-deetail-list'>
						<li>
							<span className='settlement-label'>业务日期:</span>
							<span className='settlement-value'>{details.eventdate ? details.eventdate.display || details.eventdate.value : ''}</span>
						</li>
						<li>
							<span className='settlement-label'>交易类型:</span>
							<span className='settlement-value'>{details.srctradetypename ? details.srctradetypename.display || details.srctradetypename.value : ''}</span>
						</li>
						<li>
							<span className='settlement-label'>币种:</span>
							<span className='settlement-value'>{details.currtypename ? details.currtypename.display || details.currtypename.value : ''}</span>
						</li>
						<li>
							<span className='settlement-label'>金额:</span>
							<span className='settlement-value'>{details.money ? Number(details.money.display || details.money.value || 0).formatMoney(2, '') : ''}</span>
						</li>
						<li>
							<span className='settlement-label'>收支属性:</span>
							<span className='settlement-value'>
								{transtype== 0 ? '收款' : (transtype== 1 ? '支付' : '转账')}
							</span>
						</li>
						<li>
							<span className={`settlement-label ${((settlestatus== 0 || settlestatus== 2)  && type=== 'edit' && (isnetbank== 0)) ? 'isRequire' : ''}`}>结算方式:</span>
							<span className='settlement-value'>
								{
									((settlestatus== 0 || settlestatus== 2)  && type=== 'edit') ? 
										<Refer
											className='w240 detail-refer'
											placeholder="结算方式"
											ctx={'/uitemplate_web'}
											refModelUrl={'/bd/balatypeRef/'}
											refCode={'balatypeRef'}
											refName={'结算方式'}
											value={{refpk: referCode, refname: details.balatypename ? details.balatypename.display || details.balatypename.value : ''}}    
											onChange={item => {
												let isEmpty= JSON.stringify(item)=== '{}';
												this.changeVal('balatypename', isEmpty ? '' : item.refname, 'balatypeid', isEmpty ? '' : item.id);
											}}
										/>
									:
										<span>{details.balatypename ? details.balatypename.display || details.balatypename.value : ''}</span>	
								}
							</span>
						</li>
						<li className='settle-deetail-background'>
							<span className={`settlement-label ${((settlestatus== 0 || settlestatus== 2) && transtype!= 0 && type=== 'edit' && (isnetbank== 0)) ? 'isRequire' : ''}`}>{transtype== 0 ? '对方账户:' : '本方账户:'}</span>
							<span className='settlement-value'>
								{
									((settlestatus== 0 || settlestatus== 2) && transtype!= 0 && type=== 'edit') ? 
										<Refer
											className='w240'
											placeholder={transtype== 0 ? '对方账户' : '本方账户'}
											ctx={'/uitemplate_web'}
											refModelUrl={'/bd/bankaccbasRef/'}
											refCode={'bankaccbasRef'}
											refName={'银行账户'}
											value={
												transtype== 0 ?
													{refpk: referCode, refname: details.recaccnum ? details.recaccnum.display || details.recaccnum.value : ''}
												:
													{refpk: referCode, refname: details.payaccnum ? details.payaccnum.display || details.payaccnum.value : ''}
											}    
											onChange={item => {
												let isEmpty= JSON.stringify(item)=== '{}';
												let num= transtype== 0 ? 'recaccnum' : 'payaccnum';
												let name= transtype== 0 ? 'recaccname' : 'payaccname';
												this.changeVal(num, isEmpty ? '' : item.refcode, name, isEmpty ? '' : item.refname);
											}}
											multiLevelMenu={[
												{
													name: ['子户编码', '子户名称'],
													code: ['refcode', 'refname']
												}
											]}
											referFilter={{
												// accounttype: 0, //01234对应活期、定期、通知、保证金、理财
												currtype_name: details.currtypename ? details.currtypename.display || details.currtypename.value : '', //币种pk
												// orgid: '111' //组织pk
											}}
										/>
									:
										<span>
											{
												transtype== 0 ?
													(details.recaccnum ? details.recaccnum.display || details.recaccnum.value : '')
												:
													(details.payaccnum ? details.payaccnum.display || details.payaccnum.value : '')
											}
										</span>	
								}
							</span>
						</li>
						<li className='settle-deetail-background'>
							<span className={`settlement-label ${((settlestatus== 0 || settlestatus== 2) && transtype== 0 && type=== 'edit' && (isnetbank== 0)) ? 'isRequire' : ''}`}>{transtype!= 0 ? '对方账户:' : '本方账户:'}</span>
							<span className='settlement-value'>
								{
									((settlestatus== 0 || settlestatus== 2) && transtype== 0 && type=== 'edit') ? 
										<Refer
											className='w240'
											placeholder={transtype!= 0 ? '对方账户' : '本方账户'}
											ctx={'/uitemplate_web'}
											refModelUrl={'/bd/bankaccbasRef/'}
											refCode={'bankaccbasRef'}
											refName={'银行账户'}
											value={
												transtype== 0 ?
													{refpk: referCode, refname: details.payaccnum ? details.payaccnum.display || details.payaccnum.value : ''}
												:
													{refpk: referCode, refname: details.recaccnum ? details.recaccnum.display || details.recaccnum.value : ''}
											}    
											onChange={item => {
												let isEmpty= JSON.stringify(item)=== '{}';
												let num= transtype!= 0 ? 'recaccnum' : 'payaccnum';
												let name= transtype!= 0 ? 'recaccname' : 'payaccname';
												this.changeVal(num, isEmpty ? '' : item.refcode, name, isEmpty ? '' : item.refname);
											}}
											multiLevelMenu={[
												{
													name: ['子户编码', '子户名称'],
													code: ['refcode', 'refname']
												}
											]}
											referFilter={{
												// accounttype: 0, //01234对应活期、定期、通知、保证金、理财
												currtype_name: details.currtypename ? details.currtypename.display || details.currtypename.value : '', //币种pk
												// orgid: '111' //组织pk
											}}
										/>
									:
									<span>
										{
											transtype== 0 ?
												(details.payaccnum ? details.payaccnum.display || details.payaccnum.value : '')
											:
												(details.recaccnum ? details.recaccnum.display || details.recaccnum.value : '')
										}
									</span>	
								}
							</span>
						</li>
						<li className='settle-deetail-background'>
							<span className={`settlement-label ${((settlestatus== 0 || settlestatus== 2) && transtype!= 0 && type=== 'edit' && (isnetbank== 0)) ? 'isRequire' : ''}`}>{transtype== 0 ? '对方户名:' : '本方户名:'}</span>
							<span className='settlement-value'>
								{
									((settlestatus== 0 || settlestatus== 2) && transtype!= 0 && type=== 'edit') ? 
										<FormControl 
											className='w240 input-box'
											readOnly  
											placeholder={transtype== 0 ? '请输入对方户名' : '请输入本方户名'}
											value={
												transtype== 0 ?
													(details.recaccname ? details.recaccname.display || details.recaccname.value : '')
												:
													(details.payaccname ? details.payaccname.display || details.payaccname.value : '')
											}
										/>
									:
										<span>
											{
												transtype== 0 ?
													(details.recaccname ? details.recaccname.display || details.recaccname.value : '')
												:
													(details.payaccname ? details.payaccname.display || details.payaccname.value : '')
											}
										</span>		
								}
							</span>
						</li>
						<li className='settle-deetail-background'>
							<span className={`settlement-label ${((settlestatus== 0 || settlestatus== 2) && transtype== 0 && type=== 'edit' && (isnetbank== 0)) ? 'isRequire' : ''}`}>{transtype!= 0 ? '对方户名:' : '本方户名:'}</span>
							<span className='settlement-value'>
								{
									((settlestatus== 0 || settlestatus== 2) && transtype== 0 && type=== 'edit') ? 
										<FormControl 
											className='w240 input-box' 
											readOnly 
											placeholder={transtype!= 0 ? '请输入对方户名' : '请输入本方户名'}
											value={
												transtype== 0 ?
													(details.payaccname ? details.payaccname.display || details.payaccname.value : '')
												:
													(details.recaccname ? details.recaccname.display || details.recaccname.value : '')
											} 
										/>
									:
										<span>
											{
												transtype== 0 ?
													(details.payaccname ? details.payaccname.display || details.payaccname.value : '')
												:
													(details.recaccname ? details.recaccname.display || details.recaccname.value : '')
											}
										</span>	
								}
							</span>
						</li>
						<li>
							<span className='settlement-label'>摘要:</span>
							<span className={`settlement-value ${((settlestatus== 0 || settlestatus== 2) && type=== 'edit') ? 'pl' : ''}`}>
								{
									((settlestatus== 0 || settlestatus== 2) && type=== 'edit') ? 
										<FormControl  
											className='w240 input-box' 
											placeholder="请输入摘要" 
											value={details.memo ? details.memo.display || details.memo.value : ''} 
											onChange={(e) => {this.changeVal('memo', e.target.value);}}/>
									:
										<span>{details.memo ? details.memo.display || details.memo.value : ''}</span>	
								}
							</span>
						</li>
						<li>
							<span className='settlement-label'>用途:</span>
							<span className={`settlement-value ${((settlestatus== 0 || settlestatus== 2) && type=== 'edit') ? 'pl' : ''}`}>
								{
									((settlestatus== 0 || settlestatus== 2) && type=== 'edit') ? 
										<FormControl  
											className='w240 input-box' 
											placeholder="请输入用途"
											value={details.nusage ? details.nusage.display || details.nusage.value : ''} 
											onChange={(e) => {this.changeVal('nusage', e.target.value);}}/>
									:
										<span>{details.nusage ? details.nusage.display || details.nusage.value : ''}</span>	
								}
							</span>
						</li>
						<li>
							<span className='settlement-label'>系统来源：</span>
							<span className='settlement-value'>{srcsystemName || ''}</span>
						</li>
						<li>
							<span className='settlement-label'>交易日期：</span>
							<span className='settlement-value'>{details.settledate ? details.settledate.display || details.settledate.value: ''}</span>
						</li>
						<li>
							<span className='settlement-label'>结算状态：</span>
							<span className='settlement-value'>{statusName}</span>
						</li>
						<li>
							<span className='settlement-label'>审批状态：</span>
							<span className='settlement-value'>{vbillstatusName}</span>
						</li>
					</ul>
				</div>
				<MsgModal
					show={MsgModalShow}
					title={detailOpertion[currentKey].title}
					content={detailOpertion[currentKey].content || onpayContent}
					icon='icon-tishianniutixing'
					onConfirm={() => {
						this.setButtonsOperation(detailOpertion[currentKey].path, detailOpertion[currentKey].msg);
					}}
					onCancel={() => {
						this.setState({MsgModalShow: false});
					}}
				/>
				<MsgContentModal 
					show={msgContentShow}
					title={currentKey=== 2 ? '手工确认' : '作废'}
					maxLength={100}
					labelName={currentKey=== 2 ? '确认意见' : '作废意见'}
					placeholder= {currentKey=== 2 ? '请输入确认意见' : '请输入作废意见'}
					confirmText={currentKey=== 2 ? '结算成功' : '确定'}
					cancelText={currentKey=== 2 ? '结算失败' : '取消'}
					onConfirm={(val) => {
						if (!val) {
							toast({color: 'danger', content: currentKey=== 2 ? '请输入结算成功意见' : '请输入作废意见'});
							return;
						}
						if (currentKey=== 2) {
							details.settlestatus.display= 3;
							details.settlestatus.value= 3;
							details.confirinfo.display= val;
							details.confirinfo.value= val;
							this.setButtonsOperation('handconfirm', '手工确认完成');
						} else {
							details.disablereason.display= val;
							details.disablereason.value= val;
							this.setButtonsOperation('disable', '作废成功');
						}
					}}
					onCancel={(bool, val) =>{
						if (!bool && currentKey=== 2) {
							if (!val) {
								toast({color: 'danger', content: '请输入结算失败意见'});
								return;
							}
							details.settlestatus.display= 2;
							details.settlestatus.value= 2;
							details.confirinfo.display= val;
							details.confirinfo.value= val;
							this.setButtonsOperation('handconfirm', '手工确认完成');
						} else {
							this.setState({
								msgContentShow: false
							});
						}
					}}
				/>
			</div>
		);
	}
}
