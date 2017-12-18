import React , { Component } from 'react';
import InputNumber from 'bee-input-number';

export default class InputNumItem extends Component {
	
	constructor(props) {
	    super(props);
	    this.state = {
	    	value: this.props.defaultVal || 0
	    };	   
	}

	handleChange = (value) => {
		value = +value
		this.props.onChange && this.props.onChange(value);
		this.setState({
            value
        })
	}

	render() {
		return (
			<InputNumber 
				value={this.state.value} 
				onChange={ this.handleChange }  
				precision={2} min={0} 
				className={this.props.className} />
		)		
	}

}