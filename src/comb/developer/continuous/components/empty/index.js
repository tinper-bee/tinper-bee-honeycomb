import React, { Component } from 'react';
import { Col, Button } from 'tinper-bee';
import imgempty from 'assets/img/taskEmpty.png';


const defaultProps = {
  noConfig: true
}

class Empty extends Component {
  constructor(props){
    super(props);
  }

  render() {
    let { noConfig, onExtract } = this.props;
    return (
      <Col md={12} className="config-empty">
        <img src={imgempty} alt=""/>
        {
          noConfig ? (
            <p>当前应用下还没有配置文件</p>
          ) : (
            <div>
              <p>当前应用下还没有配置文件，需要您提取一下哦</p>

              <Button
                shape="squared"
                colors="primary"
                onClick={ onExtract }>
                提取配置文件
              </Button>
            </div>
          )
        }

      </Col>
    )
  }
}

Empty.defaultProps = defaultProps;

export default  Empty;
