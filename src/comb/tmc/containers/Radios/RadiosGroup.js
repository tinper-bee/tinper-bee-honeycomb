import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

const childContextTypes = {
	radiosGroup: PropTypes.object
}

class RadiosGroup extends Component {
	constructor(props, context) {
		super(props, context);
	}

	getChildContext() {
		const {selectedVal, onSelect, name} = this.props;
		return {
			radiosGroup: {
				selectedVal, 
				onSelect,
				name
			}
		}
	}

	render () {
		const {name, selectedVal, children, radioGroupClass, ...others} = this.props;
		
		return (
			<div 
				className={radioGroupClass ? `${radioGroupClass} zijinyun-radios` : 'zijinyun-radios'} 
				{...others}
			>
				{
					Children.map(children, function (child) {
						return React.cloneElement(child, {
							name
						})
					})
				}
			</div>
		 );
	}
}

RadiosGroup.childContextTypes = childContextTypes;
export default RadiosGroup;
