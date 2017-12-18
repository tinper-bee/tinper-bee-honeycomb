import React, { Component } from 'react';
import {Col} from 'tinper-bee';

export default class RateRender extends Component {
    constructor(props) {
        super(props);
        this.adjratemethod={
            'Year':'年',
            'HalfYear':'半年',
            'Quarter':'季',
            'Month':'月',
            'SettleDate':'结息日',
            'RateStartDate':'利率起效日',
            null:null
        };
        this.effecttype={
            'LoanDate':'放款日期',
            'VdefDate':'自定义日期',
            null:null
        }
    }

    render(){
        const adjrateData = this.props.adjrateData;
        return(
            <Col md={12} xs={12} sm={12} className="pay-part-info">    
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">调整方案:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{this.adjratemethod[adjrateData.adjratemethod.value]}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">调整周期:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{adjrateData.adjperiodunit.value}</Col>
                </Col>    
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">调整开始日期:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{adjrateData.adjbegdate.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">上次调整日期:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{adjrateData.lastadjdate.value}</Col>
                </Col> 
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">起效方式:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{this.effecttype[adjrateData.effecttype.value]}</Col>
                </Col>
            </Col>     
        )
    }

}