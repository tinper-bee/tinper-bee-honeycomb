import React, { Component } from 'react';
import Popover from 'bee-popover';
import 'bee-popover/build/Popover.css';

export default class RealBalance extends Component {
	static defaultProps = {
		placement: 'right'
	};

	constructor(props) {
		super(props);
	}
	
	render() {
		let { onSelect, content, placement, isShow, btnContent, id}= this.props;
        return <Popover 
			placement={placement}
            content={content}
            show={isShow}
            className="pop-balance"
		>
			<span
				id={`view-money${id}`}
                onClick={onSelect}
            >{btnContent}</span>	
		</Popover>
	}
}
