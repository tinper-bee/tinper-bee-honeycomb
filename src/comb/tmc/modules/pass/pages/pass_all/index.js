import React, { Component } from 'react';
import all_search from '../../../../static/images/pass_all_search.jpg';
import {Link, hashHistory} from 'react-router';
import { Button} from 'tinper-bee';

export default class Passall extends Component {
	constructor(){
    	super();
    	this.state = {}
	}

	render () {	

		return (
			<div>
				<Link to={'/pass/search'} className="u-button u-button-info u-button-border">查询</Link>
				<div style={{display: 'flex',justifyContent:'center',alignItems: 'center',width: '100%'}}>
					<img src={all_search} alt="" style={{width: '100%'}}/>
				</div>	
			</div>	    
		);
	}
}


