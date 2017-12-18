/*
* pass模块路由表
*
* */
import React, {Component} from 'react';
import {Route, IndexRoute} from 'react-router';
import Settlement from './pages/Settlement'
import UnSettlement from './pages/UnSettlement'
import SettleDetail from './containers/SettleDetail'
import BankReceipt from './pages/BankReceipt'
import Informer from './pages/Informer'
import Trading from './pages/trading'
import Passall from './pages/pass_all'
import Passsearch from './pages/pass_search'

const Routers = (
    <div>
        <Route path="settlement" component={Settlement}/>
        <Route path="unsettlement" component={UnSettlement}/>
        <Route path="settlement/settledetail" component={SettleDetail}/>
        <Route path="bankreceipt" component={BankReceipt}/>
        <Route path="informer" component={Informer}/>
        <Route path="trading" component={Trading}/>
        <Route path="all" component={Passall}/>
        <Route path="search" component={Passsearch}/>
    </div>
);
export default Routers;