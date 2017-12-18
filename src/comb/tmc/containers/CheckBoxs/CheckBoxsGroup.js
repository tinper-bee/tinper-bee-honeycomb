import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';

const childContextTypes = {
	checkBoxsGroup: PropTypes.object
}

class CheckBoxsGroup extends Component {
	static defaultProps = {
		selectedArray: [],
		param: 'value'
	};

	constructor(props, context) {
		super(props, context);
	}

	getChildContext() {
		const {selectedArray, onSelect, param} = this.props;
		
		return {
			checkBoxsGroup: {
				selectedArray, 
				onSelect,
				param
			}
		}
	}

	render () {
		const {selectedArray, children, boxsGroupClass, ...others} = this.props;
		
		return (
			<div 
				className={boxsGroupClass ? `${boxsGroupClass} zijinyun-checkbox` : 'zijinyun-checkbox'} 
				{...others}
			>
				{
					Children.map(children, (child, keys) => {
						return React.cloneElement(child, {
							keys
						})
					})
				}
			</div>
		 );
	}
}

CheckBoxsGroup.childContextTypes = childContextTypes;
export default CheckBoxsGroup;
