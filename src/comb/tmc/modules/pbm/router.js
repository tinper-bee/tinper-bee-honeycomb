/*
* fm模块路由表
*
* */
import React, { Component } from 'react';
import { Route, IndexRoute } from 'react-router';
import ApproveList from './pages/ApproveList';
import ApproveSetting from './pages/ApproveSetting';
import Demo from 'containers/ApproveDetail/demo.js';

const Routers = [
	<Route path="approveList" component={ApproveList} />,
	<Route path="approveSetting" component={ApproveSetting} />,
	<Route path="approveDetail" component={Demo} />
];

export default Routers;
