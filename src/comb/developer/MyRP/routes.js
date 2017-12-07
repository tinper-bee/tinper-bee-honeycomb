import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import MainPage from './Main';
import BuyServer from './BuyServer';
import MainEngine from './MainEngine';
import AddPEngine from './AddPEngine';
import UpdownSelect from './UpdownSelect'
import AuthPage from 'components/authPage';
export default (
  <Router history={hashHistory}>
    <Route path="/" component={MainPage}/>
    <Route path="/bs" component={BuyServer}/>
    <Route path="/upDown" component={UpdownSelect}/>
    <Route path="/me/:name" component={MainEngine}/>
    <Route path="/ape/:name" component={AddPEngine}/>
    <Route path="/auth/:id" component={AuthPage}/>
  </Router>
)
