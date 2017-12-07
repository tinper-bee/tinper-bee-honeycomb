import React, {Component, Children} from 'react';
import UploadTile from '../../components/upload-tile';
import {GetUploadList, DeleteUploadApp} from 'serves/appTile';
import {deleteAppImage} from 'serves/imageCata';
import {Message, Row} from 'tinper-bee';
import {lintAppListData} from 'components/util';
import PageLoading from 'components/loading';
import NoData from 'components/noData';
import DelUpload from 'components/DelUploadModal';

import { success, err} from 'components/message-util';
import './index.less';

class UploadList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appUploadList: [],
      showLoading: true,
      showDeleteUploadFlag: false,
      totalDeleteAppData: {},
      IsDel: true
    }
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    GetUploadList().then((response) => {
      let appList = lintAppListData(response, null, null);
      let sessionObj = {};
      if (!appList || appList.error_code) return false;

      appList.reverse().forEach(function (item, index) {
        item.key = index;
        sessionObj[item.id] = item;
      })

      this.setState({
        appUploadList: appList,
        showLoading: false
      });


      sessionStorage.setItem("uploadList", JSON.stringify(sessionObj));
    }).catch((e) => {

      this.setState({
        showLoading: false
      })
      //Message.create({content: "上传服务器出错", color: 'danger', duration: null })
    })
  }

  /**
   * 删除已上传应用
   * @returns {Function}
   */
  handleDeleteApp = () => {
    let  { totalDeleteAppData, appUploadList, IsDel } = this.state;
    console.log(totalDeleteAppData);
    if(IsDel && totalDeleteAppData.name){
      deleteAppImage(`?app_upload_id=${totalDeleteAppData.id}`, function (res) {
        console.log(res);
        let rec = res.data;
        if (rec.data.success === "false") {
          Message.create({content: rec.data.error_message, color: 'danger', duration: 4.5});
        } else {
          Message.create({content: '删除镜像成功', color: 'success', duration: 1.5});
        }
      })
    }
    DeleteUploadApp(totalDeleteAppData.id, (response) => {
      let res = lintAppListData(response, null, null);
      if (res == "OK") {
        this.getList();
        success('删除成功。');
        this.setState({
          showDeleteUploadFlag: false,
          appUploadList
        });
      }
    })
  }

  /**
   * 渲染上传列表
   * @returns {Array}
   */
  renderUploadList = () => {
    let {searchValue} = this.props;
    let appList = this.state.appUploadList;
    if (!appList || appList.length == 0) return <NoData />;
    if (searchValue !== '') {
      let reg = new RegExp(searchValue, 'ig');
      appList = appList.filter((item, index) => reg.test(item.appName));
    }
    return appList.map((item, index) => (
        <UploadTile
            onShowDelModal={ this.onShowDelModal(item.appUploadId, item.dockerImageName, item.status) }
            key={item.id}
            index={index}
            AppData={item}
            />
    )).reverse()
  }

  /**
   * 显示删除框
   * @param id

   */
  onShowDelModal = (id, name, status) => (e) => {
      this.setState({
        showDeleteUploadFlag: true,
        totalDeleteAppData: {
          id: id,//appUploadId
        //  dockerImageName: name.substring(-1,name.lastIndexOf(":")),//截取最后一个冒号前面的字符串
          name:name,//dockerImageName，微服务的空壳没有此项
          status:status
        }
      })
    e.stopPropagation();
  }

  onchangeDelImage = () => {
    let IsDel = this.state.IsDel;
    this.setState({
      IsDel: !IsDel
    });
  }

  isDelRevert = () =>{
    this.setState({
      IsDel: true
    });
  }

  render() {
    let totalDeleteAppData = this.state.totalDeleteAppData;
    return (
        <Row className="width-full">
          {
            this.renderUploadList()
          }
          <PageLoading show={ this.state.showLoading } />
          <DelUpload
              onConfirmDelete={this.handleDeleteApp }
              show={this.state.showDeleteUploadFlag}
              IsDelImage={this.state.IsDel}
              onchangeDelImage={this.onchangeDelImage}
              isHasImage={!!totalDeleteAppData.name}
              isMicroService={totalDeleteAppData.status === "Create App"}
              isDelRevert={this.isDelRevert}
              />
        </Row>
    )
  }
}

export default UploadList;
