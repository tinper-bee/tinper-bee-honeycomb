import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import MainPage from './Main';
import AuthPage from '../components/authPage';
import { AlarmInfo } from './containers';

export default (
  <Router history={hashHistory}>
    <Route path="/" component={MainPage}>
      <IndexRoute path="/alarm-info" component={AlarmInfo} />
      <Route path="/auth/:id" component={AuthPage} />
    </Route>
  </Router>
)
