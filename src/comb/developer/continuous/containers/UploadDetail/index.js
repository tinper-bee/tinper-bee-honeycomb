import React, {
  Component,
  PropTypes
} from 'react';
import {
  Con,
  Col,
  Breadcrumb,
  Row,
  Button,
  Table,
  PanelGroup,
  Badge,
  ButtonGroup,
  Tooltip,
  ProgressBar,
  Icon,
  Popover,
  Message,
  InputGroup,
  FormControl,
  Popconfirm,
} from 'tinper-bee';

import Tabs, {
  TabPane
} from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';


import {
  getQuickPublishInfo,
  quickPublish,
  getBranchListEncryp,
  getBranchList,
  updateGitInfo,
  onRepealAppAliOssUpload,
  getSshBranchListByidRsaPath,
  updateSshGitInfo
} from 'serves/CI';



import {
  GetNewUploadDetail,
  PublishLogs,
  GetVersionList,
  OndeleteAppUploadLog,
} from 'serves/appTile';

import {
  lintAppListData,
  checkEmpty
} from 'components/util';

import {
  GitInfo,
  ConfigCenter,
  VersionList,
  UploadNewVersion,
  UploadLog,
  UploadInfo,
  QuickPublish,
  GitEntityModal,
  MiroUploadModal,
} from '../../components';


import classnames from 'classnames';
import {
  err,
  success,
  warn
} from 'components/message-util';


import 'rc-tabs/assets/index.css';
import './index.less';

class UploadDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {}, //详情数据
      panelActiveKey: '1', //tab默认显示页签
      openUploadFlag: false, //显示上传模态框
      totalVersionInfo: {}, //当前选中版本的详情
      versionListData: [], // 版本列表
      isDone: true, //是否上传完成
      publishInfo: [], //一键部署信息
      showMiroUploadModal: false, //微服务上传模态框
      branchList: [], //分支列表
      branch: '', //当前分支
      showAddGitInfoModal: false, //是否显示添加git信息模态框
      gitInfo: {}, //git信息
      encryp: false, //是否是新输入的git信息
      error_app: false,
      retryFlag: false,
    };
    this.imageName = '';

  }

  componentDidMount() {
    let {
      location
    } = this.props;
    this.getDetail();
    this.getVersionList(0, location.query.retryFlag);

    if (location.query) {
      if (location.query.error_app) {
        this.setState({
          error_app: location.query.error_app
        })
      }

    }
  }

  /**
   * 获取应用详情
   */
  getDetail = () => {

    let {
      params,
      location
    } = this.props;


    GetNewUploadDetail(params.id, (response) => {
      let data = lintAppListData(response, null, null);
      if (data.error_code) {
        return err(data.error_message);
      }

      this.setState({
        data: data
      });

      if (data.gitUrl) {
        this.getBranchListEncryp(data);
      }

      //获取无版本号的镜像名,获取部署信息
      if (data.hasOwnProperty('dockerImageName') && typeof data.dockerImageName === 'string') {
        let imageName = data.dockerImageName.split(':');
        imageName.pop();
        this.imageName = imageName.join(':');
        this.getPublishInfo(this.imageName)();
      }

    })
  }

  retry = (data, index) => () => {
    let {
      versionListData
    } = this.state;
    versionListData[index].status = 'Form upload success';
    this.setState({
      versionListData
    });
    onRepealAppAliOssUpload(`?buildVersion=${data.buildVersion}&appUploadId=${data.appUploadId}&logId=${data.id}&isGitFlag=${data.isGitFlag}`)
      .then((response) => {
        let newData = response.data;
        if (newData.error_code) {
          return err(`${newData.error_code}:${newData.error_message}`);
        }

        this.getVersionList(data.key);
        //获取无版本号的镜像名,获取部署信息
        // if (data.hasOwnProperty('dockerImageName') && typeof data.dockerImageName === 'string') {
        //   let imageName = data.dockerImageName.split(':');
        //   imageName.pop();
        //   this.imageName = imageName.join(':');
        //   this.getPublishInfo(this.imageName)();
        // }

      })
  }

  /**
   * 获取部署信息
   * @param image 镜像名称
   */
  getPublishInfo = (image) => () => {
    getQuickPublishInfo(image).then((res) => {
      let data = res.data;
      if (!data) return;

      if (data.error_code) {
        err(data.error_message);
      } else {
        this.setState({
          publishInfo: data
        })
      }

    })
  }

  /**
   * 获取git分支
   */
  getBranchListEncryp = (data) => {

    let url = '',
      name = '',
      password = '';
    if (data.gitUrl) {
      url = data.gitUrl.split('::')[0];
      name = data.gitUserName;
      password = data.gitPassWord;
    }

    if (data.ssh_flag) {
      getSshBranchListByidRsaPath(data.idRsaPath, url)
        .then((res) => {
          let data = res.data;
          if (data.error_code) {
            return err(data.error_message)
          }
          this.setState({
            branchList: data.branckes
          })
        })
    } else {
      getBranchListEncryp(`?gitUrl=${url}&gitUserName=${encodeURIComponent(name)}&gitPassWord=${encodeURIComponent(password)}`)
        .then((res) => {
          let data = res.data;
          if (data.error_code) {
            return err(data.error_message)
          }
          this.setState({
            branchList: data
          })
        })
    }


  }

  /**
   * 设置上传完成
   * @param value
   */
  setUploadState = (value) => {
    //上传完成后更新版本列表数据
    if (value) {
      this.getVersionList(0);
    }
    this.setState({
      isDone: value
    })
  }

  /**
   * 获取版本信息
   * @param key 选中的是否是最后一个
   * @param retryFlag 是否重试
   */
  getVersionList = (key = 0, retryFlag = false) => {
    const {
      params
    } = this.props;
    if (isNaN(key)) {
      key = 0;
    }

    GetVersionList(params.id, (response) => {
      let res = lintAppListData(response);
      let selected = {};
      let selectedIndex = 0;
      res.forEach((item, index, ary) => {
        item.key = index;

        if (key === -1) {
          selectedIndex = ary.length - 1;
        } else {
          selectedIndex = key;
        }
        if (index === selectedIndex) {
          selected = item
        }

        //易发生重复调用
        if (retryFlag && index === 0) {
          this.retry(item)();
          selected = item;
        }
      });
      this.setState({
        versionListData: res
      });
      //更新选中的版本
      this.toggleBuildVersion(selected)();
    })
  }

  /**
   * 切换tab页签
   * @param panelActiveKey
   */
  handlePanelSelect = (panelActiveKey) => {
    this.setState({
      panelActiveKey: panelActiveKey
    });
  }

  /**
   * 点击选择版本
   * @param data 当前版本的信息
   * @returns {function()}
   */
  toggleBuildVersion = (data) => () => {

    this.setState({
      totalVersionInfo: data,
      error_app: false
    });

    if (data.status == "Form upload success" ||
      data.status == "Image building" ||
      data.status == "Build image success" ||
      data.status == "Image registry uploading") {

      this.setState({
        isDone: false,
      });

    } else if (data.status == "upload timeOut" || data.status == "Timeout") {
      this.setState({
        retryFlag: true,
        isDone: true,
      })
    } else {
      this.setState({
        isDone: true,
      });
    }
  }

  /**
   * 渲染版本按钮
   * @returns {Array}
   */
  renderBuildVersion = () => {
    let {
      totalVersionInfo,
      versionListData
    } = this.state;

    if (versionListData || versionListData instanceof Array) {

      return versionListData.map((item, index) => {

        return (
          <a
            className={classnames("version-number", {"version-active": item.buildVersion === totalVersionInfo.buildVersion})}
            ref="versionNumber"
            key={ index }
            onClick={this.toggleBuildVersion(item)}>
            {item.buildVersion}#
          </a>
        )
      })
    }
  }

  /**
   * 一键部署
   */
  handleQuickPublish = (envList) => {
    let {
      publishInfo,
      totalVersionInfo,
      data
    } = this.state;
    if (!publishInfo || publishInfo.length === 0)
      return warn('没有部署过的应用无法一键部署，请先部署应用。');

    let paramData = [];
    publishInfo.forEach((item) => {
      if (envList.indexOf(item.app_type) > -1) {
        let paramObj = {
          app_id: item.app_id,
          cpu: item.cpu,
          mem: item.mem,
          disk: item.disk,
          app_type: item.app_type,
          app_code: item.app_code,
          image: `${this.imageName}:${totalVersionInfo.version}`,
          upload_app_id: totalVersionInfo.appUploadId
        };
        paramData.push(paramObj);
      }
    });


    quickPublish(paramData)
      .then((res) => {
        let data = res.data;
        if (data.error_code)
          return err(data.error_message);

        window.location.href = `/fe/appManager/index.html#/publish_detail/${publishInfo[0].app_id}`;
      })

  }

  /**
   * 删除版本
   * @param record
   * @param index
   * @returns {Function}
   */
  onDeleteVersion = (record, index) => {
    let {
      versionListData
    } = this.state;
    let versionList = [];

    versionListData.forEach((item) => {
      versionList.push(item.buildVersion);
    })
    return () => {
      let param = {
        appUploadId: record.appUploadId,
        buildVersion: record.buildVersion,
        allBuildVersion: versionList.reverse().join(',')
      }

      OndeleteAppUploadLog(param, (response) => {
        let res = lintAppListData(response, null, '删除成功');
        if (!res || res.error_code)
          err(`删除失败: ${res.error_message}`)

        versionListData.splice(index, 1);
        this.setState({
          versionListData,
          totalVersionInfo: versionListData[0]
        })
      })
    }
  }

  /**
   * 显示上传应用的模态框
   */
  onShowUpload = () => {
    let {
      data
    } = this.state;
    if (data.status === 'Create App') {
      this.setState({
        showMiroUploadModal: true
      });
    } else {
      this.setState({
        openUploadFlag: true
      });
    }

  }

  /**
   * 隐藏上传应用的模态框
   */
  onHideUpload = () => {
    let {
      data
    } = this.state;
    if (data.status === 'Create App') {
      this.setState({
        showMiroUploadModal: false
      });
    } else {
      this.setState({
        openUploadFlag: false
      });
    }

  }

  /**
   * 捕获git路径变化
   * @param value
   */
  onUrlChange = (value) => {
    let {
      data
    } = this.state;

    data.gitUrl = `${data.gitUrl.split('::')[0]}::${value}`;

    this.setState({
      data
    })
  }

  /**
   * 添加git信息
   */
  addGitInfo = () => {
    this.setState({
      showAddGitInfoModal: true
    })
  }

  /**
   * 接受git信息
   */
  receiveGitInfo = (info) => {
    let {
      data
    } = this.state;
    let gitUrl = info.url.split('::')[0];
    data.gitUrl = info.url;
    data.gitUserName = info.name;
    data.gitPassWord = info.password;
    data.ssh_flag = info.ssh_flag;
    data.idRsaPath = info.idRsaPath;
    if (info.ssh_flag) {
      updateSshGitInfo(info.idRsaPath, data.appUploadId, gitUrl)
        .then((res) => {
          let resData = res.data;
          if (resData.error_code)
            return err(resData.error_message)
          success('git信息设置成功。');

        })
    } else {
      updateGitInfo(`?gitUserName=${info.name}&gitPassWord=${info.password}&gitUrl=${info.url}&appUploadId=${data.appUploadId}`)
        .then((res) => {
          let data = res.data;
          if (data.error_code)
            return err(data.error_message)
          success('git信息设置成功。');
        });
    }
    this.getBranchListEncryp(data);
    this.setState({
      gitInfo: info,
      encryp: true,
      data
    })
  }

  /**
   * 关闭git模态框
   */
  handleCloseModal = () => {
    this.setState({
      showAddGitInfoModal: false
    })
  }

  /**
   * 设置上传出错
   */
  handleErr = () => {
    this.setState({
      error_app: true
    })
  }


  render() {

    let {
      params,
      location
    } = this.props;
    let {
      retryFlag,
      uploadNow
    } = location.query;

    let {
      data,
      isDone,
      totalVersionInfo,
      versionListData,
      publishInfo,
      branchList,
      encryp,
      error_app,
    } = this.state;


    return (
      <Col md={12}>
        <UploadInfo
          data={ data }
          uploadId={ params.id }
          totalVersionInfo={ totalVersionInfo }
          onShowUpload={ this.onShowUpload }
          canPublish={ publishInfo.hasOwnProperty('app_id') }
          onDone={ this.setUploadState }
          onPublish={ this.handleQuickPublish }
          isDone={ isDone }
          retryFlag={ retryFlag }
          error_app={ error_app }
          onErr={ this.handleErr }
          publishInfo={ publishInfo }
          uploadNow={ uploadNow }
          renderBuildVersion={ this.renderBuildVersion }
        />
        <Col md={12} className="detail" style={{marginTop: 30, padding: '0 40px'}}>
          <Tabs
            defaultActiveKey={'1'}
            renderTabBar={() => <ScrollableInkTabBar />}
            renderTabContent={() => <TabContent />}>
            <TabPane tab="日志" key="1">
              <UploadLog
                renderVersion={ this.renderBuildVersion }
                data={ totalVersionInfo }
                isDone={ isDone }
                error_app={ error_app }
              />
            </TabPane>
            <TabPane tab="版本" key="2">
              <VersionList
                list={versionListData}
                onShowUpload={ this.onShowUpload }
                refreshList={ this.getVersionList }
                onDeleteVersion={ this.onDeleteVersion }
                retry = { this.retry }
                dockerImageName = {data.dockerImageName}
              />
            </TabPane>
            <TabPane tab="配置文件" key="3">
              <ConfigCenter
                confCenterId={ totalVersionInfo.confCenterId }
                appId={ data.appUploadId }
                appCode={ data.appCode }
                isDone={ isDone }
              />
            </TabPane>
            <TabPane tab="一键部署" key="4">
              <QuickPublish
               data={ publishInfo }
               onPublish={ this.handleQuickPublish }
               version={ totalVersionInfo.version }
               appCode={ data.appCode }
               refresh={ this.getPublishInfo(this.imageName)}
              />
              {
                //QuickPublish(publishInfo, this.handleQuickPublish, totalVersionInfo.version)
              }
            </TabPane>
            <TabPane tab="代码源" key="5">
              <GitInfo
                data={ data }
                branchList={ branchList }
                onUrlChange={ this.onUrlChange }
                onAdd={ this.addGitInfo }
              />
            </TabPane>
          </Tabs>

        </Col>
        <UploadNewVersion
          showModal={this.state.openUploadFlag}
          hideModal={this.onHideUpload}
          list={data}
          refreshList={this.getVersionList}
          encryp={ encryp }
        />
        <GitEntityModal
          show={ this.state.showAddGitInfoModal }
          onEnsure={ this.receiveGitInfo }
          onClose={ this.handleCloseModal }
        />
        <MiroUploadModal
          showModal={this.state.showMiroUploadModal}
          hideModal={this.onHideUpload}
          list={data}
          refresh={ () => { this.getDetail(); this.getVersionList(0);}}
        />
      </Col>

    )
  }

}

UploadDetail.contextTypes = {
  router: PropTypes.object
};

export default UploadDetail;
