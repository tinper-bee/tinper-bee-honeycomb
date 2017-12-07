import React, {Component, PropTypes} from 'react';
import {Row, Col, Message, Label, Button, FormControl} from 'tinper-bee';
import imgempty from 'assets/img/taskEmpty.png';
import classnames from 'classnames';
import Checkbox from 'rc-checkbox';

import {editQuickInfo} from 'serves/CI';
import {err, success, warn} from 'components/message-util';

import {ENV} from '../../constant';

import 'rc-checkbox/assets/index.css';
import './index.less';

class QuickPublish extends Component {

  state = {
    edit: false,
    mem: '',
    cpu: '',
    disk: '',
    env: 'dev',
    checkedAry: []
  }

  componentDidMount() {
    let {data} = this.props;
    if (!data.length || data.length === 0)return;
    this.setState({
      cpu: data[0].cpu,
      mem: data[0].mem,
      disk: data[0].disk,
      env: data[0].app_type
    })
  }

  /**
   * 编辑
   */
  handleEdit = () => {
    this.setState({
      edit: true
    })
  }

  /**
   * 取消编辑
   */
  closeEdit = () => {
    this.setState({
      edit: false,
      cpu: '',
      mem: '',
      disk: '',
    })
  }

  /**
   * 捕获输入框改变
   */
  handleInputChange = (state) => (e) => {
    this.setState({
      [state]: e.target.value
    })
  }

  /**
   * 选中环境
   * @param env
   */
  checkEnv = (env) => (e) => {
    let { checkedAry } = this.state;

    if(e.target.checked){
      checkedAry.push(env);
    }else{
      checkedAry.splice(checkedAry.indexOf(env), 1);
    }
    this.setState({
      checkedAry
    })
  }

  /**
   * 保存
   */
  handleSave = () => {
    let {mem, cpu, disk, env} = this.state;
    let {data, refresh} = this.props;
    let totalInfo = {};
    data.forEach((item) => {
      if (item.app_type === env) {
        totalInfo = item;
      }
    });
    let quickData = {
      "id": totalInfo.id,
      "cpu": cpu,
      "mem": mem,
      "disk": disk,
      "app_code": totalInfo.app_code,
      "app_name": totalInfo.app_name
    }

    editQuickInfo(quickData)
      .then((res) => {
        let resData = res.data;
        if (resData.error_code) {
          return err(`${resData.error_code}:${resData.error_message}`)
        }
        this.closeEdit();
        success('修改成功。');

        refresh && refresh();
      })
  }

  /**
   * 修改环境变量
   * @param env
   */
  changeEnv = (env) => () => {
    let {data} = this.props;
    let totalInfo = {};
    data.forEach((item) => {
      if (item.app_type === env) {
        totalInfo = item;
      }
    });
    this.setState({
      env,
      cpu: totalInfo.cpu,
      mem: totalInfo.mem,
      disk: totalInfo.disk,
    })
  }

  /**
   * 捕获部署
   */
  handlePublish = () => {
    let { onPublish } = this.props;
    let { checkedAry } = this.state;

    if(checkedAry.length === 0)
      return warn('请至少选择一个部署环境。');

    onPublish && onPublish(checkedAry);
  }

  render() {
    let {data, onPublish, version} = this.props;
    let {edit, mem, cpu, disk} = this.state;
    if (data.length === 0) {
      return (
        <Col md={12} className="text-center">
          <img src={imgempty} width={200} alt="内容为空"/>
          <p>当前应用还没有部署过，需要部署一次后，才能进行一键部署。</p>
        </Col>
      )
    }

    return (
      <Col md={6} className="quick-publish">
        <Col md={12}>
          <Button
            className="btn"
            shape="squared"
            colors="primary"
            onClick={ this.handleEdit }
          >
            修改配置
          </Button>
          <Button
            className="btn btn-right"
            shape="squared"
            colors="primary"
            onClick={ this.handlePublish }>
            一键部署
          </Button>
        </Col>
        <Col sm={6}>
          <Row>
            <Col sm={4} className="label">
              <Label>
                应用名称
              </Label>
            </Col>
            <Col sm={8}>
              <Label>
                {
                  data[0].app_name
                }
              </Label>
            </Col>
          </Row>
        </Col>
        <Col sm={6}>
          <Row>
            <Col sm={4} className="label">
              <Label>
                当前版本
              </Label>
            </Col>
            <Col sm={8}>
              <Label>
                {
                  version
                }
              </Label>
            </Col>
          </Row>
        </Col>


        <Col md={12}>
          <ul className="info-env">
            {
              ENV.map((item) => {
                return (
                  <li className="info-env-item" key={ item.key }>
                    <Checkbox onChange={ this.checkEnv(item.value) } />
                    <span onClick={ this.changeEnv(item.value) } className={classnames(`info-env-item-label info-env-${item.key}`, {'active': this.state.env === item.value})}>
                    { item.name }
                  </span>
                  </li>
                )
              })
            }
          </ul>
        </Col>
        <Col md={12}>
          {
            data.map((item) => {

              if (item.app_type === this.state.env) {
                return (
                  <Row>
                    <Col sm={4} className="label">
                      <Label>
                        CPU
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {
                        edit ? (
                          <FormControl
                            value={ cpu }
                            onChange={ this.handleInputChange('cpu') }
                          />
                        ) : (
                          <Label>
                            {
                              item.cpu
                            }
                          </Label>
                        )
                      }

                    </Col>
                    <Col sm={4} className="label">
                      <Label>
                        内存
                      </Label>
                    </Col>

                    <Col sm={8}>
                      {
                        edit ? (
                          <FormControl
                            value={ mem }
                            onChange={ this.handleInputChange('mem') }
                          />
                        ) : (
                          <Label>
                            {
                              `${item.mem}M`
                            }
                          </Label>
                        )
                      }
                    </Col>
                    <Col sm={4} className="label">
                      <Label>
                        硬盘
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {
                        edit ? (
                          <FormControl
                            value={ disk }
                            onChange={ this.handleInputChange('disk') }
                          />
                        ) : (
                          <Label>
                            {
                              `${item.disk}M`
                            }
                          </Label>
                        )
                      }
                    </Col>
                  </Row>
                )
              } else {
                return null;
              }
            })
          }
        </Col>


        {
          edit ? (
            <Col sm={12}>
              <Button
                className="btn"
                shape="squared"
                onClick={ this.closeEdit }>
                取消
              </Button>
              <Button
                className="btn btn-right"
                shape="squared"
                colors="primary"
                onClick={ this.handleSave }>
                保存
              </Button>

            </Col>
          ) : null
        }


      </Col>
    )
  }


}


export default QuickPublish;
