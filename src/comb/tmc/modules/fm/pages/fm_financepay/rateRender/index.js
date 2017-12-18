import React, { Component } from 'react';
import {Col} from 'tinper-bee';

export default class RateRender extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        const rateData = this.props.rateData;
        return(
            <Col md={12} xs={12} sm={12} className="pay-part-info">
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">利率:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{rateData.rateid.display||rateData.rateid.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">固定汇率:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">
                    {rateData.isfixrate.value?(
                        rateData.isfixrate.value==0?'否':'是'
                    ):(
                        null
                    )}
                    </Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">利率浮动比例:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{rateData.floatratescale.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">利率浮动点数:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{rateData.floatratepoints.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">结息日:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{rateData.settledate.display||rateData.settledate.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">还款方式:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{rateData.returnmodeid.display||rateData.returnmodeid.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">逾期浮动比例:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{rateData.overratescale.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">提前浮动比例:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{rateData.headratescale.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">逾期浮动点数:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{rateData.overratepoint.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">提前浮动点数:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{rateData.headratepoint.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">逾期利率计复利:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">
                        {rateData.isoverinterest.value?(
                            rateData.isoverinterest.value==0?'否':'是'
                        ):(null)}
                    </Col>
                </Col>
                {rateData.isoverinterest.value?
                    (
                        <Col md={6} xs={6} sm={6} className="pay-item">
                            <Col md={4} xs={4} sm={4} className="pay-item-label">用合同利率计复利:</Col>
                            <Col md={8} xs={8} sm={8} className="pay-item-name">
                             {rateData.isusenormalrate.value?(
                                    rateData.isusenormalrate.value==0?'否':'是'
                             ):(
                                 null
                             )}
                            </Col>
                        </Col>
                    ):(
                        null
                    )                                        
                }
            </Col>
        )
    }

}