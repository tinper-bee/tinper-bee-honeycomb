import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import MainPage from './v2/mian.js';


export default (
    <Router history={hashHistory}>
        <Route path="/" component={MainPage} />
    </Router>
)