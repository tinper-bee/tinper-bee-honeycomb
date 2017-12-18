import React, { Component } from 'react';
import Checkbox from 'bee-checkbox';
import { Radio } from 'tinper-bee';



export default class CheckboxItem  extends Component {


	state = {
		keyName: this.props.name,
		boxs: this.props.boxs(),
	}

	handleChange = (value, index) => {
		
		this.state.boxs[index]['checked'] = value;
		this.setState();
		this.props.onChange(this.state.boxs[0].value);
	}

	render() {
		let { boxs, keyName }  = this.state;
		return <div>
			{ boxs.map((box, i) =>  <Checkbox   colors="info" 
												checked={ box.checked } 
												onChange={ (e) => {this.handleChange(e, i) }} 
												key={i} name={ keyName } >
										{ box.label }
									</Checkbox>
			) }		
		</div>
	}
}