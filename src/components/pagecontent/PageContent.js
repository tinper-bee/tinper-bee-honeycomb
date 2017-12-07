import React,{Component} from 'react'
import {Link} from 'mirrorx'
import  './PageContent.css'

class PageContent extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {

    }

  }
  render(){

    return (
      <div className="honeycomb-layout">
        {this.props.children}
      </div>
    )
  }

}

export default PageContent
