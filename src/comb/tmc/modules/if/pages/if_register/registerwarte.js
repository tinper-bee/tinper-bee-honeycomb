
import React, { Component } from "react";
import './index.less'
import RegisterT from './registerT';
import Formregister from "../../containers/form_register";
import Ajax from '../../../../utils/ajax';
import {
    Row,
    Col,
    FormControl,
    FormGroup,
    Button,
    Form,
} from 'tinper-bee';
export default class registerwarte extends Component {
    constructor() {
        super();
        this.state = {
            bankname: "上海银行",
        }
    }
    render() {
        return (
            <div id='registerwarte'>
                <Formregister stepcurrent={1}/>
                <Row className='registerwarbody'>
                    <Row>
                    <Col className='registerwarteimg'></Col>
                    </Row>
                    <Row>
                    <Col className='martopt'>
                        <h2>{this.state.bankname}为你审核中，请你稍等！</h2>  
                    </Col>
                    </Row>
                    <Row>
                    <Col className='btncenter'>
                        <Button
                            colors="primary"
                            onClick={() => {
                                this.props.router.push({
                                    pathname: '/if/purchase',
                                })
                            }}>
                            返回首页
                        </Button>
                    </Col>
                    </Row>
                </Row>
            </div>
        )
    }
}