import React, { Component } from 'react';
import {
    Step,
    Row,
    Col,
    Con,
    Breadcrumb
} from 'tinper-bee'
const Steps = Step.Steps;
import './index.less';
export default class Formregister extends Component {
    constructor(){
        super();
    }
	render () {
		return (
            <div id="formme">
			<Breadcrumb>
			    <Breadcrumb.Item href="#">
                    首页
			    </Breadcrumb.Item>
			    <Breadcrumb.Item href="#">
			      投资理财
			    </Breadcrumb.Item>
			    <Breadcrumb.Item active href="#">
			      注册页面
			    </Breadcrumb.Item>
			</Breadcrumb>
            <div className='formmea'>
            <Row >
            <Col  lg={8} sm={8} md={8} lgOffset={2} smOffset={2} mdOffset={2} className='backcol' style={{height:60,lineHeight:90,backgroundColor:"#ffffff"}}>
                <Steps size="default" current={this.props.stepcurrent} className='backcol' style={{marginTop:20}}>
                    <Step title="手机号验证" />
                    <Step title="完成企业资料" />
                    <Step title="转账激活"/>
                    <Step title="激活成功"/>
                   
                </Steps>
            </Col>
            </Row>
            </div>
            </div> 
		)
	}
}
