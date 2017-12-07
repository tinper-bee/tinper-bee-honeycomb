import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {Clipboard} from 'tinper-bee';

import style from '../../index.css';
class MacTab extends Component {

  render(){

    let {InstallingType1, InstallingType2, resourceType, docker_ssh, add_bash,
        edit_profile, docker_restart, all2} = this.props;
    return(
      <ul >
        <li className="little-title" style={{marginTop:'20'}}>
         <span> 在 Windows/Mac 上</span>
          <a href="https://www.docker.com/products/docker-toolbox" target="_blank"
             style={{color:'red',fontWeight:'400',fontSize:'medium'}}>下载</a>
          <span> 并安装docker-toolbox</span>
        </li>
        <li className="little-title">
          根目录启动start.sh进行初始化，然后依次执行以下命令
        </li>
        <li className="code">
          <p>
            <span>{docker_ssh}</span>
          </p>
          <p><span>{add_bash}</span>
          </p>
          <p>
            <span>{edit_profile}</span>
          </p>
          <p>
            <span>{docker_restart}</span>
            <Clipboard text={all2} action="copy">
              <i className="cl cl-wordfiles" />
            </Clipboard>
          </p>
        </li>

        <li className="little-title">
          安装 Agents
        </li>
        <li className="code">
          <p>
            {resourceType == "1" ?
              ( <div>
                <span>{InstallingType1}</span>
                <Clipboard text={InstallingType1}>
                  <i className="cl cl-wordfiles"/>
                </Clipboard>
              </div> ) :
              ( <div>
                <span>{InstallingType2}</span>
                <Clipboard text={InstallingType2}>
                  <i className="cl cl-wordfiles"/>
                </Clipboard>
              </div> )
            }
          </p>
        </li>
      </ul>
    )
  }
}
export default MacTab;
