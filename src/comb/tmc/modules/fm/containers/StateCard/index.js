import React, { Component } from "react";
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
import Form from 'bee-form';
import FormControl from 'bee-form-control';
import Radio from 'bee-radio';
import Collapse from 'bee-collapse';
import Popover from 'bee-popover';
import Tabs, {TabPane} from 'bee-tabs';
import Alert from 'bee-alert';
import { Link } from "react-router";
import DatePicker from "bee-datepicker";
import Refer from 'containers/Refer';
import Switch from 'bee-switch';
import TmcUploader from '../../../../containers/TmcUploader';
import { CheckboxItem, RadioItem, TextAreaItem, ReferItem , SelectItem, InputItem, DateTimePickerItem, SwitchItem} from '../../../../containers/FormItems';
import "./index.less";

const FormItem = Form.FormItem;

const rootURL = window.reqURL.fm + "fm/";

export default class StateCard extends Component {

    static defaultProps = {
        data: [{showMast: true, labelName: "字段1", errorMessage: "错误信息", placeholder: "请输入字段1"},
                {showMast: true, labelName: "字段2", errorMessage: "错误信息", placeholder: "请输入字段2"}],
    }

    constructor(){
        super();
        this.state = {
            checkFormNow:false
        }
    }

    handClick=()=>{
        this.setState({
            checkFormNow:true
        });
    }

    render(){
        return(                   
                <div className="content-container">
                    <Form useRow={true} showSubmit={false} submitCallBack={(flag, obj)=>this.props.checkForm(flag, obj)} checkFormNow={this.props.checkFormNow}>
                    {this.props.data.map((item) => {
                        //字符型
                        if(item.type == "text"){
                            return(   
                                <FormItem showMast={item.showMast}  inline={true} labelSm={2} labelMd={2} labelLg={2} md={4} 
                                    labelName={item.labelName}  isRequire={item.isRequire} errorMessage={item.errorMessage} 
                                    method="blur" asyncCheck={item.asyncCheck} reg={item.reg} >
                                    <InputItem name={item.key} type='customer' 
                                        processChange={item.beforeChange ? (preState, value) => item.beforeChange(item, value, preState) : undefined}  
                                        placeholder={item.placeholder} 
                                        defaultValue={item.value} 
                                        value={item.value}
                                        onChange={(value) => this.props.onChange(item, value)} 
                                        />
                                </FormItem>                           
                            );
                        }else if(item.type == "radio"){
                            return(
                                <FormItem showMast={item.showMast}  inline={true} labelSm={2} labelMd={2} labelLg={2} md={4} 
                                    labelName={item.labelName}  isRequire={item.isRequire} errorMessage={item.errorMessage} 
                                    method="blur" reg={item.reg} asyncCheck={item.asyncCheck}>
                                    <Radio.RadioGroup
                                        name={item.name}
                                        type='customer'
                                        selectedValue={item.value}
                                        value={item.value}
                                        onChange={(e) => this.props.onChange(item, e)}>   
                                        {item.members.map((member) => {
                                            return(
                                                <Radio value={member.value} >{member.name}</Radio>  
                                            );                                          
                                        })}                                                                               
                                    </Radio.RadioGroup>  
                                </FormItem>
                            );                      
                        }else if(item.type == "ref"){
                            return(
                                <FormItem showMast={item.showMast} inline={true} labelSm={2} labelMd={2} labelLg={2} md={4} 
                                    labelName={item.labelName}  isRequire={item.isRequire} errorMessage={item.errorMessage} 
                                    method="blur" reg={item.reg} asyncCheck={item.asyncCheck}>    
                                    <Refer
                                        name={item.key}
                                        type='customer'
                                        refModelUrl={item.refModelUrl}
                                        refCode={item.refCode}
                                        ctx={item.ctx}
                                        value={item.value}
                                        onChange={(e) => this.props.onChange(item, e)}
                                        strFieldName={item.strFieldName}
                                        isMultiSelectedEnabled={item.isMultiSelectedEnabled}
                                        rootName={item.rootName}
                                        pk_val={item.pk_val}
                                        condition={item.condition}
                                        isReturnCode={item.isReturnCode}
                                        multiLevelMenuName={item.multiLevelMenuName}
                                        hotDataSize={item.hotDataSize}
                                        className="refer"
                                    />
                                </FormItem>
                                // <div name={item.key} className="collapse-row">
                                //     <Col md={2} xs={2} sm={2}>
                                //         <span className="collapse-fieldname">{item.labelName}</span>
                                //     </Col>
                                //     <Col md={4} xs={4} sm={4}>
                                //         <Refer
                                //             refModelUrl={item.refModelUrl}
                                //             refCode={item.refCode}
                                //             ctx={item.ctx}
                                //             value={item.value}
                                //             onChange={(e) => this.props.onChange(item, e)}
                                //             strFieldName={item.strFieldName}
                                //             isMultiSelectedEnabled={item.isMultiSelectedEnabled}
                                //             rootName={item.rootName}
                                //             pk_val={item.pk_val}
                                //             condition={item.condition}
                                //             isReturnCode={item.isReturnCode}
                                //             multiLevelMenuName={item.multiLevelMenuName}
                                //             hotDataSize={item.hotDataSize}
                                //             className="refer"
                                //         />
                                //     </Col>                                       
                                // </div>
                            );                           
                        }else if(item.type == "switch"){
                            if(item.hasCollapse){
                                return(
                                    <div className="collapse-row">
                                        <Col md={2} xs={2} sm={2}>
                                            <span className="collapse-fieldname">{item.labelName}</span>
                                        </Col>
                                        <Col md={10} xs={10} sm={10}>
                                            <Switch                      
                                                checked={item.checked}
                                                onChange={typeof item.onChange != "undefined" 
                                                        ? () => item.onChange(item) 
                                                        : () => this.props.onChange(item)}
                                                checkedChildren={'开'} 
                                                unCheckedChildren={'关'}
                                            />
                                        </Col>
                                        <Collapse in={item.checked} unmountOnExit={false}>
                                            <div className="collapse">
                                                {item.area}
                                            </div>
                                        </Collapse>
                                    </div>                            
                                );  
                            }else{
                                return(
                                    <FormItem showMast={item.showMast}  inline={true} labelSm={2} labelMd={2} labelLg={2} md={4} 
                                        labelName={item.labelName}  isRequire={item.isRequire} errorMessage={item.errorMessage} 
                                        method="blur" asyncCheck={item.asyncCheck}>
                                        <Switch      
                                            name={item.key}  
                                            type='customer'              
                                            checked={item.checked}
                                            onChange={typeof item.onChange != "undefined" 
                                                    ? () => item.onChange(item) 
                                                    : () => this.props.onChange(item)}
                                            checkedChildren={'开'} 
                                            unCheckedChildren={'关'}
                                        />
                                    </FormItem>
                                );
                            }                                                    
                        }else if(item.type == "read"){
                            return(     
                                <div name={item.key} className="collapse-row">
                                    <Col md={2} xs={2} sm={2}>
                                        <span className="collapse-fieldname">{item.labelName}</span>
                                    </Col>
                                    <Col md={4} xs={4} sm={4}>
                                        <span name={item.key} className="read" style={{color: item.color}}>{item.value}</span>
                                    </Col>                                       
                                </div>                              
                            );
                        }else if(item.type == "read-row"){
                            if(item.hasCollapse){
                                return(
                                    <div name={item.key} className="collapse-row">
                                        <Col md={2} xs={2} sm={2}>
                                            <span className="collapse-fieldname">{item.labelName}</span>
                                        </Col>
                                        <Col md={10} xs={10} sm={10}>
                                            <span className="read">{item.value}</span>
                                        </Col>
                                        <Collapse in={item.checked} unmountOnExit={true}>
                                            <div className="collapse">
                                                {item.area}
                                            </div>
                                        </Collapse>
                                    </div>                     
                                );  
                            }else{
                                return(
                                    <div name={item.key} className="collapse-row">
                                        <Col md={2} xs={2} sm={2}>
                                            <span className="collapse-fieldname">{item.labelName}</span>
                                        </Col>
                                        <Col md={10} xs={10} sm={10}>
                                            <span className="read">{item.value}</span>
                                        </Col>
                                    </div>   
                                );
                            }
                        }else if(item.type == "read-slide"){
                                return(
                                    <div name={item.key} className="collapse-row">
                                        <Col md={2} xs={2} sm={2}>
                                            <span className="collapse-fieldname">{item.labelName}</span>
                                        </Col>
                                        <Col md={4} xs={4} sm={4}>
                                            <span className="read">{item.value}</span>
                                            <Icon 
                                                className={item.className} 
                                                style={{color: item.iconColor, marginLeft: 15, fontSize: 18}} 
                                                onClick={item.onClick}/>                                           
                                        </Col>                                       
                                    </div>                     
                                );  
                        }else if(item.type == "read-pop"){
                            return(
                                <div name={item.key} type='customer' className="collapse-row">
                                    <Col md={2} xs={2} sm={2}>
                                        <span className="collapse-fieldname">{item.labelName}</span>
                                    </Col>
                                    <Col md={4} xs={4} sm={4}>
                                        <span className="read">{item.value}</span>
                                        <Popover
                                            //onMouseOver={item.onHover}
                                            placement="rightTop"
                                            content={item.content}
                                            trigger="hover"
                                            id="rightTop"
                                        >
                                            <Icon className={item.className} style={{color: item.iconColor, marginLeft: 15, fontSize: 18}} />
                                        </Popover>
                                    </Col>                                       
                                </div>                     
                            );  
                    }else if(item.type == "attach"){
                            return(
                                <FormItem showMast={item.showMast}  inline={true} labelSm={2} labelMd={2} labelLg={2} md={4} 
                                   labelName={item.labelName}  isRequire={item.isRequire} errorMessage={item.errorMessage} 
                                    method="blur" reg={item.reg} asyncCheck={item.asyncCheck}>
                                    <TmcUploader billID = 'code'/>
                                </FormItem>
                            );                
                        }
                    })}   
                    </Form>           
                </div>   
        );
    }
}
