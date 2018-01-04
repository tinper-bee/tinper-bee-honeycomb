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

//加载业务节点
import Apps from './Apps'

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



const AsyncRegister = Loadable({
  loader: () => import('combs/tmc/modules/if/pages/if_register/index'),
  loading: MyLoadingComponent,
});
import 'combs/tmc/modules/if/pages/if_register/index.less';


const AsyncTable = Loadable({
  loader: () => import('combs/tmc/modules/bd/pages/bd_project/index'),
  loading: MyLoadingComponent,
});
import 'combs/tmc/modules/bd/pages/bd_project/index.less';
import 'combs/tmc/utils/publicStyle.less';
import 'combs/tmc/utils/variables.less';
import 'combs/tmc/containers/Refer/index.less';
import 'combs/tmc/modules/fm/pages/fm_financepay/index.less';


const AsyncMyasset = Loadable({
  loader: () => import('combs/tmc/modules/if/pages/if_myasset/index'),
  loading: MyLoadingComponent,
});
import 'combs/tmc/modules/if/pages/if_myasset/index.less';
import 'combs/tmc/modules/if/containers/myassetmodal/index.less';
import 'combs/tmc/modules/if/containers/Writemodal/index.less';

const AsyncCreditmonitor= Loadable({
  loader: () => import('combs/tmc/modules/fm/pages/fm_creditmonitor/index'),
  loading: MyLoadingComponent,
});
import 'combs/tmc/modules/fm/pages/fm_creditmonitor/index.less';


const AsyncContract= Loadable({
  loader: () => import('combs/tmc/modules/fm/pages/fm_contract/index'),
  loading: MyLoadingComponent,
});
import 'combs/tmc/modules/fm/pages/fm_contract/index.less';

const App = ({ location}) => {

  const currentKey = location.pathname.split('/')[1] || '/'
  const timeout = { enter: 500, exit: 500 }


  return (
    <Apps>
      <TransitionGroup component="main" className="page-main">
        <CSSTransition key={currentKey} timeout={timeout} classNames="fade" appear>
          <section className="page-main-inner">
            <Switch location={location}>
              <Route exact={true} path="/default" component={AsyncMdService} />
              <Route path="/dashboard" component={AsyncMyRP} />
              <Route path="/mdservice" component={AsyncMdService} />
              <Route path="/register" component={AsyncRegister} />
              <Route path="/table" component={AsyncTable} />
              <Route path="/myasset" component={AsyncMyasset} />
              <Route path="/creditmonitor" component={AsyncCreditmonitor} />
            </Switch>
          </section>
        </CSSTransition>
      </TransitionGroup>
    </Apps>
  )
}

export default withRouter(App);

