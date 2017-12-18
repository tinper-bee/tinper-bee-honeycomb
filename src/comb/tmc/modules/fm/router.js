/*
* fm模块路由表
*
* */
import React, {Component} from 'react';
import {Route, IndexRoute} from 'react-router';
import RepayPrcpl from './pages/fm_repayprcpl/index';
import RepayPrcplManage from './pages/fm_repayprcplmanage';
import RepayInterest from './pages/fm_repayinterest';
import RepayInterestManage from './pages/fm_repayinterestmanage';
import Contract from './pages/fm_contract';
import ContractView from './pages/fm_contract/view';
import ContractTracelog from './pages/fm_contract/tracelog';
import Assure from './pages/fm_assure';
import AssureView from './pages/fm_assure/view';
import AssureTracelog from './pages/fm_assure/tracelog';
import IntAdjustBill from './pages/fm_intadjustbill';
import IntAdjustBillDetail from './pages/fm_intadjustbill/detail';
import Guacontractquote from './pages/fm_guacontractquote';
import Financepay from './pages/fm_financepay/index';
import Apply from './pages/fm_apply';
import ApplyCard from './pages/fm_applycard';
import Test2 from './pages/fm_applycard/test2';
import ApplyCardPreview from './pages/fm_applycard/preview';
import FinancepayChangeRecord from './pages/fm_financepay/changeRecord/index';
import GuaranteeContractManage from './pages/fm_guaranteecontractmanage';
import Interest from './pages/fm_interest';
import FinancepayManage from './pages/fm_financepaymanage';
import FinanceLedger from './pages/fm_financeledger';
import Payment from './pages/fm_payment';
import LoanTransaction from './pages/fm_loantransaction';
import PaymentShare from './pages/fm_payment/fm_paymentShare/index.js';
import FmApplyIndex from './pages/fm_applyIndex';
import FmTransIndex from './pages/fm_transIndex';
import SecurityInterest from './pages/fm_securityinterest';
import InterestCard from './pages/fm_securityinterest/fm_interestcard';
import InterestChange from './pages/fm_securityinterest/fm_interestchange';
import CreditManage from './pages/fm_creditmanage';
import CreditDetail from './pages/fm_creditmanage/detail'
import Creditmonitor from './pages/fm_creditmonitor';
import Zanheyue from './pages/fm_zanheyue';
import Zanheyueshow from './pages/fm_zanheyueshow';
import Zanheyueadd from './pages/fm_zanheyueadd';
import Zantaizhang from './pages/fm_zantaizhang';
import Zantiaozheng from './pages/fm_zantiaozheng';
import Zanwuquan from './pages/fm_zanwuquan';
import Zanwuquanadd from './pages/fm_zanwuquanadd';
import Zanwuquanedit from './pages/fm_zanwuquanedit';
import Zanwuquanshow from './pages/fm_zanwuquanshow';
import CreditAdjustDetail from './pages/fm_creditadjustdetail';
import CreditAdjust from './pages/fm_creditadjust';
import Costanalysis from './pages/fm_costanalysis';
import TransActions from './pages/fm_transactions';
import AssureManage from './pages/fm_assuremanage';
import guacontractquoteCard from "./pages/fm_guacontractquote/fm_guacontractquoteCard/index.js";
const Routers = (
    <div>
        <Route path="repayprcpl" component={RepayPrcpl}/>
        <Route path="repayprcplmanage" component={RepayPrcplManage}/>		
        <Route path="repayinterest" component={RepayInterest}/>
        <Route path="repayinterestmanage" component={RepayInterestManage}/>
        <Route path="contract" component={ Contract }/>
        <Route path="contract_view" component={ ContractView }/>
        <Route path="contract_tracelog" component={ ContractTracelog }/>
        <Route path="assure" component={ Assure }/>
        <Route path="assure_view" component={ AssureView }/>
        <Route path="assure_tracelog" component={ AssureTracelog }/>
        <Route path="intadjustbill" component={ IntAdjustBill }/>
        <Route path="intadjustbill/detail" component={ IntAdjustBillDetail }/>
        <Route path="financeledger" component={ FinanceLedger }/>
        <Route path="financepay/:id" component={ Financepay }/>   
        <Route path="financepaymanage" component={ FinancepayManage }/>
        <Route path="financepaymanage/:id" component={ FinancepayManage }/>
        <Route path="apply" component={ Apply }/>
        <Route path="applycard" component={ApplyCard}/>
        <Route path="applytest" component={Test2}/>
        <Route path="applycardpreview" component={ApplyCardPreview}/>
        <Route path="financepayChangeRecord/:id" component={FinancepayChangeRecord}/>
        <Route path="guaranteecontractmanage" component={ GuaranteeContractManage }/>
        <Route path="interest" component={ Interest }/>
        <Route path="payment" component={ Payment }/>
        <Route path="paymentShare" component={ PaymentShare }/>
        <Route path="loantransaction" component={ LoanTransaction }/>
        <Route path="paymentShare/:id" component={ PaymentShare }/>
        <Route path="applyIndex" component={ FmApplyIndex }/>
        <Route path="transIndex" component={ FmTransIndex }/>
        <Route path="securityinterest" component={ SecurityInterest }/>
        <Route path="interestcard" component={ InterestCard }/>
        <Route path="interestchange" component={ InterestChange }/>
        <Route path="creditmanage" component={ CreditManage }/>
        <Route path="costanalysis" component={ Costanalysis }/>
        <Route path="creditmonitor" component={ Creditmonitor }/>
        <Route path="heyue" component={ Zanheyue }/>
        <Route path="heyueadd" component={ Zanheyueadd }/>
        <Route path="heyueshow" component={ Zanheyueshow }/>        
        <Route path="creditdetail" component={ CreditDetail }/>
        <Route path="taizhang" component={ Zantaizhang }/>
        <Route path="tiaozheng" component={ Zantiaozheng }/>
        <Route path="wuquan" component={ Zanwuquan }/>
        <Route path="wuquan" component={ Zanwuquan }/>
        <Route path="wuquanadd" component={ Zanwuquanadd }/>
        <Route path="wuquanedit" component={ Zanwuquanedit }/>
        <Route path="wuquanshow" component={ Zanwuquanshow }/>
        <Route path="creditadjustdetail" component={ CreditAdjustDetail }/>
        <Route path="creditadjust" component={ CreditAdjust }/>
        <Route path="guacontractquote" component={ Guacontractquote }/>
        <Route path="guacontractquoteCard" component={ guacontractquoteCard }/>
        <Route path="transactions" component={ TransActions }/>
        <Route path="assuremanage" component={ AssureManage }/>
    </div>
);
export default Routers;

