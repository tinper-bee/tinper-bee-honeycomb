import React, { Component } from "react";
import './index.less';
import {
    Row,
    Col,
    FormControl,
    Button,
    Breadcrumb,
    Tile
} from 'tinper-bee';
export default class Management extends Component {
    constructor() {
        super();
        this.state = {};
    }
    render() {
        return (
            <div className='bodyb'>
                 {/*头部导航*/}
                <Breadcrumb className='nav-bar'>
                    <Breadcrumb.Item href="#">
                        首页
			        </Breadcrumb.Item>
                    <Breadcrumb.Item href="#">
                        投资理财
			        </Breadcrumb.Item>
                    <Breadcrumb.Item active>
                        理财账户管理页面
			        </Breadcrumb.Item>
                </Breadcrumb>

                <Row>
                    <Col lg={3} lgOffset={1}>
                        <Tile className='Tilebody' >
                            <h4 className='spantio'>上海银行</h4>
                            <span className='spantop'>上海银行账户</span>
                            <span className='spantop'>123456789123456789</span>
                            <Row className='rowtop'>
                                <Col lg={4} lgOffset={4}>
                                    <a href="#">修改密码</a>
                                </Col>
                                <Col lg={4} >
                                <a href="#">忘记密码</a>
                                </Col>
                            </Row>
                        </Tile>
                    </Col>
                    <Col lg={3}>
                        <Tile className='Tilebody' >
                        <h4 className='spantio'>上海银行</h4>
                        <span className='spantop'>上海银行账户</span>
                        <span className='spantop'>123456789123456789</span>
                        <Row className='rowtop'>
                                <Col lg={4} lgOffset={4}>
                                    <a href="#">修改密码</a>
                                </Col>
                                <Col lg={4} >
                                <a href="#">忘记密码</a>
                                </Col>
                            </Row>
                        </Tile>
                    </Col>
                    <Col lg={3}>
                        <Tile className='Tilebody' >
                        <h4 className='spantio'>上海银行</h4>
                        <span className='spantop'>上海银行账户</span>
                        <span className='spantop'>123456789123456789</span>
                        <Row className='rowtop'>
                                <Col lg={4} lgOffset={4}>
                                    <a href="#">修改密码</a>
                                </Col>
                                <Col lg={4} >
                                <a href="#">忘记密码</a>
                                </Col>
                            </Row>
                        </Tile>
                    </Col>
                </Row>
               
            </div>
        )
    }
}
