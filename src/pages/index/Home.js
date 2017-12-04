import React from 'react'
import {Route} from 'mirrorx'

import { Select,FormControl } from 'tinper-bee';
import '../../assets/css/index.css'

import Header from 'components/header/Header'
import Sidebar from 'components/sidebar/Sidebar'
import UserMenu from 'components/usermenu/UserMenu'
import PageContent from 'components/pagecontent/PageContent'




const Home = () => (
  <div className="honey-container">
    <Sidebar />
    <div className="page-layout">
        <Header/>
        <PageContent />
    </div>
  </div>
)

export default Home
