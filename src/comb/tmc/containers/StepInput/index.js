import React, { Component } from 'react';
import { FormControl } from 'tinper-bee';
import './index.less';

export default class StepInput extends Component {
	static defaultProps = {
		step: 4,
		amount: 4,
		value: ''
	};
	constructor(props) {
		super(props);
		let { step, amount, value } = this.props;
		let valueToArray = value.split(''),
			valueByStep = [];
		for (let i = 0; i < amount; i++) {
			valueByStep.push(valueToArray.splice(0, step).join(''));
		}
		this.state = {
			valueByStep
		};
	}
	handleChange = (i, e) => {
		let { step, amount, onChange } = this.props;
		let { valueByStep } = this.state;
		if (e.target.value.length > step) {
			if (++i >= amount) {
				return false;
			}
			this.refs['input' + i].focus();
			valueByStep[i] = e.target.value.substring(step);
			this.setState({
				valueByStep
			});
		} else {
			valueByStep[i] = e.target.value;
			this.setState({
				valueByStep
			});
		}
		onChange && onChange(valueByStep.join(''));
	};
	render() {
		let { step, amount } = this.props;
		let { valueByStep } = this.state;
		let inputs = [],
			width = (100 - 2 * (amount - 1)) / amount + '%';
		const span_style = {
			width: '2%',
			display: 'inline-block',
			textAlign: 'center',
			fontSize: '16px'
		};
		for (let i = 0; i < amount; i++) {
			if (i) {
				inputs.push(<span style={span_style}>-</span>);
			}
			inputs.push(
				<input
					value={valueByStep[i]}
					style={{ width: width }}
					onChange={this.handleChange.bind(this, i)}
					ref={'input' + i}
				/>
			);
		}
		return <div className="step-input">{inputs.map(e => e)}</div>;
	}
}
