import React, { Component } from 'react';
import wuquanshow from '../../../../static/images/wuquanshow.jpg';
import {Link, hashHistory} from 'react-router';
import { Button} from 'tinper-bee';

export default class Zanwuquanshow extends Component {
	constructor(){
    	super();

    	this.state = {
    	}

	}

	render () {	

		return (

			<div style={{display: 'flex',justifyContent:'center',alignItems: 'center',width: '90%'}}>
				<img src={wuquanshow} alt="" style={{width: '100%'}}/>
			</div>			    
		);
	}
}


