import React, { Component } from 'react';
import Refer from '../Refer';

export default class ReferItem extends Component {
	state = {
		value: this.props.defaultValue || {},
		disabled: this.props.disabled,
		defaultValue: this.props.defaultValue || {}
	}


	handleChange = (value) => {
		// this.setState({
		// 	value: value
		// });
		this.props.onChange(value);
	}

	componentWillReceiveProps(nextProp) {

		// if (nextProp.defaultValue.refpk != this.state.defaultValue.refpk ) {
		// 	console.log('Refer=> update');
		// 	this.setState({
		// 		defaultValue: nextProp.defaultValue,
		// 		value: nextProp.defaultValue,
		// 		disabled: nextProp.disabled,
		// 		clientParam: nextProp.clientParam
		// 	});
		// }


/*		if (nextProp.clitentParam && (nextProp.clientParam.parentid != this.state.clientParam.parentid)) {
			this.setState({
				defaultValue: nextProp.defaultValue,
				value: nextProp.defaultValue,
				disabled: nextProp.disabled,
				clientParam: nextProp.clientParam
			});
		}*/
		// if (nextProp.disabled != this.state.disabled) {
		// 	this.setState({
		// 		defaultValue: nextProp.defaultValue,
		// 		value: nextProp.defaultValue,
		// 		disabled: nextProp.disabled,
		// 		clientParam: nextProp.clientParam
		// 	});
		// }
	}



	render() {

		let { name, disabled, value, ...others } = this.props;

		// let curValue = {};

		// value={ this.state.value }


		return  <Refer     { ...others } value={ value }
						disabled={!!disabled}
                    	onChange={ this.handleChange } />
	}

}