import React, { Component } from 'react';
import axios from 'axios';
import { Modal,Row, Col,Button } from 'tinper-bee';
// import PageJump from '../../../../containers/PageJump/index.js';
import Table from 'bee-table';
import './index.less';
import Ajax from '../../../../utils/ajax.js';
import { toast } from '../../../../utils/utils.js';
import nodataPic from '../../../../static/images/nodata.png';
import {formatMoney} from '../../../../utils/utils.js';
// modal header样式
const headerStyle = {
    border:'1px solid #ccc',
    paddingLeft:'20px',
}
// 收起 样式
const aStyle2 = {
    cursor:'pointer',
    display:'inline-block',
    float:'right',
    color:'green',
}
const URL= window.reqURL.fm;
/*
* 试算弹窗组件
*/ 
export default class TrialModal extends Component {
    constructor(props) {
		super(props);
		this.state = {
            mainTableList:[],//主表信息
            bodyData:[],//子表所有信息
            assistantTableList:[],//子表显示信息
            modalIn: 'slide_body slide_in',
            modalOut: 'slide_body slide_out',
            assistantTableVisble:false,
		};
    }
    componentWillReceiveProps = (nextProps) => {
        let data = nextProps.data;
        let headData = data.head.rows.map(e => e.values);
        let headPageInfo = data.head.pageinfo;
        let bodyData = data.body.rows.map(e => e.values);
        this.setState({
            mainTableList:headData,
            bodyData:bodyData,
            mainTableSize:headPageInfo.totalElements,
            mainTableMaxPage:headPageInfo.totalPages,
        })
        console.log(data);
    }
    // 主表点击页码事件
    mainTableHandleSelect = (eventKey) => {
        // this.getList(eventKey);
        this.setState({
            mainTablePageIndex:eventKey,
        });
    }
    //主表点击事件 根据id查询子表
    onRowClick = (record, index, event) => {
        this.setState({
            assistantTableVisble:true
        })
        let {bodyData} = this.state;
        let id = record.id.value;
        let assistantTableList = [];
        //获取子表
        console.log(id,bodyData);
        bodyData.map(e => {
            if(e.iabillid.value === id){
                assistantTableList.push(e);
                this.setState({
                    assistantTableList:assistantTableList,
                })
            }
        })
    }
    render(){
        const {
            showModal,
            data
        } = this.props;
        let {
            mainTableList,
            assistantTableList,
            assistantTableVisble,
            modalIn, 
            modalOut,
        } = this.state;
        console.log(this.state);
        const mainTableColumns = [
            {
                title: "序号", 
                dataIndex: "key", 
                key: 'index', 
                width: 80,
                render: (text, record, index) => {
					return (
						<span>{index + 1}</span>
					);
				}
            },
            {
                title: "清单编号", 
                dataIndex: "payLoad", 
                key: "payLoad", 
                width: 120, 
                render: (text,record,index) =>{
                    return (
                        <span>{record.vbillno?record.vbillno.value:''}</span>
                    );
                }
            },
            {
                title: "清单类型", 
                dataIndex: "iabilltype", 
                key: "iabilltype", 
                width: 100,
                render: (text,record,index) =>{
                    let value = record.iabilltype.value;
                    switch(value){
                        case 'interestbill':
                        value = '计息清单';
                        break;
                        case 'prebill':
                        value = '预提清单';
                        break;
                        case 'adjustprebill':
                        value = '冲补预提清单';
                        break;
                        case 'adjustbill':
                        value = '调整清单';
                        break;
                        default:
                        break;
                    }
                    return (
                        <span>{record.iabilltype?value:''}</span>
                    );
                }
            },
            {
                title: "合约编号", 
                dataIndex: "contractid", 
                key: "contractid", 
                width: 350,
                render: (text,record,index) =>{
                    return (
                        <span>{record.contractid?record.contractid.value:''}</span>
                    );
                }
            },
            {
                title: "币种", 
                dataIndex: "currtypeid", 
                key: "currtypeid", 
                width: 90,
                render: (text,record,index) =>{
                    return (
                        <span>{record.currtypeid?record.currtypeid.display:''}</span>
                    );
                }
            },
            {
                title: "还款方式", 
                dataIndex: "returnmode", 
                key: "returnmode", 
                width: 90,
                render: (text,record,index) =>{
                    return (
                        <span>{record.returnmode?record.returnmode.value:''}</span>
                    );
                }
            },
            {
                title: "借款单位", 
                dataIndex: "loancmpnyid", 
                key: "loancmpnyid", 
                width: 90,
                render: (text,record,index) =>{
                    return (
                        <span>{record.loancmpnyid?record.loancmpnyid.value:''}</span>
                    );
                }
            },
            {
                title: "贷款机构", 
                dataIndex: "entrustedcmpnyid", 
                key: "entrustedcmpnyid", 
                width: 180,
                render: (text,record,index) =>{
                    return (
                        <span>{record.entrustedcmpnyid?record.entrustedcmpnyid.value:''}</span>
                    );
                }
            },
            {
                title: "结息日", 
                dataIndex: "settledate", 
                key: "settledate", 
                width: 120,
                render: (text,record,index) =>{
                    return (
                        <span>{record.settledate?record.settledate.value:''}</span>
                    );
                }
            },
            {
                title: "未还本金", 
                dataIndex: "outprincipalmny", 
                key: "outprincipalmny", 
                width: 100,
                render: (text,record,index) =>{
                    return (
                        <span>{record.outprincipalmny?record.outprincipalmny.value:''}</span>
                    );
                }
            }, 
        ];
        // 副表 columns
        const assistantTableColumns = [
            {
                title: "序号", 
                dataIndex: "key", 
                key: "index", 
                width: 100,
                render: (text, record, index) => {
					return (
						<span>{index + 1}</span>
					);
				}
            },
            {
                title: "摘要", 
                dataIndex: "summary", 
                key: "summary", 
                width: 100, 
                render: (text,record,index) =>{
                    return (
                        <span>{record.summary.value}</span>
                    );
                }
            },
            {
                title: "计息方式", 
                dataIndex: "interestmethod", 
                key: "interestmethod", 
                width: 150,
                render: (text,record,index) =>{
                    return (
                        <span>{record.interestmethod.value===1?'按年利率算法':'按日利率算法'}</span>
                    );
                }
            },
            {
                title: "起息日期", 
                dataIndex: "intereststartdate", 
                key: "intereststartdate", 
                width: 150,
                render: (text,record,index) =>{
                    return (
                        <span>{record.intereststartdate.value}</span>
                    );
                }
            },
            {
                title: "结息日期", 
                dataIndex: "interestenddate", 
                key: "interestenddate", 
                width: 150,
                render: (text,record,index) =>{
                    return (
                        <span>{record.interestenddate.value}</span>
                    );
                }
            },
            {
                title: "结息天数", 
                dataIndex: "settlementdays", 
                key: "settlementdays", 
                width: 100,
                render: (text,record,index) =>{
                    return (
                        <span>{record.settlementdays.value}</span>
                    );
                }
            },
            {
                title: "利率", 
                dataIndex: "intrate", 
                key: "intrate", 
                width: 100,
                render: (text,record,index) =>{
                    return (
                        <span>{Number(record.intrate.value).toFixed(4) + '%'}</span>
                    );
                }
            },
            {
                title: "本金", 
                dataIndex: "principalmny", 
                key: "principalmny", 
                width: 250,
                render: (text,record,index) =>{
                    return (
                        <span>{Number(record.principalmny.value).formatMoney(2,'')}</span>
                    );
                }
            },
            {
                title: "利息", 
                dataIndex: "interestmny", 
                key: "interestmny", 
                width: 200,
                render: (text,record,index) =>{
                    return (
                        <span>{Number(record.interestmny.value).toFixed(2)}</span>
                    );
                }
            },
            {
                title: "计息操作人", 
                dataIndex: "operatorid", 
                key: "operatorid", 
                width: 100,
                render: (text,record,index) =>{
                    return (
                        <span>{record.operatorid.value}</span>
                    );
                }
            }, 
        ];
        return(
            <Modal 
                show={showModal}
                size='xlg'
                backdrop={false}
                className='listModal'
                dialogClassName={showModal ? modalIn : modalOut}
            >
            <Modal.Header style={headerStyle}>
                <Modal.Title>
                    <span>
                        试算
                    </span>
                    <a style={aStyle2} onClick={this.props.upClick}>收起></a>
                </Modal.Title>   
            </Modal.Header>
            <Modal.Body>
                <Row style={{padding:'10px'}}>
                    <Table 
                        columns={mainTableColumns} 
                        data={mainTableList} 
                        emptyText={() => 
                            <div>
                                <img src={nodataPic} alt="" />
                            </div>
                        }
                        className='bd-table'
                        onRowClick={this.onRowClick.bind(this)}
                        rowKey={record => record.id.value}
                    />
                </Row>
                <Row style={{padding:'10px'}}>
                    <Table 
                        columns={assistantTableColumns} 
                        data={assistantTableList} 
                        style={{display:assistantTableVisble?'block':'none'}} 
                        emptyText={() => 
                            <div>
                                <img src={nodataPic} alt="" />
                            </div>
                        }
                        className='bd-table'
                        rowKey={record => record.id.value}
                    />
                </Row>
            </Modal.Body>
            </Modal>
        )
    }
}