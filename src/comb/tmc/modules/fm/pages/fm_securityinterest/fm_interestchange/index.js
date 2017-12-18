import React, { Component } from "react";
import { hashHistory  } from 'react-router';
import {
Breadcrumb,
Con,
Row,
Col,
Button,
Table,
Icon,
InputGroup,
Checkbox,
Modal,
ButtonGroup,
Message
} from "tinper-bee";
import Tabs, {TabPane} from 'bee-tabs';
import Form from 'bee-form';
import FormControl from 'bee-form-control';
import Menu, { Item as MenuItem, Divider, SubMenu, MenuItemGroup } from 'bee-menus';
import Dropdown from 'bee-dropdown';
import { Link } from "react-router";
import DatePicker from "bee-datepicker";
import StateCard from '../../../containers/StateCard';
import SideslipModal from '../../../containers/SideslipModal';
import Ajax from '../../../../../utils/ajax';
import "./index.less";
import "../../../../../utils/utils.js";

const FormItem = Form.FormItem;
const typeMembers = [{value: 1, name: "抵押物权"}, {value: 2, name: "质押物权"}];
const ownerMembers = [{value: 1, name: "合作伙伴"}, {value: 2, name: "本单位"}, {value: 3, name: "集团内"}];
const interestStatusMembers = [{value: 1, name: "待押物权"}, {value: 2, name: "在押物权"}, {value: 3, name: "已解物权"}, {value: 4, name: "已停物权"}];
const measurableMembers = [{key: "number", type: "text", showMast: false, labelName: "数量:", errorMessage: "", placeholder: ""},
                    {key: "unit", type: "text", showMast: false, labelName: "单位:", errorMessage: "", placeholder: ""},
                    {key: "price", type: "text", showMast: false, labelName: "单价:", errorMessage: "", placeholder: ""},
                    {key: "quality", type: "text", showMast: false, labelName: "质量:", errorMessage: "", placeholder: ""},
                    {key: "status", type: "text", showMast: false, labelName: "状况:", errorMessage: "", placeholder: ""},
                    {key: "specification", type: "text", showMast: false, labelName: "规格型号:", errorMessage: "", placeholder: ""},
                    {key: "location", type: "text", showMast: false, labelName: "所在地:", errorMessage: "", placeholder: ""}];

const modalColumns = 
[{ title: '序号', dataIndex: 'index', key: 'index', width: 100 },
{ title: '担保日期/担保合同号', dataIndex: 'contractCode', key: 'contractCode', width: 300,
render: (text, record, index) => {
        return <div>
                    <div>record.date</div>
                    <div>record.contractCode</div>
                </div>
    }
},
{ title: '债权人', dataIndex: 'creditorpa', key: 'creditorpa', width: 300 },
{ title: '债务人', dataIndex: 'debtorpa', key: 'debtorpa', width: 300 },
{ title: '担保人', dataIndex: 'guarantor', key: 'guarantor', width: 300 }];

const defaultState = {id: "",                        
                    code: "",
                    name: "",
                    gpType: "",            //担保物权分类
                    owner: "",                    //所有者属性
                    partner: {id: "", refName: "", refpk: "0d4173e3-2961-4cfe-9958-f0ea5da053ac"},
                    currency: {id: "", refName: "", refpk: ""},
                    measurable: false,
                    number: "",
                    unit: "",
                    price: "",
                    quality: "",
                    status: "",
                    specification: "",
                    location: "",
                    originPrice: "",
                    firstPrice: "",
                    curPrice: "",
                    changePrice: "",
                    assessOrg: "",
                    pledgeRate: "",
                    maxPledge: "",
                    totalPledge: "",
                    restPledge: "",
                    dealer: "",
                    interestStatus: 1,
                    pledgePerson: "",
                    pledgepno: "",
                    attach: "",
                    ts: "",
                    tenantid: "",
                    showModal: false,
                    checkFormNow: false,
                    showSideslipModal: false,
                    queryData: [],
                    pageStatus: "add",
                    verTable: [],
                    active: 0
                };

const rootURL = window.reqURL.fm + "fm/guaproperty/"; 

export default class InterestChange extends Component {

    constructor(props){
        super(props);
            this.state = defaultState;
            this.state.pageStatus = props.location.state ? props.location.state.pageState : "add";
    }

    componentWillMount(){
        if(this.props.location.state){
            const pageStatus = this.props.location.state.pageStatus;
            if(pageStatus != "add"){
                this.query(this.props.location.state.data.id, pageStatus);
            }
        }
    }
    
    /**
     * @method Ajax请求
     * @param url 请求url
     * @param param 请求参数对象
     * @param successFun 请求成功时调用的函数，返回需要更新的状态，不需更新状态时不返回对象
     * @param localParam 需要传递的局部变量参数
     */
    request = (url, param, successFun, localParam = {}) => {
		const _this = this;
        Ajax({
            url: url,
            data: param,
            loading: true,
			success: function(res) {
				const { data, success, message } = res;
                if (success) {
                    const result = successFun(data, localParam);
                    if (typeof result != "undefined"){
                        _this.setState(result);
                    }                 
                } else {
                    Message.create({content: '数据请求出错！', color: 'danger'});
                }
			},
			error: function(res) {
				Message.create({content: '数据请求出错！', color: 'danger'});
			}
		});
    };

    save = (fun) => {
        this.setState({checkFormNow: true});
        const {id, code, name, gptype, owner, partner, currency, measurable, number, unit, price,
        quality, status, specification, location, originPrice, firstPrice, curPrice, changePrice,
        assessOrg, pledgeRate, maxPledge, totalPledge, restPledge, dealer, interestStatus, 
        pledgePerson, pledgepno, pageStatus, ts, tenantid} = this.state;
        const url = pageStatus == "change" ? rootURL + "revise" : rootURL + "save";
        const param = {
            data: {
                head: {
                    rows: [
                        {
                            values: {
                                pledgeno: {
                                    value: code
                                },
                                pledgename: {
                                    value: name
                                },
                                gptype: {
                                    value: gptype
                                },
                                owner: {
                                    value: owner
                                },
                                partner: {
                                    value: partner.id,
                                    display: partner.refName
                                },
                                currtypeid: {
                                    value: currency.id,
                                    display: currency.refName
                                },
                                measurable: {
                                    value: measurable ? 1 : 0
                                },
                                p_count: {
                                    value: number == "" ? 0 : number
                                },
                                p_unit: {
                                    value: unit
                                },
                                p_price: {
                                    value: price == "" ? 0 : price
                                },
                                p_quality: {
                                    value: quality
                                },
                                status: {
                                    value: status
                                },
                                p_specno: {
                                    value: specification
                                },
                                p_location: {
                                    value: location
                                },
                                originprice: {
                                    value: originPrice == "" ? 0 : originPrice
                                },
                                firstprice: {
                                    value: firstPrice == "" ? 0 : firstPrice
                                },
                                curprice: {
                                    value: curPrice == "" ? 0 : curPrice
                                },
                                price: {
                                    value: changePrice == "" ? 0 : changePrice
                                },
                                assessorg: {
                                    value: assessOrg
                                },
                                pledgerate: {
                                    value: pledgeRate == "" ? 0 : pledgeRate
                                },
                                maxpledge: {
                                    value: maxPledge == "" ? 0 : maxPledge
                                },
                                totalpledge: {
                                    value: totalPledge == "" ? 0 : totalPledge
                                },
                                restpledge: {
                                    value: restPledge == "" ? 0 : restPledge
                                },
                                dealer: {
                                    value: dealer
                                },
                                guapropstatus: {
                                    value: 1
                                },
                                pledgeperson: {
                                    value: pledgePerson
                                },
                                pledgepno: {
                                    value: pledgepno
                                }                    
                            }
                        }
                    ]
                }
            }
        };
        if(pageStatus == "add"){
            param.data.head.rows[0].values.status = {
                value: 2
            };
        }else{
            if(pageStatus == "edit"){
                param.data.head.rows[0].values.status = {
                    value: 1
                };
            }
            param.data.head.rows[0].values.id = {
                value: id
            };
            param.data.head.rows[0].values.tenantid = {
                value: tenantid
            };
            param.data.head.rows[0].values.ts = {
                value: ts
            };
        }

        const localParam = {};
        let uploadFun;
        if (typeof fun === 'function') {
            uploadFun = fun;
        } else {
            // 文件上传之前需要处理的方法
            // 保存除附件之外的数据         
            this.request(url, param, (data, localParam) => {
               return {showModal: true};
            }, localParam);     
            //this.setState({showModal: true});
            //uploadFun();
        }
    }

    query = (id, pageStatus) => {
        const url = rootURL + "revisevs";
        const param = {id: id};
        this.request(url, param, (data, localParam) => {
            if(!data.headleft)
                return;
            const verTable = data.headleft.rows.map((item) => {
                const vals = item.values;
                return {
                    id: vals.id.value,
                    ts: vals.ts.value,
                    versionNo: vals.versionno.value 
                };
            });
            const values = data.headright.rows[0].values;
            return {
                id: values.id.value,
                code: values.pledgeno.value,
                name: values.pledgename.value,
                gpType: values.gptype.value,            //担保物权分类
                owner: values.owner.value,                    //所有者属性
                partner: {id: values.partnerid.value, refName: values.partnerid.display, refpk: "0d4173e3-2961-4cfe-9958-f0ea5da053ac"},
                currency: {id: values.currtypeid.value, refName: values.currtypeid.display},
                measurable: values.measurable.value == 1,
                number: values.p_count.value,
                unit: values.p_unit.value,
                price: values.p_price.value,
                quality: values.p_quality.value,
                status: values.p_status.value,
                specification: values.p_specno.value,
                location: values.p_location.value,
                originPrice: values.originprice.value,
                firstPrice: values.firstprice.value,
                curPrice: values.curprice.value,
                changePrice: values.price.value,
                assessOrg: values.assessorg.value,
                pledgeRate: values.pledgerate.value,
                maxPledge: values.maxpledge.value,
                totalPledge: values.totalpledge.value,
                restPledge: values.restpledge.value,
                dealer: values.dealer.value,
                interestStatus: values.guapropstatus.value,
                pledgePerson: values.pledgeperson.value,
                pledgepno: values.pledgepno.value,
                ts: values.ts.value,
                tenantid: values.tenantid.value,
                verTable,
                pageStatus
            };
         })
    }

    edit = () => this.setState({pageStatus: "edit"});

    delete = () => {

    }

    cancel = () => {
        hashHistory.push(`/fm/securityinterest`);
    }

    handleModalConfirm = () => {
        this.setState(defaultState);
    }

    handleChange = (item, e) => {
		const key = item.key;
		const type = item.type;
		let data = this.state;
        if(type =="switch"){
            data[key] = !data[key];
        }else{
            data[key] = e;
        }
		this.setState(data);
    };

    beforeChange = (item, value, preState) => { 
        //console.log(preState.value, value, 'beforeChange=>'); 
        const key = item.key;
		const type = item.type;
		let data = this.state;
        //货币输入校验
        if(!this.checkCoinInput(value)){
            //若不为货币格式，不改变状态，不更新到InputItem中
            data[key] = preState.value;
            this.setState(data);
            return preState.value; 
        }
        this.setState(data);
        return value; 
    }

    handleCollapse = (item, e)=> {
        const key = item.key;
        let data = this.state; 
        data[key] = e;  
        this.setState(data);
    }

    handleSideslip = () => {
        const url = window.reqURL.fm + "fm/guacontract/linkedquery";
        const param = {guapropertyid: this.state.id, gptype: this.state.gpType};
        this.request(url, param, (data) => {
            if(!data.head){
				return {
					showSideslipModal: true
				};
			}
			let queryData = [];
			queryData = data.head.rows.map((item, index) => {
				const values = item.values;
				return {
					index: index + 1,
					contractno: values.contractno.value,
					guastartdate: values.guastartdate.value,
					creditorpa: values.creditorpa.value,
					debtorpa: values.debtorpa.value,
					guarantor: values.guarantor.value
				};
			});
			return {
				queryData,
				showSideslipModal: true
			};
		});
    } 

    handelSelRecord = (item, i) => {
        const url = rootURL + "revisevsall";
        const param = {id: item.id, versionno: item.versionNo};
        this.request(url, param, (data, localParam) => {
            const values = data.head.rows[0].values;
            return {
                id: values.id.value,
                code: values.pledgeno.value,
                name: values.pledgename.value,
                gpType: values.gptype.value,            //担保物权分类
                owner: values.owner.value,                    //所有者属性
                partner: {id: values.partnerid.value, refName: values.partnerid.display, refpk: "0d4173e3-2961-4cfe-9958-f0ea5da053ac"},
                currency: {id: values.currtypeid.value, refName: values.currtypeid.display},
                measurable: values.measurable.value == 1,
                number: values.p_count.value,
                unit: values.p_unit.value,
                price: values.p_price.value,
                quality: values.p_quality.value,
                status: values.p_status.value,
                specification: values.p_specno.value,
                location: values.p_location.value,
                originPrice: values.originprice.value,
                firstPrice: values.firstprice.value,
                curPrice: values.curprice.value,
                changePrice: values.price.value,
                assessOrg: values.assessorg.value,
                pledgeRate: values.pledgerate.value,
                maxPledge: values.maxpledge.value,
                totalPledge: values.totalpledge.value,
                restPledge: values.restpledge.value,
                dealer: values.dealer.value,
                interestStatus: values.guapropstatus.value,
                pledgePerson: values.pledgeperson.value,
                pledgepno: values.pledgepno.value,
                ts: values.ts.value,
                tenantid: values.tenantid.value
            };
        });
        this.setState({active: i});
    }

    /**
     * 货币格式输入校验
     * @param input 输入字符串
     * @return
     * true:通过且更新数字，关闭错误提示
     * false:输入不合法，不更新数字且提示（输入了字母等符号）
     */
    checkCoinInput = (input) => {            
        if(input == ""){
            return true;
        }

        //输入的字符是否是数值
        if(!isNaN(input) && input.charAt(0) != " " && input.charAt(input.length - 1) != " "){
            //统计小数点的个数
            let pointCount = 0;
            for(let i = 0; i < input.length; i++){
                if(input[i] == '.'){
                    pointCount++;
                }
            }
            //最多只能输入一个小数点
            if(pointCount < 1){
                return true;
            }else if(pointCount == 1){
                const decimal = input.split(".")[1];
                if(decimal.length <= 2){
                    return true;
                }
            }
        }
        return false;
    }

    renderCollapse = () => {
        return(
            <div className="collapse-area">{measurableMembers.map((item) => {
                return(               
                    <FormItem showMast={item.showMast}  inline={true} labelSm={3} labelMd={3} labelLg={3} sm={4} md={4} lg={4} labelName={item.labelName}  isRequire={true} errorMessage={item.errorMessage} method="blur" reg={item.reg} >
                        <FormControl name={item.key} value={this.state[item.key]} placeholder={item.placeholder} onChange={(e) => this.handleCollapse(item, e)} />
                    </FormItem>                                      
                )})}
            </div>
        );
    };

    renderReadCollapse = () => {
        return(
            <div className="collapse-area">{measurableMembers.map((item) => {
                return(               
                    <div name={item.key} className="collapse-read">
                    <Col md={2} xs={2} sm={2}>
                        <span className="fieldname">{item.labelName}</span>
                    </Col>
                    <Col md={2} xs={2} sm={2} style={{textAlign: 'left'}}>
                        <span name={item.key} className="itemname">{this.state[item.key]}</span>
                    </Col>                                       
                </div>                                     
                )})}
            </div>
        );
    };

    menu = (
        <Menu className="btn-hide-area" multiple onClick={(e) => console.log(e)}>
            <MenuItem key="change-record" className="hide-item">
                <Button className="btn-hide" onClick={(e) => console.log(e)}>变更记录</Button>
              </MenuItem>
        </Menu>
    );

    //新增、修改和变更态按钮
    editButtons = [<Button   className="btn btn-success"  onClick={this.save} >保存</Button>,
                    <Button  className="btn" onClick={this.cancel}>取消</Button>];

    //浏览态按钮
    browseButtons = [<Button  className="btn" onClick={this.edit}>修改</Button>,
                    <Button  className="btn" onClick={this.cancel}>删除</Button>,
                    <Button  className="btn" onClick={this.cancel}>变更</Button>,
                    <Dropdown
                        trigger={['hover']}
                        overlay={this.menu}
                        animation="slide-up">
                    <Button className="btn">更多
                        <span className='iconfont icon-icon-jiantouxia'></span>
                    </Button>
                </Dropdown>];

    render(){
        //根据卡片状态渲染不同的按钮
        const buttons = this.browseButtons;
        const content = 
        <div className="popover">
            <div>担保合同号:{this.state.contractno}</div>
            <div>担保日期:{this.state.guastartdate}</div>
            <div>担保金额:{this.state.guaamount}</div>
            <div>债权人:{this.state.creditorpa}</div>
            <div>债务人:{this.state.debtorpa}</div>
            <div>担保人:{this.state.guarantor}</div>
        </div>;

        //浏览态
        const data = [{key: "code", type: "read", showMast: true, labelName: "物权编号:", value: this.state.code, errorMessage: "请填写物权编号", placeholder: "请输入物权编号"},
            {key: "name", type: "read-pop", showMast: true, labelName: "物权名称:", value: this.state.name, errorMessage: "请填写物权名称", placeholder: "请输入物权名称", className: "iconfont icon-iPhoneCopy icon-style", onClick: this.handleSideslip},
            {key: "gpType", type: "read", showMast: true, labelName: "担保物权分类:", value: this.state.gpType ? typeMembers[this.state.gpType - 1].name : "", errorMessage: ""},
            {key: "owner", type: "read", showMast: true, labelName: "所有者属性:", value: this.state.owner ? ownerMembers[this.state.owner - 1].name : "", errorMessage: ""},
            {key: "partner", type: "read", showMast: true, labelName: "权属单位/合作伙伴:", value: this.state.partner.refname, errorMessage: "", placeholder: "请录入本单位名称"},
            {key: "currency", type: "read", showMast: true, labelName: " 币种:", value: this.state.currency.refname, errorMessage: ""},
            {key: "measurable", type: "read-row", showMast: false, labelName: "计量:", errorMessage: "", value: this.state.measurable ? "是" : "否", checked: this.state.measurable, hasCollapse: true, area: this.renderReadCollapse()},
            {key: "originPrice", type: "read", showMast: true, labelName: "原值/金额:", value: this.state.originPrice, errorMessage: "", placeholder: "原值/金额", color: '#E14C46'},
            {key: "firstPrice", type: "read", showMast: true, labelName: "最初评估价值:", value: this.state.firstPrice, errorMessage: "", placeholder: "最初评估价值"},
            {key: "curPrice", type: "read", showMast: true, labelName: "当前评估价值:", value: this.state.curPrice, errorMessage: "", placeholder: "当前评估价值"},
            {key: "changePrice", type: "read", showMast: false, labelName: "评估增值/减值:", errorMessage: "", value: (this.state.curPrice - this.state.firstPrice).formatMoney(2, "")},
            {key: "assessOrg", type: "read", showMast: false, labelName: "评估机构:", value: this.state.assessOrg, errorMessage: "", placeholder: "评估机构"},
            {key: "pledgeRate", type: "read", showMast: true, labelName: "质押/抵押率（%）:", value: this.state.pledgeRate, errorMessage: "", placeholder: "质押/抵押率"},
            {key: "maxPledge", type: "read", showMast: true, labelName: "可质押/抵押价值:", value: this.state.maxPledge, errorMessage: "", placeholder: "可质押/抵押价值", color: '#E14C46'},
            {key: "totalPledge", type: "read", showMast: true, labelName: "累计质押价值:", value: this.state.totalPledge, errorMessage: "", placeholder: "累计质押价值"},
            {key: "restPledge", type: "read", showMast: true, labelName: "剩余质押价值:", value: this.state.restPledge, errorMessage: "", placeholder: "剩余质押价值"},
            {key: "dealer", type: "read", showMast: false, labelName: "经办人员:", value: this.state.dealer, errorMessage: "", placeholder: "经办人员"},
            {key: "interestStatus", type: "read", showMast: true, labelName: "担保物权状态:", errorMessage: "", value: this.state.interestStatus ? interestStatusMembers[this.state.interestStatus - 1].name : ""},
            {key: "pledgePerson", type: "read", showMast: true, labelName: "质权人:", value: this.state.pledgePerson, errorMessage: "", placeholder: "质权人"},
            {key: "pledgepno", type: "read", showMast: false, labelName: "质押/抵押协议号:", value: this.state.pledgepno, errorMessage: "", placeholder: "质押/抵押协议号"}];
        //柱状图
        const chartData = [{name: "当前价值", value: this.state.curPrice}, {name: "实际可抵押价值", value: this.state.maxPledge}, 
                        {name: "累计质押价值", value: this.state.totalPledge}, {name: "剩余质押价值", value: this.state.restPledge}];    
        return(
            <div className="bd-wraps">
                <div className="bread-container">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">首页</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">融资交易</Breadcrumb.Item>
                        <Breadcrumb.Item active>担保物权</Breadcrumb.Item>
                    </Breadcrumb> 
                </div>
                <div className="card-container">
                    <div className="title-container">
                        <Row>
                            <Col md={12} xs={12} sm={12}>
                                <div className="title">{"担保物权"}</div>
                            </Col>
                            {/* <Col md={6} xs={6} sm={6}>
                                <div className="btn-area">
                                    {buttons}
                                </div>
                            </Col> */}
                        </Row>
                    </div>
                    <Col md={2} xs={2} sm={2} className="record-version">
                        <ul>
                            {this.state.verTable.map((item, i)=>{
                                return(
                                    <li 
                                        key={i} 
                                        className={this.state.active === i ? 'item-active':'record-item'} 
                                        onClick={() => this.handelSelRecord(item, i)}> 
                                        V {item.versionNo}
                                        <div className="date-text">变更日期:{item.ts}</div>
                                    </li>
                                )
                            })}
                        </ul>
                    </Col>
                    <Col md={10} xs={10} sm={10} style={{padding: 0}}>
                        <StateCard 
                            title={"担保物权"}
                            data={data}
                            onChange={this.handleChange}
                        />
                    </Col>     
                </div>
                <SideslipModal 
                    showModal={this.state.showSideslipModal}
                    title={"物权编号:" + this.state.code}
                    columns={modalColumns}
                    tableData={this.state.queryData}
                    chartData={chartData}
                    close={() => {this.setState({showSideslipModal: false})}}
                />
            </div>
        );
    }
}
