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
    Popconfirm,
    Pagination,
    Modal,
    Select,
    Tile
} from "tinper-bee";
import FormControl from 'bee-form-control';
import Menu, {
    Item as MenuItem,
    Divider,
    SubMenu,
    MenuItemGroup
} from "bee-menus";
import Alert from 'bee-alert';
import { Link } from "react-router";
import DatePicker from "bee-datepicker";
import DeleteModal from '../../../../containers/DeleteModal';
import moment from "moment";
import Ajax from '../../../../utils/ajax.js';
import Tabs, { TabPane } from 'bee-tabs';
import { toast } from '../../../../utils/utils.js';
import InputForm from "../../containers/modalForm";
import Form from 'bee-form';
import FormGroup from 'bee-form-group';
import Refer from '../../../../containers/Refer'
import PageJump from '../../../../containers/PageJump';
import Myassetmodal from '../../containers/myassetmodal/index'
import "./index.less";

const balance = 50334565.00;
const yestProfit = 465.00;
const rank = 3;
const FormItem = Form.FormItem;
const format = 'YYYY-MM-DD';

//请求路劲
const rootURL = window.reqURL.fm;

const tableMap = {
    accountcenter: {
        url: rootURL + 'fm/subscribe/pageQueryOffline',
        addUrl: rootURL + 'fm/subscribe/saveOffline',
        delUrl: rootURL + 'fm/subscribe/deleteOffline'
    },
    redeemasset: {
        url: rootURL + 'fm/redemption/pageQueryOffline',
        addUrl: rootURL + 'fm/redemption/saveOffline',
        delUrl: rootURL + 'fm/redemption/deleteOffline'
    },
    recordcenter: {
        url: rootURL + 'fm/investtrans/pageQueryOffline',
        addUrl: rootURL + 'fm/investtrans/saveOffline',
        delUrl: rootURL + 'fm/investtrans/deleteOffline'
    },
    recordout: {
        url: 'fm/investtrans/pageQueryOffline',
        addUrl: 'fm/investtrans/saveOffline',
        delUrl: 'fm/investtrans/deleteOffline'
    }
}





const modalColumns = [
    { title: "转入金额", key: "code", type: "inchange" },
    { title: "转出金额", key: "name", type: "outchange" }
];

export default class Offline extends Component {
    constructor() {
        super();
        this.state = {
            assetstatus: '',
            searchUrl: '',//模糊查询请求路径
            assetId: '',//赎回传入ID
            activeKey: "acCenter",//竖直tabs默认显示页签
            newUrl: '',//最近请求路劲
            accentData: '',//最近渲染表格
            start: 0,
            showModal: false,
            showModal1: false,
            showModal2: false,
            showModal3: false,
            showModal4: false,
            showModal5: false,
            eacctcode:'',
            pageSize: 10,
            status:0,
            pageIndex: 1,
            maxPage: 1,
            currentRecord: {},
			currentIndex: 0,
            totalSize: 0,
            modalIn: 'slide_body slide_in',
			modalOut: 'slide_body slide_out',
            hotProvoder: "上海银行提供",
            yestDayIncome: [],
            totleIncome: [],
            referCode: '',
            banks: [],
            bank:{},
            bankCur: {},

            acCenterCurTab:'accountcenter',
            acInfoCurTab: 'recordcenter', 
            acInvesttransTab: 'recordcenter',

            redumpall:'',
            amtall:'',
            keyWords: '',//模糊搜索关键字
            selBank: 0,
            balance: balance,
            yestProfit: yestProfit,
            isEyeOpen: false,
            rank: rank,
            modalColumns: {//父子组件数据传递中间件
                accountbalance: "1",
                moneyaccpunt: "123456484654",//理财账户跳转传过来
                assetproduct: "天猫",
                account: "",
                accountbalance: '',
                eacctno: '',
                eacctname: '',
                acctbank: '',
            },
            isShowApply: false,//申购录入、赎回录入按钮默认显示
            pageinfo: {
                number: 0, //当前第几页
                numberOfElements: 0, //当页多少条数据
                size: 10, //每页数据的数量
                totalElements: 0, //总记录条数
                totalPages: 1 //总页数
            },
            operation: '',//弹出层类型

            //账户中心
            //申购
            accountcenter: {
                columns: [
                    { 
                        title: '名称/代码', 
                        key: 'prdcode', 
                        dataIndex: 'prdcode.value', 
                        width: 100,
                        render(text, record, index) {
                            return (
                                <div>
                                    <span>{record.prdname ? ( record.prdname.display || record.prdname.value ) : '——'}</span>
                                    <br/>
                                    <span>{record.prdcode ? ( record.prdcode.display || record.prdcode.value ) : '——'}</span>
                                </div>
                            )
                        }
                    },
                    { 
                        title: '申购金额(元)', 
                        key: 'amtmoney', 
                        dataIndex: 'amtmoney.value', 
                        width: 150,
                        render(text, record, index) {
                            return (
                                <div>
                                    <span>{record.amtmoney ? ( record.amtmoney.display || record.amtmoney.value ) : '——'}</span>
                                </div>
                            )
                        } 
                    },
                    { 
                        title: '累计收益(元)', 
                        key: 'incomeamt', 
                        dataIndex: 'incomeamt.value', 
                        width: 200,
                        render(text, record, index) {
                            return (
                                <div>
                                    <span>{record.incomeamt ? ( record.incomeamt.display || record.incomeamt.value ) : '——'}</span>
                                </div>
                            )
                        } 
                    },
                    { 
                        title: '已赎回金额', 
                        key: 'redemptionedamt', 
                        dataIndex: 'redemptionedamt.value', 
                        width: 200,
                        render(text, record, index) {
                            return (
                                <div>
                                    <span>{record.redemptionedamt ? ( record.redemptionedamt.display || record.redemptionedamt.value ) : '——'}</span>
                                </div>
                            )
                        } 
                    },
                    { 
                        title: '银行名称', 
                        key: 'bankname', 
                        dataIndex: 'bankname.value', 
                        width: 150,
                        render(text, record, index) {
                            return (
                                <div>
                                    <span>{record.bankname ? ( record.bankname.display || record.bankname.value ) : '——'}</span>
                                </div>
                            )
                        } 
                    },
                    { 
                        title: '状态', 
                        key: 'vbillstatus', 
                        dataIndex: 'vbliistatus.value', 
                        width: 200,
                        render(text, record, index) {
                            let vbillstatus= record.vbillstatus && record.vbillstatus.value;
                            let vbillName= vbillstatus== 0 ? '待提交' : (vbillstatus== 3 ? '待审批' : (vbillstatus== 2 ? '审批中' : '已审批'));
                            return (
                                <div>
                                    <span>{ vbillName }</span>
                                </div>
                            )
                        }
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        width: 200,
                        render: (text, record, index) => {
                            let status = record.vbillstatus&&record.vbillstatus.value
                            if( status == 0 ) {
                                return (
                                    <div>
                                        <span>
                                            <Icon
                                                className="iconfont icon-bianji icon-style"
                                                onClick={(e) => this.editDone2(index, text, record, e)}
                                            />
                                        </span>
                                        <span> </span>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={() => {
                                                //debugger
                                                this.setState({
                                                    currentRecord: JSON.parse(JSON.stringify(record))
                                                });
                                                //debugger
                                                console.log(this.state.currentRecord,index,'1000000')
                                            }}
                                        >
                                            <DeleteModal
                                                onConfirm= {() => {this.delRow(this.state.currentRecord,'accountcenter',tableMap['accountcenter'].delUrl);}}
                                            />
                                        </span>
                                        <span> </span>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={()=>{
                                                this.handleCommit('accountcenter', record, 'fm/subscribe/commit');
                                            }}
                                        >
                                            <Icon 
                                                data-tooltip='提交' 
                                                className="iconfont icon-tijiao icon-style"
                                            />
                                        </span>
                                    </div>
                                )
                            }else if(status == 3) {
                                return (
                                    <div>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                        >
                                            <Icon data-tooltip='收回' 
                                                className="iconfont icon-shouhui icon-style"
                                                onClick={()=>{
                                                    this.handleCommit('accountcenter', record, 'fm/subscribe/unCommit');
                                                }} 
                                            />
                                        </span>
                                    </div>
                                )
                            }else if(status == 2) {
                                return (
                                    <div>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                        >
                                            <Icon data-tooltip='审批流程' 
                                                className="iconfont icon-shenpi icon-style"
                                                style={{color:'#fd3d39'}}
                                                onClick={()=>{}}
                                            />
                                            {/* 审批流程 */}
                                        </span>
                                    </div>
                                )
                            }else {
                                return ''
                            }
                        }
                    }
                ],
                incode:'eAcctNo'
            },

            //申购列表数据
            accountcenterdata: [],

            //申购编辑数据
            applyindata:{
                prdname:{},
                prdcode:{},
                amtmoney:{},
                rate:{},
                investlimit:{},
                subscribetime:{},
                prodstarttime:{},
                prodendtime:{},
                id:{},
                ts:{},
                tenantid:{}
            },

            //赎回
            redeemasset: {
                redeemcolumns: [
                    {
                        title: '名称/代码', 
                        key: 'prdcode', 
                        dataIndex: 'prdcode.value', 
                        width: 100,
                        render(text, record, index) {
                            return (
                                <div>
                                    <span>{record.prdname ? ( record.prdname.display || record.prdname.value ) : '——'}</span>
                                    <br/>
                                    <span>{record.prdcode ? ( record.prdcode.display || record.prdcode.value ) : '——'}</span>
                                </div>
                            )
                        }
                    },
                    { 
                        title: '赎回金额', 
                        key: 'redemptionamt', 
                        dataIndex: 'redemptionamt.value', 
                        width: 150,
                        render(text, record, index) {
                            return (
                                <div>
                                    <span>{record.redemptionamt ? ( record.redemptionamt.display || record.redemptionamt.value ) : '——'}</span>
                                </div>
                            )
                        } 
                    },
                    { 
                        title: '赎回时间', 
                        key: 'redemptiontime', 
                        dataIndex: 'redemptiontime.value', 
                        width: 300,
                        render(text, record, index) {
                            return (
                                <div>
                                    <span>{record.redemptiontime ? ( record.redemptiontime.display || record.redemptiontime.value ) : '——'}</span>
                                </div>
                            )
                        } 
                    },
					{ 
                        title: '状态', 
                        key: 'vbillstatus', 
                        dataIndex: 'vbliistatus.value', 
                        width: 300,
                        render(text, record, index) {
                            let vbillstatus= record.vbillstatus&&record.vbillstatus.value;
                            let vbillName= vbillstatus== 0 ? '待提交' : (vbillstatus== 3 ? '待审批' : (vbillstatus== 2 ? '审批中' : '已审批'));
                            return (
                                <div>
                                    <span>{ vbillName }</span>
                                </div>
                            )
                        }
                    },
					{
                        title: '操作',
                        key: 'operation',
                        width: 200,
                        render: (text, record, index) => {
                            let status = record.vbillstatus && record.vbillstatus.value
                            if( status == 0 ) {
                                return (
                                    <div>
                                        <span>
                                            <Icon
                                                className="iconfont icon-bianji icon-style"
                                                onClick={(e) => this.editDone3(index, text, record, e)}
                                            />
                                        </span>
                                        <span> </span>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={() => {
                                                //debugger
                                                this.setState({
                                                    currentRecord: JSON.parse(JSON.stringify(record))
                                                });
                                                //debugger
                                                console.log(this.state.currentRecord,index,'1000000')
                                            }}
                                        >
                                            <DeleteModal
                                                onConfirm= {() => {this.delRow(this.state.currentRecord,'redeemasset',tableMap['redeemasset'].delUrl);}}
                                            />
                                        </span>
                                        <span> </span>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={()=>{
                                                this.handleCommit('redeemasset', record, 'fm/redemption/commit');
                                            }    
                                            }
                                        >
                                            <Icon 
                                                data-tooltip='提交' 
                                                className="iconfont icon-tijiao icon-style"
                                            />
                                        </span>
                                    </div>
                                )
                            }else if(status == 3) {
                                return (
                                    <div>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={()=>{
                                                this.handleCommit('redeemasset', record, 'fm/redemption/unCommit');
                                            }}
                                        >
                                            <Icon 
                                                data-tooltip='收回' 
                                                className="iconfont icon-shouhui icon-style"
                                            />
                                        </span>
                                    </div>
                                )
                            }else if(status == 2) {
                                return (
                                    <div>
                                        <span>审批流程</span>
                                    </div>
                                )
                            }else {
                                return ''
                            }
                        }
                    }
                ],
                incode:'accreceive_code'
            },

            //赎回表格数据
            redeemassetdata: [],

            //赎回编辑页
            redeemindata:{
                prdname:{},
                prdcode:{},
                redemptionamt:{},
                redemptiontime:{},
                id:{},
                ts:{},
                tenantid:{}
            },

            //账户信息
            //转入
            recordcenter: {
                recordcolumns: [
					{ 
                        title: '付款银行', 
                        key: 'accpay_name', 
                        dataIndex: 'accpay_name', 
                        width: 100,
                        render(text, record, index) {
                            return (
                                 <div>{record.accpay_name ? ( record.accpay_name.display || record.accpay_name.value) : '——'}</div>
                            )
                        } 
                    },
					{ 
                        title: '付款账户', 
                        key: 'accpay_code', 
                        dataIndex: 'accpay_code.value', 
                        width: 100,
                        // render(text, record, index) {
                        //     return (
                        //         <div>{text}</div>
                        //     )
                        // }  
                    },
                    { 
                        title: '转入金额', 
                        key: 'amount', 
                        dataIndex: 'amount.value', 
                        width: 100,
                        // render() {
                        //     return (
                        //         <div>111</div>
                        //     )
                        // }   
                    },
                    { 
                        title: '转入时间', 
                        key: 'transtime', 
                        dataIndex: 'transtime.value', 
                        width: 200,
                        // render(transtime) {
                        //     return (
                        //         <div>{transtime}</div>
                        //     )
                        // } 
                    },
                    { 
                        title: '审核状态', 
                        key: 'vbillstatus', 
                        dataIndex: 'vbillstatus.value', 
                        width: 100,
                        render(text, record, index) {
                            let vbillstatus= record.vbillstatus && record.vbillstatus.value;
                            let vbillName= vbillstatus== 0 ? '待提交' : (vbillstatus== 3 ? '待审批' : (vbillstatus== 2 ? '审批中' : '已审批'));
                            return (
                                <div>
                                    <span>{ vbillName }</span>
                                </div>
                            )
                        }
                    },
					{
                        title: '操作',
                        key: 'cz',
                        width: 200,
                        render: (text, record, index) => {
                            let status = record.vbillstatus && record.vbillstatus.value
                            if( status == 0 ) {
                                return (
                                    <div>
                                        <span>
                                            <Icon
                                                className="iconfont icon-bianji icon-style"
                                                onClick={(e) => this.editDone4(index, text, record, e)}
                                            />
                                        </span>
                                        <span> </span>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={() => {
                                                //debugger
                                                this.setState({
                                                    currentRecord: JSON.parse(JSON.stringify(record))
                                                });
                                                //debugger
                                                console.log(this.state.currentRecord,index,'1000000')
                                            }}
                                        >
                                            <DeleteModal
                                                onConfirm= {() => {this.delRow(this.state.currentRecord,'recordcenter',tableMap['recordcenter'].delUrl);}}
                                            />
                                        </span>
                                        <span> </span>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={()=>{
                                                this.handleCommit('recordcenter', record, 'fm/investtrans/commit');
                                            }}
                                        >
                                            <Icon 
                                                data-tooltip='提交' 
                                                className="iconfont icon-tijiao icon-style"
                                            />
                                        </span>
                                    </div>
                                )
                            }else if(status == 3) {
                                return (
                                    <div>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={()=>{
                                                this.handleCommit('recordcenter', record, 'fm/investtrans/unCommit');
                                            }}
                                        >
                                            <Icon 
                                                data-tooltip='收回' 
                                                className="iconfont icon-shouhui icon-style"
                                            />
                                        </span>
                                    </div>
                                )
                            }else if(status == 2) {
                                return (
                                    <div>
                                        <span>审批流程</span>
                                    </div>
                                )
                            }else {
                                return ''
                            }
                            
                        }
                    }
                ],
                incode:'accreceive_code'
            },

            //转入录入列表数据
            recordcenterdata: [],

            //转入录入编辑界面
            turnindata:{
                accpay_name:{},
                accpay_code:{},
                amount:{},
                transtime:{},
                accreceive_code:{},
                accreceive_name:{},
                id:{},
                ts:{},
                tenantid:{}
            },

            //转出
            recordout: {
                recordcenter_outcolumns: [
                    { 
                        title: '收款银行', 
                        key: 'accreceive_name', 
                        dataIndex: 'accreceive_name.value', 
                        width: 100,
                    },
					{ 
                        title: '收款账户', 
                        key: 'accreceive_code', 
                        dataIndex: 'accreceive_code',
                        width: 100 
                    },
                    { 
                        title: '转出金额', 
                        key: 'amount', 
                        dataIndex: 'amount.value', 
                        width: 100 
                    },
                    { 
                        title: '转出时间', 
                        key: 'transtime', 
                        dataIndex: 'transtime.value', 
                        width: 200 
                    },
                    { 
                        title: '审核状态', 
                        key: 'vbillstatus', 
                        dataIndex: 'vbillstatus.value', 
                        width: 100,
                        render(text, record, index) {
                            let vbillstatus= record.vbillstatus && record.vbillstatus.value;
                            let vbillName= vbillstatus== 0 ? '待提交' : (vbillstatus== 3 ? '待审批' : (vbillstatus== 2 ? '审批中' : '已审批'));
                            return (
                                <div>
                                    <span>{ vbillName }</span>
                                </div>
                            )
                        } 
                    },
					{
                        title: '操作',
                        key: 'operation',
                        width: 200,
                        render: (text, record, index) => {
                            let status = record.vbillstatus && record.vbillstatus.value;
                            if( status == 0 ) {
                                return (
                                    <div>
                                        <span>
                                            <Icon
                                                className="iconfont icon-bianji icon-style"
                                                onClick={(e) => this.editDone5(index, text, record, e)}
                                            />
                                        </span>
                                        <span> </span>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={() => {
                                                //debugger
                                                this.setState({
                                                    currentRecord: JSON.parse(JSON.stringify(record))
                                                });
                                                //debugger
                                                console.log(this.state.currentRecord,index,'1000000')
                                            }}
                                        >
                                            <DeleteModal
                                                onConfirm= {() => {this.delRow(this.state.currentRecord,'recordout',tableMap['recordout'].delUrl);}}
                                            />
                                        </span>
                                        <span> </span>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={()=>{
                                                this.handleCommit('recordout', record, 'fm/investtrans/commit');
                                            }    
                                            }
                                        >
                                            <Icon 
                                                data-tooltip='提交' 
                                                className="iconfont icon-tijiao icon-style"
                                            />
                                        </span>
                                    </div>
                                )
                            }else if(status == 3) {
                                return (
                                    <div>
                                        <span
                                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                                            onClick={()=>{
                                                this.handleCommit('recordout', record, 'fm/investtrans/unCommit');
                                            }    
                                            }
                                        >
                                            <Icon 
                                                data-tooltip='收回' 
                                                className="iconfont icon-shouhui icon-style"
                                            />
                                        </span>
                                    </div>
                                )
                            }else if(status == 2) {
                                return (
                                    <div>
                                        <span>审批流程</span>
                                    </div>
                                )
                            }else {
                                return ''
                            }
                        }
                    }
                ],
                incode:'accpay_code'
            },

            //转出录入列表数据
            recordoutdata: [],

            //转出录入编辑页
            turnoutdata:{
                accreceive_name:{},
                accreceive_code:{},
                amount:{},
                transtime:{},
                accpay_name:{},
                accpay_code:{},
                id:{},
                ts:{},
                tenantid:{}
            }
        };
    }

    //申购赎回转入转出提交、收回功能
    handleCommit = (table, record, url)=>{
        const _this = this;
        let { pageIndex, pageSize, bankCur } = _this.state
        console.log(table, bankCur)
        const data = {
            data:{
                head:{
                    rows: [
                        {
                            vbillstatus:0, 
                            values: {
                                id: {
                                    value: record.id.value
                                },
                                status:{
                                    value:3
                                },
                                ts:{ 
                                    value:record.ts.value 
                                },
                                tenantid:{ 
                                    value:record.tenantid.value
                                },
                                vbillcode:{ 
                                    value:record.vbillcode.value
                                },
                                accreceive_name:{
                                    value:record.accreceive_name.value
                                },
                                dr:{
                                    value:0
                                }
                            }   
                        }
                    ]
                }
            }
        }
        if(url=='fm/investtrans/commit'||url=='fm/investtrans/unCommit'){
            //console.log(data.data.head.rows[0],'investtrans')
            data.data.head.rows[0].values.istransin = record.istransin
            //console.log(record.istransin)
        }
        Ajax({
            url: rootURL+ url,
            data: data,
            success: function(res) {
                console.log(res,'commit');
                _this.getOfflineList(table, _this.state.pageIndex, _this.state.pageSize, _this.state.bankCur.code);
            },
            error: function(res){

            }
        })
    }

    componentDidMount () {
        this.getBank();
    };

    //查询账户
    getBank = ()=>{
        const _this = this;
        Ajax({
            url:rootURL+'fm/subscribe/queryAcc',
            data:{
                    
            },
            success:function( res ) {
                let { data } = res;
                _this.setState({
                    banks:res.data,
                    bankCur: res.data[0]
                })
                console.log(res,'queryAcc') 
                _this.getOfflineList('accountcenter', _this.state.pageIndex, _this.state.pageSize, _this.state.bankCur.code);
            }
        })
    }

    getOfflineList = (table, page, size, code) => {
        console.log(table, page, size, code)
        let _this = this;
        let { keyWords, bankCur }  = this.state;
        let inputCode = _this.state[table].incode 
        console.log(_this.state, inputCode)

        Ajax({
            url: tableMap[table].url,
            data:{
                page:page - 1,
                size,
                searchParams:{
                    searchMap:{
                        KeyWords: keyWords,
                        [inputCode]:code
                    }
                }
            },
            success: function(res) {
                const { data, message, success } = res;
                if (success) {
                    const { data, message, success } = res;
                    let pageinfo= (data && data.head) ? data.head || {} : {};
                    console.log('')
                    if (success) {
                        let tableData = data && data.head && data.head.rows.map(item => item.values);
                        _this.setState({
                            [table + 'data']: (tableData && JSON.stringify(tableData)!== '{}') ? tableData : [],
                            maxPage: (data && data.head && data.head.pageinfo) ? data.head.pageinfo.totalPages : 1,
                            totalSize: (data && data.head && data.head.pageinfo) ? data.head.pageinfo.totalElements : 0,
                            loadingShow: false
                        });
                    } else {
                        
                    }
                } else {
                    _this.setState({
                        [table + 'data']: [],
                        maxPage: 1,
                        totalSize: 0,
                        loadingShow: false
                    });
                }
            },
            error: function(res) {
                console.error(res);
            }
        })
    }


    //切换中心信息
    handleCenterInfo　= (active) => {
        this.setState({
            activeKey: active,
            acInvesttransTab:'recordcenter',
            acCenterCurTab:'accountcenter'
        });
        this.getBank()
        this.getOfflineList(this.state[active + 'CurTab'] , this.state.pageIndex, this.state.pageSize, this.state.bankCur.code);
        // this.handleInvestrans(this.state.acInvesttransTab);
        // this.handleTab(this.state.acCenterCurTab)
    }

    //切换转入转出
    handleInvestrans = (table) => {
        console.log(table, 'investtrans');
        this.setState({
            acInvesttransTab: table
        })

        this.getOfflineList(table , this.state.pageIndex, this.state.pageSize, this.state.bankCur.code);
    }

    //切换申购赎回
    handleTab = (table) => {
        console.log(table, 'table =====>');
        this.setState({
            acCenterCurTab: table,
            isShowApply: !this.state.isShowApply
        });

        this.getOfflineList(table , this.state.pageIndex, this.state.pageSize, this.state.bankCur.code);
    }
    
    //删除行通用
    // this.delRow(currentRecord , 'accountcenterdata', tableMap['accountcenterdata'].delUrl)
    delRow = (currentRecord, table, url) => {
        console.log(currentRecord,'11')
        const _this = this;
        let { pageIndex, pageSize }= this.state;
        let tableData = _this.state[table];
        const data ={
			data:{
                head: {
				rows: [
					{
                        status:3,
						values:	{
								id: { value: currentRecord.id.value},
                                ts: { value: currentRecord.ts.value},
                                tenantid: { value: currentRecord.tenantid.value}
							}
						}
					]
				}
            }
        }
        Ajax({
            url:  url,
			data: data,
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					toast({content: '删除成功...', color: 'success'});
					if (tableData.length=== 1 && pageIndex> 1) {
						pageIndex--;
					} else if (tableData.length=== 1 && pageIndex=== 1) {
						return;
					}
					_this.getOfflineList(table, pageIndex, pageSize, _this.state.bankCur.code);
				} else {
					toast({content: JSON.stringify(message), color: 'warning'});
				}
			}
        })    
    }
    
    // 编辑
    editDone2 = (index, text, record, e) => {
		const _this = this;
			this.setState({
                showModal2: true,
                status:1,
                applyindata: record
            });
    }

    editDone3 = (index, text, record, e) => {
			this.setState({
                showModal3: true,
                status:1,
                redeemindata: record
            });
    }

	editDone4 = (index, text, record, e) => {
			this.setState({
                showModal4: true,
                status:1,
                turnindata: record
            });
    }
    
    editDone5 = (index, text, record, e) => {
			this.setState({
                showModal5: true,
                status:1,
                turnoutdata: record
            });
	}
    
    // 页码选择
    onChangePageIndex2 = (page) => {
		const _this = this;
		_this.setState({
            pageIndex: page,
        });
        console.log(_this.state.bankCur,_this.state.pageSize,page, 'page');
		this.getOfflineList('accountcenter', page, _this.state.pageSize, _this.state.bankCur.code);
    }
    
    onChangePageIndex3 = (page) => {
		const _this = this;
		_this.setState({
            pageIndex: page,
        });
        console.log(_this.state.bankCur,_this.state.pageSize,page, 'page');
		this.getOfflineList('redeemasset', page, _this.state.pageSize, _this.state.bankCur.code);
    }
    
    onChangePageIndex4 = (page) => {
		const _this = this;
		_this.setState({
            pageIndex: page,
        });
        console.log(_this.state.bankCur,_this.state.pageSize,page, 'page');
		this.getOfflineList('recordcenter', page, _this.state.pageSize, _this.state.bankCur.code);
    }
    
    onChangePageIndex5 = (page) => {
		const _this = this;
		_this.setState({
            pageIndex: page,
        });
        console.log(_this.state.bankCur,_this.state.pageSize,page, 'page');
		this.getOfflineList('recordout', page, _this.state.pageSize, _this.state.bankCur.code);
	}

    //页数量选择 
    onChangePageSize2 = (value) => {        
        const _this = this;
        console.log(_this.state)
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getOfflineList('accountcenter', 1, value, _this.state.bankCur.code);
    }
    
    onChangePageSize3 = (value) => {        
        const _this = this;
        console.log(_this.state)
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getOfflineList('redeemasset', 1, value, _this.state.bankCur.code);
    }

    onChangePageSize4 = (value) => {        
        const _this = this;
        console.log(_this.state)
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getOfflineList('recordcenter', 1, value, _this.state.bankCur.code);
    }

    onChangePageSize5 = (value) => {        
        const _this = this;
        console.log(_this.state)
		this.setState({
			pageIndex: 1,
			pageSize: value
		});
		this.getOfflineList('recordout', 1, value, _this.state.bankCur.code);
    }

    //申购录入确定
    handleApplyBuy = () => {
        const _this = this;
        let { status, bank_code, banks, applyindata, bankCur } = this.state;
        // let bank = getArrItemByKey(banks, 'code', bank_code);
        console.log('handleApplyBuy=> this.state=>banks', this.state,status, banks);
        let data = {
            head: {
                pageInfo: null,
                rows: [{
                    status: status,
                    values: {
                        eAcctNo: {
                            value: bankCur.code
                        },
                        eAcctName: {
                            value:  bankCur.name
                        },
                        prdname: applyindata.prdname,
                        prdcode: applyindata.prdcode,
                        amtmoney: applyindata.amtmoney,
                        rate: applyindata.rate,
                        subscribetime: applyindata.subscribetime,
                        investlimit: applyindata.investlimit,
                        prodstarttime: applyindata.prodstarttime,
                        prodendtime: applyindata.prodendtime,
                    }
                }]
            }
        }
        //console.log(data.head.rows[0].values);
        
        if (status == 1) {
            data.head.rows[0].values.tenantid = applyindata.tenantid,
            data.head.rows[0].values.id = applyindata.id,
            data.head.rows[0].values.ts = applyindata.ts
        }
        console.log(data)
        Ajax({
            url: rootURL+'fm/subscribe/saveOffline',
            data: {
                data: data
            },
            success: function(res) {
                let obj = Object.assign({}, _this.state.applyindata);
                _this.state.accountcenterdata.push(obj);
                console.log(_this.state.applyindata, _this.state.accountcenterdata, '999000');
               
                console.log(tableMap.accountcenter)
                _this.getOfflineList('accountcenter', 1, _this.state.pageSize, _this.state.bankCur.code);
                _this.close2();
            }
        })
    }

    //赎回添加编辑操作
    handleRedeem = () => {
        const _this = this;
        let { status, bank_code, banks, redeemindata, bankCur } = this.state;
        let data = {
            head: {
                pageInfo: null,
                rows: [{
                    status: status,
                    values: {
                        accreceive_code: {
                            value: bankCur.code
                        },
                        accreceive_name: {
                            value: bankCur.name
                        },
                        prdname: redeemindata.prdname,
                        prdcode: redeemindata.prdcode,
                        redemptionamt:redeemindata.redemptionamt,
                        redemptiontime:redeemindata.redemptiontime,
                    }
                }]
            }
        }

        if (status == 1) {
            data.head.rows[0].values.tenantid = redeemindata.tenantid,
            data.head.rows[0].values.id = redeemindata.id,
            data.head.rows[0].values.ts = redeemindata.ts
        }
    
        Ajax({
            url:'/fm/redemption/saveOffline',
            data:{
                data:data
            },
            success: function(res) {
                let obj  = Object.assign({}, _this.state.redeemindata);
                _this.state.redeemassetdata.push(obj); 
                console.log(_this.state.redeemindata,_this.state.redeemassetdata,'999000');
                _this.getOfflineList('redeemasset', 1, _this.state.pageSize, _this.state.bankCur.code);
                _this.close3();
            }
        })
    }

    //转入录入、编辑操作
    handleTurnin = () => {
        const _this = this;
        let { status, bank_code, banks, turnindata, bankCur } = this.state;
        let data = {
                head:{
                    pageInfo:null,
                    rows:[
                            {
                            status:_this.state.status,
                            values:{
                                accpay_name:turnindata.accpay_name,
                                accpay_code:turnindata.accpay_code,
                                accreceive_name:{
                                    value:bankCur.name 
                                },
                                accreceive_code:{
                                    value:bankCur.code
                                },
                                amount:turnindata.amount,
                                transtime:turnindata.transtime,
                                istransin:{
                                    value:0 
                                }
                            }
                        }
                    ] 
                }
            } 

        if (status == 1) {
            data.head.rows[0].values.tenantid = turnindata.tenantid,
            data.head.rows[0].values.id = turnindata.id,
            data.head.rows[0].values.ts = turnindata.ts
        }

        Ajax({
            url:'/fm/investtrans/saveOffline',
            data:{
                data: data
            },
            success: function(res) {
                let obj  = Object.assign({}, _this.state.turnindata);
                _this.state.recordcenterdata.push(obj); 
                console.log(_this.state.turnindata,_this.state.recordcenterdata,'999000');
                _this.getOfflineList('recordcenter', 1, _this.state.pageSize, _this.state.bankCur.code);
                _this.close4();
            }
        })
    }

    //转出录入、编辑操作
    handleTurnout = () => {
        const _this = this;
        let { status, bank_code, banks, turnoutdata, bankCur } = this.state;
        let data = {
                head:{
                    pageInfo:null,
                    rows:[
                            {
                            status:_this.state.status,
                            values:{
                                accpay_name:{
                                    value:bankCur.name 
                                },
                                accpay_code:{
                                    value:bankCur.code
                                },
                                accreceive_name:turnoutdata.accreceive_name,
                                accreceive_code:turnoutdata.accreceive_code,
                                amount:turnoutdata.amount,
                                transtime:turnoutdata.transtime,
                                istransin:{
                                    value:1 
                                }
                            }
                        }
                    ]
                }
            }

            if (status == 1) {
                data.head.rows[0].values.tenantid = turnoutdata.tenantid,
                data.head.rows[0].values.id = turnoutdata.id,
                data.head.rows[0].values.ts = turnoutdata.ts
            }
        Ajax({
            url:'/fm/investtrans/saveOffline',
            data: {
                data: data
            },
            success: function(res) {
                let obj  = Object.assign({}, _this.state.turnoutdata);
                _this.state.recordoutdata.push(obj);
                // console.log(_this.state.turnoutdata,_this.state.recordoutdata,'999000');
                // debugger
                _this.getOfflineList('recordout', 1, _this.state.pageSize, _this.state.bankCur.code);
                _this.close5();
            }
        })
    }
    
    //模糊查询
	handleSearch = (table,e) => {
        const _this = this;
        

        console.log(table,'搜索');

        this.getOfflineList(table, 1, _this.state.pageSize, _this.state.bankCur.code);
	} 

    // 处理后台返回的数据
    dataFormat = (data) => {
        let result = [];
        data.map((item, index) => {
            item.key = index + 1;
            result.push(item);
        });

        return result;
    } 
    

    //转入转出赎回按钮控制
    changeIn = () => {
    }

    changeOut = () => {
        this.setState({
            showModal: true,
            // operation: 'outType',
        })

    }

    changeDetailed = () => {
        this.setState({
            showModal1: true
        })
    }

    //弹出申购录入新增界面
    changeApply = () => {
        this.setState({
            status:2,
            showModal2: true,
            applyindata:{
                prdname:{},
                prdcode:{},
                amtmoney:{},
                rate:{},
                investlimit:{},
                subscribetime:{},
                prodstarttime:{},
                prodendtime:{},
                id:{},
                ts:{},
                tenantid:{}
            },
        })
    }

    //弹出赎回录入新增界面
    changeRedeem = () => {
        this.setState({
            status:2,
            showModal3: true,
            redeemindata:{
                prdname:{},
                prdcode:{},
                redemptionamt:{},
                redemptiontime:{},
                id:{},
                ts:{},
                tenantid:{}
            },
        })
    }

    //弹出转入录入新增界面
    changeIn2 = () => {
        this.setState({       
            status:2,
            showModal4: true, 
            turnindata:{
                accpay_name:{},
                accpay_code:{},
                amount:{},
                transtime:{},
                accreceive_code:{},
                accreceive_name:{},
                id:{},
                ts:{},
                tenantid:{}
            },
        })
    }

    //弹出转出录入新增界面
    changeOut2 = () => {
        this.setState({
            status:2,
            showModal5: true,
            turnoutdata:{
                accreceive_name:{},
                accreceive_code:{},
                amount:{},
                transtime:{},
                accpay_name:{},
                accpay_code:{},
                id:{},
                ts:{},
                tenantid:{}
            }
        })
    }

    close2 = () => {
        this.setState({
            showModal2: false
        })
    }

    close3 = () => {
        this.setState({
            showModal3: false
        })
    }

    close4 = () => {
        this.setState({
            showModal4: false
        })
    }

    close5 = () => {
        this.setState({
            showModal5: false
        })
    }

    //切换银行请求账户余额,同时跟新传入账户值
    handleBankChange = (index) => {

        const _this = this;
        let { page, size , bankCur, banks, activeKey} = this.state;
        bankCur = banks[index];
        console.log(bankCur, 'bankCur', this.state, index);

        this.setState({
            bankCur: bankCur
        });



        this.getOfflineList(this.state[activeKey + 'CurTab'], this.state.pageIndex, this.state.pageSize, bankCur.code);
        // debugger;
        // console.log(e,_this.state,'hand')
        // _this.setState({

        // })
        // Ajax({
        //     url:rootURL+'fm/subscribe/queryAcc',
        //     data:{
        //         data:{}
        //     },
        //     success:function(res){

        //         console.log(res,'queryAmoutSuccess');
        //         _this.setState({
        //             bank_code:e,
        //             bank_key:res.data.map((item,index)=>{return item.key})
        //         })
        //         console.log(e,_this.state.bank_key,'bankse')
        // _this.getOfflineData2(page,size, bankCur.code );
        //     },
        //     error:function(res){
        //         console.error(res);
        //         console.log(222,'queryAmout');
        //     }
        // })
    }

    //切换页签请求数据更新页面
    updatepage = (e, urltitle, datasource) => {
        //存储请求路径为分页提供请求路径
        this.setState({
            newUrl: urltitle,
            accentData: e
        })
        let that = this;
        // Ajax({
        //     //url: URL + 'fm/contract/delete',
        //     url: urltitle,
        //     data: datasource,
        //     success: function (res) {
        //         //console.log(res.data.data.data.head);
        //         let assetData = res.data;
        //         // let bodysData = res.data.data.data.bodys['银行贷款信息'].rows;
        //         assetData.forEach((item, index) => {
        //             item.key = index;
        //             //item.values[id].display=index;
        //         });

        //         console.log('headData', assetData);
        //         // console.log(this)
        //         that.setState(
        //             {
        //                 [e]: {
        //                     //columns: headColumns,
        //                     ...that.state[e],
        //                     [e + 'data']: assetData
        //                 },
        //                 banks:assetData
        //                 // pageinfo: res.data.head.pageinfo
        //             },
        //             () => {
        //                 console.log('state', that.state);
        //             }
        //         );
        //     },
        //     // error: function (res) {
        //     //     console.error(res)
        //     // }
        // });
        that.getBank()
    }

    render() {
        let { 
            modalColumns, 
            showModal,
            showModal2,
            showModal3,
            showModal4,
            showModal5,
            pageIndex,
            pageSize,
            maxPage,
            totalSize,
            keyWords,
            currentRecord,
            currentIndex,
            modalIn, 
			modalOut,  
            hotProvoder, 
            yestDayIncome, 
            totleIncome, 
            banks, 
            bank,
            bankCur,
            status,
            balance, 
            yestProfit, 
            rank, 
            isEyeOpen,
            isShowApply,
            isShowRedeem,
            applyindata,
            redeemindata,
            turnindata,
            turnoutdata,
            eacctcode,
            referCode,
            redumpall,
            amtall
        } = this.state;
        let { columns, accountcenterdata } = this.state.accountcenter;//账户中心
        let { redeemcolumns, redeemassetdata } = this.state.redeemasset;//历史资产
        let { recordcolumns, recordcolumns_, recordcenterdata } = this.state.recordcenter;//记录中心
        let { recordcenter_outcolumns, recordoutdata } = this.state.recordout;//转出
        console.log(moment(this.state.applyindata.subscribetime.value).isValid())
        return (
            <div style={{ margin: 10 }} id="if-offline">
                <Col md={12} xs={12} sm={12}>
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">首页</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">投资理财</Breadcrumb.Item>
                        <Breadcrumb.Item active>线下投资</Breadcrumb.Item>
                    </Breadcrumb>
                </Col>
                <Tabs
                    activeKey={this.state.activeKey}
                    tabBarPosition="left"
                    //defaultActiveKey="accountmessage"
                    onChange={this.handleCenterInfo}
                    style={{ height: 700 }}
                >
                    <TabPane tab={<span><Icon className="iconfont icon-zhanghuzhongxin" />账户中心</span>} key="acCenter" className="tablogo">
                        <div id="tophead-offline">
                            {/* <li> */}
                                <Row className='if-welcome'>
                                    <Col componentClass="label" className="label" xs={12}>
                                        <div style={{marginLeft:'5px', fontSize:'13px'}}>
                                            欢迎，{this.state.bankCur.name}
									    </div>            
                                    </Col>
                                    <Row>
                                        <Col md={8} xs={8} sm={8}>
                                            <Select 
                                                value={this.state.bankCur.name+' '+this.state.bankCur.code} 
                                                onChange={this.handleBankChange} 
                                                className="banks"
                                            >
                                                {banks.map((bank, index) => {
                                                    return (
                                                        <Option value={index}>{bank.name} {bank.code}</Option>
                                                    );
                                                })}
                                            </Select>
                                        </Col>
                                        <Col md={12} xs={12} sm={12}>
                                            <Button shape="round" className='turnin' onClick={(this.changeIn.bind(this))}>转入转出录入</Button>
                                            <Button shape="round" className='turnout' onClick={(this.changeOut.bind(this))}>明细</Button>
                                        </Col>
                                    </Row>
                                </Row>
                            {/* </li>
                            <li> */}
                                <Row className="yesterdayincome">
                                    <Col componentClass="label" className="label">
                                        <Col componentClass="span" className="title" xs={12}>
                                            投资总金额
									    </Col>
                                    </Col>
                                    <Col componentClass="label" className="labelnubmer">
                                        <Col componentClass="span" className="title" xs={12}>
                                            <span className='mny'>{this.state.bankCur.amtall ? this.state.bankCur.amtall : 0.00}</span>
                                        </Col>
                                    </Col>
                                </Row>
                            {/* </li>
                            <li> */}
                                <Row className='totleinvest'>
                                    <Col componentClass="label" className="label">
                                        <Col componentClass="span" className="title" xs={12}>
                                            已收益总金额
									    </Col>
                                    </Col>
                                    <Col componentClass="label" className="labelnubmer">
                                        <Col componentClass="span" className="title" xs={12}>
                                            <span className='mny'>{this.state.bankCur.redumpall ? this.state.bankCur.redumpall : 0.00}</span>
                                        </Col>
                                    </Col>
                                </Row>
                            {/* </li> */}
                        </div>
                        <Row>
                            <Col md={3} xs={3} xsPush={9} className="searchInput">
                                <Button 
                                    className={this.state.isShowApply ? 'btn-apply' : 'btn-2'} 
                                    style={{position:'absolute', right:'355px', top:'1px'}}
                                    onClick={(this.changeApply.bind(this))}
                                >
                                    申购录入
                                </Button>
                                <Button 
                                    className={this.state.isShowApply ? 'btn-2' : 'btn-redeem'} 
                                    style={{position:'absolute', right:'355px', top:'1px'}}
                                    onClick={(this.changeRedeem.bind(this))}
                                >
                                    赎回录入
                                </Button>
                                <FormControl 
                                    value={this.state.keyWords}
                                    onChange = {(e) => {
                                        this.setState({
                                            keyWords: e
                                        });
                                        console.log(e,'search')
                                    }}
                                    onKeyDown = {(e) => {
                                        if(e.keyCode=== 13) {
                                            this.handleSearch(this.state.acCenterCurTab,e);
                                        }
                                    }}
                                    placeholder="搜索产品关键词" />
                                <Icon type="uf-search" onClick={()=> {this.handleSearch(this.state.acCenterCurTab, this.state.keyWords)}} />
                            </Col>
                        </Row>
                        <Row style={{ paddingLeft: 20 }} >
                            <Tabs
                                // defaultActiveKey="accountcenter"
                                activeKey={this.state.acCenterCurTab}
                                onChange={this.handleTab}
                                tabBarStyle="upborder"
                                className="demo-tabs"
                            >
                                <TabPane tab='申购' key="accountcenter">
                                    <Table
                                        columns={columns}
                                        data={this.dataFormat(this.state.accountcenterdata)}
                                        style={{ height: 448 }}
                                    />
                                    <PageJump
                                            pageSize = {pageSize}
                                            activePage = {pageIndex}
                                            maxPage = {maxPage}
                                            totalSize = {totalSize}
                                            onChangePageSize = {this.onChangePageSize2}
                                            onChangePageIndex = {this.onChangePageIndex2}
                                        />
                                </TabPane>
                                <TabPane tab='赎回' key="redeemasset">
                                    <Table
                                        columns={redeemcolumns}
                                        data={this.dataFormat(this.state.redeemassetdata)}
                                        style={{ height: 448}}
                                    />
                                    <PageJump
                                            pageSize = {pageSize}
                                            activePage = {pageIndex}
                                            maxPage = {maxPage}
                                            totalSize = {totalSize}
                                            onChangePageSize = {this.onChangePageSize3}
                                            onChangePageIndex = {this.onChangePageIndex3}
                                        />
                                </TabPane>
                            </Tabs>
                        </Row>
                    </TabPane>
                    <TabPane tab={<span><Icon className="iconfont icon-jiluzhongxin" />账户信息</span>} key="acInfo" className="tablogo">
                        <ul>
                            <li className="titleName">
                                账户信息
                                <Select 
                                    value={this.state.bankCur.name} 
                                    onChange={this.handleBankChange} 
                                    className="search-banks"
                                >
                                    {banks.map((bank, index) => {
                                        return (
                                            <Option value={index}>{bank.name}</Option>
                                        );
                                    })}
                                </Select>
                                    <Button 
                                        className='btn-in'
                                        onClick={(this.changeIn2.bind(this))}
                                    >转入录入
                                    </Button>
                                    <Button 
                                        className='btn-out'
                                        onClick={(this.changeOut2.bind(this))}
                                    >转出录入
                                    </Button>
                                </li>
                            <li>
                                <Tabs
                                    // defaultActiveKey="recordcenter"
                                    activeKey={this.state.acInvesttransTab}
                                    onChange={this.handleInvestrans}
                                    tabBarStyle="upborder"
                                    className="demo-tabs"
                                >
                                    <TabPane tab='转入记录' key="recordcenter">
                                        <Table
                                            columns={recordcolumns}
                                            data={this.dataFormat(this.state.recordcenterdata)}
                                            style={{ height: 540 }}
                                        />
                                        <PageJump
                                            pageSize = {pageSize}
                                            activePage = {pageIndex}
                                            maxPage = {maxPage}
                                            totalSize = {totalSize}
                                            onChangePageSize = {this.onChangePageSize4}
                                            onChangePageIndex = {this.onChangePageIndex4}
                                        />
                                    </TabPane>
                                    <TabPane tab='转出记录' key="recordout">
                                        <Table
                                            columns={recordcenter_outcolumns}
                                            data={this.dataFormat(this.state.recordoutdata)}
                                            style={{ height: 540 }}
                                        />
                                        <PageJump
                                            pageSize = {pageSize}
                                            activePage = {pageIndex}
                                            maxPage = {maxPage}
                                            totalSize = {totalSize}
                                            onChangePageSize = {this.onChangePageSize5}
                                            onChangePageIndex = {this.onChangePageIndex5}
                                        />
                                    </TabPane>
                                </Tabs>
                            </li>
                            {/* <li>
                                <Col md={12} xs={12} sm={12} >
                                    <div className="pagination">
                                        <Pagination
                                            prev
                                            next
                                            boundaryLinks
                                            items={this.state.pageinfo.totalPages}
                                            maxButtons={5}
                                            activePage={this.state.pageinfo.number}
                                            onSelect={this.handlePageSelect}
                                        />
                                        {<span className="toPage">
                                            跳至 <input className="toPage-input" value={this.state.pageinfo.number + 1} type="text" /> 页
                                </span>}
                                    </div>
                                </Col>
                            </li> */}
                        </ul>
                    </TabPane>
                </Tabs>
                
                {/* 申购录入模态框 */}
                <Modal
                    show = { this.state.showModal2 }
                    onHide = { this.close2 }
                    style={{ width: 450, height: 300, position: "absolute", left: '50%', top: '50%', marginLeft: -225, marginTop: -150}}
                >
                    <Modal.Header className="text-center">
                        <Modal.Title style={{textAlign: 'left'}}>申购记录</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                            <ul>
                                <li>
                                    <FormGroup>
                                        <span className='modal-label'>产品名称：</span>
                                        <FormControl
                                            type="text"
                                            placeholder="请输入产品名称"
                                            value={this.state.applyindata.prdname.value}
                                            //className="modal-content modal-input-small"
                                            style={{width:'240px'}}
                                            onChange={(e) =>{
                                                this.setState({
                                                        applyindata:{
                                                            ...applyindata,
                                                            prdname:{
                                                                value:e,
                                                                display:e
                                                            }
                                                        }
                                                })
                                            }}
                                        />
                                    </FormGroup>
                                </li>
                                <li>
                                    <FormGroup>
                                        <span className='modal-label'>产品编码：</span>
                                        <FormControl
                                            type="text"
                                            placeholder="请输入产品编码"
                                            value={this.state.applyindata.prdcode.value}
                                            style={{width:'240px'}}
                                            onChange={(e) =>{
                                                this.setState({
                                                        applyindata:{
                                                            ...applyindata,
                                                            prdcode:{
                                                                value:e,
                                                                display:e
                                                            }
                                                        }
                                                })
                                                //console.log(this.state.applyindata.prdcode,'666')
                                            }}
                                        />
                                    </FormGroup>
                                </li>
                                <li>
                                    <FormGroup>
                                        <span className='modal-label'>申购金额：</span>
                                        <FormControl
                                            type="text"
                                            placeholder="请输入申购金额"
                                            value={this.state.applyindata.amtmoney.value}
                                            style={{width:'240px'}}
                                            onChange={(e) =>{
                                                this.setState({
                                                        applyindata:{
                                                            ...applyindata,
                                                            amtmoney:{
                                                                value:e,
                                                                display:e
                                                            }
                                                        }
                                                })
                                            }}
                                        />
                                    </FormGroup>
                                </li>
                                <li>
                                    <FormGroup>
                                        <span className='modal-label'>年华利率：</span>
                                        <FormControl
                                            type="text"
                                            placeholder="请输入年华利率"
                                            value={this.state.applyindata.rate.value}
                                            style={{width:'240px'}}
                                            onChange={(e) =>{
                                                this.setState({
                                                        applyindata:{
                                                            ...applyindata,
                                                            rate:{
                                                                value:e,
                                                                display:e
                                                            }
                                                        }
                                                })
                                                //console.log(this.state.applyindata.prdname,'666')
                                            }}
                                        />
                                    </FormGroup>
                                </li>
                                <li>
                                    <FormGroup>
                                        <span className='modal-label'>投资期限：</span>
                                        <FormControl
                                            type="text"
                                            placeholder="请输入投资期限"
                                            value={this.state.applyindata.investlimit.value}
                                            style={{width:'240px'}}
                                            onChange={(e) =>{
                                                this.setState({
                                                        applyindata:{
                                                            ...applyindata,
                                                            investlimit:{
                                                                value:e,
                                                                display:e
                                                            }
                                                        }
                                                    
                                                })
                                                
                                            }}
                                        />
                                    </FormGroup>
                                </li>
                                <li>
                                    <FormGroup>
                                        <span className='modal-label'>申购时间：</span>
                                        <span style={{width:'240px',display:'inline-block'}}>
                                            <DatePicker
                                                format={"YYYY-MM-DD"}
                                                onChange={(e, subscribetime)=> {
                                                    this.setState({
                                                        applyindata:{
                                                            ...applyindata,
                                                            subscribetime:{
                                                                value:e.format('YYYY-MM-DD'),
                                                                display:e.format('YYYY-MM-DD')
                                                            }
                                                        }
                                                    })
                                                    console.log(moment(this.state.applyindata.subscribetime.value),'666')
                                                }}
                                                value={(this.state.applyindata.subscribetime.value && moment(this.state.applyindata.subscribetime.value).isValid())
                                                    ?moment(this.state.applyindata.subscribetime.value)
                                                    :null}
                                                placeholder = {'选择日期时间'}
                                            />
                                        </span> 
                                    </FormGroup>
                                </li>
                                <li>
                                    <FormGroup>
                                        <span className='modal-label'>开始时间：</span>
                                        <span style={{width:'240px',display:'inline-block'}}>
                                            <DatePicker
                                                format={"YYYY-MM-DD"}
                                                onChange={(e, prodstarttime)=> {
                                                    this.setState({
                                                        applyindata:{
                                                            ...applyindata,
                                                            prodstarttime:{
                                                                value:e.format('YYYY-MM-DD'),
                                                                display:e.format('YYYY-MM-DD'),
                                                            }
                                                        }
                                                    })
                                                }}
                                                value={this.state.applyindata.prodstarttime.value && moment(this.state.applyindata.prodstarttime.value)
                                                    ?moment(this.state.applyindata.prodstarttime.value)
                                                    :null}
                                                placeholder = {'选择日期时间'}
                                            />
                                        </span>    
                                    </FormGroup>
                                </li>
                                <li>
                                    <FormGroup>
                                        <span className='modal-label'>结束时间：</span>
                                        <span style={{width:'240px',display:'inline-block'}}>
                                            <DatePicker
                                                format={"YYYY-MM-DD"}
                                                onChange={(e, prodendtime)=> {
                                                    this.setState({
                                                        applyindata:{
                                                            ...applyindata,
                                                            prodendtime:{
                                                                value:e.format('YYYY-MM-DD'),
                                                                display:e.format('YYYY-MM-DD')
                                                            }
                                                        }
                                                    })
                                                }}
                                                value={this.state.applyindata.prodendtime.value && moment(this.state.applyindata.prodendtime.value).isValid()
                                                    ?moment(this.state.applyindata.prodendtime.value)
                                                    :null}
                                                placeholder = {'选择日期时间'}
                                            />
                                        </span> 
                                    </FormGroup>
                                </li>
                            </ul>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button 
                            style={{marginRight: '10px'}}  
                            colors="primary"
                            onClick = {this.handleApplyBuy}
                        >确认</Button>
                        <Button onClick={ this.close2 } shape="border">关闭</Button>
                    </Modal.Footer>
                </Modal>


                {/* 赎回录入模态框 */}
                <Modal
                    show = { this.state.showModal3 }
                    onHide = { this.close2 }
                    style={{ width: 450, height: 300, position: "absolute", left: '50%', top: '50%', marginLeft: -225, marginTop: -150}}
                >
                    <Modal.Header className="text-center">
                        <Modal.Title style={{textAlign: 'left'}}>赎回记录</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ul>
                            <li>
                                <FormGroup>
                                    <span className='modal-label'>产品名称：</span>
                                    <FormControl
                                        type="text"
                                        placeholder="请输入"
                                        value={this.state.redeemindata.prdname.value}
                                        style={{width:'240px'}}
                                        onChange={(e) =>{
                                            this.setState({
                                                    redeemindata:{
                                                        ...redeemindata,
                                                        prdname:{
                                                            value:e,
                                                            display:e
                                                        }
                                                    }
                                            })
                                        }}
                                    />
                                </FormGroup>
                            </li>
                            <li>
                                <FormGroup>
                                    <span className='modal-label'>产品编码：</span>
                                    <FormControl
                                        type="text"
                                        placeholder="请输入"
                                        value={this.state.redeemindata.prdcode.value}
                                        //className="modal-content modal-input-small"
                                        style={{width:'240px'}}
                                        onChange={(e) =>{
                                            this.setState({
                                                    redeemindata:{
                                                        ...redeemindata,
                                                        prdcode:{
                                                            value:e,
                                                            display:e
                                                        }
                                                    }
                                            })
                                        }}
                                    />
                                </FormGroup>
                            </li>
                            <li>
                                <FormGroup>
                                    <span className='modal-label'>赎回金额：</span>
                                    <FormControl
                                        type="text"
                                        placeholder="请输入赎回金额"
                                        value={this.state.redeemindata.redemptionamt.value}
                                        style={{width:'240px'}}
                                        onChange={(e) =>{
                                            this.setState({
                                                    redeemindata:{
                                                        ...redeemindata,
                                                        redemptionamt:{
                                                            value:e,
                                                            display:e
                                                        }
                                                    }
                                            })   
                                        }}
                                    />
                                </FormGroup>
                            </li>
                            <li>
                                <FormGroup>
                                    <span className='modal-label'>赎回时间：</span>
                                    <span style={{width:'240px',display:'inline-block'}}>
                                        <DatePicker
                                            format={"YYYY-MM-DD"}
                                            onChange={(e, redemptiontime)=> {
                                                this.setState({
                                                    redeemindata:{
                                                        ...redeemindata,
                                                        redemptiontime:{
                                                            value:e.format('YYYY-MM-DD'),
                                                            display:e.format('YYYY-MM-DD')
                                                        }
                                                    }
                                                })
                                                console.log(moment(this.state.redeemindata.redemptiontime))
                                            }}
                                            value={(this.state.redeemindata.redemptiontime.value && moment(this.state.redeemindata.redemptiontime.value).isValid())
                                                ?moment(this.state.redeemindata.redemptiontime.value)
                                                :null}
                                            placeholder = {'选择日期时间'}
                                        />
                                    </span>                                        
                                </FormGroup>
                            </li>
                        </ul>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button 
                            style={{marginRight: '10px'}}  
                            colors="primary"
                            onClick = {this.handleRedeem}
                        >确认</Button>
                        <Button onClick={ this.close3 } shape="border">关闭</Button>
                    </Modal.Footer>
                </Modal>

                {/* 转入录入模态框 */}
                <Modal
                    show = { this.state.showModal4 }
                    onHide = { this.close4 }
                    style={{ width: 450, height: 300, position: "absolute", left: '50%', top: '50%', marginLeft: -225, marginTop: -150}}
                >
                    <Modal.Header className="text-center">
                        <Modal.Title style={{textAlign: 'left'}}>转入录入</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ul>
                            <li style={{boxSizing:'border-box'}}>
                                    <span className='modal-label'>付款银行：</span>
                                    <Refer
                                        ctx={'/uitemplate_web'}
                                        refModelUrl={'/bd/bankaccbasRef/'}
                                        refCode={'bankaccbasRef'}
                                        refName={'付款银行:'}
                                        value={{
                                            refname:this.state.turnindata.accpay_name.value,
                                            refpk: this.state.turnindata.accpay_code.value
                                        }}
                                        style={{ 'width':'240px','padding':'0', 'display': 'inline-block', 'margin-left':'1px', 'margin-top':'50px'}}
                                        onChange={e => {
                                            console.log(e,'e')
                                            this.setState({
                                                turnindata:{
                                                    ...this.state.turnindata,
                                                    accpay_name:{ value:e.refname},
                                                    accpay_code:{ value:e.refcode},
                                                },
                                            });
                                        }}
                                        //showLabel={true}
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
                            </li>
                            <li>
                                <FormGroup>
                                    <span className='modal-label'>付款账户：</span>
                                    <FormControl
                                        type="text"
                                        disabled
                                        value={this.state.turnindata.accpay_code.value}
                                        style={{width:'240px'}}
                                        onChange={(e) =>{
                                            this.setState({                                                   
                                                    turnindata:{
                                                        ...turnindata,
                                                        accpay_code:{
                                                            value:e,
                                                            display:e
                                                        }
                                                    }                                                
                                            })
                                            
                                        }}
                                    />
                                </FormGroup>
                            </li>
                            <li>
                                <FormGroup>
                                    <span className='modal-label'>转入金额：</span>
                                    <FormControl
                                        type="text"
                                        placeholder="请输入数字"
                                        style={{width:'240px'}}
                                        value={this.state.turnindata.amount.value}
                                        onChange={(e) =>{
                                            this.setState({                                                   
                                                    turnindata:{
                                                        ...turnindata,
                                                        amount:{
                                                            value:e,
                                                            display:e
                                                        }
                                                    }                                                
                                            })
                                            
                                        }}
                                    />
                                </FormGroup>
                            </li>
                            <li>
                                <FormGroup>
                                    <span className='modal-label'>转入时间：</span>
                                    <span style={{width:'240px',display:'inline-block'}}>
                                        <DatePicker
                                            format={"YYYY-MM-DD"}
                                            onChange={(e, transtime)=> {
                                                this.setState({
                                                        turnindata:{
                                                            ...turnindata,
                                                            transtime:{
                                                                value:e.format('YYYY-MM-DD'),
                                                                display:e.format('YYYY-MM-DD')
                                                            }
                                                        }
                                                })
                                                console.log(transtime, 'YYYY-MM-DD');
                                            }}
                                            value={(this.state.turnindata.transtime.value && moment(this.state.turnindata.transtime.value).isValid())
                                                ?moment(this.state.turnindata.transtime.value)
                                                :null}
                                            placeholder = {'选择日期时间'}
                                        />
                                    </span>                                        
                                </FormGroup>
                            </li>
						    </ul>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button 
                            style={{marginRight: '10px'}}  
                            colors="primary"
                            onClick = {this.handleTurnin}
                        >
                            确认
                        </Button>
                        <Button onClick={ this.close4 } shape="border">取消</Button>
                    </Modal.Footer>
                </Modal>

                {/* 转出录入模态框 */}
                <Modal
                    show = { this.state.showModal5 }
                    onHide = { this.close5 }
                    style={{ width: 450, height: 300, position: "absolute", left: '50%', top: '50%', marginLeft: -225, marginTop: -150}}
                    //dialogClassName={showModal ? modalIn : modalOut}
                    //backdropStyle={{ background: 'rgba(255, 255, 255, 0)' }}
                >
                    <Modal.Header className="text-center">
                        <Modal.Title style={{textAlign: 'left'}}>转出录入</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <ul>
                            <li>
                                    <span className='modal-label'>收款账户：</span>
                                    <Refer
                                        ctx={'/uitemplate_web'}
                                        refModelUrl={'/bd/bankaccbasRef/'}
                                        refCode={'bankaccbasRef'}
                                        refName={'收款账户:'}
                                        value={{
                                            refname:this.state.turnoutdata.accreceive_name.value,
                                            refpk: this.state.turnoutdata.accreceive_code.value
                                        }}
                                        style={{ 'width':'240px','padding':'0', 'display': 'inline-block', 'margin-left':'1px', 'margin-top':'50px'}}
                                        onChange={e => {
                                            console.log(e,'e')
                                            this.setState({
                                                turnoutdata:{
                                                    ...this.state.turnoutdata,
                                                    accreceive_name:{ value:e.refname},
                                                    accreceive_code:{ value:e.refcode},
                                                },
                                            });
                                        }}
                                        //showLabel={true}
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
                            </li>
                            <li>
                                <FormGroup>
                                    <span className='modal-label'>收款银行：</span>
                                    <FormControl
                                        type="text"
                                        disabled
                                        value={this.state.turnoutdata.accreceive_code.value}
                                        style={{width:'240px'}}
                                        onChange={(e) =>{
                                            this.setState({
                                                    turnoutdata:{
                                                        ...turnoutdata,
                                                        accreceive_code:{
                                                            value:e,
                                                            display:e
                                                        }
                                                    }
                                                
                                            })
                                        }}
                                    />
                                </FormGroup>
                            </li>
                            <li>
                                <FormGroup>
                                    <span className='modal-label'>转出金额：</span>
                                    <FormControl
                                        type="text"
                                        placeholder="请输入数字"
                                        style={{width:'240px'}}
                                        value={this.state.turnoutdata.amount.value}
                                        onChange={(e) =>{
                                            this.setState({
                                                turnoutdata:{
                                                    ...turnoutdata,
                                                    amount:{
                                                        value:e,
                                                        display:e
                                                    }
                                                }
                                            })
                                        }}
                                    />
                                </FormGroup>
                            </li>
                            <li>
                                <FormGroup>
                                    <span className='modal-label'>转出时间：</span>
                                    <span style={{width:'240px',display:'inline-block'}}>
                                        <DatePicker
                                            format={"YYYY-MM-DD"}
                                            onChange={(e, transtime)=> {
                                                this.setState({
                                                        turnoutdata:{
                                                            ...turnoutdata,
                                                            transtime:{
                                                                value:e,
                                                                display:e
                                                            }
                                                        }
                                                    
                                                })
                                            }}
                                            value={(this.state.turnoutdata.transtime.value && moment(this.state.turnoutdata.transtime.value).isValid())
                                                ?moment(this.state.turnoutdata.transtime.value)
                                                :null}
                                            placeholder = {'选择日期时间'}
                                        />
                                    </span>                                        
                                </FormGroup>
                            </li>
						    </ul>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button 
                            style={{marginRight: '10px'}}  
                            colors="primary"
                            onClick = {this.handleTurnout}
                        >
                            确认
                        </Button>
                        <Button onClick={ this.close5 } shape="border">取消</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
