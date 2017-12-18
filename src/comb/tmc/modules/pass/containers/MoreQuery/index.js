import React, { Component } from 'react';
import { Button, Select, FormControl } from 'tinper-bee';
import {Refer} from '../index';
import HistoryInput from '../HistoryInput';
import './index.less';
import { numFormat, toast } from '../../../../utils/utils.js';
const Option= Select.Option;

export default class MoreQuery extends Component {
	constructor() {
		super();
		this.state = {
			moreMap: {},	//模糊查询关键字
			referCode: 111,
			srctradebigtypeId: ''
		};
	}

	componentWillReceiveProps (nextProps) {
        if (nextProps.isClearQuery!== this.props.isClearQuery) {
            this.setState({
				moreMap: {},
				referCode: ''
            });
        }
	}

	//校验金额是否为正数
	regMoney = (val, property) => {
		let {moreMap}= this.state;
		let reg= /^[0-9]*\.?[0-9]*$/;
		if (val && !reg.test(val)) {
			toast({content: '金额格式错误，只能输入数字', color: 'warning'});
			return ;
		}
		moreMap[property]= val;
		this.setState({moreMap});
	};

	render() {
		let {isShow, toTop} = this.props;
		let {moreMap, referCode, srctradebigtypeId}= this.state;
		return (
			<div 
				className= {isShow ? 'more-query show' : 'more-query'}
				style={{top: toTop}}
			>
				<ul className='more-query-list'>
					<li className='more-query-item query-refer'>
						<span className='query-label'>结算方式:</span>
						<Refer
							placeholder="结算方式"
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/balatypeRef/'}
							refCode={'balatypeRef'}
							refName={'结算方式'}
							value={{refpk: referCode, refname: moreMap.balatypename}}    
							onChange={item => {
								let isEmpty= JSON.stringify(item)=== '{}';
								moreMap.balatypename= isEmpty ? '' : item.refname;
								this.setState({moreMap, referCode: 111});
							}}
						/>
					</li>
					<li className='more-query-item'>
						<span className='query-label'>来源:</span>
						<Select 
							className='query-input w124' 
							placeholder='来源'
							value={moreMap.srcsystem}
							onChange= {val => {
								moreMap.srcsystem= val;
								this.setState({moreMap});
							}}
						>
							<Option value={'0'}>第三方系统</Option>	
							<Option value={'1'}>资金</Option>	
							<Option value={'2'}>到账</Option>
						</Select>
					</li>
					<li className='more-query-item'>
						<span className='query-label'>事件号:</span>
						<FormControl 
							className='query-input w124' 
							placeholder='请输入事件号'
							value={moreMap.eventno ? moreMap.eventno : ''}  
							onChange={e => {
								moreMap.eventno= e.target.value;
								this.setState({moreMap});
							}}
						/>
					</li>
					<li className='more-query-item query-refer'>
						<span className='query-label'>交易大类:</span>
						<Refer 
							placeholder="交易大类"
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/transtypeRef/'}
							refCode={'transtypeRef'}
							refName={'交易大类'}
							value={{refpk: referCode, refname: moreMap.srctradebigtype ? moreMap.srctradebigtype : ''}}  
							onChange={item => {
								let isEmpty= JSON.stringify(item)=== '{}';
								moreMap.srctradebigtype= isEmpty ? '' : item.refname;
								this.setState({
									moreMap, referCode: 111,
									srctradebigtypeId: item.id
								});
							}}
							clientParam={{
								maincategory: 1 //1234对应投资品种、融资品种、费用项目、银行交易项目
							}}
							multiLevelMenu={[
								{
									name: ['交易大类'],
									code: ['refname']
								}
							]}
						/>
					</li>
					<li className='more-query-item query-refer'>
						<span className='query-label'>交易类型:</span>
						<Refer 
							placeholder="交易类型"
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/transtypeRef/'}
							refCode={'transtypeRef'}
							refName={'交易类型'}
							value={{refpk: referCode, refname: moreMap.srctradetypename ? moreMap.srctradetypename : ''}}     
							onChange={item => {
								let isEmpty= JSON.stringify(item)=== '{}';
								moreMap.srctradetypename= isEmpty ? '' : item.refname;
								this.setState({moreMap, referCode: 111});
							}}
							clientParam={{
								parentid: srctradebigtypeId,
								detailcategory: '2',
								maincategory: 1 //1234对应投资品种、融资品种、费用项目、银行交易项目
							}}
							multiLevelMenu={[
								{
									name: ['交易类型'],
									code: ['refname']
								}
							]}
						/>
					</li>
					<li className='more-query-item query-refer'>
						<span className='query-label'>币种:</span>
						<Refer 
							placeholder="币种"
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/currencyRef/'}
							refCode={'currencyRef'}
							refName={'币种'}
							value={{refpk: referCode, refname: moreMap.currtypename ? moreMap.currtypename : ''}}  
							onChange={item => {
								let isEmpty= JSON.stringify(item)=== '{}';
								moreMap.currtypename= isEmpty ? '' : item.refname;
								this.setState({moreMap, referCode: 111});
							}}
						/>
					</li>
					<li className='more-query-item money'>
						<span className='query-label money'>金额:</span>
						<FormControl 
							className='query-input w124' 
							value={moreMap.moneybeg ? moreMap.moneybeg : ''}
							onChange={e => {this.regMoney(e.target.value, 'moneybeg');}}
						/><span style={{margin: '0 5px'}}>-</span><FormControl 
							className='query-input w124' 
							value={moreMap.moneyend ? moreMap.moneyend : ''}
							onChange={e => {this.regMoney(e.target.value, 'moneyend');}}
						/>
					</li>
					<li className='more-query-item payaccnum query-refer'>
						<span className='query-label'>本方账户:</span>
						<Refer 
							placeholder="本方账户"
							ctx={'/uitemplate_web'}
							refModelUrl={'/bd/bankaccbasRef/'}
							refCode={'bankaccbasRef'}
							refName={'银行账户'}
							multiLevelMenu={[
								{
									name: ['子户编码', '子户名称'],
									code: ['refcode', 'refname']
								}
							]}
							referFilter={{
								accounttype: 0, 
								orgid: '111' //组织pk
							}}
							value={{refpk: referCode, refname: moreMap.payaccnum ? moreMap.payaccnum : ''}}   
							onChange={item => {
								let isEmpty= JSON.stringify(item)=== '{}';
								moreMap.payaccnum= isEmpty ? '' : item.refcode;
								moreMap.payaccname= isEmpty ? '' : item.refname;
								this.setState({moreMap, referCode: 111});
							}}
						/>
					</li>
					<li className='more-query-item'>
						<span className='query-label'>对方账户:</span>
						<HistoryInput
							className='query-input query-updown'
							localType='recaccnum'
							placeholder='请输入对方账户'
							dropHeight={160}
							value={moreMap.recaccnum ? moreMap.recaccnum : ''}
							onChange={e => {
								moreMap.recaccnum= e.target.value;
								this.setState({moreMap});
							}}
							onSelect= {val => {
								moreMap.recaccnum= val;
								this.setState({moreMap});
							}}
						/>
					</li>
					<li className='more-query-item'>
						<span className='query-label'>本方户名:</span>
						<FormControl 
							className='query-input' 
							readOnly 
							placeholder="本方户名" 
							value={moreMap.payaccname ? moreMap.payaccname : ''}  
						/>
					</li>
					<li className='more-query-item'>
						<span className='query-label'>对方户名:</span>
						<HistoryInput
							className='query-input query-updown'
							localType='recaccname'
							placeholder='请输入对方户名'
							dropHeight={120}
							value={moreMap.recaccname ? moreMap.recaccname : ''}
							onChange={e => {
								moreMap.recaccname= e.target.value;
								this.setState({moreMap});
							}}
							onSelect= {val => {
								moreMap.recaccname= val;
								this.setState({moreMap});
							}}
						/>
					</li>
					<li className='more-query-item'>
						<span className='query-label'>摘要:</span>
						<FormControl 
							className='query-input w124' 
							placeholder="请输入摘要" 
							value={moreMap.memo ? moreMap.memo : ''}
							onChange={e => {
								moreMap.memo= e.target.value;
								this.setState({moreMap});
							}}
						/>
					</li>
					<li className='more-query-item'>
						<span className='query-label'>用途:</span>
						<FormControl 
							className='query-input w124' 
							placeholder="请输入用途" 
							value={moreMap.nusage ? moreMap.nusage : ''}
							onChange={e => {
								moreMap.nusage= e.target.value;
								this.setState({moreMap});
							}}
						/>
					</li>
				</ul>
                <div className='more-query-footer'>
					<Button
						className='more-query-confirm btn-2'
						onClick= {() => {
							let moreMaps= {};
							let len= 0;
							for (let key of Object.keys(moreMap)) {
								if ((moreMap[key] || moreMap[key]== '0') && key!== 'payaccname') {
									moreMaps[key]= moreMap[key];
									len++;
								}
							}
							if ((moreMaps.moneybeg || moreMaps.moneybeg== 0) && (moreMaps.moneyend || moreMaps.moneyend== 0) && (moreMaps.moneybeg - moreMaps.moneyend> 0)) {
								toast({color: 'warning', content: '起始金额不能大于截止金额'});
								return;
							}
							this.props.closeQuery(moreMaps, len, true);
						}}
					>确定</Button>
					<span
						className='zijinyun-reset query-reset'
						onClick= {() => {
							this.setState({
								moreMap: {},
								referCode: ''
							});
							this.props.closeQuery({}, 0, false);
						}}
					>重置</span>
				</div>
			</div>
		);
	}
}
