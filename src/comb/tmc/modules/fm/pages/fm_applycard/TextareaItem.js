import React , { Component } from 'react';
import PropTypes from  'prop-types';
import classnames from 'classnames'
import './textarea.less';

export default class TextareaItem extends Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	value: props.value || "",
	    	cur: (props.value && props.value.length) || 0
	    };
	}	

	componentWillReceiveProps(nextProp) {
	    if(nextProp.value !== this.state.value) {
	    	let cur = (nextProp.value && nextProp.value.length) || 0
	    	this.setState({value: nextProp.value,cur});
	    }
	}

	handleChange = (e) => {
	    let value = e.target.value;
	    let lens = value.toString().length;
	    let maxLen = this.props.max ?  this.props.max : (this.props.count || 200)
	    if(maxLen && lens > maxLen && this.props.count >= 0) {	
	    	value = value.slice(0, maxLen - 1)
	    }
	    const {onChange} = this.props;
	    this.setState({
	        value,
	        cur: lens
	    });

	    onChange && onChange(value)
	}

	render() {
		let {max, count, ...attrs} = this.props;
		max = max ? max : (count || 200);
		let {cur, value} = this.state;
		const countClass = classnames({
	    	'text-count': true,
	    	'isCount': count >= 0 && !!count,
	    });	

		return (
			<div className="textarea-wrap">
				<textarea 
					maxlength={max}
					value={value}
					{...attrs}					
					onChange={ this.handleChange }>
				{this.state.value}
				</textarea>
				<div className={countClass}>
					<span>{cur || 0}</span>
					<span>/{max}</span>
				</div>
			</div>)
	}

}

TextareaItem.propTypes = {
	count: PropTypes.number
}