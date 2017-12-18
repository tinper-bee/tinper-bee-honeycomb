import React, { Component } from 'react';
import heyueshow from '../../../../static/images/heyueshow.jpg';

export default class Zanheyueshow extends Component {
	constructor(){
    	super();

    	this.state = {
    	}

	}

	render () {	

		return (
			<div style={{display: 'flex',justifyContent:'center',alignItems: 'center',width: '90%'}}>
				<img src={heyueshow} alt="" style={{width: '100%'}}/>
			</div>			    
		);
	}
}


