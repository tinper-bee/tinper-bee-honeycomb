import { Con, Row, Col } from 'bee-layout';
import { Panel } from 'bee-panel';
import React, { Component } from 'react';
import Button from 'bee-button';
import Modal from 'bee-modal';
import Ajax from '../../../../utils/ajax';
import './index.less';
const rootURL = window.reqURL.fm + "fm/";
export default class Registerupload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            modalSize: "lg",
        };
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.changeSize = this.changeSize.bind(this);

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
    }

    changeSize(size) {
        this.setState({
            modalSize: size
        });
    }
    handlesubmit=()=>{
        let {cNName,idNo,regId,limitDate,corpName,legPerId,corpIdCardLimitDate,legalPhone,cfoName,telephone,
            capReg, regStrentDoor,account,docuOpName,docuOpMobile,productCode,
            docuOpIdCard,checkerName, checkerMobile,checkerIdCard,dynamicCode,regTePhone,depType}=this.props.data;
        let {custType}=this.props.data.custType;
        let {trdCode}=this.props.data.trdCode;
        let {medSmEntFlg}=this.props.data.medSmEntFlg;
        let {province}=this.props.data.province;
        let {city}=this.props.data.city;
        let {regDist}=this.props.data.regDist;
        let {acctBank}=this.props.data.acctBank;
        let {regType}=this.props.data.regType;
        Ajax({
            url:rootURL + 'interests/openusersubmit',
            mode: 'normal',
            data: {cNName,idNo,regId,limitDate,corpName,legPerId,corpIdCardLimitDate,legalPhone,cfoName,telephone,productCode,
                capReg, regStrentDoor,account,docuOpName,docuOpMobile,custType,trdCode,medSmEntFlg,province,city,regDist,acctBank,
                regType,docuOpIdCard,checkerName, checkerMobile,checkerIdCard,dynamicCode,regTePhone,depType},
            success:(res)=>{
                console.log(res)
                if (res.data.response_head.service_resp_code == '000000') {
                    console.log(11111)
                        Ajax({
                            url:rootURL + 'interests/uploadfile',
                            mode: 'normal',
                            data: this.props.createFormData,
                            success:(res)=>{
                                console.log(res)
                            }
                        })
                }
            }
        })
    }
    render() {
        let {cNName,idNo,regId,limitDate,corpName,legPerId,corpIdCardLimitDate,legalPhone,cfoName,telephone,
            capReg, regStrentDoor,account,docuOpName,docuOpMobile,
            docuOpIdCard,checkerName, checkerMobile,checkerIdCard,dynamicCode,regTePhone,depType}=this.props.data;
            let {custType,custTypename}=this.props.data.custType;
            let {trdCode,trdCodename}=this.props.data.trdCode;
            let {medSmEntFlg,medSmEntFlgname}=this.props.data.medSmEntFlg;
            let {province,provincename}=this.props.data.province;
            let {city,cityname}=this.props.data.city;
            let {regDist,regDistname}=this.props.data.regDist;
            let {acctBank,acctBankname}=this.props.data.acctBank;
            let {regType,regTypename}=this.props.data.regType;
        return (
            <div className="registerupload">
                <Modal
                    className='modalshow'
                    size={this.state.modalSize}
                    show={this.props.showModal}
                    size={this.state.modalSize}
                    onHide={this.props.onClose}
                    onclose={this.props.onClose}
                    data={this.props.data}
                >
                    <Modal.Header closeButton keyboard onClick={this.props.onclose}>
                        <Modal.Title className='modaltitle'> 确认信息内容 </Modal.Title>
                    </Modal.Header >
                    <Modal.Body className='modalbody'>
                        <div className='enterprise'>
                            <h2>企业基础信息</h2>
                            <ul className='everybody'>
                                <li className='every'>
                                    <span className='every1'>企业名称</span>
                                    <span className='every2' >{cNName}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1' >企业规模</span>
                                    <span className='every2' style={{borderRight:'none'}}>{medSmEntFlgname}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>所属行业</span>
                                    <span className='every2'>{trdCodename}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>客户类别</span>
                                    <span className='every2' style={{borderRight:'none'}}>{custTypename}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>注册地电话号码</span>
                                    <span className='every2'>{regTePhone}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>所在地</span>
                                    <span className='every2' style={{borderRight:'none'}}>
                                    {provincename} {cityname} {regDistname}
                                    </span>
                                </li>
                                <li className='every'>
                                    <span className='every1' style={{ 'border-bottom': 'none' }}>街道地址</span>
                                    <span className='every2' style={{ 'border-bottom': 'none' }}>{regStrentDoor}</span>
                                </li>
                            </ul>
                        </div>
                        <div className='enterprise'>
                            <h2>资质信息</h2>
                            <ul className='everybody1'>
                                <li className='every'>
                                    <span className='every1'>组织机构代码</span>
                                    <span className='every2' >{idNo}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1' >注册登记号</span>
                                    <span className='every2' style={{borderRight:'none'}} >{regId}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>注册期限</span>
                                    <span className='every2'>{limitDate}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>注册资本</span>
                                    <span className='every2' style={{borderRight:'none'}}>{capReg}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>法人姓名</span>
                                    <span className='every2'>{corpName}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>法人联系电话</span>
                                    <span className='every2' style={{borderRight:'none'}}>{legalPhone}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>法人证件号</span>
                                    <span className='every2' style={{borderRight:'none'}}>{legPerId}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>财务主管姓名</span>
                                    <span className='every2' style={{borderRight:'none'}}>{cfoName}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1' style={{ 'border-bottom': 'none' }}>法人证件到期日</span>
                                    <span className='every2' style={{ 'border-bottom': 'none' }}>{corpIdCardLimitDate}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1' style={{ 'border-bottom': 'none' }}>财务主管手机号</span>
                                    <span className='every2' style={{ 'border-bottom': 'none',borderRight:'none' }}>{telephone}</span>
                                </li>
                            </ul>
                        </div>
                        <div className='enterprise1'>
                        <h2>签约信息</h2>
                        <ul className='everybody2'>
                            <li className='every'>
                                    <span className='every1'>注册类型</span>
                                    <span className='every2'>{regTypename}</span>
                            </li>
                            <li className='every'>
                                <span className='every1'>绑定银行对公账号</span>
                                <span className='every2' style={{borderRight:'none'}}>{account}</span>
                            </li>
                            <li className='every'>
                                <span className='every1' style={{'borderRight':'1px solid E3E7ED'}}>存款人类别</span>
                                <span className='every3'>{depType}</span>
                            </li>
                            <li className='every'>
                                <span className='every1' style={{borderRight:'1px solid E3E7ED'}}>绑定卡清算行</span>
                                <span className='every2' style={{ borderRight:'none' }}>{acctBank}</span>
                            </li>
                        </ul>
                    </div>
                        <div className='enterprise'>
                            <h2>账号信息</h2>
                            <ul className='everybody'>
                                <li className='every'>
                                    <span className='every1'>制单员姓名</span>
                                    <span className='every2' >{docuOpName}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1' >制单员手机号</span>
                                    <span className='every2'style={{borderRight:'none'}} >{docuOpMobile}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>制单员邮箱</span>
                                    <span className='every2'>{}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>制单员证件号</span>
                                    <span className='every2' style={{borderRight:'none'}}>{docuOpIdCard}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>复核员姓名</span>
                                    <span className='every2'>{checkerName}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1'>复核员手机号</span>
                                    <span className='every2' style={{borderRight:'none'}}>{checkerMobile}</span>
                                </li>
                                <li className='every'>
                                    <span className='every1' style={{ 'border-bottom': 'none' }}>复核员邮箱</span>
                                    <span className='every2' style={{ 'border-bottom': 'none' }}></span>
                                </li>
                                <li className='every'>
                                    <span className='every1' style={{ 'border-bottom': 'none' }}>复核员证件号</span>
                                    <span className='every2' style={{ 'border-bottom': 'none',borderRight:'none' }}>{checkerIdCard}</span>
                                </li>
                        </ul>
                </div>
                    </Modal.Body>
                    <Modal.Footer className='modalbtn'>
                        <span  className='modalupload'><Button onClick={this.handlesubmit}> 确认提交 </Button></span>
                        <span className='modalclose'><Button onClick={this.props.onClose}> 返回修改 </Button></span>
                       
                    </Modal.Footer>
                    <div className='bottomword'>
                        *您提供的所有信息将全部成为您在资金云及其关联公司账户信息的一部分。
                    </div>
                </Modal>
            </div>
        )
    }
}