import React,{Component} from 'react'
import {Link} from 'mirrorx'
import './index.css';

class User extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {

    }
  }
  render(){
    return (
      <div className={'user'}>
        hello user !!!
      </div>
    )
  }

}

export default User