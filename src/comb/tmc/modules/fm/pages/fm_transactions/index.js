import React, { Component} from 'react';
import { Breadcrumb} from 'tinper-bee';
import axios from 'axios';
import ajax from 'utils/ajax';
import Img1 from '../../../../static/images/assureManagePage/assureImg1.png';
import Img2 from '../../../../static/images/assureManagePage/assureImg2.png';
import Img3 from '../../../../static/images/assureManagePage/assureImg3.png';
import AssureListItem from '../../containers/fm_assureListItem';
import './index.less';
// 引入 echarts 主模块。
import * as echarts from 'echarts/lib/echarts';
const URL = window.reqURL.fm;
export default class TransActions extends Component {
	constructor() {
		super();
		this.state = {
            fmdata:{}
        };
    }
    componentDidMount(){
        // 基于准备好的dom，初始化echarts实例
        let myChart=echarts.init(document.getElementById('bottomMychart'));
        let that=this;
        ajax({
			url: URL + 'fm/creditCount/count',
			data: {},
			success: (res)=> {
                let {creditFacility}=res.data;
                that.state.fmdata=creditFacility;
                that.setState({
                    fmdata:creditFacility
                })
                // 绘制图表
                myChart.setOption({
                    color:['#3AA4D2','#5DD5C5'],
                    series : [
                        {
                            type: 'pie',
                            startAngle:'160',
                            radius : '70%',
                            center: ['50%', '45%'],
                            data:[
                                {value:this.state.fmdata.usedquota, name:'已用授信额度',selected:true},
                                {value:this.state.fmdata.lavequota, name:'可用授信额度'},
                            ],
                            itemStyle: {
                                
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 10,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            },
                            label: {
                                normal: {
                                    formatter: '{b}  {d}%',
                                    textStyle: {
                                        fontSize:'15',
                                        color: '#666666'
                                    }
                                }
                            },
                            labelLine: {
                                normal: {
                                    lineStyle: {
                                        color: 'rgba(216,216,216,1)'
                                    },
                                    smooth: 0,
                                    length: 30,
                                    length2: 50
                                },
                                emphasis: {
                                    lineStyle: {
                                        color: 'rgba(216,216,216,1)'
                                    },
                                }
                            },
                        }
                    ]
                })
			}
		});
    }
    render(){
        let topListData=[
            {"imgurl":Img1,"titleOrg":"银行授信","titleGrey":"协议","linkurl":"#/fm/creditmanage"},
            {"imgurl":Img2,"titleOrg":"银行额度","titleGrey":"监控","linkurl":"#/fm/creditmonitor"},
            {"imgurl":Img3,"titleOrg":"授信","titleGrey":"调整","linkurl":"#/fm/creditadjust"}
        ]
        console.log(this.state.fmdata)
        return(
            <div id="fm-transactions" className="bd-wraps">
                <Breadcrumb>
                    <Breadcrumb.Item href="#">首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#">融资</Breadcrumb.Item>
                    <Breadcrumb.Item active>融资交易</Breadcrumb.Item>
                </Breadcrumb>
                <div className="fm-transactions">
                    <div className="top">
                    {topListData.map((item,key)=>{
                        return(<div className="listItem"><AssureListItem assureListItemData={item}/></div>)
                    })} 
                    </div>
                    <div className="bottom">
                    <div className="bottom-item">
                        <h3>今年授信统计</h3>
                        <div className="bottom-chart">
                            <div id="bottomMychart">
                            </div>
                            <div className="bottom-content">
                                <span>已用授信额度</span>
                                <span className="bottom-contentOrg">{this.state.fmdata.usedquota}</span>
                            </div>
                            <div className="bottom-content">
                                <span>可用授信额度</span>
                                <span className="bottom-contentOrg">{this.state.fmdata.lavequota}</span>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}
    