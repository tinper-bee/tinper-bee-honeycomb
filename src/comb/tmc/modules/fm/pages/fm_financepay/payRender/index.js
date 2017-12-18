import React, { Component } from 'react';
import {Col} from 'tinper-bee';
import TmcUploader from 'containers/TmcUploader';

//附件
let uploadFun;
export default class PayRender extends Component {
    constructor(props) {
        super(props);
        this.settleflag={
            '0':'待结算',
            '1':'结算中',
            '2':'结算成功',
            '3':'结算失败',
            null:'待结算'
        },
         //审批状态
         this.vbillStatus={
            '0':'待提交',
            '1':'审批通过',
            '2':'审批中',
            '3':'待审批',
            null:'待提交'
        }
    }

    handleUpload = (fun) => {
        if (typeof fun === 'function') {
            uploadFun = fun;
        } else {
            // 文件上传之前需要处理的方法

            uploadFun();
        }
    };

    render(){
        const financepayData = this.props.financepayData;
        return(
            <Col md={12} xs={12} sm={12} className="pay-part-info">
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">合同编号:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.contractid.display||financepayData.contractid.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">放款计划:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.planpayid.display||financepayData.planpayid.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">放款编号:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.loancode.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">贷款单位:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.financorgid.display||financepayData.financorgid.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">贷款机构:</Col>
                    <Col md={6} xs={6} sm={6} className="pay-item-name">{financepayData.financecorpid.display||financepayData.financecorpid.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">交易类型:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.trantypeid.display||financepayData.trantypeid.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">交易事件:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.tranevent.value||'贷款放款'}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">放款金额:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.loanmny.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">币种:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.currtypeid.display||financepayData.currtypeid.value}</Col>
                </Col>    
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">本币汇率:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.rate.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">放款日期:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.loandate.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">合约结束日期:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.contenddate.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">借款单位账户:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.debitunitacctid.display||financepayData.debitunitacctid.value}</Col>
                </Col>                               
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">项目:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{financepayData.projectid.display||financepayData.projectid.value}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">结算状态:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{this.settleflag[financepayData.settleflag.value]}</Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">审批人:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">
                        {financepayData.approver.value}                                           
                    </Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">审批状态:</Col>
                    <Col md={6} xs={6} sm={6} className="pay-item-name">
                        {this.vbillStatus[financepayData.vbillstatus.value]}                                           
                    </Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">审批日期:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">
                        {financepayData.approvedate.value}                                           
                    </Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">异常终止日期:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">{
                        financepayData.terminatedate.value?
                        (financepayData.terminatedate.value):
                        ('无')}
                    </Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">还本释放授信额度:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">
                        {financepayData.payreleasemny.value?(
                            financepayData.payreleasemny.value==0?'否':'是'
                        ):(null)}
                    </Col>
                </Col>
                <Col md={6} xs={6} sm={6} className="pay-item">
                    <Col md={4} xs={4} sm={4} className="pay-item-label">放款占用授信:</Col>
                    <Col md={8} xs={8} sm={8} className="pay-item-name">
                    {financepayData.ispayusecc.value?(
                        financepayData.ispayusecc.value==0?'否':'是'
                    ):(null)}
                    </Col>
                </Col>
                <Col md={12} xs={12} sm={12} style={{padding:0}}>
                    <Col md={12} xs={12} sm={12} className="pay-item" >
                        <Col md={2} xs={2} sm={2} className="pay-item-label">备注:</Col>
                        <Col md={10} xs={10} sm={10} className="pay-item-name">{financepayData.memo.value}</Col>
                    </Col>
                </Col> 
                {/* <Col md={12} xs={12} sm={12} style={{padding:0}}>
                    <Col md={12} xs={12} sm={12} className="pay-item">
                        <Col md={2} xs={2} sm={2} className="pay-item-label">附件:</Col>
                        <Col md={10} xs={10} sm={10} className="pay-item-name">
                            <TmcUploader
                                 billId={this.props.currentBillId}
                            />
                        </Col>
                    </Col>  
                </Col>  */}
            </Col> 
        )
    }

}