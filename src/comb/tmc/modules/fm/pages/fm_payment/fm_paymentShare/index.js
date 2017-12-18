import React, { Component } from 'react';
import { Link ,hashHistory} from "react-router";
import { 
    Modal,
    Row, 
    Col,
    Button,
    FormGroup, 
    Label,
    Radio,
    Icon,
} from 'tinper-bee';
import Table from 'bee-table';
import  Form from 'bee-form';
import FormControl from 'bee-form-control';
import 'bee-form/build/Form.css';
import PageJump from '../../../../../containers/PageJump';
import { toast } from '../../../../../utils/utils.js';
import BreadCrumbs from '../../../../bd/containers/BreadCrumbs';
import './index.less';
import {RadioItem, TextAreaItem} from 'containers/FormItems';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import moment from 'moment';
import DatePickerSelect from '../../../../pass/containers/DatePickerSelect/index.js';
import PaymentAddModal from './../../../containers/fm_paymentAddModal/index.js';
import DeleteModal from '../../../../../containers/DeleteModal/index.js';
import Ajax from '../../../../../utils/ajax';
import Refer from '../../../../../containers/Refer/index.js';
import ApproveDetail from 'containers/ApproveDetail';
import ApproveDetailButton from 'containers/ApproveDetailButton';
import nodataPic from '../../../../../static/images/nodata.png';
import {formatMoney} from '../../../../../utils/utils.js';
const { FormItem } = Form;
const format = 'YYYY-MM-DD';
var x = 0;
const URL= window.reqURL.fm;
export default class PaymentShare extends Component {
    constructor(props) {
		super(props);
		this.state = {
            showModal:false,
            pageSize:this.props.location.query.type ==='edit'? 50 : 10,//每页显示多少条记录 
            pageIndex:1,//页数
            maxPage:1,//最大页码 
            totalSize:0,//多少条记录 
            paymentObj:[],//modal传过来的子表所有数据
            type:'',//编辑类型(add/edit)
            queryType:'',//一级页面跳转状态 (add/edit/detail)
            editData:{},//子表需要修改的数据，往子组件传递
            //需要修改的主表数据
            id:null,
            paymentdate:{},
            currtypeid:{},//
            exchangerate:null,
            paymentmny:null,
            vbillstatus:{
                "display": null,
                "scale": -1,
                "value": 0,
            },
            separatetype:1,
            loantypeid:'费用',
            payaccountid:{},
            peerunittype:{
                "display": null,
                "scale": -1,
                "value": "1"
            },
            peergathunitid:{},//
            peergathaccountid:{},//
            transtatus:0,
            memo:null,
            editDataBody:[],//需要修改的子表数据 
            editDataBodyAdd:[],//新增时，新增的子表 一页显示
            editDataAll:[],//新增时，新增的所有子表 需要往后端存
            needEditBody:[],//编辑时新增的子表 需要往后端存
            vbillno:null,//vbillno 付费编号
            resData:{},//所有数据用于修改
            /*付款 value（1） 收款 value（0）*/
            paymenttype:{
                "display": null,
                "scale": -1,
                "value": 1
            },
            orgid:{},//财务组织
            index:'',
            separatetypeNoEdit:false,//根据分摊状态判断是否不可编辑
            passDis:true,
            downPassDis:true,
            shareDis:true,
            noShareDis:true,
            submitDis:true,
            backDis:true,
		};
    }
    componentWillMount () {
        let queryType = this.props.location.query.type;
        this.setState({
            queryType:queryType
        })
        let id = this.props.location.query.id;
        this.setState({
            id:id,
        })
        if(queryType !== 'add'){
            this.queryHeadByPaymentid(id);
            this.queryBodyByPaymentid(id,this.state.pageIndex,this.state.pageSize);
        }
    }
    // 备注
    textareaChange = (value) => { 
        value && document.querySelector('.isCount').classList.add('countRed');
        !value && document.querySelector('.isCount').classList.remove('countRed');
        this.setState({
            memo: {
                "display": null,
                "scale": -1,
                "value": value
            }
        })
    }
    // 根据paymentid 获取主表数据
    queryHeadByPaymentid = (id) => {
        let _this = this;
        Ajax({
            url:URL+ "fm/payment/queryHeadById",
            data:{        
                "id":id         
            },
            success: function(res) {
				const { data, success } = res;
				if (success) {
                    let editDataHead = data.head.rows[0].values;//主表
                    //主表数据
                    _this.setState({
                        resData:res,
                        vbillno:editDataHead.vbillno.value,
                        paymentdate:editDataHead.paymentdate,
                        currtypeid:editDataHead.currtypeid,
                        exchangerate:editDataHead.exchangerate,
                        paymentmny:editDataHead.paymentmny,
                        vbillstatus:editDataHead.vbillstatus,
                        separatetype:editDataHead.separatetype,
                        loantypeid:editDataHead.loantypeid,
                        payaccountid:editDataHead.payaccountid,
                        peerunittype:editDataHead.peerunittype,
                        peergathunitid:editDataHead.peergathunitid,
                        peergathaccountid:editDataHead.peergathaccountid,
                        transtatus:editDataHead.transtatus,
                        memo:editDataHead.memo,
                        paymenttype:editDataHead.paymenttype,
                        orgid:editDataHead.orgid,
                    })
                    /*判断何时不能修改 ＝＝＝＝＝＝＝＝＝》 审批状态不为待提交*/ 
                    if(editDataHead.vbillstatus.value !== 0 || editDataHead.transtatus.value !== 0){
                        _this.setState({
                            separatetypeNoEdit:true
                        })
                    }
                    //控制结算按钮
                    if((editDataHead.transtatus.value !== 0 || editDataHead.vbillstatus.value !== 1) || editDataHead.transtatus.value === 1 || editDataHead.transtatus.value === 2){
                        _this.setState({
                            passDis:false,
                        })
                    }
                    //控制下载结算状态按钮
                    if(editDataHead.transtatus.value !== 1){
                        _this.setState({
                            downPassDis:false,
                        })
                    }
                    //控制分摊按钮
                    if(!(editDataHead.separatetype.value === 1 && editDataHead.transtatus.value === 2)){
                        _this.setState({
                            shareDis:false,
                        })
                    }
                    //控制不分摊按钮
                    if(!(editDataHead.separatetype.value === 1 && editDataHead.transtatus.value === 2)){
                        _this.setState({
                            noShareDis:false,
                        })
                    }
                    //控制提交按钮
                    if(editDataHead.vbillstatus.value !== 0){
                        _this.setState({
                            submitDis:false
                        })
                    }
                    //控制收回按钮
                    if(editDataHead.vbillstatus.value !== 3){
                        _this.setState({
                            backDis:false
                        })
                    }
				} else {
                    toast({content: '后台报错,请联系管理员', color: 'warning'});
				}
			},
        })
    }
    // 根据paymentid 获取子表数据
    queryBodyByPaymentid = (id,page,size) => {
        let _this = this;
        Ajax({
            url:URL+ "fm/payment/queryBodyByPaymentid",
            data:{
                "page":page - 1,
                "size":100,
                "searchParams":{
                    "searchMap":{
                        "paymentid":id
                    }
                }                  
            },
            success: function(res) {
				const { data, success } = res;
				if (success && data.body) {
                    let editDataBody = data.body.rows;//子表
                    let pageinfo = data.body.pageinfo;//分页信息
                    editDataBody.map((e,i) => e.index = i);//添加index
                    //主表数据
                    _this.setState({
                        editDataBody:editDataBody,//子表
                        maxPage:pageinfo.totalPages,//总页数
                        totalSize:pageinfo.totalElements,//数据总数
                    })
                } 
                // else {
				// 	_this.setState({
                //         editDataBody:[],
                //     })
                //     toast({content: '暂无分摊数据', color: 'warning'});
				// }
			},
        }) 
    }
    // 新增/修改弹窗 ＝＝＝》子组件过来的数据
    paymentObj = (obj) => {
        let {editDataBody,queryType,paymentid,type,paymenttype} = this.state; //子表新增数据格式 需要推到editDataBody里
        let editDataBodyAdd;
        if(type === 'add'){
            x = x + 1;
            if(paymenttype.value === 1){
                editDataBodyAdd = {
                    "index":x,
                    "rowId": null,
                    "values": {
                        "tranid":obj.tranid,
                        "sourceid": obj.sourceid,
                        "peerunittype": {
                            "display": null,
                            "scale": -1,
                            "value": obj.peerunittype
                        },
                        "vbillstatus": {
                            "display": null,
                            "scale": -1,
                            "value": 0
                        },
                        "transtatus": {
                            "display": null,
                            "scale": -1,
                            "value": obj.transtatus
                        },
                        "payaccountid":obj.payaccountid,
                        "peergathunitid": obj.peergathunitid,
                        "peergathaccountid":obj.peergathaccountid,
                        "traneventid": {
                            "display": null,
                            "scale": -1,
                            "value": obj.traneventid
                        },
                        "paymny": {
                            "display": null,
                            "scale": -1,
                            "value": parseInt(obj.paymny)
                        },
                        "expensetypeid":obj.expensetypeid
                    },
                    "status": 2
                }
            }else{
                editDataBodyAdd = {
                    "index":x,
                    "rowId": null,
                    "values": {
                    "tranid": {
                        "display": null,
                        "scale": -1,
                        "value": obj.tranid
                    },
                    "sourceid": {
                        "display": null,
                        "scale": -1,
                        "value": obj.sourceid
                    },
                    "peerunittype": {
                        "display": null,
                        "scale": -1,
                        "value": obj.peerunittype
                    },
                    "vbillstatus": {
                        "display": null,
                        "scale": -1,
                        "value": 0
                    },
                    "gathaccountid":obj.gathaccountid,
                    "peerpayunitid":obj.peerpayunitid,
                    "peerpayaccountid":obj.peerpayaccountid,
                    "transtatus": {
                        "display": null,
                        "scale": -1,
                        "value": obj.transtatus
                    },
                    "gathmny": {
                        "display": null,
                        "scale": -1,
                        "value": obj.gathmny
                    },
                    "traneventid": {
                        "display": null,
                        "scale": -1,
                        "value": obj.traneventid
                    },
                    
                    "expensetypeid":obj.expensetypeid
                    },
                    "status": 2
                }
            }
                this.setState({
                    editDataBodyAdd:[editDataBodyAdd, ...this.state.editDataBodyAdd],
                    editDataAll:[editDataBodyAdd, ...this.state.editDataAll],
                    pageSize:this.state.pageSize,//每页显示多少条记录 
                    pageIndex:this.state.pageIndex,//页数
                    maxPage:Math.ceil([editDataBodyAdd,...this.state.editDataAll].length / this.state.pageSize),//最大页码 
                    totalSize:[editDataBodyAdd, ...this.state.editDataAll].length,//多少条记录 
                },() => {
                    if(this.state.editDataBodyAdd.length >= this.state.pageSize){
                        this.setState({
                            editDataBodyAdd:this.state.editDataAll.slice((this.state.pageIndex - 1) * this.state.pageSize,this.state.pageSize)
                        })
                    }
                    if(this.state.pageIndex > 1){
                        this.setState({
                            editDataBodyAdd:this.state.editDataAll.slice((this.state.pageIndex - 1) * this.state.pageSize,this.state.pageSize * this.state.pageIndex)
                        })
                    }
                })
        }else{
            editDataBodyAdd = obj;
            let index = editDataBodyAdd.index;
            let add = this.state.editDataBodyAdd;
            let all = this.state.editDataAll;
            for(let i = 0;i< add.length;i++){
                if(add[i].index === index){
                    add[i] = editDataBodyAdd
                }
            }
            for(let i = 0;i< all.length;i++){
                if(all[i].index === index){
                    all[i] = editDataBodyAdd
                }
            }
            this.setState({
                editDataBodyAdd:[...this.state.editDataBodyAdd],
                editDataAll:[...this.state.editDataAll],
                pageSize:this.state.pageSize,//每页显示多少条记录 
                pageIndex:this.state.pageIndex,//页数
                maxPage:Math.ceil([...this.state.editDataAll].length / this.state.pageSize),//最大页码 
                totalSize:[...this.state.editDataAll].length,//多少条记录 
            },() => {
                if(this.state.editDataBodyAdd.length >= this.state.pageSize){
                    this.setState({
                        editDataBodyAdd:this.state.editDataAll.slice((this.state.pageIndex - 1) * this.state.pageSize,this.state.pageSize)
                    })
                }
                if(this.state.pageIndex > 1){
                    this.setState({
                        editDataBodyAdd:this.state.editDataAll.slice((this.state.pageIndex - 1) * this.state.pageSize,this.state.pageSize * this.state.pageIndex)
                    })
                }
            })
        }
        if(queryType === 'edit'){
            if(type === 'add'){
                // 修改再新增分页功能暂未添加，默认一页显示50条😬😬😬
                this.setState({
                    needEditBody:[editDataBodyAdd,...this.state.needEditBody],//需要往后端存的所有修改的数据
                    editDataBody:[editDataBodyAdd,...this.state.editDataBody],//显示在表格上的所有数据 
                    totalSize:[editDataBodyAdd, ...this.state.editDataBody].length,//多少条记录 
                })
            }else{
                let index = editDataBodyAdd.index;
                let add = this.state.needEditBody;
                let all = this.state.editDataBody;
                for(let i = 0;i< add.length;i++){
                    if(add[i].index === index){
                        add[i] = editDataBodyAdd
                    }
                }
                for(let i = 0;i< all.length;i++){
                    if(all[i].index === index){
                        all[i] = editDataBodyAdd
                    }
                }
                this.setState({
                    needEditBody:[...this.state.needEditBody],//需要往后端存的所有修改的数据
                    editDataBody:[...this.state.editDataBody],//显示在表格上的所有数据 
                    totalSize:[ ...this.state.editDataBody].length,//多少条记录 
                })
            }
        }
    }
    // ============================================最终提交========================================
    paymentFormSubmit = () => {
        if(!this.state.paymentdate){
            toast({content: '请选择费用日期', color: 'danger'});
            return;
        }else if(!this.state.currtypeid.value){
            toast({content: '请选择币种', color: 'danger'});
            return;
        }else if(!this.state.exchangerate){
            toast({content: '请输入本币汇率', color: 'danger'});
            return;
        }else if(!this.state.payaccountid.value){
            toast({content: '请选择费用账户', color: 'danger'});
            return;
        }else if(!this.state.peergathunitid.value){
            toast({content: '请选择对方单位', color: 'danger'});
            return;
        }
        if(this.state.editDataAll.length === 0){
            if(!this.state.paymentmny){
                toast({content: '请输入费用金额', color: 'danger'});
                return;
            }
        }
        // 对方单位类型选金融机构，对方单位必输，对方单位账户不必输
        // 对方单位类型选合作伙伴，对方单位必输，对方单位账户必输
        /*    1金融机构      2合作伙伴                    */ 
        if(this.state.peerunittype.value === '0'){
            if(!this.state.peergathaccountid.value){
                toast({content: '请选择对方单位账户', color: 'danger'});
                return;
            }
        }
        if(this.state.queryType === 'add'){
            let payValue = 0;
            if(this.state.editDataAll.length){
                this.state.editDataAll.map((e) => delete(e.index));
                if(this.state.paymenttype.value === 1){
                    this.state.editDataAll.map(e => payValue += parseInt(e.values.paymny.value));
                }else{
                    this.state.editDataAll.map(e => payValue += parseInt(e.values.gathmny.value));
                }
            }
            Ajax({
                url:URL + "fm/payment/save",
                data:{
                    "data": {
                        "head": {
                        "pageinfo": null,
                        "rows": [
                            {
                            "rowId": null,
                            "values": { 
                                "paymentdate":this.state.paymentdate,
                                "currtypeid": this.state.currtypeid,
                                "exchangerate":this.state.exchangerate,
                                "paymentmny":{
                                    "display": null,
                                    "scale": -1,
                                    "value": this.state.editDataAll.length ? payValue : this.state.paymentmny.value
                                },
                                "vbillstatus": {
                                    "display": null,
                                    "scale": -1,
                                    "value": 0
                                },
                                "separatetype": {
                                    "display": null,
                                    "scale": -1,
                                    "value": this.state.editDataAll.length > 0 ? 0 : 1
                                },
                                "loantypeid": {
                                    "display": null,
                                    "scale": -1,
                                    "value": '费用'
                                },
                                "payaccountid":this.state.payaccountid,
                                "peerunittype":this.state.peerunittype,
                                "peergathunitid":this.state.peergathunitid,
                                "peergathaccountid":this.state.peergathaccountid,
                                "transtatus": {
                                    "display": null,
                                    "scale": -1,
                                    "value": 0
                                },
                                "paymenttype": this.state.paymenttype,
                                "memo": this.state.memo
                            },
                            "status": 2
                            }
                        ]
                        },
                        "body": {
                            "pageinfo":null,
                            "rows":this.state.editDataAll
                        }
                    },
                    "message": null,
                    "success": true       
                },
                success: function(res) {
                    const { data, success } = res;
                    if (success) {
                        toast({content: '新增成功', color: 'success'});
                        hashHistory.push('/fm/payment/');
                    } else {
                        toast({content: '后台报错,请联系管理员', color: 'warning'});
                    }
                },
            })
        }else{
            // 修改数据 主＋子
            // 主表 status =1 子表 status ＝1
            let {resData,needEditBody,editDataBody,paymenttype} = this.state;
            let values = resData.data.head.rows[0].values;
            let payValue = 0;
            if(paymenttype.value === 1){
                editDataBody.map(e => payValue += parseInt(e.values.paymny.value));
            }else{
                editDataBody.map(e => payValue += parseInt(e.values.gathmny.value));
            }
            resData.data.head.rows[0].status = 1;
            values.paymentdate = this.state.paymentdate;
            values.currtypeid = this.state.currtypeid;
            values.exchangerate = this.state.exchangerate;
            values.separatetype.value = this.state.editDataBody.length > 0 ? 0 : 1;
            values.payaccountid = this.state.payaccountid;
            values.peerunittype = this.state.peerunittype;
            values.peergathunitid = this.state.peergathunitid;
            values.peergathaccountid = this.state.peergathaccountid;
            values.memo = this.state.memo;
            values.paymentmny.value = payValue;
            if(needEditBody.length){
                needEditBody.map((e) => delete(e.index));
                needEditBody.map((e)=> e.values.transtatus.value = 2);
                let values = resData.data;
                values.body = {
                    "pageinfo":null,
                    "rows":null,
                };
                values.body.rows = needEditBody;
            }
            /*
            * 判断数据结算状态 为2 ＝＝》结算成功，走分摊接口
            * 结算状态不为 2 ＝＝》待结算的数据 走update接口
            * 其他结算状态均不可编辑 其他地方控制
            */
            if(values.transtatus.value === 2){
                /*
                *这里需要计算如果已结算后去分摊，则主表费用金额不需要动态计算
                *只需要判断付费金额或收费金额 > 0 && <=  费用金额  即可以不平
                *🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝🌝
                *待测试后再修改判断条件
                */ 
                let payValue = 0;
                let {editDataBody,paymenttype,paymentmny} = this.state;
                if(paymenttype.value === 1){
                    editDataBody.map(payValue += parseInt(e.values.paymny.value));
                }else{
                    editDataBody.map(payValue += parseInt(e.values.gathmny.value));
                }
                if(payValue > paymentmny.value){
                    toast({content: '分摊得金额不能大于费用金额', color: 'warning'});
                    return;
                }
                resData.data.head.rows[0].status = 1;
                Ajax({
                    url:URL + "fm/payment/separate",
                    data:resData,
                    success: function(res) {
                        const { data, success } = res;
                        if (success) {
                            toast({content: '保存成功', color: 'success'});
                            this.queryHeadByPaymentid(this.state.id);
                            this.queryBodyByPaymentid(this.state.id,this.state.pageIndex,this.state.pageSize);
                        } else {
                            toast({content: '后台报错,请联系管理员', color: 'warning'});
                        }
                    },
                })
            }else{
                Ajax({
                    url:URL + "fm/payment/update",
                    data:resData,
                    success: function(res) {
                        const { data, success } = res;
                        if (success) {
                            toast({content: '修改成功', color: 'success'});
                            hashHistory.push('/fm/payment/');
                        } else {
                            toast({content: '后台报错,请联系管理员', color: 'warning'});
                        }
                    },
                })
            }
        }
    }
    // 刪除行
	deleteRow = (record,index) => {
        let _this = this;
        // 控制不可删除
        if(_this.state.separatetypeNoEdit){
            toast({content: '不可删除', color: 'danger'});
            return;
        }
        if(_this.state.queryType === 'edit'){
            if(record.values.hasOwnProperty('id')){
                let resData = _this.state.resData;
                let value = resData.data;
                value.body = {
                    "rows": [
                        {
                        "rowId": null,
                        "values": {
                            "id": {
                                "display": null,
                                "scale": -1,                                                
                                "value": record.values.id.value
                            },
                            "tenantid": {
                                "display": null,
                                "scale": -1,                                                
                                "value": record.values.tenantid.value
                            },
                            "ts": {
                                "display": null,
                                "scale": -1,
                                "value": record.values.ts.value
                            }
                        },
                        "status": 3
                        }
                    ]
                }
                Ajax({
                    url:URL + "fm/payment/update",
                    data:resData,
                    success: function(res) {
                        const { data, success } = res;
                        if (success) {
                            toast({content: '删除成功', color: 'success'});
                            _this.queryBodyByPaymentid(_this.state.id,_this.state.pageIndex,_this.state.pageSize)
                        } else {
                            toast({content: '删除失败', color: 'warning'});
                        }
                    },
                    error: function(res) {
                        toast({content: '后台报错,请联系管理员', color: 'danger'});
                    },
                })
            }else{
                let {editDataBody} = this.state;
                editDataBody.splice(index,1);
                this.setState({
                    editDataBody:editDataBody,
                    totalSize:editDataBody.length,//多少条记录 
                })
            }
        }else{
            let {editDataBodyAdd,editDataAll} = this.state;
            editDataBodyAdd.splice(index,1);
            editDataAll.splice(index,1);
            this.setState({
                editDataBodyAdd:editDataBodyAdd,
                editDataAll:editDataAll,
                maxPage:Math.ceil([...editDataAll].length / this.state.pageSize),//最大页码 
                totalSize:[...editDataAll].length,//多少条记录 
            })
        }
    };
    // 页码选择
	onChangePageIndex = (page) => {
        let {queryType,editDataBody,paymentid,pageSize,pageIndex,editDataAll } = this.state;
		this.setState({
			pageIndex: page
        });
        let editDataBodyAdd = editDataAll.slice((page - 1) * pageSize, page * pageSize) 
        //请求数据
        queryType === 'add'?
        this.setState({
            editDataBodyAdd:editDataBodyAdd
        })
        :this.queryBodyByPaymentid(paymentid,page, pageSize);
	};

	//页数量选择 
	onChangePageSize = (value) => {
		this.setState({
			pageIndex: 1,
			pageSize: value
        });
        // 请求数据
        let editDataBodyAdd = this.state.editDataAll.slice(0,value);
        let maxPage = Math.ceil(this.state.editDataAll.length / value);
        this.state.queryType === 'add'?
        this.setState({
            editDataBodyAdd:editDataBodyAdd,
            pageIndex:1,
            pageSize:value,
            maxPage:maxPage,
        })
        :this.queryBodyByPaymentid(this.state.paymentid,1, value);
	};
    // 展开表格显示折叠的数据
    expandedRowRender  = (data) => {
        console.log(data)
        let {paymenttype,queryType} = this.state;
        return (
            <div className='expandedTable'>
                <Row>
                    <Col md={3} xs={3} sm={3} sm={3} xsOffset={1} smOffset={1} smOffset={1}>
                        <span>对方单位类型:</span><span>{data.values.peerunittype?(data.values.peerunittype.value==='1'?'金融机构':'合作伙伴'):''}</span>
                    </Col>
                    {
                        paymenttype.value === 1 ?
                        <div>
                        <Col md={3} xs={3} sm={3} sm={3} xsOffset={1} smOffset={1} smOffset={1}>
                            <span>付费账户:</span><span>{data.values.payaccountid?data.values.payaccountid.display:''}</span>
                        </Col>
                        <Col md={3} xs={3} sm={3} sm={3} xsOffset={1} smOffset={1} smOffset={1}>
                            <span>对方收款单位:</span><span>{data.values.peergathunitid?data.values.peergathunitid.display:''}</span>
                        </Col>
                        <Col md={3} xs={3} sm={3} sm={3} xsOffset={1} smOffset={1} smOffset={1}>
                            <span>对方收款账户:</span><span>{data.values.peergathaccountid?data.values.peergathaccountid.display:''}</span>
                        </Col>
                        </div>
                        :
                        <div>
                        <Col md={3} xs={3} sm={3} sm={3} xsOffset={1} smOffset={1} smOffset={1}>
                            <span>收费账户:</span><span>{data.values.gathaccountid?data.values.gathaccountid.display:''}</span>
                        </Col>
                        <Col md={3} xs={3} sm={3} sm={3} xsOffset={1} smOffset={1} smOffset={1}>
                            <span>对方付费单位:</span><span>{data.values.peerpayunitid?data.values.peerpayunitid.display:''}</span>
                        </Col>
                        <Col md={3} xs={3} sm={3} sm={3} xsOffset={1} smOffset={1} smOffset={1}>
                            <span>对方付费账户:</span><span>{data.values.peerpayaccountid?data.values.peerpayaccountid.display:''}</span>
                        </Col>
                        </div>
                    }
                    <Col md={3} xs={3} sm={3} sm={3} xsOffset={1} smOffset={1} smOffset={1}>
                        <span>结算状态:</span><span>{queryType === 'add'?'待结算':(data.values.transtatus.value === 0 ?'待结算':(data.values.transtatus.value === 1?'结算中':(data.values.transtatus.value === 2?'结算成功':(data.values.transtatus.value === 3?'结算失败':'部分结算成功'))))}</span>
                    </Col>
                </Row>
            </div>
        );
    }
    // 费用分摊子表弹窗
    showAddModal = () => {
        this.setState({
            showModal:true,
            type:'add',
        })
    }
    //子组件保存
    paymentAdd = () => {
        this.setState({
            showModal:false,
        })
    }
    // 子组件取消
    paymentCancle = () => {
        this.setState({
            showModal:false
        })
    }
    onDateSelect = (e) => {
        var time = e.format('YYYY-MM-DD HH:mm:ss');
		this.setState({ 
            paymentdate: {
                "display": null,
                "scale": -1,
                "value": time
            }
		});
    };
    // 结算
    passClick = () => {
        let {resData} = this.state;
        Ajax({
            url:URL + "fm/payment/pay",
            data:resData,
            success: function(res) {
                const { data, success } = res;
                if(success){
                    toast({content: '结算成功', color: 'success'});
                    this.queryHeadByPaymentid(this.state.id);
                    this.queryBodyByPaymentid(this.state.id,this.state.pageIndex,this.state.pageSize);
                }
            },
            error: function(res) {
                toast({content: '后台报错,请联系管理员', color: 'danger'});
            },
        })
    }
    // 下载结算状态
    downPassClick = () => {
        let {resData} = this.state;
        Ajax({
            url:URL + "fm/payment/getPayStatus",
            data:resData,
            success: function(res) {
                const { data, success } = res;
                if(success){
                    toast({content: '下载结算状态成功', color: 'success'});
                    this.queryHeadByPaymentid(this.state.id);
                    this.queryBodyByPaymentid(this.state.id,this.state.pageIndex,this.state.pageSize);
                }
            },
            error: function(res) {
                toast({content: '后台报错,请联系管理员', color: 'danger'});
            },
        })
    }
    // 分摊按钮
    shareClick = () => {
        this.setState({
            queryType:'edit'
        })
    }
    // 不分摊按钮
    noShareClick = () => {
        let {resData} = this.state;
        Ajax({
            url:URL + "fm/payment/unSeparate",
            data:resData,
            success: function(res) {
                const { data, success } = res;
                if(success){
                    toast({content: '不分摊成功', color: 'success'});
                    this.queryHeadByPaymentid(this.state.id);
                    this.queryBodyByPaymentid(this.state.id,this.state.pageIndex,this.state.pageSize);
                }
            },
            error: function(res) {
                toast({content: '后台报错,请联系管理员', color: 'danger'});
            },
        })
    }
    // 提交
    submit = () => {
        let _this = this;
        let {resData} = this.state;
        Ajax({
            url:URL + "fm/payment/commit",
            data:resData,
            success: function(res) {
                const { data, success } = res;
                if(success){
                    toast({content: '提交成功', color: 'success'});
                    _this.setState({
                        backDis:true
                    })
                    _this.queryHeadByPaymentid(_this.state.id);
                }
            },
            error: function(res) {
                toast({content: '后台报错,请联系管理员', color: 'danger'});
            },
        })
    }
    // 收回
    back = () => {
        let _this = this;
        let {resData} = this.state;
        Ajax({
            url:URL + "fm/payment/uncommit",
            data:resData,
            success: function(res) {
                const { data, success } = res;
                if(success){
                    toast({content: '收回成功', color: 'success'});
                    _this.setState({
                        submitDis:true
                    })
                    _this.queryHeadByPaymentid(_this.state.id);
                }
            },
            error: function(res) {
                toast({content: '后台报错,请联系管理员', color: 'danger'});
            },
        })
    }
    searchById = (id) => {
        this.queryHeadByPaymentid(id);
    }
    // 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { href: '#/fm/payment', title: '费用管理' }, { title: '费用分摊' } ];
    render() {
        // 审批组件
        let isApprove = this.props.location.pathname.indexOf('/approve') !== -1;
        /*判断 隐藏按钮*/ 
        let processInstanceId = this.props.location.query.processInstanceId;
        let businesskey = this.props.location.query.businesskey;
        let id = this.props.location.query.id;
        let {
            showModal,
            pageSize,
            pageIndex,
            maxPage,
            totalSize,
            queryType,
            editData,
            editDataAll,
            editDataBody,
            editDataBodyAdd,
            paymentid,
            paymentdate,
            currtypeid,
            exchangerate,
            paymentmny,
            vbillstatus,
            separatetype,
            loantypeid,
            payaccountid,
            peerunittype,
            peergathunitid,
            peergathaccountid,
            transtatus,
            memo,
            vbillno,
            needEditBody,
            paymenttype,
            orgid,
            separatetypeNoEdit,
            passDis,
            downPassDis,
            shareDis,
            noShareDis,
            submitDis,
            backDis,
        } = this.state;
        console.log('submitDis',this.state.submitDis);
        console.log('backDis',this.state.backDis);
        let payValue = 0;
        if(vbillstatus.value === 0){
            /* 如有子表 ======> 存主表费用金额，费用金额 ＋＝ 付费金额或收费金额 */
            // 付费
            if(paymenttype.value === 1){
                if(queryType === 'add' && editDataAll.length){
                    editDataAll.map(e => payValue += parseInt(e.values.paymny.value));
                }else if(queryType === 'edit' && editDataBody.length){
                    editDataBody.map(e => payValue += parseInt(e.values.paymny.value));
                }
            }else{
                // 收费
                if(queryType === 'add' && editDataAll.length){
                    editDataAll.map(e => payValue += e.values.gathmny.value);
                }else if(queryType === 'edit' && editDataBody.length){
                    editDataBody.map(e => payValue += parseInt(e.values.gathmny.value));
                }
            }
        }
        // 新增修改columns
        const paymentColumns = [
            { 
                title: '序号', 
				key: 'key', 
				dataIndex: 'key', 
				width: 60,
				render: (text, record, index) => {
					return (
						<span>{pageSize * (pageIndex - 1) + index + 1 }</span>
					);
				} 
            },
            { 
				title: '来源交易编号', 
				key: 'sourceNum', 
				dataIndex: 'sourceNum', 
				width: 130,
				render: (text, record, index) => {
					return (
						<span>{record.values.tranid.display}</span>
					);
				} 
            },
            { 
				title: '来源交易类型', 
				key: 'sourceid', 
				dataIndex: 'sourceid', 
				width: 130,
				render: (text, record, index) => {
					return (
						<span>{record.values.sourceid.value}</span>
					);
				} 
            },
            { 
				title: '费用交易类型', 
				key: 'expensetypeid', 
				dataIndex: 'expensetypeid', 
				width: 130,
				render: (text, record, index) => {
					return (
						<span>{record.values.expensetypeid.display}</span>
					);
				} 
            },
            { 
				title: '交易事件', 
				key: 'payEvent', 
				dataIndex: 'payEvent', 
				width: 60,
				render: (text, record, index) => {
					return (
						<span>{record.values.traneventid.value === '1'?'付款':'收款'}</span>
					);
				} 
            },
            { 
				title: paymenttype.value == 1?'付款金额':'收款金额', 
				key: 'payValue', 
				dataIndex: 'payValue', 
				width: 95,
				render: (text, record, index) => {
					return (
						<span>{paymenttype.value==1?Number(record.values.paymny.value).formatMoney(2,''):Number(record.values.gathmny.value).formatMoney(2,'')}</span>
					);
				} 
            },
            { 
				title: '操作', 
				key: 'oprate', 
				dataIndex: 'oprate', 
				width: 120,
				render: (text, record, index) => {
                    return (
                        <div>
                            <span
                            style={{ cursor: 'pointer' }}
                            onClick={()=>{
                                    this.setState({
                                        type:'edit',
                                        showModal:true,
                                        editData:record,
                                        index:index,
                                    })
                                }}
                            >
                                <Icon type="uf-pencil" className='paymentShareIcon'/>
                            </span>
                            <span style={{marginLeft: '12px'}}>
                                <DeleteModal
                                    onConfirm= {() => {this.deleteRow(record,index)}}
                                />
                            </span>
                        </div>
					);
				} 
            },
        ]
        // 浏览columns
        const paymentColumnsNoedit = [
            { 
				title: '序号', 
				key: 'key', 
				dataIndex: 'key', 
				width: 60,
				render: (text, record, index) => {
					return (
						<span>{pageSize * (pageIndex - 1) + index + 1 }</span>
					);
				} 
            },
            { 
				title: '来源交易编号', 
				key: 'sourceNum', 
				dataIndex: 'sourceNum', 
				width: 130,
				render: (text, record, index) => {
					return (
						<span>{record.values.tranid.display}</span>
					);
				} 
            },
            { 
				title: '来源交易类型', 
				key: 'sourceid', 
				dataIndex: 'sourceid', 
				width: 130,
				render: (text, record, index) => {
					return (
						<span>{record.values.sourceid.value}</span>
					);
				} 
            },
            { 
				title: '费用项目', 
				key: 'paymentProject', 
				dataIndex: 'paymentProject', 
				width: 130,
				render: (text, record, index) => {
					return (
						<span>{record.values.expensetypeid.display}</span>
					);
				} 
            },
            { 
				title: '交易事件', 
				key: 'payEvent', 
				dataIndex: 'payEvent', 
				width: 60,
				render: (text, record, index) => {
					return (
						<span>{record.values.traneventid.value === 1 ?'付款':'收款'}</span>
					);
				} 
            },
            { 
				title: paymenttype.value == 1?'付款金额':'收款金额', 
				key: 'payValue', 
				dataIndex: 'payValue', 
				width: 95,
				render: (text, record, index) => {
					return (
						<span>{paymenttype.value===1?Number(record.values.paymny.value).formatMoney(2,''):Number(record.values.gathmny.value).formatMoney(2,'')}</span>
					);
				} 
            },
        ]
        return(
            <div className='paymentShare bd-wraps'>
                {queryType === 'detail'?
                    <div className='paymentShareContent'>
                        <BreadCrumbs items={this.breadcrumbItem} />
                        { isApprove && 
                            <ApproveDetail 
                                processInstanceId={processInstanceId}
                                billid={id}//新加的
                                businesskey={businesskey}//新加的
                                refresh={this.searchById.bind(this, id)}//这个是传入自己的页面中查单据数据的方法，有参数这样写
                            /> }
                        <div className='bd-header'>
                        <div className="bd-title-1">业务信息</div>
                            <span style={{display:isApprove?'none':'true',float:'right',marginRight:'20px'}}>
                                {
                                    submitDis?
                                    <Button
                                        className="btn-2"
                                        colors="primary"
                                        type="ghost"
                                        onClick={this.submit}
                                    >
                                        提交
                                    </Button>
                                    :null
                                }
                                {
                                    backDis?
                                    <Button
                                        className="btn-2"
                                        colors="primary"
                                        type="ghost"
                                        onClick={this.back}
                                    >
                                        收回
                                    </Button>
                                    :null
                                }    
                                {
                                    passDis?
                                    <Button
                                        className="btn-2"
                                        colors="primary"
                                        type="ghost"
                                        onClick={this.passClick}
                                    >
                                        结算
                                    </Button>
                                    :null
                                }             
                                {
                                    downPassDis?
                                    <Button
                                        className="btn-2"
                                        colors="primary"
                                        type="ghost"
                                        onClick={this.downPassClick}
                                        style={{marginLeft:'10px'}}
                                    >
                                        下载结算状态
                                    </Button>
                                    :null
                                }               
                                <Button 
                                    className="btn-2 btn-cancel" 
                                    shape="border" 
                                    bordered
                                    onClick={this.shareClick}
                                    style={{display:shareDis?'display':'none'}}
                                    >
                                    分摊
                                </Button>
                                <Button 
                                    className="btn-2 btn-cancel" 
                                    shape="border" 
                                    bordered
                                    onClick={this.noShareClick}
                                    style={{display:noShareDis?'display':'none'}}
                                    >
                                    不分摊
                                </Button>
                                <ApproveDetailButton processInstanceId={processInstanceId} />
                            </span>
                        </div>
                        <Row className='paymentShareBrowseMain'>
                            <div className='paymentShareMainForm'>
                                <Col md={12} xs={12} sm={12}  xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>费用编号:</span>
                                    <span>{vbillno?vbillno:''}</span>
                                </Col>
                                <Col md={12} xs={12} sm={12}  xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>财务组织:</span>
                                    <span>{orgid?orgid.value:''}</span>
                                </Col>
                                <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>费用日期:</span>
                                    <span>{paymentdate?paymentdate.value:''}</span> 
                                </Col>
                                <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>币种:</span>
                                    <span>{currtypeid?currtypeid.display:''}</span>
                                </Col>
                                <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>本币汇率:</span>
                                    <span>{exchangerate?Number(exchangerate.value).formatMoney(4,''):''}</span>
                                </Col>
                                <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>费用金额:</span>
                                    <span>{paymentmny?Number(paymentmny.value).formatMoney(2,''):''}</span>
                                </Col>
                                <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>审批状态:</span>
                                    <span>{vbillstatus?(vbillstatus.value === 0?'待提交':(vbillstatus.value === 1?'审批通过':(vbillstatus.value === 2?'审批中':'待审批'))):''}</span>
                                </Col>
                                <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>分摊状态:</span>
                                    <span>{separatetype?(separatetype.value === 0?'已分摊':(separatetype.value === 1?'未分摊':'不分摊')):''}</span>
                                </Col>
                                <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>交易大类:</span>
                                    <span>{loantypeid?loantypeid.value:''}</span>
                                </Col>
                                <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>费用账户:</span>
                                    <span>{payaccountid?payaccountid.display:''}</span>
                                </Col>
                                <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>对方单位类型:</span>
                                    <span>{peerunittype?(peerunittype.value === '1'?'金融机构':'合作伙伴'):''}</span>
                                </Col>
                                <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>对方单位:</span>
                                    <span>{peergathunitid?(peergathunitid.display):''}</span>
                                </Col>
                                <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>对方单位账户:</span>
                                    <span>{peergathaccountid?peergathaccountid.display:''}</span>
                                </Col>
                                <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>结算状态:</span>
                                    <span>{transtatus?(transtatus.value === 0?'待结算':(transtatus.value === 1?'结算中':(transtatus.value === 2?'结算成功':(transtatus.value ===3?'结算失败':'部分结算成功')))):''}</span>
                                </Col>
                                <Col md={10} xs={10} sm={10} xsOffset={2} smOffset={2} smOffset={2}>
                                    <span>备注:</span>
                                    <span>{memo?memo.value:''}</span>
                                </Col>
                            </div>
                            <div className='paymentAdd'>
                                <div className='bd-header'>
                                    <div className="bd-title-1">费用分摊</div>
                                </div>                   
                                <Table 
                                    bordered 
                                    columns={paymentColumnsNoedit} 
                                    expandedRowRender={this.expandedRowRender}
                                    data={editDataBody} 
                                    emptyText={() => 
                                        <div>
                                            <img src={nodataPic} alt="" />
                                        </div>
                                    }
                                    rowKey={record => record.values.id.value}
                                    style={{background:'white'}}
                                />
                                <PageJump
                                    pageSize = {pageSize}
                                    activePage = {pageIndex}
                                    maxPage = {maxPage}
                                    totalSize = {totalSize}
                                    onChangePageSize = {this.onChangePageSize}
                                    onChangePageIndex = {this.onChangePageIndex}
                                />
                            </div>
                        </Row> 
                    </div>
                :
                    <div className='paymentShareContent'>
                        <BreadCrumbs items={this.breadcrumbItem} />
                        <div className='bd-header'>
                            <div className="bd-title-1">业务信息</div>
                            <span className='bd-title-2'>
                                <Button
                                    className="btn-2"
                                    colors="primary"
                                    type="ghost"
                                    onClick={this.paymentFormSubmit}
                                >
                                    保存
                                </Button>
                                <Link to={{ pathname: '/fm/payment' }}>
                                    <Button 
                                        className="btn-2 btn-cancel" 
                                        shape="border" 
                                        bordered
                                        >
                                        取消
                                    </Button>
                                </Link>
                            </span>
                        </div>
                        <div className='businessForm'>
                            <Form horizontal showSubmit={false} useRow={true}>
                                <Col md={11} xs={11} sm={11} xsOffset={1} smOffset={1} smOffset={1} style={{display:queryType==='edit'?'display':'none'}}>
                                    <Label>财务组织:</Label>
                                    <span style={{marginLeft:'24px'}} className='vbillstatus'>{orgid?orgid.value:''}</span>
                                </Col>
                                <Col md={5} xs={5} sm={5} xsOffset={1} smOffset={1} smOffset={1}> 
                                    <FormItem inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={3} md={3} sm={3} showMast={true}
                                        labelName="费用日期:" isRequire={ true }  errorMessage="请选择日期" >
                                        <DatePickerSelect  
                                            name="paymentDate"  
                                            format={ format } 
                                            locale={ zhCN }
                                            type="customer"
                                            value={paymentdate.value?moment(paymentdate.value):''} 
                                            placeholder='选择日期' 
                                            onChange={this.onDateSelect}
                                            className='paymentDate'
                                            disabled={separatetypeNoEdit}
                                        />             
                                    </FormItem>
                                </Col>
                                <Col md={5} xs={5} sm={5} style={{marginLeft:'-26px'}}>
                                    <FormItem inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={3} md={3} sm={3} 
                                    labelName="收支属性:">
                                        {queryType === 'add'?<RadioItem 
                                            name="paymenttype"
                                            defaultValue={paymenttype.value}
                                            onChange={value => this.setState({
                                                paymenttype: {
                                                    "display": null,
                                                    "scale": -1,
                                                    "value": value
                                                }
                                            })}
                                            items= {
                                                () => {
                                                    return [{
                                                        label: '付款',
                                                        value: 1
                                                    }, {
                                                        label: '收款',
                                                        value: 0
                                                    }]
                                                }
                                            }
                                        />
                                        :
                                        <span className='vbillstatus'>{paymenttype?(paymenttype.value===1?"付款":"收款"):""}</span>
                                        }   	
                                    </FormItem>
                                </Col>
                                <Col md={11} xs={11} sm={11} xsOffset={1} smOffset={1} smOffset={1} style={{marginLeft:'126px'}}>
                                    <FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={3} md={3} sm={3} isRequire={true} labelName="币种:" showMast={true}>	
                                        <Refer
                                            refModelUrl={'/bd/currencyRef/'}
                                            refCode={'currencyRef'}
                                            refName={'币种'}
                                            style={{width:'120px'}}
                                            ctx={'/uitemplate_web'}
                                            strField={[{ name: '名称', code: 'refname' }]}
                                            value={{
                                                "refpk": currtypeid.value,
                                                "refname": currtypeid.display || currtypeid.value
                                            }}
                                            onChange={value => this.setState({
                                                currtypeid:{
                                                    display:value.refname,
                                                    scale:-1,
                                                    value:value.id
                                                }
                                            })} 
                                            placeholder='请选择币种'
                                            disabled={separatetypeNoEdit}
                                        />
                                    </FormItem>
                                </Col>
                                <Col md={5} xs={5} sm={5} xsOffset={1} smOffset={1} smOffset={1}>
                                    <FormItem inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={3} md={3} sm={3} showMast={true}
                                        labelName="本币汇率:" isRequire={true} errorMessage="本币汇率格式错误" reg={/^[1-9]\d*(\.\d+)?$/}>
                                        <FormControl  
                                            name="exchangerate" 
                                            placeholder="请输入本币汇率"  
                                            onBlur={(e) => this.setState({
                                                exchangerate: {
                                                    "display": null,
                                                    "scale": 2,
                                                    "value": e === ''?e:parseInt(e).toFixed(4)
                                                },
                                            })}
                                            value={exchangerate?parseInt(exchangerate.value).toFixed(4):''}
                                            style={{width:'120px'}}
                                            disabled={separatetypeNoEdit}
                                        />	
                                    </FormItem>                                  
                                </Col>
                                <Col md={5} xs={5} sm={5} style={{marginLeft:'-26px'}}>
                                    <FormItem inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={3} md={3} sm={3} showMast={true}
                                        labelName="费用金额:" isRequire={true} errorMessage="费用金额格式错误" reg={/^[1-9]\d*(\.\d+)?$/}>
                                        <FormControl  
                                            name="paymentmny" 
                                            style={{width:'240px'}}
                                            placeholder="请输入费用金额" 
                                            onBlur={(e) => queryType === 'add' && this.setState({
                                                paymentmny: {
                                                    "display": null,
                                                    "scale": 2,
                                                    "value": e === ''?e:parseInt(e).toFixed(2)
                                                }
                                            })}
                                            value={queryType === 'add'?(editDataAll.length?parseInt(payValue).toFixed(2):null):(editDataBody.length?parseInt(payValue).toFixed(2):paymentmny?parseInt(paymentmny.value).toFixed(2):null)}
                                            disabled={separatetypeNoEdit}
                                        />	
                                    </FormItem>
                                </Col>
                                <Col md={5} xs={5} sm={5} xsOffset={1} smOffset={1} smOffset={1}>
                                    <Label>审批状态:</Label>
                                    <span style={{marginLeft:'24px'}} className='vbillstatus'>{queryType === 'add'?'待提交':((vbillstatus.value === 0?'待提交':(vbillstatus.value === 1?'审批通过':(vbillstatus.value === 2?'审批中':'待审批'))):'')}</span>
                                </Col>
                                <Col md={5} xs={5} sm={5} style={{marginLeft:'-26px'}}>
                                    <Label>分摊状态:</Label>
                                    <span style={{marginLeft:'24px'}} className='separatetype'>{queryType === 'add'?(editDataBodyAdd.length > 0 ? '已分摊' : '未分摊'):(separatetype.value === 0?'已分摊':(separatetype.value === 1?'未分摊':'不分摊'))}</span>
                                </Col>
                                <Col md={5} xs={5} sm={5} xsOffset={1} smOffset={1} smOffset={1}>
                                    <Label>交易大类:</Label>
                                    <span style={{marginLeft:'24px'}} className='loantypeid'>费用</span>
                                </Col>
                                <Col md={5} xs={5} sm={5} style={{marginLeft:'-26px'}}>
                                    <FormItem inline={ true} labelXs={2}  labelSm={2} labelMd={2} xs={3} md={3} sm={3} showMast={true}
                                        labelName="费用账户:">
                                        <Refer
                                            refModelUrl={'/bd/bankaccbasRef/'}
                                            refCode={'bankaccbasRef'}
                                            refName={'费用账户'}
                                            ctx={'/uitemplate_web'}
                                            strField={[{ name: '名称', code: 'refname' }]}
                                            style={{width:'240px'}}
                                            value={{
                                                refpk: payaccountid.value,
                                                refname: payaccountid.display || payaccountid.value
                                            }}
                                            referFilter={{ 
                                                accounttype:0, //01234对应活期、定期、通知、保证金、理财
                                                currtypeid: currtypeid?currtypeid.value:'', //币种pk
                                                // orgid: orgid?orgid.value:''//组织pk
                                            }}
                                            onChange={value => 
                                                this.setState({
                                                    payaccountid:{
                                                        display:value.refname,
                                                        scale:-1,
                                                        value:value.id
                                                    }
                                                })
                                            } 
                                            placeholder='请选择费用账户'
                                            disabled={separatetypeNoEdit}
                                        />     
                                    </FormItem>
                                </Col>
                                <Col md={5} xs={5} sm={5} xsOffset={1} smOffset={1} smOffset={1} >
                                    <FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={3} md={3} sm={3} 
                                    labelName="对方单位类型:" labelClassName='peerunittype'>
                                        <RadioItem 
                                            name="peerunittype"
                                            defaultValue={peerunittype?peerunittype.value:'1'}
                                            disabled={separatetypeNoEdit}
                                            onChange={value => {
                                                let peerunittypes = document.querySelector('.peergathaccountids');
                                                if(value === '0'){
                                                    peerunittypes.classList.add('moveLeft');
                                                }else{
                                                    peerunittypes.classList.remove('moveLeft');
                                                }
                                                if(peergathunitid){
                                                    this.setState({
                                                        peergathunitid:{}
                                                    })
                                                }
                                                this.setState({
                                                    peerunittype: {
                                                        "display": null,
                                                        "scale": -1,
                                                        "value": value
                                                    }
                                                })
                                            }
                                            }
                                            items= {
                                                () => {
                                                    return [{
                                                        label: '金融机构',
                                                        value: '1'
                                                    }, {
                                                        label: '合作伙伴',
                                                        value: '0'
                                                    }]
                                                }
                                            }
                                        />
                                    </FormItem>
                                </Col>
                                <Col md={5} xs={5} sm={5} style={{marginLeft:'-26px'}}>
                                    <FormItem inline={ true} labelXs={2}  labelSm={2} labelMd={2} xs={3} md={3} sm={3} showMast={true}
                                        labelName="对方单位:">
                                        {peerunittype.value === '1'?
                                            <Refer
                                                refModelUrl={'/bd/finbranchRef/'}
                                                refCode={'finbranchRef'}
                                                refName={'金融网点'}
                                                ctx={'/uitemplate_web'}
                                                strField={[{ name: '名称', code: 'refname' }]}
                                                style={{width:'240px'}}
                                                value={{
                                                    refpk: peergathunitid.value,
                                                    refname: peergathunitid.display || peergathunitid.value
                                                }}
                                                onChange={value => this.setState({
                                                    peergathunitid:{
                                                        display:value.refname,
                                                        scale:-1,
                                                        value:value.id
                                                    }
                                                })} 
                                                multiLevelMenu={[
                                                    {
                                                        name: ['金融机构'],
                                                        code: ['refname']
                                                    },
                                                    {
                                                        name: ['金融网点'],
                                                        code: ['refname']
                                                    }
                                                ]} 
                                                placeholder='请选择金融网点'
                                                disabled={separatetypeNoEdit}
                                            />
                                            :
                                            <Refer
                                                refModelUrl={'/bd/partnerRef/'}
                                                refCode={'partnerRef'}
                                                refName={'合作伙伴'}
                                                ctx={'/uitemplate_web'}
                                                strField={[{ name: '名称', code: 'refname' }]}
                                                style={{width:'240px'}}
                                                value={{
                                                    refpk: peergathunitid.value,
                                                    refname: peergathunitid.display || peergathunitid.value
                                                }}
                                                onChange={value => this.setState({
                                                    peergathunitid:{
                                                        display:value.refname,
                                                        scale:-1,
                                                        value:value.id
                                                    }
                                                })} 
                                                placeholder='请选择合作伙伴'
                                                disabled={separatetypeNoEdit}
                                            />    
                                        }         
                                    </FormItem>
                                </Col>
                                <Col md={5} xs={5} sm={5} xsOffset={1} smOffset={1} smOffset={1} className='peergathaccountids'>
                                    <FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={3} md={3} sm={3} showMast={peerunittype.value === '1'?false:true}
                                        labelName="对方单位账户:" labelClassName='peergathaccountid' >
                                        <Refer
                                            refModelUrl={'/bd/bankaccbasRef/'}
                                            refCode={'bankaccbasRef'}
                                            refName={'银行账户'}
                                            ctx={'/uitemplate_web'}
                                            strField={[{ name: '名称', code: 'refname' }]}
                                            style={{width:'240px'}}
                                            value={{
                                                refpk: peergathaccountid.value,
                                                refname: peergathaccountid.display || peergathaccountid.value
                                            }}
                                            onChange={value => this.setState({
                                                peergathaccountid:{
                                                    display:value.refname,
                                                    scale:-1,
                                                    value:value.id
                                                }
                                            })} 
                                            placeholder='请选择对方单位账户'
                                            disabled={separatetypeNoEdit}
                                        /> 
                                    </FormItem>
                                </Col>
                                <Col md={5} xs={5} sm={5} style={{marginLeft:'-26px'}}>
                                    <Label>结算状态:</Label>
                                    <span style={{marginLeft:'24px'}} className='transtatus'>{queryType === 'add'?'待结算':(transtatus.value === 0?'待结算':(transtatus.value === 1?'结算中':(transtatus.value === 2?'结算成功':(transtatus.value ===3?'结算失败':'部分结算成功'))))}</span>
                                </Col>
                                <Col md={10} xs={10} sm={10} xsOffset={1} smOffset={1} smOffset={1}>
                                    <FormItem  inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={10} md={10} sm={10} 
                                        labelName="备注:" method="change"  change={this.textareaChange} labelClassName='memoLabel'>
                                        <TextAreaItem  
                                            cols={100} 
                                            count={ 200 } 
                                            className='memo' 
                                            defaultValue={memo?memo.value:''}
                                            placeholder='请输入'
                                            disabled={separatetypeNoEdit}
                                        />
                                    </FormItem>
                                </Col>
                            </Form>
                        </div>
                        {/*这里控制子表的显示*/}
                        <div className='paymentAdd'>
                            <div className='bd-header'>
                                <div className="bd-title-1">费用分摊</div>
                                <span>
                                    <Button
                                        className="btn-2"
                                        colors="primary"
                                        type="ghost"
                                        onClick={this.showAddModal}
                                        style={{display:separatetypeNoEdit?'none':'display'}}
                                    >
                                        新增
                                    </Button>
                            </span>
                            </div>                   
                            <Table 
                                bordered 
                                columns={paymentColumns} 
                                expandedRowRender={this.expandedRowRender}
                                data={this.state.queryType === 'add'?editDataBodyAdd:editDataBody} 
                                emptyText={() => 
                                    <div>
                                        <img src={nodataPic} alt="" />
                                    </div>
                                }
                                rowKey={record => record.index}
                                style={{background:'white'}}
                            />
                            <PageJump
                                pageSize = {pageSize}
                                activePage = {pageIndex}
                                maxPage = {maxPage}
                                totalSize = {totalSize}
                                onChangePageSize = {this.onChangePageSize}
                                onChangePageIndex = {this.onChangePageIndex}
                            />
                        </div>
                    </div>
                }
                <PaymentAddModal
                    showModal={showModal}
                    paymentAdd={this.paymentAdd.bind(this)}
                    paymentCancle={this.paymentCancle.bind(this)}
                    type={this.state.type}
                    paymentObj={this.paymentObj.bind(this)}
                    editData={editData}
                    paymenttype={this.state.paymenttype}
                    separatetypeNoEdit={this.state.separatetypeNoEdit}
                    queryType={this.state.queryType}
                    orgid={this.state.orgid}
                    currtypeid={this.state.currtypeid}
                />
            </div>
        )
    }
}