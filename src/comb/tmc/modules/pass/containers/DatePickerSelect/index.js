import React, { Component } from 'react';
import DatePicker from 'bee-datepicker';
import {Icon} from 'tinper-bee';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import './index.less';
const format = 'YYYY-MM-DD';

export default class DatePickerSelect extends Component {
	static defaultProps = {
		format: format,
        locale: zhCN,
        placeholder: '选择日期'
    };
    
    constructor() {
		super();
	}

	render() {
        const { value, onSelect,  ...others} = this.props;
        
		return <div className='date-picker-select'>
            <Icon className='iconfont icon-rili'></Icon>
            <DatePicker 
                {...others}    
                value={value}  
                onChange={this.props.onChange}
            />
        </div>    
	}
}