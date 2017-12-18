import React, { Component } from 'react';
import { Table, Button, Icon } from 'tinper-bee';
import { toast } from '../../../../../utils/utils.js';
import Ajax from '../../../../../utils/ajax.js';
import nodataPic from '../../../../../static/images/nodata.png';
import '../../../../pass/containers/formatMoney.js';
import './index.less';
import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/toolbox';
import './index.less';
const URL= window.reqURL.fm;
const screenHeight= screen.availHeight;

export default class ContractLiancha extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataList: [],
            pageIndex: 1, 
			pageSize: 10,
			quoteamount: 0,	//担保金额
			amount: 0,			//债务金额,
			vbillno: '',		//单据号
			index: ''
        }
	}
	
	componentWillReceiveProps (nextProps) {
		if (JSON.stringify(nextProps.details)!== '{}' && nextProps.show) {
			this.getChangeRecordList(nextProps.details);
		}
	}

	componentDidMount() {
		document.body.addEventListener('click', this.queryHidden);
	}
	
	//获取列表数据
	getChangeRecordList = details => {
		const _this = this;
		Ajax({
			url: URL + 'fm/guacontractquote/linkedquery',
			data: {id: details.id.display || details.id.value},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let dataLists = data && data.head && data.head.rows && data.head.rows.map(item => item.values);
					let dataList= [];
					if (!dataLists || JSON.stringify(dataLists)=== '{}') {
						dataLists= [];
					}
					for (let item of dataLists) {
						item.debttype= details.debttype;
						item.guatype= details.guatype;
						item.creditorba= details.creditorba;
						item.creditorpa= details.creditorpa;
						item.creditorin= details.creditorin;
						item.debtorpa= details.debtorpa;
						item.debtorow= details.debtorow;
						item.debtorin= details.debtorin;
						dataList.push(item);
					}
					_this.setState({
						dataList: dataList || [],
						quoteamount: dataList.length ? dataList[0].quoteamount.display || dataList[0].quoteamount.value : 0,
						amount: dataList.length ? dataList[0].amount.display || dataList[0].amount.value : 0,
						vbillno: dataList.length ? dataList[0].vbillno.display || dataList[0].vbillno.value : '----',
						index: ''
					});
					setTimeout(() => {_this.getEcharts();}, 0);
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
			}
		}); 
	};

	//画图
	getEcharts= () => {
		let {quoteamount, amount}= this.state;
		let myChart = echarts.init(this.refs.barEcharts);
		let options = {
			xAxis: [{
                show: false,
                type: 'category',
                data: ['', '']
            }],
            yAxis: [{
                type: 'value',
                name: '',
				splitLine:{
					lineStyle:{
						opacity: 0
					}
				},
                axisLine: {
                    show: false
                },
                axisTick: {                 //坐标刻度
                    show: false
                },
                axisLabel: {
                    show: false,
                    inside: true
                } 
            }],
            series: [
				{
					name:'',
					type: 'bar',
					data:[amount, 0],
					itemStyle: {
						normal:{color:'#3aa4d2'}
					}
				},
				{
					name:'',
					type:'bar',
					data:[0, quoteamount],
					itemStyle:{
						normal:{color:'#5dd5c5'}
					}
				}
			]
		};
        myChart.setOption(options);
	};

	//关闭联查
	queryHidden = e => {
		let { show, hidden }= this.props;
		if (show) {
			let target= document.getElementById('contract-liancha');
			let len= e.path.findIndex((item) => item=== target);
			if (len < 0) {//不在联查区域时，自动隐藏弹框
				hidden();
			}
		}
	};

    render() {
		let {dataList, quoteamount, amount, vbillno, index}= this.state;
		let { show, hidden }= this.props;
        const columns = [
			{ 
				title: '序号', 
				key: 'key', 
				dataIndex: 'key', 
				width: '5%',
				render: (text, record, index) => {
					return (
						<div>{index + 1}</div>
					);
				} 
			},
			{ 
				title: '担保债务单据号', 
				key: 'vbillno', 
				dataIndex: 'vbillno', 
				width: '25%',
				render: (text, record) => {
					return (
						<div>{record.vbillno.display || record.vbillno.value || '-'}</div>
					);
				} 
			},
			{ 
				title: '交易类型', 
				key: 'debttype', 
				dataIndex: 'debttype', 
				width: '10%',
				render: (text, record) => {
					return (
						<div>{record.debttype.display || record.debttype.value || '-'}</div>
					);
				} 
			},
			{ 
				title: '担保方式', 
				key: 'guatype', 
				dataIndex: 'guatype', 
				width: '10%',
				render: (text, record) => {
					let type= record.guatype.display || record.guatype.value;
					return (
						<div>{type== 1 ? '保证' : (type== 2 ? '抵押' : (type== 3 ? '质押' : '混和'))}</div>
					);
				} 
            },
			{ 
				title: '债权人', 
				key: 'creditorpa', 
				dataIndex: 'creditorpa', 
				width: '25%',
				render: (text, record) => {
					return (
						<div>{record.creditorba.display || record.creditorba.value || record.creditorpa.display || record.creditorpa.value ||record.creditorin.display || record.creditorin.value ||'-'}</div>
					);
				} 
            },
			{ 
				title: '债务人', 
				key: 'debtorpa', 
				dataIndex: 'debtorpa', 
				width: '25%',
				render: (text, record) => {
					return (
						<div>{record.debtorow.display || record.debtorow.value || record.debtorpa.display || record.debtorpa.value || record.debtorin.display || record.debtorin.value ||'-'}</div>
					);
				} 
            },
        ];
        
        return (
            <div id='contract-liancha' className={show ? 'show' : ''}>
				<div className='contract-liancha-title'>
					<span>担保合约</span>
					<Icon 
						className='iconfont icon-cela'
						onClick={() => {hidden();}}
					></Icon>
				</div>
                <div className='contract-liancha-box'>
					<div className='contract-liancha-column' >
						<div className='vbillno'>担保债务单据号:{vbillno || '----'}</div>
						<div className='bar-echarts' ref='barEcharts'></div>
						<ul className='vbillno-detail'>
							<li>
								<span>债务金额:</span>
								<span>{Number(amount || 0).formatMoney(2, '')}</span>
							</li>
							<li>
								<span>担保金额:</span>
								<span>{Number(quoteamount || 0).formatMoney(2, '')}</span>
							</li>
						</ul>
					</div>
					<Table 
						bordered 
						className={`bd-table contract-liancha ${index ? '' : 'first'}`}
						columns={columns} 
						data={dataList} 
						emptyText={() => (
							<div>
								<img src={nodataPic} alt="" />
							</div>
						)}
						onRowClick= {(record, index) => {
							let vbillno= record.vbillno.display || record.vbillno.value;
							let quoteamount= record.quoteamount.display || record.quoteamount.value;
							let amount= record.amount.display || record.amount.value;
							this.setState({
								vbillno,
								quoteamount,
								amount,
								index
							});
							setTimeout(() => {this.getEcharts();}, 0);
						}}
						rowClassName={(record, current) => index=== current ? 'select' : ''}
						scroll={{y: screenHeight - 306}}
					/>
				</div>
            </div>
        )
    }
}