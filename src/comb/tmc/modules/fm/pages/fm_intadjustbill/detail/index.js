import React, { Component } from 'react';
import { hashHistory } from 'react-router';
import { Button } from 'tinper-bee';
import { toast } from '../../../../../utils/utils.js';
import Ajax from '../../../../../utils/ajax.js';
import '../../../../pass/containers/formatMoney.js';
import ApproveDetail from 'containers/ApproveDetail';
import ApproveDetailButton from 'containers/ApproveDetailButton';
import './index.less';
const URL= window.reqURL.fm;

export default class IntAdjustBillDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            details: {}
        }
	}

	componentWillMount() {
        let { id } = this.props.location.query;
        this.getIntAdjustBillDetail(id);
    }
    
    //获取当前明细
    getIntAdjustBillDetail = id => {
        const _this = this;
		Ajax({
			url: URL + 'fm/interests/searchLx',
			data: {
				page: 0,
				size: 10,
				searchParams: {
					searchMap: {id}
				}
			},
			success: function(res) {
				const { data, message, success } = res;
				if (success) {
					let details = data && data.head && data.head.rows && data.head.rows[0] && data.head.rows[0]['values'];
					_this.setState({details});
				} else {
					toast({content: message ? message.message : '后台报错,请联系管理员', color: 'warning'});
				}
			},
			error: function(res) {
				toast({content: res.message || '后台报错,请联系管理员', color: 'danger'});
			}
		}); 
    }

    render() {
		let isApprove = this.props.location.pathname.indexOf('/approve') !== -1;
        let {processInstanceId, businesskey, id } = this.props.location.query;
        let {details}= this.state;
        
        return (
            <div className='intadjustbill-detail bd-wraps'>
                { isApprove && 
                    <ApproveDetail 
                        processInstanceId={processInstanceId} 
                        billid={id}
                        businesskey={businesskey}
                        refresh={() => {this.getIntAdjustBillDetail(id);}}
                    /> 
                }
                <div className="bd-header">
                    <span className="bd-title-1">利息调整</span>	
                    <ApproveDetailButton 
                        processInstanceId={processInstanceId} 
                        className='intadjustbill-detail-approve'
                    />
                    <Button 
                        className='btn-2 btn-cancel reback'
                        onClick={() => {
                            hashHistory.push(`/fm/intadjustbill`);
                        }}
                    >返回</Button>
                </div>
                <div className='detail-box'>
                    <ul>
                        <li>
                            <span>放款编号:</span>
                            <span>{details.vbillno ? details.vbillno.display || details.vbillno.value || '—' : '—'}</span>
                        </li>
                        <li>
                            <span>系统应付利息:</span>
                            <span>{details.iapayablemny ? Number(details.iapayablemny.display || details.iapayablemny.value || 0).formatMoney(2, '') : '—'}</span>
                        </li>
                        <li>
                            <span>本币汇率:</span>
                            <span>{details.exchangerate ? Number(details.exchangerate.display || details.exchangerate.value || 0).toFixed(4) : '—'}</span>
                        </li>
                        <li>
                            <span>调整后应付利息:</span>
                            <span>{details.adjediapayablemny ? Number(details.adjediapayablemny.display || details.adjediapayablemny.value || 0).formatMoney(2, '') : '—'}</span>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }


}