import React, { Component } from "react";
import './index.less';
import {
    Row,
    Col,
    FormControl,
    FormGroup,
    Button,
    Form,
} from 'tinper-bee';
export default class Formactivation extends Component {
    constructor() {
        super();
        this.state = {

        }
    }
    render() {
        return (
            <div id='formactivation'>
                <Row>
                    <Col lg={12} className='marleft'>
                    <div className='backlose'></div>
                        <h2>激活失败!</h2>
                        <ul className='mleft'>
                            <Col lg={12} >
                            <li>1、您可能没有转账（上海银行需要转账后才能激活）</li>
                            <li>2、正在转账中，还没到账。（转账可能需要一定的时间，请您耐心等候）</li>
                            <li>3、转账成功，但无法激活。(请及时联系平台), <strong>客服电话：400-800-9999</strong></li>
                            </Col>
                        </ul>
                    </Col>
                </Row>
            </div>
        )
    }
}