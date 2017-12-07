import React, {Component, PropTypes} from 'react';
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

import Tabs, {TabPane} from 'rc-tabs';
import TabContent from 'rc-tabs/lib/TabContent';
import ScrollableInkTabBar from 'rc-tabs/lib/ScrollableInkTabBar';
import{getQuickPublishInfo, quickPublish} from 'serves/CI';

import {
  GetNewUploadDetail,
  PublishLogs,
  GetVersionList,
  OndeleteAppUploadLog,
  OnRepealAppAliOssUpload,
} from 'serves/appTile';
import {lintAppListData} from 'components/util';

import { MiroAppInfo } from '../../components';

import classnames from 'classnames';

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
      publishInfo: {}, //一键部署信息
    };
    this.imageName = '';

  }

  componentDidMount() {
    this.getDetail();
    this.getVersionList();
  }

  /**
   * 获取应用详情
   */
  getDetail = () => {

    let {params, location} = this.props;
    let {retryFlag} = location.query;

    GetNewUploadDetail(params.id, (response) => {
      let data = lintAppListData(response, null, null);
      if (data.error_code) {
        return Message.create({
          content: data.error_message,
          color: 'danger',
          duration: 4.5
        });
      }

      this.setState({
        data: data
      });
      //获取无版本号的镜像名,获取部署信息
      if(data.hasOwnProperty('dockerImageName') && typeof data.dockerImageName === 'string'){
        let imageName = data.dockerImageName.split(':');
        imageName.pop();
        this.imageName = imageName.join(':');
        this.getPublishInfo(this.imageName);
      }

      if (retryFlag == "true") {

        OnRepealAppAliOssUpload(data, (response) => {
          let res = lintAppListData(response, null, null);
        })
      }
      if (data.status == "Form upload success" ||
        data.status == "Image building" ||
        data.status == "Build iamge success" ||
        data.status == "Image registry uploading") {

        this.setState({
          isDone: false
        });

      } else {

      }
    })
  }

  /**
   * 获取部署信息
   * @param image 镜像名称
   */
  getPublishInfo = (image) => {
    getQuickPublishInfo(image).then((res) => {
      let data = res.data;
      if(!data)return;

      if (data.error_code) {
        Message.create({
          content: data.error_message,
          color: 'danger',
          duration: null
        })
      } else {
        this.setState({
          publishInfo: data
        })
      }

    })
  }

  /**
   * 设置上传完成
   * @param value
   */
  setUploadState = (value) => {
    //上传完成后更新版本列表数据
    if (value) {
      this.getVersionList(false);
    }
    this.setState({
      isDone: value
    })
  }

  /**
   * 获取版本信息
   * @param key 选中的是否是最后一个
   */
  getVersionList = (key = true) => {
    const {params} = this.props;
    GetVersionList(params.id, (response) => {
      let res = lintAppListData(response);
      let selected = {};
      let selectedIndex = 0;
      res.forEach((item, index, ary) => {
        item.key = index;
        if (key) {
          selectedIndex = ary.length - 1;
        }
        if (index === selectedIndex) {
          selected = item
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
  toggleBuildVersion = (data) => {
    return () => {
      this.setState({
        totalVersionInfo: data
      });

      if (data.status == "Form upload success" ||
        data.status == "Image building" ||
        data.status == "Build iamge success" ||
        data.status == "Image registry uploading") {

        this.setState({
          isDone: false,
        });

      } else {
        this.setState({
          isDone: true,
        });
      }
    }
  }

  /**
   * 渲染版本按钮
   * @returns {Array}
   */
  renderBuildVersion = () => {
    let {totalVersionInfo, versionListData} = this.state;

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
  handleQuickPublish = () => {
    let { publishInfo, totalVersionInfo } = this.state;
    if(!publishInfo.hasOwnProperty('app_id'))
      return Message.create({
        content: '没有部署过的应用无法一键部署，请先部署应用。',
        color: 'warning',
        duration: 4.5
      });

    quickPublish(publishInfo.app_id, `${this.imageName}:${totalVersionInfo.version}`).then((res) => {
      let data = res.data;
      if(data.error_code){
        return Message.create({
          content: data.error_message,
          color: 'danger',
          duration: null
        })
      }
      window.location.href=`/fe/appManager/index.html#/publish_detail/${publishInfo.app_id}`;
    })

  }

  /**
   * 删除版本
   * @param record
   * @param index
   * @returns {Function}
   */
  onDeleteVersion = (record, index) => {
    let {versionListData} = this.state;
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
        if (!res || res.error_code) {
          return Message.create({
            content: `删除失败: ${res.error_message}`,
            color: 'danger',
            duration: null
          })
        }

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
    this.setState({openUploadFlag: true});
  }

  /**
   * 隐藏上传应用的模态框
   */
  onHideUpload = () => {
    this.setState({openUploadFlag: false});
  }

  render() {

    let {
      params,
      location
    } = this.props;
    let {
      retryFlag,
      error_app,
      uploadNow
    } = location.query;

    let {
      data,
      isDone,
      totalVersionInfo,
      versionListData,
      publishInfo
    } = this.state;


    return (
      <Col md={12}>
        <MiroAppInfo
          data={ data }
        />
        <Col md={12} className="detail" style={{marginTop: 30, padding: '0 40px'}}>

        </Col>
      </Col>

    )
  }

}

UploadDetail.contextTypes = {
  router: PropTypes.object
};

export default UploadDetail;
