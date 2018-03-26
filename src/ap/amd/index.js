import React,{Component} from 'react'
import mirror, {actions, connect} from 'mirrorx'


class AmdApp extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {}

  }
  render(){
    const {url,modelName} = this.props;
    const html = require(url).init();

    return (
      <div className={modelName}>
           <div className="content" dangerouslySetInnerHTML={{__html: html}} />
      </div>
    )
  }
}

export default AmdApp