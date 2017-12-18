import React, { Component } from "react";
import './index.less';
import {
    Row,
    Col,
    FormControl,
    Button,
} from 'tinper-bee';
import Formregister from "../../containers/form_register/index";
import Ajax from '../../../../utils/ajax';
export default class RegisterS extends Component {
    constructor() {
        super();
        this.state = {
            bank: '上海银行',
            password1: '',
            password2: '',
            password3: '',
            password4: ''
        };
    }
    handleComplete = () => {
        let { password1, password2, password3, password4 } = this.state;
        if (password1 !== password2) {
            alert('登录密码不一致');
            this.setState({
                password1: '',
                password2: ''
            })
            return
        } else if (password3 !== password4) {
            alert('支付密码不一致');
            this.setState({
                password3: '',
                password4: ''
            })
            return
        } else if (password1 !== '' && password2 !== '' && password3 !== '' && password4 !== '') {
            axios.post('/', { password1: this.state.password1, password3: this.state.password3 })
                .then(function (res) {
                    if (res === true) {
                        this.props.router.push({
                            pathname: '/if/activation',
                        })
                    } else {
                        alert({ resmessages })
                    }
                })

        }


    }
    handleword = (e, item) => {
        console.log(this.refs[item].props.value)
        // console.log(this.refs.password2)
        this.setState({
            [item]: e.target.value
        })

    }
    render() {
        return (
            <div id='registers'>
                <Formregister stepcurrent={2} />
                <Row className='martop registertop'>
                    <Col lg={3} className='marlefts'>
                    <div className='backimg'></div>
                        <div className='backimg1'>
                            <span style={{ fontSize: '24px' }}>{this.state.bank}恭喜你开户成功</span>
                        </div>
                        <div className='marleftl'>
                            <span style={{ fontSize: '14px' }}>你的理财账户：564564654</span>
                        </div>
                    </Col>
                </Row>

                <Row className='martoptt registerbottom'>
                    <div className='passwo'>
                        <span className='icon'></span>
                        <span className='icont'>设置密码</span>
                    </div>
                    <Col lg={8} lgOffset={4} className='martopt'>
                        <Row className='banktype'>
                            <Col lg={2} className='registerword'>
                                <span className='finance-modal-title fl'
                                    style={{ fontSize: '14px' }}>
                                    登录密码：
                            </span>
                            </Col>
                            <Col lg={3}>
                                <FormControl
                                    ref='password1'
                                    type='password'
                                    className="finnance-modal-center"
                                    onChange={(e) => this.handleword(e, 'password1')}
                                    value={this.state.password1}

                                />
                            </Col>
                        </Row>
                        <Row className='banktype martopten'>
                            <Col lg={2} className='registerword'>
                                <span className='finance-modal-title fl'
                                    style={{ fontSize: '14px' }}>
                                    确认密码：
                            </span>
                            </Col>
                            <Col lg={3} className='martopee'>
                            
                                <FormControl
                                    ref='password2'
                                    type='password'
                                    className="finnance-modal-center "
                                    value={this.state.password2}
                                    onChange={(e) => this.handleword(e, 'password2')}

                                />
                            </Col>
                        </Row>

                    </Col>
                    <Col lg={8} lgOffset={4} style={{marginTop:10}}>

                        <Row className='banktype martope '>
                            <Col lg={2} className='martopt registerword'>
                                <span className='finance-modal-title fl'
                                    style={{ fontSize: '14px' }}>
                                    支付密码：
                            </span>
                            </Col>
                            <Col lg={3}>
                                <FormControl
                                    ref='password3'
                                    type='password'
                                    className="finnance-modal-center"
                                    onChange={(e) => this.handleword(e, 'password3')}
                                    value={this.state.password3}
                                />
                            </Col>
                        </Row>
                        <Row className='banktype'>
                            <Col lg={2} className='registerword'>
                                <span className='finance-modal-title fl spantop'
                                    style={{ fontSize: '14px' }}>
                                    确认密码：
                            </span>
                            </Col>
                            <Col lg={3}>
                                <FormControl
                                    ref='password4'
                                    type='password'
                                    className="finnance-modal-center"
                                    onChange={(e) => this.handleword(e, 'password4')}
                                    value={this.state.password4}
                                />
                            </Col>
                        </Row>

                    </Col>
                    
                </Row>
                <Row>
                <Col className='martopdown'>
                        <Button colors="#00B39E" onClick={this.handleComplete}>下一步</Button>
                    </Col>
                </Row>
            </div>
        )
    }


}