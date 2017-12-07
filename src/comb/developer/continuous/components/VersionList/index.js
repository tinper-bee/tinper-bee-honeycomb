import React, {
  Component
} from 'react';
import {
  Icon,
  PanelGroup,
  Panel,
  Table,
  Button,
  Popover,
  Modal,
  Popconfirm,
  Tooltip
} from 'tinper-bee';
import TimeLineModal from '../timeLine-modal';
import {
  DownloadWar
} from 'serves/appTile';
import {
  batchDelete,
  getTimeLine
} from 'serves/CI';
import imgempty from 'assets/img/taskEmpty.png';
import {
  lintAppListData,
  dataPart
} from 'components/util';
import {
  err,
  success,
  warn
} from 'components/message-util';
import OverlayTrigger from 'bee-overlay/build/OverlayTrigger';
import {
  Link
} from "react-router";
import classnames from 'classnames';
import SimpleModal from 'components/simple-modal';
import {
  handleDownload
} from 'lib/utils';

import './index.less';

class VersionList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      versionList: [],
      openUploadFlag: false,
      expandedRowKeys: [],
      showTimeLineModal: false,
      timeLineData: {},
      showDeleteModal: false,
    }
    let self = this;
    this.columns = [{
      title: '构建版本',
      dataIndex: 'buildVersion',
      key: 'buildVersion',
      render(text) {
        return `#${text}`
      }
    }, {
      title: '用户名',
      dataIndex: 'userName',
      key: 'userName'
    }, {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (text, record, rowIndex) => {

        //请求获取id，跳转页
        return (<p style={{width: 200, wordBreak: 'break-all', cursor: 'pointer'}} onClick={this.goToInfo(text,record.providerId,props.dockerImageName)}>{text}</p>)
      }
    }, {
      title: '上传时间',
      dataIndex: 'ts',
      key: 'ts',
      render(text) {
        let date = new Date(text);
        return "更新于" + dataPart(date, 'yyyy-MM-dd hh:mm:ss');
      }
    }, {
      title: '构建时间',
      dataIndex: 'ts',
      key: 'timeline',
      render: (text, rec) => {
        return (
          <div
              onClick={ this.showTimeLine(rec) }
              style={{color: '#0084ff', cursor: 'pointer'}}>
              点击查看
            </div>
        )
      }
    }, {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render(state, rec, index) {
        return self.transCh(state, rec, index);
      }
    }, {
      title: '应用包',
      dataIndex: 'uploadPath',
      key: 'uploadPath',
      render(uploadPath) {
        return uploadPath && uploadPath.slice(37);
      }
    }, {
      title: '是否源码构建',
      dataIndex: 'gitFlag',
      key: 'gitFlag',
      render(text, rec) {
        let content = (<Tooltip inverse className="tile-title">
            { rec.gitUrl }
          </Tooltip>);
        return (<OverlayTrigger overlay={content} placement="bottom">
            <div style={{color: '#0084ff', cursor: 'pointer'}}>{text ? '是' : '否'}</div>
          </OverlayTrigger>)
      }
    }, {
      title: '操作',
      dataIndex: 'oper3',
      key: 'oper3',
      render(flag, record, index) {
        let showUploadProgress = record.status == 'Image building';
        return (
          <span className={classnames('version-oper', {'version-oper-disabled': showUploadProgress})}>
                        <a title="下载包" className="log-icon"
                           onClick={showUploadProgress ? '' : handleDownload(record.uploadPath)}>
                            <i className="cl cl-cloud-download" style={{color: "#0084ff"}}/>
                        </a>
                        <Link title="发布新版本" className="log-icon"
                              to={showUploadProgress ? '' : `/publish/${record.appUploadId}?version=${record.version}`}>
                            <i className="uf uf-send" style={{color: "#0084ff"}}/>
                        </Link>
                        <Popconfirm
                          content="确认删除?"
                          placement="bottom"
                          onClose={showUploadProgress ? '' : props.onDeleteVersion(record, index)}>
                            <a title="删除该版本" className="log-icon">
                                <i className="cl cl-del" style={{color: "#0084ff"}}/>
                            </a>
                        </Popconfirm>


                    </span>
        )
      }
    }, ];
  }

  goToInfo = (text, providerId, dockerImageName) => () => {

    dockerImageName = encodeURIComponent(dockerImageName);
    window.location.href = `/fe/imagesCata/index.html#/ownercata/versioninfo/-1/${dockerImageName}`;


  }

  /**
   * 显示时间线
   */
  showTimeLine = (rec) => () => {
    this.setState({
      showTimeLineModal: true,
      timeLineData: rec
    })
  }

  /**
   * 关闭时间线显示
   */
  closeTimeLine = () => {
    this.setState({
      showTimeLineModal: false,
      timeLineData: {}
    })
  }

  transCh = (state, rec, index) => {
    let {
      retry
    } = this.props;
    if (!state) return;
    switch (state) {
      case "Upload success":
        return "应用构建成功";
      case "Form upload success":
        return "应用表单上传成功";
      case "Image building":
        return "应用镜像构建中";
      case "Build image success":
        return "应用镜像构造成功";
      case "Image registry uploading":
        return "应用上传镜像仓库中";
      case "Build image fail":
        return "应用镜像构建失败";
      case "Access checkImageName fail":
        return "访问接口失败";
      case "ImageName repeat":
        return "应用镜像名称重复";
      case "Access uploadImageToRegistry fail":
        return "访问接口失败";
      case "Upload fail":
        return "应用构建失败";
      case "Timeout":
      case 'upload timeOut':
        return (
          <div>执行超时 <Button style={{minWidth: 0}} colors="danger" size="sm" onClick={retry(rec, index)}>重试</Button></div>);

    }
  }

  /**
   * 批量删除
   */
  handleDelete = () => {
    const {
      refreshList,
      list
    } = this.props;
    this.controlModal(false)();
    batchDelete(list[0].appUploadId).then((res) => {
      let data = res.data;
      if (data.error_code) {
        return err(`${data.error_code}:${data.error_message}`)
      }
      success('删除成功。');
      refreshList && refreshList();
    })
  }

  /**
   * 控制删除模态框
   * @param state
   */
  controlModal = (state) => () => {
    this.setState({
      showDeleteModal: state
    })
  }


  render() {
    const {
      list,
      onShowUpload,
      refreshList
    } = this.props;

    return (
      <div style={{marginBottom: 40}}>
        <div>
          <div className="instance-btn-group">
            <Button
              className="instance-btn"
              onClick={ onShowUpload }
              size="sm"
              colors="primary"
              shape="squared">
              构建新版本
            </Button>
            <Button
              className="instance-btn"
              size="sm"
              shape="squared"
              colors="primary"
              onClick={this.controlModal(true)}>
              批量删除
            </Button>
            <Button
              className="instance-btn"
              size="sm"
              shape="squared"
              colors="primary"
              onClick={refreshList}>
              刷新
            </Button>
          </div>
          {
            list.length === 0 ? (
              <div className="empty-task">
                <img src={imgempty} width="200"/> <br/>
                <span>{this.state.dataLoadingText}</span>
              </div>
            ) : (
              <Table
                columns={this.columns}
                data={list}
              />
            )
          }
          <TimeLineModal
            show={ this.state.showTimeLineModal }
            onClose={ this.closeTimeLine }
            data={ this.state.timeLineData }
          />

          <SimpleModal
            title="批量删除"
            show={ this.state.showDeleteModal }
            onClose={this.controlModal(false)}
            onEnsure={this.handleDelete}>
            批量删除会保留最近构建的十个版本和第一次构建的版本，其他都会被删除，且不可恢复，你确定要删除吗？
          </SimpleModal>
        </div>
      </div>
    )
  }

}

export default VersionList;