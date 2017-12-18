
import { Con, Row, Col } from 'bee-layout';
import { Table } from 'tinper-bee';
import { Panel } from 'bee-panel';
import React, { Component } from 'react';
import Button from 'bee-button';
import Modal from 'bee-modal';
import './index.less';
import Tabs, { TabPane } from 'bee-tabs';
import Ajax from '../../../../utils/ajax.js';
const rootURL = window.reqURL.fm + "fm/";
const taburl = [
    {
        title: 'turnin',
        url: rootURL + 'subscribe/search1AppendAcc',
        name: '转入'
    },
    {
        title: 'turnout',
        url: '/tmc-bd-web/bd/transtype/search',
        name: '转出'
    }
]
export default class Myassetmodal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            onclose: false,
            turnin: {
                turnincolumns: [
                    { title: '支付户名/支付账户', key: 'index', dataIndex: 'recaccname', width: 150 },
                    {
                        title: '转入金额（元）', key: 'code', dataIndex: 'money', width: 150,
                        render: (text, record, index) => {
                            return (
                                <div>
                                    <span
                                        onClick={(e) => this.editDone('edit', index, text, record, e)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {text}
                                    </span>
                                </div>
                            )
                        }
                    },
                    { title: '币种', key: 'name', dataIndex: 'currtypename', width: 150 },
                    { title: '转入时间', key: 'memo', dataIndex: 'eventdate', width: 150 },
                    // { title: '转入账户', key: 'banktype', dataIndex: 'banktype.display', width: 100 },
                    // { title: '转入金额(元)', key: 'bankid', dataIndex: 'bankid.display', width: 200 },
                    // { title: '币种', key: 'orgid', dataIndex: 'orgid.display', width: 200 },
                    // { title: '转入时间', key: 'orgid', dataIndex: 'orgid.display', width: 200 }
                ],
                turnindata: []
            },
            turnout: {
                turnoutcolumns: [
                    { title: '支付户名/支付账户', key: 'index', dataIndex: 'recaccname', width: 150 },
                    {
                        title: '转出金额（元）', key: 'code', dataIndex: 'money', width: 150,
                        render: (text, record, index) => {
                            return (
                                <div>
                                    <span
                                        onClick={(e) => this.editDone('edit', index, text, record, e)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {text}
                                    </span>
                                </div>
                            )
                        }
                    },
                    { title: '币种', key: 'name', dataIndex: 'currtypename', width: 150 },
                    { title: '转出时间', key: 'memo', dataIndex: 'eventdate', width: 150 },
                    // { title: '转入账户', key: 'banktype', dataIndex: 'banktype.display', width: 100 },
                    // { title: '转入金额(元)', key: 'bankid', dataIndex: 'bankid.display', width: 200 },
                    // { title: '币种', key: 'orgid', dataIndex: 'orgid.display', width: 200 },
                    // { title: '转入时间', key: 'orgid', dataIndex: 'orgid.display', width: 200 }
                ],
                turnoutdata: []
            },
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
    }
    close(type) {
        this.setState({
            showModal: false
        });
    }
    open() {
        this.setState({
            showModal: true,
        });
    };
    handleturnout = (e) => {
        console.log(e)
        let direct;
        if (e == 'turnout') {
            direct = '1'
        } else if (e == 'turnin') {
            direct = '0'
        }
        Ajax({
            url: rootURL + 'transferacc/findTransferDetail',
            data: {
                page: "0",
                size: "10",
                "searchParams": {
                    "searchMap": {
                        "bankaccount": this.props.eacctno,
                        "direct": direct
                    } 
				} 
            },
            success: (res) => {
                this.setState({
                    turnout: { ...this.state.turnout, turnoutdata: res.data.data }
                })
            },
            error: (res) => {
                // console.log(res)
            }
        })
    }
    componentWillMount() {
        // if (this.state.turnin1 == []) {
            // Ajax({
            //     url: rootURL + 'transferacc/findTransferDetail',
            //     data: {
            //         page: "0",
            //         size: "10",
            //         begdate: "",
            //         enddate: "",
            //         direct: "0"
            //     },
            //     success: (res) => {
            //         console.log(res)
            //         this.setState({
            //             turnin1: res.data.data
            //         }, () => { console.log(turnin1) })
            //     },
            //     error: (res) => {
            //         console.log(res)
            //     }
            // })
        // }

    }
    handleclose = () => {
        this.props.onClose(false);
    }
    render() {
        let { turnincolumns,turnindata } = this.state.turnin;//转入
        let { turnoutcolumns, turnoutdata } = this.state.turnout;//转出
        return (
            (this.props.showModal == true) ? (
                <div className='myassetmodalbox'>
                    <div className="myasset" ref='closetype' >
                        <Tabs
                            defaultActiveKey="turnin"
                            onChange={this.callback}
                            tabBarStyle="upborder"
                            className="demo-tabs"
                            onChange={this.handleturnout}
                        >
                            <TabPane tab='转入' key="turnin">
                                <Table
                                    columns={turnincolumns}
                                    data={this.props.turnindata}
                                    style={{ height: 288 }}

                                />
                            </TabPane>
                            <TabPane tab='转出' key="turnout">
                                <Table
                                    columns={turnoutcolumns}
                                    data={turnoutdata}
                                    style={{ height: 288 }}
                                />
                            </TabPane>
                        </Tabs>
                        <Button className='btnclose' onClick={this.handleclose} >关闭</Button>
                    </div>
                </div>
            ) : null

        )
    }
}
