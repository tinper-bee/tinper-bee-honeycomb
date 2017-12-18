import React, { Component } from 'react';
import { Icon } from 'tinper-bee';
import Tooltip from 'bee-tooltip';
import './index.less';

export default class Tips extends Component {
	static defaultProps = {
        placement: 'top',
        inverse: true,
        trigger: 'hover'
	};

	constructor(props) {
		super(props);
	}
	
	render() {
        let { icon, content, placement, inverse, class_name, trigger }= this.props;
        
        return <Tooltip 
            className= {`tool-tips ${class_name}`} 
			placement={placement} 
            overlay={content}
            inverse={inverse}
            trigger={trigger}
		>
            <Icon className={`iconfont ${icon}`} onClick={this.props.click}/>
		</Tooltip >
	}
}
