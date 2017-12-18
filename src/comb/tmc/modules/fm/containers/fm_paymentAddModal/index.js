import React, { Component } from 'react';
import { 
    Modal,
    Row, 
    Col,
    Button,
    Label,
    Icon,
    Select,
 } from 'tinper-bee';
import  Form from 'bee-form';
import 'bee-form/build/Form.css';
import { RadioItem} from 'containers/FormItems';
import './index.less';
import FormControl from 'bee-form-control';
import { toast } from '../../../../utils/utils.js';
import Refer from '../../../../containers/Refer/index.js';
// import {SelectItem} from 'containers/FormItems';
const { FormItem } = Form;
const Option = Select.Option;
export default class PaymentAddModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
           editData:{},//父组件往子组件传递的需要修改的值
           tranid:{},
           sourceid:{
               "display":null,
               scale:-1,
               value:'担保合同'
           },
           expensetypeid:{},
           traneventid:null,
           peerunittype:'1',
           payaccountid:{},
           peerpayunitid:{},
           peerpayaccountid:{},
           paymny:null,
           gathaccountid:{},
           peergathunitid:{},
           peergathaccountid:{},
           gathmny:null,
           transtatus:0,
           paymenttype:null,//费用分摊类型
           separatetypeNoEdit:this.props.separatetypeNoEdit,
           queryType:this.props.queryType,
           orgid:'',
           currtypeid:'',
        };
    }
    componentWillMount () {
    }
    componentWillReceiveProps (nextProps) {
        let paymenttype = nextProps.paymenttype.value;
        let separatetypeNoEdit = nextProps.separatetypeNoEdit;
        let orgid = nextProps.orgid.value;
        let currtypeid = nextProps.currtypeid.value;
        this.setState({
            paymenttype:paymenttype,
            separatetypeNoEdit:separatetypeNoEdit,
            orgid:orgid,
            currtypeid:currtypeid,
        })
        if(nextProps.type === 'edit'){
            let value = nextProps.editData.values;
            this.setState({
                editData:nextProps.editData,
                tranid:value.tranid,
                sourceid:value.sourceid,
                traneventid:value.traneventid.value,
                expensetypeid:value.expensetypeid,
                peerunittype:value.peerunittype.value,
                transtatus:value.transtatus.value,
            })
            if(paymenttype === 1){
                this.setState({
                    payaccountid:value.payaccountid,
                    peergathunitid:value.peergathunitid,
                    peergathaccountid:value.peergathaccountid,
                    paymny:value.paymny.value,
                })
            }else{
                this.setState({
                    peerpayunitid:value.peerpayunitid,
                    peerpayaccountid:value.peerpayaccountid,
                    gathaccountid:value.gathaccountid,
                    gathmny:value.gathmny.value,
                })
            }
        }else{
            this.setState({
                editData:{},
                tranid:{},
                sourceid:{
                    "display":null,
                    "scale":-1,
                    "value":'担保合同'
                },
                expensetypeid:{},
                peerunittype:'1',
                payaccountid:{},
                peerpayunitid:{},
                peerpayaccountid:{},
                paymny:null,
                gathaccountid:{},
                peergathunitid:{},
                peergathaccountid:{},
                gathmny:null,
                transtatus:'待结算'
            })
        }
    }
    //  来源交易类型选择 担保合同1  贷款合同2
    handleSelectChange = (e) => {
        if(this.state.tranid){
            this.setState({
                tranid:{}
            })
        }
        this.setState({
            sourceid:{
                "display":null,
                scale:-1,
                value:e
            }
        })
    }
    // 保存按钮
    paymentAdd = () => {
        
        let {
            paymenttype,
            tranid,
            sourceid,
            expensetypeid,
            traneventid,
            peerunittype,
            payaccountid,
            peerpayunitid,
            peerpayaccountid,
            paymny,
            gathaccountid,
            peergathunitid,
            peergathaccountid,
            gathmny,
        } = this.state;
        if(!tranid.value){
            toast({content: '来源交易编号不能为空', color: 'danger'});
            return;
        }else if(!expensetypeid.value){
            toast({content: '费用交易类型不能为空', color: 'danger'});
            return;
        }
        if(paymenttype === 1){
            if(!payaccountid.value){
                toast({content: '付费账户不能为空', color: 'danger'});
                return;
            }else if(!peergathunitid.value){
                toast({content: '对方收款单位不能为空', color: 'danger'});
                return;
            }else if(!peergathaccountid.value){
                toast({content: '对方收款账户不能为空', color: 'danger'});
                return;
            }else if(!paymny){
                toast({content: '付费金额不能为空', color: 'danger'});
                return;
            }
        }else{
            if(!gathaccountid.value){
               toast({content: '收费账户不能为空', color: 'danger'});
               return;
            }else if(!peerpayunitid.value){
                toast({content: '对方付款单位不能为空', color: 'danger'});
                return;
            }else if(!peerpayaccountid.value){
                toast({content: '对方付款账户不能为空', color: 'danger'});
                return;
            }else if(!gathmny){
                toast({content: '收费金额不能为空', color: 'danger'});
                return;
            }
        }
        let type = this.props.type;
        let obj;
        if(type === 'add'){
            if(paymenttype === 1){
                obj = {
                    tranid:tranid,
                    sourceid:sourceid,
                    expensetypeid:expensetypeid,
                    traneventid:'1',
                    peerunittype:peerunittype,
                    payaccountid:payaccountid,
                    peergathunitid:peergathunitid,
                    peergathaccountid:peergathaccountid,
                    paymny:paymny,
                    transtatus:0,
                }
            }else{
                obj = {
                    tranid:tranid,
                    sourceid:sourceid,
                    expensetypeid:expensetypeid,
                    traneventid:'0',
                    peerunittype:peerunittype,
                    gathaccountid:gathaccountid,
                    peerpayunitid:peerpayunitid,
                    peerpayaccountid:peerpayaccountid,
                    gathmny:gathmny,
                    transtatus:0,               
                }
            }
            this.props.paymentObj(obj);
        }else{
            obj = this.state.editData;
            if(paymenttype === 1){
                obj.values.tranid = tranid;
                obj.values.sourceid = sourceid;
                obj.values.expensetypeid = expensetypeid;
                obj.values.traneventid.value = '1';
                obj.values.peerunittype.value = peerunittype;
                obj.values.payaccountid = payaccountid;
                obj.values.peergathunitid = peergathunitid;
                obj.values.peergathaccountid = peergathaccountid;
                obj.values.paymny.value = paymny;
            }else{
                obj.values.tranid = tranid;
                obj.values.sourceid = sourceid;
                obj.values.expensetypeid = expensetypeid;
                obj.values.traneventid.value = '0';
                obj.values.peerunittype.value = peerunittype;
                obj.values.gathaccountid = gathaccountid;
                obj.values.peerpayunitid = peerpayunitid;
                obj.values.peerpayaccountid = peerpayaccountid;
                obj.values.gathmny.value = gathmny; 
            }
            this.props.paymentObj(obj);
        }
        this.props.paymentAdd();
        this.setState({
            expensetypeid:{},
        })
    }
    render() {
        let {type} = this.props;
        let {
            editData,
            paymenttype,
            peerunittype,
            expensetypeid,
            payaccountid,
            peergathunitid,
            peergathaccountid,
            gathaccountid,
            peerpayunitid,
            peerpayaccountid,
            sourceid,
            tranid,
            transtatus,
            queryType,
            separatetypeNoEdit,
        } = this.state;
        return(
            <Modal 
            show={this.props.showModal}
            type={this.props.type}
            editData={this.props.editData}
            // paymenttype={this.props.paymenttype}
            size='lg'
            backdrop={false}
            className='paymentAddModal'
            >
            <Modal.Header style={{padding:'0'}}>
                <div className='bd-header'>
                    <div className="bd-title-1">{type==='add'?'新增':'编辑'}</div>
                    <span style={{ cursor: 'pointer',color:'#666666',display:'inline-block',float:'right',marginRight:'20px'}} onClick={this.props.paymentCancle}>
                        <Icon className='iconfont icon-xiangyou'/>
                    </span>
                    <span className='paymentAddSpan'>
                        <Button
                            className="btn-2"
                            colors="primary"
                            type="ghost"
                            onClick={this.paymentAdd}
                        >
                            保存
                        </Button>
                        <Button 
                            className="btn-2 btn-cancel" 
                            shape="border" 
                            bordered
                            onClick={this.props.paymentCancle}
                        >
                            取消
                        </Button>
                    </span>
                </div>                   
            </Modal.Header>
            <Modal.Body>
                <div className='businessForm'>
                <Form horizontal  showSubmit={false} useRow={true}>
                    <Col md={12} xs={12} sm={12}>
                        <FormItem method='blur' inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4}  
                        labelName="来源交易类型:">
                            <Select name="sourceid"  defaultValue={sourceid.value} style={{ width: 120}}
                            onChange={this.handleSelectChange.bind(this)} dropdownStyle={{ zIndex: 10000 }}
                            disabled={separatetypeNoEdit}
                            >
                                <Option value="担保合同">担保合同</Option>
                                <Option value="贷款合同">贷款合同</Option>
                            </Select>
                        </FormItem>
                    </Col>
                    <Col md={6} xs={6} sm={6}>
                        <FormItem method='blur' inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={10} md={10} sm={10} 
                        labelName="来源交易编号:">
                            {
                                sourceid.value === '担保合同'?
                                <Refer
                                    ctx={'/uitemplate_web'}
                                    refModelUrl={'/fm/guacontractRef/'}
                                    refCode={'guacontractRef'}
                                    refName={'来源交易编号'}
                                    value={{
                                        refpk: tranid.value,
                                        refname: tranid.display,
                                    }}
                                    onChange={value => {
                                        this.setState({
                                            tranid: {
                                                display:value.ractno,
                                                scale:-1,
                                                value:value.id
                                            }
                                        });
                                    }}
                                    multiLevelMenu={[
                                        {
                                            name: ['担保合同'],
                                            code: ['ractno']
                                        }
                                    ]}
                                    referFilter={{ 
                                        contracttype:1, //1担保合同 2贷款合同
                                    }}
                                    placeholder='请选择担保合同'
                                    disabled={separatetypeNoEdit}
                                />
                                :
                                <Refer
                                    ctx={'/uitemplate_web'}
                                    refModelUrl={'/fm/contractref/'}
                                    refCode={'contractcode'}
                                    refName={'来源交易编号'}
                                    value={{
                                        refpk: tranid.value,
                                        refname: tranid.display,
                                    }}
                                    onChange={value => {
                                        this.setState({
                                            tranid: {
                                                display:value.refname,
                                                scale:-1,
                                                value:value.id
                                            }
                                        });
                                    }}
                                    placeholder='请选择贷款合同'
                                    disabled={separatetypeNoEdit}
                                />
                            }
                        </FormItem>
                    </Col>
                    <Col md={6} xs={6} sm={6}>
                        <FormItem  method='blur' inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
                            labelName="费用交易类型:">
                            <Refer
                                ctx={'/uitemplate_web'}
                                refModelUrl={'/bd/transtypeRef/'}
                                refCode={'transtypeRef'}
                                refName={'费用交易类型'}
                                strField={[{ name: '名称', code: 'refname' }]}
                                placeholder="请选择费用交易类型" 
                                value={{
                                    refpk: expensetypeid.value,
                                    refname: expensetypeid.display,
                                }}
                                onChange={value => {
                                    this.setState({
                                        expensetypeid:{
                                            display:value.refname,
                                            scale:-1,
                                            value:value.id
                                        }
                                    });
                                }}
                                clientParam={{
                                    detailcategory: '2',
                                    maincategory: 3 //1234对应投资品种、融资品种、费用项目、银行交易项目
                                }}  
                                disabled={separatetypeNoEdit}
                            />
                        </FormItem>
                    </Col>
                    <Col md={5} xs={5} sm={5} style={{marginLeft:'28px'}}>
                        <Label>交易事件:</Label>
                        <span style={{marginLeft:'20px'}} className='traneventid'>{paymenttype === 1?'付款':'收款'}</span>
                    </Col>
                    <Col md={5} xs={5} sm={5} style={{marginLeft:'40px'}}>
                        <FormItem inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={10} md={10} sm={10} 
                        labelName="对方单位类型:">
                            <RadioItem 
                                name="peerunittype"
                                disabled={separatetypeNoEdit}
                                defaultValue={editData.values?editData.values.peerunittype.value:'1'}
                                onChange={e =>
                                    {
                                        if(peergathunitid){
                                            this.setState({
                                                peergathunitid:{}
                                            })
                                        }
                                        if(peerpayunitid){
                                            this.setState({
                                                peerpayunitid:{}
                                            })
                                        }
                                        this.setState({peerunittype:e })
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
                    {paymenttype === 1 ?
                        <div>
                            <Col md={5} xs={5} sm={5} style={{marginLeft:'28px'}}>
                                <FormItem method='blur' inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
                                    labelName="付费账户:">    
                                    <Refer
                                        refModelUrl={'/bd/bankaccbasRef/'}
                                        refCode={'bankaccbasRef'}
                                        refName={'费用账户'}
                                        ctx={'/uitemplate_web'}
                                        strField={[{ name: '名称', code: 'refname' }]}
                                        value={{
                                            refpk: payaccountid.value,
                                            refname:payaccountid.display
                                        }}
                                        referFilter={{ 
                                            accounttype:0, //01234对应活期、定期、通知、保证金、理财
                                            currtypeid:this.state.currtypeid, //币种pk
                                            orgid: this.state.orgid//组织pk
                                        }}
                                        onChange={value => this.setState({
                                            payaccountid:{
                                                display:value.refname,
                                                scale:-1,
                                                value:value.id
                                            }
                                        })} 
                                        placeholder='请选择付费账户'
                                        disabled={separatetypeNoEdit}
                                    /> 
                                </FormItem>
                            </Col>
                            <Col md={5} xs={5} sm={5} style={{marginLeft:'38px'}}>
                                <FormItem method='blur' inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
                                    labelName="对方收款单位:">
                                    {peerunittype === '1'?
                                        <Refer
                                            refModelUrl={'/bd/finbranchRef/'}
                                            refCode={'finbranchRef'}
                                            refName={'金融网点'}
                                            ctx={'/uitemplate_web'}
                                            strField={[{ name: '名称', code: 'refname' }]}
                                            value={{
                                                refpk: peergathunitid.value,
                                                refname: peergathunitid.display
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
                                            value={{
                                                refpk: peergathunitid.value,
                                                refname: peergathunitid.display
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
                            <Col md={5} xs={5} sm={5} style={{marginLeft:'2px'}}>
                                <FormItem method='blur' inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
                                    labelName="对方收款账户:">
                                    <Refer
                                        ctx={'/uitemplate_web'}
                                        refModelUrl={'/bd/bankaccbasRef/'}
                                        refCode={'bankaccbasRef'}
                                        refName={'银行账户'}
                                        strField={[{ name: '名称', code: 'refname' }]}
                                        placeholder='请选择对方收款账户'
                                        value={{
                                            refpk: peergathaccountid.value,
                                            refname: peergathaccountid.display
                                        }}
                                        onChange={value => {
                                            this.setState({
                                                peergathaccountid:{
                                                    display:value.refname,
                                                    scale:-1,
                                                    value:value.id
                                                }
                                            });
                                        }}
                                        disabled={separatetypeNoEdit}
                                    />
                                </FormItem>
                            </Col>
                            <Col md={5} xs={5} sm={5} style={{marginLeft:'90px'}}>
                                <FormItem method='change' inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
                                    labelName="付费金额:" isRequire={true} errorMessage="付费金额格式错误" reg={/^[1-9]\d*(\.\d+)?$/}>
                                    <FormControl  
                                        name="paymny" 
                                        style={{width:'240px'}}
                                        placeholder="请输入付费金额" 
                                        onBlur={e => this.setState({
                                            paymny:e === ''?e:parseInt(e).toFixed(2)
                                        })}
                                        value={editData.values?parseInt(editData.values.paymny.value).toFixed(2):''}
                                        disabled={separatetypeNoEdit}
                                    />
                                </FormItem>
                            </Col>
                        </div>
                    :
                        <div>
                            <Col md={5} xs={5} sm={5} style={{marginLeft:'28px'}}>
                                <FormItem method='blur' inline={ true}  labelXs={2}  labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
                                labelName="收费账户:">
                                    <Refer
                                        refModelUrl={'/bd/bankaccbasRef/'}
                                        refCode={'bankaccbasRef'}
                                        refName={'费用账户'}
                                        ctx={'/uitemplate_web'}
                                        strField={[{ name: '名称', code: 'refname' }]}
                                        value={{
                                            refpk: gathaccountid.value,
                                            refname: gathaccountid.display
                                        }}
                                        referFilter={{ 
                                            accounttype:0, //01234对应活期、定期、通知、保证金、理财
                                            currtypeid: '', //币种pk
                                            orgid: ''//组织pk
                                        }}
                                        onChange={value => this.setState({
                                            gathaccountid:{
                                                display:value.refname,
                                                scale:-1,
                                                value:value.id
                                            }
                                        })} 
                                        placeholder='请选择收费账户'
                                        disabled={separatetypeNoEdit}
                                    />
                                </FormItem>
                            </Col>
                            <Col md={5} xs={5} sm={5} style={{marginLeft:'38px'}}>
                                <FormItem method='blur' inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
                                    labelName="对方付款单位:"> 
                                    {peerunittype === '1'?
                                        <Refer
                                            refModelUrl={'/bd/finbranchRef/'}
                                            refCode={'finbranchRef'}
                                            refName={'金融网点'}
                                            ctx={'/uitemplate_web'}
                                            strField={[{ name: '名称', code: 'refname' }]}
                                            value={{
                                                refpk: peerpayunitid.value,
                                                refname: peerpayunitid.display
                                            }}
                                            onChange={value => this.setState({
                                                peerpayunitid:{
                                                    display:value.refname,
                                                    scale:-1,
                                                    value:value.id
                                                }
                                            })} 
                                            multiLevelMenu={[
                                                {
                                                    name: '金融机构',
                                                    code: 'refname',
                                                    width: '100%'
                                                },
                                                {
                                                    name: '金融网点',
                                                    code: 'refname',
                                                    width: '200%'
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
                                            value={{
                                                refpk: peerpayunitid.value,
                                                refname: peerpayunitid.display
                                            }}
                                            onChange={value => this.setState({
                                                peerpayunitid:{
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
                            <Col md={5} xs={5} sm={5} style={{marginLeft:'2px'}}>
                                <FormItem method='blur' inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
                                    labelName="对方付款账户:">    
                                    <Refer
                                        ctx={'/uitemplate_web'}
                                        refModelUrl={'/bd/bankaccbasRef/'}
                                        refCode={'bankaccbasRef'}
                                        refName={'银行账户'}
                                        strField={[{ name: '名称', code: 'refname' }]}
                                        placeholder='请选择对方付款账户'
                                        value={{
                                            refpk: peerpayaccountid.value,
                                            refname: peerpayaccountid.display
                                        }}
                                        onChange={value => {
                                            this.setState({
                                                peerpayaccountid:{
                                                    display:value.refname,
                                                    scale:-1,
                                                    value:value.id
                                                }
                                            });
                                        }}
                                        disabled={separatetypeNoEdit}
                                    />
                                </FormItem>
                            </Col>
                            <Col md={5} xs={5} sm={5} style={{marginLeft:'90px'}}>
                                <FormItem method='change' inline={ true } labelXs={2} labelSm={2} labelMd={2} xs={4} md={4} sm={4} 
                                    labelName="收费金额:" isRequire={true} errorMessage="收费金额格式错误" reg={/^[1-9]\d*(\.\d+)?$/}>
                                    <FormControl  
                                        name="gathmny" 
                                        style={{width:'240px'}}
                                        placeholder="请输入收费金额"  
                                        onBlur={e => this.setState({
                                            gathmny:e === ''?e:parseInt(e).toFixed(2)
                                        })}
                                        value={editData.values?parseInt(editData.values.gathmny.value).toFixed(2):''}
                                        disabled={separatetypeNoEdit}
                                    />
                                </FormItem>
                            </Col>
                        </div>
                    }
                    <Col md={5} xs={5} sm={5} style={{marginLeft:'28px'}}>
                        <Label>结算状态:</Label>
                        <span style={{marginLeft:'20px'}} className='transtatus'>{queryType === 'add'?'待结算':(type ==='add'?'待结算':(transtatus?(transtatus === 0 ?'待结算':(transtatus === 1 ?'结算中':(transtatus === 2 ? '结算成功':(transtatus === 3 ?'结算失败':'部分结算成功')))):''))}</span>
                    </Col>
                </Form>
            </div>
            </Modal.Body>
            </Modal>
        )
    }
}