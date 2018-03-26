import React,{Component} from 'react'
import mirror, {actions, connect} from 'mirrorx'


class UrlApp extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {}

  }
  onToggle(value) {
    this.setState({expanded: value});
  }
  render(){
    let {url} = this.props;
    return (
        <iframe src={url} frameborder="0" marginheight="0" marginwidth="0" scrolling="no"></iframe>
    )
  }

}


export default UrlApp
