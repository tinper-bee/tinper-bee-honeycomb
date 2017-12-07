
import React,{Component, PropTypes} from 'react';
import {Tile, Switch,Col,Form,Badge,Button,Icon,ProgressBar,Tooltip} from 'tinper-bee';
import { Link } from "react-router";
import {formateDate,lintAppListData,textImage, checkEmpty} from "components/util";
import {GetUploadProgress,DeleteUploadApp} from  'serves/appTile';
import DelUpload from 'components/DelUploadModal';
import classnames from 'classnames';
import {ImageIcon} from 'components/ImageIcon';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';

import {err, success} from 'components/message-util';

import './index.less';

const defaultProps = {}
class UploadTile extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            uploadNow: 0,
            showUploadProgress: false,
            showDeleteUploadFlag: false,
            retryFlag:false,
            AppData: this.props.AppData,
        }

    }
    componentWillReceiveProps(nextProps) {
      this.setState({
        showDeleteUploadFlag: false,
        AppData: nextProps.AppData,
      });

    }

    componentDidMount() {
        let AppData = this.props.AppData;

        if(AppData.status == "Form upload success" || AppData.status == "Image building" || AppData.status == "Build iamge success" || AppData.status == "Image registry uploading") {
            //this.setState({showUploadProgress:true});
            //this.getUploadProgress();
        }
  }

  componentWillUnmount() {
    window.clearInterval(this.uploadTimer);
  }

    getUploadProgress = () => {
        let { AppData } = this.props;
        let version = AppData.buildVersion.split(',').pop();

        this.uploadTimer = setInterval( () => {
            GetUploadProgress(AppData.appUploadId, version)
              .then((response) => {
              let data = response.data;
                if(data.error_code) {
                    this.setState({
                      showUploadProgress:false
                    });
                    window.clearInterval(this.uploadTimer);
                    return err(data.error_message);
                }else {

                    let curTime = new Date();
                    let creteTime = new Date(AppData.updateTime);
                    this.setState({
                      uploadNow:response.data
                    });

                    if((curTime.getTime() - creteTime.getTime())/1000/60/60 >=2) {
                        AppData.status = "Timeout";
                        this.setState({
                          retryFlag: true,
                          AppData: AppData
                        })
                        window.clearInterval(this.uploadTimer);
                        delete this.uploadTimer;
                    }
                }
            }).catch(function(e) {
                console.log(e);
                window.clearInterval(this.uploadTimer);
            })
        },2000)

    }


  getLatestTime = (time1) => {
    if (!time1) return <Badge colors="warning" style={{padding: "2px 0"}}>未部署</Badge>;
    var currentTimeStamp = new Date().getTime();
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

  // getLatestTime(time1) {
  //   var myDate = new Date();
  //   let currentY = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
  //   let currentM = myDate.getMonth()+1; //获取当前月份(0-11,0代表1月)
  //   let currentD = myDate.getDate(); //获取当前日(1-31)
  //   let currentH = myDate.getHours(); //获取当前小时数(0-23)
  //   let currentMu = myDate.getMinutes(); //获取当前分钟数(0-59)
  //   let currentS = myDate.getSeconds(); //获取当前秒数(0-59)

  //   try{
  //     let date = formateDate(time1);
  //     let timeArray1 = date.split('-');
  //     let timeArray2 = timeArray1[2].split(" ");
  //     let timeArray3 = timeArray2[1].split(":");

  //     timeArray1.length = timeArray1.length - 1;
  //     timeArray2.length = timeArray2.length - 1;

  //     Array.prototype.push.apply(timeArray1,timeArray2,timeArray3);
  //     Array.prototype.push.apply(timeArray1,timeArray3);

  //     //年相差大于1 或者 年相差为1 月相差大于0
  //     if((Number(timeArray1[0]) - Number(currentY)>1 || ((Number(timeArray1[0]) - Number(currentY)==1) && Number(timeArray1[1]) > Number(currentM)) {
  //         return <span className="badge-time">{(currentY-timeArray1[0])+ "年前"}</span>
  //     }else {
  //       return <span className="badge-time">{(currentM-timeArray1[1]+12)+ "个月前"}</span>
  //     }

  //     //月相差大于1 或者 月相差为1 日相差大于0
  //     if((Number(timeArray1[1]) - Number(currentM)>1 || ((Number(timeArray1[1]) - Number(currentM)==1) && Number(timeArray1[2]) > Number(currentD)) {
  //         return <span className="badge-time">{(currentM-timeArray1[0])+ "个月前"}</span>
  //     }else {
  //         return <span className="badge-time">{(currentD-timeArray1[2]+30)+ "天前"}</span>
  //     }

  //     //日相差大于1 或者 日相差为1 时相差大于0
  //     if((Number(timeArray1[2]) - Number(currentD)>1 || ((Number(timeArray1[2]) - Number(currentD)==1) && Number(timeArray1[3]) > Number(currentD)) {
  //         return <span className="badge-time">{(currentM-timeArray1[0])+ "个月前"}</span>
  //     }else {
  //         return <span className="badge-time">{(currentD-timeArray1[2]+30)+ "天前"}</span>
  //     }

  //     if(Number(timeArray1[1]) != Number(currentM) && Number(timeArray1[2]) >= Number(currentD)) {
  //         return <span className="badge-time">{(currentM-timeArray1[1])+ "个月前"}</span>
  //     }

  //     if((Number(timeArray1[1]) - Number(currentM)>1) {
  //       return <span className="badge-time">{(currentM-timeArray1[1])+ "个月前"}</span>
  //     }else {

  //     }

  //     //日
  //     if(Number(timeArray1[1]) == Number(currentM) && Number(timeArray1[2]) >= Number(currentD)) {
  //       return <span className="badge-time">{(currentD-timeArray1[2])+ "天前"}</span>
  //     }
  //     if(Number(timeArray1[2]) != Number(currentD)) {

  //     }
  //     else if(Number(timeArray1[3]) != Number(currentH)) {
  //         return <span className="badge-time">{(currentH-timeArray1[3])+ "小时前"}</span>
  //     }else if(Number(timeArray1[4]) != Number(currentMu)) {
  //         return <span className="badge-time">{(currentMu-timeArray1[4])+ "分钟前"}</span>
  //     }else{
  //        return <span className="badge-time">{(currentS-timeArray1[5])+ "秒前"}</span>
  //     }
  //   }catch(e){
  //     return <Badge colors="warning" style={{ padding: "2px 0"}}>未部署</Badge>;
  //   }

  // }

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
      case "Create App":
        return "微服务应用";
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
    let self = this;
    const {AppData} = this.props;
    let id = AppData.appUploadId;
    if (AppData.status === "Upload success") {
      self.context.router.push(`/publish/${id}?version=${AppData.version}`);
    }
    if (AppData.status === "Timeout") {
      self.context.router.push(`/upload_detail/${id}?retryFlag=true`);
    }
    e.stopPropagation();

  }

  handlePushDetail = () => {
    const {AppData} = this.props;
    //handleDelete();
    let id = AppData.appUploadId;

    if (AppData.status === "Timeout") {
      this.context.router.push(`/upload_detail/${id}?error_app=true&uploadNow=${this.state.uploadNow}`);
    } else {
      this.context.router.push(`/upload_detail/${id}`);
    }
  }
  renderTitle = (title) => {
    return (
      <Tooltip inverse className="tile-title">
        { title }
      </Tooltip>
    )
  }

  render() {
    const {index, handleDelete} = this.props;
    let AppData = this.state.AppData;
    //handleDelete();
    let id = AppData.id;

    return (

      <Tile className="upload-tile" style={{width: 220}}>
        <div onClick={this.handlePushDetail}>
          <div className="tile-header">

            <div className="tile-img">
              {
                // {!AppData.iconPath && textImage(AppData.appName)}
                //
                // {AppData.iconPath && (<img src={`https:\/\/${AppData.iconPath}`} className="imgCust"/>)}
                ImageIcon(AppData.iconPath, 'head-img')
              }

            </div>
            {this.state.showUploadProgress && !isNaN(this.state.uploadNow * 100) && (
              <ProgressBar active colors={this.state.retryFlag ? "danger" : "success"} size="sm"
                           now={this.state.uploadNow * 100} label={`${this.state.uploadNow * 100}%`}/>)}

          </div>
          <div className="tile-body">
            <div style={{paddingLeft: 12}}>
              <OverlayTrigger overlay={this.renderTitle(AppData.appName)} placement="bottom">
                <h2>{AppData.appName}</h2>
              </OverlayTrigger>

              {AppData.runningStatus && (<Badge>{AppData.runningStatus}</Badge>)}
              <div className="ipass-list">
                <span className="label">最近部署</span>
                <span className="value">{this.getLatestTime(AppData.publishTime)}</span>
              </div>
              <div className="ipass-list">
                <span className="label">最新版本</span>
                <span className="value">{checkEmpty(AppData.version)}</span>
              </div>
              <div className="ipass-list">
                <span className="label">镜像名称</span>
                <span className="value">{checkEmpty(AppData.imageName)}</span>
              </div>
              <div className="ipass-list">
                <span className="label">状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态</span>
                <span
                  className={classnames("value", "states", this.transChColor(AppData.status))}>{this.transCh(AppData.status)}</span>
              </div>
              <div className="ipass-list">
                <span className="label">创建时间</span>
                <span className="value">{formateDate(AppData.createTime)}</span>
              </div>
              <div className="ipass-list">
                <span className="label">更新时间</span>
                <span className="value">{formateDate(AppData.updateTime)}</span>
              </div>
            </div>

            <div style={{width: '100%', height: 40, borderTop: '1px solid #e4e4e4', marginTop: 20, lineHeight: '40px'}}>
              <span className="del" onClick={this.onShowDelModal}><Icon type="uf-del"/></span>
              {!this.state.retryFlag && (
                <span className={classnames("ipass-list-button", {'no-allow': AppData.status != "Upload success"})}
                      onClick={this.handlePublic}>
                                        <Icon type="uf-send"/>部署
                                  </span>)}
              {this.state.retryFlag && (<span className={classnames("ipass-list-button")} onClick={this.handlePublic}>
                                        <Icon type="uf-send"/>重试
                                  </span>)}
            </div>

          </div>
        </div>
        <DelUpload onConfirmDelete={handleDelete} show={this.state.showDeleteUploadFlag}/>
      </Tile>

    )
  }
}

UploadTile.defaultProps = defaultProps;
UploadTile.contextTypes = {
  router: PropTypes.object
}

export default UploadTile;
