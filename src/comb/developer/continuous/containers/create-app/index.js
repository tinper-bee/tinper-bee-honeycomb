import {Component, PropTypes} from 'react';
import {Row} from 'tinper-bee';
import axios from 'axios';

import Title from 'components/Title';

import {Step, CreateFormBase, CreateFormParam, CreateFormComplete} from '../../components';
import {success, err, warn} from 'components/message-util';
import {guid} from 'components/util';
import {verify} from 'lib/verification'

import {create, jumpCreate, deployApp} from 'serves/CI';

import './index.less';

class CreateApp extends Component {
  static ContextTypes = {
    router: PropTypes.object
  };

  state = {
    active: 0,
    baseData: {},
    paramData: {},
    appUploadId: '',
    message: '',
    uploadState: 'pending',
    isJump: false
  };

  /**
   * step点击
   * @param index
   */
  handleClickStep = (index) => () => {
    if (index === 0) {
      this.setState({
        uploadState: 'success'
      })
    }
    this.setState({
      active: index
    })
  }

  /**
   * 跳过
   */
  jump = () => {
    let {baseData} = this.state;
    let logid = guid();
    let iconDefault = !baseData.imageUrl;
    this.setState({
      isJump: true
    });
    let data = {
      appName: baseData.appName,
      appCode: baseData.appCode,
      version: baseData.imageVersion,
      describes: baseData.describes,
      icon: baseData.imagePath ? baseData.imageUrl : baseData.selectImg,
      env: "1",
      descFileId: baseData.uuid,
      baseImage: '',
      uploadPath: '',
      imageName: '',
      is_root_path_access: true,
      is_cover_image: false,
      appType: '',
      exposePort: '',
      cmdRun: '',
      git_flag: false,
      gitUserName: '',
      gitPassWord: '',
      gitUrl: ''
    };
    let param = `?logid=${logid}&iconDefault=${iconDefault}`;

    jumpCreate(data,param).then((res) => {
      let resData = res.data;
      if(resData.error_code){
        return this.setState({
          message: resData.error_message,
          uploadState: 'err'
        })
      }

      let formData = {
        "app_name": baseData.appName,
        "app_id": resData.appUploadId,
        "fake_id": 0,
        "parent_id": 0,
        "is_fake": true,
      };
      deployApp(formData, `?logid=${logid}`).then((resp) => {
        let respData = resp.data;
        if(respData.error_code){
          this.setState({
            message: respData.error_message,
            uploadState: 'err'
          })
        }

        this.setState({
          appUploadId: respData.id,
          uploadState: 'success'
        })

      })
    }).catch((e) => {
      this.setState({
        message: "服务器发生错误，应用创建未完成。",
        uploadState: 'err'
      })
    });

    this.handleClickStep(2)();
  }

  /**
   * 提交事件
   */
  handleSubmit = (state, isCoverImage) => {
    let {baseData} = this.state;

    let logid = guid();
    let iconDefault = !baseData.imageUrl;


    let data = {
      appName: baseData.appName,
      appCode: baseData.appCode,
      baseImage: state.selectedInv,
      version: baseData.imageVersion,
      describes: baseData.describes,
      icon: baseData.imagePath ? baseData.imageUrl : baseData.selectImg,
      uploadPath: state.appUrl,
      imageName: state.imageName,
      is_root_path_access: state.is_root_path_access,
      is_cover_image: isCoverImage,
      appType: state.appType,
      exposePort: state.exposePort,
      cmdRun: state.cmdRun,
      env: "1",
      descFileId: baseData.uuid,
      git_flag: state.gitFlag,
      gitUserName: state.gitUserName,
      gitPassWord: state.gitPassWord,
      gitUrl: state.gitUrl,
      ssh_flag: state.ssh_flag,
      idRsaPath: state.idRsaPath
    };

    if (!state.gitFlag) {
      data.gitUserName = '';
      data.gitPassWord = '';
      data.gitUrl = '';
      data.ssh_flag = false;
      data.idRsaPath = '';
    }

    let param = `?logid=${logid}&iconDefault=${iconDefault}`;

    create(data, param).then((res) => {
      let data = res.data;
      sessionStorage.setItem("uploadList", JSON.stringify(data));
      if (data.error_code) {
        this.setState({
          message: data.error_message,
          uploadState: 'err'
        })
      } else {
        this.setState({
          appUploadId: data.appUploadId,
          uploadState: 'success'
        })
      }
    })
    this.handleClickStep(2)();

  }

  /**
   * 保存基础信息
   * @param data
   */
  saveInfo = (data) => {
    let { paramData } = this.state;
    if(!paramData.imageName || paramData.imageName === ''){
      paramData.imageName = data.appCode;
    }
    this.setState({
      baseData: data,
      paramData
    });
  }

  /**
   * 保存参数配置
   * @param data
   */
  saveParam = (data) => {
    this.setState({
      paramData: data
    })
  }

  /**
   * 获取描述文件信息
   * @param data
   */
  getConfigData = (data) => {
    this.setState({
      paramData: data
    })
  }

  render() {
    let {active, baseData} = this.state;
    let path = this.props.location.query.route;
    let pathProps = {};
    if (path) {
      pathProps = {
        path: path,
        isRouter: false
      }
    }

    return (
      <div className="full-screen bg-gray">
        <Title name="创建新应用" {...pathProps} />
        <div className="create-app">
          <Step activeStep={ active } onJump={ this.jump }/>
          <div className="create-app-form">
            {
              active === 0 ? (
                <CreateFormBase
                  getConfigData={ this.getConfigData }
                  nextStep={ this.handleClickStep(1) }
                  baseData={ this.state.baseData }
                  saveInfo={ this.saveInfo }
                />
              ) : null
            }
            {
              active === 1 ? (
                <CreateFormParam
                  baseData={ baseData }
                  changeStep={ this.handleClickStep }
                  onJump={ this.jump }
                  onCreate={ this.handleSubmit }
                  saveData={ this.saveParam }
                  data={ this.state.paramData }
                />
              ) : null
            }
            {
              active === 2 ? (
                <CreateFormComplete
                  appUploadId = { this.state.appUploadId }
                  isJump = { this.state.isJump }
                  message = { this.state.message }
                  state= { this.state.uploadState }
                  goBack={ this.handleClickStep }
                />
              ) : null
            }
          </div>
        </div>
      </div>
    )
  }
}

export default CreateApp;
