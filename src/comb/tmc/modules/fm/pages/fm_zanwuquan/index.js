import React, { Component } from 'react';
import wuquan from '../../../../static/images/wuquan.jpg';
import {Link, hashHistory} from 'react-router';
import { Button} from 'tinper-bee';

export default class Zanwuquan extends Component {
	constructor(){
    	super();

    	this.state = {
    	}

	}

	render () {	

		return (
			<div>
				<Link to={'/fm/wuquanshow'}  className="u-button u-button-info u-button-border">预览</Link>
				<Link to={'/fm/wuquanadd'}  className="u-button u-button-info u-button-border">新增</Link>
				<Link to={'/fm/wuquanedit'}  className="u-button u-button-info u-button-border">编辑</Link>
				<div style={{display: 'flex',justifyContent:'center',alignItems: 'center',width: '90%'}}>
						
					<img src={wuquan} alt="" style={{width: '100%'}}/>
				</div>	
			</div>	    
		);
	}
}


