import React, { Component } from 'react';
import wuquanedit from '../../../../static/images/wuquanedit.jpg';
import {Link, hashHistory} from 'react-router';
import { Button} from 'tinper-bee';

export default class Zanwuquanedit extends Component {
	constructor(){
    	super();

    	this.state = {
    	}

	}

	render () {	

		return (

			<div style={{display: 'flex',justifyContent:'center',alignItems: 'center',width: '90%'}}>
				
				<img src={wuquanedit} alt="" style={{width: '100%'}}/>
			</div>			    
		);
	}
}


