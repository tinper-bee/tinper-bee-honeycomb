import React, { Component } from 'react';
import { Icon } from 'tinper-bee';
import PropTypes from 'prop-types';
import './index.less';

const contextTypes = {
    radiosGroup: PropTypes.object
}

class Radios extends Component {
	static defaultProps = {
		disabled: false,
		name: 'hahaha'
	};
	
	constructor(props, context) {
		super(props, context);
	}

	render() {
		let { radioClass, value, disabled, children, ...others }= this.props;
		const { selectedVal, name, onSelect } = this.context.radiosGroup;
		
		let iconClass= 'icon-danxuan-moren';
		if (selectedVal=== value && disabled) {
			iconClass= 'icon-danxuan-jinyongyixuanze';
		} else if (selectedVal=== value && !disabled) {
			iconClass= 'icon-danxuan-xuanzhong';
		} else if (selectedVal!== value && disabled) {
			iconClass= 'icon-danxuan-jinyong';
		}

        return <label className={radioClass ? `${radioClass} radios-input` : 'radios-input'} >
			<input 
				type="radio"
				{...others}
				value={value}
				name={name} 
				checked={selectedVal=== value && !disabled}
				disabled={disabled}
				onChange={() => {
					if (onSelect) {
						onSelect(value);
					}
				}}
			/>
			<Icon className={`iconfont ${iconClass}`}></Icon>
			{children &&
				<span className='radios-label'>{children}</span>
			}
		</label>
	}
}

Radios.contextTypes = contextTypes;
export default Radios;