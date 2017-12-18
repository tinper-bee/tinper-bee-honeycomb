/**
 * 融资申请
 * yanggqm
 * 2017/11/20
 * 注意：
 * 		1、表单中数字 传给后台是数字 返回是字符串
 * 		2、起始日期是今日 结束日期为空
 * 		3、单位银行账户 限制条件为：组织id、币种、活期
 */

// react组件
import React, { Component } from 'react';
import {Link, hashHistory} from 'react-router';

// iuap 组件
import { 
	Row, 
	Col, 	
	Label,
	Radio,
	Icon,
	Button,
	Timeline,
	Step,
	Select,
	Popconfirm,
	Modal
} from 'tinper-bee';
import Affix from 'bee-affix';
import Form from 'bee-form';
import Switch from 'bee-switch';
import DatePicker from 'bee-datepicker';
import FormControl from 'bee-form-control';
import Table from 'bee-table';
import Loading from "bee-loading";
import zhCN from 'rc-calendar/lib/locale/zh_CN';

// 第三方公共库或者工具
import classNames from 'classnames';
import moment from 'moment';
import axios from "axios";
import jump from 'jump.js';

// 全局公共utils方法
import deepClone from 'utils/deepClone.js';
import {toast} from 'utils/utils';

// 自定义组件
import ReferItem from './ReferItem.js';
import Refer from 'containers/Refer';
import InputItem from './InputItem.js';
import TextareaItem from './TextareaItem';
import LightTabs from './LightTabs';
import BreadCrumbs from 'containers/BreadCrumbs';
import TmcUploader from 'containers/TmcUploader';
import DeleteModal from 'containers/DeleteModal';

// 样式类
import './index.less';
import 'bee-form/build/Form.css';

const CONFIG = {
	// 锚节点
	ANCHOR : {
		values: ['申请信息', '其他信息'], // 锚节点的引导文字
		width: 98 // 锚节点tab的宽度
	},
	// 滚动条滚动设置
	JUMP_CONFIG : {
		offset: 60, // 60为悬浮高度
		duration: 300 // 滚动duration配置
	}
}

// 定义类 ApplyCard
export default class Test2 extends Component {
	constructor(){
    	super();

    	this.state = {
    		chooseIndex: 0,
    	}
    	
    }

	render () {
		let {} = this.state;
	   
		return (
			<div>				
		    	<section className="financeApp-form">
		    		<Affix>
			    		<h3 className="financeApp-title">
			    			<span className="financeApp-title-item title">贷款申请</span>
			    			<ul className="financeApp-tab cf" onClick={this.scrollToDis}>
			    				{
			    					CONFIG.ANCHOR.values.map((item, index) => {
			    						return (<li className={index == this.state.chooseIndex? 'active' : ''}>{item}</li>)
			    					})
			    				}
			    				<li className="scrollBar tabs-nav-animated" ></li>
			    			</ul>
			    			<div className="financeApp-title-item title">&nbsp;</div>			    			
			    		</h3>
		    		</Affix>

		    		<section  className="financeApp-info" >
		    			<ul className="financeApp-info-section"  ref="anchor1">
		    				<li className="financeApp-info-title blockClass">申请信息</li>
			                <li style={{height: 700, width: '100%', textAlign: 'center'}}> 区域1</li>
		                </ul>		                
		                <ul className="financeApp-info-section"  ref="anchor2">
		                	<li className="financeApp-info-title blockClass other-info" >其他信息</li>
		                	<li style={{height: 600, width: '100%', textAlign: 'center'}}>区域2</li>
		                </ul>
		                <ul className="financeApp-info-section"  ref="anchor3">
		                	<li className="financeApp-info-title blockClass other-info" >第三信息</li>
		                	<li style={{height: 1200, width: '100%', textAlign: 'center'}}>区域3</li>
		                </ul>
		    		</section>
		    	</section>
			</div>			    
		);
	}
}



