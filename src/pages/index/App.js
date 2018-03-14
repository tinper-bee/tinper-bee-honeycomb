import React, {Component} from 'react'
import {Route,Link,Router,Switch,withRouter,actions, connect} from 'mirrorx'
import Loadable from 'react-loadable';
import {Loading} from 'tinper-bee';
import { Transition,TransitionGroup,CSSTransition} from 'react-transition-group'
import 'honeyAssets/css/animation.css'
//加载路由节点
import routes from '../../router/index'

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0.01},
  entered: { opacity: 1 },
};

//warper
import Apps from './Apps';

//检查侧边栏的路由是否注册
function checkRoute(menus,route) {
  if (menus = JSON.stringify(menus).match(route.path.replace(/\//,'')) != null){
    return  (<Route
      path={route.path}
      exact={route.exact}
      component={route.component}
    />)
  }
}


class App extends Component {

  constructor(props, context) {
    super(props, context);
  }
  render() {
    const {menus,location} = this.props;
    const currentKey = location.pathname.split('/')[1] || '/'
    const timeout = { enter: 500, exit: 500 }

    return (
      <Apps>
        <TransitionGroup component="main" className="page-main">
          <CSSTransition key={currentKey} timeout={timeout} classNames="fade" appear>
            <section className="page-main-inner">
              <Switch location={location}>
                {
                  routes.map((route, index) => (
                    // Render more <Route>s with the same paths as
                    // above, but different components this time.
                    checkRoute(menus,route)
                  ))}
              </Switch>
            </section>
          </CSSTransition>
        </TransitionGroup>
      </Apps>
    )
  }
}


export default connect(state => state.sidebar)(withRouter(App))

