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
import MsgModal from '../../../../../containers/MsgModal';
import Ajax from '../../../../../utils/ajax';
import SideslipModal from '../../../containers/SideslipModal';
import ApproveDetail from '../../../../../containers/ApproveDetail'
import ApproveDetailButton from '../../../../../containers/ApproveDetailButton'
import TmcUploader from '../../../../../containers/TmcUploader';
import "./index.less";
import {AccSub} from "../../../../../utils/utils.js";

const FormItem = Form.FormItem;
const typeMembers = [{value: 1, name: "抵押物权"}, {value: 2, name: "质押物权"}];
const ownerMembers = [{value: 1, name: "合作伙伴"}, {value: 2, name: "本单位"}, {value: 3, name: "集团内"}];
const interestStatusMembers = [{value: 1, name: "待押物权"}, {value: 2, name: "在押物权"}, {value: 3, name: "已解物权"}, {value: 4, name: "已停物权"}];
const measurableMembers = [{key: "number", type: "text", showMast: true, labelName: "数量:", errorMessage: "", placeholder: ""},
                    {key: "unit", type: "text", showMast: false, labelName: "单位:", errorMessage: "", placeholder: ""},
                    {key: "price", type: "text", showMast: true, labelName: "单价:", errorMessage: "", placeholder: ""},
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
                    partner: {id: "", refname: "", refpk: "0d4173e3-2961-4cfe-9958-f0ea5da053ac"},
                    currency: {id: "", refname: ""},
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
                    dataSource: "手工",               //物权来源
                    srcBillNo: "",
                    pledgePerson: "",
                    pledgepno: "",
                    billMaker: "",
                    billMakeDate: "",
                    attach: "",
                    ts: "",
                    tenantid: "",
                    vBillStatus: 0,
                    showModal: false,
                    checkFormNow: false,
                    check: false,
                    showDelete: false,
                    showSideslipModal: false,
                    showPrompt: false,
                    queryData: [],
                    pageStatus: "add"
                };

const rootURL = window.reqURL.fm + "fm/guaproperty/";
export default class InterestCard extends Component {

    static contextTypes = {  
        //this.context.router.push跳转必须
        router:React.PropTypes.object  
    }  

    constructor(props, context){
        super(props, context);
            this.state = defaultState;
            this.state.pageStatus = props.location.state ? props.location.state.pageState : "add";
    }

    componentWillMount(){
        const {type, id} = this.props.location.query;
        if(type == "detail"){
            //"detail" 浏览态
            this.query(id, "browse");
            return;
        }
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

    check = () => {
        this.setState({checkFormNow: true});
    }

    save = () => {
        const {id, code, name, gpType, owner, partner, currency, measurable, number, unit, price,
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
                                    value: gpType
                                },
                                owner: {
                                    value: owner
                                },
                                partnerid: {
                                    value: partner.id,
                                    display: partner.refname
                                },
                                currtypeid: {
                                    value: currency.id,
                                    display: currency.refname
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
                                p_status: {
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
        const url = rootURL + "query";
        const param = {id: id};
        this.request(url, param, (data, localParam) => {
            const values = data.head.rows[0].values;
            return {
                id: values.id.value,
                code: values.pledgeno.value,
                name: values.pledgename.value,
                gpType: values.gptype.value,            //担保物权分类
                owner: values.owner.value,                    //所有者属性
                partner: {id: values.partnerid.value, refname: values.partnerid.display, refpk: "0d4173e3-2961-4cfe-9958-f0ea5da053ac"},
                currency: {id: values.currtypeid.value, refname: values.currtypeid.display, refpk: "G001ZM0000DEFAULTCURRENCT00000000001"},
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
                dataSource: values.datasource.value,
                srcBillNo: values.srcbillno.value,
                pledgePerson: values.pledgeperson.value,
                pledgepno: values.pledgepno.value,
                billMaker: values.billmaker.value,
                billMakeDate: values.billmakedate.value,
                ts: values.ts.value,
                tenantid: values.tenantid.value,
                vBillStatus: values.vbillstatus.value,
                pageStatus
            };
         }, {})
    }

    edit = () => this.setState({pageStatus: "edit"});

    change = () => this.setState({pageStatus: "change"});

    delete = () => {
		let _this = this;
		const url = rootURL + 'save';
		const param = {
            data: {
                head: {
                    rows: [
                        {
                            values: {
                                               
                            }
                        }
                    ]
                }
            }
        };
		param.data.head.rows[0].values.status = {
			value: 3
		};
		param.data.head.rows[0].values.id = {
			value: this.state.id
        };
        param.data.head.rows[0].values.id = {
			value: this.state.id
        };
        param.data.head.rows[0].values.vbillstatus = {
			value: this.state.vBillStatus
		};
		param.data.head.rows[0].values.tenantid = {
			value: this.state.tenantid
		};
		param.data.head.rows[0].values.ts = {
			value: this.state.ts
		};
		this.request(url, param, (data, localParam) => {
			hashHistory.push(`/fm/securityinterest`)
		});
	}

    cancel = () => {
        hashHistory.push(`/fm/securityinterest`);
    }

    cancelDelete = () => {
        this.setState({showDelete: false});
    }

    showDeleteModal = () => {
        this.setState({showDelete: true});
    }

    handleModalConfirm = () => {
        this.setState(defaultState);
    }

    handleChange = (item, e) => {
		const key = item.key;
		const type = item.type;
		let data = this.state;
        if(type =="switch"){
            this.setState({
                [key] : !data[key]
            });
        }else{
            this.setState({
                [key] : e
            });
        }
    };

    beforeChange = (item, value, preState) => { 
        //货币输入校验
        if(!this.checkCoinInput(value)){
            //若不为货币格式，不改变状态，不更新到InputItem中
            const preValue = preState.value || ""
            return preValue; 
        }
        return value;
    }

    handleCollapse = (item, e)=> {
        const key = item.key;
        this.setState({
            [key] : e
        });
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

    handleChangeRecord = () => {
        const url = "/fm/interestchange";
        const info = {pageStatus: "browse", data: {id: this.state.id}};
        const path = {pathname: url, state: info};
        this.context.router.push(path);
    }

    handleApproval = () => {
        const {id, tenantid, ts, vBillStatus, code, name} = this.state;
        let url = vBillStatus == 0 ? rootURL + "commit" : rootURL + "uncommit";
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
                                }          
                            }
                        }
                    ]
                }
            }
        };
        param.data.head.rows[0].values.id = {
            value: id
        };
        param.data.head.rows[0].values.tenantid = {
            value: tenantid
        };
        param.data.head.rows[0].values.ts = {
            value: ts
        };
        param.data.head.rows[0].values.vbillstatus = {
            value: vBillStatus
        };
        this.request(url, param, (data) => {
            const {vbillstatus, ts} = data.head.rows[0].values;
            return {vBillStatus: vbillstatus.value, ts: ts.value};
        }, this);
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

    enumCheck = (e) => {
        return e.value > 0;
    }

    refCheck = (e) => {
        const value = e.value;
        return value.id && value.refname;
    }

    moneyCheck = (e) => {
        return /^[0-9]+([.]{1}[0-9]+){0,1}$/.test(e.value) && e.value > 0;
    }

    rateCheck = (e) => {
        return /^[0-9]+([.]{1}[0-9]+){0,1}$/.test(e.value) && e.value >= 0 && e.value <= 100;
    }
    
    checkForm = (flag, obj) => {
        console.log(flag);
        console.log(obj);
        //关闭校验以免持续校验造成不必要的保存
        this.setState({checkFormNow: false});
        if(flag){
            this.save();
        }
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

    renderUploadButton = () => {
        const id = this.state.id;
        return <TmcUploader billID = {id}/>
    }

    menu = (
        <Menu className="btn-hide-area" multiple onClick={(e) => console.log(e)}>
            <MenuItem key="change-record" className="hide-item">
                <Button className="btn-hide" onClick={this.handleChangeRecord}>变更记录</Button>
              </MenuItem>
        </Menu>
    );

    //新增、修改和变更态按钮
    renderEditButtons = () => {
        const id = this.state.id;
        return [<TmcUploader billID = {id}/>,
                <Button   className="btn btn-success"  onClick={this.check} >保存</Button>,
                <Button  className="btn" onClick={this.cancel}>取消</Button>];
    }

    //浏览态按钮, 审批状态为未提交，vbillcode == 0
    renderBrowseButtons = ()=> {
        const id = this.state.id;
        return [<TmcUploader billID = {id}/>, 
                <Button  className="btn" onClick={this.edit}>修改</Button>,
                <Button  className="btn" onClick={this.showDeleteModal}>删除</Button>,
                <Button  className="btn" onClick={this.handleApproval}>提交</Button>
                // <Button  className="btn" onClick={this.change}>变更</Button>,
                // <Dropdown
                //     trigger={['hover']}
                //     overlay={this.menu}
                //     animation="slide-up">
                //     <Button className="btn">更多
                //         <span className='iconfont icon-icon-jiantouxia'></span>
                //     </Button>
                // </Dropdown>
                ];
    }
    
    //已提交待待审批状态按钮，vbillcode == 3
    waitButtons = <Button  className="btn" onClick={this.handleApproval}>收回</Button>;

    //审批通过按钮，vbillcode == 1
    passButtons = [<Button  className="btn" onClick={this.change}>变更</Button>,
                    <Button  className="btn" onClick={this.handleChangeRecord}>变更记录</Button>];

    render(){
        let {code, name, gpType, owner, partner, currency, measurable, originPrice, firstPrice,
            curPrice, changePrice, assessOrg, pledgeRate, maxPledge, totalPledge, restPledge,
            dealer, interestStatus, dataSource, srcBillNo, pledgePerson, pledgepno, billMaker,
            billMakeDate, showPrompt} = this.state;
        let data = [];
        //卡片的状态是否是浏览态，这里分为浏览态和可编辑态（包括新增，修改，变更）
        const isBrowse = this.state.pageStatus == "browse";
        //根据卡片状态渲染不同的按钮
        let buttons;
        if(isBrowse){
            if(this.state.vBillStatus == 0){
                buttons = this.renderBrowseButtons();
            }else if(this.state.vBillStatus == 3){
                buttons = this.waitButtons;
            }else if(this.state.vBillStatus == 1){
                buttons = this.passButtons;
            }
        }else{
            buttons = this.renderEditButtons();
        }
        //根据卡片的不同状态切换字段显示类型
        if(isBrowse){
            try{
                //浏览态
                data = [{key: "code", type: "read", showMast: true, labelName: "物权编号:", value: code},
                    {key: "name", type: "read-slide", showMast: true, labelName: "物权名称:", value: name, className: "iconfont icon-iPhoneCopy icon-style", iconColor: '#FF7436', onClick: this.handleSideslip},
                    {key: "gpType", type: "read", showMast: true, labelName: "担保物权分类:", value: gpType ? typeMembers[gpType - 1].name : ""},
                    {key: "owner", type: "read", showMast: true, labelName: "所有者属性:", value: owner ? ownerMembers[owner - 1].name : ""},
                    {key: "partner", type: "read", showMast: true, labelName: "权属单位/合作伙伴:", value: partner.refname},
                    {key: "currency", type: "read", showMast: true, labelName: " 币种:", value: currency.refname},
                    {key: "measurable", type: "read-row", showMast: false, labelName: "计量:", value: measurable ? "是" : "否", checked: measurable, hasCollapse: true, area: this.renderReadCollapse()},
                    {key: "originPrice", type: "read", showMast: true, labelName: "原值/金额:", value: originPrice ? Number(originPrice).formatMoney(2, "") : originPrice, color: '#E14C46'},
                    {key: "firstPrice", type: "read", showMast: true, labelName: "最初评估价值:", value: Number(firstPrice).formatMoney(2, "")},
                    {key: "curPrice", type: "read", showMast: true, labelName: "当前评估价值:", value: Number(curPrice).formatMoney(2, "")},
                    {key: "changePrice", type: "read", showMast: false, labelName: "评估增值/减值:", errorMessage: "", value: AccSub(curPrice, firstPrice, 2).formatMoney(2, "")},
                    {key: "assessOrg", type: "read", showMast: false, labelName: "评估机构:", value: assessOrg},
                    {key: "pledgeRate", type: "read", showMast: true, labelName: "质押/抵押率（%）:", value: Number(pledgeRate).formatMoney(2, "")},
                    {key: "maxPledge", type: "read", showMast: true, labelName: "可质押/抵押价值:", value: Number(maxPledge).formatMoney(2, ""), color: '#E14C46'},
                    {key: "totalPledge", type: "read", showMast: true, labelName: "累计质押价值:", value: Number(totalPledge).formatMoney(2, "")},
                    {key: "restPledge", type: "read-pop", showMast: true, labelName: "剩余质押价值:", value: Number(restPledge).formatMoney(2, ""), className: "iconfont icon-wenti icon-style", iconColor: '#FF7436', content: "（可质押/抵押价值-累计质押价值）"}, 
                    {key: "dealer", type: "read", showMast: false, labelName: "经办人员:", value: dealer, errorMessage: "", placeholder: "经办人员"},
                    {key: "interestStatus", type: "read", showMast: true, labelName: "担保物权状态:", errorMessage: "", value: interestStatus ? interestStatusMembers[interestStatus - 1].name : ""},
                    {key: "dataSource", type: "read", showMast: true, labelName: "物权来源:", value: dataSource},
                    {key: "srcBillNo", type: "read", showMast: false, labelName: "来源单据编号:", value: srcBillNo},
                    {key: "pledgePerson", type: "read", showMast: true, labelName: "质权人:", value: pledgePerson, errorMessage: "", placeholder: "质权人"},
                    {key: "pledgepno", type: "read", showMast: false, labelName: "质押/抵押协议号:", value: pledgepno, errorMessage: "", placeholder: "质押/抵押协议号"},
                    {key: "billMaker", type: "read", showMast: false, labelName: "填制人:", value: billMaker},
                    {key: "billMakeDate", type: "read", showMast: false, labelName: "填制日期:", value: billMakeDate}];
            }catch (e) {
                console.log(e);
            }
        }else{
            try{
                const {measurable, price, number} = this.state;
                //计量关闭时，原值为编辑态，可编辑；
                //计量打开时，原值为浏览态，此时若单价和数量其一为空（刚打开未输入时），原值保持不变;
                //计量打开时，若单价和数量都有数，则原值等于二者乘积
                originPrice = measurable ? (price && number ? Number(price).accMul(number, 2).formatMoney(2, "") : Number(this.state.originPrice).formatMoney(2, "")) 
                                    : this.state.originPrice;
                firstPrice = firstPrice ? Number(firstPrice).toScale(2) : firstPrice;
                curPrice = curPrice ? Number(curPrice).toScale(2) : curPrice;
                changePrice = AccSub(curPrice, firstPrice, 2).formatMoney(2, "");
                pledgeRate = pledgeRate ? Number(pledgeRate).toScale(2) : pledgeRate;
                maxPledge = (Number(curPrice || 0).accMul(pledgeRate || 0, 2)/100);
                totalPledge = (Number(totalPledge) || 0.00);
                restPledge = AccSub(maxPledge, totalPledge, 2).formatMoney(2, "");
                maxPledge = maxPledge.formatMoney(2, "");
                //新增态和编辑态
                data = [{key: "code", type: "text", showMast: true, isRequire: true, labelName: "物权编号:", value: code, errorMessage: "请填写物权编号", placeholder: "请输入物权编号"},
                    {key: "name", type: "text", showMast: true, isRequire: true, labelName: "物权名称:", value: name, errorMessage: "请填写物权名称", placeholder: "请输入物权名称"},
                    {key: "gpType", type: "radio", showMast: true, isRequire: true, labelName: "担保物权分类:", value: gpType, errorMessage: "请选择担保物权分类", name: "gpType", members: typeMembers, asyncCheck: this.enumCheck},
                    {key: "owner", type: "radio", showMast: true, isRequire: true, labelName: "所有者属性:", value: owner, errorMessage: "请选择所有者属性", name: "owner", members: ownerMembers, asyncCheck: this.enumCheck},
                    {key: "partner", type: "ref", showMast: true, isRequire: true, labelName: " 权属单位/合作伙伴:", value: partner, errorMessage: "请输入权属单位", ctx: "/uitemplate_web", refModelUrl: "/bd/partnerRef/", refCode: "partnerRef", refName: "合作伙伴", strField: [{ name: '名称', code: 'refname' }], asyncCheck: this.refCheck},
                    {key: "currency", type: "ref", showMast: true, isRequire: true, labelName: "币种:", value: currency, errorMessage: "请输入币种", ctx: "/uitemplate_web", refModelUrl: "/bd/currencyRef/", refCode: "currencyRef", refName: "币种", strField: [{ name: '名称', code: 'refname' }], asyncCheck: this.refCheck},
                    {key: "measurable", type: "switch", showMast: false, isRequire: false, labelName: "计量:", errorMessage: "", checked: measurable, hasCollapse: true, area: this.renderCollapse()},
                    {key: "originPrice", type: measurable ? "read" : "text", showMast: true, isRequire: true, labelName: "原值/金额:", value: originPrice, errorMessage: "请输入原值/金额", placeholder: "原值/金额", beforeChange: this.beforeChange, color: '#E14C46', asyncCheck: this.moneyCheck},
                    {key: "firstPrice", type: "text", showMast: true, isRequire: true, labelName: "最初评估价值:", value: firstPrice, errorMessage: "请输入最初评估价值", placeholder: "最初评估价值", beforeChange: this.beforeChange, asyncCheck: this.moneyCheck, asyncCheck: this.moneyCheck},
                    {key: "curPrice", type: "text", showMast: true, isRequire: true, labelName: "当前评估价值:", value: curPrice, errorMessage: "请输入当前评估价值", placeholder: "当前评估价值", beforeChange: this.beforeChange, asyncCheck: this.moneyCheck},
                    {key: "changePrice", type: "read", showMast: false, isRequire: false, labelName: "评估增值/减值:", errorMessage: "", value: changePrice},
                    {key: "assessOrg", type: "text", showMast: false, isRequire: false, labelName: "评估机构:", value: assessOrg, errorMessage: "", placeholder: "评估机构"},
                    {key: "pledgeRate", type: "text", showMast: true, isRequire: true, labelName: "质押/抵押率（%）:", value: pledgeRate, errorMessage: "请输入0-100之间的数字", placeholder: "质押/抵押率", beforeChange: this.beforeChange, asyncCheck: this.rateCheck},
                    {key: "maxPledge", type: "read", showMast: true, isRequire: true, labelName: "可质押/抵押价值:", value: maxPledge, errorMessage: "请输入可质押/抵押价值", placeholder: "可质押/抵押价值", beforeChange: this.beforeChange},
                    {key: "totalPledge", type: "read", showMast: true, isRequire: true, labelName: "累计质押价值:", value: totalPledge, errorMessage: "请输入累计质押价值", placeholder: "累计质押价值", beforeChange: this.beforeChange},
                    {key: "restPledge", type: "read", showMast: false, isRequire: true, labelName: "剩余质押价值:", value: restPledge, errorMessage: "请输入剩余质押价值", placeholder: "剩余质押价值", beforeChange: this.beforeChange},
                    {key: "dealer", type: "text", showMast: false, isRequire: false, labelName: "经办人员:", value: dealer, errorMessage: "", placeholder: "经办人员"},
                    {key: "interestStatus", type: "read", showMast: true, isRequire: true, labelName: "担保物权状态:", errorMessage: "", value: interestStatus ? interestStatusMembers[interestStatus - 1].name : ""},
                    {key: "dataSource", type: "read", showMast: true, labelName: "物权来源:", value: dataSource},
                    {key: "srcBillNo", type: "read", showMast: false, labelName: "来源单据编号:", value: srcBillNo},
                    {key: "pledgePerson", type: "text", showMast: false, isRequire: false, labelName: "质权人:", value: pledgePerson, errorMessage: "", placeholder: "质权人"},
                    {key: "pledgepno", type: "text", showMast: false, isRequire: false, labelName: "质押/抵押协议号:", value: pledgepno, errorMessage: "", placeholder: "质押/抵押协议号"}];
                    this.state = {...this.state, originPrice, firstPrice, curPrice, changePrice: changePrice.replace(/,/g, ""), pledgeRate, maxPledge, totalPledge, restPledge: restPledge.replace(/,/g, ""), maxPledge: maxPledge.replace(/,/g, "")};
            }catch (e) {
                console.log(e);
            }
        }
        const date = this.state.ts ? new Date(this.state.ts) : new Date();
        const showDate = date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
        //柱状图
        const chartData = [{name: "当前价值", curPrice, color: ['rgba(58,164,210,1)', 'rgba(58,164,210,0.3)']}, 
                            {name: "实际可抵押价值", value: this.state.maxPledge, color: ['rgba(93,213,197,1)', 'rgba(93,213,197,0.3)']}, 
                            {name: "累计质押价值", totalPledge, color: ['rgba(237,122,117,1)', 'rgba(237,122,117,0.3)']}, 
                            {name: "剩余质押价值", restPledge, color: ['rgba(255,144,81,1)', 'rgba(255,144,81,0.3)']}];
        //审批流
        let processInstanceId = this.props.location.query.processInstanceId;   
        let businesskey = this.props.location.query.businesskey;
        let id = this.props.location.query.id;                 
        return(
            <div className="bd-wraps">
                <div className="bread-container">
                    <Breadcrumb>
                        <Breadcrumb.Item href="#">首页</Breadcrumb.Item>
                        <Breadcrumb.Item href="#">融资交易</Breadcrumb.Item>
                        <Breadcrumb.Item active>担保物权</Breadcrumb.Item>
                    </Breadcrumb> 
                </div>
                {processInstanceId && <ApproveDetail
                    processInstanceId={processInstanceId}//之前适配的
                    billid={id}//新加的
                    businesskey={businesskey}//新加的
                    refresh={() => this.query(id, "browse")}//这个是传入自己的页面中查单据数据的方法，有参数这样写
                />}
                <div className="card-container">
                    <div className="title-container">
                        <Row>
                            <Col md={6} xs={6} sm={6}>
                                <div className="title">{"担保物权"}</div>
                            </Col>
                            <Col md={6} xs={6} sm={6}>
                                <div className="btn-container">
                                    {buttons}
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <StateCard 
                        data={data}
                        onChange={this.handleChange}
                        checkForm={this.checkForm}
                        checkFormNow={this.state.checkFormNow}
                        //upload={this.save}
                        //icon ={this.props.icon}
                    />
                    <MsgModal 
                        show={this.state.showModal}
                        title={"保存成功"}
                        content={"物权编号:" + this.state.code + " 创建日期:" + showDate}
                        confirmText={"继续新增"}
                        cancelText={"关闭"} 
                        onCancel={this.cancel}
                        onConfirm={this.handleModalConfirm}
                        // closeButton={this.props.closeButton}
                        // icon ={this.props.icon}
                    />     
                    <MsgModal 
                        show={this.state.showDelete}
                        title={"删除操作"}
                        content={"确定要删除这条物权信息吗？"}
                        confirmText={"是"}
                        cancelText={"否"} 
                        onCancel={this.cancelDelete}
                        onConfirm={this.delete}
                    />
                    <SideslipModal 
                        showModal={this.state.showSideslipModal}
                        title={"物权编号:" + this.state.code}
                        columns={modalColumns}
                        tableData={this.state.queryData}
                        chartData={chartData}
                        close={() => {this.setState({showSideslipModal: false})}}
                    />
                </div>
            </div>
        );
    }
}
