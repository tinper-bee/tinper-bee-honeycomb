import {Component} from 'react';
import {Label, Upload, Button, Icon, FormGroup, FormControl, Col, Radio, Row, Checkbox, Select} from 'tinper-bee';
import classnames from 'classnames';

import ErrorModal from 'components/ErrorModal';
import GitEntityModal from '../git-entity-modal';

import {err, success, warn} from 'components/message-util';
import {verify} from 'lib/verification';
import {getCookie} from 'components/util';

import { verifyImage, getUploadWarInfo } from 'serves/CI';

import { DOCKER_IMAGES, APPTYPE } from '../../constant';
import { verifyIsSupportGitbuild, getNotice } from '../../utils';
import './index.less';

const Option = Select.Option;


class CreateFormParam extends Component {
  state = {
    appType: 'j2ee',
    warList: [],
    formData: {},
    imageName: '',
    is_root_path_access: true,
    cmdRun: '',
    exposePort: 8080,
    selectedInv: 'tomcat:8.0.32-jre7-alpine',
    selectedImage: 'cata',
    appUrl: '',
    warName: '',
    showProgress: false,
    warPrefix: '',
    showModal: false,
    gitFlag: false,
    gitUserName: '',
    gitPassWord: '',
    gitUrl: '',
    showGitModal: false,
  }
  warUrl = "";
  isCoverImage= false;

  componentDidMount() {
    let { data } = this.props;
    this.setState({
      ...data
    })
  }

  /**
   * 输入框绑定事件
   * @param state 当前绑定的state
   * @returns {Function}
   */
  handleValueChange = (state) => (e) => {
    this.setState({
      [state]: e.target.value
    })
  }

  /**
   * 上传应用回调函数
   * @param file 当前上传的文件
   * @param fileList 已上传文件列表
   * @returns {*} 返回false会取消上传动作
   */
  beforeUploadWar = (file, fileList) => {
    let isLt2M = true;
    if (file.size) {
      isLt2M = file.size / 1024 / 1024 < 200;
    }


    if (!isLt2M) {
      warn('请上传小于200MB的文件!');
      return isLt2M;
    }

    //同步获取上传必要信息
    return getUploadWarInfo((res) => {
      let data = JSON.parse(res);

      let formData = this.state.formData;

      formData.key = data.perfix + '${filename}';
      formData.policy = data.policy;
      formData.OSSAccessKeyId = data.accessid;
      formData.success_action_status = '200';
      formData.callback = data.callback;
      formData.signature = data.signature;
      formData.name = file.name;
      this.warUrl = data.host;
      this.setState({
        formData: formData,
        warPrefix: data.perfix,
        warName: file.name,
        showProgress: true,
      });
    });
  }


  /**
   * 上传事件监听
   * @param info 上传信息
   */
  handleUploadWar = (info) => {
    let warList = info.fileList;

    warList = warList.slice(-1);

    this.setState({
      warList
    });

    if (info.file.response) {
      if (info.file.response.Status === 'OK') {
        let prefix = this.state.warPrefix;
        let name = prefix + info.file.name;

        this.setState({
          appUrl: name,
          gitFlag: false
        });

      } else {
        err("上传失败。");
        this.setState({
          appUrl: ""
        });
      }
    }

  }


  /**
   * 校验镜像名称
   * @param callback
   */
  verifyImageName = (callback) => {
    let { baseData } = this.props;
    let { imageName } = this.state;

    let name = `dockerhub.yonyoucloud.com/${getCookie('u_providerid')}/${imageName}:${baseData.imageVersion}`;

    if (window.location.hostname === '117.78.45.139' || window.location.hostname === 'localhost') {
      name = `192.168.32.10:5001/${getCookie('u_providerid')}/${imageName}:${baseData.imageVersion}`;
    }

    verifyImage(name).then((res) => {
      let data = res.data;

      if (data.success === 'true' && !this.isCoverImage) {
        this.setState({
          showModal: true
        });
      } else {
        callback();
      }
    })
  }

  /**
   * 下拉框选取事件
   * @param state 当前设置的state
   * @returns {Function}
   */
  handleSelect = (state) => (value) => {
    if (state === 'appType') {
      this.setState({
        selectedInv: DOCKER_IMAGES[value][0].value
      });
      if(value !== 'j2ee'){
        this.setState({
          gitFlag: false
        })
      }
    }
    this.setState({
      [state]: value
    })
  }

  /**
   * 捕获checkbox的改变
   */
  handleCheckboxChange = () => {
    let { is_root_path_access } = this.state;
    this.setState({
      is_root_path_access: !is_root_path_access
    })
  }

  /**
   * 移除war包
   */
  removeWar = () => {
    this.setState({
      appUrl: "",
    });
  }

  /**
   * 创建
   */
  handleCreate = () => {
    let { appUrl, appType, is_root_path_access, imageName, gitFlag} = this.state;
    let state = this.state;
    let { onCreate, handleClickStep } = this.props;

    state.is_root_path_access = true;
    if (!gitFlag && (appUrl === "" || !appUrl)) {
      return warn("请先上传应用。");
    }

    if (!verify(imageName, 'string')) {
      return warn("镜像名称格式不正确。");
    }

    if(appType === 'java'){
      state.appType = 'j2ee';
    }

    if (appType === 'j2ee') {
      state.is_root_path_access = is_root_path_access;
    }

    let postFix = appUrl.split('.').pop();
    if(!gitFlag){
      switch(appType){
        case 'j2ee':
          if(postFix !== 'war'){
            return warn('java Web应用只能上传.war格式的应用包。')
          }
          break;
        case 'j2se':
          if(postFix !== 'jar' && postFix !== 'zip'){
            return warn('java应用只能上传.jar格式或者.zip格式的应用包。')
          }
          break;
        case 'dubbo':
          break;
        default:
          if(postFix !== 'zip' && postFix !== 'gz'){
            return warn('当前应用类型只能上传.zip格式或者.tar.gz格式的应用包。')
          }
      }
    }


    this.verifyImageName(() => {
      onCreate(state, this.isCoverImage);
    })

  }

  /**
   * 上一步
   */
  preStep = () => {
   let { saveData, changeStep } = this.props;
    saveData(this.state);
    changeStep(0)();
  }


  /**
   * 选择应用类型
   * @param value
   */
  selectBaseImage = (value) => () => {
    this.setState({
      selectedInv: value
    })
  }

  /**
   * 弹出框关闭事件，清空imagename
   */
  handleClose = () => {
    this.setState({
      showModal: false,
      imageName: '',
    });
  }

  /**
   * 确认覆盖镜像
   */
  handleEnsure = () => {
    this.setState({
      showModal: false,
    });
    this.isCoverImage = true;
    this.handleCreate();
  }

  /**
   * 控制git模态框
   */
  handleGitOpen = (value) => () => {
    this.setState({
      showGitModal: value
    })
  }

  /**
   * git模态框确认事件
   */
  handleGitEnsure = (data) => {
    this.setState({
      gitFlag: true,
      gitUserName: data.name,
      gitPassWord: data.password,
      gitUrl: data.url,
      ssh_flag: data.ssh_flag,
      idRsaPath: data.idRsaPath
    });
  }


  render() {
    let {onJump, changeStep} = this.props;

    let uploadHelper = (<div className="upload-help">{getNotice(this.state.appType)}</div>);
    let app_type = APPTYPE;
    if(this.state.gitFlag){
      uploadHelper = (<div style={{ color: '#0084ff'}}>{`已使用${this.state.gitUrl}源码构建。`}</div>);
      app_type = APPTYPE.filter((item) => {
        return verifyIsSupportGitbuild(item.value)
      });
    }

    return (
      <div className="create-form-param">
        <div className="create-form-item">
          <Label>上传应用 <span className="separator">|</span>源码构建</Label>
          <div className="code-btn-group">
            <Upload
              listType="text"
              fileList={this.state.warList}
              data={this.state.formData}
              action={this.warUrl}
              onRemove={ this.removeWar }
              className="upload-attach"
              beforeUpload={ this.beforeUploadWar }
              onChange={this.handleUploadWar}>
              <Button
                colors="primary"
                shape="squared">
                <Icon type="uf-upload"/> 上传应用包
              </Button>
            </Upload>
            {
              verifyIsSupportGitbuild(this.state.appType) ? (
                <Button
                  shape="squared"
                  className="source-btn"
                  onClick={ this.handleGitOpen(true) }
                  colors="primary">
                  <Icon type="uf-treeadd"/>
                  源码构建
                </Button>
              ) : null
            }

          </div>
          {
            uploadHelper
          }
          {
            this.state.appType === 'j2ee' ? (
              <FormGroup className="root-checkbox">
                <Label>
                  <Checkbox
                    checked={this.state.is_root_path_access}
                    onChange={ this.handleCheckboxChange }
                    style={{marginRight:10}}
                  />
                  是否根目录
                </Label>
              </FormGroup>
            ) : ""
          }
          <div className="desc">
            <p>
              *如勾选即把应用访问路径设置为根目录“/”访问，
              {
                `访问路径：http://${getCookie("u_providerid")}.app.yonyoucloud.com`
              }
            </p>
          </div>
        </div>
        <div className="divier"/>
        <div className="form-item">
          <FormGroup>
            <Label>镜像名称</Label>
            <FormControl
              value={ this.state.imageName }
              onChange={ this.handleValueChange('imageName') }
              maxLength="100"
              placeholder="请输入数字、小写字母、下划线、斜线、中划线"
            />

            <span
              className="upload-help">
              {/*{`dockerhub.yyuap.com/${this.state.u_providerid}/${this.state.imageName}:${this.state.imageVersion}`}*/}
            </span>

          </FormGroup>
          <FormGroup>
            <Label>应用类型</Label>
            <Select
              value={this.state.appType}
              onChange={this.handleSelect('appType')}>
              {
                app_type.map((item) => {
                  return (
                    <Option value={item.value} key={ item.value }>{ item.name }</Option>
                  )
                })
              }

            </Select>
          </FormGroup>
          {
            this.state.appType === 'nodejs' ||
            this.state.appType === 'python' ||
            this.state.appType === 'j2se' ||
            this.state.appType === 'go' ? (
              <div>
                <FormGroup>
                  <Label>{ this.state.appType === 'go' ? '启动文件路径' : '启动命令'}</Label>
                  <textarea
                    rows="2"
                    style={{width: '100%'}}
                    value={ this.state.cmdRun }
                    placeholder={ this.state.appType === 'dubbo' ? "如果传输的是jar包，可以输入启动命令，如果是war包则无效" : ""}
                    onChange={ this.handleValueChange('cmdRun') }
                  />
                </FormGroup>
                <FormGroup>
                  <Label>代理端口</Label>
                  <FormControl
                    value={this.state.exposePort}
                    onChange={this.handleValueChange('exposePort')}/>
                </FormGroup>
              </div>
            ) : null
          }
          {
            this.state.appType === 'php' ? (
              <div>
                <FormGroup>
                  <Label>代理端口</Label>
                  <FormControl
                    value={this.state.exposePort}
                    onChange={this.handleValueChange('exposePort')}/>
                </FormGroup>
              </div>

            ) : null
          }
          {
            this.state.appType === 'dubbo' ? (
              <div>
                <FormGroup>
                  <Label>{ this.state.appType === 'go' ? '启动文件路径' : '启动命令'}</Label>
                  <textarea
                    rows="2"
                    style={{width: '100%'}}
                    value={ this.state.cmdRun }
                    placeholder={ this.state.appType === 'dubbo' ? "如果传输的是jar包，可以输入启动命令，如果是war包则无效" : ""}
                    onChange={ this.handleValueChange('cmdRun') }
                  />
                </FormGroup>
              </div>
            ) : null
          }
          {
            this.state.appType === 'j2se' ? (
              <span className="upload-help">当前应用会被部署到容器的/app目录下。</span>
            ) : null
          }
          {
            this.state.gitFlag ? (
              <span className="upload-help">源码构建目前只支持Java Web应用。</span>
            ) : null
          }
        </div>
        <div className="divier" />
        <div>
          <FormGroup>
            <Label>基础镜像</Label>
            <ul className="select">
              {
                DOCKER_IMAGES[this.state.appType].map((item) => {
                  return (
                    <li
                      key={item.value}
                      className={ classnames({"active": this.state.selectedInv === item.value})}
                      onClick={ this.selectBaseImage(item.value)}>
                      { item.name }
                    </li>
                  )
                })
              }
            </ul>
          </FormGroup>
        </div>
        <div className="divier"/>
        <div>
          <FormGroup>
            <Label>发布应用镜像</Label>
            <ul className="select">
              <li className={ classnames({"active": this.state.selectedImage === 'cata'})} value="cata">镜像仓库</li>
              <li className="disabled" value="hub">Docker Hub</li>
              <li className="disabled" value="gegisty">私有 Registy</li>
            </ul>
          </FormGroup>
        </div>
        <div className="btn-group">
          <Button shape="squared" colors="danger" className="next-btn" onClick={ this.handleCreate }>创建</Button>
          <Button shape="squared" colors="danger" className="next-btn" onClick={ onJump }>跳过</Button>
          <Button shape="squared" className="cancel-btn" onClick={ this.preStep }>上一步</Button>
        </div>
        <ErrorModal
          show={this.state.showModal}
          message={<div>镜像名称重复，是否覆盖？</div>}
          onClose={ this.handleClose }
          onEnsure={ this.handleEnsure }
        />
        <GitEntityModal
          show={ this.state.showGitModal }
          onClose={ this.handleGitOpen(false) }
          onEnsure={ this.handleGitEnsure }
        />
      </div>
    )
  }
}

export default CreateFormParam;
