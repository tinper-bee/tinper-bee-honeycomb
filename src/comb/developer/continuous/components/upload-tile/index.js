import React, {Component, PropTypes} from 'react';
import {Tile, Switch, Col, Form, Badge, ProgressBar, Tooltip, Message, Icon} from 'tinper-bee';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import {Link} from "react-router";
import classnames from 'classnames';

import {ImageIcon} from 'components/ImageIcon';
import {formateDate} from 'components/util';

import './index.less';


function content(value) {
  return <span style={{background: '#0084ff'}}>{value}</span>
}

class UploadTile extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      uploadNow: 0,
      showUploadProgress: false,
      showDeleteUploadFlag: false,
      retryFlag: false,
    }
  }
  componentDidMount() {
    let { AppData } = this.props;

    if(AppData.status === "Timeout" || AppData.status === 'upload timeOut') {
      this.setState({
        retryFlag: true
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    let { AppData } = nextProps;

    if(AppData.status === "Timeout" || AppData.status === 'upload timeOut') {
      this.setState({
        retryFlag: true
      });
    }
  }

  renderTimeOver = (value) => {
    let title;
    if (!value){
      title = '未部署';
    }else{
      title = `最近部署时间${value}`
    }

    return (
      <Tooltip inverse className="tile-title" id="time">
        { title }
      </Tooltip>
    );
  }

  renderLastTime = (value) => {
    if (!value)
      return <Badge colors="warning" style={{padding: "2px 0"}}>未部署</Badge>;

    return content(value);

  }

  getLatestTime = (time1) => {
    if (!time1) return false;

    let currentTimeStamp = new Date().getTime();
    let diffTimeStamp = currentTimeStamp - time1;
    let years;
    let months;
    let days;
    let hours;
    let minutes;
    let seconds = diffTimeStamp / 1000;
    if (seconds <= 60) {
      return seconds + "秒前";
    } else {
      minutes = seconds / 60;

    }

    if (minutes <= 60) {
      return Math.floor(minutes) + "分钟前";
    } else {
      hours = minutes / 60;
    }

    if (hours <= 24) {
      return Math.floor(hours) + "小时前";
    } else {
      days = hours / 24;
    }

    if (days <= 30) {
      return Math.floor(days) + "天前";
    } else {
      months = days / 30
    }

    if (months <= 12) {
      return Math.floor(months) + "月前";
    } else {
      years = months / 12;
      return Math.floor(years) + "年前";
    }
  }

  transCh = (state) => {
    switch (state) {
      case "Upload success" :
        return "应用构建成功";
      case "Form upload success" :
        return "应用表单上传成功";
      case "Image building" :
        return "应用镜像构建中";
      case "Build image success" :
        return "应用镜像构建成功";
      case "Image registry uploading" :
        return "应用上传镜像仓库中";
      case "Build image fail" :
        return "应用镜像构建失败";
      case "Access checkImageName fail" :
        return "访问接口失败";
      case "ImageName repeat" :
        return "应用镜像名称重复";
      case "Access uploadImageToRegistry fail" :
        return "访问接口失败";
      case "Upload fail" :
        return "应用构建失败";
      case "Timeout" :
        return "执行超时";
      case "Create App" :
        return "微服务应用";
      case "upload timeOut":
        return "构建超时，请重试";

    }
  }
  transChColor = (state) => {
    switch (state) {
      case "Upload success" :
        return "green-A400";
      case "Form upload success" :
        return "green-A400";
      case "Image building" :
        return "amber-A700";
      case "Build image success" :
        return "green-A400";
      case "Image registry uploading" :
        return "amber-A700";
      case "Build image fail" :
        return "deep-orange-A400";
      case "Access checkImageName fail" :
        return "deep-orange-A400";
      case "ImageName repeat" :
        return "deep-orange-A400";
      case "Access uploadImageToRegistry fail" :
        return "deep-orange-A400";
      case "Upload fail" :
        return "deep-orange-A400";
      case "Timeout" :
      case "upload timeOut":
        return "deep-orange-A400";
      case "Create App" :
        return "blue-500";

    }
  }

  onShowDelModal = (e) => {
    this.setState({showDeleteUploadFlag: true});
    e.stopPropagation();
  }

  handlePublic = (e) => {
    const {AppData} = this.props;
    let id = AppData.appUploadId;
    if (AppData.status === "Upload success") {
      this.context.router.push(`/publish/${id}?version=${AppData.version}`);
    }
    if (AppData.status === "Timeout" || AppData.status === "upload timeOut") {
      this.context.router.push(`/upload_detail/${id}?retryFlag=true`);
    }
    e.stopPropagation();

  }

  handlePushDetail = () => {
    const {AppData} = this.props;
    //handleDelete();
    let id = AppData.appUploadId;

    if (AppData.status === 'Build image fail' ||
      AppData.status === 'Access checkImageName fail' ||
      AppData.status === 'ImageName repeat' ||
      AppData.status === 'Access uploadImageToRegistry fail' ||
      AppData.status === "Timeout" ||
      AppData.status === "upload timeOut" ||
      AppData.status === 'Upload fail') {
      this.context.router.push(`/upload_detail/${id}?error_app=true&uploadNow=${this.state.uploadNow}`);
    } else {
      this.context.router.push(`/upload_detail/${id}`);
    }
  }

  /**
   * 渲染头
   * @param title
   * @returns {XML}
   */
  renderTitle = (title) => {
    return (
      <Tooltip inverse className="tile-title" id="title">
        { title }
      </Tooltip>
    )
  }


  render() {
    const {AppData, onShowDelModal} = this.props;
    let id = AppData.id;


    return (
      <div className="tile-container">
        <Tile className="upload-tile-new">
          <div onClick={ this.handlePushDetail} style={{cursor: 'pointer'}}>
            <div className="tile-header">
              <div className="tile-header-cage">
                {
                  ImageIcon(AppData.iconPath, 'tile-header-cage-img')
                }
              </div>
              <OverlayTrigger overlay={this.renderTitle(AppData.appName)} placement="bottom">
                <h4 className="tile-header-title">
                  {AppData.appName}
                </h4>
              </OverlayTrigger>
              <OverlayTrigger overlay={this.renderTimeOver(this.getLatestTime(AppData.publishTime))} placement="bottom">
                <span className="states">
                  <span>{this.renderLastTime(this.getLatestTime(AppData.publishTime))}</span>
                </span>
              </OverlayTrigger>
              <div className="desc">
                <span className="time">
                    <i className="cl cl-time-02"/>
                  {formateDate(AppData.createTime)}
                  </span>
              </div>
            </div>
            <div className="tile-body">
              <div className="info-row">
                <div className="info-col-2">
                  <span className="label">最新版本</span>
                  <span className="value short" title={ AppData.version }>{AppData.version}</span>
                </div>
                <div className="info-col-2">
                  <span className="label">镜像名称</span>
                  <span className="value short" title={ AppData.imageName }>{AppData.imageName}</span>
                </div>
              </div>
              <div className="info-row">
                <span className="label">最近构建</span>
                <span className="value">{`${formateDate(AppData.updateTime)}(${AppData.userName})`}</span>
                {/*<span className="label">最近部署</span>*/}
                {/*<span className="value">{formateDate(AppData.publishTime)}</span>*/}
              </div>
              <div className="info-row">
                <span className="label">应用状态</span>
                <span className={classnames("value", "states", this.transChColor(AppData.status))}>
                  {this.transCh(AppData.status)}
                </span>
              </div>

            </div>
          </div>
          <ul className="group-control">
            <li onClick={ onShowDelModal }>
              <i className="cl cl-del"/>
              删除
            </li>
            <li>
              {this.state.retryFlag ?
                (
                  <div
                    className={classnames("ipass-list-button")}
                    onClick={this.handlePublic}>
                    <Icon type="uf-sync-c-o"/>
                    重试
                  </div>
                ) : (
                  <div
                    className={classnames("ipass-list-button", {'no-allow': AppData.status != "Upload success"})}
                    onClick={this.handlePublic}>
                    <Icon type="uf-send"/>
                    部署
                  </div>
                )
              }
            </li>
          </ul>
        </Tile>
      </div>

    )
  }
}

UploadTile.contextTypes = {
  router: PropTypes.object,
}

export default UploadTile;
