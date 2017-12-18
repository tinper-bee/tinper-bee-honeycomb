import React, { Component } from 'react';
import { Icon } from 'tinper-bee';
import './index.less';

export default class CheckBox extends Component {
	static defaultProps = {
		disabled: false,
		checked: false,
		indeterminate: false,
		isMarginRight: true
	};
	
	constructor(props) {
		super(props);
	}

	render() {
		let { checkBoxClass, disabled, checked, children, onSelect, indeterminate, isMarginRight, ...others }= this.props;
        let iconClass= 'icon-fuxuan-moren';
		if (checked && disabled) {
			iconClass= 'icon-fuxuan-jinyongyixuanze';
		} else if (checked && !disabled) {
			iconClass= 'icon-yixuanzhongxiang';
		} else if (indeterminate && !checked) {
			iconClass= 'icon-fuxuanweiquanxuanxiang';
        } else if (!checked && disabled) {
			iconClass= 'icon-fuxuan-jinyong';
        }
        
        return <label 
			className={checkBoxClass ? `${checkBoxClass} checkbox-input` : 'checkbox-input'} 
			style={{marginRight: isMarginRight ? 20 : 0}} 
		>
			<input
				{...others} 
				type="checkbox" 
				disabled={disabled}
				checked={checked}
				onChange={(e) => {onSelect(e.target.checked);}}
			/>
			<Icon className={`iconfont ${iconClass}`}></Icon>
			{children &&
				<span className='checkbox-label'>{children}</span>
			}
		</label>
	}
}
