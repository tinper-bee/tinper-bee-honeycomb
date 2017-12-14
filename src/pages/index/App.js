import React from 'react'
import {Route,Link,Router,Switch,withRouter,actions, connect} from 'mirrorx'
import Loadable from 'react-loadable';
import {Loading} from 'tinper-bee';
import { Transition,TransitionGroup,CSSTransition} from 'react-transition-group'
import 'honeyAssets/css/animation.css'

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0.01},
  entered: { opacity: 1 },
};

const MyLoadingComponent = function ({ error, pastDelay }) {
  if (error) {
    return <div>Error!</div>;
  } else if (pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}
import Apps from './Home'
import Test from './Test'


import 'combs/developer/components/Title.css';

const AsyncMyRP = Loadable({
  loader: () => import('combs/developer/myrp/main'),
  loading: MyLoadingComponent,
});
import 'combs/developer/myrp/index.css';



const AsyncMdService = Loadable({
  loader: () => import('combs/developer/md-service/main.page'),
  loading: MyLoadingComponent,
});
import 'combs/developer/md-service/index.css';
import 'combs/developer/md-service/component/serivceitem.css';


const App = ({ location}) => {

  const currentKey = location.pathname.split('/')[1] || '/'
  const timeout = { enter: 500, exit: 500 }


  return (
    <Apps>
      <TransitionGroup component="main" className="page-main">
        <CSSTransition key={currentKey} timeout={timeout} classNames="fade" appear>
          <section className="page-main-inner">
            <Switch location={location}>
              <Route exact={true} path="/" component={Test} />
              <Route path="/dashboard" component={AsyncMyRP} />
              <Route path="/mdservice" component={AsyncMdService} />
            </Switch>
          </section>
        </CSSTransition>
      </TransitionGroup>
    </Apps>
  )
}

export default withRouter(App);

