import React, { Component } from 'react';
import Select from 'bee-select';
const Option = Select.Option;

export default class SelectItem extends Component {

	state = { 
		items: this.props.items(),
		defaultValue: this.props.defaultValue,
		value: this.props.defaultValue
	}

	handleChange = value => {
		const { onChange } = this.props;
		this.setState({
			value: value
		});
		if (onChange) {
			onChange(value);
		}

	}

	componentWillReceiveProps(nextProp) {
		if (nextProp.defaultValue !== this.state.defaultValue) {
			this.setState({ 
				items: nextProp.items(),
				defaultValue: nextProp.defaultValue, 
				value: nextProp.defaultValue
			});
		}
	}


	render() {

		let { items }  = this.state;
		let { value, defaultValue,  ...others } = this.props;

		return  <Select   {...others} value={ this.state.value } onChange={ this.handleChange } >
					{ items.map((item, i) => <Option value={item.value}  key={i} > {item.label} </Option>) }
                </Select>

	}

}