import React, { Component } from 'react';
// import { FormControl } from 'tinper-bee';
import moment from 'moment';
import DatePicker from 'bee-datepicker';

export default class DateTimePickerItem extends Component {
	state = {
		defaultValue: this.props.defaultValue,
		// value: this.props.defaultValue || moment()
		value: this.props.defaultValue 

	}


	handleChange = (e) => {
		
		const { onChange, format } = this.props;
		this.state.value = e;
		
		if (onChange) {
			onChange( e.format(format) );
		}
	}

	componentWillReceiveProps(nextProp) {
		if (nextProp.defaultValue != this.state.defaultValue) {
			this.setState({ 
				defaultValue: nextProp.defaultValue, 
				value: nextProp.defaultValue
			});
		}
	}


	render() {

		const { defaultValue,  ...others} = this.props;

		// defaultValue={ defaultValue }
		// return <FormControl value={ this.state.value } onChange={this.handleChange}  />
		return <DatePicker {...others}    value={ this.state.value }  onChange={this.handleChange} />
	}
}