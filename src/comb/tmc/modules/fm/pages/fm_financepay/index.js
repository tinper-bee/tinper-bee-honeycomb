
import React, { Component } from 'react';
import {Select,Icon,Breadcrumb, ButtonGroup,Popconfirm,Row, Col ,Button,Table,Checkbox} from 'tinper-bee';
import {Link, hashHistory} from 'react-router';
const Option = Select.Option;
import './index.less';
import Form from 'bee-form';
import Switch from 'bee-switch';
const FormItem = Form.FormItem;
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import { CheckboxItem, RadioItem,ReferItem } from 'containers/FormItems';
import Label from 'bee-label';
import classnames from 'classnames';
import FormControl from 'bee-form-control';
import DatePicker from 'bee-datepicker';
import Radio from 'bee-radio';
import Modal from 'bee-modal';
import Tabs, {TabPane} from 'bee-tabs';
import Affix from 'bee-affix';
import moment from "moment";
import Dropdown from 'bee-dropdown';
import Refer from "../../../../containers/Refer/index";
import deepClone from '../../../../utils/deepClone.js'
import TextareaItem from '../fm_applycard/TextareaItem';
import InputItem from '../fm_applycard/InputItem';
import LightTabs from './LightTabs';
import PayRender from './payRender/index.js';
import RateRender from './rateRender/index.js';
import AdjrateRender from './adjrateRender/index.js';
import Ajax from '../../../../utils/ajax.js';
import {toast} from '../../../../utils/utils.js';
import MsgModal from '../../../../containers/MsgModal/index';
import jump from 'jump.js';
import ApproveDetail from 'containers/ApproveDetail';
import ApproveDetailButton from 'containers/ApproveDetailButton';
import TmcUploader from 'containers/TmcUploader/index';

const CONFIG = {
	ANCHOR : { // 锚节点
		values: ['业务信息', '利率信息','利率调整方案','其他信息'],
		width: [100,100,110,112]
	},
	JUMP_CONFIG : { // 滚动条滚动
		offset: 60, // 60为tab的高度
		duration: 300
    }
}
let data1=[],data2=[],data3=[],cancelData=[],i=0;
//空数据
let data = {
    'head':{
        'pageinfo': null,
        'rows': [
            {
                'rowId': null,
                'values': {
                    'id': {
                        'display': null,
                        'scale': -1,
                        'value': null
                        },
                    'contractid':{
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'financecorpid':{
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'planpayid':{
                        'display':null,
                        'scale': -1,
                        'value': null
                    },
                    'financorgid': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'loancode': {
                        'display': null,
                        'scale': -1,
                        'value':null
                    },
                    'fininstitutionid': {
                        'display': null,
                        'scale': -1,
                        'value': null
                        },
                    'trantypeid': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'tranevent': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'currtypeid': {
                        'display': null,
                        'scale': -1,
                        'value':null
                        },
                    'loanmny': {
                        'display': null,
                        'scale': -1,
                        'value':null
                    },
                    'rate': {
                        'display': null,
                        'scale': -1,
                        'value':null
                    },
                    'loandate': {
                        'display': null,
                        'scale': -1,
                        'value': ''
                        },
                    'contenddate': {
                        'display': null,
                        'scale': -1,
                        'value': ''
                    },
                    'debitunitacctid': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'memo': {
                        'display': null,
                        'scale': -1,
                        'value':null
                        },
                    'projectid': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'settleflag': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'terminatedate': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'ispayusecc':{
                        'display': null,
                        'scale': -1,
                        'value': '0'
                    },
                    'payreleasemny':{
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'approver':{
                        'dispaly': null,
                        'scale': -1,
                        'value': null
                    },
                    'approvedate':{
                        'dispaly': null,
                        'scale': -1,
                        'value': null
                    },
                    'vbillstatus':{
                        'dispaly': null,
                        'scale': -1,
                        'value':null
                    }
                }
            }   
        ]    
    },
    "rate":{
        'pageinfo': null,
        'rows': [
            {
                'rowId': null,
                'values': {
                    'id': {
                        'display': null,
                        'scale': -1,
                        'value':  null
                        },
                    'rateid': {
                        'display': null,
                        'scale': -1,
                        'value':  null
                    },
                    'isfixrate': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'floatratescale': {
                        'display': null,
                        'scale': -1,
                        'value': null
                        },
                    'floatratepoints': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'settledate': {
                        'display': null,
                        'scale': -1,
                        'value': ''
                    },
                    'returnmodeid': {
                        'display': null,
                        'scale': -1,
                        'value': null
                        },
                    'overratescale': {
                        'display': null,
                        'scale': -1,
                        'value':null
                    },
                    'headratescale': {
                        'display': null,
                        'scale': -1,
                        'value':null
                    },
                    'overratepoint': {
                        'display': null,
                        'scale': -1,
                        'value': null
                        },
                    'headratepoint': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'isoverinterest': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'isusenormalrate': {
                        'display': null,
                        'scale': -1,
                        'value': null
                        }
                }
            }   
        ]    
    },
    'adjrate':{
        'pageinfo': null,
        'rows': [
            {
                'rowId': null,
                'values':{
                    'id': {
                        'display': null,
                        'scale': -1,
                        'value': null
                        },
                    'adjratemethod': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'effecttype': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'adjbegdate': {
                        'display': null,
                        'scale': -1,
                        'value': null
                        },
                    'adjperiodunit': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    },
                    'lastadjdate': {
                        'display': null,
                        'scale': -1,
                        'value': null
                    }
                }
            }
        ] 
    },
    "ccinfo":{
        'pageinfo': null,
        'rows': [
            {
                'rowId': 0,
                'values': {
                   
                }
            }   
        ]    
        
    },
    "planrepay":{
        'pageinfo': null,
        'rows': [
            {
                'rowId': 0,
                'values': {
                   
                }
            }   
        ]    
    },
    "extinfo":{
        'pageinfo': null,
        'rows': [
            {
                'rowId': 0,
                'values': {
                   
                }
            }   
        ]    
    }
}
const rootUrl =window.reqURL.fm+'fm/loan/';
//放款
let financepayData= data.head.rows[0].values;
//利率信息
let rateData= data.rate.rows[0].values;
//利率调整
let adjrateData= data.adjrate.rows[0].values;
let contractRefVal={'refname':null,'refpk':null};

export default class Financepay extends Component {
    constructor(props) {
        super(props);

        this.data={};
        this.state = {
            extInfoFlag:false,
            echoExtInfo:false,
            //showPayBtn:true,
            showTerminationBtn:true,
            activeTab:1,
            financepayData:deepClone(financepayData),//放款
            rateData:deepClone(rateData),//利率
            adjrateData:deepClone(adjrateData),//利率调整方案
            checkFormNow:false,
            isBrowse:true, 
            dataSource1: deepClone(data1),//还款计划表格
            dataSource2: deepClone(data2),//授信表格
            dataSource3: deepClone(data3),//展期表格
            edit1:false,
            edit2:false,
            edit3:false,
            column1:[],
            column2:[],
            column3:[],
            contractRefVal:contractRefVal,
            distance: 0,
            chooseIndex: 0,
            isClicked:false,
            delModal:false,
            showModal: false,
            terminationModal:false,
            changeCcinfodisable:false,
            formObj1:[],
            formObj2:[],
            showSubmitBtn:true
        };
        this.id='';
        this.editCol3=[
            { title: "展期利率%", dataIndex: "extrate", key: "extrate",width:300,
                render: (text, record, index) => (
                    record.editing?
                        (<FormControl
                            value={text}
                            onChange={(v)=>{
                               const reg=/^\d{1,3}(.\d{1,2})?$/;
                               if(reg.test(v) && (parseFloat(v)<=100)) {
                                    this.changeData("extrate",v,index,"3");
                               }else{
                                toast({size: 'sms', color: 'warning', content: '展期利率范围0-100', title: '提示'});
                               }    
                            }}
                        />) :
                        ( <span>{text}</span>)

                ) },
            { title: "展期开始日期", dataIndex: "extbegindate", key: "extbegindate",width:300,
                render: (text, record, index) => (
                    record.editing?
                        (<DatePicker
                            format="YYYY-MM-DD"
                            value={text?(moment(text)):(moment())} 
                            onChange={(v)=>{
                                this.changeData("extbegindate",v.format("YYYY-MM-DD"),index,"3");
                            }}
                        >
                        </DatePicker>) :
                        ( <span>{text}</span>)

                ) },
            { title: "展期结束日期", dataIndex: "extenddate", key: "extenddate",width:300,
                render: (text, record, index) => (
                    record.editing?
                          (text?
                            (<DatePicker
                                format="YYYY-MM-DD"
                                value={(moment(text))}
                                onChange={(v)=>{
                                    this.changeData("extenddate",v.format("YYYY-MM-DD"),index,"3");
                                }}
                            >
                            </DatePicker>):(
                                <DatePicker
                                format="YYYY-MM-DD"
                                onChange={(v)=>{
                                    this.changeData("extenddate",v.format("YYYY-MM-DD"),index,"3");
                                }}
                            >
                            </DatePicker>)
                            ) 
                        :
                        ( <span>{text}</span>)

                ) },
            { title: "操作", dataIndex: "operation", key: "operation",width:250,
                render:(text, record, index) => {
                    return (
                        <Popconfirm
                            content="确认删除?"
                            onClose={this.handelExtDelete.bind(this, record)}
                        >
                            <Icon type="uf-del" className="row-operations-item" />
                        </Popconfirm>

                    );
                }
            }
        ]
        this.browseCol3=deepClone(this.editCol3);
        this.browseCol3.splice(this.browseCol3.length-1,1);
        this.formFlag=true;
        this.adjunitDisabled=false;
        this.editCol1=[
            {title: "编码", dataIndex: "code", key: "code",width:200,
                render: (text, record, index) => (
                    record.editing?
                        (<FormControl
                           value={text}
                           disabled={true}
                           onChange={(v)=>{
                               this.changeData("code",v,index,"1");
                           }}
                        />) :
                        ( <span>{text}</span>)
        
                )
            },
            { title: "计划还款日期", dataIndex: "planrepaydate", key: "planrepaydate",width:200,
                render: (text, record, index) => (
                    record.editing?
                        (text?
                        (<DatePicker
                            format="YYYY-MM-DD"
                            value={(moment(text))}
                            onChange={(v)=>{
                                this.changeData("planrepaydate",v.format("YYYY-MM-DD"),index,"1");
                            }}
                        >
                        </DatePicker>):(
                            <DatePicker
                            format="YYYY-MM-DD"
                            onChange={(v)=>{
                                this.changeData("planrepaydate",v.format("YYYY-MM-DD"),index,"1");
                            }}
                        >
                        </DatePicker>)
                        ) :
                        ( <span>{text}</span>)
                )
            },
            { title: "预计还本金", dataIndex: "premny", key: "premny",width:200,
                render: (text, record, index) => (
                    record.editing?
                        (
                            <InputItem
                                value={text}
                                used={'money'}
                                pos={'left'}
                                onChange={(v)=>{
                                     this.getFloat(v,2);
                                     this.changeData("premny",v,index,"1");
                                }} 
                            />
                     ) :
                        ( <span>{text}</span>)
        
                )
            },
            { title: "预计付利息", dataIndex: "preinterest", key: "preinterest",width:200,
                render: (text, record, index) => (
                    record.editing?
                        (
                            <InputItem
                                value={text}
                                used={'money'}
                                pos={'left'}
                                onChange={(v)=>{
                                   this.getFloat(v,2);
                                   this.changeData("preinterest",v,index,"1");
                                }} 
                            />
                     ) :
                        ( <span>{text}</span>)
        
                )
            },
            { title: "本利合计", dataIndex: "summny", key: "summny",width:200,
                render: (text, record, index) => {
                    const premny=record.premny.toString().replace(/\$|\,/g,'');
                    const preinterest=record.preinterest.toString().replace(/\$|\,/g,'');
                    return(
                        record.editing?
                            (
                                <InputItem
                                    value={
                                        parseFloat(premny)+parseFloat(preinterest)?
                                        (this.getFloat(parseFloat(premny)+parseFloat(preinterest),2)):(null)
                                        }
                                    used={'money'}
                                    disabled={true}
                                    pos={'left'}
                                />
                        ) :
                            ( <span>{this.getFloat((parseFloat(premny)+parseFloat(preinterest)),2)}</span>)
                    )
                }
            },
            { title: "操作", dataIndex: "operation", key: "operation",width:150,
                render:(text, record, index) => {
                    return <Popconfirm content="确认删除?" onClose={this.handelDelete.bind(this, index,"1")}>
                                <Icon type="uf-del" />
                            </Popconfirm>;
                }
            }
        ];
        this.browseCol1=deepClone(this.editCol1);
        this.browseCol1.splice(this.browseCol1.length-1,1);
        this.editCol2 = [
            { title: "授信协议", dataIndex: "ccprotocolid", key: "ccprotocolid",width:250,
                render: (text, record, index) => (
                    record.editing?
                        (
                        <Refer 
                            value={{
                                "refname":this.state.dataSource2[index].ccprotocolid.display||this.state.dataSource2[index].ccprotocolid.value,
                                'refpk':this.state.dataSource2[index].ccprotocolid.value
                            }}
                            ctx={'/uitemplate_web'}
                            refModelUrl={'/fm/creditref/'}
                            refCode={'creditref'}
                            disabled={(this.editId==="change"&&this.state.changeCcinfodisable)?true:false}
                            refName={'授信协议'}
                            clientParam={{
                                ratestartdate:this.state.financepayData.loandate.value||'',  //根据放款日期过滤
                                //loanbankid:this.state.financepayData.financecorpid.value||'' //根据金融网点过滤
                            }}
                            multiLevelMenu={[
                                {
                                    name: [ '授信协议号','授信银行' ],
                                    code: [ 'refcode','agreebankid_n']
                                }
                            ]}
                            onChange={(v)=>{
                                const val={
                                    display:v.refname, //授信协议
                                    value:v.refpk,
                                    currenyid_n:v.currenyid_n,//授信币种
                                    currenyid:v.currenyid,
                                    type:v.type , //当前协议的类型和最大金额
                                    credittypecontral:v.credittypecontral //授信类别是否必输
                                }
                                this.changeData("ccprotocolid",val,index,"2");
                            }}
                            />
                        ) :
                         ( <span>{this.state.dataSource2[index].ccprotocolid.display||this.state.dataSource2[index].ccprotocolid.value}</span>)
                )
            },
            { title: "授信币种", dataIndex: "cccurrtypeid", key: "cccurrtypeid",width:250,
                render: (text, record, index) => (
                    record.editing?
                        (
                            <Refer
                                ctx={'/uitemplate_web'}
                                refModelUrl={'/bd/currencyRef/'}
                                refCode={'currencyRef'}
                                refName={'币种'}
                                disabled={true}
                                value={{
                                    "refname":this.state.dataSource2[index].cccurrtypeid.display||'',
                                    "refpk":this.state.dataSource2[index].cccurrtypeid.value||''
                                }}
                            />
                        ) :
                        ( <span>{this.state.dataSource2[index].cccurrtypeid.display||this.state.dataSource2[index].cccurrtypeid.value}</span>)
        
                )
            },
            { title: "授信类别", dataIndex: "cctypeid", key: "cctypeid",width:250,
                render: (text, record, index) => {
                        let currentDisplay = this.state.dataSource2[index].cctypeid.display;
                        if (currentDisplay && Object.keys(currentDisplay).length>0){
                            currentDisplay = JSON.parse(currentDisplay);
                        }
                        return (
                            record.editing?
                            (
                                (currentDisplay && Object.keys(currentDisplay).length>0)?
                                (
                                    <Select 
                                        disabled={(this.editId==="change"&&this.state.changeCcinfodisable)?true:false}
                                        value={this.state.dataSource2[index].cctypeid.value}                                                                                             
                                        onChange={(v)=>{
                                            const val = {
                                                value:v,
                                                display:JSON.stringify(currentDisplay)
                                            }
                                            this.changeData("cctypeid",val,index,"2");
                                        }}>
                                        {Object.keys(currentDisplay).map((item,i)=>{
                                            return(<Option key={i} value={`${item}`}>{currentDisplay[item].split(",")[0]}</Option>)
                                        })}
                                        
                                    </Select>
                                ):(
                                    <Select>
                                    </Select>
                                )
                            ) :
                            ( <span>{(currentDisplay[this.state.dataSource2[index].cctypeid.value].split(",")[0]) || ''}</span>)
                    )
            }
            },
            { title: "占用授信金额", dataIndex: "ccmny", key: "ccmny",width:250,
                render: (text, record, index) => {
                    let cctypeidDisplay = this.state.dataSource2[index].cctypeid.display;
                    if (cctypeidDisplay){
                        cctypeidDisplay = JSON.parse(cctypeidDisplay);
                    }
                    let cctypeidValue = this.state.dataSource2[index].cctypeid.value;
                    return  (
                        record.editing?
                            (
                                (cctypeidDisplay && cctypeidValue)?
                                (<InputItem
                                    value={text}
                                    used={'money'}
                                    pos={'left'}
                                    onChange={(v)=>{
                                        let ccmnyContrlMny = cctypeidDisplay[cctypeidValue];
                                        const controlMaxMny = ccmnyContrlMny.split(",")[1];
                                        const controltype = ccmnyContrlMny.split(",")[2];
                                        if(parseFloat(v)>parseFloat(controlMaxMny)){
                                            if(controltype==="control"){
                                                toast({size: 'sms', color: 'warning', content: `不能超过${parseFloat(controlMaxMny)}！`, title: '提示'});
                                                return;
                                            }else if(controltype==="prompt"){
                                                toast({size: 'sms', color: 'warning', content: `建议最大值为${parseFloat(controlMaxMny)}！`, title: '提示'});
                                            }
                                        }
                                        this.changeData("ccmny",v,index,"2");
                                    }} 
                                />):(
                                   <InputItem
                                    used={'money'}
                                   /> 
                                )
                            ) :
                            ( <span>{text}</span>)
            
                    )
            }
            },
            { title: "操作", dataIndex: "operation", key: "operation",width:200,
                render:(text, record, index) => {
                    return (
                        <Popconfirm
                            content="确认删除?"
                            onClose={this.handelDelete.bind(this,index,"2")}
                        >
                            <Icon type="uf-del" className="row-operations-item" />
                        </Popconfirm>
                    );
                }
            }
        ]
        this.browseCol2=deepClone(this.editCol2);
        this.browseCol2.splice(this.browseCol2.length-1,1);

        //审批状态
        this.vbillStatus={
            '0':'待提交',
            '1':'审批通过',
            '2':'审批中',
            '3':'待审批',
            null:'待提交'
        },
        //审批按钮
        this.vbillStatusBtn={
            '0':'提交',
            '1':'审批',
            '2':'取消审批'
        },
        //结算状态
        this.settleflag={
            '0':'待结算',
            '1':'结算中',
            '2':'结算成功',
            '3':'结算失败',
            null:'待结算'
        }
    }

    //接收props更新
    componentWillReceiveProps (nextProps){
        if(nextProps.params.id){
            this.editId=nextProps.params.id;
            this.id=nextProps.location.query.id;
        }
    }

    //列表页跳转过来：修改、查看详情、变更都需要根据id先请求数据
    componentWillMount(){
        if(this.props.params.id){
            this.editId=this.props.params.id;
            //计息页点新增,进编辑态
            if(this.editId==="add"){
                data1=[];data2=[];data3=[];
                this.setState({
                    isBrowse:false,
                    dataSource1: deepClone(data1),//还款计划表格
                    dataSource2: deepClone(data2),//授信表格
                    dataSource3: deepClone(data3),//展期表格
                    column1:this.editCol1,
                    column2:this.editCol2
                })
                return;
            }

            //点击查看详情进来
            if(this.editId==="detail"){
                this.setState({
                    isBrowse:true,
                    column1:this.browseCol1,
                    column2:this.browseCol2
                })
            }

            //点击修改进来
            if(this.editId==="edit" || this.editId==="change"){
                this.setState({
                    isBrowse:false,
                    column1:this.editCol1,
                    column2:this.editCol2
                })
            }

        }

        if(this.props.location.query.id){
            this.id=this.props.location.query.id; 
            this.searchById(this.id);
        }
    }

    searchById=(id)=>{
        const data = {
            head:{
                pageinfo:null,
                rows:[{
                    rowId:null,
                    values:{
                        id:{value: id}
                    }
                }]
            }
        }
        const _this =this;
        Ajax({
            loading:true,
            url:rootUrl+'queryFinpayInfo',
            data:{data:data},
            success:function(res){
                _this.data=deepClone(res.data);
                _this.orgaAndRefResData(res.data);
                if(_this.editId==="ext"){
                    hashHistory.push(`/fm/financepay/detail?id=${_this.id}`);
                }
            }
        })   
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutId);
        this.removeListenerScroll();
    }

    componentDidMount () {
        this.addListenerScroll();	
    }

    //保留n位小数,并显示千分位
    getFloat =(number, n)=>{ 
        n = n ? parseInt(n) : 0; 
        if (n <= 0) return Math.round(number);
        number = Math.round(number*Math.pow(10,n))/Math.pow(10,n);
        if(`${number}`.indexOf(".")==-1){
            number = number + ".";
            for (let i = 1; i <= n; i++) {
                number = number + "0";
            }
        }
        //整数部分
        let numberInt=`${number}`.split('.')[0];
        let re=/(-?\d+)(\d{3})/;  
        while(re.test(numberInt)){  
            numberInt=numberInt.replace(re,"$1,$2")  
        }
        return `${numberInt}.${`${number}`.split('.')[1]}`;; 
    };

    //将金额类改回数字格式,发送回后台
    getNumber=(num)=>{
        return num.toString().replace(/\$|\,/g,'');
    }

    //得到指定日期的后一天
    getNextDay=(d)=>{
        d = new Date(d);
        d = +d + 1000*60*60*24;
        d = new Date(d);
        //格式化
        return d.getFullYear()+"-"
        +((d.getMonth()+1)<10?('0'+(d.getMonth()+1)):(d.getMonth()+1))+"-"
        +(d.getDate()<10?('0'+d.getDate()):d.getDate());
    }
     //组织请求回来的数据并刷新state
    orgaAndRefResData=(data) => {
        //还款计划
        if(data.planrepay){
            const newSource1= data.planrepay.rows.map((item, index) => {
                const values = item.values;
                return {
                    id: values.id.value,
                    code: values.code.value,
                    planrepaydate: values.planrepaydate.value,
                    premny: this.getFloat(values.premny.value,2),
                    preinterest: this.getFloat(values.preinterest.value,2),
                    summny:this.getFloat(values.summny.value,2)
                };
            });
            data1=newSource1.map((e, i) => {
                return {
                    ...e,
                    key: i,
                    index: i + 1,
                    code:`${(parseInt(i + 1)<=9)?('0'+(i + 1)):(i + 1)}`,
                    editing: false
                }
            });
            this.setState({
                dataSource1:deepClone(data1)
            })    
        }else{
            this.setState({
                dataSource1:[]
            })    
        }
        //授信信息
        if(data.ccinfo){
            const newSource2 = data.ccinfo.rows.map((item, index) => {
                const values = item.values;
                return {
                    id: values.id.value,
                    //ccprotocolid: values.ccprotocolid.value,
                    ccprotocolid: {
                        value:values.ccprotocolid.value,
                        display:values.ccprotocolid.display
                    },
                    //cccurrtypeid: values.cccurrtypeid.value,
                    cccurrtypeid: {
                        value:values.cccurrtypeid.value,
                        display:values.cccurrtypeid.display
                    },
                    cctypeid: {
                        value:values.cctypeid.value,
                        display:values.cctypeid.display
                    },
                    ccmny: this.getFloat(values.ccmny.value,2)
                };
            });
            data2=newSource2.map((e, i) => {
                return {
                    ...e,
                    key: i,
                    index: i + 1,
                    editing: false
                }
            });
            this.setState({
                dataSource2:deepClone(data2)
            }) 
        }else{
             this.setState({
                dataSource2:[]
            }) 
        }
        //展期信息  
        if(data.extinfo){
            const newSource3 = data.extinfo.rows.map((item, index) => {
                const values = item.values;
                return {
                    id: values.id.value,
                    extrate: values.extrate.value,
                    extbegindate : values.extbegindate.value,
                    extenddate : values.extenddate.value
                };
            });
            data3=newSource3.map((e, i) => {
                return {
                    ...e,
                    key: i,
                    index: i + 1,
                    editing: false
                }
            });
            this.setState({
                dataSource3:deepClone(data3)
            }) 
        }else{
            this.setState({
                dataSource3:[]
            }) 
        }  
        if(data.head){
            let loancode = data.head.rows[0].values.loancode.value;
            if(loancode){
                let loanArr = loancode.split('-');
                data.head.rows[0].values.contractid.display=loanArr[0];
                data.head.rows[0].values.planpayid.display=loanArr[1];
            }
            let loanmny=data.head.rows[0].values.loanmny.value;
            if(loanmny){
                data.head.rows[0].values.loanmny.value=this.getFloat(loanmny,2);
            }
            let rate = data.head.rows[0].values.rate.value;
            if(rate){
                data.head.rows[0].values.rate.value=this.getFloat(rate,4);
            }
            this.setState({
                financepayData:data.head.rows[0].values
            })
        }else{
            this.setState({
                financepayData:deepClone(financepayData)
            })
        }
        if(data.rate) {
            this.setState({
                rateData:data.rate.rows[0].values
            })
        }else{
             this.setState({
                rateData:deepClone(rateData)
            })
        }
        if(data.adjrate){ 
            this.setState({
                adjrateData:data.adjrate.rows[0].values
            })
        }else{
            this.setState({
                adjrateData:deepClone(adjrateData)
            })
        }
    }

    //修改三个表单的数据
    changeState=(data,key,val)=>{
        let olddata=this.state[data];
        if(key==='contractid'){
            olddata.planpayid.value=null;
        }
        //参照
        if(typeof val === "object"){
            olddata[key].value=val.value;
            olddata[key].display=val.display;
        //其他组件    
        }else{
            olddata[key].value=val;
        }  
        // if(this.editId==="add"&&data==='rateData'&&key==='rate'){
        //     if(val=='libor利率'){
        //         olddata.floatratescale.value='';
        //         olddata.overratescale.value='';
        //         olddata.headratescale.value='';
        //     }else{
        //         olddata.floatratepoints.value="";
        //         olddata.overratepoint.value=""; 
        //         olddata.headratepoint.value=""; 
        //     }
        // } 
        if(key==='adjratemethod'){
            if(val==="Year") {
                olddata.adjperiodunit.value='12';
                this.adjunitDisabled=true;
            }else if(val==="HalfYear") {
                olddata.adjperiodunit.value='6';
                this.adjunitDisabled=true;
            }else if(val==='Quarter') {
                olddata.adjperiodunit.value='3';
                this.adjunitDisabled=true;
            }else if(val==="SettleDate"){
                olddata.adjperiodunit.value='';
                this.adjunitDisabled=true;
            }else{
                olddata.adjperiodunit.value='';
                this.adjunitDisabled=false;
            }
            olddata.adjperiodunit.status=1; 
        } 
        olddata[key].status=1;    
        this.setState({
            [data]:olddata
        })
    }

    //整理表头和表体所有数据准备提交
    orgaReqData = () =>{
        const {financepayData,rateData,adjrateData,dataSource1,dataSource2,dataSource3} = this.state;
        let financepayEdit={},rateDataEdit={},adjrateEdit={};
        let reqData={};
        if(this.data.head){
            for(const pop in financepayData){   
                delete financepayData[pop].status;
                financepayEdit[pop]={
                   display:financepayData[pop].display,
                   value : (pop==="loanmny"||pop==="rate")?this.getNumber(financepayData[pop].value):(financepayData[pop].value)
                }
            }
            reqData.head={
                pageinfo:null,
                rows:[{ 
                    rowId:null,
                    values:financepayEdit
                }]
            }
        }
        //if(this.data.rate){
            for(const pop in rateData){
                delete rateData[pop].status;
                rateDataEdit[pop]={
                    display:rateData[pop].display,
                    value : rateData[pop].value
                } 
            }
            reqData.rate={
                pageinfo:null,
                rows:[{       
                    rowId:null,
                    values:rateDataEdit
                }]
            }
        //}
      // if(this.data.adjrate){
            for(const pop in adjrateData){
                delete adjrateData[pop].status;
                adjrateEdit[pop]={
                    value : adjrateData[pop].value
                } 
            }
            reqData.adjrate={
                pageinfo:null,
                rows:[{       
                    rowId:null,
                    values:adjrateEdit
                }]
            }
       //}
       
        if(dataSource1.length>0){
            let source1=[];
            if(this.editId==="add"){
                source1=dataSource1.map((item, index) => {
                    return {
                        rowId:null,
                        values:{
                            code: {value:item.code},
                            planrepaydate: {value:item.planrepaydate},
                            premny: {value:this.getNumber(item.premny)},
                            preinterest: {value:this.getNumber(item.preinterest)},
                            summny: {value:this.getNumber(item.summny)}
                        }  
                    } 
                })
            }else{
                source1=dataSource1.map((item, index) => {
                    const planrepay = this.data.planrepay.rows[index].values;
                    return {
                        rowId:null,
                        values:{
                            id: {value:item.id},
                            code: {value:item.code},
                            planrepaydate: {value:item.planrepaydate},
                            premny: {value:this.getNumber(item.premny)},
                            preinterest: {value:this.getNumber(item.preinterest)},
                            summny: {value:this.getNumber(item.summny)},
                           // versionno :{value:planrepay.versionno.value},
                            financepayid:{value:planrepay.financepayid.value},
                            tenantid:{value:planrepay.tenantid.value},
                            sysid:{value:planrepay.sysid.value},
                            ts:{value:planrepay.ts.value},
                            dr:{value:planrepay.dr.value},
                            creator:{value:planrepay.creator.value},
                            creationtime:{value:planrepay.creationtime.value},
                            modifier:{value:planrepay.modifier.value},
                            modifiedtime:{value:planrepay.modifiedtime.value}
                        }  
                    } 
                })
            }
            reqData.planrepay={
                pageinfo: null,
                rows:source1
            }    
        }
        if(dataSource2.length>0){
            let source2=[];
            if(this.editId==="add"){
                source2=dataSource2.map((item, index) => {
                    return {
                        rowId:null,
                        values:{
                            ccprotocolid: {
                                display:item.ccprotocolid.display,
                                value:item.ccprotocolid.value
                            },
                            cccurrtypeid: {
                                display:item.cccurrtypeid.display,
                                value:item.cccurrtypeid.value
                            },
                            cctypeid: {
                                display:item.cctypeid.display,
                                value:item.cctypeid.value
                            },
                            ccmny: {value:this.getNumber(item.ccmny)}
                        }
                    }; 
                }) 
            }else{
                source2=dataSource2.map((item, index) => {
                    const ccinfo = this.data.ccinfo.rows[index].values;
                    return {
                        rowId:null,
                        values:{
                            id: {value:item.id},
                            ccprotocolid: {
                                display:item.ccprotocolid.display,
                                value:item.ccprotocolid.value
                            },
                            cccurrtypeid: {
                                display:item.cccurrtypeid.display,
                                value:item.cccurrtypeid.value
                            },
                            cctypeid: {
                                display:item.cctypeid.display,
                                value:item.cctypeid.value
                            },
                            ccmny: {value:this.getNumber(item.ccmny)},
                            versionNo :{value:ccinfo.versionNo.value},
                            financepayid:{value:ccinfo.financepayid.value},
                            tenantid:{value:ccinfo.tenantid.value},
                            sysid:{value:ccinfo.sysid.value},
                            ts:{value:ccinfo.ts.value},
                            dr:{value:ccinfo.dr.value},
                            creator:{value:ccinfo.creator.value},
                            creationtime:{value:ccinfo.creationtime.value},
                            modifier:{value:ccinfo.modifier.value},
                            modifiedtime:{value:ccinfo.modifiedtime.value}
                        }
                    }; 
                }) 
            }
           
            reqData.ccinfo={
                pageinfo: null,
                rows:source2
            }   
        }
        if(dataSource3.length>0){
            let source3=[];
            if(this.editId==="add"){
                source3=dataSource3.map((item, index) => {                    
                    return {
                        rowId:null,
                        values:{                         
                            extrate: {value:item.extrate},
                            extbegindate: {value:item.extbegindate},
                            extenddate : {value:item.extenddate },                
                        } 
                    }; 
                })  
            }else{
                source3=dataSource3.map((item, index) => {
                    const extinfo = this.data.extinfo.rows[index].values;
                    return {
                        rowId:null,
                        values:{
                            id: {value:item.id},
                            extrate: {value:item.extrate},
                            extbegindate: {value:item.extbegindate},
                            extenddate : {value:item.extenddate },                
                            //versionno :{value:extinfo.versionno.value},
                            financepayid:{value:extinfo.financepayid.value},
                            tenantid:{value:extinfo.tenantid.value},
                            sysid:{value:extinfo.sysid.value},
                            ts:{value:extinfo.ts.value},
                            dr:{value:extinfo.dr.value},
                            creator:{value:extinfo.creator.value},
                            creationtime:{value:extinfo.creationtime.value},
                            modifier:{value:extinfo.modifier.value},
                            modifiedtime:{value:extinfo.modifiedtime.value}
                        }
                        
                    }; 
                })  
            }
            
            reqData.extinfo={
                pageinfo: null,
                rows:source3
            }  
        }
        return reqData;
        
    }
  
    //点击确定并放款保存
    handlePaySave = (flag) =>{
        if(this.editId!="ext"){
            this.setState({
                showModal:false
            })
        }
        //整理表单提交数据
        const _this=this;
        let financepayData = this.state.financepayData;
        let rateData = this.state.rateData;
        let adjrateData = this.state.adjrateData;
        let financepayEdit={},rateDataEdit={},adjrateEdit={};
        let reqData={};
        //保存数据并刷新页面
        let url = rootUrl+"save";
        if(this.editId==="change"){
            url = rootUrl+"alter";
        }   

        //新增保存
        if(this.editId==="add"){
            reqData= this.orgaReqData();
            reqData.head.rows[0].values.contractid={
                value:this.state.financepayData.contractid.value
            };
            reqData.head.rows[0].values.planpayid={
                value:this.state.financepayData.planpayid.value
            }
        //修改或变更保存
        }else{
            for(const pop in financepayData){
                if(financepayData[pop].status===1){
                    financepayEdit[pop]={
                        display:financepayData[pop].display,
                        value : (pop==="loanmny"||pop==="rate")?this.getNumber(financepayData[pop].value):(financepayData[pop].value)
                    }
                    financepayData[pop].status=null;
                }
            }
            financepayEdit.id={value:financepayData.id.value}
            if(this.editId!="ext"){
                financepayEdit.status={value:1};
            }
            if(this.editId==="edit"){
                financepayEdit.ts={value:financepayData.ts.value};
            }
            
            reqData.head={
                pageinfo:null,
                rows:[{ 
                    rowId:null,
                    values:financepayEdit
                }]
            }
            for(const pop in rateData){
                if(rateData[pop].status===1){
                    rateDataEdit[pop]={
                         display:rateData[pop].display,
                         value : rateData[pop].value
                    }
                    rateData[pop].status=null;      
                }
            }
            if(Object.keys(rateDataEdit).length>0){
                if(this.editId!="ext"){
                    rateDataEdit.status={value:1};
                }
                rateDataEdit.id={value:rateData.id.value}
                reqData.rate={
                    pageinfo:null,
                    rows:[{       
                        rowId:null,
                        values:rateDataEdit
                    }]
                }
            }
           
            for(const pop in adjrateData){
                if(adjrateData[pop].status===1){
                    adjrateEdit[pop]={
                         value : adjrateData[pop].value
                    }
                    adjrateData[pop].status=null;          
                }
            }
            if(Object.keys(adjrateEdit).length>0){
                if(this.editId!="ext"){
                    adjrateEdit.status={value:1};
                }      
                adjrateEdit.id={value:adjrateData.id.value}
                reqData.adjrate={
                    pageinfo:null,
                    rows:[{
                        rowId:null,
                        values:adjrateEdit
                    }]
                }
            }
            //整理表格数据
            //参照对比方法
            let source2=this.state.dataSource2.map((item, index) => {
                return {
                    ...item,   
                    ccprotocolid:item.ccprotocolid.value,
                    cccurrtypeid:item.cccurrtypeid.value,
                    cctypeid:item.cctypeid.value,
                    ccmny:this.getNumber(item.ccmny)
                }; 
            })
            let dataCur2=data2.map((item, index) => {
                return {
                    ...item,
                    ccprotocolid:item.ccprotocolid.value,
                    cccurrtypeid:item.cccurrtypeid.value,
                    cctypeid:item.cctypeid.value,
                    ccmny:this.getNumber(item.ccmny)
                }; 
            })
            let source1 = this.state.dataSource1.map((item, index) => {
                return {
                    ...item,
                    premny: this.getNumber(item.premny),
                    preinterest:this.getNumber(item.preinterest),
                    summny:this.getNumber(item.summny)
                }
            })
            let dataCur1 = data1.map((item, index) => {
                return {
                    ...item,
                    premny: this.getNumber(item.premny),
                    preinterest:this.getNumber(item.preinterest),
                    summny:this.getNumber(item.summny)
                }; 
            })
            let newData1=this.contrastFn(source1,dataCur1);   
            let newData2=this.contrastFn(source2,dataCur2);
            if(newData1.length>0){
                reqData.planrepay={
                    pageInfo: null,
                    rows:newData1
                }
            }
            if(newData2.length>0){
                reqData.ccinfo={
                    pageInfo: null,
                    rows:newData2
                }
            }
        }
        //-----------------------测试----------------------//
        if(this.editId!="ext"){
            if(flag){
                reqData.head.rows[0].values.isAutoReplan={value:1};
            }else{
                reqData.head.rows[0].values.isAutoReplan={value:0};
            }
        }  
        if( this.editId==="ext"){
            url = rootUrl+"extendFinpayInfo";
        }
        Ajax({
            loading:true,
            url:url,
            data:{data:reqData},
            success:function(res){
                if(res.data){
                    _this.data=deepClone(res.data);   
                    _this.orgaAndRefResData(res.data);
                    _this.setState({
                        isBrowse:true,
                        activeTab:3,
                        column1:_this.browseCol1,
                        column2:_this.browseCol2
                    }) 
                    const id = res.data.head.rows[0].values.id.value;
                    if(_this.editId!="ext") {
                        hashHistory.push(`/fm/financepay/detail?id=${id}`);
                    }  
                } 
            }
        })   
    }
    
    //点击确定并放款时，对比表格数据
    contrastFn=(obj1,obj2)=>{
        let newData=[];
        obj1.map((e,i)=>{
            delete e.index;
            delete e.editing;
            delete e.key;
            const index = this.findElem(obj2,'id',e.id);
           if(index===-1){//该行为新增行
                delete e.id;
                for(let prop in e){
                    e[prop]=e[prop];
                }
                e.status=2;
                newData.push(e);
           }else{
                if( !this.isEqual(e,obj2[index]) ){//该行被修改过
                    let eitem = {};
                    for(let p in e){
                        if(p!='code' && e[p]!=obj2[index][p]){
                            eitem[p]=e[p];
                        }
                    }
                    if(Object.keys(eitem).length>0){
                        eitem.id=e.id;
                        eitem.status=1;
                        if(this.editId==="ext"){
                            eitem.extrate=e.extrate;
                            eitem.extbegindate=e.extbegindate;
                        }
                        newData.push(eitem);
                    }
                }
            }
        });
        obj2.map((e,i)=>{
            if(this.findElem(obj1,'id',e.id)===-1){//该行为删除行
                e={
                    id:e.id ,
                    status:3
                }
                newData.push(e);
            }
        });
        let dataNew=[];
        for(let i=0;i<newData.length;i++){
             dataNew[i]={rowId:null};
             dataNew[i].values={};
             for(let p in newData[i] ){
                 if(p==="status"){
                     dataNew[i].status=newData[i].status
                 }else{
                     dataNew[i].values[p]={value:newData[i][p]}
                 }
             }
        }

        return dataNew;
    }
    //判断两个对象是否相等
    isEqual=(obj1,obj2)=>{
        for(let name in obj1){
            if(obj1[name]!==obj2[name]) return false;
        }
        for(let name in obj2){
            if(obj1[name]!==obj2[name]) return false;
        }
        return true;
     }

    //判断id=a的对象是否在数组中
    findElem=(Arr,id,a)=>{
       for(var i=0;i<Arr.length;i++){
           if(Arr[i][id]===a){
               return i ;
           }
       }
       return -1;
    }
    //修改表格数据
    changeData =(item,v,index,num)=>{
        let data =this.state[`dataSource${num}`];
         //参照
         if(typeof v === "object"){
            data[index][item].value=v.value;
            data[index][item].display=v.display;
            if(item==="ccprotocolid"){
                //授信币种
                data[index].cccurrtypeid={
                    value:v.currenyid,
                    display:v.currenyid_n
                }
                data[index].credittypecontral = v.credittypecontral;
                data[index].ccmny="";
                data[index].cctypeid={};
                //授信类型及占用授信金额提示方式
                let cctypeidDisplay={};
                if(!!v.type){
                    let typeArr = (v.type).split(',');
                    if(typeArr.length==1){
                        typeArr[0]=typeArr[0].substring(1,typeArr[0].length-1);
                    }else{
                        typeArr[0]=typeArr[0].substring(1);
                        let typeLast = typeArr[typeArr.length-1];
                        typeArr[typeArr.length-1]=typeLast.substring(0,typeLast.length-1);;                       
                    }
                    if(typeArr[0]!=""){   
                        for(let i=0;i<typeArr.length;i++){
                            const typePk = `${typeArr[i].split("&&")[0].trim()}`;
                            const typeName = typeArr[i].split("&&")[1].trim();
                            const maxMoney = typeArr[i].split("&&")[2].trim();
                            const controltype = typeArr[i].split("&&")[3].trim();
                            cctypeidDisplay[typePk] = `${typeName},${maxMoney},${controltype}`;
                        } 
                        data[index].cctypeid.display = JSON.stringify(cctypeidDisplay);
                    } 
                }
            }
        }else{ //非参照
            data[index][item] = v;
            if(item==='premny'){
                data[index].summny= `${parseFloat(v)+parseFloat(data[index].preinterest)}`;
            }else if(item==='preinterest'){
                data[index].summny= `${parseFloat(data[index].premny)+parseFloat(v)}`;
            }   
        }
        //修改数据标识
        if(!data[index].status){
            data[index].status=1;
        }
        console.log(data)
        this.setState({
            [`dataSource${num}`]:data
        })

    }
    //删除数据
    handelDelete = (index,num)=>{
        this.refreshDataSource("delete",index,null,num)
    }
    //点击表头修改按钮
    handelEdit=(num)=>{
        cancelData=deepClone(this.state[`dataSource${num}`]);
        let data = this.state[`dataSource${num}`].map((e, i) => {
            return {
                ...e,
                key:i,
                editing: true
            }
        })
        this.setState({
            [`dataSource${num}`]:data,
            [`column${num}`]:this[`browseCol${num}`],
            [`edit${num}`]:true,
            changeCcinfodisable:num==='2'?true:false
        })
    }
    //点击表头取消按钮
    handelCancel=(num)=>{
        this.setState({
            [`dataSource${num}`]:cancelData,
            [`edit${num}`]:false,
            [`column${num}`]:this[`editCol${num}`]
        })
    }
    //点击表头新增按钮
    handelAdd=(num)=>{
        cancelData=deepClone(this.state[`dataSource${num}`]);
        const ll = this.state[`dataSource${num}`].length;
        let index = ll+1;
        const indexCode=(parseInt(index)<=9)?(`0${index}`):(`${index}`);
        this.setState({
            [`column${num}`]:this[`browseCol${num}`],
            changeCcinfodisable:num==='2'?false:true
        })
        let newData={};
        if(num==="1"){
            newData={
                status:2,
                code:indexCode,
                planrepaydate:"",
                premny:"",
                preinterest:"",
                summny:"",
                editing:true
            }
        }
        if(num==="2"){
            newData={
                status:2,
                //ccprotocolid:"",
                ccprotocolid: {
                    value:"",
                    display:""
                },
                cccurrtypeid:{
                    value:"",
                    display:""
                },
                cctypeid: {
                    value:"",
                    display:""
                },
                ccmny:"",
                editing:true
            }
        }
        this.refreshDataSource("add",null,newData,num);
    }
    //点击表格保存按钮保存
    handelSave =(num)=>{
        if(this.state[`dataSource${num}`].length>0){
            const oldData=this.state[`dataSource${num}`][0];
            const status=oldData.status;
            let newDataArr=this.state[`dataSource${num}`].filter((e,i)=>{
                return  e.status===1
            });
            if(status===2){//新增保存
                let newData={};
                //校验输入是否为空
                if(num==="1"){
                    const {
                        code,planrepaydate,premny,preinterest,summny
                    } =oldData;
                    newData={
                        id:i,
                        code:code,
                        planrepaydate:planrepaydate,
                        premny:premny,
                        preinterest:preinterest,
                        summny:summny
                    }
                }
                if(num==="2"){
                    const {
                        ccprotocolid,cccurrtypeid,cctypeid,ccmny
                    } =oldData;
                    newData={
                        id:i,
                        ccprotocolid:ccprotocolid,
                        cccurrtypeid:cccurrtypeid,
                        cctypeid :cctypeid ,
                       // cctypeid :cctypeid.display ,
                        ccmny:ccmny
                    }
                }
                i++;
                //保存数据
                this.refreshDataSource("save","add",newData,num)
            }else if(newDataArr.length>0){//修改保存 
                if(num==="1"){
                    newDataArr=newDataArr.map((e,i)=>{
                        return{
                            id:e.id,
                            code:e.code,
                            planrepaydate:e.planrepaydate,
                            premny:e.premny,
                            preinterest:e.preinterest,
                            summny:e.summny,
                            index:e.index
                        }
                    })
                }
                if(num==="2"){
                    newDataArr=newDataArr.map((e,i)=>{
                        return{
                            id:e.id,
                            ccprotocolid:e.ccprotocolid,
                            cccurrtypeid:e.cccurrtypeid,
                            cctypeid:e.cctypeid,
                            //cctypeid:e.cctypeid.display,
                            ccmny:e.ccmny,
                           // ispayusecc:e.ispayusecc,
                            index:e.index
                        }
                    })
                }
                //保存数据
                this.refreshDataSource("save",null,newDataArr,num)
            }else{ //点击修改后，什么也没做
                this.setState({
                    [`dataSource${num}`]:cancelData,
                    [`edit${num}`]:false,
                    [`column${num}`]:this[`editCol${num}`]
                })
            }
        }
    }
    //更新表格数据
    refreshDataSource = (opr,index,data,num)=>{
        if(opr==="add"){
            let old = [data,...this.state[`dataSource${num}`]];
            old=old.map((item,i)=>{
                return{
                    ...item,
                    key:i
                }
            })
            this.setState({
                [`dataSource${num}`]:old,
                [`edit${num}`]:true
            })
        }
        //删除
        if(opr==="delete"){
            let old = this.state[`dataSource${num}`];
            old.splice(index,1);
            //删除后，更新code
            if(num==="1"){
                old=old.map((e,i)=>{
                    let code=(parseInt(i+1)<=9)?(`0${(i+1)}`):(`${i+1}`);
                    return {
                        ...e,
                        key:i,
                        code:code
                    }
                })
            }
            this.setState({
                [`dataSource${num}`]:old
            })
        }
        //保存
        if(opr==="save"){
            let flag =false;
            let old = this.state[`dataSource${num}`];
           if(Object.prototype.toString.call(data) === '[object Array]'){
               //修改保存
                for(let item of data){
                    flag = this.checkNull(num,item);
                    if (!flag) return;
                    old.splice(item.index-1,1,item);  
                }
           }else{
                //新增保存 
                delete old[0].status;
                flag = this.checkNull(num,old[0]);
                if (!flag) return;
            } 
            //变为浏览态
            if(num==="1" && index==="add"){
                const ll = old.length;
                const firstData = this.state[`dataSource${num}`][0];
                old.splice(0,1);
                old[ll-1]=firstData;
            }
            let dataSource = old.map((e, i) => {
                return {
                    ...e,
                    index:i+1,
                    key:i,
                    code:(i<9)?(`0${i+1}`):(`${i+1}`),
                    editing: false
                }
            });
            this.setState({
                [`dataSource${num}`]:dataSource,
                [`edit${num}`]:false,
                [`column${num}`]:this[`editCol${num}`]
            });  
                         
        }
       
    }

    //校验表格是否为空
    checkNull = (num,data)=>{
        if(num==="1"){
            let{code,planrepaydate,premny,preinterest}=data;
            if(!code){
                toast({size: 'sms', color: 'warning', content: '编码不能为空！', title: '提示'});
                return false;
            }else if(!planrepaydate){
                toast({size: 'sms', color: 'warning', content: '计划放款日期不能为空！', title: '提示'});
                return false;
            }else if(!this.state.financepayData.loandate.value){
                toast({size: 'sms', color: 'warning', content: '请先选择放款日期！', title: '提示'});
                return false;
            }else if(this.contrastDate(this.state.financepayData.loandate.value,planrepaydate)){
                toast({size: 'sms', color: 'warning', content: '计划还款日期不能早于放款日期！', title: '提示'});
                return false;
            }else if(!premny){
                toast({size: 'sms', color: 'warning', content: '预计还本金不能为空！', title: '提示'});
                return false;
            }else if(!preinterest){
                toast({size: 'sms', color: 'warning', content: '预计付利息不能为空！', title: '提示'});
                return false;
            }else{
                return true;
            }
        }
        if(num==="2"){
            let{ccprotocolid,cctypeid,ccmny,credittypecontral}=data;
            if(!ccprotocolid.value){
                toast({size: 'sms', color: 'warning', content: '授信协议不能为空！', title: '提示'});
                return false;
            }else if(credittypecontral && (!cctypeid.value)){
                toast({size: 'sms', color: 'warning', content: '授信类别不能为空！', title: '提示'});
                return false;
            }else if(!ccmny){
                toast({size: 'sms', color: 'warning', content: '占用授信金额不能为空！', title: '提示'});
                return false;
            }else{
                return true;
            }
        }
    }

    //表单校验
    checkForm = (flag,obj,num)=>{
        if(num===1) {
            this.formFlag=flag;
            this.setState({
                formObj1:obj
            })
        };
        if(num===2) {
            this.formFlag=this.formFlag && flag;
            this.setState({
                formObj2:obj
            })
        }
        if(num===3){
            this.formFlag=this.formFlag && flag;
            if(this.formFlag){
                this.setState({
                    checkFormNow:false
                });
                if(this.state.edit1 ||this.state.edit2 ||this.state.edit3){
                    toast({size: 'sms', color: 'warning', content: '请先保存表格的新增或修改！', title: '提示'});
                    return;
                }
                if(this.editId==="ext"){
                    this.handlePaySave(true);
                }else{
                    this.setState({
                        showModal:true,
                        checkFormNow:false
                    })
                }
            }else{
                this.setState({
                    checkFormNow:false
                });
            }
        }
    }

    //打开模态框
    open = () =>{
        if(this.state.financepayData.ispayusecc.value==1 && this.state.dataSource2.length<1){
            toast({size: 'sms', color: 'warning', content: '您还没输入任何授信信息！', title: '提示'});
        }else{
            this.setState({
                checkFormNow:true
            });
        }  
    }
    //关闭模态框
    close = () =>{
        this.setState({
            showModal:false
        })
    }

    //编辑态点击取消按钮
    handelCancelEdit = () =>{
        if(this.editId==="add"){
            hashHistory.push('/fm/loantransaction');
            return;
        }else{
            const id = this.data.head.rows[0].values.id.value;
            hashHistory.push(`/fm/financepay/detail?id=${id}`);
            if(this.data.head){
                let loancode = this.data.head.rows[0].values.loancode.value;
                if(loancode){
                    let loanArr = loancode.split('-');
                    this.data.head.rows[0].values.contractid.display=loanArr[0];
                    this.data.head.rows[0].values.planpayid.display=loanArr[1];
                }
                let loanmny=this.data.head.rows[0].values.loanmny.value;
                if(loanmny){
                    this.data.head.rows[0].values.loanmny.value=this.getFloat(loanmny,2);
                }
                let rate = this.data.head.rows[0].values.rate.value;
                if(rate){
                    this.data.head.rows[0].values.rate.value=this.getFloat(rate,4);
                }
                this.setState({
                    financepayData:deepClone(this.data.head.rows[0].values)//放款
                })
            }
            if(this.data.rate){
                this.setState({
                    rateData:deepClone(this.data.rate.rows[0].values)//利率
                })
            }else{
                this.setState({
                    rateData:deepClone(rateData)//利率
                })
            }
            if(this.data.adjrate){
                this.setState({
                    adjrateData:deepClone(this.data.adjrate.rows[0].values)//利率调整方案
                })
            }else{
                this.setState({
                    adjrateData:deepClone(adjrateData)//利率调整方案
                })
            }
            if(this.data.planrepay){
                this.setState({
                    dataSource1: deepClone(data1)//还款计划表格
                })
            }else{
                this.setState({
                    dataSource1:[]
                })
            }
            if(this.data.ccinfo){
                this.setState({
                    dataSource2: deepClone(data2)//授信表格
                })
            }else{
                this.setState({
                    dataSource2:[]
                })
            }
            if(this.data.extinfo){
                this.setState({
                    dataSource3: deepClone(data3)//展期表格
                })
            }else{
                this.setState({
                    dataSource3:[]
                })
            }
            this.setState({
                isBrowse:true,
                column1:this.browseCol1,
                column2:this.browseCol2,
                edit1:false,
                edit2:false,
                edit3:false,
                extInfoFlag:false,  
                activeTab:1
            })
        } 
    }

    //点击展期按钮
    handelExtInfo = ()=>{
        this.scrollToAnchor(3);
        const id = this.data.head.rows[0].values.id.value;
        this.timeoutId = setTimeout(() => {
             hashHistory.push(`/fm/financepay/ext?id=${id}`);
             const ll = this.state.dataSource3.length;
             let extbegindate = this.getNextDay(this.state.financepayData.contenddate.value);
             if(ll>0){
                 extbegindate = this.getNextDay(this.state.dataSource3[ll-1].extenddate);
             }
            const newData={
                 extrate:this.state.rateData.rateid.value,
                 extbegindate :extbegindate,
                 extenddate :"",
                 editing:true
             }
             let old = [...this.state.dataSource3,newData];
             old = old.map((e,i)=>{
                 return {
                     ...e,
                     key:i,
                     index: i+1
                 }
             });
             this.setState({
                 isBrowse:true,
                 dataSource3:old,
                 edit3:true,
                 column3:this.editCol3,
                 extInfoFlag:true,
                 echoExtInfo:true,
                 activeTab:3
             })
       }, 0)
       
     }

    //展期的保存按钮
    handelExtSave = () =>{
        //新增保存
        let oldData = this.state.dataSource3[this.state.dataSource3.length-1];
        if(!oldData.extenddate){
            toast({size: 'sms', color: 'warning', content: '展期结束日期不能为空！', title: '提示'});
            return;
        }else if(this.contrastDate(oldData.extbegindate,oldData.extenddate)){
            toast({size: 'sms', color: 'warning', content: '展期结束日期不能早于开始日期！', title: '提示'});
            return;
        }
        const id =this.data.head.rows[0].values.id.value;
        let reqData = {
            head:{
                pageinfo:null,
                rows:[{ 
                    rowId:null,
                    values:{
                        id:{value:id}
                    }
                }]
            }}
        reqData.extinfo={
            pageinfo:null,
            rows:[{ 
                rowId:null,
                status:2,
                values:{
                    extrate:{value:oldData.extrate},
                    extbegindate:{value:oldData.extbegindate},
                    extenddate:{value:oldData.extenddate}
                }
            }]
        }
        const _this=this;
        Ajax({
            loading:true,
            url:rootUrl+'extendFinpayInfo',
            data:{data:reqData},
            success:function(res){
                _this.data=deepClone(res.data);   
                _this.orgaAndRefResData(res.data);
                let data1 = _this.state.dataSource3.map((e, i) => {
                    return {
                        ...e,
                        key:i,
                        editing: false
                    }
                });
                _this.setState({
                    dataSource3:data1,
                    edit3:false,
                    isBrowse:true,
                    activeTab:3,
                    column3:_this.browseCol3
                });
                hashHistory.push(`/fm/financepay/detail?id=${id}`);
            }
        })   
    }
    //展期的取消按钮
    handelExtCancel=()=>{
        const id=this.data.head.rows[0].values.id.value;
        hashHistory.push(`/fm/financepay/detail?id=${id}`);
        if(this.data.extinfo){
            this.setState({
                dataSource3: deepClone(data3)//展期表格
            })
        }else{
            this.setState({
                dataSource3: []
            })
        }
        this.setState({
            edit3:false,
            isBrowse:true,
            activeTab:1,
            column3:this.browseCol3
        });
    }
    //展期的删除按钮
    handelExtDelete=(record)=>{
       if(record.id){
        let reqData = {
            head:{
                pageinfo:null,
                rows:[{ 
                    rowId:null,
                    values:{
                        id:{value:this.data.head.rows[0].values.id.value}
                    }
                }]
            },
            extinfo:{
                pageinfo:null,
                rows:[{ 
                    rowId:null,
                    status:3,
                    values:{
                        id:{value:record.id}
                    }
                }]
            }
        }
        const _this=this;
        Ajax({
            loading:true,
            url:rootUrl+'extendFinpayInfo',
            data:{data:reqData},
            success:function(res){
                _this.data=deepClone(res.data);   
                _this.orgaAndRefResData(res.data);
            }
        })   
       }else{
           const index = record.index-1;
           let old = this.state.dataSource3;
           old.splice(index,1);
           this.setState({
               dataSource3:old
           })         
       }
       hashHistory.push(`/fm/financepay/detail?id=${this.data.head.rows[0].values.id.value}`);
       this.setState({
            column3:this.browseCol3,
            edit3:false
        })  
    }

    //点击终止按钮
    handelTermination = () =>{
       this.setState({
           terminationModal:true
       })
    }
    //确定终止
    terminationConfirm=()=>{
        const reqData = this.orgaReqData();
        const _this=this;
        Ajax({
            loading:true,
            url:rootUrl+'termination',
            data:{data:reqData},
            success:function(res){
                _this.data=deepClone(res.data);   
                _this.orgaAndRefResData(res.data);
                toast({size: 'sms', color: 'success', content: '终止成功！', title: '提示'})
                _this.setState({
                    showTerminationBtn:false,
                    terminationModal:false
                }) 
            }
        })   
    }
    //取消终止
    terminationCancel=()=>{
        this.setState({
            terminationModal:false
        })
    }
    //点击取消终止按钮
    handelCancelTermination = ()=>{ 
        const reqData = this.orgaReqData();
        const _this=this;
        Ajax({
            loading:true,
            url:rootUrl+'cancelTermination',
            data:{data:reqData},
            success:function(res){
                _this.data=deepClone(res.data);   
                _this.orgaAndRefResData(res.data);
                toast({size: 'sms', color: 'success', content: '取消终止成功！', title: '提示'})
                _this.setState({
                    showTerminationBtn:true
                })
            }
        })   
    }

    //点击结算按钮
    handelPayBtn = ()=>{
        const reqData = this.getIdAndTs();
        const _this=this;
        Ajax({
            loading:true,
            url:rootUrl+'settle',
            data:{data:reqData},
            success:function(res){
                toast({size: 'sms', color: 'success', content: '结算成功！', title: '提示'})
                _this.data=deepClone(res.data);   
                _this.orgaAndRefResData(res.data);
                // _this.setState({
                //     showPayBtn:false
                // })
            }
        })
    }

    //提交按钮
    handelSubmit=()=>{
        const reqData = this.getIdAndTs();
        const _this=this;
        Ajax({
            loading:true,
            url:rootUrl+'commit',
            data:{data:reqData},
            success:function(res){
                _this.data=deepClone(res.data);   
                _this.orgaAndRefResData(res.data);
                toast({size: 'sms', color: 'success', content: '提交成功！', title: '提示'});
                _this.setState({
                    showSubmitBtn:false
                })
            }
        })   
    }

    getIdAndTs=()=>{
        let data = {};
        if(this.data.head){
            data={
                head:{
                    pageinfo:null,
                    rows:[{
                        rowId:null,
                        values:{
                            id:{value:this.data.head.rows[0].values.id.value},
                            ts:{value:this.data.head.rows[0].values.ts.value}
                        }
                    }]
                }
            }
        }
        return data;
    }

    //收回按钮
    handelWithdraw=()=>{
        const reqData = this.getIdAndTs();
        const _this=this;
        Ajax({
            loading:true,
            url:rootUrl+'uncommit',
            data:{data:reqData},
            success:function(res){
                _this.data=deepClone(res.data);   
                _this.orgaAndRefResData(res.data);
                toast({size: 'sms', color: 'success', content: '收回成功！', title: '提示'});
                _this.setState({
                    showSubmitBtn:true
                })
            }
        })   
    }

    //下载结算状态按钮
    handelDownAccount=()=>{
        const reqData = this.getIdAndTs();
        const _this=this;
        Ajax({
            loading:true,
            url:rootUrl+'refreshsettle',
            data:{data:reqData},
            success:function(res){
                _this.data=deepClone(res.data);   
                _this.orgaAndRefResData(res.data);
                toast({size: 'sms', color: 'success', content: '下载结算状态成功！', title: '提示'});
            }
        })   
    }

    //点击放款单据修改按钮
    handelEditForm = ()=>{
        const id = this.data.head.rows[0].values.id.value;
        hashHistory.push(`/fm/financepay/edit?id=${id}`);
        this.setState({
            isBrowse:false,
            column1:this.editCol1,
            column2:this.editCol2
        })
    }

    //点击变更按钮
    handelChangeBtn = () =>{
        const id = this.data.head.rows[0].values.id.value;
        hashHistory.push(`/fm/financepay/change?id=${id}`);
        this.setState({
            isBrowse:false,
            edit3:false,
            column1:this.editCol1,
            column2:this.editCol2
        })
    }

    //点击放款单据删除按钮
    handelDelForm = () =>{
        this.setState({
            delModal:true
        })  
    }
    delFormConfirm=()=>{
        this.setState({
            delModal:false
        })  
        const id = this.state.financepayData.id.value;
        const ts = this.state.financepayData.ts.value;
        const reqData={
            head:{
                pageinfo:null,
                rows:[{
                    rowId:null,
                    values:{
                        id:{value:id},
                        ts:{value:ts}
                    }
                }]
            }
        }
        Ajax({
            url:rootUrl+'del',
            data:{data:reqData},
            success:function(res){
               hashHistory.push('/fm/loantransaction');
            }
        })    
    }
    delFormCancel=()=>{
        this.setState({
            delModal:false
        })  
    }

    //选择合同编码和放款计划后
    choosePlan=(data,key,val)=>{
        let olddata=this.state[data]; 
        if(typeof val === "object"){
            olddata[key].value=val.value;
            olddata[key].display=val.display;
        }  else{
            olddata[key].value=val;
        }  
        olddata[key].status=1;
        this.setState({
            [data]:olddata
        })

        //新增状态下带出其他数据
        if(this.editId==="add"){
            //请求后台数据
            const reqData={
                head:{
                    pageinfo:null,
                    rows:[{
                        rowId:null,
                        values:{
                            contractid:{
                                value:this.state.financepayData.contractid.value,
                                display:this.state.financepayData.contractid.display
                            },
                            planpayid:{
                                value:this.state.financepayData.planpayid.value,
                                display:this.state.financepayData.planpayid.display
                            }
                        }
                    }]
                }             
            }
            const _this=this;
            if(this.state.financepayData.planpayid.value){
                Ajax({
                    loading:true,
                    url:rootUrl+'contToFin',
                    data:{data:reqData},
                    success:function(res){
                        _this.data=deepClone(res.data);   
                        _this.orgaAndRefResData(res.data);
                    }
                })   
            }
        }
    }

    //过滤参照
    changeRefVal=(key,v)=>{
        const val = {
            refname:v.refname,
            refcode:v.refcode,
            refpk:v.refpk
        }
       this.setState({
            [key]:val
       })
    }

    // 获得区域的序号
	getItemIndex = () => {
		let scrollTop = this.getScrollTop(),		
			firstTop = this.refs.anchor1.offsetTop,
			fixedTop = scrollTop  + CONFIG.JUMP_CONFIG.offset;		
		let [heightPrev, heightNext] = new Array(2).fill(0);
		const LEN = CONFIG.ANCHOR.values.length;

		for(let i = 0; i < LEN; i++) {
			heightPrev = this.refs[`anchor${(i + 1)}`].offsetTop;				
			heightNext = (i <= LEN - 2) ? this.refs[`anchor${(i + 2)}`].offsetTop : null;

			if(fixedTop <= firstTop) {
				return 0;
			}
			if(heightPrev <= fixedTop && (heightNext && heightNext > fixedTop)) {
				return i;
			}else if(!heightNext) {
				return (LEN - 1)
			}			
		}		
    }
    // 获取滚动条位置
	getScrollTop = () => {
		return document.body.scrollTop || document.documentElement.scrollTop
	}// 监听滚动
	addListenerScroll = () => {	
		window.addEventListener('scroll', this.scrollEventDo ,false)				
	}// 取消监听滚动
	removeListenerScroll = () => {
		console.log('-----取消监听-----')
		window.removeEventListener('scroll', this.scrollEventDo, false)
    }
    scrollEventDo = () => {
		if(!this.state.isClicked) {
			this.scrollEvent()
		}		
	}// 点击滚动到位置
	scrollToDis = (e) => {
		let text = e.target.innerHTML;
		this.state.isClicked = true;
		if(!text) {
			return;
		}
		let index = CONFIG.ANCHOR.values.findIndex(value => value == text)
		if(index >= 0){
            //this.setScrollBar(index)
			this.scrollToAnchor(index)
		}		
	}// 滚动条滚到指定区域
	scrollToAnchor = (index) => {
		let ele = this.refs[`anchor${index + 1}`]
		let _this = this;
		jump(ele, {
			duration: CONFIG.JUMP_CONFIG.duration,
			offset: - CONFIG.JUMP_CONFIG.offset,
			callback: () => {
				_this.state.isClicked = false;
			}
		})
	}// 设置tab中tabBar位置
	setScrollBar = (index) => {
        let distance = parseInt(index * CONFIG.ANCHOR.width[index]);
		this.setState({
			distance:distance,
			chooseIndex: index
		})
	}// 滚动条主动滚动事件
	scrollEvent = () => {
		let index = this.getItemIndex();
		this.setScrollBar(index)	
    }
    
    //判断格式为'YYYY-MM-DD'的两个日期大小
    contrastDate=(date1,date2)=>{
        return ((
            new Date(date1.replace(/-/g,"\/"))) > (new Date(date2.replace(/-/g,"\/"))
        ));
    }

    closeModal=()=>{
        this.setState({
            showModal:false
        })
    }

    handelChangeIndex = (index) =>{
        let distance = parseInt(index * CONFIG.ANCHOR.width[index]);
        this.setState({
            distance:distance,
            chooseIndex : index
        })
    }

    render() {
      let activeTab=this.state.activeTab;
      if(this.editId==="ext"){
        activeTab=3;
      }else{
        activeTab=1; 
      }
      let currentBillId=''
      if(this.data.head){
         currentBillId=this.data.head.rows[0].values.id.value;
      }
     
       let processInstanceId = this.props.location.query.processInstanceId;
       let businesskey = this.props.location.query.businesskey;
       let id = this.props.location.query.id;

       let isApprove = this.props.location.pathname.indexOf('/approve') !== -1;
       const fixedRate=(this.editId==="change"&&this.state.rateData.isfixrate.value==1)?true:false;
       const addDisable = (this.editId==="add"&&!this.state.financepayData.planpayid.value)?true:false;
       const {chooseIndex,distance}=this.state;

        const tranStyle = {
	    	transform: `translate3d(${distance}px,0,0)`,
	    	webkitTransform: `translate3d(${distance}px,0,0)`,
	    	mozTransform: `translate3d(${distance}px,0,0)`
	    }
  
        let ispayusecc = (this.state.financepayData.ispayusecc.value==0 || 
            this.state.financepayData.ispayusecc.value==null)?false:true; 
        ispayusecc = true   

        const payPlanRef={
            typeCode:this.state.contractRefVal.refcode,
            keyWords: this.state.contractRefVal.refname,
        }
        let vbillStatusVal=this.state.financepayData.vbillstatus.value;
        //vbillStatusVal=1;
        // console.log(this.vbillStatusBtn[vbillStatusVal])
        const menu = (
            <Menu
              multiple
              className="btn-hide-area"
              >
              <MenuItem key="0" className="hide-item">
                  <Button className="btn-hide" onClick={this.handelDelForm}>删除</Button>
              </MenuItem>                       
              {/* <MenuItem key="1" className="hide-item">
                <Button className="btn-hide">打印</Button>  
              </MenuItem> */}
              <MenuItem key="2" className="hide-item">
                <Link 
                    to={`/fm/financepayChangeRecord/${this.state.financepayData.id.value}`} 
                    target="_blank" 
                    className="btn-hide">变更记录
                </Link>
              </MenuItem>
              <MenuItem key="3" className="hide-item">
                <Button className="btn-hide" onClick={this.handelExtInfo}>展期</Button>
              </MenuItem>
              <MenuItem key="4" className="hide-item">
                    <Button  
                        className="btn-hide"                                               
                        onClick={this.handelPayBtn}
                        disabled={
                         this.state.financepayData.settleflag.value!=0 && this.state.financepayData.settleflag.value!=null
                        }
                    >   
                        结算
                    </Button>
             </MenuItem> 
             <MenuItem key="5" className="hide-item">
                    <ApproveDetailButton processInstanceId={processInstanceId} />
              </MenuItem>
              {this.state.showSubmitBtn?( 
                    <MenuItem key="6" className="hide-item">
                        <Button className="btn-hide" onClick={this.handelSubmit}>提交</Button>
                    </MenuItem> 
                  ):(
                    <MenuItem key="6" className="hide-item">
                        <Button className="btn-hide" onClick={this.handelWithdraw}>收回</Button>
                    </MenuItem> 
             )}
              <MenuItem key="7" className="hide-item">
                 <Button className="btn-hide" onClick={this.handelDownAccount}
                 disabled={this.state.financepayData.settleflag.value==2||this.state.financepayData.settleflag.value==3}
                 >下载结算</Button>
              </MenuItem>  
             {/* {((vbillStatusVal!=null)&&vbillStatusVal<3)?
                (<MenuItem key="6" className="hide-item">
                    <Button  className="btn-hide" onClick={this.handelApprove}>
                    {this.vbillStatusBtn[vbillStatusVal]}</Button>
                 </MenuItem>):(null)
             }
             {vbillStatusVal===1?
                (<MenuItem key="7" className="hide-item">
                    <Button className="btn-hide" onClick={this.handelWithdraw}>收回</Button>
                </MenuItem> ):(null)
             }
              {vbillStatusVal===1?
                (<MenuItem key="8" className="hide-item">
                   <Button className="btn-hide" onClick={this.handelReject}>驳回</Button>
                </MenuItem> ):(null)
             }
             {vbillStatusVal===2?
                (<MenuItem key="9" className="hide-item">
                    <Button className="btn-hide" onClick={this.handelReject}>驳回</Button>
                </MenuItem>):(null)
             }  */}
        </Menu>            
        );
        const tabs=[
            {
				key: 1,
				isShow: true,
				label: '还款计划',
                render: () =><div className="tab"> 
                    <div className="tab-body">
                    {this.state.isBrowse?
                        (<Col md={12} xs={12} sm={12} className="tab-title">
                            还款计划</Col>):
                        (
                            <Col md={12} xs={12} sm={12} className="tab-title">
                                还款计划
                                {this.state.edit1?
                                    (  <span>
                                <button className="info-btn btn-success" onClick={this.handelSave.bind(this,"1")}>保存</button>
                                <button className="info-btn" onClick={this.handelCancel.bind(this,"1")}>取消</button>
                                </span>
                                    ) :
                                    ( <span>
                                <button className="info-btn btn-success" onClick={this.handelAdd.bind(this,"1")}>新增</button>
                                {this.state.dataSource1.length>0?(
                                    <button className="info-btn" onClick={this.handelEdit.bind(this,"1")}>修改</button>
                                ):(null)}
                                </span>
                                    )
                                }
                            </Col>
                        )
                    }
                    <Col md={12} xs={12} sm={12} style={{padding:0}}>
                        <Table
                            scroll={{ y:400}}
                            columns={this.state.column1}
                            data={this.state.dataSource1}
                        />
                    </Col>
                    </div>  
                </div>     
			},{ 
				key: 2,
				isShow: ispayusecc,
				label: '授信',
				render: () => <div className="tab">
                     <div className="tab-body">
                     {this.state.isBrowse?
                        (<Col md={12} xs={12} sm={12} className="tab-title">
                            授信</Col>
                        ):
                        (
                            <Col md={12} xs={12} sm={12} className="tab-title">
                                授信
                                {this.state.edit2?
                                    (  <span>
                        <button className="info-btn btn-success" onClick={this.handelSave.bind(this,"2")}>保存</button>
                        <button className="info-btn" onClick={this.handelCancel.bind(this,"2")}>取消</button>
                        </span>
                                    ) :
                                    ( <span>
                        <button className="info-btn btn-success" onClick={this.handelAdd.bind(this,"2")}>新增</button>
                         {this.state.dataSource2.length>0?(
                            <button className="info-btn" onClick={this.handelEdit.bind(this,"2")}>修改</button>
                        ):(null)}
                        </span>
                                    )
                                }
                            </Col>
                        )
                    }
                    <Col md={12} xs={12} sm={12} style={{padding:0}}>
                        <Table
                            scroll={{ y:400}}
                            columns={this.state.column2}
                            data={this.state.dataSource2}
                        />
                    </Col>
                    </div>
                </div>
			},{
				key: 3,
				label: '展期',
				isShow: this.state.isBrowse&&(this.state.extInfoFlag || this.state.echoExtInfo),
				render: () => <div className="tab">
                    <div className="tab-body">
                    {this.state.extInfoFlag?(
                        <Col md={12} xs={12} sm={12} className="tab-title">
                            展期
                            {this.state.edit3?
                                (  <span>
                                <button className="info-btn btn-success" onClick={this.handelExtSave.bind(this,"3")}>保存</button>
                                <button className="info-btn" onClick={this.handelExtCancel.bind(this,"3")}>取消</button>
                                </span>
                                ) :
                                ( null
                                )
                            }
                        </Col>
                    ) : (
                        <Col md={12} xs={12} sm={12} className="tab-title">
                        展期</Col>
                    )} 
                    <Col md={12} xs={12} sm={12} style={{padding:0}}>
                        <Table
                            scroll={{ y: 400}}
                            columns={this.state.column3}
                            data={this.state.dataSource3}
                        />
                    </Col>
                    </div>
                </div>
			}
        ] 
        const settleflagVal = this.state.financepayData.settleflag.value;//结算状态
        //vbillStatusVal  审批状态
        //显示修改、删除、提交
        const showBtnGroup1 = ((settleflagVal===0||settleflagVal===null)&&
              (vbillStatusVal===0||vbillStatusVal===null))?true:false;
        const showBtnGroup2 = ((settleflagVal===0||settleflagVal===null)&& (vbillStatusVal===3))?true:false;
        const showBtnGroup3 =  ((settleflagVal===0||settleflagVal===null)&& (vbillStatusVal===1))?true:false;
        const showBtnGroup4 = settleflagVal===1?true:false;
        const showBtnGroup5 = settleflagVal===2?true:false;
        const showBtnGroup6 = settleflagVal===3?true:false;

        return (
            <section className="pay-wrapper">
                <Breadcrumb>
                    <Breadcrumb.Item href='#'>首页</Breadcrumb.Item>
                    <Breadcrumb.Item href="#">融资</Breadcrumb.Item>
                    <Breadcrumb.Item active>放款</Breadcrumb.Item>
                </Breadcrumb> 
                { isApprove && 
                <ApproveDetail 
                    processInstanceId={processInstanceId } 
                    billid={id}
                    businesskey={businesskey}
                    refresh={this.searchById.bind(this, id)}
                /> }
                <div className="pay-content">
                    <Affix className="pay-fix">
                        <Col md={12} xs={12} sm={12} className="pay-title" >
                            <div className="pay-title-name">放款</div>
                            {isApprove?(null):(
                                this.state.isBrowse?
                                    (
                                        <div className="btn-area" style={{textAlign:'left'}}>
                                            {showBtnGroup1 &&<span>
                                                {(this.editId!="add"&&currentBillId) && <TmcUploader billID = {currentBillId}/> }
                                                <button onClick={this.handelEditForm} className="btn">修改</button>
                                                <button onClick={this.handelDelForm} className="btn">删除</button>
                                                <button onClick={this.handelSubmit} className="btn">提交</button>
                                            </span> }
                                            {showBtnGroup2 && <span>
                                                {(this.editId!="add"&&currentBillId) && <TmcUploader billID = {currentBillId}/> }
                                                <button onClick={this.handelWithdraw} className="btn">收回</button>
                                            </span>}
                                            {showBtnGroup3 &&<span>
                                                {(this.editId!="add"&&currentBillId) && <TmcUploader billID = {currentBillId}/> }
                                                <button onClick={this.handelPayBtn} className="btn">结算</button>
                                                <ApproveDetailButton processInstanceId={processInstanceId} />
                                            </span>}
                                            {showBtnGroup4 && <span>
                                                <button onClick={this.handelDownAccount} className="btn">下载结算状态</button>
                                                <button onClick={this.handelPayBtn} className="btn">结算</button>
                                            </span> }
                                            {showBtnGroup5 && <span>
                                                <button className="btn" onClick={this.handelChangeBtn} >变更</button>
                                                <Link 
                                                    to={`/fm/financepayChangeRecord/${this.state.financepayData.id.value}`} 
                                                    target="_blank" 
                                                    className="btn">变更记录
                                                </Link>
                                                <button className="btn" onClick={this.handelExtInfo} >展期</button>
                                                {this.state.showTerminationBtn?(
                                                    <button className="btn" onClick={this.handelTermination}>终止</button>
                                                ):(
                                                    <button className="btn" onClick={this.handelCancelTermination}>取消终止</button>
                                                )}   
                                            </span>}
                                            {showBtnGroup6 && <span>
                                                <button onClick={this.handelPayBtn} className="btn">结算</button>
                                                <button onClick={this.handelDownAccount} className="btn">下载结算状态</button>
                                            </span>}

                                            {/* <Button
                                                onClick={this.handelEditForm} 
                                                className="btn">
                                                修改
                                            </Button>                                            
                                            <Button 
                                                className="btn"  
                                                onClick={this.handelChangeBtn} >变更
                                            </Button>
                                            {this.state.showTerminationBtn?(
                                                <Button className="btn" onClick={this.handelTermination}>终止</Button>
                                            ):(
                                                <Button className="btn" onClick={this.handelCancelTermination}>取消终止</Button>
                                            )}              
                                            <Dropdown
                                                trigger={['hover']}
                                                overlay={menu}
                                                animation="slide-up"
                                                >
                                                <Button className="btn-more btn">更多
                                                    <span className='iconfont icon-icon-jiantouxia'></span>
                                                </Button>
                                            </Dropdown> */}
                                        </div>
                                    )
                                :(
                                <div className="btn-area" style={{textAlign:'left'}}>
                                    {(this.editId!="add"&&currentBillId) && <TmcUploader billID = {currentBillId}/> }
                                    <Button  className="btn-success"  onClick={this.open} > 保存</Button>
                                    <Button  className="btn" onClick={this.handelCancelEdit}>取消</Button>
                                </div>
                                )
                            )}
                            <div className="skip-tab">
                                <ul className="financepay-tab cf" onClick={this.scrollToDis}>
                                    {
                                        CONFIG.ANCHOR.values.map((item, index) => {
                                            return (
                                            <li 
                                                className={index == chooseIndex? 'active' : ''}
                                                onClick={this.handelChangeIndex.bind(this,index)}
                                                >
                                                {item}
                                            </li>
                                        )
                                        })
                                    }
                                    <li className="scrollBar tabs-nav-animated"  style={tranStyle}></li>
                                </ul>
                            </div>
                        </Col>
                    </Affix>
                    <section ref="anchor1" className="part-item1 cf">
                        <Col md={12} xs={12} sm={12} className='pay-part'>
                            <Col md={12} xs={12} sm={12} id="contract-info" className='pay-part-title'>业务信息</Col>
                            {this.state.isBrowse?
                                (
                                    <PayRender
                                        financepayData={this.state.financepayData}
                                        currentBillId={currentBillId}
                                    />
                                ) :
                                (
                                    <Form useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag,obj)=>this.checkForm(flag,obj,1)}
                                        checkFormNow={this.state.checkFormNow}>

                                        <FormItem showMast={true} isRequire={true} inline={true} labelMd={2} md={4} labelName="合同编号:"
                                            errorMessage="不允许为空" method="change"
                                            className="referChange"
                                            asyncCheck={(e)=>{
                                                if(this.state.financepayData.contractid.value){
                                                    return true;
                                                }else if(Object.keys(e.value).length>0){
                                                    if(e.value.refname){
                                                        return true;
                                                    }
                                                    return false;
                                                }
                                                return false;
                                            }} 
                                            >                    
                                            <Refer
                                                referClassName={classnames('large', { error: (this.state.formObj1[0])?!this.state.formObj1[0].verify:false })}
                                                name="contractid" 
                                                disabled={this.editId==="change"?true:false}
                                                refModelUrl={'/fm/contractref/'} 
                                                type={'customer'}
                                                value={{
                                                    'refname':this.state.financepayData.contractid.display||this.state.financepayData.contractid.value,
                                                    'refpk':this.state.financepayData.contractid.value}}
                                                refCode={'contractcode'}                                              
                                                ctx={'/uitemplate_web'}
                                                multiLevelMenu={[
                                                    {
                                                        name: ['合同编号', '贷款机构','贷款金额'],
                                                        code: ['refcode']
                                                    }
                                                ]}       
                                                onChange={(v)=>{
                                                    this.changeRefVal('contractRefVal',v);
                                                    const val={
                                                        display:v.refname,
                                                        value:v.refpk
                                                    }
                                                    this.changeState("financepayData","contractid",val)
                                                }}
                                            /> 
                                        </FormItem> 
                                        <FormItem showMast={true} isRequire={true} inline={true} labelMd={2} md={4} labelName="放款计划:"
                                        errorMessage="不允许为空" method="change"  className="referChange"
                                        asyncCheck={(e)=>{
                                            if(this.state.financepayData.planpayid.value){
                                                return true;
                                            }else if(Object.keys(e.value).length>0){
                                                if(e.value.refname){
                                                    return true;
                                                }
                                                return false;  
                                            }
                                            return false;  
                                        }} 
                                        >
                                            <Refer 
                                                referClassName={classnames('large', { error: (this.state.formObj1[1])?!this.state.formObj1[1].verify:false })}
                                                name="planpayid" 
                                                type={'customer'}
                                                //showHistory={false}
                                                disabled={(this.editId==="change"||!this.state.financepayData.contractid.value)?true:false}
                                                refModelUrl={'/fm/payplanref/'} 
                                                value={{
                                                    "refname":this.state.financepayData.planpayid.display||this.state.financepayData.planpayid.value,
                                                    'refpk':this.state.financepayData.planpayid.value
                                                }}
                                                refCode={'payplancode'}
                                                ctx={'/uitemplate_web'}
                                                multiLevelMenu={[
                                                    {
                                                        name: ['计划序号', '放款日期','放款金额'],
                                                        code: ['refcode']
                                                    }
                                                ]}    
                                                clientParam={payPlanRef}              
                                                onChange={(v)=>{
                                                    const val={
                                                        display:v.refname,
                                                        value:v.refpk
                                                    }
                                                    this.choosePlan("financepayData","planpayid",val)
                                                }}
                                                                                    
                                            />           
                                        </FormItem> 
                                        <Col md={6} xs={6} sm={6} className="edit-item">
                                            <Col md={4} xs={4} sm={4} className="edit-item-label">放款编号:</Col>
                                            <Col md={8} xs={8} sm={8} className="edit-item-name">  
                                                {this.state.financepayData.loancode.value}                                            
                                            </Col>
                                        </Col>  
                                        <FormItem
                                        inline={true} labelMd={2} md={4} labelName="贷款单位:"
                                        >
                                            <FormControl 
                                                type={'customer'}
                                                className="large"
                                                name="financorgid"
                                                disabled="true"
                                                value={this.state.financepayData.financorgid.display}
                                                onChange={(v)=>{
                                                this.changeState("financepayData","financorgid",v) }}
                                                placeholder="贷款单位"/>
                                        </FormItem>          
                                        <FormItem inline={true} showMast={true} labelMd={2} md={4} labelName="贷款机构:"
                                            isRequire={true} errorMessage="请输入贷款机构" method="change" className="referChange"
                                            asyncCheck={(e)=>{
                                                if(this.state.financepayData.financecorpid.value){
                                                    return true;
                                                }else if(Object.keys(e.value).length>0){
                                                    if(e.value.refname){
                                                        return true;
                                                    }
                                                    return false;
                                                }
                                                return false;
                                            }} 
                                        >                                        
                                            <Refer name="financecorpid"  refModelUrl={'/bd/finbranchRef/'} 
                                                referClassName={classnames('large', { error: (this.state.formObj1[3])?!this.state.formObj1[3].verify:false })}
                                                type={'customer'}
                                                value={{
                                                    "refname":this.state.financepayData.financecorpid.display||this.state.financepayData.financecorpid.value,
                                                    'refpk':this.state.financepayData.financecorpid.value}}
                                                refCode={'finbranchRef'}
                                                //disabled={(this.editId==="change"||(addDisable))?true:false}
                                                disabled={true}
                                                ctx={'/uitemplate_web'}
                                                refName={'金融网点'}
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
                                                onChange={(v)=>{
                                                    const val={
                                                        display:v.refname,
                                                        value:v.refpk
                                                    }
                                                    this.changeState("financepayData","financecorpid",val)
                                                }}
                                            /> 
                                        </FormItem>                                                        
                                        <FormItem inline={true} showMast={true} labelMd={2} md={4} labelName="交易类型:"
                                            isRequire={true} errorMessage="请输入交易类型" method="change" className="referChange"
                                            asyncCheck={(e)=>{
                                                if(this.state.financepayData.trantypeid.value){
                                                    return true;
                                                }else if(Object.keys(e.value).length>0){
                                                    if(e.value.refname){
                                                        return true;
                                                    }else{
                                                        return false;
                                                    }
                                                }else{
                                                    return false;
                                                }
                                            }} 
                                        >
                                            <Refer name="trantypeid" 
                                            referClassName={classnames('middle', { error: (this.state.formObj1[4])?!this.state.formObj1[4].verify:false })}
                                            type={'customer'}
                                            disabled={(this.editId==="change"||(addDisable))?true:false}
                                            ctx={'/uitemplate_web'}
                                            refModelUrl={'/bd/transtypeRef/'}
                                            refCode={'transtypeRef'}
                                            refName={'交易类型'}
                                            strField={[{ name: '名称', code: 'refname' }]}
                                            value={{
                                                "refname":this.state.financepayData.trantypeid.display||this.state.financepayData.trantypeid.value,
                                                'refpk':this.state.financepayData.trantypeid.value}}
                                            onChange={(v)=>{
                                                const val={
                                                    display:v.refname,
                                                    value:v.refpk
                                                }
                                                this.changeState("financepayData","trantypeid",val)
                                            }}
                                            clientParam={{maincategory:2}}
                                            multiLevelMenu={[
                                                {
                                                    name: ['交易大类'],
                                                    code: ['refname']
                                                },
                                                {
                                                    name: ['交易类型'],
                                                    code: ['refname']
                                                },
                                            ]}

                                            /> 
                                        </FormItem>
                                        <Col md={6} xs={6} sm={6} className="edit-item">
                                            <Col md={4} xs={4} sm={4} className="edit-item-label">交易事件:</Col>
                                            <Col md={8} xs={8} sm={8} className="edit-item-name">  
                                                贷款放款                                        
                                            </Col>
                                        </Col>  
                                        <FormItem showMast={true} inline={true} showMast={true} labelMd={2} md={4} labelName="放款金额:"
                                            isRequire={true} method="change"
                                            errorMessage="须为大于0的数字(2位小数)"
                                            mesClassName="form-error-large"
                                            asyncCheck={(e)=>{
                                                const reg=/^\d{1,28}(.\d{1,2})?$/;
                                                if(this.state.financepayData.loanmny.value){
                                                    return true;
                                                }else if(e.value.length>0){
                                                    const valStr = e.value.toString().replace(/\$|\,/g,'');
                                                    if(reg.test(valStr) && parseFloat(valStr)>0){
                                                        return true;
                                                    }
                                                    return false;
                                                }
                                                return false;
                                            }} 
                                        >
                                            <InputItem
                                                name="loanmny"
                                                className={classnames('large', { error: (this.state.formObj1[5])?!this.state.formObj1[5].verify:false })}
                                                type={'customer'}
                                                disabled={(this.editId==="change"||(addDisable))?true:false}
                                                value={this.state.financepayData.loanmny.value}
                                                used={'money'}
                                                onChange={(v)=>{
                                                    this.changeState("financepayData","loanmny",v)
                                                }}
                                                pos={'left'}
                                            />
                                        </FormItem>
                                        <FormItem inline={true}showMast={true} labelMd={2} md={4} labelName="币种:"
                                            isRequire={true} className="referChange"
                                            errorMessage="请输入币种"
                                            method="change" 
                                            asyncCheck={(e)=>{
                                                if(this.state.financepayData.currtypeid.value){
                                                    return true;
                                                }else if(Object.keys(e.value).length>0){
                                                    if(e.value.refname){
                                                        return true;
                                                    }
                                                    return false;            
                                                }
                                                return false;
                                            }} 
                                        >                                        
                                            <Refer name="currtypeid"  refModelUrl={'/bd/currencyRef/'} 
                                                referClassName={classnames('middle', { error: (this.state.formObj1[6])?!this.state.formObj1[6].verify:false })}
                                                type={'customer'}
                                                value={{
                                                    "refname":this.state.financepayData.currtypeid.display||this.state.financepayData.currtypeid.value,
                                                    'refpk':this.state.financepayData.currtypeid.value}}
                                                refCode={'currencyRef'}
                                                ctx={'/uitemplate_web'}
                                                disabled={(this.editId==="change"||(addDisable))?true:false}
                                                onChange={(v)=>{                                                       
                                                    const val={
                                                        display:v.refname,
                                                        value:v.refpk
                                                    }
                                                    this.changeState("financepayData","currtypeid",val)
                                                }}
                                            /> 
                                        </FormItem>                                        
                                        <FormItem inline={true} labelMd={2}showMast={true} md={4} labelName="本币汇率:"
                                            isRequire={true} method="change"
                                            errorMessage="须为大于0数字(4位小数)"
                                            asyncCheck={(e)=>{
                                                const reg=/^\d{1,28}(.\d{1,4})?$/;
                                                if(this.state.financepayData.rate.value){
                                                    return true;
                                                }else if(e.value.length>0){
                                                    const valStr= e.value.toString().replace(/\$|\,/g,'');
                                                    if(reg.test(valStr) && parseFloat(valStr)>0){
                                                        return true;
                                                    }
                                                    return false;
                                                }
                                                return false;
                                            }} 
                                        >
                                            <InputItem
                                                name="rate"
                                                className={classnames('middle', { error: (this.state.formObj1[7])?!this.state.formObj1[7].verify:false })}
                                                type={'customer'}
                                                disabled={(this.editId==="change"||(addDisable))?true:false}
                                                value={this.state.financepayData.rate.value}
                                                used={'money'}
                                                onChange={(v)=>{
                                                    this.changeState("financepayData","rate",v)
                                                }}
                                                scale={4}
                                                pos={'left'}
                                            />
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} showMast={true} labelName="放款日期:"
                                            isRequire={true} method="change" errorMessage="请选择放款日期"
                                            asyncCheck={(e)=>{
                                                if(this.state.financepayData.loandate.value){
                                                    if(this.contrastDate(this.state.financepayData.loandate.value,
                                                        this.state.financepayData.contenddate.value)){
                                                            toast({size: 'sms', color: 'warning', content: '放款日期不能晚于合同结束日期！', title: '提示'});
                                                            return false;
                                                    }else{
                                                        return true;
                                                    }
                                                } else if(e.value.length>0){
                                                    return true;
                                                }
                                                return false;
                                            }} 
                                        >
                                            {this.state.financepayData.loandate.value?(
                                                <DatePicker
                                                    className={classnames('middle', { error: (this.state.formObj1[8])?(!this.state.formObj1[8].verify):false })}
                                                    disabled={(this.editId==="change"||(addDisable))?true:false}
                                                    name="loandate"
                                                    format="YYYY-MM-DD"
                                                    type={'customer'}
                                                    value={moment(this.state.financepayData.loandate.value)}
                                                    onChange={(v)=>{
                                                        this.changeState("financepayData","loandate",v.format("YYYY-MM-DD"))
                                                    }}
                                                >
                                                </DatePicker>
                                            ):(
                                                <DatePicker
                                                    className={classnames('middle', { error: (this.state.formObj1[8])?(!this.state.formObj1[8].verify):false })}
                                                    type={'customer'}
                                                    disabled={(this.editId==="change"||(addDisable))?true:false}
                                                    name="loandate"
                                                    format="YYYY-MM-DD"
                                                    onChange={(v)=>{
                                                        this.changeState("financepayData","loandate",v.format("YYYY-MM-DD"))
                                                    }}
                                                >
                                                </DatePicker>
                                            )}

                                        </FormItem>
                                        <FormItem inline={true}showMast={true} labelMd={2} md={4} labelName="合同结束日期:"
                                            isRequire={true} method="change" errorMessage="请选择合同结束日期"
                                            asyncCheck={(e)=>{
                                                if(this.state.financepayData.contenddate.value){
                                                    if(this.contrastDate(this.state.financepayData.loandate.value,
                                                        this.state.financepayData.contenddate.value)){
                                                                toast({size: 'sms', color: 'warning', content: '合同结束日期不能早于放款日期！', title: '提示'});
                                                                return false;
                                                    }else{
                                                            return true;
                                                    }
                                                }else if(e.value.length>0){
                                                    return true;
                                                }
                                                return false; 
                                            }} 
                                        >
                                            {this.state.financepayData.contenddate.value?(
                                                <DatePicker
                                                    className={classnames('middle', { error: (this.state.formObj1[9])?!this.state.formObj1[9].verify:false })}
                                                    disabled={(this.editId==="change"||(addDisable))?true:false}
                                                    name="contenddate"
                                                    type={'customer'}
                                                    format="YYYY-MM-DD"
                                                    value={moment(this.state.financepayData.contenddate.value)}
                                                    onChange={(v)=>{
                                                        this.changeState("financepayData","contenddate",v.format("YYYY-MM-DD"))
                                                    }}
                                                >
                                                </DatePicker>
                                            ):(
                                                <DatePicker
                                                    className={classnames('middle', { error: (this.state.formObj1[9])?!this.state.formObj1[9].verify:false })}
                                                    disabled={(this.editId==="change"||(addDisable))?true:false}                                                    
                                                    name="contenddate"
                                                    type={'customer'}
                                                    format="YYYY-MM-DD"
                                                    onChange={(v)=>{
                                                        this.changeState("financepayData","contenddate",v.format("YYYY-MM-DD"))
                                                    }}
                                                >
                                                </DatePicker>
                                            )}
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="借款单位账户:"
                                            reg={/^\s*\S((.){0,34}\S)?\s*$/} className="referChange"
                                            errorMessage="贷款单位0-36个字符" method="blur"
                                        >
                                            <Refer
                                                name="debitunitacctid"
                                                referClassName="large"
                                                type={'customer'}
                                                disabled={(this.editId==="change"||(addDisable))?true:false}     
                                                ctx={'/uitemplate_web'}
                                                refModelUrl={'/bd/bankaccbasRef/'}
                                                refCode={'bankaccbasRef'}
                                                refName={'银行账户'} 
                                                value={{
                                                    "refname":this.state.financepayData.debitunitacctid.display||this.state.financepayData.debitunitacctid.value,
                                                    'refpk':this.state.financepayData.debitunitacctid.value 
                                                }}
                                                multiLevelMenu={[
                                                    {
                                                        name: ['子户编码', '子户名称'],
                                                        code: ['refcode', 'refname']
                                                    }
                                                ]}                                                  
                                                referFilter={{ 
                                                    accounttype:0, //01234对应活期、定期、通知、保证金、理财
                                                    currtypeid: 'G001ZM0000DEFAULTCURRENCT00000000001', //币种pk
                                                    orgid:this.state.financepayData.financorgid.value||'' //组织pk
                                                }}
                                                clientParam={{
                                                    ratestartdate:this.state.financepayData.loandate.value||''
                                                }}
                                                onChange={(v)=>{
                                                        const val={
                                                        display:v.refname,
                                                        value:v.refpk
                                                    }
                                                    this.changeState("financepayData","debitunitacctid",val)
                                                }}  
                                            />
                                        </FormItem>                                        
                                        <FormItem inline={true} labelMd={2} md={4} labelName="项目:">
                                            <Refer
                                                referClassName="large"
                                                type={'customer'}
                                                value={{
                                                    "refname":this.state.financepayData.projectid.display||this.state.financepayData.projectid.value,
                                                    'refpk':this.state.financepayData.projectid.value}}
                                                onChange={(v)=>{
                                                    const val={
                                                        display:v.refname,
                                                        value:v.refpk
                                                    }
                                                        this.changeState("financepayData","projectid",val)
                                                    }}
                                                disabled={addDisable}
                                                name="projectid"
                                                refModelUrl={'/bd/projectRef/'}
                                                refCode={'projectRef'}
                                                refName={'项目'}
                                                ctx={'/uitemplate_web'}
                                            />
                                        </FormItem>
                                        <Col md={12} xs={12} sm={12} style={{padding:0}}>
                                            <Col md={6} xs={6} sm={6} className="edit-item">
                                                <Col md={4} xs={4} sm={4} className="edit-item-label" >结算状态:</Col>
                                                <Col md={8} xs={8} sm={8} className="edit-item-name">
                                                {this.editId==="add"?
                                                    ('待结算') :
                                                    (this.settleflag[this.state.financepayData.settleflag.value])
                                                }                                            
                                                </Col>
                                            </Col>
                                            <Col md={6} xs={6} sm={6} className="edit-item">
                                                <Col md={4} xs={4} sm={4} className="edit-item-label">审批人:</Col>
                                                <Col md={8} xs={8} sm={8} className="edit-item-name">
                                                    {this.state.financepayData.approver.value}                                           
                                                </Col>
                                            </Col>  
                                        </Col>    
                                        <Col md={12} xs={12} sm={12} style={{padding:0}}>
                                            <Col md={6} xs={6} sm={6} className="edit-item">
                                                <Col md={4} xs={4} sm={4} className="edit-item-label">审批状态:</Col>
                                                <Col md={8} xs={8} sm={8} className="edit-item-name">
                                                    {this.vbillStatus[vbillStatusVal]}                                           
                                                </Col>
                                            </Col>
                                            <Col md={6} xs={6} sm={6} className="edit-item">
                                                <Col md={4} xs={4} sm={4} className="edit-item-label">审批日期:</Col>
                                                <Col md={8} xs={8} sm={8} className="edit-item-name">
                                                    {this.state.financepayData.approvedate.value}                                           
                                                </Col>
                                            </Col>
                                        </Col>
                                        <Col md={6} xs={6} sm={6} className="edit-item">
                                            <Col md={4} xs={4} sm={4} className="edit-item-label" >异常终止日期:</Col>
                                            <Col md={8} xs={8} sm={8} className="edit-item-name">
                                            {this.state.financepayData.terminatedate.value?
                                                    (this.state.financepayData.terminatedate.value):
                                                    ('无')
                                                } 
                                            </Col>
                                        </Col> 
                                        <FormItem inline={true} labelMd={2} md={4} labelName="还本释放授信额度:" >
                                            <Radio.RadioGroup
                                                name="payreleasemny" 
                                                type={'customer'}                                               
                                                selectedValue={this.state.financepayData.payreleasemny.value==1?"1":"0"}
                                                onChange={(v)=>{
                                                this.changeState("financepayData","payreleasemny",v)
                                            }}>
                                                <Radio value="1" disabled={(this.editId==="change"||addDisable)?true:false}>是</Radio>
                                                <Radio value="0"disabled={(this.editId==="change"||addDisable)?true:false}>否</Radio>
                                            </Radio.RadioGroup>
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="放款占用授信:" >
                                            <Switch
                                                type={'customer'}
                                                disabled={true}
                                                name="ispayusecc"
                                                checked={ispayusecc}
                                                checkedChildren={'开'} unCheckedChildren={'关'}
                                                onChangeHandler={(v)=>{
                                                    v=v?1:0;
                                                    this.changeState("financepayData","ispayusecc",v)
                                                }}
                                            />
                                        </FormItem>
                                        <Col md={12} xs={12} sm={12} style={{padding:0}}></Col>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="备注:" >
                                            <TextareaItem 
                                                type={'customer'}
                                                name="memo"
                                                disabled={addDisable}
                                                value={this.state.financepayData.memo.value} 
                                                onChange={(v)=>{
                                                    this.changeState("financepayData","memo",v)
                                                }}
                                                className="u-textarea-wrap"
                                                placeholder="备注"
                                                count={200}/>
                                        </FormItem>
                                        <Col md={12} xs={12} sm={12} style={{padding:0}}></Col>
                                        {/* {this.editId==='add'?
                                            (<span></span>):(
                                                <Col md={12} xs={12} sm={12} className="edit-item">
                                                    <Col md={2} xs={2} sm={2} className="edit-item-label" >上传附件:</Col>
                                                    <Col md={10} xs={10} sm={10} className="edit-item-name">
                                                        <TmcUploader 
                                                            billID = {currentBillId}
                                                        /> 
                                                    </Col>
                                                </Col>
                                            )
                                        } */} 
                                    </Form>
                                )}
                        </Col>
                    </section>
                    <section ref="anchor2" className="part-item2 cf">
                        <Col md={12} xs={12} sm={12}  className='pay-part'>
                            <Col md={12} xs={12} sm={12} id="InRate-info" className='pay-part-title'>利率信息</Col>
                            {this.state.isBrowse ?
                                (
                                    <RateRender
                                        rateData={this.state.rateData}
                                    />
                                ) :
                                (
                                    <Form useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag,obj)=>this.checkForm(flag,obj,2)}
                                        checkFormNow={this.state.checkFormNow}
                                    >
                                        <FormItem inline={true} showMast={true} labelMd={2} md={4} labelName="利率:"
                                            isRequire={true} className="referChange"
                                            errorMessage="请输入利率" 
                                            method="change" 
                                            asyncCheck={(e)=>{
                                                if(this.state.rateData.rateid.value){
                                                    return true;
                                                }else if(Object.keys(e.value).length>0){
                                                    if(e.value.refname){
                                                        return true;
                                                    }else{
                                                        return false;
                                                    }
                                                }else{
                                                    return false;
                                                }
                                            }}                                        
                                        >                                      
                                            <Refer 
                                                type={'customer'}
                                                referClassName={classnames('middle', { error: (this.state.formObj2[0])?!this.state.formObj2[0].verify:false })}
                                                name="rateid" 
                                                refModelUrl={'/bd/rateRef/'} 
                                                value={{
                                                    "refname":this.state.rateData.rateid.display||this.state.rateData.rateid.value,
                                                    'refpk':this.state.rateData.rateid.value
                                                    }}
                                                refCode={'rateRef'}
                                                ctx={'/uitemplate_web'}
                                                multiLevelMenu={[
                                                    {
                                                        name: ['名称', '利率'],
                                                        code: ['refname', 'rate']
                                                    }
                                                ]}
                                                clientParam={{ //根据日期过滤
                                                    ratestartdate:this.state.financepayData.loandate.value||''
                                                }}
                                                disabled={(addDisable||fixedRate)?true:false}
                                                onChange={(v)=>{
                                                    const val={
                                                        display:v.refname,
                                                        value:v.refpk
                                                    }
                                                    this.changeState("rateData","rateid",val)
                                                }}
                                            /> 
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="固定汇率:"
                                        >
                                            <Radio.RadioGroup
                                                type={'customer'}
                                                name="isfixrate"
                                                selectedValue={this.state.rateData.isfixrate.value==1?"1":"0"}
                                                onChange={(v)=>{
                                                this.changeState("rateData","isfixrate",v)
                                            }}>
                                                <Radio value="1"  disabled={addDisable}>是</Radio>
                                                <Radio value="0"  disabled={addDisable}>否</Radio>
                                            </Radio.RadioGroup>
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="利率浮动比例%:"
                                            method="change"
                                            errorMessage="输入格式有误(-100<数值<=100)"
                                            asyncCheck={(e)=>{
                                                if(e.value===null || e.value.trim()===''){
                                                    return true;
                                                }else{
                                                    const reg=/^(-?\d+)(\.\d+)?$/;
                                                    return reg.test(e.value) && (parseFloat(e.value)>-100) &&(parseFloat(e.value)<=100) ;
                                                }   
                                            }}
                                        >
                                            <FormControl  
                                                name="floatratescale"
                                                type={'customer'}
                                                disabled={
                                                    (addDisable)?true:(this.state.rateData.rateid.display=="libor利率")?true:false
                                                }
                                                className="middle"
                                                placeholder="利率浮动比例%"
                                                onChange={(v)=>{
                                                    this.changeState("rateData","floatratescale",v)
                                                }}
                                                value={this.state.rateData.floatratescale.value}      
                                                />
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="利率浮动点数:"
                                            method="change"
                                            errorMessage="输入格式有误(28位数值)"
                                            asyncCheck={(e)=>{
                                                if(e.value===null || e.value.trim()===''){
                                                    return true;
                                                }else{
                                                const reg=/^(-?\d{1,28})(\.\d{1,8})?$/;
                                                return reg.test(e.value);
                                                }   
                                            }}
                                        >
                                            <FormControl 
                                                name="floatratepoints"
                                                className="middle" 
                                                type={'customer'}
                                                disabled={
                                                        addDisable?true:(this.state.rateData.rateid.display!="libor利率")?true:false
                                                }                                                       
                                                onChange={(v)=>{
                                            this.changeState("rateData","floatratepoints",v)
                                        }}
                                                        value={this.state.rateData.floatratepoints.value}/>
                                        </FormItem>
                                        <FormItem inline={true} showMast={true} labelMd={2} md={4} labelName="结息日:"
                                            isRequire={true} className="referChange"
                                            errorMessage="请选择结息日"
                                            method="change" 
                                            asyncCheck={(e)=>{
                                                if(this.state.rateData.settledate.value){
                                                    return true;
                                                }else if(Object.keys(e.value).length>0){
                                                    if(e.value.refname){
                                                        return true;
                                                    }else{
                                                        return false;
                                                    }
                                                }else{
                                                    return false;
                                                }
                                            }}             
                                        >            
                                            <Refer 
                                                type={'customer'} 
                                                referClassName={classnames('middle', { error: (this.state.formObj2[4])?!this.state.formObj2[4].verify:false })}
                                                disabled={addDisable}                                      
                                                value={{
                                                    "refname":this.state.rateData.settledate.display||this.state.rateData.settledate.value,
                                                    'refpk':this.state.rateData.settledate.value
                                                    }}
                                                name="settledate"
                                                refModelUrl={'/bd/interestDayRef/'}
                                                refCode={'interestDayRef'}
                                                refName={'结息日'}
                                                ctx={'/uitemplate_web'}
                                                multiLevelMenu={[
                                                    {
                                                        name: ['编码', '名称'],
                                                        code: ['refcode', 'refname']
                                                    }
                                                ]}
                                                onChange={(v)=>{
                                                    const val={
                                                        display:v.refname,
                                                        value:v.refpk
                                                    }
                                                    this.changeState("rateData","settledate",val)
                                                }}
                                            />
                                        </FormItem>
                                        <FormItem inline={true}showMast={true} labelMd={2} md={4} labelName="还款方式:"
                                            isRequire={true} className="referChange"
                                            errorMessage="请选择还款方式"
                                            method="change" 
                                            asyncCheck={(e)=>{
                                                if(this.state.rateData.returnmodeid.value){
                                                    return true;
                                                }else if(Object.keys(e.value).length>0){
                                                    if(e.value.refname){
                                                        return true;
                                                    }else{
                                                        return false;
                                                    }
                                                }else{
                                                    return false;
                                                }
                                            }}             
                                        >
                                            <Refer
                                                referClassName={classnames('middle', { error: (this.state.formObj2[5])?!this.state.formObj2[5].verify:false })}
                                                type={'customer'}
                                                disabled={(this.editId==="change"||addDisable)?true:false}
                                                onChange={(v)=>{
                                                    const val={
                                                        display:v.refname,
                                                        value:v.refpk
                                                    }
                                                    this.changeState("rateData","returnmodeid",val)
                                                }}
                                                value={{
                                                        "refname":this.state.rateData.returnmodeid.display||this.state.rateData.returnmodeid.value,
                                                        'refpk':this.state.rateData.returnmodeid.value
                                                    }}
                                                name="returnmodeid"
                                                refModelUrl={'/bd/repaymentmethodRef/'}
                                                refCode={'repaymentmethodRef'}
                                                refName={'还款方式'}
                                                multiLevelMenu={[
                                                    {
                                                        name: ['编码', '名称'],
                                                        code: ['refcode', 'refname']
                                                    }
                                                ]}
                                                ctx={'/uitemplate_web'}
                                            />
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="逾期浮动比例%:"
                                            method="change" 
                                            errorMessage="输入格式有误(-100<数值<=100)"
                                            asyncCheck={(e)=>{
                                                if(e.value===null || e.value.trim()===''){
                                                    return true;
                                                }else{
                                                const reg=/^(-?\d+)(\.\d+)?$/;
                                                return reg.test(e.value) && (parseFloat(e.value)>-100)&&(parseFloat(e.value)<=100);
                                                }   
                                            }}
                                        >
                                            <FormControl 
                                                name="overratescale"
                                                className="middle"
                                                type={'customer'}
                                                disabled={
                                                    (addDisable)?true:(this.state.rateData.rateid.display=="libor利率")?true:false
                                                }  
                                                value={this.state.rateData.overratescale.value}
                                                onChange={(v)=>{
                                                    this.changeState("rateData","overratescale",v)
                                                }}
                                                placeholder="逾期浮动比例"/>
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="提前浮动比例%:"
                                        method="change" 
                                        errorMessage="输入格式有误(-100<数值<=100)"
                                        asyncCheck={(e)=>{
                                            if(e.value===null || e.value.trim()===''){
                                                return true;
                                                }else{
                                                const reg=/^(-?\d+)(\.\d+)?$/;
                                                return reg.test(e.value) && (parseFloat(e.value)>-100)&&(parseFloat(e.value)<=100);
                                                }   
                                            }}
                                        >
                                            <FormControl 
                                                name="headratescale"
                                                className="middle"
                                                type={'customer'}
                                                disabled={
                                                    (addDisable)?true:(this.state.rateData.rateid.display=="libor利率")?true:false
                                                } 
                                                value={this.state.rateData.headratescale.value}
                                                onChange={(v)=>{
                                                    this.changeState("rateData","headratescale",v)
                                                }}
                                                placeholder="提前浮动比例"/>
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="逾期浮动点数:"
                                            method="change"
                                            errorMessage="输入格式有误(28位数值)"
                                            asyncCheck={(e)=>{
                                                if(e.value===null || e.value.trim()===''){
                                                    return true;
                                                }else{
                                                const reg=/^(-?\d{1,28})(\.\d{1,8})?$/;
                                                return reg.test(e.value);
                                                }   
                                            }}
                                        >
                                            <FormControl 
                                                name="overratepoint"
                                                className="middle" 
                                                type={'customer'}
                                                disabled={
                                                    addDisable?true:(this.state.rateData.rateid.display!="libor利率")?true:false
                                                }                                            
                                                onChange={(v)=>{
                                            this.changeState("rateData","overratepoint",v)
                                        }}
                                                        value={this.state.rateData.overratepoint.value}
                                            />
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="提前浮动点数:"
                                            method="change"
                                            errorMessage="输入格式有误(28位数值)"
                                            asyncCheck={(e)=>{
                                                if(e.value===null || e.value.trim()===''){
                                                    return true;
                                                }else{
                                                    const reg=/^(-?\d{1,28})(\.\d{1,8})?$/;
                                                    return reg.test(e.value);
                                                }   
                                            }}>
                                            <FormControl 
                                                name="headratepoint"
                                                type={'customer'}
                                                className="middle"
                                                disabled={
                                                    addDisable?true:(this.state.rateData.rateid.display!="libor利率")?true:false
                                                }         
                                                onChange={(v)=>{
                                                    this.changeState("rateData","headratepoint",v)
                                                }}
                                                value={this.state.rateData.headratepoint.value}/>
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="逾期利率计复利:" >
                                            <Switch
                                                    type={'customer'}
                                                disabled={addDisable}
                                                name="isoverinterest"
                                                checked={this.state.rateData.isoverinterest.value===1?true:false}
                                                checkedChildren={'开'} unCheckedChildren={'关'}
                                                onChangeHandler={(v)=>{
                                            v=v?1:0;
                                        this.changeState("rateData","isoverinterest",v)
                                        }}
                                            />
                                        </FormItem>
                                        {this.state.rateData.isoverinterest.value?(
                                            <FormItem inline={true} labelMd={2} md={4} labelName="用合同利率计复利:" >
                                                <Switch
                                                    type={'customer'}
                                                    disabled={addDisable}
                                                    name="isusenormalrate"
                                                    checked={this.state.rateData.isusenormalrate.value===1?true:false}
                                                    checkedChildren={'开'} unCheckedChildren={'关'}
                                                    onChangeHandler={(v)=>{
                                                v=v?1:0;
                                            this.changeState("rateData","isusenormalrate",v)
                                        }}
                                                />
                                            </FormItem>
                                        ):(<span></span>)}
                                    </Form>
                                )
                            }

                        </Col>
                    </section>
                    <section ref="anchor3" className="part-item3 cf">
                        <Col md={12} xs={12} sm={12}  className='pay-part'>
                            <Col md={12} xs={12} sm={12} id="InRate-scheme" className='pay-part-title'>利率调整方案</Col>
                            {this.state.isBrowse ?
                                (
                                    <AdjrateRender
                                        adjrateData={this.state.adjrateData}
                                    />
                                ) :
                                (
                                    <Form useRow={true}
                                        showSubmit={false}
                                        submitCallBack={(flag,obj)=>this.checkForm(flag,obj,3)}
                                        checkFormNow={this.state.checkFormNow}
                                    >
                                        <FormItem inline={true} labelMd={2} md={4} labelName="调整方案:" className="adjRadio" >
                                            <Radio.RadioGroup
                                                name="adjratemethod"
                                                type={'customer'}
                                                selectedValue={this.state.adjrateData.adjratemethod.value}
                                                onChange={(v)=>{
                                                this.changeState("adjrateData","adjratemethod",v)
                                            }}>
                                                <Radio value="Year" disabled={addDisable||fixedRate}>年</Radio>
                                                <Radio value="HalfYear" disabled={addDisable||fixedRate}>半年</Radio>
                                                <Radio value="Quarter" disabled={addDisable||fixedRate}>季</Radio>
                                                <Radio value="Month" disabled={addDisable||fixedRate}>月</Radio>
                                                <Radio value="SettleDate" disabled={addDisable||fixedRate}>结息日</Radio>
                                                {/* <Radio value="RateStartDate">利率起效日</Radio> */}
                                            </Radio.RadioGroup>
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="调整周期(月):">                                          
                                        <Select 
                                            type={'customer'}
                                            disabled={(this.adjunitDisabled||addDisable||fixedRate)}
                                            className="middle"
                                            name="adjperiodunit"
                                            value={this.state.adjrateData.adjperiodunit.value}                                                                                             
                                            onChange={(v)=>{
                                                this.changeState("adjrateData","adjperiodunit",v)
                                            }}>
                                            {Array(12).fill('naive').map((e,i)=>{
                                                return(<Option value={`${i+1}`}>{i+1}</Option>)
                                            })}
                                        </Select>
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="调整开始日期:"
                                            errorMessage="请输入调整开始日期" 
                                            asyncCheck={(e)=>{
                                                if(this.state.adjrateData.effecttype.value=="VdefDate"){
                                                    if(e.value){
                                                        return true;
                                                    }else{
                                                        return false;
                                                    }
                                                }else{
                                                    return true;
                                                }
                                            }}        
                                        >
                                            {this.state.adjrateData.adjbegdate.value?(
                                                <DatePicker
                                                    type={'customer'}
                                                    className="middle"
                                                    disabled={addDisable||fixedRate}
                                                    name="adjbegdate"
                                                    format="YYYY-MM-DD"
                                                    value={moment(this.state.adjrateData.adjbegdate.value)}
                                                    onChange={(v)=>{
                                                this.changeState("adjrateData","adjbegdate",v.format("YYYY-MM-DD"))
                                            }}
                                                >
                                                </DatePicker>
                                            ):(
                                                <DatePicker
                                                    type={'customer'}
                                                    className="middle"
                                                    name="adjbegdate"
                                                    format="YYYY-MM-DD"
                                                    disabled={addDisable||fixedRate}
                                                    onChange={(v)=>{
                                                this.changeState("adjrateData","adjbegdate",v.format("YYYY-MM-DD"))
                                            }}
                                                >
                                                </DatePicker>
                                            )}
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={4} labelName="上次调整日期:" >
                                            {this.state.adjrateData.lastadjdate.value?(
                                                <DatePicker
                                                        type={'customer'}
                                                    className="middle"
                                                    name="lastadjdate"
                                                    format="YYYY-MM-DD"
                                                    disabled={addDisable||fixedRate}
                                                    value={moment(this.state.adjrateData.lastadjdate.value)}
                                                    onChange={(v)=>{
                                                this.changeState("adjrateData","lastadjdate",v.format("YYYY-MM-DD"))
                                            }}
                                                >
                                                </DatePicker>
                                            ):(
                                                <DatePicker
                                                    type={'customer'}
                                                    className="middle"
                                                    name="lastadjdate"
                                                    disabled={addDisable||fixedRate}
                                                    format="YYYY-MM-DD"
                                                    onChange={(v)=>{
                                                this.changeState("adjrateData","lastadjdate",v.format("YYYY-MM-DD"))
                                            }}
                                                >
                                                </DatePicker>
                                            )}
                                        </FormItem>
                                        <FormItem inline={true} labelMd={2} md={3} labelName="起效方式:">
                                            <Radio.RadioGroup
                                                type={'customer'}
                                                name="effecttype"
                                                selectedValue={this.state.adjrateData.effecttype.value}
                                                onChange={(v)=>{
                                                this.changeState("adjrateData","effecttype",v)
                                            }}>
                                                <Radio value="VdefDate"  disabled={addDisable||fixedRate}> 自定义日期 </Radio>
                                                <Radio value="LoanDate"  disabled={(addDisable||fixedRate)?true:false}>放款日期</Radio>
                                            </Radio.RadioGroup>
                                        </FormItem>                           
                                    </Form>
                                )
                            }

                        </Col>
                    </section>
                    <section ref="anchor4" className="part-item4 cf">
                        <Col md={12} xs={12} sm={12} className='pay-part'>
                            <Col md={12} xs={12} sm={12}  className="pay-info-tabs">
                                <span id="other-info" className='pay-part-title'>
                                    其他信息
                                </span>
                                <LightTabs activeKey={ activeTab }  items={tabs} />
                            </Col> 
                        </Col>
                    </section>    
                </div>
                <MsgModal
                   show={this.state.terminationModal}
                   icon={'icon-tishianniuzhuyi'}
                   title={"是否真的终止,请确认"}
                   content={"您真的要终止该单据吗？"}
                   confirmText={'确定'}
                   cancelText={"取消"}
                   onConfirm={this.terminationConfirm}
                   onCancel={this.terminationCancel}
                />
                <MsgModal
                   show={this.state.delModal}
                   icon={'icon-tishianniuzhuyi'}
                   title={"确定要删除该单据吗？"}
                   content={"确定要删除吗？"}
                   confirmText={'确定'}
                   cancelText={"取消"}
                   onConfirm={this.delFormConfirm}
                   onCancel={this.delFormCancel}
                />
                <MsgModal
                   show={this.state.showModal}
                   icon={'icon-tishianniuzhuyi'}
                   title={"提示"}
                   content={"是否使用自动计算的还款计划？"}
                   confirmText={'是'}
                   cancelText={"否"}
                   onConfirm={this.handlePaySave.bind(this,true)}
                   onCancel={(flag)=>{
                       if(flag){
                           this.closeModal();
                       }else{
                            if(this.state.dataSource1.length<1){
                                toast({size: 'sms', color: 'warning', content: '您还没输入任何还款计划！', title: '提示'});
                                this.setState({
                                    showModal:false
                                })
                            }else{
                                this.handlePaySave(false);
                            }
                       }
                   }}
                />
            </section>
        );
    }
}
