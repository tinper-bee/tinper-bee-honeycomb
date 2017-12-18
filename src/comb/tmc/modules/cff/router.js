/*
* cff模块路由表
*
* */
import React, {Component} from 'react';
import {Route, IndexRoute} from 'react-router';
import Demo from './pages/demo/index'

const Routers = (
    <div>
        <IndexRoute component={Demo}/>
        <Route path="demo" component={Demo}/>
        
    </div>
);
export default Routers;