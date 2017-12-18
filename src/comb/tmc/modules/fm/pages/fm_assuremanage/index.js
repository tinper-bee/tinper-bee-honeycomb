import React, { Component } from 'react';
import { Breadcrumb } from 'tinper-bee';
import axios from 'axios';
import ajax from 'utils/ajax';
import Img4 from '../../../../static/images/assureManagePage/assureImg4.png';
import Img5 from '../../../../static/images/assureManagePage/assureImg5.png';
import Img6 from '../../../../static/images/assureManagePage/assureImg6.png';
import Img7 from '../../../../static/images/assureManagePage/assureImg7.png';
import AssureListItem from '../../containers/fm_assureListItem';
import './index.less';
// 引入 echarts 主模块。
import * as echarts from 'echarts/lib/echarts';
const URL = window.reqURL.fm;

export default class AssureManage extends Component {
	constructor() {
		super();
		this.state = {
			assureData:{},
			dateData:[]
		};
	}
	componentDidMount() {
		// 基于准备好的dom，初始化echarts实例
		let myChart = echarts.init(document.getElementById('bottomMychart'));
		//获取担保金额数据
		let that=this;
		ajax({
			url: URL + 'fm/guastatistics/getsticsAmount',
			data: {},
			success: (res)=> {
				let {amountinmoth}=res.data;
				this.state.assureData.guaamount =amountinmoth.map((item,key)=>{
					return item.guaamount
				})
				this.state.assureData.ctryamount =amountinmoth.map((item,key)=>{
					return item.ctryamount
				})
				this.state.dateData =amountinmoth.map((item,key)=>{
					return key+1
				})
				that.setState({
					assureData:this.state.assureData,
					dateData:this.state.dateData
				})
				// 绘制图表
				myChart.setOption({
					color: [ '#3AA4D2', '#ED7A75' ],
					title: {
						text: '单位 （亿元）',
						top: '20',
						left: '20',
						textStyle: {
							fontWeight: 'normal',
							fontSize: '12',
							color: '#666666'
						}
					},
					legend: {
						orient: 'vertical',
						right: 0,
						top: 50,
						data: [ '担保金额', '被担保金额' ]
					},
					grid: {
						left: '50',
						right: '110',
						bottom: '10',
						containLabel: true
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.state.dateData
					},
					yAxis: {
						type: 'value'
					},
					series: [
						{
							name: '担保金额',
							type: 'line',
							areaStyle: {
								normal: {
									color: 'rgba(58,164,210,0.1)'
								}
							},
							data: this.state.assureData.guaamount
						},
						{
							name: '被担保金额',
							type: 'line',
							areaStyle: {
								normal: {
									color: 'rgba(237,122,117,0.05)'
								}
							},
							z: 2,
							data: this.state.assureData.ctryamount
						}
					]
				});
			}
		});
		
	}
	render() {
		let topListData = [
			{ imgurl: Img4, titleOrg: '担保', titleGrey: '物权', linkurl: '#/fm/securityinterest' },
			{ imgurl: Img5, titleOrg: '担保', titleGrey: '合约', linkurl: '#/fm/guaranteecontractmanage' },
			{ imgurl: Img6, titleOrg: '担保', titleGrey: '债务管理', linkurl: '#/fm/guacontractquote' }
		];

		return (
			<div id="fm-assuremanage" className="bd-wraps">
				<Breadcrumb>
					<Breadcrumb.Item href="#">首页</Breadcrumb.Item>
					<Breadcrumb.Item active>担保管理</Breadcrumb.Item>
				</Breadcrumb>
				<div className="fm-assuremanage">
					<div className="top">
						{topListData.map((item, key) => {
							return (
								<div className="listItem">
									<AssureListItem assureListItemData={item} />
								</div>
							);
						})}
					</div>
					<div className="bottom">
						<div className="bottom-left-item">
							<div className="bottom-left">
								<h3>担保额度</h3>
								<div id="bottomMychart" />
							</div>
						</div>
						<div className="bottom-right-item">
							<div className="bottom-right">
								<AssureListItem
									assureListItemData={{
										imgurl: Img7,
										titleOrg: '担保',
										titleGrey: '台账',
										linkurl: '#/fm/taizhang',
										button: '点击查看'
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
