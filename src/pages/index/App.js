import React from 'react'
import {Route,Link,} from 'mirrorx'
import Loadable from 'react-loadable';
import {Loading} from 'tinper-bee';

const MyLoadingComponent = function ({ error, pastDelay }) {
  if (error) {
    return <div>Error!</div>;
  } else if (pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}

import wrapperComponent from './wrapperComponent'

const AsyncUser = Loadable({
  loader: () => import('./User'),
  loading: MyLoadingComponent,
  delay: 10000,
  timeout: 10000,
});
import '../../comb/developer/components/Title.css';

const AsyncMyRP = Loadable({
  loader: () => import('../../comb/developer/MyRP/main'),
  loading: MyLoadingComponent,
});
import '../../comb/developer/MyRP/index.css';


const AsyncAlarmCenter = Loadable({
  loader: () => import('../../comb/developer/alarm-center/routes'),
  loading: MyLoadingComponent,
});

const AsyncMdService = Loadable({
  loader: () => import('../../comb/developer/md-service/main.page'),
  loading: MyLoadingComponent,
});
import '../../comb/developer/md-service/index.css';
import '../../comb/developer/md-service/component/serivceitem.css';


const App = () => (
  <div>
    <Route exact path="/" component={wrapperComponent(AsyncMyRP)}/>
    <Route path="/user" component={AsyncUser} />
    <Route path="/dashboard" component={wrapperComponent(AsyncMyRP)} />
    <Route path="/mdservice" component={wrapperComponent(AsyncMdService)} />
  </div>
)

export default App
