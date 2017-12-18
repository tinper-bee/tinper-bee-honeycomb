/*
* 项目路由表
* */
import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import Layout from '../layout/index';
import BD from '../modules/bd/router';
import CFF from '../modules/cff/router';
import FM from '../modules/fm/router';
import PASS from '../modules/pass/router';
import IF from '../modules/if/router';
import PBM from '../modules/pbm/router';
import IndexPage from '../modules/index/router';
import ReferDemo from '../containers/Refer/demo';
import UploadDemo from '../containers/TmcUploader/demo';

const Routers = (
	<Router history={hashHistory}>
		<Route exact path="/" component={Layout} />
		<Route path="/(approve/)bd" component={Layout}>
			{BD}
		</Route>
		<Route path="/(approve/)cff" component={Layout}>
			{CFF}
		</Route>
		<Route path="/(approve/)fm" component={Layout}>
			{FM}
		</Route>
		<Route path="/(approve/)pass" component={Layout}>
			{PASS}
		</Route>
		<Route path="/(approve/)if" component={Layout}>
			{IF}
		</Route>
		<Route path="/(approve/)pbm" component={Layout}>
			{PBM}
		</Route>
		<Route path="/(approve/)demo" component={Layout}>
			<Route path="referdemo" component={ReferDemo} />
		</Route>
		<Route path="/(approve/)upload" component={Layout}>
			<Route path="demo" component={UploadDemo} />
		</Route>
		<Route path="/(approve/)indexpage" component={Layout}>
			{IndexPage}
			{/* <Route path="tmcadmin" component={IndexPage} />
			<Route path="tmcjiesuanchuna" component={IndexPage} />
			<Route path="tmcjiesuanzhuguan" component={IndexPage} />
			<Route path="tmcxindaiyuan" component={IndexPage} />
			<Route path="tmcxindaizhuguan" component={IndexPage} />
			<Route path="tmczijintouziyuan" component={IndexPage} />
			<Route path="tmczijintouzizhuguan" component={IndexPage} /> */}
		</Route>
	</Router>
);

export default Routers;
