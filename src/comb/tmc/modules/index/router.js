/*
* index模块路由表
* */
import React, { Component } from 'react';
import { Route, IndexRoute } from 'react-router';
import Index_tmcjiesuanchuna from './tmcjiesuanchuna';
import Index_tmcjiesuanzhuguan from './tmcjiesuanzhuguan';
import Index_tmcxindaiyuan from './tmcxindaiyuan';
import Index_tmcxindaizhuguan from './tmcxindaizhuguan';
import Index_tmczijintouziyuan from './tmczijintouziyuan';
import Index_tmczijintouzizhuguan from './tmczijintouzizhuguan';

const Routers = (
	<div>
		<Route path="tmcjiesuanchuna" component={Index_tmcjiesuanchuna} />
		<Route path="tmcjiesuanzhuguan" component={Index_tmcjiesuanzhuguan} />
		<Route path="tmcxindaiyuan" component={Index_tmcxindaiyuan} />
		<Route path="tmcxindaizhuguan" component={Index_tmcxindaizhuguan} />
		<Route path="tmczijintouziyuan" component={Index_tmczijintouziyuan} />
		<Route path="tmczijintouzizhuguan" component={Index_tmczijintouzizhuguan} />
	</div>
);
export default Routers;
