import React, { Component } from 'react';
import chengben from '../../../../static/images/chengben.png';

export default class Zanchengben extends Component {
	constructor(){
    	super();

    	this.state = {
    	}

	}

	render () {	

		return (
			<div style={{display: 'flex',justifyContent:'center',alignItems: 'center'}}>	
				<img src={chengben} alt="" />
			</div>			    
		);
	}
}


