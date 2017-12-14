import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';
import {Clipboard} from 'tinper-bee';

import '../../index.css';
class LinuxTab extends Component {

  render(){
    let {dev_sh, docker_service, dev_conf, docker_reload, docker_enable,
      docker_start ,InstallingType1, InstallingType2, resourceType, all1} = this.props;
    return(
      <ul >
        <li className="little-title" style={{marginTop:'20',fontWeight:'400',fontSize:'medium'}}>
         建议使用CentOS7、RedHat7、Ubuntu16.04、Debian8 及以上版本的 linux 系统
        </li>
        <li className="little-title" style={{marginTop:'20'}}>
         在 Linux 上安装 docker
        </li>
        <li className="code">
          <p><span>{dev_sh}</span>
            <Clipboard text={dev_sh} action="copy">
              <i className="cl cl-wordfiles" />
            </Clipboard>
          </p>
        </li>
        <li className="little-title">
          依次执行下列命令
        </li>
        <li className="code">
          <p>
            <span>{docker_service}</span>
          </p>
          <p>
            <span>{dev_conf}</span>
          </p>
          <p>
            <span>{docker_reload}</span>
          </p>
          <p>
            <span>{docker_enable}</span>
          </p>
          <p>
            <span>{docker_start}</span>
            <Clipboard text={all1}>
              <i className="cl cl-wordfiles" />
            </Clipboard>
          </p>
        </li>
        <li className="little-title">
          安装 Agents
        </li>
        <li className="code">
          <p>
            { resourceType == "1" ?
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
export default LinuxTab
