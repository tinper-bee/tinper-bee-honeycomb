import React, { Component } from 'react';
import wuquanadd from '../../../../static/images/wuquanadd.jpg';
import {Link, hashHistory} from 'react-router';
import { Button} from 'tinper-bee';

export default class Zanwuquanadd extends Component {
	constructor(){
    	super();

    	this.state = {
    	}

	}

	render () {	

		return (

			<div style={{display: 'flex',justifyContent:'center',alignItems: 'center',width: '90%'}}>
				<img src={wuquanadd} alt="" style={{width: '100%'}}/>
			</div>			    
		);
	}
}


