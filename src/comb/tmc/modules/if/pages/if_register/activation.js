import React, { Component } from "react";
import './index.less'
import RegisterT from './registerT';
import Formregister from '../../containers/form_register/index';
import Formactivation from '../../containers/form_activation/index';
import modalForm from '../../containers/modalForm/index';
import Ajax from '../../../../utils/ajax';
import { Link } from 'react-router';
import { Panel } from 'bee-panel';
import {
    Row,
    Col,
    Con,
    FormControl,
    FormGroup,
    Button,
    Form,
    Modal,
} from 'tinper-bee';
const rootURL = window.reqURL.fm + "fm/";
export default class Activation extends Component {
    constructor() {
        super();
        this.state = {
            accounts: '',
            accountname: '',
            accountsmoney: "",
            customertype: '',
            money: '',
            // 模态框
            showModal: false,
            modalDropup: true
        }
        this.close = this.close.bind(this);
        this.open = this.open.bind(this);
        this.changeDropup = this.changeDropup.bind(this);
    };
    componentDidmount(){
        Ajax({
            url: 'tmc-web-fm/fm/transferacc/transfer',
            data,
			success: function(res) {
				const { data, success, message } = res;
                if (success) {
                    console.log(res);
                             
                } else {
                    _this.setState({showAlert: true, message: message});
                }
			},
			error: function(res) {
				_this.setState({showAlert: true, message: res.message});
                console.log(res.message);
			}
        });
    }
    //  模态框 start
    close() {
        this.setState({
            showModal: false,
            customertype: '',
        });
    }
    open() {
        this.setState({
            showModal: true
        });
    }
    changeDropup(state) {
        this.setState({
            modalDropup: state
        });
    }
    editDone = () => {

    }
    //点击激活
    handleactive = () => {
        Ajax({
            url:rootURL+'/interests/activatesubmit',
            data
        })
        // axios.post('/',{})
        // .then(function(res){
        //     console.log(res);

        // })
        // .catch(function(res){
        //     console.log(res);
        // })
    }
    // 模态框end   
    //  转入ajax    
    handleajax=()=>{
        Ajax({
            url: rootURL+'transferacc/transfer',
            data:{
                custcode:this.props.location.state.custcode,
                money:this.props.location.state.amount,
                payaccname:this.props.location.state.acctbank,
                recaccnumid: this.props.location.state.eacctno, 
                recaccname:this.props.location.state.eacctname, 
                payaccnumid: this.props.location.state.account,
            },
            success:(res)=>{
                console.log(res)
            }

		});
    }
    render() {
        
        return (
            <div>
                <Formregister stepcurrent={2} />

                <div id='activation'>
                    <div className='passwo'>
                        <span className='icon'></span>
                        <span className='icont'>企业基础信息</span>
                    </div>
                    <Row className='activationbox'>
                        <Col>
                            <div className='accounts'>
                                <span className='spanfonta'>对公账号：</span>
                                <span className='spanfontb'>{this.props.location.state.acctbank}</span>
                            </div>
                            <div className='accounts'>
                                <span className='spanfonta'>账号名称 : </span>
                                <span className='spanfontb'>{this.props.location.state.eacctname}</span>
                            </div>
                            <div className='accounts'>
                                <span className='spanfonta'>最终打款期限 ： </span>
                                <span className='spanfontb'>{this.props.location.state.actideadline}</span>
                            </div>
                            <div className='accounts'>
                                <span className='spanfonta'>打款金额 :</span>
                                <span className='spanfontc'>

                                {this.props.location.state.amount?this.props.location.state.amount:0}
                                元</span>
                            </div>
                            <Col className=''>
                                <Button
                                    colors="primary"
                                    className='accounts linear'
                                    onClick={() => { this.changeDropup("static"); this.open(); }}
                                >
                                    转入
                            </Button>
                            </Col>
                        </Col>
                        <Col  className='accounts accountse'>
                            <div>请为电子账户打款激活，完成打款后，请点击下方激活按钮，完成激活。</div>
                        </Col>

                    </Row>
                    <Row>
                        {
                            this.props.location.state.accstatus=='4' &&
                            <Formactivation stepcurrent={3}/>
                        }
                    </Row>
                    <Row className='accountf'>
                        <Col  className='trant accounts'>
                            <Button onClick='handleactive'>激活</Button>
                        </Col>
                    </Row>
                    <Modal
                        show={this.state.showModal}
                        backdrop={this.state.modalDropup}
                        onHide={this.close}
                        className='modal-style'>
                        <Modal.Header closeButton>
                            <Modal.Title> 转入金额 </Modal.Title>
                        </Modal.Header >
                        <Modal.Body>
                            <div>
                                <div className='modal-label'>{}</div>
                            </div>
                            <div>
                              
                            </div>
                            <FormGroup>
                                <span className='modal-label'>对公账号：</span>
                                <FormControl
                                    type='text' 
                                    isRequire={true}
                                    className='modal-content'
                                    value={this.props.location.state.acctbank}
                                    disabled
                                />
                            </FormGroup>
                            <FormGroup>
                                <span className='modal-label'>账号名称：</span>
                                <FormControl
                                    type='text'
                                    isRequire={true}
                                    className='modal-content'
                                    value={this.props.location.state.eacctname}
                                    disabled
                                />
                            </FormGroup>
                            <FormGroup>
                                <span className='modal-label'>转入金额：</span>
                                <FormControl
                                    type='text'
                                    isRequire={true}
                                    className='modal-content'
                                    placeholder='请出入转入金额'
                                    value={this.props.location.state.amount}
                                    disabled
                                    /* onChange={(e) => this.setState({ customertype: e.target.value })} */
                                />
                            </FormGroup>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleajax} className='modalBtn btn-2'>确认</Button>
                            <Button onClick={this.close} className='btn-2 btn-cancel'> 关闭 </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        )
    }
}