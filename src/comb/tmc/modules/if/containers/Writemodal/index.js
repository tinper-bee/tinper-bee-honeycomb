
import { Con, Row, Col } from 'bee-layout';
import { Table, FormControl, Form, FormGroup, Select } from 'tinper-bee';
const FormItem = Form.FormItem;
import { Panel } from 'bee-panel';
import Tabs, { TabPane } from 'bee-tabs';
import React, { Component } from 'react';
import Button from 'bee-button';
import Modal from 'bee-modal';
import Refer from '../../../../containers/Refer';//参照
// import refer
import './index.less';

import Ajax from '../../../../utils/ajax.js';
const rootURL = window.reqURL.fm + "fm/";

export default class Lookmodal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            onclose: false,
            licainame: '',
            licai: '',
            jinrong: [],
            bangding: "",
            bangdingname: '',
            kehucode: '',
            productcode: '',// 理财账户编码
            fin: '',//金融机构
            jinrongwdname: '',
            jinrongwdpk: '',
            jinrongwdcode: '',
            jinrongjgname: '',
            jinrongjgpk: '',
            jinrongjgcode: '',
            bankcode: '',//银行账户
            bankname: '',//银行账户名称
            bankpk: '',
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

    }
    componentWillReceiveprops() {
        // this.setState({
        //     turnin: { ...this.state.turnin, turnindata: this.props.turnin }
        // })
    };
    handleajax = () => {
        Ajax({
            url: rootURL + "interests/save",
            data: {
                productcode: this.state.productcode,//理财账户编码
                eacctname: this.state.licainame,//理财账户名称
                eacctno: this.state.licai,//  理财账户
                net_code: this.state.jinrongwdcode,// 金融机构
                net_name: this.state.jinrongwdname,
                custcode: this.state.kehucode,// 客户编码
                account: this.state.bankcode,//绑定账户
                acctbank: this.state.bankname,//绑定账户名称
                fin:this.state.jinrongjgcode,
                finName:this.state.jinrongjgname
            },
            success: (res) => {
                console.log(res);
                this.setState({
                    jinrongwdname: '',
                    jinrongwdpk: '',
                    jinrongwdcode: '',
                    bankcode: '',//银行账户
                    bankname: '',//银行账户名称
                    bankpk: '',
                    licainame: '',
                    licai: '',
                    bangding: "",
                    bangdingname: '',
                    kehucode: '',
                    productcode: '',
                })
                this.props.onClose();
            },
            error: (res) => {
                console.log(res)
            }
        })

    };
    getSelectData = (type) => {
        switch (type) {
            case 'jinrong':
                Ajax({
                    url: rootURL + '/bd/finbranch',
                    success: (res) => {
                        console.log(res);

                    }
                })
                break
        }
    }
    render() {
        return (
            <div className="writemodal">
                <Modal
                    className='modalam'
                    backdrop={false}
                    show={this.props.showModal}
                    onHide={this.close}
                    onClose={this.props.onClose}
                    animation={false}
                    modallook={this.props.modallook}
                >
                    <Modal.Header>
                        <span className='modaltitle'>账户录入</span>
                    </Modal.Header>
                    <div>

                    </div>
                    <div className='modalbodyall'>
                        <Modal.Body>
                            <div className='modalbody'>
                                <FormGroup>
                                    <span className="modal-label">理财产品编码：</span>
                                    <FormControl
                                        className="modal-content"
                                        defult=""
                                        type="text"
                                        placeholder="请输入理财产品编码"
                                        value={this.state.productcode}
                                        onChange={(e) => this.setState({ productcode: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <span className="modal-label">理财账户名称：</span>
                                    <FormControl
                                        className="modal-content"
                                        type="text"
                                        placeholder="请输入理财账户名称"
                                        value={this.state.licainame}
                                        onChange={(e) => this.setState({ licainame: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <span className="modal-label">理财账户：</span>
                                    <FormControl
                                        className="modal-content"
                                        type="text"
                                        placeholder="请输入理财账户"
                                        value={this.state.licai}
                                        onChange={(e) => this.setState({ licai: e.target.value })}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Col className='refstyle'>
                                    <Refer
                                    ctx={'/uitemplate_web'}
                                    refModelUrl={'/bd/finbranchRef/'}
                                    refCode={'finbranchRef'}
                                    refName={'金融机构'}
                                    style={{ 'display': 'flex', ' text-align': 'right' }}
                                    value={{
                                                refname: this.state.jinrongjgname,
                                                refpk: this.state.jinrongjgpk
                                            }}
                                    onChange={value => {
                                        this.setState({
                                            jinrongjgname: value.refname,
                                            jinrongjgpk: value.refpk,
                                            jinrongjgcode: value.refcode,
                                        });
                                    }}
                                    showLabel={true}
                                />
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col className='refstyle'>
                                    <Refer
                                    ctx={'/uitemplate_web'}
                                    refModelUrl={'/bd/finbranchRef/'}
                                    style={{ 'display': 'flex', ' text-align': 'right' }}
                                    refCode={'finbranchRef'}
                                    refName={'金融网点'}
                                    value={{
                                                refname: this.state.jinrongwdname,
                                                refpk: this.state.jinrongwdpk
                                            }}
                                    onChange={value => {
                                        console.log(value)
                                        this.setState({
                                            jinrongwdname: value.refname,
                                            jinrongwdpk: value.refpk,
                                            jinrongwdcode: value.refcode,
                                        });
                                    }}
                                    showLabel={true}
                                    multiLevelMenu={[
                                        {
                                            name: ['金融网点'],
                                            code: ['refname']
                                        }
                                    ]}
                                    clientParam={{
                                        parentid: this.state.jinrongjgpk,
                                        typeCode: this.state.jinrongjgcode
                                    }}
                                />

                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col className='refstyle'>
                                        <Refer
                                            ctx={'/uitemplate_web'}
                                            refModelUrl={'/bd/bankaccbasRef/'}
                                            refCode={'bankaccbasRef'}
                                            refName={'绑定账户'}
                                            style={{ 'display': 'flex', ' text-align': 'right' }}
                                            value={{
                                                refname: this.state.bankname,
                                                refpk: this.state.bankpk
                                            }}
                                            onChange={value => {
                                                console.log(value)
                                                this.setState({
                                                    bankname: value.refname,
                                                    bankcode: value.refcode,
                                                    bankpk: value.refpk
                                                });
                                            }}
                                            showLabel={true}
                                            multiLevelMenu={[
                                                {
                                                    name: ['子户编码', '子户名称'],
                                                    code: ['refcode', 'refname']
                                                }
                                            ]}
                                            clientParam={{
                                                opentime: '2017-11-27 18:19:41'
                                            }}
                                            referFilter={{
                                                accounttype: 0, //01234对应活期、定期、通知、保证金、理财
                                                currtypeid: 'G001ZM0000DEFAULTCURRENCT00000000001' //币种pk
                                                // orgid: '111' //组织pk
                                            }}
                                        />
                                    </Col>
                                </FormGroup>
                                {/* <FormGroup>
                                <span className="modal-label">绑定账户名称：</span>
                                <FormControl
                                    className="modal-content"
                                    type="text"
                                    placeholder="请输入绑定账户名称"
                                    value={this.state.bangdingname}
                                    onChange={(e) => this.setState({ bangdingname: e.target.value })}
                                />
                            </FormGroup> */}
                                <FormGroup>
                                    <span className="modal-label">客户编码：</span>
                                    <FormControl
                                        className="modal-content"
                                        type="text"
                                        placeholder="请输入客户编码"
                                        value={this.state.kehucode}
                                        onChange={(e) => this.setState({ kehucode: e.target.value })}
                                    />
                                </FormGroup>
                            </div>
                        </Modal.Body>
                    </div>
                    <div className='btnstyle'>
                        <Button className='yesbtn' onClick={this.handleajax} shape="border" >确定</Button>
                        <Button className='nobtn' onClick={this.props.onClose} shape="border" >关闭</Button>
                    </div>
                </Modal>
            </div>
        )
    }
}
