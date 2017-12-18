import React, { Component } from 'react';
import heyue from '../../../../static/images/heyue.jpg';
import {Link, hashHistory} from 'react-router';

export default class Zanheyue extends Component {
	constructor(){
    	super();

    	this.state = {
    	}

	}

	render () {	

		return (
			<div>
				<Link to={'/fm/heyueshow'}  className="u-button u-button-info u-button-border">预览</Link>
				<Link to={'/fm/heyueadd'}  className="u-button u-button-info u-button-border">新增</Link>
				<div style={{display: 'flex',justifyContent:'center',alignItems: 'center',width: '90%'}}>
						
					<img src={heyue} alt="" style={{width: '100%'}}/>
				</div>	
			</div>
					    
		);
	}
}


