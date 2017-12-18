import React, { Component } from 'react';
import Tabs, {TabPane} from 'bee-tabs';
import {Col,Breadcrumb,Table} from 'tinper-bee';
import './index.less';
import Affix from 'bee-affix';
import PayRender from '../payRender/index.js';
import RateRender from '../rateRender/index.js';
import AdjrateRender from '../adjrateRender/index.js';
import LightTabs from '../LightTabs';
import deepClone from '../../../../../utils/deepClone.js'
import jump from 'jump.js';
const column1 = [
    {title: "编码", dataIndex: "code", key: "code"},
    { title: "计划还款日期", dataIndex: "planrepaydate", key: "planrepaydate"},
    { title: "预计还本金", dataIndex: "premny", key: "premny"},
    { title: "预计付利息", dataIndex: "preinterest", key: "preinterest"},
    { title: "本利合计", dataIndex: "summny", key: "summny"}
]
const column3 =[ 
    { title: "展期利率%", dataIndex: "extrate", key: "extrate"},
    { title: "展期开始日期", dataIndex: "extbegindate", key: "extbegindate"},
    { title: "展期结束日期", dataIndex: "extenddate", key: "extenddate"}
]    
const column2 = [ 
    { title: "授信协议", dataIndex: "ccprotocolid", key: "ccprotocolid"},
    { title: "授信银行", dataIndex: "creditbankid", key: "creditbankid" },
    { title: "授信币种", dataIndex: "cccurrtypeid", key: "cccurrtypeid"},
    { title: "授信类别", dataIndex: "cctypeid", key: "cctypeid"},
    { title: "占用授信金额", dataIndex: "ccmny", key: "ccmny"}
]
const rootUrl =window.reqURL.fm+'fm/loan/';
let data1=[],data2=[],data3=[];
const CONFIG = {
	ANCHOR : { // 锚节点
		values: ['业务信息', '利率信息','利率调整方案','其他信息'],
		width: [100,100,110,112]
	},
	JUMP_CONFIG : { // 滚动条滚动
		offset: 60, // 60为tab的高度
		duration: 300
    }
}

export default class ChangeRecord extends Component {
    constructor(props) {
        super(props);
        this.rate= {
            'id': {
                'dispaly': null,
                'scale': -1,
                'value':  null
                },
            'rateid': {
                'dispaly': null,
                'scale': -1,
                'value':  null
            },
            'isfixrate': {
                'dispaly': null,
                'scale': -1,
                'value': null
            },
            'floatratescale': {
                'dispaly': null,
                'scale': -1,
                'value': null
                },
            'floatratepoints': {
                'dispaly': null,
                'scale': -1,
                'value': null
            },
            'settledate': {
                'dispaly': null,
                'scale': -1,
                'value': ''
            },
            'returnmodeid': {
                'dispaly': null,
                'scale': -1,
                'value': null
                },
            'overratescale': {
                'dispaly': null,
                'scale': -1,
                'value':null
            },
            'headratescale': {
                'dispaly': null,
                'scale': -1,
                'value':null
            },
            'overratepoint': {
                'dispaly': null,
                'scale': -1,
                'value': null
                },
            'headratepoint': {
                'dispaly': null,
                'scale': -1,
                'value': null
            },
            'isoverinterest': {
                'dispaly': null,
                'scale': -1,
                'value': null
            },
            'isusenormalrate': {
                'dispaly': null,
                'scale': -1,
                'value': null
                }
            
        }
        this.adjrate={
            'id': {
                'dispaly': null,
                'scale': -1,
                'value': null
                },
            'adjratemethod': {
                'dispaly': null,
                'scale': -1,
                'value': null
            },
            'effecttype': {
                'dispaly': null,
                'scale': -1,
                'value': null
            },
            'adjbegdate': {
                'dispaly': null,
                'scale': -1,
                'value': ''
                },
            'adjperiodunit': {
                'dispaly': null,
                'scale': -1,
                'value': null
            },
            'lastadjdate': {
                'dispaly': null,
                'scale': -1,
                'value': ''
            }
        }
        this.head={
            'id': {
                'display': null,
                'scale': -1,
                'value': null
                },
            'contractid':{
                'display': null,
                'scale': -1,
                'value': null
            },
            'financecorpid':{
                'display': null,
                'scale': -1,
                'value': null
            },
            'planpayid':{
                'display':null,
                'scale': -1,
                'value': null
            },
            'financorgid': {
                'display': null,
                'scale': -1,
                'value': null
            },
            'loancode': {
                'display': null,
                'scale': -1,
                'value':null
            },
            'fininstitutionid': {
                'display': null,
                'scale': -1,
                'value': null
                },
            'trantypeid': {
                'display': null,
                'scale': -1,
                'value': null
            },
            'tranevent': {
                'display': null,
                'scale': -1,
                'value': null
            },
            'currtypeid': {
                'display': null,
                'scale': -1,
                'value':null
                },
            'loanmny': {
                'display': null,
                'scale': -1,
                'value':null
            },
            'rate': {
                'display': null,
                'scale': -1,
                'value':null
            },
            'loandate': {
                'display': null,
                'scale': -1,
                'value': ''
                },
            'contenddate': {
                'display': null,
                'scale': -1,
                'value': ''
            },
            'debitunitacctid': {
                'display': null,
                'scale': -1,
                'value': null
            },
            'memo': {
                'display': null,
                'scale': -1,
                'value':null
                },
            'projectid': {
                'display': null,
                'scale': -1,
                'value': null
            },
            'settleflag': {
                'display': null,
                'scale': -1,
                'value': null
            },
            'terminatedate': {
                'display': null,
                'scale': -1,
                'value': '无'
            },
            'ispayusecc':{
                'display': null,
                'scale': -1,
                'value': '0'
            },
            'payreleasemny':{
                'display': null,
                'scale': -1,
                'value': null
            },
            'approver':{
                'dispaly': null,
                'scale': -1,
                'value':  null
            },
            'approvedate':{
                'dispaly': null,
                'scale': -1,
                'value':  null
            },
            'vbillstatus':{
                'dispaly': null,
                'scale': -1,
                'value': null
            }
        }
        this.data= {
            'head':{
                'pageinfo': null,
                'rows': [
                    {
                        'rowId': null,
                        'values': this.head
                    }   
                ]    
            },
            "rate":{
                'pageinfo': null,
                'rows': [
                    {
                        'rowId': null,
                        'values': this.rate
                    }   
                ]    
            },
            'adjrate':{
                'pageinfo': null,
                'rows': [
                    {
                        'rowId': null,
                        'values':this.adjrate
                    }
                ] 
            },
            "ccinfo":{
                'pageinfo': null,
                'rows': [
                    {
                        'rowId': 0,
                        'values': {
                           
                        }
                    }   
                ]    
                
            },
            "planrepay":{
                'pageinfo': null,
                'rows': [
                    {
                        'rowId': 0,
                        'values': {
                           
                        }
                    }   
                ]    
            },
            "extinfo":{
                'pageinfo': null,
                'rows': [
                    {
                        'rowId': 0,
                        'values': {
                           
                        }
                    }   
                ]    
            }
        }
       

        this.state={
            financepayData:this.data.head.rows[0].values,//放款
            rateData:this.data.rate.rows[0].values,//利率
            adjrateData:this.data.adjrate.rows[0].values,//利率调整方案
            dataSource1: [],//还款计划表格
            dataSource2: [],//授信表格
            dataSource3: [],//展期表格
            record:[],
            active:0,
            distance: 0,
            chooseIndex: 0,
            isClicked:false
        }
    }

    
    //组织请求回来的数据并刷新state
    orgaAndRefResData=(data) => {
        //还款计划
        if(data.planrepay){
            const newSource1= data.planrepay.rows.map((item, index) => {
                const values = item.values;
                return {
                    id: values.id.value,
                    code: values.code.value,
                    planrepaydate: values.planrepaydate.value,
                    premny: this.getFloat(values.premny.value,2),
                    preinterest: this.getFloat(values.preinterest.value,2),
                    summny: this.getFloat(values.summny.value,2)
                };
            });
            data1=newSource1.map((e, i) => {
                return {
                    ...e,
                    key: i,
                    index: i + 1,
                    editing: false
                }
            });
            this.setState({
                dataSource1:deepClone(data1)
            })    
        }else{
            this.setState({
                dataSource1:[]
            })  
        }
        //授信信息
        if(data.ccinfo){
            const newSource2 = data.ccinfo.rows.map((item, index) => {
                const values = item.values;
                return {
                    id: values.id.value,
                    ccprotocolid: values.ccprotocolid.value,
                    creditbankid: values.creditbankid.value,
                    cccurrtypeid: values.cccurrtypeid.value,
                    cctypeid: values.cctypeid.value,
                    ccmny: this.getFloat(values.ccmny.value,2)
                };
            });
            data2=newSource2.map((e, i) => {
                return {
                    ...e,
                    key: i,
                    index: i + 1,
                    editing: false
                }
            });
            this.setState({
                dataSource2:deepClone(data2)
            }) 
        }else{
            this.setState({
                dataSource2:[]
            }) 
        }
        //展期信息  
        if(data.extinfo){
            const newSource3 = data.extinfo.rows.map((item, index) => {
                const values = item.values;
                return {
                    id: values.id.value,
                    extrate: values.extrate.value,
                    extbegindate : values.extbegindate.value,
                    extenddate : values.extenddate.value
                };
            });
            data3=newSource3.map((e, i) => {
                return {
                    ...e,
                    key: i,
                    index: i + 1,
                    editing: false
                }
            });
            this.setState({
                dataSource3:deepClone(data3)
            }) 
        }else{
            this.setState({
                dataSource3:[]
            }) 
        }  
        if(data.head){
            let loancode = data.head.rows[0].values.loancode.value;
            if(loancode){
                let loanArr = loancode.split('-');
                data.head.rows[0].values.contractid.display=loanArr[0];
                data.head.rows[0].values.planpayid.display=loanArr[1];
            }
            let loanmny=data.head.rows[0].values.loanmny.value;
            if(loanmny){
                data.head.rows[0].values.loanmny.value=this.getFloat(loanmny,2);
            }
            let rate = data.head.rows[0].values.rate.value;
            if(rate){
                data.head.rows[0].values.rate.value=this.getFloat(rate,4);
            }
            this.setState({
                financepayData:data.head.rows[0].values
            })
        }else{
            this.setState({
                financepayData:this.head
            })
        }
        if(data.rate) {
            this.setState({
                rateData:data.rate.rows[0].values
            })
        }else{
            this.setState({
                rateData:this.rate
            })
        }
        if(data.adjrate){
            this.setState({
                adjrateData:data.adjrate.rows[0].values
            })
        }else{
            this.setState({
                adjrateData:this.adjrate
            }) 
        }
    }


    componentWillMount(){
        console.log(this.props.params.id)
        const reqData = {
            head:{
                pageinfo:null,
                rows:[
                    {
                        rowId:null,
                        values:{
                            id:{value:this.props.params.id},
                            maxVersion:{value:-1},
                            versionNo:{value:1}
                        }
                    }
                ]
            }
        }
        const _this=this;
        axios
        .post(rootUrl+"alterRecord", { data: reqData })
        .then(function(res) {
            const {success, message,data} = res.data;
            if (success) {
                _this.orgaAndRefResData(data);
                _this.getVersion(data.head.rows[0].values.maxVersion.value) 
            } 
        })        
    }

    componentWillUnmount() {
        this.removeListenerScroll();
    }

    componentDidMount () {
        this.addListenerScroll();	
    }
    
    
    //保留n位小数
    getFloat =(number, n)=>{ 
        n = n ? parseInt(n) : 0; 
        if (n <= 0) return Math.round(number); 
        number = (+ number).toFixed(n); 
        return number; 
    };
 

    handelSeeRecord=(i,index)=>{
        this.setState({
            active:index
        })
        const _this=this;
        console.log(this.props.params.id)
        const reqData = {
            head:{
                pageinfo:null,
                rows:[
                    {
                        rowId:null,
                        values:{
                            id:{value:this.props.params.id},
                            versionNo:{value:i}
                        }
                    }
                ]
            }
        }
      
        axios
        .post(rootUrl+"alterRecord", { data: reqData })
        .then(function(res) {
            const {success, message,data} = res.data;
            if (success) {
                _this.data=deepClone(data); 
                console.log(data)
                _this.orgaAndRefResData(data);
            } 
        })
    }

    getVersion=(max)=>{
       let arr=[];
       for(let i=0;i<max;i++){
           arr[i]=i;
       }
       this.setState({
            record:arr
       })
    }

    // 获得区域的序号
	getItemIndex = () => {
		let scrollTop = this.getScrollTop(),		
			firstTop = this.refs.anchor1.offsetTop,
			fixedTop = scrollTop  + CONFIG.JUMP_CONFIG.offset;		
		let [heightPrev, heightNext] = new Array(2).fill(0);
		const LEN = CONFIG.ANCHOR.values.length;

		for(let i = 0; i < LEN; i++) {
			heightPrev = this.refs[`anchor${(i + 1)}`].offsetTop;				
			heightNext = (i <= LEN - 2) ? this.refs[`anchor${(i + 2)}`].offsetTop : null;

			if(fixedTop <= firstTop) {
				return 0;
			}
			if(heightPrev <= fixedTop && (heightNext && heightNext > fixedTop)) {
				return i;
			}else if(!heightNext) {
				return (LEN - 1)
			}			
		}		
    }
    // 获取滚动条位置
	getScrollTop = () => {
		return document.body.scrollTop || document.documentElement.scrollTop
	}// 监听滚动
	addListenerScroll = () => {	
		window.addEventListener('scroll', this.scrollEventDo ,false)				
	}// 取消监听滚动
	removeListenerScroll = () => {
		console.log('-----取消监听-----')
		window.removeEventListener('scroll', this.scrollEventDo, false)
    }
    scrollEventDo = () => {
		if(!this.state.isClicked) {
			this.scrollEvent()
		}		
	}// 点击滚动到位置
	scrollToDis = (e) => {
		let text = e.target.innerHTML;
		this.state.isClicked = true;
		if(!text) {
			return;
		}
		let index = CONFIG.ANCHOR.values.findIndex(value => value == text)
		if(index >= 0){
			//this.setScrollBar(index)
			this.scrollToAnchor(index)
		}		
	}// 滚动条滚到指定区域
	scrollToAnchor = (index) => {
		let ele = this.refs[`anchor${index + 1}`]
		let _this = this;
		jump(ele, {
			duration: CONFIG.JUMP_CONFIG.duration,
			offset: - CONFIG.JUMP_CONFIG.offset,
			callback: () => {
				_this.state.isClicked = false;
			}
		})
	}// 设置tab中tabBar位置
	setScrollBar = (index) => {
		let distance = parseInt(index * CONFIG.ANCHOR.width[index]);
		this.setState({
			distance,
			chooseIndex: index
		})
	}// 滚动条主动滚动事件
	scrollEvent = () => {
		let index = this.getItemIndex();
		this.setScrollBar(index)	
    }	
    handelChangeIndex = (index) =>{
        let distance = parseInt(index * CONFIG.ANCHOR.width[index]);
        this.setState({
            distance:distance,
            chooseIndex : index
        })
    }
    
    render(){
        const {financepayData,rateData,adjrateData,dataSource1,
            dataSource2,dataSource3,record,chooseIndex,distance
        } = this.state;
        const tranStyle = {
	    	transform: `translate3d(${distance}px,0,0)`,
	    	webkitTransform: `translate3d(${distance}px,0,0)`,
	    	mozTransform: `translate3d(${distance}px,0,0)`
	    }
        const tabs=[
            {
				key: 1,
				isShow: true,
				label: '还款计划',
                render: () =><div className="tab"> 
                    <div className="tab-body">
                        <Col md={12} xs={12} sm={12} className="tab-title">还款计划</Col>
                        <Col md={12} xs={12} sm={12} style={{padding:0}}>
                            <Table
                                columns={column1}
                                data={dataSource1}
                            />
                        </Col>
                    </div>  
                </div>     
			},{ 
				key: 2,
				isShow: true,
				label: '授信',
				render: () => <div className="tab">
                     <div className="tab-body">
                        <Col md={12} xs={12} sm={12} className="tab-title">授信</Col>
                        <Col md={12} xs={12} sm={12} style={{padding:0}}>
                            <Table
                                columns={column2}
                                data={dataSource2}
                            />
                        </Col>
                    </div>
                </div>
			},{
				key: 3,
				label: '展期',
				isShow: true,
				render: () => <div className="tab">
                    <div className="tab-body">
                        <Col md={12} xs={12} sm={12} className="tab-title">展期</Col>
                        <Col md={12} xs={12} sm={12} style={{padding:0}}>
                            <Table
                                columns={column3}
                                data={dataSource3}
                            />
                        </Col>
                    </div>
                </div>
			}
        ]  
        const activeTab=1;
        return(
            <section className="record-wrapper">
               <section>
                    <Breadcrumb>
                        <Breadcrumb.Item href='#'>首页</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">融资</Breadcrumb.Item>
                        <Breadcrumb.Item active>变更记录</Breadcrumb.Item>
                    </Breadcrumb>
                </section > 
                <div className="change-content cf">
                    <Affix className="cf">
                        <Col md={12} xs={12} sm={12} className="record-title">
                            <div className="record-name">变更记录</div>
                            <div className="skip-tab">
                                <ul className="financepay-tab cf" onClick={this.scrollToDis}>
                                    {
                                        CONFIG.ANCHOR.values.map((item, index) => {
                                            return (
                                            <li 
                                                className={index == chooseIndex? 'active' : ''}
                                                onClick={this.handelChangeIndex.bind(this,index)}
                                            >
                                            {item}
                                            </li>)
                                        })
                                    }
                                    <li className="scrollBar tabs-nav-animated"  style={tranStyle}></li>
                                </ul>
                            </div>
                        </Col> 
                    </Affix>
                
                    <Col md={12} xs={12} sm={12} className="record-content">
                        <Col md={2} xs={2} sm={2} className="record-version">
                            <ul>
                                {record.map((item,i)=>{
                                    return(
                                        <li 
                                            key={i} 
                                            className={this.state.active===i?'item-active':'record-item'} 
                                            onClick={this.handelSeeRecord.bind(this,item,i)}> 
                                            {`版本${item}`} 
                                        </li>
                                    )
                                })}
                            </ul>
                        </Col>
                        <Col md={10} xs={10} sm={10} className="infos">
                            <section ref="anchor1" className="part-item1 cf">
                                <Col md={12} xs={12} sm={12} className="record-part">
                                    <Col md={12} xs={12} sm={12} id="contract-info" className='pay-part-title'>业务信息</Col>
                                    <PayRender
                                        financepayData={financepayData}
                                    />
                                </Col>
                            </section>

                            <section ref="anchor2" className="part-item2 cf">
                                <Col md={12} xs={12} sm={12} className="record-part">
                                    <Col md={12} xs={12} sm={12} id="InRate-info" className='pay-part-title'>利率信息</Col>
                                    <RateRender
                                        rateData={rateData}
                                    />
                                </Col>
                            </section>

                            <section ref="anchor3" className="part-item3 cf">
                                <Col md={12} xs={12} sm={12} className="record-part">
                                    <Col md={12} xs={12} sm={12} id="InRate-scheme" className='pay-part-title'>利率调整方案</Col>
                                    <AdjrateRender
                                        adjrateData={adjrateData}
                                    />
                                </Col>
                            </section>

                            <section ref="anchor4" className="part-item4 cf">
                                <Col md={12} xs={12} sm={12} className="record-part">
                                    <Col md={12} xs={12} sm={12}  className="pay-info-tabs">
                                        <span id="other-info" className='pay-part-title'style={{float:'left'}}>
                                            其他信息
                                        </span>
                                        <LightTabs activeKey={ activeTab }  items={tabs} />
                                    </Col> 
                                </Col>
                            </section>

                        </Col>
                    </Col>  
                </div>            
            </section>
        )
    }
}