
import React, { Component } from "react";
import { Link } from 'react-router';
import Fromregister from '../../containers/form_register/index';
import Ajax from '../../../../utils/ajax';
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

export default class Activationscs extends Component {
    constructor() {
        super();
        this.state = {
            bank: '上海银行'
        }

    }
    render() {
        return (
            <div id='activationscs'>
                <div>
                <Fromregister stepcurrent={3}/>
                </div>
                
                <div className='success'>
                    <Row>
                        <Col lg={5} className='marleft'>
                        <div className='successimg'></div>
                            <h4>{this.state.bank}恭喜你激活成功!</h4>
                        </Col>
                    </Row>
               
                </div>
                <div className='succe'>
                    <Row>
                        <Col className='marheader'>
                            <h4>可以享受以下权益</h4>
                            <div className='borderB'></div>
                            {/* <p>[快速赎回，最快1秒到账]</p> */}
                        </Col>
                    </Row>
                    <Row className='martop'>
                        <Col lg={9} lgOffset={1}>
                            <Row>
                                <ul>
                                    <li>
                                        <Col lg={3} md={3} sm={3} className='center'>
                                          <div className='img1'></div>
                                            <p className='pinkred'>安全保障体系</p>
                                            <p>多家安全机构联合保障</p>
                                        </Col>
                                    </li>
                                    <li>
                                        <Col lg={3} md={3} sm={3} className='center'>
                                        <div className='img2'></div>
                                            <p className='pinkred'>高收益</p>
                                            <p>连续多年保持超高收益</p>
                                        </Col>
                                    </li>
                                    <li>
                                        <Col lg={3} md={3} sm={3} className='center'>
                                        <div className='img3'></div>
                                            <p className='pinkred'>流动性强</p>
                                            <p>闪电赎回 资金灵活掌握</p>
                                        </Col>
                                    </li>
                                    <li>
                                        <Col lg={3} md={3} sm={3} className='center'>
                                        <div className='img4'></div>
                                            <p className='pinkred'>免手续费</p>
                                            <p>认购无门槛进出免费</p>
                                        </Col>
                                    </li>
                                </ul>
                            </Row>
                            <Row>
                                <Col lg={4} lgOffset={4} className='martopt'>
                                    <Button
                                        className='btnwidth'
                                        colors="primary"
                                        onClick={() => {
                                            this.props.router.push({
                                                pathname: '/if/applypurchase',
                                            })
                                        }}>
                                        返回首页
                        </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}