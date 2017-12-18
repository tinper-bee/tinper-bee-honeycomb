import React, { Component } from 'react';
import Refer from 'containers/Refer';

export default class ReferItem1 extends Component {
	constructor() {
	    super();
	    this.state = {};
	}	

	referChange = (val, name) => {
        console.log(val, name)
		// let handleChangeCallback = this.props.handleChangeCallback;
		// handleChangeCallback && handleChangeCallback(val, name)
        this.props.onChange && this.props.onChange(val, name)
	}


	render() {
		let {name, code, data, ...attrs} = this.props;
		return  (<Refer
            name={name}
            type="customer"
            refCode={code}
            refModelUrl={`/bd/${code}/`}
            value={{
                refname: data.display || null,
              	refpk: data.value || null
            }}  
            {...attrs}                                                                  
        />)    
	}	
}