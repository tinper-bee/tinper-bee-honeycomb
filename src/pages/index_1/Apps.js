import React,{createElement,Component} from 'react'
import {Route} from 'mirrorx'
import { Transition,TransitionGroup} from 'react-transition-group'

import { Select,FormControl } from 'tinper-bee';
import 'honeyAssets/css/index.css'

import Header from 'components/platform/header/Header'
import UserCenter from 'components/usercenter/UserCenter'
import PageContent from 'components/pagecontent/PageContent'

import Tile from 'containers/tile'

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0.01},
  entered: { opacity: 1 },
};


class App extends Component {

  constructor(props, context) {
    super(props, context);

    this.state = { show: false }

  }
  render() {

    return (
      <div className="honey-container">
        <div className="page-layout">
          <Header />
          <UserCenter />
          <PageContent>
            <Transition in={!this.props.show} appear={true} timeout={duration}>
              {(state) => (
                <div style={{
                  ...defaultStyle,
                  ...transitionStyles[state]
                }}>
                  {/*{this.props.children}*/}
                  <Tile />
                </div>
              )}
            </Transition>
          </PageContent>
        </div>
      </div>
    )
  }
}

export default App;
