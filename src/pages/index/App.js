import React from 'react'
import {Route} from 'mirrorx'
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

import Home from './Home'

const AsyncUser = Loadable({
  loader: () => import('./User'),
  loading: MyLoadingComponent,
  delay: 10000,
  timeout: 10000,
});

const App = () => (
  <div>
    <Route exact path="/" component={Home}/>
    <Route path="/users" component={AsyncUser} />
  </div>
)

export default App
