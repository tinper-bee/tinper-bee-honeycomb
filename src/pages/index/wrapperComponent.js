import React,{createElement,Component} from 'react'
import {Route} from 'mirrorx'

import { Select,FormControl } from 'tinper-bee';
import '../../assets/css/index.css'

import Header from 'components/header/Header'
import Sidebar from 'components/sidebar/Sidebar'
import UserMenu from 'components/usermenu/UserMenu'
import PageContent from 'components/pagecontent/PageContent'
import { Transition,Fade } from 'react-transition-group'

const duration = 300;

const defaultStyle = {
  transition: `opacity ${duration}ms ease-in`,
  opacity: 0,
}

const transitionStyles = {
  entering: { opacity: 0.01},
  entered: { opacity: 1 },
};


export default function wrapperComponent(child,source) {

  return class wrappers extends Component {

    constructor(props, context) {
      super(props, context);

      this.state = { show: false }

    }
    render() {
      return (
        <div className="honey-container">
            <Sidebar />
            <div className="page-layout">
                <Header/>
                <PageContent>
                  <Transition in={!this.props.show} appear={true} timeout={duration}>
                    {(state) => (
                      <div style={{
                        ...defaultStyle,
                        ...transitionStyles[state]
                      }}>
                        {createElement(child)}
                      </div>
                    )}
                  </Transition>
                </PageContent>
            </div>
        </div>
      )
    }

  }

}

