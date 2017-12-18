import React , { Component } from 'react';
// import FormControl from 'bee-form-control';
import {FormControl} from 'tinper-bee';
import classnames from 'classnames'
import './inputItem.less';


const ICON = {
	percent: '%',
	money: '￥',
	default: ''
}

const intReg = /^[1-9]\d*|0$/;

let beforeData = ''; // 为了保证不间断

export default class InputItem extends Component {
	// 业务需要  百分比要求 0 - 100  float   数字 大于等于0 两位有效数字  
	constructor(props) {
	    super(props);
	    this.state = {
	    	value: props.value || 0,
	    	scale: (props.scale && props.scale >= 0) ? props.scale : 2
		};
		this.result;	   
	}

	handleChange = (used, max, value) => {
		const {onChange} = this.props;
		value = this.checkRate(value.target.value, used, max);
		if(this.result && !!value){
			value = this.result;
		}
		onChange && onChange(value)
	}
	handleBlur=(e)=>{
		const {onChange} = this.props;
		let value = e.target.value.toString().replace(/\$|\,/g,'');
		if(!!value){
			value = (+ value).toFixed(this.state.scale);
			let result = `${ e.target.value.split('.')[0]}.${value.split('.')[1]}`
			onChange && onChange(result)
		}
	}

	componentWillReceiveProps(nextProp) {
		if (nextProp.value !== this.state.value) {
			this.setState({
				value: nextProp.value,
			});
		}
	}

	// 输入数字 用于金额  两位有效数字 
	// 中文"."可输入,千分位
	checkRate = (rate, used, max) => {
		if(!rate) {
			rate = '';
			return rate;
		}		
		rate = rate.toString().replace(/\$|\,/g,'');
		if (isNaN(rate)) {
			rate = beforeData;
		} else if (used == 'percent' && (rate > 100 || rate < 0)) {
			rate = beforeData;
		}else if(used == 'money' && (rate > max)) {
			rate = beforeData;
		}else{
			if (this.rateInputCtr(rate, this.state.scale)) {
				beforeData = rate;
			} else {
				rate = beforeData;
			}
		}
		return rate;
	};
	
	//输入与精度
	rateInputCtr = (rate, precision) => {
		let strmny = rate;
		let digit = parseInt(precision, 10);
		//含有小数
		if (strmny.indexOf('.') != -1) {
			let strPart = strmny.split('.');
			//整数部分
			if (!intReg.test(strPart[0])) {
				return false;
			}else{//千分位
				let re=/(-?\d+)(\d{3})/;  
				while(re.test(strPart[0])){  
					strPart[0]=strPart[0].replace(re,"$1,$2")  
				}
			}
			const potReg = new RegExp('^\\d{0,' + digit + '}$');
			//小数部分
			if (!(potReg.test(strPart[1]) && strPart[1].length <= digit)) {
				return false;
			}
			this.result=`${strPart[0]}.${strPart[1]}`;
		}
		//不含小数	
		else { 
			if (!intReg.test(strmny)) {
				return false;
			}else{//千分位
				let re=/(-?\d+)(\d{3})/;  
				while(re.test(strmny)){  
					strmny=strmny.replace(re,"$1,$2")  
				} 
				this.result= strmny;
			}
		}		
		return true;
	};

	render() {
		/**
		 * 备注：pos 为图标的位置（left/right）, 默认右边
		 *       used 为百分比'percent' 和 金额（人民币）'money' , (默认为百分比)
		 *       scale 图标所占的位置宽度，默认为30个宽度  （数字）
		 *       icon  true/false 是否显示图标 是对default 不显示图标的补充
		 *       className 可以加入自定义的class类名
		 */
		
		  
		let {value} = this.state;
		let {pos = 'right', used = 'percent', className = '', padd = 10, icon = false, max, ...attrs} = this.props;
		max = +max || Infinity
		const wrapsClass = classnames({
	    	'input-wraps': true,
	    	[className]: true
	    });	
	    
	    let posStyle = (pos == 'right') ? {right: parseInt(padd/2 - 7, 10)} : {left: parseInt(padd/2 - 7, 10)}

		return (
			<div className={wrapsClass}>
				<FormControl 
					value={value} 
					{...attrs}
					style={{paddingLeft: pos == 'right' ? '10px': `${padd}px`,
						paddingRight: pos == 'right' ? `${padd}px`: '10px'}}
					onChange={this.handleChange.bind(this, used, max)} 
					onBlur={this.handleBlur}						
					className={className} />
				<i className="input-icon" style={posStyle}>{icon ? ICON[used] : ICON['default']}</i>
			</div>)		
	}

}