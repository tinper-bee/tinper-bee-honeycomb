import React,{createElement,Component} from 'react'
import {Route} from 'mirrorx'

import { Select,FormControl } from 'tinper-bee';
import '../../assets/css/index.css'

import Header from 'components/header/Header'
import Sidebar from 'components/sidebar/Sidebar'
import UserMenu from 'components/usermenu/UserMenu'
import PageContent from 'components/pagecontent/PageContent'



export default function wrapperComponent(child,source) {

  return class wrappers extends Component {

    constructor(props, context) {
      super(props, context);

    }
    render() {
      return (
        <div className="honey-container">
            <Sidebar />
            <div className="page-layout">
                <Header/>
                <PageContent>
                  {createElement(child)}
                </PageContent>
            </div>
        </div>
      )
    }

  }

}

