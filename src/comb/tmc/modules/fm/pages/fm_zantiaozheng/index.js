import React, { Component } from 'react';
import tiaozheng from '../../../../static/images/tiaozheng.png';

export default class Zantiaozheng extends Component {
	constructor(){
    	super();

    	this.state = {
    	}

	}

	render () {	

		return (
			<div style={{display: 'flex',justifyContent:'center',alignItems: 'center'}}>
				<img src={tiaozheng} alt="" />
			</div>			    
		);
	}
}


