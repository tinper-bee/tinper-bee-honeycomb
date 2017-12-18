import React, { Component } from 'react';
import heyueadd from '../../../../static/images/heyueadd.jpg';

export default class Zanheyueadd extends Component {
	constructor(){
    	super();

    	this.state = {
    	}

	}

	render () {	

		return (
			<div style={{display: 'flex',justifyContent:'center',alignItems: 'center',width: '90%'}}>
				<img src={heyueadd} alt="" style={{width: '100%'}}/>
			</div>			    
		);
	}
}


