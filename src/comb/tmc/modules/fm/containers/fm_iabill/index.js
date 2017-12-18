import React, { Component } from 'react';
import axios from 'axios';
import { Modal,Row, Col,Pagination,Button } from 'tinper-bee';
import Table from 'bee-table';
import './index.less';
import Ajax from '../../../../utils/ajax.js';
// import Pagination from "bee-pagination";
import { toast } from '../../../../utils/utils.js';
import nodataPic from '../../../../static/images/nodata.png';
import {formatMoney} from '../../../../utils/utils.js';
// modal header样式
const headerStyle = {
    border:'1px solid #ccc',
    paddingLeft:'20px',
}
// 逾期 样式
const aStyle1 = {
    cursor:'Default',
    marginLeft:'5px',
    color:'white',
    backgroundColor: 'orange',
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
* 利息清单详情弹窗组件
*/ 
export default class InterestListModal extends Component {
    constructor(props) {
		super(props);
		this.state = {
            mainTableList:[],//主表信息
            assistantTableList:[],//子表信息
            mainTablePageSize:5,//主表一页数据数量
            assistantTablePageSize:5,//子表一页数据数量
            mainTableMaxPage:'',//主表总页数
            mainTablePageIndex:1,//主表当前页
            id:'',//主表对应子表id
            listData:'',//利息清单编号
            modalIn: 'slide_body slide_in',
            modalOut: 'slide_body slide_out',
            assistantTableVisble:'none',
		};
    }
    componentWillMount = () => {
        const {needmainTable} = this.props;
        this.getList();
    }
    // 请求利息清单详情(上方－主表信息)
    getList = (e) => {
        let _this = this;
        const {needmainTable,iabillKey,parenttype} = this.props;
        Ajax({
            url:URL + "fm/interests/searchLXQD",
            data:{
                "page":(e - 1)||0,
                "size":5,
                "searchParams":{
                 "searchMap":{
                    "id":iabillKey,
                  }
                }  
            },
            success: function(res) {
                const { data, message, success } = res;
                if(success && data !== null){
                    if(needmainTable){
                        // 多条信息
                        let list = data.head.rows.map(e => e.values);
                        _this.setState({
                            mainTableList:list,
                            mainTableMaxPage:data.head.pageinfo.totalPages,
                        })
                    }else{
                        // 一条信息
                        let list = data.head.rows[0].values;
                        _this.setState({
                            mainTableList:list,
                            listData:list.vbillno.value,
                            id:list.id.value,
                        })
                        _this.getListTable(list.id.value);
                    }
                }
			},
			error: function(res) {
                _this.setState({
                    mainTableList:[],
                })
                // toast({content: '后台报错,请联系管理员', color: 'danger'});
			},
        })
    }
    // 请求利息清单表格（下方－子表信息）
    getListTable = (e) => {
        let _this = this;
        Ajax({
            url:URL + "fm/interests/searchQD",
            data:{
                "page":0,
                "size":100,
                "searchParams":{
                 "searchMap":{
                      "id":e
                  }
                }           
            },
            success: function(res) {
                const { data, message, success } = res;
                if(success && data !== null){
                    let assistantTableList = data.head.rows.map(e => e.values);
                    _this.setState({
                        assistantTableList:assistantTableList,
                    })
                }else{ 
                    _this.setState({
                        assistantTableList:[],
                    })
                    toast({content: error, color: 'warning'});
                }
			},
        })
    }
    // 主表点击页码事件
    mainTableHandleSelect = (eventKey) => {
        this.getList(eventKey);
        this.setState({
            mainTablePageIndex:eventKey,
        });
    }
    //主表点击事件 根据id查询子表
    onRowClick = (record, index, event) => {
        let id = record.id.value;
        //获取子表
        this.setState({
            assistantTableVisble:'block',
        })
        this.getListTable(id);
    }
    render(){
        const {
            showModal,
            overdue,
            payLoad,
            needmainTable
        } = this.props;
        let {
            assistantTableList,
            mainTableList,
            mainTablePageSize,
            assistantTableVisble,
            mainTableMaxPage,
            mainTablePageIndex,
            modalIn, 
            modalOut,
        } = this.state;
        // 主表 columns
        const mainTableColumns = [
            {
                title: "序号", 
                dataIndex: "key", 
                key: 'index', 
                width: 80,
                render: (text, record, index) => {
					return (
						<span>{mainTablePageSize* (mainTablePageIndex - 1) + index + 1}</span>
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
        ]
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
            iabillKey={this.props.iabillKey}//外部调用传入的key（查询主表的id）
            parenttype={this.props.parenttype}//外部调用传入的type（区分从放款/计息页面引入）
            >
            <Modal.Header style={headerStyle}>
                <Modal.Title>
                    {
                        needmainTable?
                        <span>利息清单</span>:
                        <span>
                            {`利息清单：${this.state.listData||''}`}
                        </span>
                    }
                    <a style={aStyle2} onClick={this.props.upClick}>收起></a>
                </Modal.Title>   
            </Modal.Header>
            <Modal.Body>
            {needmainTable?
                <Row style={{padding:'10px'}}>
                    <Table 
                        columns={mainTableColumns} 
                        data={mainTableList} 
                        className='bd-table'
                        emptyText={() => 
                            <div>
                                <img src={nodataPic} alt="" />
                            </div>
                        }
                        onRowClick={this.onRowClick.bind(this)}
                        rowKey={record => record.id.value}
                    />
                    <Pagination
                        prev
                        next
                        boundaryLinks
                        items={mainTableMaxPage}
                        activePage={mainTablePageIndex}
                        noBorder={true}
                        size='sm'
                        onSelect={this.mainTableHandleSelect.bind(this)}
                        className='iabillPag'
                    />
                </Row>
                :
                <Row>
                    <Col md={12} xs={12} sm={12} mdOffset={2} xsOffset={2} smOffset={2}><div>清单编号：{this.props.payLoad}</div></Col>
                    <Col md={4} xs={4} sm={4} mdOffset={2} xsOffset={2} smOffset={2}><div>清单类型：{mainTableList.iabilltype?mainTableList.iabilltype.value:''}</div></Col>
                    <Col md={4} xs={4} sm={4} mdOffset={2} xsOffset={2} smOffset={2}><div>合约编号：{mainTableList.contractid?mainTableList.contractid.value:''}</div></Col>
                    <Col md={4} xs={4} sm={4} mdOffset={2} xsOffset={2} smOffset={2}><div>币种：{mainTableList.currtypeid?mainTableList.currtypeid.value:''}</div></Col>
                    <Col md={4} xs={4} sm={4} mdOffset={2} xsOffset={2} smOffset={2}><div>还款方式：{mainTableList.returnmode?mainTableList.returnmode.value:''}</div></Col>
                    <Col md={4} xs={4} sm={4} mdOffset={2} xsOffset={2} smOffset={2}><div>借款单位：{mainTableList.loancmpnyid?mainTableList.loancmpnyid.value:''}</div></Col>
                    <Col md={4} xs={4} sm={4} mdOffset={2} xsOffset={2} smOffset={2}><div>贷款机构：{mainTableList.entrustedcmpnyid?mainTableList.entrustedcmpnyid.value:''}</div></Col>
                    <Col md={4} xs={4} sm={4} mdOffset={2} xsOffset={2} smOffset={2}><div>结息日：{mainTableList.settledate?mainTableList.settledate.value:''}</div></Col>
                    <Col md={4} xs={4} sm={4} mdOffset={2} xsOffset={2} smOffset={2}><div>未还本金：{mainTableList.outprincipalmny?mainTableList.outprincipalmny.value:''}</div></Col>
                </Row>
            }
            <Row style={{padding:'10px'}}>
                <Table 
                    columns={assistantTableColumns} 
                    data={assistantTableList} 
                    style={{display:needmainTable?this.state.assistantTableVisble:'block'}} 
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