import React, { Component } from "react";
import {
    Breadcrumb,
    Con,
    Row,
    Col,
    Dropdown,
    Button,
    Table,
    Icon,
    FormControl,
    Popconfirm,
    Pagination,
    Modal,
    Select,
    Tile
} from "tinper-bee";
import Tabs, { TabPane } from 'bee-tabs';
import Menu, {
    Item as MenuItem,
    Divider,
    SubMenu,
    MenuItemGroup
} from "bee-menus";
import Alert from 'bee-alert';
import Ajax from '../../../../utils/ajax.js';
import { Link } from "react-router";
import DatePicker from "bee-datepicker";
import moment from "moment";
import axios from "axios";
import "./index.less";
const rootURL = window.reqURL.fm + "fm/";
import "../../../../utils/utils.js";

//const bank = ["全部", "广发银行", "上海银行", "浦发银行", "工商银行"];
const banks = [{ key: 0, name: "全部" }, { key: 1, name: "广发银行" }, { key: 2, name: "上海银行" },
{ key: 3, name: "浦发银行" }, { key: 4, name: "工商银行" }];

const balance = 50334565.00;
const yestProfit = 465.00;
const rank = 3;

// const data = [
//     { name: "上海银行灵活理财", code: "1203014", rate: 0.065, amount: 1000000, term: 90, bankname: "广发银行" }
// ];

const rankCols = [{
    title: "热销榜", dataIndex: "rank", key: "rank", width: 300, className: "apply-table",
    render: (text, record, index) => {
        return (
            <div>
                <div className="name">{record.name}</div>
                <div className="code">{record.code}</div>
            </div>
        );
    }
},
{
    title: "", dataIndex: "rate", key: "rate", width: 200, className: "apply-table",
    render: (text, record, index) => {
        return (
            <div>
                <div className="rank-rate">{record.rate * 100}%</div>
                <div className="code">年化利率</div>
            </div>
        );
    }
}
];

const rankData = [
    { name: "上海银行灵活理财", code: "1203014", rate: 0.065, amount: 1000000, term: 90, bankname: "广发银行" },
    { name: "上海银行灵活理财", code: "1203014", rate: 0.065, amount: 1000000, term: 90, bankname: "广发银行" },
    { name: "上海银行灵活理财", code: "1203014", rate: 0.065, amount: 1000000, term: 90, bankname: "广发银行" },
    { name: "上海银行灵活理财", code: "1203014", rate: 0.065, amount: 1000000, term: 90, bankname: "广发银行" }
];

export default class Purchase extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hotProvider: "上海银行",
            hotRate: "5.7%",
            hotName: "广发钱袋子货币A",
            hotFeature: "简单 · 稳定 · 安全",
            banks: banks,
            selBank: 0,
            balance: balance,
            yestProfit: yestProfit,
            isEyeOpen: false,
            rank: rank,
            // columns: columns,
            tableData: [],
            resdata: {},//
            querydata: {},//第二次请求的数据
            rankCols: rankCols,
            rankData: rankData,
            corporate: '',//公司名称 
            eacctname: '',//账户名
            eacctno:'',//账号
            acctbank:'',//绑定银行对公账号
            accstatus: "",//判断是否注册登录激活
            productCode: '',//客户编码    传递下一个页面
            amount:'',//打款金额
            actideadline:'',//最后打款期限
            showAlert: false,
            custcode:'',
            pathif: '',//显示注册框或者申购框
            account:'',//绑定银行对公账号   传递到activation
            purchase: {
                columns: [
                    {
                        title: "名称/代码", dataIndex: "productCode", key: "productCode", width: 200, className: "apply-table",
                     
                    },
                    {
                        title: "年化利率", dataIndex: "sevenDaysOfYield", key: "sevenDaysOfYield", width: 200, className: "apply-table",
                      
                    },
                    {
                        title: "起投金额", dataIndex: "perMillionIncome", key: "perMillionIncome", width: 200, className: "apply-table",
                      
                    },
                    {
                        title: "投资期限", dataIndex: "netWorthDate", key: "term", width: 200, className: "apply-table",
                     
                    },
                    { title: "银行名称", dataIndex: "productName", key: "bankname", width: 300, className: "apply-table" },
                    {
                        title: "",
                        dataIndex: "apply",
                        key: "apply",
                        width: 100,
                        render: (text, record, index) => {
                            return (
                                <Button colors="primary" colors="warning" style={{linheigth:"14"}} onClick={e=>this.handletodetail(index, text, record)}>申购</Button>
                            );
                        }
                    }
                ],
                defaultdata: []
            }
        }
    };
    componentWillMount() {
        Ajax({
            url: rootURL + 'queryinfo/queryproductlist',
            success: (res) => {
                this.setState({
                    resdata: res,
                    productCode: res.data.prdList[0].productCode,
                    purchase: {
                        ...this.state.purchase,
                        defaultdata: res.data.prdList,
                        pathif: res.message
                    }
                })
                    Ajax({
                        url: rootURL + 'interests/queryAcc',
                        data: { productCode: res.data.prdList[0].productCode },
                        success: (res) => {
                            console.log(res)
                            this.setState({
                                account:res.data.account,
                                actideadline:res.data.actideadline,
                                amount:res.data.amount,//打款金额
                                eacctname:res.data.eacctname,//账户名
                                eacctno:res.data.eacctno,// 账户
                                custcode:res.data.custcode,//产品编码
                                acctbank:res.data.acctbank,//对公账户
                                accstatus:res.data.accstatus,//状态码
                                querydata: res
                            },()=>{
                                    var unixTimestamp = new Date(this.state.actideadline ) ;
                                    let commonTime = unixTimestamp.toLocaleString();
                                    this.setState({
                                        actideadline:commonTime
                                    })
                                })
                        }
                    })
            },
            error :(res)=>{
                console.log(res)
            }
        })
    }

    handletodetail = (index, text, record) => {
        this.props.router.push({
            pathname: '/if/detail',
            state: {
                detailName: record.productName,
                detailCode:record.productCode,
                custcode: this.state.custcode,
                eacctname:this.state.eacctname,
                eacctno:this.state.eacctno,
            }
        });
    }
    
    handleClick = (type) => {
        switch (type) {
            case 'apply':
            this.props.router.push({
                pathname: '/if/myasset',
            });
            break;
            case 'state':
            this.props.router.push({
                pathname: '/if/myasset',
            });
            break;
            case 'ledger':
            this.props.router.push({
                pathname: '/if/myasset',
            });
            break;
        }

    }
    handleregister = (type) => {
        if(type=='register'){
            this.props.router.push({
                pathname: '/if/register',
                state: {
                    productCode: this.state.productCode,
                }
            });
        } else if(type=='activation'){
            this.props.router.push({
                pathname: '/if/activation', 
                state: {
                    custcode:this.state.custcode,
                    actideadline:this.state.actideadline,
                    amount:this.state.amount,
                    acctbank:this.state.acctbank,
                    eacctno:this.state.eacctno,
                    eacctname:this.state.eacctname,
                    account:this.state.account,
                    productCode: this.state.productCode,
                    accstatus:this.state.accstatus
                }
            });
        }
       
    }
    render() {
        const { hotProvider, hotRate, hotName, hotFeature, banks, balance, yestProfit, rank, isEyeOpen, tableData, rankData, purchase } = this.state;
        return (
            <Row className="credit-wraps">
                {/* 面包屑 */}
                {/* xs	移动设备显示列数(<768px)
                sm	小屏幕桌面设备显示列数(≥768px)
                md	中等屏幕设备显示列数(≥992px)*/}
                {/* 筛选界面 */}
                <Col md={12} xs={12} sm={12}>
                    <div className="filter-bar">
                        <Row> 
                            <Tabs
                                defaultActiveKey="1"
                                onChange={this.callback}
                                tabBarStyle="upborder"
                                className="demo-tabs"
                            >
                                <TabPane tab='上海银行' key="1">
                                    <div className='boxpng'>
                                     {
                                        this.state.accstatus == '1'
                                        ||
                                        this.state.accstatus == '2'
                                        ||
                                        this.state.accstatus == '4'
                                        &&
                                        <Row className='registerbox register1 register3'>
                                        <Col className='register' lg={4} lgOffset={8}>
                                            <h2>欢迎！</h2>
                                            <div><span className='fontcolor'>户名：</span><span className='fontcolor'>{this.state.eacctname}</span></div>
                                            <div><span className='fontcolor'>账号：</span><span className='fontcolor'>{this.state.eacctno}</span></div>
                                            <Button className='registerbtn' onClick={()=>this.handleregister('activation')}>立即激活</Button>
                                        </Col>
                                    </Row>} 

                                    { 
                                        this.state.accstatus =='0' 
                                        ||
                                        this.state.accstatus =='5' 
                                        &&
                                    <Row className='registerbox register3'>
                                        <Col className='register' lg={4} lgOffset={8}>
                                            <h2>您好！</h2>
                                            <div>您现在还未注册上海银行理财账户，</div>
                                            <div>是否现在注册</div>
                                            <Button className='registerbtn' onClick={()=>this.handleregister('register')}>立即注册</Button>
                                        </Col>
                                    </Row>}
                                    {this.state.accstatus == '3' &&
                                    <Row className='registerbox register2'>
                                        <Col className='register1' lg={4} lgOffset={8}>
                                            <div className='welcomeac'>
                                                <span>欢迎{this.state.querydata.data.eacctname}</span> 
                                            </div>
                                            <div className='disbox'>
                                                <div className='disstyle'>
                                                    <span>账号:</span>
                                                    <span className='disclild'>{this.state.querydata.data.eacctno}</span>
                                                </div>
                                                <div className='disstyle'>
                                                    <span>余额:</span>
                                                    <span className='disclild'>{this.state.querydata.data.balance}</span>
                                                </div>
                                            </div>
                                            <Button className='disbtn' onClick={()=>this.handleClick('apply')}>历史申购</Button>
                                            <Button className='disbtn' onClick={()=>this.handleClick('state')}>申购状态</Button>
                                            <Button className='disbtn' onClick={()=>this.handleClick('ledger')}>投资台账</Button>
                                        </Col>
                                    </Row>} 

                                    <Row>
                                        <Col md={12} xs={12} sm={12} className='productDetailed'>
                                            <Col md={9} xs={9} sm={9}><span className='productDetailedspan'>我的产品明细</span></Col>
                                        </Col>
                                        <Col md={12} xs={12} sm={12}>
                                            <div className="table-container">
                                                <div className="left-table">
                                                    <Table bordered
                                                        data={purchase.defaultdata}
                                                        columns={purchase.columns}
                                                    />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                    </div>
                                </TabPane>
                                {/* <TabPane tab='建设银行' key="2">
                                    {(!this.state.pathif) ?
                                        <Row className='registerbox'>
                                            <Col className='register' lg={4} lgOffset={8}>
                                                <h2>您好！</h2>
                                                <div>您现在还未注册上海银行理财账户，</div>
                                                <div>是否现在注册</div>
                                                <Button className='registerbtn' onClick={this.handleregister}>立即注册</Button>
                                            </Col>
                                        </Row>
                                        :
                                        <Row className='registerbox'>

                                            <Col className='register1' lg={4} lgOffset={8}>
                                                <div><span>欢迎某某某公司</span>    <span>账户名：{}</span></div>
                                                <div className='disbox' style={{ 'display': 'flex' }}>
                                                    <div className='disstyle'>
                                                        <h5 className='dish1'>654654654</h5>
                                                        <h5 className='dish2'>昨日收益（元）</h5>
                                                    </div>
                                                    <div className='disstyle'>
                                                        <h5 className='dish1'>54654654</h5>
                                                        <h5 className='dish2'>累计收入（元）</h5>
                                                    </div>
                                                </div>
                                                <Button className='disbtn'>历史申购</Button>
                                                <Button className='disbtn'>申购状态</Button>
                                                <Button className='disbtn'>投资台账</Button>
                                            </Col>
                                        </Row>
                                    }
                                    <Row>
                                        <Col md={12} xs={12} sm={12} className='productDetailed'>
                                            <Col md={9} xs={9} sm={9}><span className='productDetailedspan'>我的产品明细</span></Col>
                                            <Col md={3} xs={3} sm={3}>
                                                <div className="credit-search">
                                                    <FormControl
                                                        value={this.state.keyWords}
                                                        onChange={this.handleSearchChange}
                                                        placeholder="搜索产品关键词"
                                                    />
                                                    <Icon type="uf-search" onClick={this.handleSearch} />
                                                </div>
                                            </Col>
                                        </Col>
                                        <Col md={12} xs={12} sm={12}>
                                            <div className="table-container">
                                                <Row>
                                                    <Col>
                                                        <div className="left-table">
                                                            <Table bordered
                                                                data={purchase.defaultdata}
                                                                columns={purchase.columns}
                                                            />

                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </TabPane>
                                <TabPane tab='工商银行' key="3">
                                    {(!this.state.pathif) ?
                                        <Row className='registerbox'>
                                            <Col className='register' lg={4} lgOffset={8}>
                                                <h2>您好！</h2>
                                                <div>您现在还未注册上海银行理财账户，</div>
                                                <div>是否现在注册</div>
                                                <Button className='registerbtn' onClick={this.handleregister}>立即注册</Button>
                                            </Col>
                                        </Row>
                                        :
                                        <Row className='registerbox'>

                                            <Col className='register1' lg={4} lgOffset={8}>
                                                <div><span>欢迎某某某公司</span>    <span>账户名：{}</span></div>
                                                <div className='disbox' style={{ 'display': 'flex' }}>
                                                    <div className='disstyle'>
                                                        <h5 className='dish1'>654654654</h5>
                                                        <h5 className='dish2'>昨日收益（元）</h5>
                                                    </div>
                                                    <div className='disstyle'>
                                                        <h5 className='dish1'>54654654</h5>
                                                        <h5 className='dish2'>累计收入（元）</h5>
                                                    </div>
                                                </div>
                                                <Button className='disbtn'>历史申购</Button>
                                                <Button className='disbtn'>申购状态</Button>
                                                <Button className='disbtn'>投资台账</Button>
                                            </Col>
                                        </Row>
                                    }
                                    <Row>
                                        <Col md={12} xs={12} sm={12} className='productDetailed'>
                                            <Col md={9} xs={9} sm={9}><span className='productDetailedspan'>我的产品明细</span></Col>
                                            <Col md={3} xs={3} sm={3}>
                                                <div className="credit-search">
                                                    <FormControl
                                                        value={this.state.keyWords}
                                                        onChange={this.handleSearchChange}
                                                        placeholder="搜索产品关键词"
                                                    />
                                                    <Icon type="uf-search" onClick={this.handleSearch} />
                                                </div>
                                            </Col>
                                        </Col>
                                        <Col md={12} xs={12} sm={12}>
                                            <div className="table-container">
                                                <Row>
                                                    <Col>
                                                        <div className="left-table">
                                                            <Table bordered
                                                                data={purchase.defaultdata}
                                                                columns={purchase.columns}
                                                            />

                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                    </Row>
                                </TabPane> */}
                            </Tabs>
                        </Row>
                    </div>
                </Col>

            </Row>
        );
    }
}
