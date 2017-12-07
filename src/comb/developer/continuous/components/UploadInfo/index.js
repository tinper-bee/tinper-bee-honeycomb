import React, {Component, PropTypes} from 'react';
import {Row, ProgressBar, Col, Icon, Button, Message, Badge, Popconfirm} from 'tinper-bee';
import classnames from 'classnames';

import {ImageIcon} from 'components/ImageIcon';
import Title from 'components/Title';
import Checkbox from 'rc-checkbox';

import {checkEmpty} from 'components/util';

import {
  GetUploadProgress,
  DownloadWar,
} from 'serves/appTile';

import {
  lintAppListData,
  formateDate,
  getCookie
} from 'components/util';


import {err, success, warn} from 'components/message-util';
import {ENV} from '../../constant';
import {handleDownload} from 'lib/utils';

import 'rc-checkbox/assets/index.css';


import './index.less';

function showPackageName(name) {
  if (/http[s]?:\/\//.test(name)) {
    let urlAry = name.split('/');
    name = urlAry.pop();
  } else if (/_/.test(name)) {
    let nameAry = name.split('_');
    nameAry.splice(0, 1);
    name = nameAry.join('_');
  }
  return name;
}


class UploadInfo extends Component {
  constructor(props, content) {
    super(props, content);
    this.state = {
      uploadNow: props.uploadNow || 0, //上传进度
      showUploadProgress: false, //是否显示上传进度条
      activeEnv: 'dev', //当前展示推送的环境信息
      checkedAry: []
    }
    this.timer = null;
    this.destory = false;
  }

  componentDidMount() {
    let {totalVersionInfo, isDone, error_app, data} = this.props;

    if (!isDone) {
      this.setState({
        showUploadProgress: true
      });
      if (totalVersionInfo.hasOwnProperty('appUploadId') && totalVersionInfo.appUploadId && totalVersionInfo.status !== 'Create App' && !error_app) {
        this.getUploadProgress(totalVersionInfo.appUploadId, totalVersionInfo.buildVersion);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    let {totalVersionInfo, isDone, error_app, retryFlag, data} = nextProps;

    if (!isDone && !error_app) {
      this.setState({
        showUploadProgress: true
      })

      //如果切换到新的版本，清除之前的请求。
      if (totalVersionInfo.buildVersion !== this.props.totalVersionInfo.buildVersion) {
        clearTimeout(this.timer);
      }

      if (totalVersionInfo.hasOwnProperty('appUploadId') && totalVersionInfo.appUploadId && totalVersionInfo.status !== 'Create App' && !error_app) {
        clearTimeout(this.timer);
        this.getUploadProgress(totalVersionInfo.appUploadId, totalVersionInfo.buildVersion);
      }
    }
  }

  componentWillUnmount() {
    this.destory = true;
    clearTimeout(this.timer);
  }


  /**
   * 获取上传的进度
   * @param appUploadId
   * @param buildVersion
   */
  getUploadProgress = (appUploadId, buildVersion) => {
    console.log('progress----', this.timer);
    //if (!this.timer) {
      this.timer = setTimeout(() => {
        this.getProgress(appUploadId, buildVersion)
      }, 100)
    //}

  }

  /**
   *
   * @param appUploadId
   * @param buildVersion
   */
  getProgress = (appUploadId, buildVersion) => {
    let {uploadNow} = this.state;
    let {onDone, onErr} = this.props;

    GetUploadProgress(appUploadId, buildVersion)
      .then((response) => {
        let data = response.data;
        if (data.error_code) {
          if (this.state.uploadNow < 1) {
            this.setState({
              showUploadProgress: false
            });

            onErr && onErr();
          }
          clearTimeout(this.timer);
          return err(data.error_message);
        } else {
          if (data == 1) {
            if (uploadNow != 0 && uploadNow < data) {
              success('应用构建成功。');
            }
            clearTimeout(this.timer);
            this.setState({
              showUploadProgress: false
            });
            if (onDone) {
              onDone(true)
            }

          } else if (data >= 0 && data < 1) {

            this.setState({
              uploadNow: data
            });
            if (!this.destory) {
              this.timer = setTimeout(() => (this.getProgress(appUploadId, buildVersion)), 1000);
            }
          } else {
            clearTimeout(this.timer);
            this.setState({
              showUploadProgress: false
            });
            if (onDone) {
              onDone(true)
            }
          }

        }
      })
      .catch((e) => {
        this.setState({
          showUploadProgress: false
        });
        clearTimeout(this.timer);
      })
  }

  /**
   * 权限管理
   */
  goToAuth = () => {
    let {data} = this.props;

    this.context.router.push(`/auth/${data.appName}?id=${data.appUploadId}&providerId=${getCookie('u_providerid')}&busiCode=app_upload&userId=${data.userId}`);
  }

  /**
   * 部署当前版本
   */
  handlePublish = () => {
    let {uploadId} = this.props;
    let {totalVersionInfo} = this.props;

    if (totalVersionInfo.status === 'Upload success') {
      this.context.router.push(`/publish/${uploadId}?version=${totalVersionInfo.version}`);
    }

  }


  renderQuickPublish = () => {
    let {publishInfo} = this.props;
    let {activeEnv} = this.state;

    if (!publishInfo || publishInfo.length === 0) {
      return "当前应用还没有部署过，需要部署一次后，才能进行一键部署。";
    }
    return (
      <div className="quick-publish-info">
        <div className="title">{ publishInfo[0].app_name}</div>
        <span>请选择要部署的环境</span>
        <ul className="info-env">
          {
            ENV.map((item) => {
              return (
                <li className="info-env-item" key={ item.key }>
                  <Checkbox onChange={ this.checkEnv(item.value) }/>
                  <span onClick={ this.changeEnv(item.value) }
                        className={classnames(`info-env-item-label info-env-${item.key}`, {'active': activeEnv === item.value})}>
                    { item.name }
                  </span>
                </li>
              )
            })
          }
        </ul>
        {
          publishInfo.map((item) => {
            if (item.app_type === activeEnv) {
              return (
                <ul className="hardware-info">
                  <li className="hardware-info-item">
                    <span>
                      CPU
                    </span>
                    <span className="data">
                      { item.cpu }
                    </span>
                  </li>
                  <li className="hardware-info-item">
                    <span>
                      内存
                    </span>
                    <span className="data">
                      { item.mem}
                    </span>
                  </li>
                  <li className="hardware-info-item">
                    <span>
                      硬盘
                    </span>
                    <span className="data">
                      { item.disk }
                    </span>
                  </li>
                  <li className="hardware-info-item">
                    <span>
                      实例
                    </span>
                    <span className="data">
                      { item.instances }
                    </span>
                  </li>
                </ul>
              )
            } else {
              return null;
            }
          })
        }
      </div>
    )
  }

  /**
   * 改变推送中当前选中的环境
   * @param value
   */
  changeEnv = (value) => () => {
    this.setState({
      activeEnv: value
    })
  }

  /**
   * 选中环境
   * @param env
   */
  checkEnv = (env) => (e) => {
    let {checkedAry} = this.state;
    if (e.target.checked) {
      checkedAry.push(env);
    } else {
      checkedAry.splice(checkedAry.indexOf(env), 1);
    }
    this.setState({
      checkedAry
    })
  }

  /**
   * 捕获部署
   */
  handleQuickPublish = () => {
    let {onPublish} = this.props;
    let {checkedAry} = this.state;
    if (checkedAry.length === 0)
      return warn('请至少选择一个部署环境。');

    onPublish && onPublish(checkedAry);

  }


  render() {
    let {
      data,
      renderBuildVersion,
      onShowUpload,
      totalVersionInfo,
      onPublish,
      canPublish,
      publishInfo,
      retryFlag,
      error_app
    } = this.props;

    let {
      uploadNow,
      showUploadProgress,
    } = this.state;

    return (
      <div>
        <Row>
          <Title name={data.appName}/>
          <div className="detail-bg">
            <div className="tile-cricle">
              <div className="tile-img">
                {
                  ImageIcon(data.iconPath, 'head-img')
                }
              </div>
            </div>
            <span className="title">
        {data.appName}
              <span className="state">
        {!data.publishTime && <Badge colors="warning">待部署</Badge>}
        </span>
        </span>
            <span className="health">
        {
          showUploadProgress ?
            (
              <ProgressBar
                active={ error_app ? false : true}
                colors={ error_app ? "danger" : "success"}
                size="sm" now={uploadNow * 100}
                label={`${uploadNow * 100}%`}
              />
            ) : null
        }
        </span>
            <span className="time">
        <Icon type="uf-time-c-o"/>
              {formateDate(data.createTime)}
        </span>
            <div className="btn-group">
              <Popconfirm placement="bottom" onClose={ this.handleQuickPublish } content={ this.renderQuickPublish() }>
                <span
                  className={classnames('btn', {'no-allow': !canPublish})}
                >
                  <i className="cl cl-clouddeploy"/>
                  推送
                </span>
              </Popconfirm>
              {
                data.adminAuth === 'true' ? (
                  <span
                    className="btn"
                    onClick={this.goToAuth}>
                     <i className="cl cl-permission"/>
                      权限管理
                  </span>
                ) : null
              }

              {
                data.status === 'Create App' ? (
                  <span
                    className="btn"
                    onClick={onShowUpload}>
                      <Icon type="uf-upload"/>
                      上传应用包
                </span>
                ) : (
                  <span
                    className="btn"
                    onClick={this.handlePublish}>
                      <i className="cl cl-release"/>
                      部署
                </span>
                )
              }
            </div>
          </div>
        </Row>


        <Row className="detail" style={{marginTop: 46, padding: '0 40px'}}>
          <Col md={12} style={{paddingLeft: 40}}>
            <Row>
              <Col md={6} sm={6}>
                <div className="ipass-list">
                  <div className="label">基础镜像</div>
                  <div className="value">{checkEmpty(data.baseImage)}</div>
                </div>
              </Col>
              <Col md={6} sm={6}>
                <div className="ipass-list">
                  <div className="label">镜像名称</div>
                  <div className="value">{checkEmpty(data.imageName)}</div>
                </div>
              </Col>
              <Col md={12}>
                <div className="ipass-list build-version-row">
                  <div className="label">构造版本</div>
                  <div
                    className="value build-version">
                    {renderBuildVersion()}
                    {
                      data.status !== 'Create App' ? (
                        <Button
                          className="instance-btn"
                          onClick={onShowUpload}
                          size="sm"
                          colors="primary"
                          shape="squared"
                          bordered>
                          <Icon type="uf-upload"/>
                          构建新版本
                        </Button>
                      ) : null
                    }

                  </div>
                </div>
              </Col>
              <Col lg={6} md={12}>
                <div className="ipass-list build-info" style={{marginTop: 5}}>
                  <div className="label">应用包名</div>
                  <div className={classnames("value", {"download": totalVersionInfo.uploadPath})}
                       onClick={handleDownload(totalVersionInfo.uploadPath)}>
                    { checkEmpty(showPackageName(totalVersionInfo.uploadPath)) }

                  </div>
                </div>
                <div className="ipass-list build-info">
                  <div className="label">应用版本</div>
                  <div className="value">{ totalVersionInfo.version }</div>
                </div>
                <div className="ipass-list build-info">
                  <div className="label">更新时间</div>
                  <div
                    className="value">
                    { formateDate(totalVersionInfo.ts) }
                  </div>
                </div>

              </Col>

            </Row>

          </Col>

        </Row>

      </div>
    )
  }
}

UploadInfo.contextTypes = {
  router: PropTypes.object
};

export default UploadInfo;
