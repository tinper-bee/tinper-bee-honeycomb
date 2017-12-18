import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'tinper-bee';
import './index.less';

const contextTypes = {
    checkBoxsGroup: PropTypes.object
}

class CheckBoxs extends Component {
	static defaultProps = {
		disabled: false
	};

	constructor(props, context) {
		super(props, context);
	}
	
	render() {
		let { checkBoxClass, disabled, value, children, keys }= this.props;
		const { selectedArray, onSelect, param } = this.context.checkBoxsGroup;
		const isCheck = () => {
			if (param=== 'bool') {
				return selectedArray[keys];
			} else if (param=== 'value') {
				return selectedArray[keys]=== value;
			} else if (param=== 'children') {
				return selectedArray[keys]== children;
			}
		};

		let iconClass= 'icon-fuxuan-moren';
		if (isCheck() && disabled) {
			iconClass= 'icon-fuxuan-jinyongyixuanze';
		} else if (isCheck() && !disabled) {
			iconClass= 'icon-fuxuan-xuanzhong';
		} else if (!isCheck() && disabled) {
			iconClass= 'icon-fuxuan-jinyong';
        }
        
        return <label className={checkBoxClass ? `${checkBoxClass} checkbox-input` : 'checkbox-input'} >
			<input 
				type="checkbox"
				value={value}
				checked={isCheck()}
				disabled={disabled}
				onChange={(e) => {
					if (param=== 'bool') {
						selectedArray[keys]= e.target.checked;
					} else if (param=== 'value') {
						selectedArray[keys]= e.target.checked ? value : null;	
					} else if (param=== 'children') {
						selectedArray[keys]= e.target.checked ? children : null;	
					}
					onSelect(selectedArray);
				}}
			/>
			<Icon className={`iconfont ${iconClass}`}></Icon>
			{children &&
				<span className='checkbox-label'>{children}</span>
			}
		</label>
	}
}

CheckBoxs.contextTypes = contextTypes;
export default CheckBoxs;