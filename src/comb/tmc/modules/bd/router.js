/*
* bd模块路由表
* */
import React, { Component } from 'react';
import { Route, IndexRoute } from 'react-router';
import Bd_transtype from './pages/bd_transtype/index';
import Bd_cashflowitem from './pages/bd_cashflowitem/index';
import Bd_bankaccbas from './pages/bd_bankaccbas/index';
import Bd_bankaccbas_add from './pages/bd_bankaccbas/add';
import Bd_cctype from './pages/bd_cctype/index';
import Bd_rate from './pages/bd_rate/index';
import Bd_finbank from './pages/bd_finbank/index';
import Bd_interestday from './pages/bd_interestday/index';

import Bd_repaymentmethod from './pages/bd_repaymentmethod/index';

import Bd_balatype from './pages/bd_balatype/index';
import Bd_project from './pages/bd_project/index';
import Bd_fininstitution from './pages/bd_fininstitution/index';
import Bd_partner from './pages/bd_partner/index';
import Bd_partner_add from './pages/bd_partner/bd_add/index';
import Bd_projecttype from './pages/bd_projecttype/index';
import Bd_Test from './containers/WrappedComponent/test';

const Routers = (
	<div>
		<Route path="transtype" component={Bd_transtype} />
		<Route path="cashflowitem" component={Bd_cashflowitem} />
		<Route path="bankaccbas" component={Bd_bankaccbas} />
		<Route path="bankaccbas_add" component={Bd_bankaccbas_add} />
		<Route path="bankpartner" component={Bd_partner} />
		<Route path="bankpartner_add" component={Bd_partner_add} />
		<Route path="cctype" component={Bd_cctype} />
		<Route path="rate" component={Bd_rate} />
		<Route path="finbank" component={Bd_finbank} />
		<Route path="interestday" component={Bd_interestday} />
		
		<Route path="repaymentmethod" component={Bd_repaymentmethod} />

		<Route path="balatype" component={Bd_balatype} />
		<Route path="project" component={Bd_project} />
		<Route path="projecttype" component={Bd_projecttype} />
		<Route path="fininstitution" component={Bd_fininstitution} />
		<Route path="test" component={Bd_Test} />
	</div>
);
export default Routers;
