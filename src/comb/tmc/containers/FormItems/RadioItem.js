import React, { Component } from 'react';
import { Radio } from 'tinper-bee';


export default class RadioItem extends Component {

	state = { 
		items: this.props.items(), 
		defaultValue: this.props.defaultValue,
		value: this.props.defaultValue
	}


	handleChange = value => {
		this.setState({
			value: value
		});
		this.props.onChange(value);
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
		let {value, ...others } = this.props;

		return <Radio.RadioGroup {...others}
					selectedValue={ this.state.value }
					onChange={ this.handleChange } >
				{ items.map((item, i) => <Radio color="info" disabled={!!item.disabled} value={item.value} key={i} >{item.label}</Radio>) }
			</Radio.RadioGroup>
			
	}

}