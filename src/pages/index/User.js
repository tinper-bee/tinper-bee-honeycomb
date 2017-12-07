import React,{Component} from 'react'
import {Route} from 'mirrorx'

import UserInfo from 'components/UserInfo'
import Header from 'components/header/Header'
import Sidebar from 'components/sidebar/Sidebar'
import PageContent from 'components/pagecontent/PageContent'

class User extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {

    }

  }
  render(){
    return (
      <div className="honey-container">
        <Sidebar />
        <div className="page-layout">
          <Header/>
          <PageContent />
        </div>
      </div>
    )
  }

}

export default User
