import React, { Component } from 'react';
import {hashHistory} from 'react-router';
import { 
	Row, 
	Col, 	
	Label,
	Radio,
	Checkbox,
	Icon,
	Button,
	Timeline,
	Step,
	Switch,
} from 'tinper-bee';
import Affix from 'bee-affix';
import Table from 'bee-table';
import Form from 'bee-form';
import BreadCrumbs from '../../../bd/containers/BreadCrumbs';
import {toast} from 'utils/utils';

import none from '../../../../static/images/img_now-none.png';
import bonds from '../../../../static/images/img_bonds.png';
import loan from '../../../../static/images/img_loan.png';

import moment from 'moment';
import axios from "axios";
import jump from 'jump.js';
import echarts from 'echarts';

import './index.less'
import 'bee-slider/build/Slider.css'
import 'bee-form/build/Form.css'


// 个人项目配置
const CONFIG = {
	option1 : {
		title: {
	        text: '贷款占比图',
	        right:'10'
	    },
	    tooltip: {
	        trigger: 'item',
	        formatter: "{a} <br/>{b}: {c} ({d}%)"
	    },
	    legend: {
	        orient: 'vertical',
	        x: 'left',
	        data:['合约已审批','合约在执行','合约待审批','申请待确认','合约已结束','申请已审批']
	    },
	    series: [
	        {
	            name:'访问来源',
	            type:'pie',
	            radius: ['50%', '70%'],
	            avoidLabelOverlap: false,
	            label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        fontSize: '30',
	                        fontWeight: 'bold'
	                    }
	                }
	            },
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data:[
	                {value:335, name:'合约已审批'},
	                {value:310, name:'合约在执行'},
	                {value:234, name:'合约待审批'},
	                {value:135, name:'申请待确认'},
	                {value:1548, name:'合约已结束'},
	                {value:128, name:'申请已审批'}
	            ]
	        }
	    ]
	},

	option2 : {
	    title: {
	        text: '五年内融资走势',
	    },
	    tooltip: {
	        trigger: 'axis'
	    },
	    legend: {
	        data:['融资申请','融资合同']
	    },
	    xAxis:  {
	        type: 'category',
	        boundaryGap: false,
	        data: ['2017','2018','2019','2020','2021']
	    },
	    yAxis: {
	        type: 'value',
	        axisLabel: {
	            formatter: '{value} 件'
	        }
	    },
	    series: [
	        {
	            name:'申请',
	            type:'line',
	            data:[11, 11, 15, 13, 12, 13, 10],
	            markPoint: {
	                data: [
	                    {type: 'max', name: '最大值'},
	                    {type: 'min', name: '最小值'}
	                ]
	            },
	            markLine: {
	                data: [
	                    {type: 'average', name: '平均值'}
	                ]
	            },
	            itemStyle: {
		            normal: {
		                shadowBlur: 10,
		                shadowColor: 'rgba(120, 36, 50, 0.5)',
		                shadowOffsetY: 5,
		                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
		                    offset: 0,
		                    color: '#f3534e'
		                }, {
		                    offset: 1,
		                    color: '#ff666e'
		                }])
		            }
		        }
	        },
	        {
	            name:'合约',
	            type:'line',
	            data:[1, -2, 2, 5, 3, 2, 0],
	            markPoint: {
	                data: [
	                    {name: '年最低', value: -2, xAxis: 1, yAxis: -1.5}
	                ]
	            },
	            markLine: {
	                data: [
	                    {type: 'average', name: '平均值'},
	                    [{
	                        symbol: 'none',
	                        x: '90%',
	                        yAxis: 'max'
	                    }, {
	                        symbol: 'circle',
	                        label: {
	                            normal: {
	                                position: 'start',
	                                formatter: '最大值'
	                            }
	                        },
	                        type: 'max',
	                        name: '最高点'
	                    }]
	                ]
	            },
	            itemStyle: {
		            normal: {
		                shadowBlur: 10,
		                shadowColor: 'rgba(25, 100, 150, 0.5)',
		                shadowOffsetY: 5,
		                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
		                    offset: 0,
		                    color: 'rgb(129, 227, 238)'
		                }, {
		                    offset: 1,
		                    color: 'rgb(25, 183, 207)'
		                }])
		            }
		        }
	        }
	    ]
	}
}

export default class FmTransIndex extends Component {
	constructor(){
    	super();

    	this.state = {
    		breadcrumbItem: [ 
            	{ href: '#', title: '首页' }, 
            	{ title: ' 融资申请' }, 
            	{ title: '融资申请首页' } 
            ]
    	}
	}

	componentWillMount () {
	}

	componentDidMount () {	
		this.renderChart(this.circle, CONFIG.option1)
		this.renderChart(this.line, CONFIG.option2)
	}

	componentWillUnmount () {
	}

	renderChart = (id, option) => {
		var myChart = echarts.init(id);
		myChart.setOption(option);
	} 

	handleClick = (type) => {
		if(type === 'loan') {
			hashHistory.push('fm/loantransaction');   
		}else {
			toast({size: 'mds', color: 'danger', content: '这个是点着玩的，你又调皮了哟哟哟！'})
		}
	}

	render () {	
		let {breadcrumbItem} = this.state;
		return (
			<section>
				<BreadCrumbs items={breadcrumbItem} />
				<section className="fm-index-wrap">				
					<ul className="fm-top-wrap">
						<li className="cf">
							<div className="fm-bonds-main fl">
								<div>
									<span className="fm-bonds-text">发债</span>
									<span>交易</span>
								</div>
								<div className="fm-bonds-info">轻松操作,一步融资</div>
								<div className="fm-bonds-text fm-preview-btn" onClick={this.handleClick.bind(this, 'bonds')}>点击查看</div>
							</div>
							<div className="fm-bonds-img fr">
								<img src={bonds}/>
							</div>
						</li>
						<li className="cf">
							<div className="fm-loan-main fl">
								<div>
									<span className="fm-bonds-text">贷款</span>
									<span>交易</span>
								</div>
								<div className="fm-bonds-info">轻松操作,一步融资</div>
								<div className="fm-bonds-text fm-preview-btn" onClick={this.handleClick.bind(this, 'loan')}>点击查看</div>
							</div>
							<div className="fm-loan-img fr">
								<img src={loan}/>
							</div>
						</li>
						<li>							
							<div className="fm-loan-img pad">
								<img src={none} className="left-center" />
							</div>
						</li>
					</ul>
					<ul className="fm-bottom-wrap">
						<li>
							<div ref={(div) => {this.circle = div}} className="fm-bottom-section"></div>
						</li>
						<li>
							<div ref={(li) => {this.line = li}}  className="fm-bottom-section"></div>
						</li>
					</ul>
				</section>		
			</section>					    
		);
	}
}


