import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import ApplicationContent from './Main';
import TransitionPage from '../../components/transitionPage';
import AuthPage from '../../components/authPage';
import {List, UploadDetail, Publish, CreateApp, MiroAppDetail} from './containers';


export default (
  <Router history={hashHistory}>
    <Route path="/" component={ApplicationContent}>
      <IndexRoute component={List}/>
      <Route path="/upload_detail/:id" component={UploadDetail}/>
      <Route path="/miro-app-detail/:id" component={MiroAppDetail}/>
      <Route path="/publish/:id" component={Publish}/>
      <Route path="/createApp" component={CreateApp}/>
      <Route path="/transition/:state" component={TransitionPage}/>
      <Route path="/auth/:id" component={AuthPage}/>
    </Route>
  </Router>
)
