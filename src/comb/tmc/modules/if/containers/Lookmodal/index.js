
import { Con, Row, Col } from 'bee-layout';
import { Table, FormControl, Form } from 'tinper-bee';
import { Panel } from 'bee-panel';
import Tabs, { TabPane } from 'bee-tabs';
import React, { Component } from 'react';
import Button from 'bee-button';
import Modal from 'bee-modal';
import './index.less';
import Ajax from '../../../../utils/ajax.js';
const rootURL = window.reqURL.fm + "fm/";

export default class Lookmodal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            onclose: false,
            turnin: {
                turnincolumns: [
                    { title: '申购时间', key: 'index', dataIndex: 'key', width: 150 },
                    {
                        title: '申购金额（元）', key: 'code', dataIndex: 'code.display', width: 150,
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
                    { title: '币种', key: 'name', dataIndex: 'name.display', width: 150 },
                    // { title: '转入时间', key: 'memo', dataIndex: 'memo.display', width: 150 },
                    // { title: '转入账户', key: 'banktype', dataIndex: 'banktype.display', width: 100 },
                    // { title: '转入金额(元)', key: 'bankid', dataIndex: 'bankid.display', width: 200 },
                    // { title: '币种', key: 'orgid', dataIndex: 'orgid.display', width: 200 },
                    // { title: '转入时间', key: 'orgid', dataIndex: 'orgid.display', width: 200 }
                ],
                turnindata: [this.props.modallook]
            },
            turnout: {
                turnoutcolumns: [
                    { title: '赎回时间', key: 'index', dataIndex: 'key', width: 150 },
                    {
                        title: '赎回金额（元）', key: 'code', dataIndex: 'code.display', width: 150,
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
                    { title: '币种', key: 'name', dataIndex: 'name.display', width: 150 },
                    // { title: '转出时间', key: 'memo', dataIndex: 'memo.display', width: 150 },
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
    componentDidMount() {

    }
    close(type) {
        this.setState({
            showModal: false
        });
    }
    open() {
        this.setState({
            showModal: true
        });
    };
    dataFormatasset = () => {

    };
    callback = (type) => {
        switch (type) {
            case '':
                break;
            case '':
                break;
        }
    }
    handleturnout = () => {
        Ajax({
            url:rootURL+"redemption/search",
            data:{
                pageSize:"10",
                pageIndex:"0",
                prdcode:"000523"
            },
            success:(res)=>{
                console.log(res);
            }
        })
    }
    componentWillReceiveprops() {
        this.setState({
            turnin: { ...this.state.turnin, turnindata: this.props.turnin }
        })
    }
    render() {
        let { turnincolumns, turnindata } = this.state.turnin;//转入
        let { turnoutcolumns, turnoutdata } = this.state.turnout;//转出
        return (
            <div className="myasset">
                <Modal
                    className='modalam'
                    backdrop={false}
                    show={this.props.showModal}
                    onHide={this.close}
                    onClose={this.props.onClose}
                    animation={false}
                    turnin={this.props.turnin}
                    modallook={this.props.modallook}
                >
                    <Modal.Header>
                        <span className='modaltitle'>查看记录</span>
                    </Modal.Header>
                    <div>

                    </div>
                    <Modal.Body>
                        <div className='modalbody'>
                            <Tabs
                                defaultActiveKey="turnin"
                                onChange={this.callback}
                                tabBarStyle="upborder"
                                className="demo-tabs"
                                onChange={this.handleturnout}
                            >
                                <TabPane tab='申购记录' key="turnin">
                                    <Table
                                        columns={turnincolumns}
                                        data={this.dataFormatasset(turnindata)}
                                        style={{ height: 288 }}

                                    />
                                </TabPane>
                                <TabPane tab='赎回记录' key="turnout">
                                    <Table
                                        columns={turnoutcolumns}
                                        data={this.dataFormatasset(turnoutdata)}
                                        style={{ height: 288 }}
                                    />
                                </TabPane>
                            </Tabs>
                        </div>
                    </Modal.Body>
                    <Button className='modalbtn' onClick={this.props.onClose} shape="border" style={{ marginRight: 50 }}>关闭</Button>
                </Modal>
            </div>
        )
    }
}
