import React, { Component } from 'react';
import { FormControl } from 'tinper-bee';

export default class InputItem extends Component {
	state = {
		value: this.props.defaultValue ,
		defaultValue: this.props.defaultValue
	}

	handleChange = (e) => {
		const { onChange, processChange  } = this.props;
		let value = e.target.value;

		if (processChange ) {
			value = processChange(this.state, value);
		}
	
		this.setState({
			value: value
		});

		if (onChange) {
			onChange(value);
		}
	}
	
	componentWillReceiveProps(nextProp) {
		if (nextProp.defaultValue !== this.state.defaultValue ) {
			this.setState({
				value: nextProp.defaultValue,
				defaultValue: nextProp.defaultValue
			});
		}
	}

	render() {

		const { defaultValue, type, isViewMode, onChange, value, ...others} = this.props;

		return (isViewMode ?  <span style={{ lineHeight: 2.1 }} value={this.state.value} > { defaultValue }</span> :
			 <FormControl autocomplete="off"   { ...others } value={ this.state.value }  onChange={ this.handleChange }   /> )
	}
}