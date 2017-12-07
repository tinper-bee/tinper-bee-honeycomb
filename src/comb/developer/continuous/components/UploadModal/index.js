import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import {
  Tile,
  Col,
  Form,
  FormGroup,
  FormControl,
  Label,
  Row,
  Icon,
  Radio,
  Button,
  Select,
  Message,
  Upload,
  ProgressBar,
  Popconfirm,
  Panel,
  Modal
} from 'tinper-bee';
import {Link} from 'react-router'
import {getUploadWarInfo, verifyImage, updateAppUpload, verifierWarOrJar} from 'serves/CI';

import {guid, splitParam, getCookie, lintAppListData} from 'components/util'
import {verify} from 'lib/verification'
import {ImageIcon} from 'components/ImageIcon';
import ErrorModal from 'components/ErrorModal';

import {err, success, warn} from 'components/message-util';
import {DOCKER_IMAGES} from '../../constant';
import config from 'lib/env-config';
import { getNotice, verifyIsSupportGitbuild } from '../../utils';

import './index.less';


let warUrl = "";

class UploadNewVersion extends Component {
  constructor(props, context) {
    super(props);
    this.state = {
      appName: "",
      appCode: "",
      baseImage: "",
      imageVersion: "",
      imageName: "",
      describes: "",
      selectedInv: 'tomcat:6.0.48-jre8-alpine',
      selectedImage: "cata",
      imageUrl: null,
      appUrl: "",
      formData: {},
      url: "",
      warPrefix: '',
      imgPrefix: '',
      imagePath: null,
      is_root_path_access: true,
      totalSize: 0,
      loadSize: 0,
      progress: 0,
      warName: '',
      showProgress: false,
      selectImg: 'default-png',
      showDefaultSelect: false,
      showModal: false,
      appType: 'j2ee',
      exposePort: '8080',
      cmdRun: '',
      env: "1",
      warList: [],
      imageRepeat: false,
      gitFlag: false
    };
    this.isCoverImage = false;

  }

  componentWillReceiveProps(next) {
    let time = new Date();
    this.setState({
      showModal: next.showModal,
      imageVersion: `${time.getFullYear()}${time.getMonth() + 1}${time.getDate()}${time.getHours()}${time.getMinutes()}${time.getSeconds()}`,
    });
    if('list' in next){
      this.setState({
        exposePort: next.list.exposePort,
        cmdRun: next.list.cmdRun,
      })
    }
  }

  close = () => {
    const {hideModal} = this.props;
    this.setState({
      showModal: false,
      warList: [],
      imageVersion: "",
      imageRepeat: false,
      appUrl: "",
      gitFlag: false,
    });
    this.isCoverImage = false;
    if (hideModal instanceof Function) {
      hideModal();
    }
  }
  /**
   * 校验镜像名称
   */
  verifyImageName = () => {
    const {list} = this.props;

    let name = `${config.dockerRegistryUrl}/${getCookie('u_providerid')}/${list.imageName}:${this.state.imageVersion}`;

    // let name = `dockerhub.yonyoucloud.com/${getCookie('u_providerid')}/${list.imageName}:${this.state.imageVersion}`;
    // if (window.location.hostname === '117.78.45.139' || window.location.hostname === 'localhost') {
    //   name = `192.168.32.10:5001/${getCookie('u_providerid')}/${list.imageName}:${this.state.imageVersion}`;
    // }

    verifyImage(name).then((res) => {
      let data = lintAppListData(res);

      if (data.success === 'true' && !this.isCoverImage) {
        this.setState({
          imageRepeat: true
        });
      } else {
        this.setState({
          imageRepeat: false
        });
      }
    })
  }


  /**
   * 上传应用回调函数
   * @param file 当前上传的文件
   * @param fileList 已上传文件列表
   * @returns {*} 返回false会取消上传动作
   */
  beforeUploadWar = (file, fileList) => {

    const self = this;
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
      warUrl = data.host;
      this.setState({
        formData: formData,
        warPrefix: data.perfix,
        warName: file.name,
        showProgress: true,
      });
    });
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
      })
    }

    this.setState({
      [state]: value
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
   * 上传事件监听
   * @param info 上传信息
   */
  handleUploadWar = (info) => {

    //只上传一个
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
        err("上传失败");
        this.setState({
          appUrl: ""
        });
      }
    }
  }

  verifyUpload = (appUploadId, uploadPath) => {
    return verifierWarOrJar(appUploadId, uploadPath)
      .then((res) => {
          if(res.data){
          }else{
            warn('上传包类型不一致，后续升级、回滚操作可能导致应用无法正常启动。');
          }
      })
  }

  choseWayToSubmit = () => {
    let {list} = this.props;
    if(list.appType === 'dubbo'){
      this.verifyUpload(list.appUploadId, this.state.appUrl).then(() => {
        this.handleSubmit();
      });
    }else{
      this.handleSubmit();
    }
  }


  /**
   * 提交事件
   */
  handleSubmit = () => {
    let {list, encryp} = this.props;
    const {refreshList} = this.props;
    if (!this.state.gitFlag && (this.state.appUrl === "" || !this.state.appUrl)) {
      return warn("请先上传应用。");
    }
    if (!verify(this.state.imageVersion, 'version')) {
      return warn("镜像版本格式不正确。");
    }
    if (this.state.imageRepeat) {
      return warn('请选择是否覆盖镜像。');
    }
    if(this.state.gitFlag && (!list.gitUrl || list.gitUrl === '')){
      return warn('请先到代码源页签完善代码源信息。');
    }
    let postFix = this.state.appUrl.split('.').pop();
    if(!this.state.gitFlag){
      switch(list.appType){
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


    let logid = guid();

    let param = {
      appUploadId: list.appUploadId,
      logId: logid,
      version: this.state.imageVersion,
      uploadPath: this.state.appUrl,
      appName: list.appName,
      appCode: list.appCode || this.state.appCode,
      baseImage: list.baseImage,
      describes: list.describes,
      icon: list.icon,
      imageName: list.imageName,
      is_root_path_access: list.is_root_path_access,
      is_cover_image: this.isCoverImage,
      appType: list.appType,
      exposePort: this.state.exposePort,
      cmdRun: this.state.cmdRun,
      env: list.env,
      git_flag: this.state.gitFlag,
      gitUserName: list.gitUserName,
      gitPassWord: list.gitPassWord,
      gitUrl: list.gitUrl,
      ssh_flag: list.ssh_flag,
      idRsaPath: list.idRsaPath,
    };

    this.close();

    updateAppUpload(`?encryp=${encryp}`,param).then((response) => {

      let newUploadList = lintAppListData(response, null, null);
      if (newUploadList.error_code) {
        err(newUploadList.error_message);

      } else {
        if (refreshList) {
          refreshList(0);
        }
        //self.context.router.push(`/upload_detail/${response.data.appUploadId}`);

      }
    })

  }

  /**
   * 弹出框关闭事件，清空imagename
   */
  handleClose = () => {

    this.setState({
      imageRepeat: false,
      imageVersion: '',
      gitFlag: false
    });

  }

  removeWar = () => {

    this.setState({
      appUrl: ''
    });

  }
  /**
   * 确认覆盖镜像
   */
  handleEnsure = () => {
    this.setState({
      imageRepeat: false,
    });
    this.isCoverImage = true;
  }

  /**
   * 清除镜像
   */
  clearImg = () => {
    this.setState({
      selectImg: "default-png",
      imagePath: null,
    })
  }

  /**
   * 源码构建
   */
  gitBuild = () => {
    let { list } = this.props;
    if(list.gitUrl && list.gitUrl !== ''){
      this.setState({
        gitFlag: true
      })
    }else{
      this.close();
    }
  }

  render() {

    const {list} = this.props;
    let path = this.props.location && this.props.location.query && this.props.location.query.route;

    let uploadHelper = (<div className="upload-help">{getNotice(list.appType)}</div>);
    if(this.state.gitFlag){
      uploadHelper = (<div className="upload-help">{`已使用${list.gitUrl}源码构建。`}</div>);
    }else{
      if(list.appType === 'j2ee'){
        uploadHelper = (
          <div className="upload-help">
            <p>*仅可上传类型为.war格式，并大小为不超过200MB的文件</p>
            <p>*源码构建的信息可以去代码源页签修改。</p>
          </div>
        );
      }
    }
    let popContent = (<div style={{ width: 270, wordBreak: 'break-all'}}>当前无源码信息，请去源代码页签完善信息。</div>);

    if(list.gitUrl && list.gitUrl !== ''){
       popContent = (<div style={{ width: 270, wordBreak: 'break-all'}}>{`确认使用${list.gitUrl}代码进行构建?`}</div>);

    }


    return (
      <Modal
        show={ this.state.showModal }
        backdrop="static"
        onHide={ this.close }>
        <Modal.Header>
          <Modal.Title>更新版本</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Row className="create-app-page">
            <Form horizontal style={{marginTop: 0}}>

              <Row>
                <FormGroup>
                  <Col sm={3} xs={4} className="text-right">
                    <Label>版本号</Label>
                  </Col>
                  <Col sm={6} xs={6}>
                    {
                      this.state.imageRepeat ? (
                        <Popconfirm
                          color='dark'
                          defaultOverlayShown
                          onCancel={ this.handleClose }
                          onClose={ this.handleEnsure }
                          content="镜像版本重复，是否要覆盖？">
                          <FormControl
                            placeholder="请输入版本号,例如 1.0、10.3-32bit、1.10-rc-20170301"
                            maxLength="100"
                            onBlur={ this.verifyImageName }
                            value={ this.state.imageVersion }
                            onChange={ this.handleValueChange("imageVersion")}
                          />
                        </Popconfirm>
                      ) : (
                        <FormControl
                          placeholder="请输入版本号,例如 1.0、10.3-32bit、1.10-rc-20170301"
                          maxLength="100"
                          onBlur={ this.verifyImageName }
                          value={ this.state.imageVersion }
                          onChange={ this.handleValueChange("imageVersion")}
                        />
                      )
                    }

                  </Col>
                </FormGroup>
              </Row>
              {!list.appCode &&
              (
                <Row>
                  <FormGroup>
                    <Col md={3} sm={2} className="text-right">
                      <Label>应用编码</Label>
                    </Col>
                    <Col md={6} sm={6}>
                      <FormControl
                        placeholder="请输入数字、字母、下划线、斜线、中划线"
                        maxLength="100"
                        value={ this.state.appCode }
                        onChange={ this.handleValueChange("appCode")}
                      />
                    </Col>
                  </FormGroup>
                </Row>
              )
              }
              <Row>
                <FormGroup>
                  <Col sm={3} xs={4} className="text-right">
                    <Label>应用分类</Label>
                  </Col>
                  <Col sm={9} xs={8}>
                    { list.appType === 'nodejs' && (<Label>Node应用</Label>)}
                    { list.appType === 'j2ee' && (<Label>Java Web应用</Label>)}
                    { list.appType === 'nginx' && (<Label>静态网站</Label>)}
                    { list.appType === 'python' && (<Label>Python应用</Label>)}
                    { list.appType === 'go' && (<Label>Go应用</Label>)}
                    { list.appType === 'php' && (<Label>PHP应用</Label>)}
                    { list.appType === 'dubbo' && (<Label>Dubbo应用</Label>)}
                    { list.appType === 'j2se' && (<Label>Java应用</Label>)}
                  </Col>

                </FormGroup>
              </Row>
              {
                list.appType === 'nodejs' || list.appType === 'python' || list.appType === 'j2se' || list.appType === 'go' ? (
                  <Row>
                    <FormGroup className="clearfix margin-top-20 margin-bottom-0">
                      <Col sm={3} xs={4} className="text-right">
                        <Label>{ list.appType === 'go' ? '启动文件路径' : '启动命令' }</Label>
                      </Col>
                      <Col sm={6} xs={6}>
                        <textarea
                          rows="2"
                          style={{width: '100%'}}
                          value={ this.state.cmdRun }
                          onChange={ this.handleValueChange('cmdRun') }
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup className="clearfix margin-top-20 margin-bottom-0">
                      <Col sm={3} xs={4} className="text-right">
                        <Label>代理端口</Label>
                      </Col>
                      <Col sm={6} xs={6}>
                        <FormControl
                          value={this.state.exposePort}
                          onChange={this.handleValueChange('exposePort')}/>
                      </Col>
                    </FormGroup>
                  </Row>
                ) : ""
              }
              <Row>
                <FormGroup>
                  <Col sm={3} xs={4} className="text-right">
                    <Label>应用上传</Label>
                  </Col>
                  <Col sm={6} xs={6}>
                    <Upload
                      listType="text"
                      multiple={false}
                      fileList={ this.state.warList }
                      data={this.state.formData}
                      action={warUrl}
                      className="upload-attach"
                      onRemove={ this.removeWar }
                      beforeUpload={ this.beforeUploadWar }
                      onChange={this.handleUploadWar}>
                      <Button colors="primary"
                              shape="squared">
                        <Icon type="uf-upload"/> 上传应用包
                      </Button>
                    </Upload>
                    {
                      verifyIsSupportGitbuild(list.appType) ? (
                        <Popconfirm
                          color='dark'
                          onClose={ this.gitBuild  }
                          content={popContent}>
                          <Button
                            shape="squared"
                            className="git-build"
                            colors="primary">
                            <Icon type="uf-treeadd"/>
                            源码构建
                          </Button>
                        </Popconfirm>
                      ) : null
                    }
                    {
                      uploadHelper
                    }
                  </Col>
                </FormGroup>
              </Row>

            </Form>
          </Row>
        </Modal.Body>

        <Modal.Footer className="text-center">
          <Button onClick={ this.close } shape="squared" style={{marginRight: 50}}>取消</Button>
          <Button colors="primary" shape="squared" onClick={ this.choseWayToSubmit }>确定</Button>

        </Modal.Footer>
        <ErrorModal show={this.state.showErrorModal} message={<div>镜像名称重复，是否覆盖？</div>}
                    onClose={ this.handleClose }
                    onEnsure={ this.handleEnsure }/>
      </Modal>


    )
  }
}

UploadNewVersion.contextTypes = {
  router: PropTypes.object
};

export default UploadNewVersion;
