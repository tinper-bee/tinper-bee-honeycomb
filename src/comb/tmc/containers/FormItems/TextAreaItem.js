import React , { Component } from 'react';
import PropTypes from  'prop-types';
import classnames from 'classnames'
import './textarea.less';

export default class TextareaItem extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	defaultValue: props.defaultValue || "",
	    	value: props.defaultValue || "" ,
	    	cur: 0
	    };
	}	

	componentWillReceiveProps(nextProp) {
		// console.log('componentWillReceiveProps', nextProp, this.state);
	    if(nextProp.defaultValue !== this.state.defaultValue) {
	    	this.setState((pre) => {
	    		return {
	    			...pre,
	    			defaultValue: nextProp.defaultValue,
	    			value: nextProp.defaultValue
	    		};
	    	})
	    	// this.setState({value: nextProp.value});
	    }
	}

	handleChange = (e) => {

	    let value = e.target.value;
	    let lens = value.toString().length;
	    const {max, count, onChange} = this.props;
	    let maxLen = max || count || 200;
	    if(maxLen && lens > maxLen && count >= 0) {	
	    	value = value.slice(0, maxLen - 1)
	    }

	    // console.log(value, 'values');
	    this.state.value = value;
	    onChange && onChange(value)

	    this.setState({
	        value,
	        cur: lens
	    });

	}

	render() {
		let {max, count, value, ...attrs} = this.props;
		let {cur} = this.state;	
		// max = max ? max : (count || 200);
		max = max || count || 200;
		const countClass = classnames({
	    	'text-count': true,
	    	'isCount': count >= 0 && !!count
	    });	
	    // console.log('this.state', this.state);

		return (
			<div className="textarea-wrap">
				<textarea 
					maxlength={max}
					value={this.state.value}
					{...attrs}					
					onChange={ this.handleChange }>
				{this.state.value}
				</textarea>
				<div className={countClass}>
					<span>{cur}</span>
					<span>/{max}</span>
				</div>
			</div>)
	}

}

TextareaItem.propTypes = {
	count: PropTypes.number
}