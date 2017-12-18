import React, { Component } from 'react';
import pass_search from '../../../../static/images/pass_search.jpg';

export default class Zanwuquanadd extends Component {
	constructor(){
    	super();
    	this.state = {
    	}
	}

	render () {	
		return (
			<div style={{display: 'flex',justifyContent:'center',alignItems: 'center',width: '100%'}}>
				<img src={pass_search} alt="" style={{width: '100%'}}/>
			</div>			    
		);
	}
}


