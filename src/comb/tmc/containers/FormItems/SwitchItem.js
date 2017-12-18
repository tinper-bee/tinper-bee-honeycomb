import React, { Component } from 'react';
import Switch  from 'bee-switch';
import  'bee-switch/build/Switch.css';

export default class SwitchItem extends Component {
	state = {
		value: this.props.defaultValue,
		defaultValue: this.props.defaultValue
	}

	handleChange = (value) => {
		const { onChange } = this.props;
		this.setState																															({
			value: value
		});
		if (onChange) {
			onChange(value);
		}
	}



	componentWillReceiveProps(nextProp) {
		if (nextProp.defaultValue !== this.state.defaultValue) {
			this.setState({
				value: nextProp.defaultValue,																																																						
				defaultValue: nextProp.defaultValue
			});
		}
	}

	render() {

		const { defaultValue, onChange,  ...others} = this.props;

		return <Switch  { ...others }  checked={ this.state.value }  onChange={ this.handleChange } /> 
	}
}