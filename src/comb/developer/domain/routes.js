import React from 'react';
import {render} from 'react-dom';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import MainPage from './Main';
import Desc from './desc';

export default (
    <Router history={hashHistory}>
        <Route path="/" component={MainPage}/>
        <Route path="/desc" component={Desc}/>
    </Router>
)
