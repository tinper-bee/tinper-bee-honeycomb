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
import  Form from 'bee-form';
import FormControl from 'bee-form-control';
import 'bee-form/build/Form.css';
import { toast, debounce } from '../../../../../utils/utils.js';
import BreadCrumbs from '../../../../bd/containers/BreadCrumbs';
import './index.less';
import {RadioItem, TextAreaItem} from 'containers/FormItems';
import DatePicker from 'bee-datepicker';
import zhCN from 'rc-calendar/lib/locale/zh_CN';
import moment from 'moment';
import DatePickerSelect from '../../../../pass/containers/DatePickerSelect/index.js';
import DeleteModal from '../../../../../containers/DeleteModal/index.js';
import Ajax from '../../../../../utils/ajax';
import Refer from '../../../../../containers/Refer/index.js';
import MsgModal from '../../../../../containers/MsgModal/index.js';
import {formatMoney} from '../../../../../utils/utils.js';
import ApproveDetail from 'containers/ApproveDetail';
import ApproveDetailButton from 'containers/ApproveDetailButton';
const { FormItem } = Form;
const format = 'YYYY-MM-DD';
const URL= window.reqURL.fm;
const vbillno = (moment().format('YYYYMMDD') + Math.floor(Math.random()*100000000)).replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 - ");
export default class guacontractquoteCard extends Component {
    constructor(props) {
		super(props);
		this.state={
            type:'',//类型 add edit detail
            saveShow:false,//保存弹窗
            deleteShow:false,//删除弹窗
            id:{},//id 主键
            ts:{},//时间戳
            editData:{},//需要修改的所有数据
            orgid:{},
            vbillno:{
                display:null,
                scale:-1,
                value:vbillno
            },
            debtcode:null,
            guacontractid:{},
            currtypeid:{},
            direction:{
                "display": null,
                "scale": -1,
                "value": 1
            },
            startdate:{},
            enddate:{},
            quoteamount:null,
            amount:null,
            quoteolcrate:null,
            vbillstatus:null,
            submitDis:true,
            backDis:true,
        }  
    };
    componentWillMount () {
        let type = this.props.location.query.type;
        let id = this.props.location.query.id;
        this.setState({
            type:type,
            id:id,
        })
        type ==='add'?null:this.queryById(id);
    }
    startdate = (e) => {
        var time = e.format('YYYY-MM-DD HH:mm:ss');
		this.setState({ 
            startdate: {
                "display": null,
                "scale": -1,
                "value": time
            }
		});
    }
    enddate = (e) => {
        var time = e.format('YYYY-MM-DD HH:mm:ss');
		this.setState({ 
            enddate: {
                "display": null,
                "scale": -1,
                "value": time
            }
		});
    }
    // 根据id查询信息
    queryById = (id) => {
        let _this = this;
        Ajax({
            url:URL+ "fm/guacontractquote/query",
            data:{        
                "id":id         
            },
            success: function(res) {
				const { data, success } = res;
				if (success) {
                    let value = data.head.rows[0].values;
                    if(_this.state.type === 'edit'||_this.state.type === 'detail'){
                        _this.setState({
                            editData:value
                        })
                    }
                    if(value.vbillstatus.value !== 0){
                        _this.setState({
                            submitDis:false
                        })
                    }
                    if(value.vbillstatus.value !== 3){
                        _this.setState({
                            backDis:false
                        })
                    }
                    _this.setState({
                        id:value.id,
                        ts:value.ts,
                        orgid:value.orgid,
                        vbillno:value.vbillno,
                        debtcode:value.debtcode,
                        guacontractid:value.guacontractid,
                        currtypeid:value.currtypeid,
                        direction:value.direction,
                        startdate:value.startdate,
                        enddate:value.enddate,
                        quoteamount:value.quoteamount,
                        quoteolcrate:value.quoteolcrate, 
                        amount:value.amount,
                        vbillstatus:value.vbillstatus.value,
                    })
				} else {
                    toast({content: '后台报错,请联系管理员', color: 'warning'});
				}
			},
        })
    }
    // 保存
    quoteSave = () => {
        let _this = this;
        if(!_this.state.orgid.value){
            toast({content: '请选择单位', color: 'danger'});
            return;
        }else if(!_this.state.debtcode){
            toast({content: '请输入关联债务编号', color: 'danger'});
            return;
        }else if(!_this.state.guacontractid.value){
            toast({content: '请选择担保合同', color: 'danger'});
            return;
        }else if(!_this.state.currtypeid.value){
            toast({content: '请选择币种', color: 'danger'});
            return;
        }else if(!_this.state.startdate.value){
            toast({content: '请选择债务开始日期', color: 'danger'});
            return;
        }else if(!_this.state.enddate.value){
            toast({content: '请选择债务结束日期', color: 'danger'});
            return;
        }else if(!_this.state.quoteamount){
            toast({content: '请输入占用担保金额', color: 'danger'});
            return;
        }else if(!_this.state.quoteolcrate.value){
            toast({content: '请选择组织本币汇率', color: 'danger'});
            return;
        }else if(!_this.state.amount.value){
            toast({content: '请输入债务金额', color: 'danger'});
            return;
        }
        Ajax({
            url:URL + "fm/guacontractquote/save",
            data:{
                "data": {
                    "head": {
                      "rows": [
                        {
                            "values": {
                                "orgid":_this.state.orgid,
                                "vbillno":_this.state.vbillno,
                                "debtcode":_this.state.debtcode,
                                "guacontractid":_this.state.guacontractid,
                                "currtypeid":_this.state.currtypeid,
                                "direction":_this.state.direction,
                                "startdate":_this.state.startdate,
                                "enddate":_this.state.enddate,
                                "quoteamount":_this.state.quoteamount,
                                "quoteolcrate":_this.state.quoteolcrate,
                                "amount":_this.state.amount,
                                "status": {
                                    "value": "2"
                                }
                            }
                        }
                      ]
                    }
                }    
            },
            success: function(res) {
                const { data, success } = res;
                if (success) {
                    _this.setState({
                        saveShow:true,
                    })
                } else {
                    toast({content: '后台报错,请联系管理员', color: 'warning'});
                }
            },
        })
    }
    // 保存后取消
    saveCancle = () => {
        this.setState({
            saveShow:false
        })
        hashHistory.push('/fm/guacontractquote/');
    }
    // 保存后继续新增
    saveConfirm = () => {
        this.setState({
            saveShow:false,
            orgid:{},
            vbillno:{
                display:null,
                scale:-1,
                value:(moment().format('YYYYMMDD') + Math.floor(Math.random()*100000000)).replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 - ")
            },
            debtcode:null,
            guacontractid:{},
            currtypeid:{},
            direction:{
                "display": null,
                "scale": -1,
                "value": 1
            },
            startdate:{},
            enddate:{},
            quoteamount:null,
            quoteolcrate:null,
            amount:null
        })
    }
    // 修改关闭
    editCancle = () => {
        this.setState({
            saveShow:false
        })
        hashHistory.push('/fm/guacontractquote/');
    }
    // 修改之后继续修改
    editConfirm = () => {
        let id  = this.props.location.query.id;
        this.queryById(id);
        this.setState({
            saveShow:false
        })
    }
    //删除取消
    deleteCancle = () => {
        this.setState({
            deleteShow:false,
        })
    }
    // 删除确认
    deleteConfirm = () => {
        let _this = this;
        if(_this.state.vbillstatus !== 0 ){
            toast({content: '数据已提交，不可删除', color: 'success'});
            return;
        }
        Ajax({
            url:URL + 'fm/guacontractquote/save',
            data:{
                "data": {
                  "head": {
                    "rows": [
                      {
                        "values": {
                          "id": {
                            "value": this.state.id.value
                          },
                          "ts": {
                            "value": this.state.ts.value
                          },
                          "tenantid": {
                            "value": "vs1h8do0"
                          },
                          "vbillstatus":{
                              "value":this.state.vbillstatus
                          },
                          "status": {
                            "value": "3"
                          }
                        }
                      }
                    ]
                  }
                }
            },
            success: function(res) {
                const { data, success } = res;
                if (success) {
                    toast({content: '删除成功', color: 'success'});
                    hashHistory.push('/fm/guacontractquote/');
                } else {
                    toast({content: '删除失败', color: 'warning'});
                }
            },
            error: function(res) {
                toast({content: '后台报错,请联系管理员', color: 'danger'});
            },
        })
    }
    // 修改提交
    quoteEdit = () => {
        let _this = this;
        if(!_this.state.orgid.value){
            toast({content: '请选择单位', color: 'danger'});
            return;
        }else if(!_this.state.debtcode){
            toast({content: '请输入关联债务编号', color: 'danger'});
            return;
        }else if(!_this.state.guacontractid.value){
            toast({content: '请选择担保合同', color: 'danger'});
            return;
        }else if(!_this.state.currtypeid.value){
            toast({content: '请选择币种', color: 'danger'});
            return;
        }else if(!_this.state.startdate.value){
            toast({content: '请选择债务开始日期', color: 'danger'});
            return;
        }else if(!_this.state.enddate.value){
            toast({content: '请选择债务结束日期', color: 'danger'});
            return;
        }else if(!_this.state.quoteamount){
            toast({content: '请输入占用担保金额', color: 'danger'});
            return;
        }else if(!_this.state.quoteolcrate.value){
            toast({content: '请选择组织本币汇率', color: 'danger'});
            return;
        }else if(!_this.state.amount.value){
            toast({content: '请输入债务金额', color: 'danger'});
            return;
        }
        let {editData,type,title,confirmText} = this.state;
        editData.orgid = this.state.orgid,
        editData.vbillno = this.state.vbillno,
        editData.debtcode = this.state.debtcode,
        editData.guacontractid = this.state.guacontractid,
        editData.currtypeid = this.state.currtypeid,
        editData.direction = this.state.direction,
        editData.startdate = this.state.startdate,
        editData.enddate = this.state.enddate,
        editData.amount = this.state.amount;
        editData.quoteamount = this.state.quoteamount,
        editData.quoteolcrate = this.state.quoteolcrate,
        editData.status = {
            "value":"1"
        };
        Ajax({
            url:URL + "fm/guacontractquote/save",
            data:{
                "data": {
                    "head": {
                      "rows": [
                        {
                            "values": editData,
                        }
                      ]
                    }
                }    
            },
            success: function(res) {
                const { data, success } = res;
                if (success) {
                    _this.setState({
                        saveShow:true
                    })
                    // hashHistory.push('/fm/guacontractquote/');
                } else {
                    toast({content: '后台报错,请联系管理员', color: 'warning'});
                }
            },
        })
    }
    // 删除
    quoteDelete = () => {
        this.setState({
            deleteShow:true,
        })
    }
    successClick = () => {
        console.log('1')
    }
    falseClick = () => {
        console.log('2')
    }
    searchById = (id) => {
        this.queryById(id);
    }
    // 提交
    submit = () => {
        let _this = this;
        Ajax({
            url:URL + "fm/guacontractquote/commit",
            data:{
                "data": {
                    "head": {
                      "rows": [
                        {
                            "values": this.state.editData,
                        }
                      ]
                    }
                }    
            },
            success: function(res) {
                const { data, success } = res;
                if (success) {
                    toast({content: '提交成功', color: 'success'});
                    _this.setState({
                        backDis:true
                    })
                    _this.queryById(_this.state.id.value);
                } else {
                    toast({content: '后台报错,请联系管理员', color: 'warning'});
                }
            },
        })
    }
    // 收回
    back = () => {
        let _this = this;
        Ajax({
            url:URL + "fm/guacontractquote/uncommit",
            data:{
                "data": {
                    "head": {
                      "rows": [
                        {
                            "values": this.state.editData,
                        }
                      ]
                    }
                }    
            },
            success: function(res) {
                const { data, success } = res;
                if (success) {
                    toast({content: '收回成功', color: 'success'});
                    _this.setState({
                        submitDis:true
                    })
                    _this.queryById(_this.state.id.value);
                } else {
                    toast({content: '后台报错,请联系管理员', color: 'warning'});
                }
            },
        })
    }
    // 面包屑数据
	breadcrumbItem = [ { href: '#', title: '首页' }, { href: '#/fm/', title: '融资交易' }, { href: '#/fm/guacontractquote', title: '担保债务管理' } ];
    render () {
        let {
            type,
            saveShow,
            deleteShow,
            orgid,
            vbillno,
            debtcode,
            guacontractid,
            currtypeid,
            direction,
            quoteamount,
            quoteolcrate,
            startdate,
            enddate,
            amount,
            vbillstatus,
            submitDis,
            backDis,
        } = this.state;
        // 审批组件
        let isApprove = this.props.location.pathname.indexOf('/approve') !== -1;
        /*判断 隐藏按钮*/ 
        let processInstanceId = this.props.location.query.processInstanceId;
        let businesskey = this.props.location.query.businesskey;
        let id = this.props.location.query.id;
        return (
            <div className='guacontractquoteCard bd-wraps'>
                <BreadCrumbs items={this.breadcrumbItem} />
                { isApprove && 
                    <ApproveDetail 
                        processInstanceId={processInstanceId}
                        billid={id}//新加的
                        businesskey={businesskey}//新加的
                        refresh={this.searchById.bind(this, id)}//这个是传入自己的页面中查单据数据的方法，有参数这样写
                />}
                <div className='bd-header'>
                    <div className="bd-title-1">担保债务管理</div>
                    <span className='bd-title-2'>
                    {
                        type === 'detail'?
                        <div>
                            <Button
                                className="btn-2"
                                colors="primary"
                                type="ghost"
                                onClick={()=>{
                                    this.setState({
                                        type:'edit',
                                    })
                                }}
                            >
                                修改
                            </Button>
                            <Button 
                                className="btn-2 btn-cancel" 
                                shape="border" 
                                bordered
                                onClick={this.quoteDelete}
                                >
                                删除
                            </Button>
                            {
                                submitDis?
                                <Button
                                    className="btn-2 btn-cancel" 
                                    shape="border" 
                                    bordered
                                    onClick={this.submit}
                                >
                                    提交
                                </Button>
                                :null
                            }
                            {
                                backDis?
                                <Button
                                    className="btn-2 btn-cancel" 
                                    shape="border" 
                                    bordered
                                    onClick={this.back}
                                >
                                    收回
                                </Button>
                                :null
                            }
                            {<ApproveDetailButton processInstanceId={processInstanceId} />}
                        </div>
                        :
                        <div>
                            <Button
                                className="btn-2"
                                colors="primary"
                                type="ghost"
                                onClick={type === 'add'?this.quoteSave : this.quoteEdit}
                            >
                                保存
                            </Button>
                            <Button
                                className="btn-2 btn-cancel" 
                                shape="border" 
                                bordered
                                onClick={()=>{
                                    hashHistory.push('/fm/guacontractquote/');
                                }}
                            >
                                取消
                            </Button>
                        </div>
                    }
                </span>
                </div>
                {
                    type === 'detail' ?
                    <div className='guacontractquoteForm  guacontractquoteFormDetail'>
                        <a className='vbillDivSuccess' onClick={this.successClick} style={{display:'none'}}>
                            <h3>通过</h3>
                            <p>查看详情</p>
                        </a>
                        <a className='vbillDivFalse' onClick={this.falseClick} style={{display:'none'}}>
                            <h3>驳回</h3>
                            <p>查看详情</p>
                        </a>
                        <Col md={10} xs={10} sm={10}  xsOffset={2} smOffset={2} smOffset={2}>
                            <span>单位:</span>
                            <span>{orgid?orgid.display:''}</span>
                        </Col>
                        <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                            <span>担保债务单据号:</span>
                            <span>{vbillno?vbillno.value:''}</span>
                        </Col>
                        <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                            <span>债务编号:</span>
                            <span>{debtcode?debtcode.value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 - "):''}</span>
                        </Col>
                        <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                            <span>担保合同:</span>
                            <span>{guacontractid?guacontractid.display:''}</span>
                        </Col>
                        <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                            <span>债务币种:</span>
                            <span>{currtypeid?currtypeid.display:''}</span>
                        </Col>
                        <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                            <span>债务金额:</span>
                            <span>{amount?Number(amount.value).formatMoney(2,''):''}</span>
                        </Col>
                        <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                            <span>方向:</span>
                            <span>{direction?(direction.value === 1?'占用':'担保'):''}</span>
                        </Col>
                        <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                            <span>债务开始日期:</span>
                            <span>{startdate?startdate.value:''}</span>
                        </Col>
                        <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                            <span>债务结束日期:</span>
                            <span>{enddate?enddate.value:''}</span>
                        </Col>
                        <Col md={4} xs={4} sm={4}  xsOffset={2} smOffset={2} smOffset={2}>
                            <span>占用担保金额:</span>
                            <span>{quoteamount?Number(quoteamount.value).formatMoney(2,''):''}</span>
                        </Col>
                        <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                            <span>组织本币汇率:</span>
                            <span>{quoteolcrate?Number(quoteolcrate.value).toFixed(4):''}</span>
                        </Col>
                        <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2}>
                            <span>审批状态:</span>
                            <span>{vbillstatus!==null?(vbillstatus === 0 ?'待提交':(vbillstatus === 1 ? '审批通过':(vbillstatus === 2 ? '审批中':'待审批'))):''}</span>
                        </Col>
                    </div>
                    :
                    <div className='guacontractquoteForm'>
                        <Form horizontal showSubmit={false} useRow={true}>
                            <Col md={10} xs={10} sm={10} xsOffset={2} smOffset={2} smOffset={2}>
                                <FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={3} md={3} sm={3} isRequire={true} labelName="单位:" showMast={true} className='referItem'>	
                                    <Refer
                                        ctx={'/uitemplate_web'}
                                        refModelUrl={'/bd/finorgRef/'}
                                        refCode={'finorgRef'}
                                        refName={'财务组织'}
                                        strField={[{ name: '名称', code: 'refname' }]}
                                        value={{
                                            refpk: orgid.value,
                                            refname: orgid.display 
                                        }}
                                        onChange={value => this.setState({
                                            orgid:{
                                                display:value.refname,
                                                scale:-1,
                                                value:value.id
                                            }
                                        })} 
                                        placeholder='当前公司组织'
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2} style={{left:'-56px'}}>
                                <Label>担保债务单据号:</Label>
                                <span className='vbillno'>{this.state.vbillno.value}</span>
                            </Col>
                            <Col md={4} xs={4} sm={4} xsOffset={1} smOffset={1} smOffset={1}>
                                <FormItem inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={3} md={3} sm={3} 
                                    labelName="债务编号:" isRequire={true} showMast={true}>
                                    <FormControl   
                                        placeholder="请输入债务编号"  
                                        style={{width:'340px'}}
                                        onBlur={(e) => this.setState({
                                            debtcode: {
                                                "display": null,
                                                "scale": -1,
                                                "value": e 
                                            },
                                        })}
                                        value={debtcode?(debtcode.value?debtcode.value.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, "$1 - "):''):''}
                                    />	
                                </FormItem>                                  
                            </Col>
                            <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2} style={{left:'-19px'}}>
                                <FormItem method='blur' inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={10} md={10} sm={10} 
                                labelName="担保合同:" className='referItem'>
                                    <Refer
                                        ctx={'/uitemplate_web'}
                                        refModelUrl={'/fm/guacontractRef/'}
                                        refCode={'guacontractRef'}
                                        refName={'担保合同'}
                                        value={{
                                            refpk: guacontractid.value,
                                            refname: guacontractid.display 
                                        }}
                                        multiLevelMenu={[
                                            {
                                                name: [ '合同编号' ],
                                                code: [ 'ractno' ]
                                            }
                                        ]}
                                        onChange={value => {
                                            this.setState({
                                                guacontractid: {
                                                    display:value.ractno,
                                                    scale:-1,
                                                    value:value.id
                                                }
                                            });
                                        }}
                                        referFilter={{ 
                                            contracttype:1 
                                        }}
                                        placeholder='请选择担保合同'
                                    /> 
                                </FormItem>
                            </Col>
                            <Col md={4} xs={4} sm={4} xsOffset={1} smOffset={1} smOffset={1}>
                                <FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={3} md={3} sm={3} isRequire={true} labelName="债务币种:" showMast={true} className='referItem'>	
                                    <Refer
                                        refModelUrl={'/bd/currencyRef/'}
                                        refCode={'currencyRef'}
                                        refName={'币种'}
                                        ctx={'/uitemplate_web'}
                                        strField={[{ name: '名称', code: 'refname' }]}
                                        value={{
                                            refpk: currtypeid.value,
                                            refname: currtypeid.display 
                                        }}
                                        onChange={value => this.setState({
                                            currtypeid:{
                                                display:value.refname,
                                                scale:-1,
                                                value:value.id
                                            }
                                        })} 
                                        placeholder='请选择债务币种'
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2} style={{left:'-27px'}}>
                                <FormItem inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={3} md={3} sm={3} 
                                    labelName="债务金额:" isRequire={true} errorMessage="债务金额格式错误" showMast={true} isRequire={true} reg={/^[1-9]\d*(\.\d+)?$/}>
                                    <FormControl   
                                        placeholder="请输入债务金额"  
                                        className='amount quoteamount'
                                        onBlur={(e) => this.setState({
                                            amount: {
                                                "display": null,
                                                "scale": -1,
                                                "value": e ===''?'':parseInt(e).toFixed(2) 
                                            },
                                        })}
                                        value={amount?Number(amount.value).formatMoney(2,''):''}
                                    />	
                                </FormItem>                                  
                            </Col>
                            <Col md={4} xs={4} sm={4} xsOffset={1} smOffset={1} smOffset={1} style={{left:'34px'}}>
                                <FormItem inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={3} md={3} sm={3} 
                                labelName="方向:">
                                    <RadioItem 
                                        style={{paddingLeft:'10px'}}
                                        defaultValue={direction.value?direction.value:1}
                                        onChange={value => this.setState({
                                            direction: {
                                                "display": null,
                                                "scale": -1,
                                                "value": value
                                            }
                                        })}
                                        items= {
                                            () => {
                                                return [{
                                                    label: '占用',
                                                    value: 1
                                                }, {
                                                    label: '担保',
                                                    value: 2
                                                }]
                                            }
                                        }
                                    />  	
                                </FormItem>
                            </Col>
                            <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2} style={{left:'-53px'}}>
                                <FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={3} md={3} sm={3} isRequire={true} labelName="债务开始日期:" showMast={true}>
                                    <DatePickerSelect
                                        placeholder='债务开始日期'
                                        value= {startdate.value?moment(startdate.value):''}
                                        onChange={this.startdate}
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={4} sm={4} xsOffset={1} smOffset={1} smOffset={1} style={{left:'-27px'}}>
                                <FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={3} md={3} sm={3} isRequire={true} labelName="债务结束日期:" showMast={true}>
                                    <DatePickerSelect
                                        placeholder='债务结束日期'
                                        disabledDate={(current) => startdate.value? current && current.valueOf() < moment(startdate.value):null}
                                        value= {enddate.value?moment(enddate.value):''}
                                        onChange={this.enddate}
                                    />
                                </FormItem>
                            </Col>
                            <Col md={4} xs={4} sm={4} xsOffset={2} smOffset={2} smOffset={2} style={{left:'-53px'}}>
                                <FormItem inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={3} md={3} sm={3}  showMast={true}
                                    labelName="占用担保金额:" isRequire={true} errorMessage="占用担保金额格式错误" reg={/^[1-9]\d*(\.\d+)?$/}>
                                    <FormControl   
                                        placeholder="请输入占用担保金额" 
                                        className='quoteamount' 
                                        onBlur={(e) => this.setState({
                                            quoteamount: {
                                                "display": null,
                                                "scale": 2,
                                                "value": e ===''?'':parseInt(e).toFixed(2)
                                            },
                                        })}
                                        value={quoteamount?Number(quoteamount.value).formatMoney(2,''):''}
                                    />	
                                </FormItem>                                  
                            </Col>
                            <Col md={4} xs={4} sm={4} xsOffset={1} smOffset={1} smOffset={1} style={{left:'-27px'}}>
                                <FormItem inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={3} md={3} sm={3} 
                                isRequire={true} labelName="组织本币汇率:" showMast={true} errorMessage="本币汇率格式错误" reg={/^[1-9]\d*(\.\d+)?$/}>	
                                   <FormControl  
                                    name="quoteolcrate" 
                                    placeholder="请输入组织本币汇率"  
                                    onBlur={(e) => this.setState({
                                        quoteolcrate: {
                                            "display": null,
                                            "scale": 2,
                                            "value": e === ''?e:parseInt(e).toFixed(4)
                                        },
                                    })}
                                    value={quoteolcrate?parseInt(quoteolcrate.value).toFixed(4):''}
                                />
                                </FormItem>
                            </Col>
                            {/*upload组件*/}
                        </Form>
                    </div>
                }
                    <MsgModal
                        show={saveShow}
                        title={type === 'add'?'保存成功':'修改成功'}
                        confirmText={type === 'add'?'继续新增':'继续修改'}
                        cancelText='关闭'
                        onCancel={type === 'add'?this.saveCancle:this.editCancle}
                        onConfirm={type ==='add'?this.saveConfirm:this.editConfirm}
                    />
                    <MsgModal
                        show={deleteShow}
                        title={'确定删除这条信息'}
                        icon='icon-shanchu'
                        confirmText='确定'
                        cancelText='取消'
                        onCancel={this.deleteCancle}
                        onConfirm={this.deleteConfirm}
                    />
            </div>
        )
    }
}