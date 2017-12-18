
import React, { Component } from "react";
import './index.less'

import Ajax from '../../../../utils/ajax';
import {
    Row,
    Col,
    FormControl,
    FormGroup,
    Button,
    Form,
} from 'tinper-bee';
const rootURL = window.reqURL.fm + "fm/";
//  获取验证码传递的参数   mobile
import {Link} from 'mirrorx'
import Formregister from "../../containers/form_register"
export default class Register extends Component {
    // this.props.location.state.productCode;
    constructor() {
        super();
        this.state = {
            mobile: '',
            resultCode: '',
            scends: 60,
            checkboxT: false,
            noclick: true,
            resultCodeimg: '',
            productCode:'',//客户编码传递到下一个页面中
            getcode: '获取验证码',
            getCode: '获取验证码',

        };
    }
    //验证手机号的正则
    checkPhone = (mobile) => {
        if (!(/^1(3|4|5|7|8)\d{9}$/.test(mobile))) {
            return false;
        }
    }
    //改变验证码
    changeResult = (e) => {
        this.setState({ resultCode1: e.target.value })
    };
    //改变手机号
    changeMobile = (e) => {
        this.setState({ mobile: e.target.value });
        this.checkPhone(this.state.mobile);
    }
    //点击获取验证码
    handleClick = () => {
        var _this = this;
        let scends = this.state.scends;

        var timer = setInterval(() => {
            this.setState({ getcode: this.state.scends })
            if (scends > 0) {
                scends--;
                _this.setState({ scends: scends })
            } else if (scends == 0) {
                clearInterval(timer);
                _this.setState({ scends: 60 });
                _this.setState({ getcode: this.state.getCode })
                ReactDOM.findDOMNode(_this.refs.disButton).removeAttribute('disabled');
                return;
            }
        }, 1000)
        if (scends > 0) {
            ReactDOM.findDOMNode(_this.refs.disButton).setAttribute('disabled', 'disabled');
        }
        Ajax({
            url: rootURL+'interests/sendmobilecode',
            mode: 'normal',
            data:{mobile: this.state.mobile},
            success: (res)=> {
                console.log(res)
                this.setState({ resultCode: res.data.response_body.resultCode })

            },
            error: function (res) {
                console.log(res);
            }
        });
    }
    changecheckbox = () => {

        if (this.state.checkboxT === false) {
            this.setState({ checkboxT: true });

        } else {
            this.setState({ checkboxT: false });
        }
    }
    handleaxios = () => {
        if (this.state.resultCode == this.state.resultCode1) {
            this.state.checkboxT ?
            this.props.router.push({
                pathname: '/if/registert',
                state: {
                    productCode: this.props.location.state.productCode,
                }
            }): alert('请阅读《友企盈理财平台协议》')
        } else {
            alert('验证失败，请重新验证')
        }

    }
    render() {
        return (
            <div id='register'>

                <Formregister stepcurrent={0} />
                <Form submitCallBack={this.checkForm}>
                    <Row className='registerlogo'>
                        <Col className='logocenter'>
                            <div className='banklogo'></div>
                        </Col>
                        <Col className='logocenter'>
                            <div className='bankname'>
                                上海银行
                                </div>
                        </Col>
                        <Col className='centerbox'>
                            <Col className='lefttall'>
                                <ul>
                                    <li>
                                        <Row>
                                            <Col lg={2} md={2} sm={2} className='registertell'>
                                                <span className='finance-modal-title fl'
                                                    style={{ fontSize: '16px' }}>
                                                    手机号：
                                            </span>
                                            </Col>
                                            <Col lg={5} md={5} sm={5}>
                                                <FormControl
                                                    style={{width:240}}
                                                    name="phone"
                                                    placeholder='请输入手机号'
                                                    reg= '^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$'
                                                    name="phone"
                                                    className="finnance-modal-center"
                                                    value={this.state.mobile}
                                                    onChange={this.changeMobile}
                                                    maxLength='11'
                                                />
                                            </Col>
                                            {/* <Col lg={3} md={3} sm={3}>
                                                <Button
                                                    colors="primary" onClick={this.handleClick}
                                                    ref="disButton"
                                                >获取验证码</Button>
                                            </Col> */}

                                        </Row>
                                    </li>
                                    <li style={{ 'marginTop': '20px' }}>
                                        <Row className='registertell1'>
                                            <Col lg={2} md={3} sm={3} className='registertell'>
                                                <span className='finance-modal-title fl'
                                                    style={{ fontSize: '16px' }}>
                                                    验证码：</span>
                                            </Col>
                                            <Col lg={4} md={3} sm={3} className='noclick'>
                                                <FormControl
                                                    ref='noclick'
                                                    placeholder='请输入验证码'
                                                    reg={/^[0-9]+$/}
                                                    method="blur"
                                                    errorMessage="格式错误"
                                                    maxLength='8'
                                                    className="finnance-modal-center"
                                                    onChange={this.changeResult} />
                                            </Col>
                                            <Col lg={5} md={2} sm={2} className='getid'>
                                                <Button
                                                    colors="primary" onClick={this.handleClick}
                                                    ref="disButton"
                                                >{this.state.getcode}</Button>
                                            </Col>
                                            {/* <Col  lg={5} md={2} sm={2} className='getid'>
                                                <Button>{this.state.scends + 's'}</Button>
                                            </Col> */}
                                            {/* <Col lg={2} className='resultCodeimg'>
                                                <div>
                                                    {<img src={this.state.resultCodeimg} alt=""/>}
                                                </div>
                                            </Col>    */}
                                        </Row>
                                    </li>
                                    <li className='inputCheck'>
                                        <Row>
                                            <Col lg={7} md={7} className='checkcenter'>
                                                <span className='checkboxN'>
                                                    <FormControl
                                                        type='checkbox'
                                                        className="finnance-modal-center"
                                                        onChange={this.changecheckbox}
                                                        checked={this.state.checkboxT}
                                                    />
                                                </span>
                                                <span>
                                                    我已同意并阅读
                                                    <Link rel="parent" target="_blank" to="/if/registerword">
                                                    <a>《友企盈理财平台协议》</a>
                                                    </Link>
                                                </span>
                                            </Col>
                                        </Row>
                                    </li>
                                    <li style={{ marginTop: '30px' }}>
                                        <Row className='nextstep'>
                                            <Col>
                                                <Button
                                                    colors="primary"
                                                    onClick={this.handleaxios}>
                                                    下一步
                                        </Button>

                                            </Col>
                                        </Row>
                                    </li>
                                </ul>
                            </Col>

                        </Col>
                    </Row>
                </Form>
            </div>

        )
    }

}



