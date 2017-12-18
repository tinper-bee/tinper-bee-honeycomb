import React, { Component } from 'react';
import { Button, FormControl } from 'tinper-bee';
import CheckBox from '../../../../containers/CheckBoxs/CheckBox';
import { toast } from '../../../../utils/utils.js';

export default class Dimension extends Component {
	constructor() {
		super();
		this.state = {
			data: [
				{content: '日期相差天数'},
				{content: '对方相同'},
				{content: '摘要相同'},
				{content: '用途相同'},
			],
			selectData: [false, false, false, false],
			gapDay: '',
			arr: [],
			arrs: []
		};
	}
	
	componentDidMount() {
		document.body.addEventListener('click', this.moreDimension);
	}

	//选择维度
	moreDimension = e => {
		let { isShow, onConfirm, saveData }= this.props;
		let { arr, arrs}= this.state;
		if (this.props.isShow) {
			let target= document.getElementsByClassName('dimension-show')[0];
			let targetBtn= document.getElementsByClassName('select-dimension-btn')[0];
			let len= e.path.findIndex((item) => item=== target);
			let length= e.path.findIndex((item) => item=== targetBtn);
			if (len < 0 && length) {
				if (saveData) {
					onConfirm(JSON.parse(JSON.stringify(arr)), JSON.parse(JSON.stringify(arrs)));
				} else {
					onConfirm([], []);
				}
			}
		}
	};

	render() {
		let {data, selectData, gapDay} = this.state;
		let {isShow, onConfirm}= this.props;
		return (
			<div className= {isShow ? 'dimension-show show' : 'dimension-show'}>
                <ul>
					{
						data.map((item, index) => {
							return <li key={index} className={selectData[index] ? 'select' : ''}>
								<CheckBox
									checked={selectData[index]}
									onSelect= {(val) => {
										selectData[index]= val;
										this.setState({selectData});
									}}
								>
									{item.content}
									{index=== 0 &&
										<FormControl
											className='gap-day'
											value={gapDay}
											onChange= {e => {
												let val= e.target.value;
												let reg= /^[0-9]*$/;
												if (!reg.test(val) && val) {
													toast({color: 'warning', content: '请输入正整数...'});
													return ;
												}
												this.setState({gapDay: Number(val)});
											}}
										/>
									}
								</CheckBox>
							</li>
						})
					}
				</ul>
                <div
					className='more-query-confirm'
                    onClick= {() => {
						let arr= [];
						let arrs= [];
						for (let key in selectData) {
							if (!gapDay && selectData[0]) {
								toast({color: 'danger', content: '请输入日期相差天数'});
								return;
							}
							if (selectData[key]) {
								arr.push(data[key]);
								key== 0 ? arrs.push(gapDay) : arrs.push(data[key]['content']);
							} else {
								arrs.push('');
							}
						}
						this.setState({arr, arrs});
						onConfirm(JSON.parse(JSON.stringify(arr)), JSON.parse(JSON.stringify(arrs)));
					}}
                >确认</div>
			</div>
		);
	}
}
